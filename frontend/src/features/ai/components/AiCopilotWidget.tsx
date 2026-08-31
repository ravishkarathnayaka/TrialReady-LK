import React, { useState } from 'react'
import { COPILOT_KNOWLEDGE_BASE } from '../data/copilotKnowledgeBase'
import type { TheoryLanguage } from '../../theory/types/theory'

interface ChatMessage {
  id: string
  sender: 'user' | 'ai'
  text: string
  timestamp: string
}

export const AiCopilotWidget: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [language, setLanguage] = useState<TheoryLanguage>('en')
  const [inputQuery, setInputQuery] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'ai',
      text:
        '👋 Ayubowan / Vanakkam! I am your **TrialReady AI Copilot**. Ask me anything about the Sri Lanka Highway Code, DMT practical trial maneuvers (Hill Start, Reverse S-Bend), or permit regulations in English, Sinhala, or Tamil!',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ])
  const [isTyping, setIsTyping] = useState(false)

  const quickPrompts = [
    { label: '🔄 Roundabout Priority', query: 'Who has right of way at a roundabout?' },
    { label: '⛰️ Hill Start Tips', query: 'How do I do a perfect Hill Start without rollback?' },
    { label: '📅 6-Month Permit Rules', query: 'How long is a DMT Learner Permit valid?' },
    { label: '↩️ Reverse S-Bend', query: 'What are the examiner checkpoints for Reverse S-Bend?' },
  ]

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim()
    if (!query) return

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputQuery('')
    setIsTyping(true)

    // Match against Copilot knowledge base
    setTimeout(() => {
      const lowerQuery = query.toLowerCase()
      const matched = COPILOT_KNOWLEDGE_BASE.find((item) =>
        item.keywords.some((kw) => lowerQuery.includes(kw.toLowerCase())),
      )

      let aiResponseText = ''
      if (matched) {
        aiResponseText = matched.answer[language] || matched.answer.en
      } else {
        if (language === 'si') {
          aiResponseText = `🤖 මම ඔබේ ප්‍රශ්නය විශ්ලේෂණය කළෙමි: "${query}". ශ්‍රී ලංකා DMT මාර්ග නීති සංග්‍රහයට අනුව, මාර්ග සංඥා සහ ආරක්ෂිත දුර පිළිබඳ නීති පිළිපදින්න. කරුණාකර Theory Practice Hub වෙතින් වැඩිදුර පුහුණුවන්න.`
        } else if (language === 'ta') {
          aiResponseText = `🤖 உங்கள் கேள்வியை ஆய்வு செய்தேன்: "${query}". இலங்கை DMT போக்குவரத்து விதிகளின்படி, போக்குவரத்து அடையாளங்கள் மற்றும் வேக வரம்புகளைப் பின்பற்றுங்கள்.`
        } else {
          aiResponseText = `🤖 AI Analysis: "${query}". According to the Sri Lanka Motor Traffic Act & Highway Code, ensure strict adherence to road signs, speed limits, and 2-second following distance. Practice additional mock questions in the Theory Hub for optimal preparation!`
        }
      }

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: aiResponseText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }

      setMessages((prev) => [...prev, aiMsg])
      setIsTyping(false)
    }, 600)
  }

  return (
    <div className="fixed bottom-5 right-5 z-40 print:hidden font-sans">
      {/* Floating Pill Toggle Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="group flex items-center gap-2.5 rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 px-5 py-3 text-white shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 cursor-pointer border border-white/20"
        >
          <span className="text-xl animate-bounce">🤖</span>
          <div className="text-left">
            <p className="text-xs font-black tracking-wide leading-none">AI Copilot</p>
            <p className="text-[10px] text-blue-100 font-medium leading-tight">Highway Code Assistant</p>
          </div>
          <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse ml-1" />
        </button>
      )}

      {/* Expanded Chat Dialog */}
      {isOpen && (
        <div className="flex flex-col w-[380px] sm:w-[420px] h-[540px] rounded-3xl bg-white shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 px-5 py-4 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-lg shadow-inner">
                🤖
              </div>
              <div>
                <h3 className="text-xs font-black tracking-tight flex items-center gap-1.5">
                  TrialReady AI Copilot
                  <span className="rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] px-1.5 py-0.5 border border-emerald-500/30">
                    Online
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400">Sri Lanka DMT Highway Code Assistant</p>
              </div>
            </div>

            {/* Language Switcher & Close */}
            <div className="flex items-center gap-2">
              <div className="flex rounded-lg bg-slate-800/80 p-0.5 border border-slate-700 text-[10px] font-bold">
                {(['en', 'si', 'ta'] as const).map((lang) => (
                  <button
                    key={lang}
                    type="button"
                    onClick={() => setLanguage(lang)}
                    className={`px-1.5 py-0.5 rounded-md transition-all cursor-pointer ${
                      language === lang ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="h-7 w-7 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition-colors cursor-pointer text-xs"
              >
                ✕
              </button>
            </div>
          </div>

          {/* Quick Prompts Bar */}
          <div className="flex gap-1.5 overflow-x-auto p-2 bg-slate-50 border-b border-slate-200 no-scrollbar">
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSend(p.query)}
                className="shrink-0 rounded-full border border-slate-300 bg-white px-2.5 py-1 text-[10px] font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer shadow-2xs"
              >
                {p.label}
              </button>
            ))}
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed shadow-xs ${
                    msg.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-xs'
                      : 'bg-white text-slate-800 border border-slate-200 rounded-bl-xs'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>
                <span className="text-[9px] text-slate-400 mt-1 px-1">{msg.timestamp}</span>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-white border border-slate-200 rounded-2xl px-3 py-2 w-24 shadow-2xs">
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.2s]" />
                <span className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Chat Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleSend()
            }}
            className="p-3 bg-white border-t border-slate-200 flex items-center gap-2"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={
                language === 'si'
                  ? 'DMT හෝ මාර්ග නීති පිළිබඳ අසන්න...'
                  : language === 'ta'
                  ? 'DMT அல்லது போக்குவரத்து விதிகள் பற்றி கேட்கவும்...'
                  : 'Ask about Highway Code, Hill Start, Permit rules...'
              }
              className="flex-1 rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-xs text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-blue-500 focus:outline-hidden transition-all"
            />
            <button
              type="submit"
              disabled={!inputQuery.trim() || isTyping}
              className="rounded-xl bg-blue-600 px-3.5 py-2 text-xs font-bold text-white hover:bg-blue-700 disabled:opacity-50 transition-all cursor-pointer shadow-xs"
            >
              ➤
            </button>
          </form>
        </div>
      )}
    </div>
  )
}

export default AiCopilotWidget
