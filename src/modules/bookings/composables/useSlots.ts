import { supabase } from '@/lib/supabase'
import { availabilityService } from '@/modules/availability/services/availability.service'
import type { SimpleSlot, SlotStatus, WeeklySchedule } from '@/types'

// Cache de schedule por espacio (reutilizado en el mismo flujo de navegación)
let scheduleCache: { spaceId: string; schedule: WeeklySchedule | null } | null = null

async function loadSchedule(spaceId: string): Promise<WeeklySchedule | null> {
  if (scheduleCache?.spaceId === spaceId) return scheduleCache.schedule
  const schedule = await availabilityService.getBySpaceId(spaceId)
  scheduleCache = { spaceId, schedule }
  return schedule
}

/** Construye "YYYY-MM-DD" sin problemas de timezone */
function dateStr(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

/** Extrae year/month/day de un string "YYYY-MM-DD" sin timezone */
function parseDateStr(date: string): Date {
  const [y, m, d] = date.split('-').map(Number)
  return new Date(y, m - 1, d)
}

/**
 * Devuelve los SimpleSlot para un espacio y una fecha concreta.
 * Solo se incluyen bloques asignados al día de la semana en el horario semanal.
 */
export async function getSlotsForDate(spaceId: string, date: string, publicOnly = false): Promise<SimpleSlot[]> {
  const schedule = await loadSchedule(spaceId)
  if (!schedule) return []

  const d = parseDateStr(date)
  const dayOfWeek = d.getDay() // 0=domingo … 6=sábado

  const dayConfig = schedule.day_schedule_configs?.find(dc => dc.day_of_week === dayOfWeek)
  if (!dayConfig || !dayConfig.enabled) return []

  const assignedBlockIds = (dayConfig.day_block_assignments ?? []).map(a => a.block_id)
  if (assignedBlockIds.length === 0) return []

  const blocks = (schedule.time_blocks ?? []).filter(b => assignedBlockIds.includes(b.id))
  if (blocks.length === 0) return []

  // Consulta paralela: blocked_slots y bookings para este día
  // En vista admin (publicOnly=false) traemos también las CANCELLED para permitir reactivar
  let bookingsQuery = supabase
    .from('bookings')
    .select(publicOnly ? 'block_id, status' : '*')
    .eq('space_id', spaceId)
    .eq('date', date)
    .in('block_id', assignedBlockIds)

  if (publicOnly) bookingsQuery = bookingsQuery.neq('status', 'CANCELLED')

  const [{ data: blockedSlots }, { data: allBookings }] = await Promise.all([
    supabase
      .from('blocked_slots')
      .select('*')
      .eq('space_id', spaceId)
      .eq('date', date)
      .in('block_id', assignedBlockIds),
    bookingsQuery,
  ])

  return blocks
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(block => {
      // En admin: priorizar reserva activa sobre cancelada
      const activeBooking = allBookings?.find(bk => bk.block_id === block.id && bk.status !== 'CANCELLED')
      const cancelledBooking = !activeBooking
        ? allBookings?.find(bk => bk.block_id === block.id && bk.status === 'CANCELLED')
        : undefined
      const booking = activeBooking ?? cancelledBooking
      const blocked = blockedSlots?.find(bs => bs.block_id === block.id)

      let status: SlotStatus
      if (activeBooking) {
        status = activeBooking.status as SlotStatus // 'PENDING' | 'CONFIRMED'
      } else if (cancelledBooking) {
        status = 'CANCELLED'
      } else if (blocked) {
        status = 'BLOCKED'
      } else {
        status = 'AVAILABLE'
      }

      return {
        blockId: block.id,
        blockName: block.name,
        startTime: block.start_time.slice(0, 5),
        endTime: block.end_time.slice(0, 5),
        status,
        booking: booking ?? undefined,
        blockedSlotId: blocked?.id,
      } satisfies SimpleSlot
    })
}

/**
 * Devuelve el conjunto de fechas "YYYY-MM-DD" del mes que tienen al menos 1 slot AVAILABLE.
 * Hace batch queries para el mes completo (eficiente).
 */
export async function getAvailableDatesInMonth(
  spaceId: string,
  year: number,
  month: number, // 0-indexed: 0=enero, 11=diciembre
): Promise<Set<string>> {
  const schedule = await loadSchedule(spaceId)
  if (!schedule) return new Set()

  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const startStr = dateStr(year, month, 1)
  const endStr = dateStr(year, month, daysInMonth)
  const todayStr = dateStr(
    new Date().getFullYear(),
    new Date().getMonth(),
    new Date().getDate(),
  )

  // Batch queries para todo el mes
  const [{ data: blockedSlots }, { data: activeBookings }] = await Promise.all([
    supabase
      .from('blocked_slots')
      .select('date, block_id')
      .eq('space_id', spaceId)
      .gte('date', startStr)
      .lte('date', endStr),
    supabase
      .from('bookings')
      .select('date, block_id')
      .eq('space_id', spaceId)
      .gte('date', startStr)
      .lte('date', endStr)
      .neq('status', 'CANCELLED'),
  ])

  const available = new Set<string>()

  for (let day = 1; day <= daysInMonth; day++) {
    const ds = dateStr(year, month, day)
    if (ds < todayStr) continue // ignorar fechas pasadas

    const dayOfWeek = new Date(year, month, day).getDay()
    const dayConfig = schedule.day_schedule_configs?.find(dc => dc.day_of_week === dayOfWeek)
    if (!dayConfig || !dayConfig.enabled) continue

    const assignedBlockIds = (dayConfig.day_block_assignments ?? []).map(a => a.block_id)
    if (assignedBlockIds.length === 0) continue

    const blocks = (schedule.time_blocks ?? []).filter(b => assignedBlockIds.includes(b.id))

    const hasAvailable = blocks.some(block => {
      const isBlocked = blockedSlots?.some(bs => bs.date === ds && bs.block_id === block.id)
      const isBooked = activeBookings?.some(bk => bk.date === ds && bk.block_id === block.id)
      return !isBlocked && !isBooked
    })

    if (hasAvailable) available.add(ds)
  }

  return available
}

/** Invalida el cache (útil al navegar a otro espacio) */
export function clearSlotsCache() {
  scheduleCache = null
}

export function useSlots() {
  return { getSlotsForDate, getAvailableDatesInMonth, clearSlotsCache }
}
