import type {
  CreatePracticalSessionInput,
  PracticalSessionWithRelations,
  SessionConflict,
} from '../types/session'

export function timeToMinutes(timeStr: string): number {
  const parts = timeStr.split(':')
  if (parts.length < 2) return 0
  const hours = parseInt(parts[0], 10) || 0
  const minutes = parseInt(parts[1], 10) || 0
  return hours * 60 + minutes
}

export function isTimeOverlapping(
  start1: string,
  end1: string,
  start2: string,
  end2: string,
): boolean {
  const s1 = timeToMinutes(start1)
  const e1 = timeToMinutes(end1)
  const s2 = timeToMinutes(start2)
  const e2 = timeToMinutes(end2)

  return Math.max(s1, s2) < Math.min(e1, e2)
}

export function formatTime12Hour(timeStr: string): string {
  if (!timeStr) return ''
  const parts = timeStr.split(':')
  const hours24 = parseInt(parts[0], 10) || 0
  const minutes = parts[1] || '00'
  const period = hours24 >= 12 ? 'PM' : 'AM'
  const hours12 = hours24 % 12 || 12
  return `${hours12}:${minutes} ${period}`
}

export function formatSessionDuration(start: string, end: string): string {
  const diffMins = timeToMinutes(end) - timeToMinutes(start)
  if (diffMins <= 0) return '0 min'
  const h = Math.floor(diffMins / 60)
  const m = diffMins % 60
  if (h === 0) return `${m} min`
  if (m === 0) return `${h} hr`
  return `${h}h ${m}m`
}

export function validateSessionInput(
  input: Partial<CreatePracticalSessionInput>,
): Record<string, string> {
  const errors: Record<string, string> = {}

  if (!input.branch_id) {
    errors.branch_id = 'Branch office is required.'
  }

  if (!input.student_id) {
    errors.student_id = 'Student is required.'
  }

  if (!input.instructor_id) {
    errors.instructor_id = 'Instructor is required.'
  }

  if (!input.licence_category_id) {
    errors.licence_category_id = 'Licence category is required.'
  }

  if (!input.session_date) {
    errors.session_date = 'Session date is required.'
  }

  if (!input.start_time) {
    errors.start_time = 'Start time is required.'
  }

  if (!input.end_time) {
    errors.end_time = 'End time is required.'
  }

  if (input.start_time && input.end_time) {
    const startMins = timeToMinutes(input.start_time)
    const endMins = timeToMinutes(input.end_time)

    if (startMins >= endMins) {
      errors.end_time = 'End time must be strictly after start time.'
    } else {
      const duration = endMins - startMins
      if (duration < 30) {
        errors.end_time = 'Session duration must be at least 30 minutes.'
      } else if (duration > 240) {
        errors.end_time = 'Session duration cannot exceed 4 hours.'
      }
    }
  }

  return errors
}

export function detectScheduleConflicts(
  existingSessions: PracticalSessionWithRelations[],
  candidate: {
    sessionDate: string
    startTime: string
    endTime: string
    instructorId: string
    vehicleId?: string | null
    studentId: string
    excludeSessionId?: string
  },
): SessionConflict[] {
  const conflicts: SessionConflict[] = []

  for (const session of existingSessions) {
    // Skip self when updating
    if (
      candidate.excludeSessionId &&
      session.id === candidate.excludeSessionId
    ) {
      continue
    }

    // Only active sessions can conflict
    if (session.status === 'cancelled') {
      continue
    }

    // Must be on the exact same calendar date
    if (session.session_date !== candidate.sessionDate) {
      continue
    }

    // Check time interval overlap
    if (
      isTimeOverlapping(
        candidate.startTime,
        candidate.endTime,
        session.start_time,
        session.end_time,
      )
    ) {
      // 1. Instructor collision
      if (session.instructor_id === candidate.instructorId) {
        conflicts.push({
          type: 'instructor',
          entityName: session.instructor.full_name,
          startTime: session.start_time,
          endTime: session.end_time,
          sessionId: session.id,
        })
      }

      // 2. Vehicle collision
      if (
        candidate.vehicleId &&
        session.vehicle_id &&
        session.vehicle_id === candidate.vehicleId
      ) {
        conflicts.push({
          type: 'vehicle',
          entityName:
            session.vehicle?.registration_number ?? 'Assigned Vehicle',
          startTime: session.start_time,
          endTime: session.end_time,
          sessionId: session.id,
        })
      }

      // 3. Student collision (student cannot attend two simultaneous lessons)
      if (session.student_id === candidate.studentId) {
        conflicts.push({
          type: 'student',
          entityName: session.student.full_name,
          startTime: session.start_time,
          endTime: session.end_time,
          sessionId: session.id,
        })
      }
    }
  }

  return conflicts
}
