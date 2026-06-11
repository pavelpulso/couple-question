'use client'

import { useState } from 'react'
import { translations } from '@/lib/i18n'
import LandingScreen from '@/components/LandingScreen'
import QuizScreen from '@/components/QuizScreen'
import ResultScreen from '@/components/ResultScreen'

export default function Home() {
  const [lang, setLang] = useState('en')
  const [screen, setScreen] = useState('landing')
  const [count, setCount] = useState(20)
  const [names, setNames] = useState(['', ''])
  const [result, setResult] = useState(null)
  const t = translations[lang]

  function handleStart({ count: c, names: n }) {
    setCount(c)
    setNames(n)
    setScreen('quiz')
  }

  return (
    <main className="min-h-screen flex flex-col items-center py-8 px-4">
      <div className="w-full max-w-lg">
        <div className="flex justify-end mb-4 gap-1">
          {['en', 'es', 'ru'].map(l => (
            <button
              key={l}
              onClick={() => setLang(l)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full border transition-colors shadow-sm uppercase tracking-wide ${
                lang === l
                  ? 'bg-rose-500 border-rose-500 text-white'
                  : 'bg-white/80 backdrop-blur border-rose-200 text-rose-500 hover:bg-rose-50'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {screen === 'landing' && (
          <LandingScreen t={t} onStart={handleStart} />
        )}
        {screen === 'quiz' && (
          <QuizScreen
            key={`${count}-${names.join('-')}`}
            t={t}
            lang={lang}
            count={count}
            names={names}
            onDone={(r) => { setResult(r); setScreen('result') }}
          />
        )}
        {screen === 'result' && (
          <ResultScreen
            t={t}
            result={result}
            names={names}
            onRestart={() => setScreen('landing')}
          />
        )}
      </div>
    </main>
  )
}
