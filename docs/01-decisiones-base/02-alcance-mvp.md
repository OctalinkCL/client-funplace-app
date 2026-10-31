# Alcance del MVP

Primera versión: **solo link de reservas + panel**. Sin buscador público y sin pagos.

## Qué entra

### `funplace.cl` · landing

Página simple que explica el producto **a los negocios** (no a los papás), para que se sumen. Incluye un contacto o formulario para pedir acceso.

### `funplace.cl/lugares/slug` y `funplace.cl/servicios/slug` · página pública del negocio

- Fotos, descripción y ubicación (o comunas donde atiende, si es un servicio)
- Paquetes y extras con precios
- Calendario con disponibilidad real
- Formulario de solicitud: fecha, bloque, espacio o cantidad de unidades, número de niños, extras, datos del papá (nombre, teléfono, correo) y comentario
- Vista previa correcta al compartir en WhatsApp e Instagram (foto, nombre, descripción)

### `panel.funplace.cl` · panel del negocio

- Login
- Perfil del negocio: nombre, slug, fotos, descripción, dirección o comunas que cubre, WhatsApp
- **Espacios o unidades:** salones de la casa, o unidades de un servicio (ej. 3 carritos)
- **Bloques horarios:** ej. 11:00 a 14:00 y 16:00 a 19:00, por día de la semana
- **Paquetes:** nombre, precio, capacidad, duración, qué incluye
- **Extras:** carro de comida, animación, torta, etc., con precio
- Bloquear fechas (vacaciones, eventos privados)
- Indicar si la casa **acepta proveedores externos**
- **Bandeja de solicitudes:** ver, confirmar o rechazar
  - Botón para abrir WhatsApp con el mensaje listo para el papá (link `wa.me`)

### Avisos por correo

- Al papá: solicitud recibida, confirmada o rechazada
- Al negocio: nueva solicitud

## Qué no entra (todavía)

| Funcionalidad | Cuándo |
|---|---|
| Buscador público para papás | Con unas 15 a 20 casas activas |
| Pagos y abonos en línea | Etapa 3 |
| Reseñas | Junto con el buscador |
| Cobro de planes dentro del sistema | Después del piloto (mientras tanto, se cobra a mano) |
| Recordatorios automáticos por WhatsApp (API de Meta) | Plan Pro, después del piloto |
| Reportes | Plan Pro, después del piloto |
| Varios usuarios por negocio | Plan Pro, después del piloto |
| Proveedores destacados o publicidad | Con el buscador |

## Orden de construcción

1. Modelo de datos (casas y servicios, con cantidad disponible desde el inicio)
2. Panel: perfil, espacios o unidades, bloques, paquetes y extras
3. Página pública + formulario de solicitud
4. Bandeja de solicitudes + avisos por correo
5. Vista previa para WhatsApp e Instagram
6. Landing
7. Piloto con 2 casas
8. Servicios: piloto con la proveedora de carritos
