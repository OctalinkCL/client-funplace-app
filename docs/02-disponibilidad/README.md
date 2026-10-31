# 02 · Disponibilidad y agendamiento

Cómo calcula FunPlace qué fechas y bloques puede reservar un papá, y cómo se ocupan con las solicitudes. Se basa en cómo lo resuelven otras herramientas (Cal.com, Calendly, Airbnb y programas de arriendo de inflables) y en las [decisiones base](../01-decisiones-base/README.md).

**Estado:** propuesta (octubre de 2026). Falta validar con las casas del piloto lo de las [solicitudes pendientes](03-solicitudes-pendientes.md).

## Índice

1. [Cómo lo hacen otros](01-como-lo-hacen-otros.md): los 3 modelos de disponibilidad más comunes
2. [Modelo para FunPlace](02-modelo-para-funplace.md): bloques con cupo, cálculo en capas y qué se guarda
3. [Solicitudes pendientes](03-solicitudes-pendientes.md): si una solicitud sin confirmar ocupa el cupo o no
4. [Cuidados técnicos](04-cuidados-tecnicos.md): reservas dobles, zona horaria y consultas del calendario
5. [Casos reales](05-casos-reales.md): afiches de casas reales y los ajustes que generaron

## Resumen en 10 líneas

- Hay 3 modelos comunes: **horario con horas calculadas** (Cal.com), **bloques fijos con cupo** (escape rooms, tours) e **inventario por cantidad en un rango de tiempo** (arriendo de inflables).
- FunPlace usa **bloques fijos con cupo** para todo en el MVP: casas y servicios.
- Más adelante, los servicios a domicilio pueden pasar al modelo de inventario, con tiempo de traslado.
- La disponibilidad **se calcula, no se guarda**. Solo se guardan reglas (bloques, fechas bloqueadas) y reservas.
- El cálculo va en capas: regla semanal → fechas bloqueadas → anticipación → cupos ocupados.
- Los bloques de un salón se pueden cruzar (3 y 4 horas), así que los cupos se cuentan por **horario que se cruza**, no por bloque: `libres = cantidad − solicitudes cuyo horario ocupado se cruza`.
- Un bloque se guarda como **inicio + duración**, aplica a varios días y puede pasar la medianoche (22:00–02:00). Tiene minutos antes ("se entrega 9:30") y después (limpieza).
- Los festivos se tratan como día normal o como domingo, según el negocio. **Los precios son solo informativos.**
- Cada solicitud guarda una **copia de su inicio, término y horario ocupado**, para que un cambio de bloques no la mueva.
- Propuesta: una solicitud **pendiente ocupa el cupo por 48 horas**. Si nadie la confirma, deja de contar sola, sin tareas programadas.
- La base de datos impide las reservas dobles: bloquea el espacio, cuenta los cupos y guarda, todo en un solo paso.
- Los bloques se guardan en **hora local de Chile** (`America/Santiago`), no en UTC.

## Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-31 | Versión inicial (propuesta) |
| 2026-10-31 | Ajustes con 4 casas reales: cruces entre bloques, inicio + duración, medianoche, minutos antes y después, festivos, paquetes con duración y opciones, precios informativos |
