# Slugs y links

## Formato del link

Cada negocio tiene un link público con un **prefijo según su tipo**:

```
funplace.cl/lugares/casa-limon
funplace.cl/servicios/carritos-ana
```

- **Sin ciudad** en el link: si el negocio se cambia de comuna, el link sigue sirviendo. La ciudad queda para las páginas del buscador.
- **Sin número ni id** al final: el link tiene que verse como marca y ser fácil de dictar, recordar y poner en un flyer.
- **Sin país ni idioma** (`/es/`, `/cl/`): FunPlace es solo Chile y en español, y el `.cl` ya lo dice.

### Por qué `lugares`

- Combina con la marca: Fun**Place** = lugar.
- Sirve para negocios que no son una "casa": parques (Curvy Park), salones, quinchos si más adelante abrimos otros eventos.
- La palabra "casa de cumpleaños", que es la que buscan los papás, va igual en el título de cada página para Google.

### Prefijos en español, no en inglés

Se descartó `places` / `services`. La marca va en inglés (FunPlace); todo lo demás, en español: links, botones y textos. Es más claro para los papás, más fácil de dictar y coherente con el resto de la página.

### Por qué con prefijo

- **Los slugs no chocan con páginas propias:** un lugar puede llamarse "Concepción" o "Precios" sin problema. Ya no hace falta una lista larga de palabras reservadas.
- **Más simple en Vercel:** la función que arma la vista previa para WhatsApp solo atiende `/lugares/*` y `/servicios/*`.
- **Más claro para Google** y listo para el buscador.
- El costo es mínimo: el link en la bio de Instagram se toca, nadie lo escribe a mano.

### Descartado: lugares sin prefijo y servicios con prefijo

Ej. `funplace.cl/casa-limon` y `funplace.cl/servicios/carritos-ana`. Se descartó porque:

- **El choque llega en el futuro:** con los lugares en la raíz, cada página nueva que FunPlace cree después (`/blog`, `/talcahuano`, `/ofertas`, `/navidad`) puede chocar con un lugar que ya tiene ese link publicado en Instagram. Hoy no se puede reservar palabras que todavía no sabemos que vamos a usar.
- **El buscador por ciudad** (`funplace.cl/concepcion`) vive justo en la raíz.
- Hay que volver a mantener la lista de palabras reservadas, y la vista previa para WhatsApp tendría que atender cualquier ruta del sitio.
- Lo que se gana son 9 letras en un link que la gente toca, no escribe.

### Abrir el calendario en una fecha

`funplace.cl/lugares/casa-limon?fecha=2026-11-14` abre el calendario directo en ese día. Así la casa puede responder por WhatsApp "el sábado 14 tengo esto libre" y mandar el link.

## Cómo se genera el slug

**Automático desde el nombre del negocio:**
- Minúsculas
- Sin tildes y con la ñ convertida en n
- Espacios convertidos en guiones
- Sin símbolos

Ejemplos:
- "Casa Limón" → `casa-limon`
- "Piñatas & Fiesta" → `pinatas-fiesta`

**Si el slug ya está ocupado** (caso raro), el panel sugiere una alternativa, por ejemplo agregando la comuna (`casa-limon-talcahuano`), y el negocio puede elegir otra. El número al final queda solo como último recurso.

**El slug es único entre todos los negocios**, sean casas o servicios. Así, si alguien entra con el prefijo equivocado (`/servicios/casa-limon`), se redirige al correcto.

## Edición

- El negocio puede editar su slug.
- Siempre se revisa que esté **disponible**.
- Al cambiarlo, el slug anterior **sigue redirigiendo** al nuevo, para no romper los links que ya están en Instagram o en flyers.
- Opcional: limitar los cambios (ej. uno al mes).

## Rutas propias del sitio

Como los negocios viven bajo `/lugares/` y `/servicios/`, la raíz del sitio queda para FunPlace:

| URL | Qué es |
|---|---|
| `funplace.cl` | Landing para negocios |
| `funplace.cl/lugares/{slug}` | Página de reservas de un lugar (casa de cumpleaños, parque, salón) |
| `funplace.cl/servicios/{slug}` | Página de reservas de un proveedor |
| `funplace.cl/concepcion` | Buscador por ciudad (futuro) |
| `funplace.cl/precios`, `/ayuda`, `/terminos`… | Páginas propias |
| `panel.funplace.cl` | Panel del negocio |

## En la base de datos

- Columna `slug` **única** en la tabla de negocios (entre lugares y servicios).
- Columna `tipo` (`lugar` o `servicio`) que define el prefijo.
- Tabla `slugs_anteriores` (slug viejo → negocio) para las redirecciones.
- La revisión de disponibilidad se hace **en la base de datos**, para que no se pueda saltar desde la pantalla.
