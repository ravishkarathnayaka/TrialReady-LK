import React, { useMemo } from 'react'
import type { PracticalSessionWithRelations } from '../types/session'
import {
  formatSessionDuration,
  formatTime12Hour,
} from '../utils/sessionValidation'

interface SessionCalendarViewProps {
  sessions: PracticalSessionWithRelations[]
  anchorDate: Date
  onChangeAnchorDate: (date: Date) => void
  onSelectSession: (session: PracticalSessionWithRelations) => void
  onOpenAttendance: (session: PracticalSessionWithRelations) => void
  onOpenBooking: (date?: string, startTime?: string) => void
}

function getStartOfWeek(d: Date): Date {
  const date = new Date(d)
  const day = date.getDay()
  const diff = date.getDate() - day + (day === 0 ? -6 : 1) // adjust when day is sunday
  return new Date(date.setDate(diff))
}

function addDays(d: Date, days: number): Date {
  const date = new Date(d)
  date.setDate(date.getDate() + days)
  return date
}

function formatDateISO(d: Date): string {
  return d.toISOString().split('T')[0]
}

export const SessionCalendarView: React.FC<SessionCalendarViewProps> = ({
  sessions,
  anchorDate,
  onChangeAnchorDate,
  onSelectSession,
  onOpenAttendance,
  onOpenBooking,
}) => {
  const weekStart = useMemo(() => getStartOfWeek(anchorDate), [anchorDate])

  const weekDays = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = addDays(weekStart, i)
      return {
        date: d,
        iso: formatDateISO(d),
        dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
        dayNumber: d.getDate(),
        isToday: formatDateISO(d) === formatDateISO(new Date()),
      }
    })
  }, [weekStart])

  const weekTitle = useMemo(() => {
    const end = addDays(weekStart, 6)
    const sMonth = weekStart.toLocaleDateString('en-US', { month: 'short' })
    const eMonth = end.toLocaleDateString('en-US', { month: 'short' })
    const year = end.getFullYear()

    if (sMonth === eMonth) {
      return `${sMonth} ${weekStart.getDate()} – ${end.getDate()}, ${year}`
    }
    return `${sMonth} ${weekStart.getDate()} – ${eMonth} ${end.getDate()}, ${year}`
  }, [weekStart])

  const sessionsByDate = useMemo(() => {
    const map = new Map<string, PracticalSessionWithRelations[]>()
    for (const session of sessions) {
      const list = map.get(session.session_date) || []
      list.push(session)
      map.set(session.session_date, list)
    }
    return map
  }, [sessions])

  const getStatusColor = (status: string, attendance: string) => {
    if (status === 'cancelled') {
      return 'bg-red-50 border-red-200 text-red-700 opacity-60 line-through'
    }
    if (status === 'completed' || attendance === 'present') {
      return 'bg-emerald-50 border-emerald-300 text-emerald-900'
    }
    if (attendance === 'absent' || status === 'no_show') {
      return 'bg-amber-50 border-amber-300 text-amber-900'
    }
    return 'bg-blue-50 border-blue-300 text-blue-950 hover:border-blue-400'
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Calendar Header Navigation */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-slate-50/70 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => onChangeAnchorDate(addDays(anchorDate, -7))}
            aria-label="Previous Week"
            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            ←
          </button>
          <button
            type="button"
            onClick={() => onChangeAnchorDate(new Date())}
            className="rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            Today
          </button>
          <button
            type="button"
            onClick={() => onChangeAnchorDate(addDays(anchorDate, 7))}
            aria-label="Next Week"
            className="rounded-lg border border-slate-300 bg-white p-1.5 text-slate-700 hover:bg-slate-100 transition-all cursor-pointer"
          >
            →
          </button>

          <span className="text-sm font-bold text-slate-900 ml-2">
            {weekTitle}
          </span>
        </div>

        <button
          type="button"
          onClick={() => onOpenBooking(formatDateISO(new Date()), '09:00')}
          className="rounded-xl bg-blue-600 px-3.5 py-1.5 text-xs font-semibold text-white shadow-xs hover:bg-blue-700 transition-all cursor-pointer"
        >
          + Book Lesson
        </button>
      </div>

      {/* Week Days Header Row */}
      <div className="grid grid-cols-7 border-b border-slate-200 text-center text-xs font-semibold">
        {weekDays.map((day) => (
          <div
            key={day.iso}
            className={`border-r border-slate-200 py-2.5 last:border-r-0 ${
              day.isToday ? 'bg-blue-50/80 text-blue-700' : 'bg-slate-50 text-slate-700'
            }`}
          >
            <p className="text-[11px] font-bold uppercase tracking-wider">{day.dayName}</p>
            <p
              className={`mx-auto mt-0.5 flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                day.isToday ? 'bg-blue-600 text-white' : 'text-slate-900'
              }`}
            >
              {day.dayNumber}
            </p>
          </div>
        ))}
      </div>

      {/* Calendar Week Columns Container */}
      <div className="grid grid-cols-7 min-h-[500px] divide-x divide-slate-200">
        {weekDays.map((day) => {
          const daySessions = sessionsByDate.get(day.iso) || []

          return (
            <div
              key={day.iso}
              className={`p-1.5 space-y-2 ${
                day.isToday ? 'bg-blue-50/15' : 'bg-white'
              }`}
            >
              {daySessions.length === 0 ? (
                <div className="h-full min-h-[120px] flex items-center justify-center text-center p-2">
                  <span className="text-[11px] text-slate-300 font-medium">No lessons</span>
                </div>
              ) : (
                daySessions.map((sess) => {
                  const duration = formatSessionDuration(sess.start_time, sess.end_time)

                  return (
                    <div
                      key={sess.id}
                      className={`group relative rounded-xl border p-2.5 shadow-xs transition-all hover:shadow-md cursor-pointer ${getStatusColor(
                        sess.status,
                        sess.attendance_status,
                      )}`}
                      onClick={() => onSelectSession(sess)}
                    >
                      {/* Top Row: Time & Category */}
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span>{formatTime12Hour(sess.start_time)}</span>
                        <span className="rounded bg-white/80 px-1 py-0.2 text-[9px] font-extrabold uppercase border border-slate-300/40">
                          {sess.licence_category?.code}
                        </span>
                      </div>

                      {/* Student Name */}
                      <p className="mt-1 text-xs font-bold truncate">
                        {sess.student?.full_name ?? 'Student'}
                      </p>

                      {/* Instructor & Vehicle summary */}
                      <div className="mt-1 text-[10px] space-y-0.5 opacity-80">
                        <p className="truncate">👨‍🏫 {sess.instructor?.full_name}</p>
                        {sess.vehicle && (
                          <p className="truncate">🚗 {sess.vehicle.registration_number}</p>
                        )}
                      </div>

                      {/* Status / Attendance Action Button */}
                      <div className="mt-2 flex items-center justify-between border-t border-slate-200/50 pt-1.5">
                        <span className="text-[9px] font-bold uppercase tracking-wider">
                          {sess.status === 'completed'
                            ? '✓ Done'
                            : sess.status === 'cancelled'
                              ? '✕ Cancelled'
                              : duration}
                        </span>

                        {sess.status === 'scheduled' && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              onOpenAttendance(sess)
                            }}
                            className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white hover:bg-blue-700 transition-all"
                          >
                            Mark
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default SessionCalendarView
