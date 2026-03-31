# Vista de Reservas — Decisiones y Trabajo Pendiente

## Problema actual
`getByAdmin()` trae **todas** las reservas sin límite. Con volumen alto (cientos/miles) esto genera lentitud en red y renderizado.

---

## Decisión: Qué trae la vista de reservas

| Status | Qué se trae | Razón |
|--------|-------------|-------|
| **PENDING** | Todo, sin límite de fecha | Son acción requerida, no pueden perderse |
| **CONFIRMED** | Desde hoy + 60 días | Las reservas futuras comprometidas |
| **CANCELLED** | No se muestran aquí | No aportan operacionalmente, van al histórico |

## Trabajo pendiente — `bookings.service.ts`

Modificar `getByAdmin()`:

```typescript
async getByAdmin(): Promise<Booking[]> {
  const todayStr = new Date().toISOString().split('T')[0]
  const future = new Date()
  future.setDate(future.getDate() + 60)
  const futureStr = future.toISOString().split('T')[0]

  const { data: pending } = await supabase
    .from('bookings')
    .select('*, spaces(id, title, slug)')
    .eq('status', 'PENDING')
    .order('created_at', { ascending: false })

  const { data: confirmed } = await supabase
    .from('bookings')
    .select('*, spaces(id, title, slug)')
    .eq('status', 'CONFIRMED')
    .gte('date', todayStr)
    .lte('date', futureStr)
    .order('date', { ascending: true })

  return [...(pending ?? []), ...(confirmed ?? [])]
}
```

## UI — Cambios en `AdminBookingsView.vue`

- Eliminar opción "Cancelado" del select de filtro de estado (ya no se muestran)
- Las métricas de conteo ajustarlas: mostrar solo **Total PENDING** y **Total CONFIRMED** visibles
- Agregar texto informativo: "Mostrando pendientes + confirmadas próximos 60 días"

---

## Histórico — Para fase futura

- Vista separada (nueva ruta `/admin/historial`)
- Selector de mes para acotar la búsqueda
- Trae todas las reservas del mes seleccionado sin distinción de estado
- Incluye CANCELLED

---

## Métricas — Para fase de estadísticas (futuro)

Tabla `booking_metrics` con trigger automático en PostgreSQL.

| admin_id | space_id | total | confirmed |
|----------|----------|-------|-----------|
| uuid-admin-1 | uuid-espacio-A | 45 | 38 |
| uuid-admin-1 | uuid-espacio-B | 12 | 10 |

- **total** = todas las solicitudes que han llegado (independiente del estado)
- **confirmed** = las procesadas/cerradas exitosamente
- Se mantiene con trigger `AFTER INSERT OR UPDATE OF status ON bookings` — zero mantenimiento desde el frontend
- Permite ver métricas globales del admin + desglose por espacio
- Implementar cuando el análisis de estadísticas para admin sea prioridad
