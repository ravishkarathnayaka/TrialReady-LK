import React from 'react'
import { useTheoryLanguage } from '../context/TheoryLanguageContext'
import type { TheoryLanguage } from '../types/theory'

export const LanguageSelectorPill: React.FC = () => {
  const { language, setLanguage } = useTheoryLanguage()

  const languages: { code: TheoryLanguage; label: string; flag: string }[] = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'si', label: 'සිංහල', flag: '🇱🇰' },
    { code: 'ta', label: 'தமிழ்', flag: '🇱🇰' },
  ]

  return (
    <div className="flex items-center gap-1 rounded-2xl bg-white/90 p-1 backdrop-blur-xs border border-slate-200 shadow-2xs">
      {languages.map((l) => {
        const isActive = language === l.code
        return (
          <button
            key={l.code}
            type="button"
            onClick={() => setLanguage(l.code)}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-all cursor-pointer ${
              isActive
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <span>{l.flag}</span>
            <span>{l.label}</span>
          </button>
        )
      })}
    </div>
  )
}

export default LanguageSelectorPill
