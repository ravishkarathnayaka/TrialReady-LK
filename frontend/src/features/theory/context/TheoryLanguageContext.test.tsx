import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import React from 'react'
import {
  TheoryLanguageProvider,
  useTheoryLanguage,
} from './TheoryLanguageContext'
import type { TheoryQuestion } from '../types/theory'

describe('TheoryLanguageContext', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
    <TheoryLanguageProvider>{children}</TheoryLanguageProvider>
  )

  const sampleQuestion: TheoryQuestion = {
    id: 'q-1',
    category: 'road_signs_regulatory',
    question_text: 'What does a red circular traffic sign indicate?',
    options: ['Prohibition / Mandatory Order', 'Warning / Hazard', 'Information / Direction', 'Priority'],
    correct_option_index: 0,
    explanation: 'Red circular signs are prohibitive or mandatory.',
    translations: {
      si: {
        question_text: 'රතු වෘත්තාකාර මාර්ග සංඥාවකින් පෙන්නුම් කරන්නේ කුමක්ද?',
        options: ['තහනම් / අනිවාර්ය නියෝග', 'අනතුරු ඇඟවීම', 'තොරතුරු / මඟපෙන්වීම', 'ප්‍රමුඛතාව'],
        explanation: 'රතු වෘත්තාකාර සංඥා තහනම් හෝ අනිවාර්ය නියෝග වේ.',
      },
      ta: {
        question_text: 'சிவப்பு வட்ட போக்குவரத்து அடையாளம் எதைக் குறிக்கிறது?',
        options: ['தடை / கட்டாய உத்தரவு', 'எச்சரிக்கை', 'தகவல் / வழிகாட்டுதல்', 'முன்னுரிமை'],
        explanation: 'சிவப்பு வட்ட அடையாளங்கள் தடைகள் அல்லது கட்டாய உத்தரவுகள் ஆகும்.',
      },
    },
  }

  it('defaults to English language and provides original text', () => {
    const { result } = renderHook(() => useTheoryLanguage(), { wrapper })
    expect(result.current.language).toBe('en')

    const localized = result.current.getLocalizedQuestion(sampleQuestion)
    expect(localized.question_text).toBe('What does a red circular traffic sign indicate?')
    expect(localized.options[0]).toBe('Prohibition / Mandatory Order')
  })

  it('switches to Sinhala and provides Sinhala translations', () => {
    const { result } = renderHook(() => useTheoryLanguage(), { wrapper })

    act(() => {
      result.current.setLanguage('si')
    })

    expect(result.current.language).toBe('si')
    const localized = result.current.getLocalizedQuestion(sampleQuestion)
    expect(localized.question_text).toContain('රතු වෘත්තාකාර')
    expect(localized.options[0]).toContain('තහනම්')
  })

  it('switches to Tamil and provides Tamil translations', () => {
    const { result } = renderHook(() => useTheoryLanguage(), { wrapper })

    act(() => {
      result.current.setLanguage('ta')
    })

    expect(result.current.language).toBe('ta')
    const localized = result.current.getLocalizedQuestion(sampleQuestion)
    expect(localized.question_text).toContain('சிவப்பு வட்ட')
    expect(localized.options[0]).toContain('தடை')
  })
})
