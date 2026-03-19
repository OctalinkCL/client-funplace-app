import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { Resend } from "https://esm.sh/resend@4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const resend = new Resend(Deno.env.get("RESEND_API_KEY")!);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

type EmailEvent = "created" | "confirmed" | "cancelled";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response("Method not allowed", {
      status: 405,
      headers: corsHeaders,
    });
  }

  const { bookingId, event } = (await req.json()) as {
    bookingId: string;
    event: EmailEvent;
  };

  if (!bookingId || !event) {
    return new Response("Missing bookingId or event", { status: 400 });
  }

  // Fetch booking with space and admin info
  const { data: booking, error } = await supabase
    .from("bookings")
    .select(
      `
      id, date, block_name, start_time, end_time,
      customer_name, customer_email, customer_phone, notes,
      spaces (title, admin_id,
        profiles:admin_id (full_name)
      )
    `,
    )
    .eq("id", bookingId)
    .single();

  if (error || !booking) {
    console.error("Booking not found:", error);
    return new Response("Booking not found", { status: 404 });
  }

  const space = booking.spaces as any;
  const adminProfile = space?.profiles as any;
  const spaceTitle = escapeHtml(space?.title ?? "el espacio");
  const customerName = escapeHtml(booking.customer_name);
  const customerEmail = escapeHtml(booking.customer_email);
  const customerPhone = booking.customer_phone ? escapeHtml(booking.customer_phone) : null;
  const customerNotes = booking.notes ? escapeHtml(booking.notes) : null;
  const blockName = escapeHtml(booking.block_name);
  const formattedDate = new Date(
    booking.date + "T12:00:00Z",
  ).toLocaleDateString("es-CL", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  const timeRange = `${booking.start_time.slice(0, 5)} – ${booking.end_time.slice(0, 5)}`;

  // Get admin email
  const { data: adminUser } = await supabase.auth.admin.getUserById(
    space.admin_id,
  );
  const adminEmail = adminUser?.user?.email;

  const FROM = "Funplace <hola@octalink.cl>";

  try {
    if (event === "created") {
      // Email to admin
      if (adminEmail) {
        await resend.emails.send({
          from: FROM,
          to: adminEmail,
          subject: `Nueva reserva — ${spaceTitle}`,
          html: `
            <h2>Nueva solicitud de reserva</h2>
            <p><strong>Espacio:</strong> ${spaceTitle}</p>
            <p><strong>Fecha:</strong> ${formattedDate}</p>
            <p><strong>Horario:</strong> ${blockName} (${timeRange})</p>
            <hr />
            <p><strong>Cliente:</strong> ${customerName}</p>
            <p><strong>Email:</strong> ${customerEmail}</p>
            ${customerPhone ? `<p><strong>Teléfono:</strong> ${customerPhone}</p>` : ""}
            ${customerNotes ? `<p><strong>Notas:</strong> ${customerNotes}</p>` : ""}
            <p>Ingresa a tu panel para confirmar o cancelar la reserva.</p>
          `,
        });
      }

      // Confirmation to customer
      await resend.emails.send({
        from: FROM,
        to: booking.customer_email,
        subject: `Solicitud recibida — ${spaceTitle}`,
        html: `
          <h2>¡Recibimos tu solicitud!</h2>
          <p>Hola ${customerName}, tu solicitud de reserva fue enviada correctamente.</p>
          <p><strong>Espacio:</strong> ${spaceTitle}</p>
          <p><strong>Fecha:</strong> ${formattedDate}</p>
          <p><strong>Horario:</strong> ${blockName} (${timeRange})</p>
          <hr />
          <p>El administrador revisará tu solicitud y se pondrá en contacto contigo para coordinar el pago y confirmar la reserva.</p>
        `,
      });
    }

    if (event === "confirmed") {
      await resend.emails.send({
        from: FROM,
        to: booking.customer_email,
        subject: `Reserva confirmada — ${spaceTitle}`,
        html: `
          <h2>¡Tu reserva fue confirmada!</h2>
          <p>Hola ${customerName}, tu reserva quedó confirmada.</p>
          <p><strong>Espacio:</strong> ${spaceTitle}</p>
          <p><strong>Fecha:</strong> ${formattedDate}</p>
          <p><strong>Horario:</strong> ${blockName} (${timeRange})</p>
          <hr />
          <p>El administrador se pondrá en contacto contigo para los detalles finales del pago.</p>
        `,
      });
    }

    if (event === "cancelled") {
      await resend.emails.send({
        from: FROM,
        to: booking.customer_email,
        subject: `Reserva cancelada — ${spaceTitle}`,
        html: `
          <h2>Tu reserva fue cancelada</h2>
          <p>Hola ${customerName}, lamentamos informarte que tu reserva fue cancelada.</p>
          <p><strong>Espacio:</strong> ${spaceTitle}</p>
          <p><strong>Fecha:</strong> ${formattedDate}</p>
          <p><strong>Horario:</strong> ${blockName} (${timeRange})</p>
          <hr />
          <p>Si tienes dudas, contacta directamente al administrador del espacio.</p>
        `,
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (err) {
    console.error("Resend error:", err);
    return new Response("Email send failed", {
      status: 500,
      headers: corsHeaders,
    });
  }
});
