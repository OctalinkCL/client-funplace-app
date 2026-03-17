export type UserRole = 'admin' | 'superadmin'

export interface Profile {
  id: string
  role: UserRole
  full_name: string | null
  created_at: string
}

export type SpaceType = 'casa' | 'sala' | 'estudio' | 'oficina' | 'galeria' | 'otro'

export type Amenity =
  | 'wifi' | 'tv_monitor' | 'projector' | 'kitchen' | 'oven'
  | 'refrigerator' | 'air_conditioning' | 'heating' | 'parking'
  | 'garden' | 'pool' | 'bbq' | 'sound_system' | 'bicycle_parking'
  | 'bathrooms' | 'disability_access'

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
  space_amenities?: { amenity: Amenity }[]
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
  block_id: string
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
