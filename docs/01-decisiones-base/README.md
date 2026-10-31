# 01 · Decisiones base de FunPlace

Punto de partida acordado en octubre de 2026. No está escrito en piedra: si algo cambia, se actualiza aquí y se anota en el registro de cambios al final.

## Índice

1. [Producto y negocio](01-producto-y-negocio.md): qué hacemos, para quién, dónde partimos, piloto y planes
2. [Alcance del MVP](02-alcance-mvp.md): qué entra en la primera versión y qué no
3. [Stack técnico](03-stack-tecnico.md): herramientas, estructura del proyecto y cuidados técnicos
4. [Slugs y links](04-slugs-y-links.md): formato `funplace.cl/lugares/slug`, cómo se genera y cómo se protege
5. [Pendientes](05-pendientes.md): preguntas abiertas y próximos pasos

## Resumen en 10 líneas

- **FunPlace** (`funplace.cl`): plataforma de reservas para **casas de cumpleaños** y, en una segunda etapa, **servicios para cumpleaños** (magos, animación, inflables, carritos de comida).
- Partimos en el **Gran Concepción**.
- Primera etapa: **herramienta para el negocio** (link de reservas para la bio de Instagram + panel). **Sin buscador público** todavía.
- **Sin pagos en línea:** el papá envía una solicitud, el negocio la confirma y acuerdan el pago como lo hacen hoy.
- **Piloto:** 2 casas, gratis por 2 a 3 meses, con precio fundador al terminar.
- **Planes:** Servicios $14.990 · Casa Básico $19.990 · Casa Pro $34.990 (mensual, CLP).
- **Stack:** Vue 3 + Vite + TypeScript + shadcn-vue + Pinia · Supabase · Vercel.
- **Dominios:** `funplace.cl/lugares/slug` y `funplace.cl/servicios/slug` (páginas públicas, sin ciudad ni número) y `panel.funplace.cl` (panel del negocio).
- El sistema maneja **cantidad disponible** desde el inicio (una casa con 1 salón = cantidad 1, un proveedor con 3 carritos = cantidad 3).
- El buscador se abre cuando haya unas **15 a 20 casas activas** en Concepción.

## Registro de cambios

| Fecha | Cambio |
|---|---|
| 2026-10-31 | Versión inicial |
| 2026-10-31 | Links con prefijo por tipo: `/casas/slug` y `/servicios/slug`, sin ciudad ni número. Ya no se necesita la lista de palabras reservadas |
| 2026-10-31 | Prefijo `casas` cambiado a `lugares`. Descartado dejar los lugares sin prefijo |
