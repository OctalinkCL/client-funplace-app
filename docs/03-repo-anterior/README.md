# 03 · Repo anterior: client-funplace-app

Análisis del repo que construimos entre marzo y abril de 2026 y que quedó detenido. Sirve para decidir si partimos de cero o lo continuamos.

- **Repo:** `git@github.com:OctalinkCL/client-funplace-app.git`
- **Documentación:** esta carpeta `docs/` vive dentro del repo desde el 31 de octubre de 2026
- **Último commit:** 27 de abril de 2026 (`main` y `develop` están iguales)
- **Revisado:** 31 de octubre de 2026

## Recomendación: continuar, no partir de cero

Es una app que funciona, con el mismo stack que elegimos en las [decisiones base](../01-decisiones-base/03-stack-tecnico.md) (Vue 3, shadcn-vue, Pinia, Supabase, Vercel) y casi el mismo flujo que acordamos para la [disponibilidad](../02-disponibilidad/README.md). Lo que falta son ajustes, no una reescritura.

## Flujo acordado (revisión del 31 de octubre)

Contra esto se compara el repo:

1. El papá ve el calendario, elige fecha y bloque y envía la solicitud. Solo ve **disponible** o **no disponible**.
2. La solicitud **aparta el bloque por 48 horas** (plazo fijo, no se configura).
3. La casa contacta al papá por WhatsApp, acuerdan el abono y, cuando le llega, la marca como **confirmada**. Si la rechaza, el bloque se libera de inmediato.
4. Si pasan 48 horas sin confirmar, el bloque **se libera solo**. No se envía correo; el panel la muestra como "vencida".
5. **Solo la casa cancela.** El papá le escribe a la casa.
6. La casa **anota en el panel las reservas que toma por fuera** (WhatsApp, Instagram). Cuentan como confirmadas.
7. **Máximo 2 solicitudes pendientes por teléfono** por negocio, además del captcha.

## Lo que ya resuelve

- **Dos personas pidiendo el mismo bloque a la vez:** índice único en la base de datos sobre `(espacio, bloque, fecha)` que ignora las canceladas. Postgres rechaza la segunda solicitud (error `23505`) y la pantalla muestra "este horario ya no está disponible". Es más simple que la función con bloqueo de fila que propusimos en los [cuidados técnicos](../02-disponibilidad/04-cuidados-tecnicos.md).
- **Flujo del papá:** elige fecha y bloque, envía la solicitud sin registrarse y queda pendiente.
- **Panel:**
  - Horario semanal con bloques asignados por día
  - Bloquear un bloque en una fecha
  - Crear reservas a mano (cubre las reservas de fuera)
  - Confirmar, cancelar y reactivar, con reglas de cambio de estado
- **Calendario de admin** mensual y semanal, con cambio de espacio.
- **Bandeja de reservas** con pestañas Por atender / Próximas / Historial.
- **Correos** con Resend (función de Supabase `send-booking-email`).
- La reserva **guarda una copia del horario** (inicio, término y nombre del bloque).
- Distingue **espacios y servicios** (`kind: space | service`), con formulario para servicios y zona de cobertura.
- Login solo por invitación desde Supabase.

## Lo que falta para lo acordado

| Acordado | En el repo |
|---|---|
| Se libera a las 48 h sin confirmar | No existe. "Vencida" solo significa que la fecha ya pasó |
| Máximo 2 pendientes por teléfono | No existe, y el teléfono es opcional |
| Captcha (Turnstile) | No hay |
| Anticipación mínima y máxima | No hay; solo bloquea fechas pasadas |
| Links `/lugares/slug` y `/servicios/slug` | Usa `/espacios/slug`. Cambiar la ruta es simple |
| Vista previa en WhatsApp e Instagram | No hay. `vercel.json` manda todo al `index.html` |
| Bloques que pasan la medianoche (22:00–02:00) | Prohibidos por una regla de la base de datos (`end_time > start_time`) |
| Bloques que se cruzan (Casa A) | No. Cada bloque es independiente |
| Cantidad mayor a 1 (3 carritos) | No. Cada bloque tiene cupo 1 |
| Festivos | No hay |
| Monorepo con panel en `panel.funplace.cl` | Una sola app con `/admin` |

### El índice único choca con las 48 horas

El índice no puede depender de la hora actual: una pendiente vencida seguiría trancando el bloque hasta que alguien la cancele.

**Solución simple:** una función de Postgres para crear solicitudes que, antes de guardar, marca como vencidas las pendientes de más de 48 horas de ese mismo bloque y fecha. Son unas 15 líneas y no necesita tareas programadas. El índice único se mantiene.

## Riesgos a revisar antes de seguir

1. **Las migraciones no están en el repo.** El esquema real solo vive en Supabase. El del `CLAUDE.md` está desactualizado: le faltan `kind`, `booking_number`, el índice único, los datos de contacto y más. Además, los proyectos gratis de Supabase se pausan por inactividad.
   → Revisar que el proyecto siga vivo y **exportar el esquema al repo** como migraciones.
2. **Posible fuga de datos de los papás.** La página pública lee la tabla de reservas con `select('*')`. Si en Supabase existe una regla de lectura pública, cualquiera puede ver nombre, correo y teléfono de todos los clientes. Si no existe, el calendario público no ve las reservas y muestra todo libre.
   → Revisar las reglas de `bookings` en Supabase. La página pública solo debería recibir fecha, bloque y si está ocupado.
3. **La clave secreta de los correos es pública.** `VITE_INTERNAL_SECRET` queda dentro del JavaScript que descarga el navegador, así que cualquiera puede llamar a la función de correos.
   → Disparar los correos desde la base de datos o desde el servidor, no desde el navegador.
4. **La base de datos acepta cualquier solicitud.** El insert público solo revisa que el espacio esté publicado. Se podría crear una reserva ya `CONFIRMED`, en una fecha pasada o en un bloque que no existe ese día. Las validaciones están solo en la pantalla.
   → Crear las solicitudes solo a través de la función de Postgres y quitar el insert público directo.

Los riesgos 2, 3 y 4 se resuelven con la misma función que maneja las 48 horas.

## Decisiones pendientes

- [ ] **¿Mantenemos el modelo simple del repo para el piloto?** (1 bloque = 1 reserva, sin cruces, cupo 1). Propuesta: sí. Los bloques que se cruzan se resuelven a mano: al confirmar uno, la casa bloquea el otro. La cantidad mayor a 1 queda para cuando entren los carritos.
- [ ] **¿Una sola app con `/admin` en vez de monorepo con `panel.funplace.cl`?** Propuesta: una sola app por ahora.
- [ ] Según lo anterior, actualizar [02 · Disponibilidad](../02-disponibilidad/README.md) y el [alcance del MVP](../01-decisiones-base/02-alcance-mvp.md).

## Orden sugerido para retomarlo

1. Revisar el proyecto de Supabase y exportar el esquema al repo.
2. Revisar las reglas de `bookings` (riesgo 2).
3. Función de Postgres para crear solicitudes: validaciones, 48 horas, límite por teléfono (riesgos 2 a 4).
4. Captcha en el formulario público.
5. Cambiar `/espacios/` por `/lugares/` y `/servicios/`.
6. Vista previa para WhatsApp e Instagram.
7. Piloto.

## Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-31 | Versión inicial del análisis |
