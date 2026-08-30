import React from 'react'
import type { AcademyAnnouncement } from '../types/notifications'

interface NoticeBoardCardProps {
  announcements: AcademyAnnouncement[]
  onDeleteAnnouncement?: (id: string) => void
}

export const NoticeBoardCard: React.FC<NoticeBoardCardProps> = ({
  announcements,
  onDeleteAnnouncement,
}) => {
  if (announcements.length === 0) {
    return (
      <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center text-xs text-slate-400">
        No active academy announcements.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {announcements.map((ann) => (
        <div
          key={ann.id}
          className={`rounded-3xl border p-6 transition-all shadow-xs space-y-3 ${
            ann.is_pinned
              ? 'border-amber-200 bg-amber-50/40 hover:bg-amber-50/70'
              : 'border-slate-200 bg-white hover:bg-slate-50/80'
          }`}
        >
          {/* Top Meta */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              {ann.is_pinned && (
                <span className="rounded-md bg-amber-200 px-2 py-0.5 text-[10px] font-black text-amber-900 border border-amber-300">
                  📌 Pinned Notice
                </span>
              )}

              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-700">
                Audience: {ann.target_audience.toUpperCase()}
              </span>

              <span className="text-[11px] text-slate-400">
                {ann.created_at.slice(0, 10)}
              </span>
            </div>

            {onDeleteAnnouncement && (
              <button
                type="button"
                onClick={() => onDeleteAnnouncement(ann.id)}
                className="text-slate-400 hover:text-red-600 cursor-pointer p-1 rounded-md"
                title="Delete Announcement"
              >
                ✕
              </button>
            )}
          </div>

          {/* Title & Body */}
          <h3 className="text-base font-bold text-slate-900">{ann.title}</h3>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {ann.content}
          </p>

          {/* Author */}
          <div className="border-t border-slate-100 pt-2 text-[11px] font-semibold text-slate-500">
            Posted by: <strong className="text-slate-700">{ann.author_name}</strong>
          </div>
        </div>
      ))}
    </div>
  )
}

export default NoticeBoardCard
