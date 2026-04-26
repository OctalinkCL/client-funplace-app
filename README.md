# Funplace

> Plataforma de reserva de espacios para eventos — casas, salas y estudios disponibles para arriendo. Sin intermediarios, sin complicaciones.

---

## Stack

| | |
|---|---|
| **Frontend** | Vue 3 + Vite + TypeScript |
| **UI** | shadcn/vue · Tailwind CSS v4 · Lucide |
| **Estado** | Pinia |
| **Backend / DB** | Supabase (PostgreSQL + RLS) |
| **Auth** | Supabase Auth (invite-only para admins) |
| **Storage** | Supabase Storage |
| **Emails** | Resend via Edge Function |
| **Deploy** | Vercel |

---

## Levantar en local

```bash
pnpm install
cp .env.example .env   # completar VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY
pnpm dev
```

---

## Actores

| Actor | Acceso |
|---|---|
| **Cliente** | Navega espacios, elige fecha/bloque, envía solicitud. Sin registro. |
| **Admin** | Panel privado — gestiona espacios, disponibilidad y reservas. |
| **Superadmin** | Gestión directa en Supabase Dashboard. Sin panel en app. |

> Los admins se crean únicamente vía **Supabase Dashboard → Authentication → Invite User**.

---

## Módulos

```
src/modules/
├── auth/          → login, recuperación de contraseña, setup de cuenta invitada
├── spaces/        → CRUD de espacios (admin) + listado y detalle (público)
├── availability/  → configuración de horario semanal y bloques horarios
└── bookings/      → flujo de reserva cliente + dashboard y calendario admin
```

---

## Variables de entorno

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_INTERNAL_SECRET=     # shared secret para Edge Function de emails
```

---

## Flujo de reserva

```
Cliente elige espacio → selecciona fecha → elige bloque → completa datos
  → Booking PENDING → Admin confirma/cancela → Email automático vía Resend
```

El pago se coordina fuera de la plataforma (transferencia, efectivo).

---

## Notas de arquitectura

- **RLS en todas las tablas** — la seguridad vive en la DB, no en el frontend.
- **Disponibilidad on-demand** — `useSlots.ts` computa slots en base a horario semanal, blocked_slots y bookings activas.
- **Amenities database-driven** — tabla `amenities` con íconos Lucide dinámicos. Agregar nuevas sin tocar código.
- **Emails** — Edge Function `send-booking-email` (Deno + Resend). Deployar con `supabase functions deploy send-booking-email`.
