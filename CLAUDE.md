# Contexto del Proyecto — MVP Plataforma de Reserva de Espacios

Este documento contiene TODO el contexto necesario para implementar el MVP. Léelo completo antes de escribir cualquier línea de código.

---

## 1. Descripción del Producto

Plataforma web donde **administradores** publican espacios (casas de eventos, salas, etc.) y **clientes** los pueden explorar y solicitar reservas. El pago y la coordinación final se hace fuera de la plataforma (transferencia, efectivo, WhatsApp).

### Actores

| Actor | Descripción |
|-------|-------------|
| **Superadmin** | Nosotros (el equipo). Gestiona usuarios admin directamente en Supabase Dashboard. No tiene panel en el MVP. |
| **Admin** | Dueño o gestor de uno o más espacios. Tiene panel privado para crear espacios, configurar disponibilidad y gestionar reservas. |
| **Cliente** | Cualquier persona. No se registra. Solo navega, elige fecha/bloque y envía solicitud con nombre, email y teléfono. |

### Decisiones de negocio importantes

- **No hay registro libre de usuarios.** Los admins son creados por el superadmin via Supabase Dashboard (Authentication → Invite User). Supabase envía el email de invitación automáticamente.
- **Un admin puede tener N espacios** (por ahora sin límite, lo limitaremos manualmente si es necesario en el futuro).
- **No hay pasarela de pago.** El flujo termina con la reserva en estado PENDING. El admin contacta al cliente por email/teléfono para coordinar el pago y luego confirma o cancela la reserva en el panel.
- **Los emails automáticos (notificaciones) se implementan en una fase posterior.** El MVP no los incluye.
- **No hay panel superadmin en el MVP.** Todo se gestiona directo en Supabase Dashboard.

---

## 2. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Vue 3 + Vite + TypeScript |
| UI Components | Shadcn/Vue + Tailwind CSS |
| Estado global | Pinia |
| Routing | Vue Router 4 |
| Backend / DB | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage (imágenes) | Supabase Storage |
| Deploy | Vercel |

---

## 3. Estructura de Carpetas

```
src/
├── lib/
│   └── supabase.ts                  # cliente Supabase (única instancia)
│
├── types/
│   └── index.ts                     # todos los tipos TypeScript del proyecto
│
├── constants/
│   ├── spaces.ts                    # REGIONS_AND_CITIES, SpaceType labels, generateSlug()
│   └── icons.ts                     # LUCIDE_ICON_MAP (nombre de ícono → componente Vue)
│
├── layouts/
│   ├── PublicLayout.vue             # header público + footer
│   ├── AdminLayout.vue              # sidebar admin + header con usuario
│   └── AuthLayout.vue              # layout centrado para login
│
├── router/
│   ├── index.ts                     # configuración principal del router
│   ├── public.routes.ts             # rutas públicas
│   ├── admin.routes.ts              # rutas admin (protegidas)
│   ├── auth.routes.ts               # rutas de autenticación
│   └── guards.ts                    # navigation guards con verificación de rol
│
├── stores/
│   └── auth.store.ts                # estado de sesión y perfil del usuario
│
└── modules/
    ├── auth/
    │   ├── views/
    │   │   ├── LoginView.vue
    │   │   └── UpdatePasswordView.vue   # recuperación / cambio de contraseña
    │   └── components/
    │       └── LogoutButton.vue
    │
    ├── spaces/
    │   ├── views/
    │   │   ├── public/
    │   │   │   ├── SpacesListView.vue      # listado público con filtros
    │   │   │   └── SpaceDetailView.vue     # detalle + calendario + reserva
    │   │   └── admin/
    │   │       ├── AdminSpacesView.vue     # lista de mis espacios
    │   │       ├── AdminSpaceFormView.vue  # crear / editar espacio
    │   │       └── AdminSpaceDetailView.vue # vista detalle del espacio en admin
    │   ├── components/
    │   │   ├── public/
    │   │   │   ├── SpaceCard.vue
    │   │   │   ├── SpaceFilters.vue
    │   │   │   ├── SpaceAmenities.vue
    │   │   │   └── SpaceImageGallery.vue
    │   │   └── admin/
    │   │       ├── SpaceForm.vue
    │   │       ├── AmenitiesSelector.vue   # checkboxes con íconos Lucide dinámicos
    │   │       └── ImageUploader.vue
    │   ├── composables/
    │   │   ├── useSpaces.ts
    │   │   ├── useSpaceForm.ts
    │   │   └── useAmenities.ts             # fetch de amenities desde DB
    │   └── services/
    │       ├── spaces.service.ts
    │       └── amenities.service.ts        # getAll() amenities desde tabla DB
    │
    ├── availability/
    │   ├── views/
    │   │   └── admin/
    │   │       └── AdminAvailabilityView.vue  # configurar horario semanal
    │   ├── components/
    │   │   ├── BlocksManager.vue           # CRUD inline de bloques horarios
    │   │   ├── WeeklyScheduleEditor.vue
    │   │   └── DayConfigRow.vue
    │   ├── composables/
    │   │   └── useAvailability.ts
    │   └── services/
    │       └── availability.service.ts
    │
    └── bookings/
        ├── views/
        │   ├── public/
        │   │   └── BookingFormView.vue        # formulario de reserva del cliente
        │   └── admin/
        │       ├── AdminBookingsView.vue      # dashboard de reservas
        │       └── AdminCalendarView.vue      # gestión diaria de slots
        ├── components/
        │   ├── public/
        │   │   ├── AvailabilityCalendar.vue   # calendario para el cliente
        │   │   ├── SlotSelector.vue
        │   │   └── BookingForm.vue
        │   └── admin/
        │       ├── AdminCalendar.vue           # calendario admin con colores
        │       ├── SlotManager.vue             # lista de slots del día con acciones
        │       ├── BookingCard.vue
        │       └── BookingDetail.vue
        ├── composables/
        │   ├── useBookings.ts
        │   └── useSlots.ts                    # lógica de cómputo de slots
        └── services/
            └── bookings.service.ts
```

---

## 4. Base de Datos — Schema SQL Completo

Ejecutar en Supabase SQL Editor en este orden exacto.

```sql
-- ============================================================
-- EXTENSIONES
-- ============================================================
create extension if not exists "uuid-ossp";

-- ============================================================
-- TABLA: profiles
-- Se crea automáticamente al invitar un usuario via Supabase Auth
-- ============================================================
create table profiles (
  id        uuid primary key references auth.users(id) on delete cascade,
  role      text not null default 'admin' check (role in ('admin', 'superadmin')),
  full_name text,
  created_at timestamptz not null default now()
);

-- Trigger: crear perfil automáticamente al crear usuario en auth
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, role, full_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'role', 'admin'),
    coalesce(new.raw_user_meta_data->>'full_name', new.email)
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();

-- ============================================================
-- TABLA: spaces
-- ============================================================
create table spaces (
  id           uuid primary key default uuid_generate_v4(),
  admin_id     uuid not null references profiles(id) on delete cascade,
  title        text not null,
  slug         text not null unique,
  description  text,
  space_type   text,                        -- 'casa', 'sala', 'estudio', etc.
  capacity     integer,
  size_m2      numeric,
  region       text,
  city         text,
  address      text,                        -- referencial, no para geolocalización
  is_published boolean not null default false,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

-- ============================================================
-- TABLA: amenities
-- Lista de amenities gestionada en DB (database-driven)
-- Poblar con INSERT después de crear la tabla
-- ============================================================
create table amenities (
  id         uuid primary key default uuid_generate_v4(),
  key        text not null unique,             -- ej. 'wifi', 'pool'
  name       text not null,                   -- ej. 'WiFi', 'Piscina'
  icon       text,                            -- nombre del ícono Lucide (ej. 'Wifi')
  sort_order integer not null default 0
);

-- ============================================================
-- TABLA: space_amenities
-- Relación espacio ↔ amenity via FK (no texto hardcoded)
-- ============================================================
create table space_amenities (
  space_id   uuid not null references spaces(id) on delete cascade,
  amenity_id uuid not null references amenities(id) on delete cascade,
  primary key (space_id, amenity_id)
);

-- ============================================================
-- TABLA: space_images
-- ============================================================
create table space_images (
  id         uuid primary key default uuid_generate_v4(),
  space_id   uuid not null references spaces(id) on delete cascade,
  url        text not null,
  storage_path text not null,              -- path en Supabase Storage para poder eliminar
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

-- ============================================================
-- TABLA: weekly_schedules
-- Un espacio tiene a lo sumo un horario semanal
-- ============================================================
create table weekly_schedules (
  id         uuid primary key default uuid_generate_v4(),
  space_id   uuid not null unique references spaces(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ============================================================
-- TABLA: time_blocks
-- Franjas horarias definidas dentro de un horario semanal
-- ============================================================
create table time_blocks (
  id          uuid primary key default uuid_generate_v4(),
  schedule_id uuid not null references weekly_schedules(id) on delete cascade,
  name        text not null,               -- ej. "Mañana", "Tarde", "Noche"
  start_time  time not null,               -- ej. 09:00
  end_time    time not null,               -- ej. 13:00
  sort_order  integer not null default 0
);

-- ============================================================
-- TABLA: day_schedule_configs
-- Un registro por día de la semana (0=domingo … 6=sábado)
-- ============================================================
create table day_schedule_configs (
  id          uuid primary key default uuid_generate_v4(),
  schedule_id uuid not null references weekly_schedules(id) on delete cascade,
  day_of_week integer not null check (day_of_week between 0 and 6),
  enabled     boolean not null default false,
  unique (schedule_id, day_of_week)
);

-- ============================================================
-- TABLA: day_block_assignments
-- Qué bloques aplican a qué día
-- ============================================================
create table day_block_assignments (
  day_config_id uuid not null references day_schedule_configs(id) on delete cascade,
  block_id      uuid not null references time_blocks(id) on delete cascade,
  primary key (day_config_id, block_id)
);

-- ============================================================
-- TABLA: blocked_slots
-- Bloqueo manual de un bloque en una fecha concreta
-- ============================================================
create table blocked_slots (
  id         uuid primary key default uuid_generate_v4(),
  space_id   uuid not null references spaces(id) on delete cascade,
  date       date not null,
  block_id   uuid not null references time_blocks(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (space_id, date, block_id)
);

-- ============================================================
-- TABLA: bookings
-- Solicitudes de reserva de clientes
-- ============================================================
create table bookings (
  id             uuid primary key default uuid_generate_v4(),
  space_id       uuid not null references spaces(id) on delete cascade,
  block_id       uuid not null references time_blocks(id),
  date           date not null,
  -- Copia desnormalizada del bloque (para referencia histórica)
  start_time     time not null,
  end_time       time not null,
  block_name     text not null,
  -- Datos del cliente
  customer_name  text not null,
  customer_email text not null,
  customer_phone text,
  notes          text,
  -- Estado
  status         text not null default 'PENDING'
                   check (status in ('PENDING', 'CONFIRMED', 'CANCELLED')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Índices útiles para las queries más frecuentes
create index idx_bookings_space_date on bookings(space_id, date);
create index idx_bookings_status on bookings(status);
create index idx_blocked_slots_space_date on blocked_slots(space_id, date);
create index idx_spaces_city on spaces(city);
create index idx_spaces_published on spaces(is_published);
```

---

## 5. Row Level Security (RLS)

Ejecutar después del schema. Esto es la capa de seguridad que reemplaza un backend tradicional.

```sql
-- ============================================================
-- Habilitar RLS en todas las tablas
-- ============================================================
alter table profiles enable row level security;
alter table spaces enable row level security;
alter table amenities enable row level security;
alter table space_amenities enable row level security;
alter table space_images enable row level security;
alter table weekly_schedules enable row level security;
alter table time_blocks enable row level security;
alter table day_schedule_configs enable row level security;
alter table day_block_assignments enable row level security;
alter table blocked_slots enable row level security;
alter table bookings enable row level security;

-- ============================================================
-- PROFILES
-- ============================================================
-- Cada usuario puede leer su propio perfil
create policy "profiles: read own" on profiles
  for select using (auth.uid() = id);

-- Solo superadmin puede leer todos los perfiles
create policy "profiles: superadmin read all" on profiles
  for select using (
    exists (select 1 from profiles where id = auth.uid() and role = 'superadmin')
  );

-- ============================================================
-- SPACES
-- ============================================================
-- Público: puede leer espacios publicados
create policy "spaces: public read published" on spaces
  for select using (is_published = true);

-- Admin: puede leer sus propios espacios (publicados o no)
create policy "spaces: admin read own" on spaces
  for select using (admin_id = auth.uid());

-- Admin: puede crear espacios
create policy "spaces: admin insert" on spaces
  for insert with check (admin_id = auth.uid());

-- Admin: puede editar sus propios espacios
create policy "spaces: admin update own" on spaces
  for update using (admin_id = auth.uid());

-- Admin: puede eliminar sus propios espacios
create policy "spaces: admin delete own" on spaces
  for delete using (admin_id = auth.uid());

-- ============================================================
-- AMENITIES (tabla maestra — lectura pública)
-- ============================================================
create policy "amenities: public read" on amenities
  for select using (true);

-- ============================================================
-- SPACE_AMENITIES
-- ============================================================
create policy "space_amenities: public read" on space_amenities
  for select using (
    exists (select 1 from spaces where id = space_id and is_published = true)
  );

create policy "space_amenities: admin manage own" on space_amenities
  for all using (
    exists (select 1 from spaces where id = space_id and admin_id = auth.uid())
  );

-- ============================================================
-- SPACE_IMAGES
-- ============================================================
create policy "images: public read" on space_images
  for select using (
    exists (select 1 from spaces where id = space_id and is_published = true)
  );

create policy "images: admin manage own" on space_images
  for all using (
    exists (select 1 from spaces where id = space_id and admin_id = auth.uid())
  );

-- ============================================================
-- WEEKLY_SCHEDULES
-- ============================================================
create policy "schedules: public read" on weekly_schedules
  for select using (
    exists (select 1 from spaces where id = space_id and is_published = true)
  );

create policy "schedules: admin manage own" on weekly_schedules
  for all using (
    exists (select 1 from spaces where id = space_id and admin_id = auth.uid())
  );

-- ============================================================
-- TIME_BLOCKS
-- ============================================================
create policy "time_blocks: public read" on time_blocks
  for select using (
    exists (
      select 1 from weekly_schedules ws
      join spaces s on s.id = ws.space_id
      where ws.id = schedule_id and s.is_published = true
    )
  );

create policy "time_blocks: admin manage own" on time_blocks
  for all using (
    exists (
      select 1 from weekly_schedules ws
      join spaces s on s.id = ws.space_id
      where ws.id = schedule_id and s.admin_id = auth.uid()
    )
  );

-- ============================================================
-- DAY_SCHEDULE_CONFIGS
-- ============================================================
create policy "day_configs: public read" on day_schedule_configs
  for select using (
    exists (
      select 1 from weekly_schedules ws
      join spaces s on s.id = ws.space_id
      where ws.id = schedule_id and s.is_published = true
    )
  );

create policy "day_configs: admin manage own" on day_schedule_configs
  for all using (
    exists (
      select 1 from weekly_schedules ws
      join spaces s on s.id = ws.space_id
      where ws.id = schedule_id and s.admin_id = auth.uid()
    )
  );

-- ============================================================
-- DAY_BLOCK_ASSIGNMENTS
-- ============================================================
create policy "day_assignments: public read" on day_block_assignments
  for select using (
    exists (
      select 1 from day_schedule_configs dsc
      join weekly_schedules ws on ws.id = dsc.schedule_id
      join spaces s on s.id = ws.space_id
      where dsc.id = day_config_id and s.is_published = true
    )
  );

create policy "day_assignments: admin manage own" on day_block_assignments
  for all using (
    exists (
      select 1 from day_schedule_configs dsc
      join weekly_schedules ws on ws.id = dsc.schedule_id
      join spaces s on s.id = ws.space_id
      where dsc.id = day_config_id and s.admin_id = auth.uid()
    )
  );

-- ============================================================
-- BLOCKED_SLOTS
-- ============================================================
create policy "blocked_slots: public read" on blocked_slots
  for select using (
    exists (select 1 from spaces where id = space_id and is_published = true)
  );

create policy "blocked_slots: admin manage own" on blocked_slots
  for all using (
    exists (select 1 from spaces where id = space_id and admin_id = auth.uid())
  );

-- ============================================================
-- BOOKINGS
-- ============================================================
-- Público: puede crear reservas en espacios publicados
create policy "bookings: public insert" on bookings
  for insert with check (
    exists (select 1 from spaces where id = space_id and is_published = true)
  );

-- Admin: puede leer y gestionar reservas de sus espacios
create policy "bookings: admin manage own" on bookings
  for all using (
    exists (select 1 from spaces where id = space_id and admin_id = auth.uid())
  );
```

---

## 6. Supabase Storage

Crear el bucket en Supabase Dashboard → Storage → New Bucket:

- **Nombre:** `space-images`
- **Public:** ✅ (las imágenes son públicas)
- **File size limit:** 5MB
- **Allowed MIME types:** `image/jpeg, image/png, image/webp`

Path convention para los archivos:
```
space-images/{space_id}/{timestamp}-{random}.{ext}
```

---

## 7. Variables de Entorno

Archivo `.env` en la raíz del proyecto:

```env
VITE_SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Ambas se obtienen en Supabase Dashboard → Settings → API.

---

## 8. Cliente Supabase

```typescript
// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'  // se genera con supabase CLI

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
```

---

## 9. Tipos TypeScript Principales

```typescript
// src/types/index.ts

export type UserRole = 'admin' | 'superadmin'

// Registro de amenity tal como viene de la tabla `amenities`
export interface AmenityRecord {
  id: string
  key: string        // ej. 'wifi', 'pool'
  name: string       // ej. 'WiFi', 'Piscina'
  icon: string       // nombre del ícono Lucide (ej. 'Wifi')
  sort_order: number
}

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export type SpaceType = 'casa' | 'sala' | 'estudio' | 'oficina' | 'galeria' | 'otro'

export interface Space {
  id: string
  admin_id: string
  title: string
  slug: string
  description: string | null
  space_type: SpaceType | null
  capacity: number | null
  size_m2: number | null
  region: string | null
  city: string | null
  address: string | null
  is_published: boolean
  created_at: string
  updated_at: string
  // relaciones (se cargan con joins)
  space_amenities?: { amenity_id: string }[]
  space_images?: SpaceImage[]
}

export interface SpaceImage {
  id: string
  space_id: string
  url: string
  storage_path: string
  sort_order: number
  created_at: string
}

export interface WeeklySchedule {
  id: string
  space_id: string
  created_at: string
  updated_at: string
  time_blocks?: TimeBlock[]
  day_schedule_configs?: DayScheduleConfig[]
}

export interface TimeBlock {
  id: string
  schedule_id: string
  name: string
  start_time: string   // "HH:MM:SS" (formato PostgreSQL time)
  end_time: string
  sort_order: number
}

export interface DayScheduleConfig {
  id: string
  schedule_id: string
  day_of_week: number  // 0=domingo … 6=sábado
  enabled: boolean
  day_block_assignments?: { block_id: string }[]
}

export interface BlockedSlot {
  id: string
  space_id: string
  date: string         // "YYYY-MM-DD"
  block_id: string
  created_at: string
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Booking {
  id: string
  space_id: string
  block_id: string | null   // nullable: el bloque puede haber sido eliminado
  date: string
  start_time: string
  end_time: string
  block_name: string
  customer_name: string
  customer_email: string
  customer_phone: string | null
  notes: string | null
  status: BookingStatus
  created_at: string
  updated_at: string
  // relaciones opcionales
  spaces?: Pick<Space, 'id' | 'title' | 'slug'>
}

export interface CreateSpacePayload {
  admin_id: string
  title: string
  slug: string
  space_type: SpaceType | null
  description: string | null
  capacity: number | null
  size_m2: number | null
  region: string | null
  city: string | null
  address: string | null
  is_published: boolean
}

export type UpdateSpacePayload = Partial<Omit<CreateSpacePayload, 'admin_id'>>

export interface CreateBookingPayload {
  space_id: string
  block_id: string
  date: string
  start_time: string
  end_time: string
  block_name: string
  customer_name: string
  customer_email: string
  customer_phone?: string | null
  notes?: string | null
}

export type SlotStatus = 'AVAILABLE' | 'BLOCKED' | 'PENDING' | 'CONFIRMED'

export interface SimpleSlot {
  blockId: string
  blockName: string
  startTime: string
  endTime: string
  status: SlotStatus
  booking?: Booking
  blockedSlotId?: string
}
```

---

## 10. Rutas de la Aplicación

```typescript
// Públicas
/                          → SpacesListView (listado con filtros)
/espacios/:slug            → SpaceDetailView (detalle + calendario + reserva)
/espacios/:slug/reservar   → BookingFormView (formulario de reserva)

// Auth
/login                     → LoginView

// Admin (requieren rol 'admin' o 'superadmin')
/admin                     → redirect a /admin/reservas
/admin/reservas            → AdminBookingsView (dashboard de reservas pendientes)
/admin/calendario/:spaceId → AdminCalendarView (gestión diaria de slots)
/admin/espacios            → AdminSpacesView (mis espacios)
/admin/espacios/nuevo      → AdminSpaceFormView (crear espacio)
/admin/espacios/:id/editar → AdminSpaceFormView (editar espacio)
/admin/espacios/:id        → AdminSpaceDetailView
/admin/espacios/:id/disponibilidad → AdminAvailabilityView
```

### Guard de autenticación

```typescript
// src/router/guards.ts
// Lógica:
// 1. Rutas /admin/* → verificar sesión activa en Supabase Auth
// 2. Si no hay sesión → redirect a /login
// 3. Si hay sesión → leer profile.role
// 4. Si role no es 'admin' ni 'superadmin' → redirect a /
// 5. Rutas superadmin/* → verificar role === 'superadmin'
```

---

## 11. Auth Store (Pinia)

```typescript
// src/stores/auth.store.ts
// Estado:
//   user: User | null          (de Supabase Auth)
//   profile: Profile | null    (de tabla profiles)
//   loading: boolean
//
// Actions:
//   initialize()   → llama supabase.auth.getSession() al montar la app
//   login(email, password) → supabase.auth.signInWithPassword()
//   logout()       → supabase.auth.signOut()
//   fetchProfile() → select from profiles where id = user.id
//
// Getters:
//   isAuthenticated: boolean
//   isAdmin: boolean
//   isSuperAdmin: boolean
```

---

## 12. Lógica de Cómputo de Slots

Esta es la lógica más importante del módulo de disponibilidad. Debe implementarse como función pura en el composable `useSlots.ts`.

**Dado un `spaceId` y una `date` (YYYY-MM-DD), retorna `SimpleSlot[]`:**

```
1. Buscar el WeeklySchedule del espacio (con time_blocks y day_schedule_configs con sus assignments)
   → Si no existe, retornar []

2. Determinar day_of_week de la fecha (0=domingo … 6=sábado)

3. Buscar el DayScheduleConfig para ese day_of_week
   → Si no existe o enabled = false → retornar []
   → Si no tiene day_block_assignments → retornar []

4. Obtener los block_ids activos para ese día desde day_block_assignments

5. Para cada block_id:
   a. Obtener el TimeBlock correspondiente
   b. Buscar BlockedSlot en (space_id, date, block_id) → consulta a Supabase
   c. Buscar Booking activa (status != 'CANCELLED') en (space_id, date, block_id) → consulta a Supabase
   d. Determinar status:
      - Si hay Booking activa → status = booking.status ('PENDING' o 'CONFIRMED')
      - Si no hay Booking pero hay BlockedSlot → status = 'BLOCKED'
      - Si no hay nada → status = 'AVAILABLE'

6. Retornar lista de SimpleSlot con toda la info
```

**Prioridad de estados:** Booking activa > BlockedSlot > AVAILABLE

**Para el cliente:** filtrar la lista y mostrar solo los slots con status === 'AVAILABLE'

**Para el admin:** mostrar todos los slots con sus estados y acciones correspondientes:
- AVAILABLE → puede bloquear
- BLOCKED → puede desbloquear
- PENDING → puede confirmar o cancelar
- CONFIRMED → puede cancelar

---

## 13. Módulo de Espacios — Campos del Formulario Admin

El formulario de creación/edición de un espacio incluye estas secciones:

### Información básica
- `title` (requerido) — genera el `slug` automáticamente (ej. "Casa LimaLimón" → "casa-limalimon")
- `space_type` — select: Casa, Sala, Estudio, Oficina, Galería, Otro
- `description` — textarea
- `capacity` — número (personas)
- `size_m2` — número (m²)

### Ubicación
- `region` — select controlado (regiones de Chile)
- `city` — select controlado (ciudades filtradas por región)
- `address` — texto libre (referencial, sin geolocalización en MVP)

### Facilidades (database-driven, con íconos Lucide)
Los amenities se cargan desde la tabla `amenities` (via `amenities.service.ts` + `useAmenities()`). No son hardcodeados en el frontend. Cada registro tiene `key`, `name`, `icon` (nombre de ícono Lucide) y `sort_order`.

Los datos iniciales a insertar en la tabla `amenities`:

| key | name | icon Lucide |
|-----|------|-------------|
| wifi | WiFi | Wifi |
| tv_monitor | TV / Monitor | Monitor |
| projector | Proyector | Projector |
| kitchen | Cocina | UtensilsCrossed |
| oven | Horno | Flame |
| refrigerator | Refrigerador | Refrigerator |
| air_conditioning | Aire Acondicionado | Wind |
| heating | Calefacción | Thermometer |
| parking | Estacionamiento | Car |
| garden | Jardín | Trees |
| pool | Piscina | Waves |
| bbq | Parrilla / BBQ | Flame |
| sound_system | Sistema de Sonido | Music |
| bicycle_parking | Bicicletero | Bike |
| bathrooms | Baños | Bath |
| disability_access | Acceso para discapacitados | Accessibility |

### Imágenes
- Upload múltiple de imágenes (jpeg, png, webp — máx 5MB c/u)
- Se suben a Supabase Storage en bucket `space-images`
- Se pueden reordenar y eliminar
- Máximo sugerido: 10 imágenes por espacio

### Publicación
- Toggle `is_published` — mientras está en false, el espacio no aparece en el listado público

---

## 14. Regiones y Ciudades de Chile (datos controlados)

```typescript
export const REGIONS_AND_CITIES = {
  'Región Metropolitana': ['Santiago', 'Providencia', 'Las Condes', 'Ñuñoa', 'Maipú', 'La Florida', 'San Bernardo', 'Puente Alto'],
  'Valparaíso': ['Valparaíso', 'Viña del Mar', 'Quilpué', 'Villa Alemana', 'San Antonio'],
  'Biobío': ['Concepción', 'Talcahuano', 'Los Ángeles', 'Chillán'],
  'La Araucanía': ['Temuco', 'Villarrica', 'Pucón'],
  'Los Lagos': ['Puerto Montt', 'Osorno', 'Castro', 'Puerto Varas'],
  'Coquimbo': ['La Serena', 'Coquimbo', 'Ovalle'],
  'O\'Higgins': ['Rancagua', 'San Fernando'],
  'Maule': ['Talca', 'Curicó', 'Linares'],
  'Los Ríos': ['Valdivia', 'La Unión'],
  'Antofagasta': ['Antofagasta', 'Calama'],
  'Atacama': ['Copiapó', 'Vallenar'],
  'Tarapacá': ['Iquique', 'Alto Hospicio'],
  'Arica y Parinacota': ['Arica'],
  'Magallanes': ['Punta Arenas'],
  'Aysén': ['Coyhaique'],
  'Ñuble': ['Chillán'],
} as const
```

---

## 15. Convención de Servicios

Cada módulo tiene su `services/*.service.ts` con funciones async que interactúan directamente con Supabase. Los composables llaman a los servicios y manejan el estado reactivo (loading, error, data).

```typescript
// Ejemplo: spaces.service.ts
export const spacesService = {
  async getPublished(filters?: { region?: string; city?: string }) {
    let query = supabase
      .from('spaces')
      .select('*, space_amenities(*), space_images(*)')
      .eq('is_published', true)
      .order('created_at', { ascending: false })

    if (filters?.city) query = query.eq('city', filters.city)
    if (filters?.region) query = query.eq('region', filters.region)

    const { data, error } = await query
    if (error) throw error
    return data
  },

  async getBySlug(slug: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('*, space_amenities(*), space_images(*order=sort_order)')
      .eq('slug', slug)
      .eq('is_published', true)
      .single()
    if (error) throw error
    return data
  },

  async getByAdmin(adminId: string) {
    const { data, error } = await supabase
      .from('spaces')
      .select('*, space_images(id, url, sort_order)')
      .eq('admin_id', adminId)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async create(payload: CreateSpacePayload) { ... },
  async update(id: string, payload: UpdateSpacePayload) { ... },
  async delete(id: string) { ... },
  async togglePublish(id: string, isPublished: boolean) { ... },
}
```

---

## 16. Flujo de Reserva — Lado Cliente (paso a paso)

1. Cliente llega a `/espacios/:slug`
2. Ve información del espacio (fotos, descripción, amenities)
3. Ve el calendario — los días con al menos 1 slot AVAILABLE aparecen en verde; días sin disponibilidad aparecen desactivados
4. Cliente hace clic en un día disponible
5. Aparece la lista de bloques disponibles (solo AVAILABLE) para ese día
6. Cliente selecciona un bloque
7. Se navega a `/espacios/:slug/reservar?date=YYYY-MM-DD&blockId=xxx`
8. Formulario muestra resumen: espacio, fecha, bloque horario
9. Cliente completa: nombre (req), email (req), teléfono (req), notas (opcional)
10. Al enviar: se verifica que el slot sigue AVAILABLE (server-side via RLS)
11. Se crea la Booking con status PENDING
12. Se muestra pantalla de confirmación: "Tu solicitud fue enviada. El administrador se pondrá en contacto contigo para coordinar el pago."

---

## 17. Panel Admin — Vistas Principales

### Dashboard de Reservas (`/admin/reservas`)
- Lista de todas las reservas de los espacios del admin
- Filtros: por espacio, por estado (PENDING / CONFIRMED / CANCELLED), por fecha
- Las PENDING aparecen primero y destacadas
- Acciones rápidas: confirmar / cancelar desde la lista

### Gestión de Calendario (`/admin/calendario/:spaceId`)
- Calendario mensual donde:
  - Días habilitados por el horario semanal → verde
  - Días con reservas PENDING → naranja (prioridad visual)
- Al hacer clic en un día → panel lateral con los slots del día
- Por cada slot se muestran las acciones disponibles según su estado

### Mis Espacios (`/admin/espacios`)
- Lista de espacios del admin con estado (publicado / borrador)
- Acciones: editar, ver disponibilidad, ver en sitio público

---

## 18. Consideraciones Técnicas Adicionales

### Generación de slug
```typescript
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // quitar tildes
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}
// "Casa LimaLimón" → "casa-limalimon"
```

### Formato de horas
PostgreSQL devuelve `time` como string `"HH:MM:SS"`. En la UI mostrar solo `HH:MM`.

```typescript
function formatTime(time: string): string {
  return time.slice(0, 5) // "09:00:00" → "09:00"
}
```

### Manejo de fechas
Usar siempre formato `YYYY-MM-DD` para las fechas. No usar moment.js — usar la API nativa de Date o la librería `date-fns` (más liviana).

### Reemplazar horario semanal
Cuando el admin guarda un nuevo horario, eliminar el anterior en cascada (la FK con `on delete cascade` se encarga de limpiar time_blocks, day_schedule_configs y day_block_assignments automáticamente). Solo hay que eliminar el `weekly_schedule` y crear uno nuevo.

---

## 19. Lo que NO está en el MVP

Para evitar scope creep, estas features están explícitamente fuera del MVP:

- ❌ Panel superadmin (se gestiona directo en Supabase Dashboard)
- ❌ Emails automáticos de notificación (Resend — siguiente fase)
- ❌ Pasarela de pagos
- ❌ Registro libre de clientes
- ❌ Búsqueda por fecha disponible (el filtro es solo por región/ciudad)
- ❌ Google Maps / geolocalización
- ❌ Sistema de reviews o ratings
- ❌ Multi-idioma
- ❌ Límites de plan (básico/pro) — se gestiona manualmente por ahora

---

## 20. Estado de Implementación (Marzo 2026)

### Módulos completados ✅

| Módulo | Estado | Notas |
|--------|--------|-------|
| Auth (login / logout) | ✅ Completo | Login, logout, recuperación de contraseña, guards de ruta |
| Espacios — listado público | ✅ Completo | Filtros por región/ciudad, tarjetas, galería |
| Espacios — detalle público | ✅ Completo | Imágenes, amenities, calendario de disponibilidad |
| Espacios — formulario admin | ✅ Completo | Crear y editar con imágenes, amenities DB-driven, slug automático |
| Espacios — gestión admin | ✅ Completo | Listado, publicar/despublicar, eliminar |
| Disponibilidad — horario semanal | ✅ Completo | Bloques horarios + asignación por día de semana |
| Reservas — formulario cliente | ✅ Completo | Calendario, selector de bloque, formulario, confirmación |
| Reservas — dashboard admin | ✅ Completo | Listado con filtros (espacio, estado, fecha), acciones rápidas |
| Reservas — calendario admin | ✅ Completo | Vista mensual, panel lateral con slots, bloquear/desbloquear/confirmar/cancelar |
| Amenities — sistema DB-driven | ✅ Completo | Tabla `amenities`, `amenities.service.ts`, `useAmenities()`, íconos Lucide |

### Decisiones de implementación tomadas

- **Amenities database-driven:** En lugar del `CHECK IN (...)` del spec original, se usa una tabla `amenities` con FK. Esto permite agregar/editar amenities sin tocar el código.
- **`Booking.block_id` es nullable:** El bloque puede haber sido eliminado después de crear la reserva. Los datos del bloque se preservan en `start_time`, `end_time`, `block_name` (campos desnormalizados).
- **`src/constants/`:** Directorio nuevo para constantes de dominio reutilizables (`REGIONS_AND_CITIES`, `LUCIDE_ICON_MAP`, `generateSlug()`).
- **`BlocksManager.vue`** reemplaza al `TimeBlockForm.vue` standalone del spec — es un componente de gestión CRUD inline de bloques dentro de `AdminAvailabilityView`.
- **Cache de schedule en `useSlots.ts`:** El schedule se cachea en memoria para evitar re-fetches al navegar entre fechas del mismo espacio.

### Pendiente para siguientes fases

- ❌ Emails automáticos de notificación (Resend)
- ❌ Pasarela de pagos
- ❌ Panel superadmin

---

*Documento generado para Claude Code. Versión MVP — Marzo 2026. Última actualización: 18/03/2026.*
