export type UserRole = 'admin' | 'superadmin'

export interface PlaceResult {
  displayName: string
  formattedAddress: string
  lat: number
  lng: number
  addressComponents: Array<{
    longText: string
    shortText: string
    types: string[]
    languageCode: string
  }>
}

export interface AmenityRecord {
  id: string
  key: string
  name: string
  icon: string
  sort_order: number
}

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  created_at: string
  contact_email: string | null
  contact_phone: string | null
  contact_whatsapp: string | null
  plan: number | null
}

export type SpaceKind = 'space' | 'service'
export type SpaceType =
  // Espacios (kind='space')
  | 'casa' | 'centro' | 'salon'
  // Servicios (kind='service')
  | 'catering' | 'foodtruck' | 'inflables' | 'musica' | 'animaciones' | 'fotografia'

export interface Space {
  id: string
  admin_id: string
  title: string
  slug: string
  description: string | null
  kind: SpaceKind
  space_type: SpaceType | null
  capacity: number | null
  size_m2: number | null
  region: string | null
  city: string | null
  address: string | null
  lat: number | null
  lng: number | null
  service_area: string | null
  price_from: number | null
  is_published: boolean
  is_featured: boolean
  contact_email: string | null
  contact_phone: string | null
  contact_whatsapp: string | null
  created_at: string
  updated_at: string
  space_amenities?: { amenity_id: string }[]
  space_images?: SpaceImage[]
  profiles?: {
    contact_email: string | null
    contact_phone: string | null
    contact_whatsapp: string | null
  } | null
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
  start_time: string
  end_time: string
  sort_order: number
}

export interface DayScheduleConfig {
  id: string
  schedule_id: string
  day_of_week: number
  enabled: boolean
  day_block_assignments?: { block_id: string }[]
}

export interface BlockedSlot {
  id: string
  space_id: string
  date: string
  block_id: string
  created_at: string
}

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED'

export interface Booking {
  id: string
  space_id: string
  block_id: string | null
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
  spaces?: Pick<Space, 'id' | 'title' | 'slug'>
}

export interface CreateSpacePayload {
  admin_id: string
  title: string
  slug: string
  kind?: SpaceKind
  space_type: SpaceType | null
  description: string | null
  capacity: number | null
  size_m2: number | null
  region: string | null
  city: string | null
  address: string | null
  lat: number | null
  lng: number | null
  service_area?: string | null
  price_from?: number | null
  is_published: boolean
  is_featured?: boolean
  contact_email?: string | null
  contact_phone?: string | null
  contact_whatsapp?: string | null
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
