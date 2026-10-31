# Solicitudes pendientes

Como no hay pago en línea, el papá **envía una solicitud** y la casa la confirma. La pregunta es: **mientras la casa no responde, ¿ese cupo sigue disponible para otros papás?**

Es la decisión más importante de la disponibilidad que falta definir.

## Opciones

| Opción | Quién la usa | Ventaja | Problema |
|---|---|---|---|
| **A. No ocupa cupo** | Varios marketplaces de espacios | La casa elige entre varias solicitudes para el mismo bloque | El papá ve "disponible", envía la solicitud y después lo rechazan porque eligieron a otro |
| **B. Ocupa cupo sin plazo** | Airbnb: bloquea las fechas apenas llega la solicitud y pide responder en 24 horas | Simple. El primero que pide queda con la fecha | Si la casa no responde, la fecha queda tomada. En Airbnb la fecha sigue bloqueada aunque la solicitud venza, y el anfitrión tiene que liberarla a mano |
| **C. Ocupa cupo con plazo** | Muchos sistemas de reserva con aprobación | El primero que pide queda con la fecha y nada queda trabado | Hay que definir el plazo |

## Propuesta: opción C, con 48 horas de plazo

- Al llegar, la solicitud queda **pendiente** y ocupa el cupo.
- La casa tiene **48 horas** para confirmarla o rechazarla.
- **Confirmada:** sigue ocupando el cupo.
- **Rechazada:** libera el cupo de inmediato.
- **Vencida** (nadie respondió en 48 horas): deja de ocupar el cupo.

### Cómo vence sin tareas programadas

No hace falta un proceso que corra cada cierto tiempo para liberar cupos. Basta con que el cálculo cuente como ocupadas:

- las solicitudes **confirmadas**, y
- las solicitudes **pendientes creadas hace menos de 48 horas**.

Una pendiente vieja deja de contar sola. En el panel se muestra como "vencida", y la casa todavía puede confirmarla **si el cupo sigue libre**.

### Qué ve el papá

| Estado del bloque | Qué se muestra |
|---|---|
| Con cupos libres | Disponible |
| Ocupado solo por pendientes | "En espera" (alguien ya lo pidió). Se puede dejar como opción para que el papá pida igual y quede en lista de espera |
| Ocupado por confirmadas | No disponible |

En el MVP basta con "disponible" y "no disponible". "En espera" y la lista de espera pueden venir después.

## Avisos relacionados

- **A la casa:** nueva solicitud (ya está en el [alcance del MVP](../01-decisiones-base/02-alcance-mvp.md#avisos-por-correo)). Se puede sumar un recordatorio cuando queden pocas horas para que venza.
- **Al papá:** si la solicitud vence, avisarle que puede elegir otra fecha.

## Por validar en el piloto

- [ ] ¿Las casas prefieren "el primero que pide" o elegir entre varias solicitudes?
- [ ] ¿48 horas es razonable o es mucho? (Airbnb pide 24)
- [ ] ¿Quieren que las solicitudes vencidas se rechacen solas o confirmarlas igual si el cupo sigue libre?

Si las casas prefieren elegir, se puede ofrecer como opción por negocio: "las solicitudes pendientes ocupan el cupo: sí / no".

## Fuentes

- [Airbnb – Qué hacer al recibir una solicitud de reserva](https://www.airbnb.com/help/article/28/what-do-i-do-after-i-receive-a-reservation-request:)
- [Comunidad Airbnb – ¿Se bloquean los días durante una solicitud?](https://community.withairbnb.com/t5/Community-cafe/Are-days-blocked-during-a-booking-request/m-p/1417516)
