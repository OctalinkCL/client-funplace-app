import { supabase } from '@/lib/supabase'
import type { WeeklySchedule } from '@/types'

export interface FormBlock {
  tempId: string
  name: string
  start_time: string // "HH:MM"
  end_time: string   // "HH:MM"
  sort_order: number
}

export interface FormDayConfig {
  day_of_week: number
  enabled: boolean
  blockTempIds: string[]
}

export const availabilityService = {
  async getBySpaceId(spaceId: string): Promise<WeeklySchedule | null> {
    const { data, error } = await supabase
      .from('weekly_schedules')
      .select('*, time_blocks(*), day_schedule_configs(*, day_block_assignments(block_id))')
      .eq('space_id', spaceId)
      .order('sort_order', { referencedTable: 'time_blocks', ascending: true })
      .maybeSingle()
    if (error) throw error
    return data
  },

  async saveSchedule(
    spaceId: string,
    blocks: FormBlock[],
    days: FormDayConfig[],
  ): Promise<void> {
    // 1. Eliminar schedule anterior (cascade limpia todo)
    await supabase.from('weekly_schedules').delete().eq('space_id', spaceId)

    if (blocks.length === 0) return

    // 2. Crear nuevo schedule
    const { data: schedule, error: schedError } = await supabase
      .from('weekly_schedules')
      .insert({ space_id: spaceId })
      .select()
      .single()
    if (schedError) throw schedError

    // 3. Insertar time_blocks y obtener IDs reales en el mismo orden
    const { data: insertedBlocks, error: blocksError } = await supabase
      .from('time_blocks')
      .insert(
        blocks.map((b, i) => ({
          schedule_id: schedule.id,
          name: b.name,
          start_time: b.start_time,
          end_time: b.end_time,
          sort_order: i,
        })),
      )
      .select()
    if (blocksError) throw blocksError

    // Mapa tempId → realId (mismo orden de inserción)
    const tempToReal = new Map<string, string>()
    blocks.forEach((b, i) => tempToReal.set(b.tempId, insertedBlocks[i].id))

    // 4. Insertar day_schedule_configs para días habilitados
    const enabledDays = days.filter(d => d.enabled)
    if (enabledDays.length === 0) return

    const { data: insertedDays, error: daysError } = await supabase
      .from('day_schedule_configs')
      .insert(
        enabledDays.map(d => ({
          schedule_id: schedule.id,
          day_of_week: d.day_of_week,
          enabled: true,
        })),
      )
      .select()
    if (daysError) throw daysError

    // 5. Insertar day_block_assignments
    const assignments: { day_config_id: string; block_id: string }[] = []
    enabledDays.forEach((day, i) => {
      for (const tempId of day.blockTempIds) {
        const realId = tempToReal.get(tempId)
        if (realId) assignments.push({ day_config_id: insertedDays[i].id, block_id: realId })
      }
    })

    if (assignments.length > 0) {
      const { error: assignError } = await supabase
        .from('day_block_assignments')
        .insert(assignments)
      if (assignError) throw assignError
    }
  },

  async saveDaysOnly(spaceId: string, days: FormDayConfig[]): Promise<void> {
    const { data: schedule, error: schedErr } = await supabase
      .from('weekly_schedules')
      .select('id')
      .eq('space_id', spaceId)
      .single()
    if (schedErr) throw schedErr

    // Limpiar configuraciones anteriores (cascade borra assignments)
    await supabase.from('day_schedule_configs').delete().eq('schedule_id', schedule.id)

    const enabledDays = days.filter(d => d.enabled)
    if (enabledDays.length === 0) return

    const { data: insertedDays, error: daysError } = await supabase
      .from('day_schedule_configs')
      .insert(
        enabledDays.map(d => ({
          schedule_id: schedule.id,
          day_of_week: d.day_of_week,
          enabled: true,
        })),
      )
      .select()
    if (daysError) throw daysError

    // blockTempIds contienen IDs reales de DB (post-loadSchedule)
    const assignments = enabledDays.flatMap((day, i) =>
      day.blockTempIds.map(blockId => ({ day_config_id: insertedDays[i].id, block_id: blockId })),
    )
    if (assignments.length > 0) {
      const { error: assignError } = await supabase
        .from('day_block_assignments')
        .insert(assignments)
      if (assignError) throw assignError
    }
  },
}
