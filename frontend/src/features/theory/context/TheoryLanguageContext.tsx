import React, { createContext, useContext, useState } from 'react'
import type { TheoryLanguage, TheoryQuestion } from '../types/theory'

interface TheoryLanguageContextType {
  language: TheoryLanguage
  setLanguage: (lang: TheoryLanguage) => void
  getLocalizedQuestion: (q: TheoryQuestion) => {
    question_text: string
    options: string[]
    explanation: string
  }
}

const TheoryLanguageContext = createContext<TheoryLanguageContextType | null>(
  null,
)

const STORAGE_KEY = 'trialready_theory_language'

export const TheoryLanguageProvider: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  const [language, setLanguageState] = useState<TheoryLanguage>(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'en' || saved === 'si' || saved === 'ta') {
      return saved
    }
    return 'en'
  })

  const setLanguage = (lang: TheoryLanguage) => {
    setLanguageState(lang)
    localStorage.setItem(STORAGE_KEY, lang)
  }

  const getLocalizedQuestion = (q: TheoryQuestion) => {
    if (q.translations && q.translations[language]) {
      const trans = q.translations[language]!
      return {
        question_text: trans.question_text || q.question_text,
        options: trans.options?.length === q.options.length ? trans.options : q.options,
        explanation: trans.explanation || q.explanation,
      }
    }
    return {
      question_text: q.question_text,
      options: q.options,
      explanation: q.explanation,
    }
  }

  return (
    <TheoryLanguageContext.Provider
      value={{ language, setLanguage, getLocalizedQuestion }}
    >
      {children}
    </TheoryLanguageContext.Provider>
  )
}

export function useTheoryLanguage() {
  const context = useContext(TheoryLanguageContext)
  if (!context) {
    // Fallback if not within provider
    return {
      language: 'en' as TheoryLanguage,
      setLanguage: () => {},
      getLocalizedQuestion: (q: TheoryQuestion) => ({
        question_text: q.question_text,
        options: q.options,
        explanation: q.explanation,
      }),
    }
  }
  return context
}
