# Cuidados técnicos

Completa los cuidados que ya están en el [stack técnico](../01-decisiones-base/03-stack-tecnico.md#cuidados-técnicos-desde-el-día-uno).

## Reservas dobles

La solicitud se crea con una **función de Postgres**, en un solo paso:

1. **Bloquear la fila del espacio** (`SELECT … FOR UPDATE`). Si llega otra solicitud para el mismo espacio al mismo tiempo, espera a que termine la primera.
2. **Revisar las 4 capas** del [cálculo](02-modelo-para-funplace.md#cómo-se-calcula): bloque válido ese día, fecha no bloqueada, anticipación y cupos.
3. **Contar las solicitudes del espacio cuyo horario ocupado se cruza** con el del bloque pedido (confirmadas + pendientes con menos de 48 horas). Con rangos de Postgres es una sola condición: `tsrange(ocupa_desde, ocupa_hasta) && tsrange(:desde, :hasta)`.
4. Si alcanza, **guardar la solicitud**. Si no, devolver un error claro ("este horario se acaba de ocupar").

Funciona igual con cantidad 1 o cantidad 3.

**Confirmar también revisa los cupos:** al confirmar una solicitud vencida, la función vuelve a contar, por si otra solicitud ocupó el cupo entretanto.

**Alternativa descartada por ahora:** una restricción de exclusión de Postgres (`EXCLUDE USING gist`) impide que dos reservas se crucen, pero solo sirve para cantidad 1. Bloquear y contar sirve para ambos casos. Un índice GiST sobre el horario ocupado sí conviene, para que la búsqueda de cruces sea rápida.

## Zona horaria

- Los bloques se guardan como **hora local**: `time` (16:00) + duración en minutos + días de la semana. Así un bloque de 22:00 a 02:00 no tiene una hora de término "menor" que la de inicio.
- Las solicitudes guardan inicio, término y horario ocupado como `timestamp` local (fecha y hora, sin zona), porque pueden terminar al día siguiente.
- **Cambio de hora en Chile:** ocurre a la medianoche de un sábado. Un bloque de 22:00 a 02:00 esa noche dura en realidad 3 o 5 horas. Al guardar hora local, se sigue mostrando "22:00 a 02:00", que es lo que la casa espera. Se acepta como caso borde, dos veces al año.
- La zona del negocio queda explícita: `America/Santiago`. Cal.com hace lo mismo: cada horario tiene su propia zona.
- **No guardar los bloques como un instante en UTC.** "16:00 en Chile" equivale a una hora UTC distinta en verano y en invierno. Guardado como hora local, el cambio de hora no lo mueve.
- Solo se convierte a instante (`timestamptz`) cuando hace falta comparar con "ahora", por ejemplo para la anticipación mínima o el plazo de 48 horas.

## Consultas del calendario público

La página pública (`funplace.cl/lugares/slug` o `funplace.cl/servicios/slug`) necesita 2 consultas:

| Consulta | Para qué | Devuelve |
|---|---|---|
| **Mes** | Pintar el calendario | Por cada día del mes: si tiene algún bloque libre |
| **Día** | Al tocar una fecha | Cada bloque con su espacio y sus cupos libres |

Ambas usan la misma función de Postgres (ej. `disponibilidad(negocio, desde, hasta)`) para que el cálculo esté en **un solo lugar**. Así, lo que ve el papá y lo que revisa la base de datos al guardar no se contradicen.

La lógica se puede repetir en `packages/shared` solo para mostrar cosas en pantalla. **La que manda es la de la base de datos.**

## Datos que se necesitan

Resumen para el modelo de datos (pendiente en [pendientes](../01-decisiones-base/05-pendientes.md#técnico)):

| Tabla | Campos clave para la disponibilidad |
|---|---|
| Negocios | Zona horaria, anticipación mínima, máximo hacia adelante, horas de plazo para responder, festivos como (normal o domingo), permite solo espacio |
| Espacios o unidades | Negocio, nombre, cantidad, capacidad de personas |
| Bloques | Espacio, días de la semana (lista), hora de inicio, duración en minutos, minutos antes, minutos después, precio informativo, activo |
| Feriados | Fecha, nombre (común a todos los negocios) |
| Fechas bloqueadas | Negocio, espacio (opcional), desde, hasta, motivo |
| Paquetes | Negocio, nombre, descripción, duración (opcional), capacidad, precio informativo, vigente desde y hasta (opcional) |
| Grupos de opciones | Paquete, nombre, mínimo, máximo, opciones |
| Solicitudes | Espacio, bloque, paquete, opciones elegidas, temática, niños, adultos, inicio, término, ocupa desde, ocupa hasta, cantidad, estado, fecha de creación |

Estados de una solicitud: `pendiente`, `confirmada`, `rechazada`, `cancelada`. "Vencida" no se guarda: es una pendiente con más de 48 horas.
