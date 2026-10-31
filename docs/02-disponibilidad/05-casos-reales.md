# Casos reales

Afiches y listas de precios de casas reales, usados para probar el modelo. **Los precios no importan para la lógica**: cada casa los define y cambian seguido (ej. promociones de temporada). Lo que importa es **cómo organizan sus horarios y paquetes**.

## Casas revisadas

| Casa | Qué muestra |
|---|---|
| **Casa A** (afiche morado) | 1 salón. Bloques de 3 y 4 horas que se cruzan. Bloques distintos de lunes a jueves y de viernes a domingo + festivos. Un bloque termina a las 00:00 |
| **Casa B** (3 opciones, fondo verde) | Paquetes de 4 y 5 horas. Capacidad de 40 o 50 **personas** según el paquete |
| **Casa C** (promo Halloween) | Agrupa los días como lunes a viernes y sábado-domingo. Precio de temporada |
| **Curvy Park** (PDF "packs 2027") | 1 salón de 300 m², 3 bloques de 4 horas, **se entrega 30 minutos antes**, un bloque de **22:00 a 02:00**. Capacidad 100 personas y 30 estacionamientos. 5 paquetes con opciones a elegir |

## Qué aprendimos y cómo se ajusta el modelo

### 1. Los bloques de un mismo salón se cruzan

Casa A, sábado:

```
            10   11   12   13   14   15   16   17   18   19   20   21   22
4 horas     [====== 10–14 ======]          [====== 16–20 ======]
3 horas     [=== 10–13 ===]          [=== 15–18 ===]     [=== 19–22 ===]
```

Si se pide 15:00–18:00, ya no se puede vender 16:00–20:00.

**Ajuste:** los cupos no se cuentan por bloque, sino por **horario que se cruza**. Un bloque está ocupado si el salón ya tiene una solicitud cuyo horario se cruza con el suyo. Ver [modelo](02-modelo-para-funplace.md#horario-ocupado-y-cruces).

### 2. Cada casa agrupa los días a su manera

- Casa A y Curvy Park: lunes a jueves / viernes a domingo + festivos
- Casa C: lunes a viernes / sábado y domingo

**Ajuste:** un bloque se aplica a **varios días de la semana** a la vez. En el panel se crea una vez ("lunes a jueves: 10:00–13:00") y no se repite día por día.

### 3. Los festivos

"Viernes a domingo **y festivos**": en un feriado, la casa usa el horario de fin de semana.

**Ajuste:**
- Tabla de **feriados de Chile**, cargada una vez al año.
- Cada negocio elige cómo se tratan los festivos: **como día normal** o **como domingo**. Así no hay que crear bloques especiales para los feriados.

### 4. Bloques que pasan la medianoche

Curvy Park: 22:00 a 02:00. Casa A: 20:00 a 00:00.

**Ajuste:** el bloque se guarda como **hora de inicio + duración** (ej. 22:00 + 240 minutos), no como inicio y término. La solicitud guarda inicio y término completos (fecha y hora), así que un evento del sábado puede terminar el domingo. El tipo de día lo define la **fecha de inicio**.

### 5. Se entrega antes de la hora

Curvy Park entrega el salón 30 minutos antes de cada bloque. El salón está ocupado de 9:30 a 14:00, no de 10:00 a 14:00.

**Ajuste:** cada bloque tiene **minutos antes** y **minutos después** (para limpieza), opcionales. El cruce se calcula con el horario ocupado completo. Al papá se le muestra: "10:00 a 14:00 · se entrega 9:30".

Es la misma idea que el tiempo libre de Cal.com (ver [cómo lo hacen otros](01-como-lo-hacen-otros.md#1-horario-de-trabajo-y-horas-calculadas)).

### 6. Los paquetes definen la duración

Casa B: las opciones 1 y 2 son de 4 horas y la opción 3 es de 5 horas. Curvy Park: todos sus paquetes son de 4 horas.

**Ajuste:** el paquete tiene una **duración opcional**. Si la tiene, al elegirlo solo se muestran los bloques de esa duración. Si no, sirve para cualquier bloque.

La casa también indica si se puede reservar **solo el espacio**, sin paquete (Curvy Park lo permite: "arriendo de salón por bloque horario").

### 7. Opciones a elegir dentro del paquete

Curvy Park:
- **Pack Básico:** 1 dulce (algodón o palomitas) y 1 salado (completos o pizza)
- **Pack Top:** 2 dulces y 3 salados, con más opciones (papas fritas, hamburguesas)
- **Decoración:** temática a elección
- **Personaje:** de una lista (Elsa, Spiderman, Bluey…)

**Ajuste propuesto:** cada paquete puede tener **grupos de opciones**: nombre del grupo, cuántas se eligen (mínimo y máximo) y la lista de opciones. Ejemplo: "Salados: elige 2 de [completos, pizza, papas fritas]". Más un campo libre de **temática**.

Sin precios, es simple de construir, y evita varios mensajes de ida y vuelta por WhatsApp. En el panel conviene un botón **"duplicar paquete"**, porque los paquetes se parecen mucho entre sí.

### 8. Capacidad: personas y niños

- **Salón:** capacidad máxima de personas (Curvy Park: 100).
- **Paquete:** cuántas personas o niños incluye (Casa B: 40 o 50 personas; Curvy Park: animación hasta 25 o 30 niños).

**Ajuste:** el formulario pide **número de niños y de adultos**. Si se pasa de la capacidad, se muestra un **aviso**, no se bloquea. La casa decide. La capacidad no afecta la disponibilidad.

### 9. Precios informativos

Los precios cambian por tipo de día, por temporada (promo Halloween) y por año ("packs 2027").

**Decisión:** en el MVP, el precio es **solo informativo y opcional**. La casa lo escribe en el bloque o en el paquete. FunPlace no calcula totales ni descuentos.

Opcional y barato de agregar: **vigencia** del paquete (desde y hasta), para promociones de temporada.

### 10. Datos del lugar

Curvy Park destaca m², estacionamientos y "multiespacio natural". Casa B destaca la piscina.

**Para después:** características del lugar (estacionamiento, piscina, áreas verdes, m²) y edad recomendada por paquete (Pack Virtual: desde 8 años). Servirán como filtros del buscador.

## Preguntas para el piloto

- [ ] ¿Las casas quieren que el papá elija las opciones del paquete en el formulario, o prefieren coordinarlo por WhatsApp?
- [ ] ¿Cuánto tiempo de limpieza necesitan entre bloques?
- [ ] ¿Alguna casa tiene más de un salón? (las revisadas hasta ahora tienen 1)
