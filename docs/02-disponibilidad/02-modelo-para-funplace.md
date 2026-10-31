# Modelo para FunPlace

## Decisión: bloques fijos con cupo para todo en el MVP

| Negocio | Espacio o unidad | Cantidad | Bloques |
|---|---|---|---|
| Casa con 1 salón | Salón | 1 | Ej. sábado 11:00–14:00 y 16:00–19:00 |
| Casa Pro con 3 salones | Cada salón por separado | 1 cada uno | Cada salón con sus bloques |
| Proveedora de carritos | Carrito | 3 | Ej. sábado 12:00–16:00 |

Así se cumple lo acordado en las [decisiones base](../01-decisiones-base/03-stack-tecnico.md): **la misma lógica sirve para cantidad 1 y cantidad 3**.

**Más adelante:** si los servicios a domicilio necesitan que el papá elija la hora libremente, solo ellos pasan al modelo de inventario con tiempo de traslado (ver [cómo lo hacen otros](01-como-lo-hacen-otros.md#3-inventario-por-cantidad-en-un-rango-de-tiempo)). Las casas siguen igual.

## Cómo se calcula

Para cada fecha, bloque y espacio se aplican estas capas **en este orden**:

| # | Capa | Pregunta | Si la respuesta es "no" |
|---|---|---|---|
| 1 | Regla semanal | ¿Este espacio tiene este bloque ese día de la semana? (si la fecha es feriado, según cómo trate los festivos el negocio: como día normal o como domingo) | No existe |
| 2 | Fechas bloqueadas | ¿La fecha (o el espacio ese día) está libre de bloqueos? | No disponible |
| 3 | Anticipación | ¿Está entre la anticipación mínima y el máximo hacia adelante? | No se muestra |
| 4 | Cupos | ¿`cantidad − solicitudes cuyo horario ocupado se cruza con el del bloque` es mayor que 0? | Lleno |

Si pasa las 4 capas, el bloque se muestra con sus cupos libres.

### Horario ocupado y cruces

Los bloques de un mismo salón se pueden cruzar. Ejemplo real (ver [casos reales](05-casos-reales.md#1-los-bloques-de-un-mismo-salón-se-cruzan)): un salón ofrece 15:00–18:00 (3 horas) y 16:00–20:00 (4 horas). Si alguien pide el primero, el segundo ya no está disponible.

Por eso los cupos **no se cuentan por bloque**, sino por horario:

```
horario ocupado = [inicio − minutos antes, término + minutos después]
```

- **Minutos antes:** ej. "se entrega 30 minutos antes".
- **Minutos después:** tiempo de limpieza.

Un bloque está ocupado si el espacio ya tiene solicitudes que ocupan cupo y cuyo horario ocupado se cruza con el suyo.

- **Cantidad 1** (salones): el cálculo es exacto.
- **Cantidad mayor** (ej. 3 carritos): se cuentan todas las solicitudes que se cruzan. Es una aproximación conservadora: nunca promete de más, aunque a veces puede mostrar lleno un bloque que tenía una unidad libre. Suficiente para el MVP.

### Bloques que pasan la medianoche

Un bloque puede ir de 22:00 a 02:00. Por eso se guarda como **hora de inicio + duración**. La solicitud guarda inicio y término con fecha y hora, así que puede terminar al día siguiente. El tipo de día (y si es feriado) lo define la **fecha de inicio**.

### Reglas de anticipación (a configurar por negocio)

| Regla | Ejemplo | Por qué |
|---|---|---|
| Anticipación mínima | 3 días | La casa necesita tiempo para preparar el cumpleaños |
| Máximo hacia adelante | 6 meses | Que nadie reserve con un año de anticipación sin que la casa tenga precios definidos |

Valores por defecto sugeridos: 3 días y 6 meses. Hay que preguntarlo en el piloto.

### Fechas bloqueadas

- Pueden bloquear **todo el negocio** (vacaciones) o **un espacio** (el salón 2 está en reparación).
- Opcional: bloquear solo un bloque de una fecha (ej. "el sábado 14 en la mañana tengo un evento privado"). Para no complicar el MVP, se puede resolver creando una reserva manual desde el panel.

## Qué se guarda y qué no

**Se guarda:**
- **Espacios o unidades** con su cantidad y su capacidad de personas
- **Bloques:** espacio, días de la semana (varios a la vez), hora de inicio, duración, minutos antes, minutos después y precio informativo opcional
- **Feriados de Chile** (tabla común a todos los negocios)
- **Fechas bloqueadas**
- **Paquetes:** duración opcional, capacidad, descripción, precio informativo opcional, vigencia opcional y grupos de opciones a elegir
- **Solicitudes:** bloque, espacio, paquete, opciones elegidas, niños, adultos, cantidad pedida, estado y **una copia del inicio y del término (fecha y hora) y del horario ocupado**

**No se guarda:**
- La lista de fechas u horas disponibles. Se calcula cada vez que se pide, igual que en Cal.com y Calendly. Así nunca queda desactualizada.

### Por qué copiar la hora en la solicitud

Si la casa cambia el bloque "16:00–19:00" por "16:30–19:30", las solicitudes que ya existen no deberían moverse. La solicitud guarda el horario que el papá vio y aceptó. El id del bloque queda como referencia.

## Varios salones (plan Casa Pro)

El papá puede:
- **Elegir el salón** (ej. "Salón Dinosaurios"), o
- **Elegir "cualquiera disponible":** el sistema asigna el primero libre. Es parecido a como Cal.com reparte citas entre varias personas de un equipo.

En el MVP basta con elegir el salón. "Cualquiera disponible" puede venir después.

## Cupo y capacidad son cosas distintas

- **Cantidad** = cuántos salones o carritos hay. Es lo que define la disponibilidad.
- **Capacidad** = cuántas personas caben (en el salón) o cuántas incluye (en el paquete). **No afecta la disponibilidad.** El formulario pide niños y adultos, y si se pasan de la capacidad se muestra un aviso, sin bloquear. La casa decide.

## Paquetes y bloques

- **Lo que se reserva es el bloque.** El paquete describe qué incluye.
- Si el paquete tiene **duración** (ej. 5 horas), al elegirlo solo se muestran los bloques de esa duración. Si no la tiene, sirve para cualquier bloque.
- La casa indica si se puede reservar **solo el espacio**, sin paquete.
- **Grupos de opciones:** cada paquete puede tener grupos como "Salados: elige 2 de [completos, pizza, papas fritas]", con mínimo y máximo, más un campo libre de temática. Ver [casos reales](05-casos-reales.md#7-opciones-a-elegir-dentro-del-paquete).

## Precios

En el MVP, los precios son **solo informativos y opcionales**: la casa los escribe en el bloque o en el paquete. FunPlace no calcula totales, recargos ni descuentos. Cada casa cambia sus precios por tipo de día, temporada o año, y eso no afecta la disponibilidad.
