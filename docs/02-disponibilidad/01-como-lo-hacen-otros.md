# Cómo lo hacen otros

Casi todas las herramientas de reservas usan uno de estos 3 modelos. Lo que cambia es **qué define el negocio** y **qué calcula el sistema**.

## 1. Horario de trabajo y horas calculadas

**Quién lo usa:** Calendly, Cal.com, Easy!Appointments, AgendaPro, Reservo.

**Qué define el negocio:**
- Un horario semanal, ej. "lunes a viernes de 9:00 a 18:00"
- Excepciones por fecha: vacaciones o un día con otro horario
- Por cada servicio:
  - **Duración:** ej. 45 minutos
  - **Cada cuánto parte una hora:** cada 30 o 60 minutos
  - **Tiempo libre antes y después** de cada cita
  - **Anticipación mínima:** ej. reservar con al menos 2 horas de aviso
  - **Hasta cuándo se puede reservar:** ej. 60 días hacia adelante

**Qué calcula el sistema:**

```
horas disponibles = horario semanal
                  − excepciones de esa fecha
                  − reservas existentes (más su tiempo libre)
                  − horas dentro de la anticipación mínima
```

Las horas disponibles **no se guardan**: se calculan cada vez que alguien abre el calendario.

**Detalle interesante de Cal.com:** al revisar si se cruza con otra cita, considera el tiempo libre de la cita existente **y** el de la nueva. Por eso una sola reunión puede ocupar más tiempo del que parece.

**Para qué sirve:** citas cortas y de duración variable (consultas, peluquería). Para casas de cumpleaños es más de lo necesario.

## 2. Bloques fijos con cupo

**Quién lo usa:** escape rooms, tours, clases, restaurantes con turnos.

**Qué define el negocio:**
- Bloques fijos por día de la semana, ej. "sábado 11:00–14:00 y 16:00–19:00"
- Cuántos cupos tiene cada bloque (salas, mesas, lugares)
- Fechas bloqueadas

**Qué calcula el sistema:**

```
cupos libres = cupos del bloque − reservas de ese bloque en esa fecha
```

**Para qué sirve:** cuando el negocio vende turnos que ya conoce. **Es lo que ya decidimos para las casas** ("bloques horarios por día de la semana" en el [alcance del MVP](../01-decisiones-base/02-alcance-mvp.md)). La limpieza queda en el espacio entre un bloque y otro.

## 3. Inventario por cantidad en un rango de tiempo

**Quién lo usa:** Booqable, Rentopian, InflatableOffice y otros programas de arriendo de equipos e inflables.

**Qué define el negocio:**
- Cuántas unidades tiene de cada cosa, ej. 3 carritos
- Tiempo extra antes y después de cada arriendo: traslado, montaje, limpieza

**Qué calcula el sistema:**

```
unidades libres = unidades totales
                − reservas que se cruzan con ese rango
                  (contando el tiempo extra de cada una)
```

**Para qué sirve:** cuando el cliente elige la hora libremente y lo que se reserva es "una de N cosas iguales". Los que hacen estos programas dicen que lo difícil **no es contar el stock, sino respetar el tiempo entre eventos**: el sistema no debe prometer un inflable que todavía viene en camino o sin limpiar.

**Para FunPlace:** útil para los **servicios a domicilio** más adelante. Un carrito que está en San Pedro de 11:00 a 14:00 no puede estar en Talcahuano a las 14:15.

## Comparación rápida

| | Horario con horas calculadas | Bloques fijos con cupo | Inventario por cantidad |
|---|---|---|---|
| El cliente elige | Cualquier hora libre | Uno de los bloques | Hora libre y cantidad |
| Duración | Variable por servicio | Fija por bloque | Variable |
| Tiempo entre eventos | Se configura | Queda entre bloques | Se configura |
| Cantidad | Normalmente 1 | Cupos por bloque | N unidades |
| Complejidad | Media | **Baja** | Media a alta |
| En FunPlace | No por ahora | **Casas y servicios en el MVP** | Servicios a domicilio, más adelante |

## Fuentes

- [Cal.com – Configurar disponibilidad](https://cal.com/help/availabilities/set-up-your-availability)
- [Cal.com – Excepciones por fecha](https://cal.com/docs/core-features/availability/date-overrides)
- [Cal.com – Tiempo libre entre eventos y anticipación mínima](https://cal.com/blog/mastering-event-level-time-limits-what-lies-beyond-buffer-times)
- [RaftLabs – Cómo construir un programa de arriendo para fiestas](https://www.raftlabs.com/blog/how-to-build-party-rental-management-software)
- [Booqable – Programa para arriendo de inflables](https://booqable.com/industries/inflatable-rental-software/)
