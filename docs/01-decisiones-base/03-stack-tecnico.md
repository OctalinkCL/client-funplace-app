# Stack técnico

## Herramientas

| Parte | Herramienta |
|---|---|
| Frontend | Vue 3 + Vite + TypeScript + shadcn-vue + Tailwind + Pinia + Vue Router |
| Estructura | Monorepo con pnpm workspaces |
| Backend | Supabase: Postgres, login, Storage para fotos, funciones en Postgres |
| Hosting | Vercel: 2 proyectos + funciones serverless |
| Correos | Resend |
| WhatsApp | Links `wa.me` (sin API de Meta por ahora) |
| Anti-spam | Cloudflare Turnstile en el formulario público |
| Pagos (futuro) | Mercado Pago, Flow o Webpay (por definir) |

Descartados: **Nuxt** (preferencia del equipo) y **Astro + Vue** (dos proyectos distintos para un equipo chico).

## Estructura del repositorio

```
funplace/
├── apps/
│   ├── web/      → funplace.cl (landing + páginas /lugares/slug y /servicios/slug)
│   └── panel/    → panel.funplace.cl (panel del negocio)
├── packages/
│   ├── ui/       → componentes shadcn-vue compartidos
│   └── shared/   → tipos, cliente Supabase, lógica de disponibilidad
└── supabase/     → migraciones y funciones de la base de datos
```

- Cada app es un proyecto distinto en Vercel, con su propio dominio.
- La página pública queda liviana: el papá en el celular no descarga el código del panel.

## Dominios

| URL | Qué es |
|---|---|
| `funplace.cl` | Landing para negocios |
| `funplace.cl/lugares/{slug}` | Página pública de reservas de un lugar (casa de cumpleaños, parque, salón) |
| `funplace.cl/servicios/{slug}` | Página pública de reservas de un proveedor |
| `panel.funplace.cl` | Panel del negocio, con login |
| `funplace.cl/concepcion` | Buscador por ciudad (futuro) |

Detalle del formato en [slugs y links](04-slugs-y-links.md).

## Vista previa en WhatsApp e Instagram (sin Nuxt)

Una app Vue normal arma la página en el navegador, así que WhatsApp e Instagram no ven la foto ni el nombre del negocio. Solución:

1. Una regla de Vercel envía `funplace.cl/lugares/:slug` y `funplace.cl/servicios/:slug` a una función serverless.
2. La función busca el negocio en Supabase y devuelve el `index.html` de la app con el título, la descripción y la foto ya puestos en las etiquetas `<meta>` (Open Graph).
3. El navegador carga Vue normalmente. WhatsApp, Instagram y Google leen las etiquetas.
4. La respuesta se guarda en caché para que sea rápida.

La landing se genera como HTML estático con **vite-ssg**.

Para el **buscador futuro** se necesitará más SEO (ej. "casas de cumpleaños en Talcahuano"). Lo más probable es generar esas páginas al compilar. Se decide cuando llegue.

## Cuidados técnicos desde el día uno

### Reservas dobles

Si dos papás piden el mismo bloque al mismo tiempo, o se piden más unidades de las disponibles, **la base de datos lo impide**, no solo la pantalla. La solicitud se crea con una función de Postgres que revisa la disponibilidad y guarda en un solo paso (transacción).

Una casa con un salón es "cantidad 1"; un proveedor con 3 carritos es "cantidad 3". La misma lógica sirve para ambos.

### Zona horaria

Chile cambia de hora dos veces al año. Las fechas y horas se manejan explícitamente en `America/Santiago`, para que un bloque de las 16:00 no aparezca a las 15:00.

### Seguridad entre negocios

Reglas de Row Level Security (RLS) en Supabase: cada negocio solo ve y edita sus propios datos. Las páginas públicas solo leen lo que el negocio publicó.

### Formulario público

- Cloudflare Turnstile (captcha invisible, gratis)
- Límite de solicitudes por persona o por IP
- Validación de datos en la base de datos, no solo en la pantalla

## Costo estimado del piloto

Prácticamente **$0 al mes** con los planes gratuitos de Supabase, Vercel, Resend y Turnstile, más el dominio que ya está comprado.
