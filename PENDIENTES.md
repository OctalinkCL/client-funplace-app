# Pendientes — Cierre de Plataforma (Flujos, Validaciones y Seguridad)

> Borrar cada item una vez resuelto. Ordenados por prioridad de implementación.
> UI/UX queda para una etapa posterior — este listado es solo funcionalidad y seguridad.

---

## 🔴 Crítico

- [x] **Bookings / DB** — Sin constraint único en `bookings(space_id, block_id, date)`: overbooking posible con tráfico concurrente. Fix: índice único parcial excluyendo `status = 'CANCELLED'` + capturar error `23505` en frontend con mensaje claro.
- [x] **Bookings / Service** — `updateStatus()` acepta cualquier transición de estado (ej. `CANCELLED → CONFIRMED`). Fix: máquina de estados + chequeo de conflicto para reactivar + botón "Reactivar" en ambas vistas admin.

## 🟠 Alto

- [x] **Auth** — Verificar que `autoRefreshToken: true` esté en `createClient`. Ya era el default del SDK — ahora declarado explícitamente en `src/lib/supabase.ts`.
- [x] **Bookings / Public** — `BookingFormView` acepta fechas pasadas vía `?date=` en URL. Fix: validar `date >= hoy` en `onMounted`.
- [x] **Bookings / Public** — `?blockId=` y `?date=` no se validan. Ya estaba resuelto: `isValidDate` + `isValidUUID` en `onMounted`.
- [x] **Edge Function** — `send-booking-email` protegida con shared secret en header `x-internal-secret`. CORS actualizado para permitir el header.

## 🟡 Medio

- [x] **Spaces / Form** — `capacity` y `size_m2` validados en `useSpaceForm.ts` y `BasicInfoSection.vue`. Inputs ya tenían `min="1"`.
- [x] **Spaces / Service** — Error de slug duplicado ya capturado en `useSpaceForm.ts` líneas 74-75.
- [x] **Bookings / Admin** — Fallo de `sendBookingEmail()` es silencioso. Fix: mostrar warning al admin "La reserva se actualizó pero no se pudo enviar el email de notificación".
- [ ] **Availability / DB** — Sin constraint `end_time > start_time` en `time_blocks`. Fix: `ALTER TABLE time_blocks ADD CONSTRAINT time_blocks_valid_range CHECK (end_time > start_time)`.
- [x] **Auth** — Redirect param en login solo chequea prefijo `/admin`. Fix: usar `URL` API para validar que `origin === window.location.origin` y que el pathname empiece con `/admin`.

## 🟢 Bajo

- [x] **Auth** — `SetupAccountView` solo requiere 8 caracteres sin validación de complejidad. Fix: mínimo 1 número + 1 mayúscula (también configurable en Supabase Dashboard → Auth Settings).

---

## Checklist de verificación antes de lanzar

- [ ] Doble reserva: abrir dos tabs, seleccionar el mismo slot, submitear casi simultáneamente → debe rechazar la segunda.
- [ ] Sesión expirada: dejar tab abierto 61 min, intentar acción admin → debe redirigir al login o refrescar silenciosamente.
- [ ] Fechas pasadas: navegar a `/espacios/xxx/reservar?date=2020-01-01&blockId=xxx` → debe redirigir.
- [ ] Transiciones inválidas: cancelar una reserva y luego intentar confirmarla → debe retornar error.
- [ ] Email fallido: desactivar Resend, crear reserva → admin ve warning y la reserva existe igualmente.
