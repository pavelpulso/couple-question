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
        <div className="flex justify-end mb-4">
          <button
            onClick={() => setLang(l => l === 'ru' ? 'en' : 'ru')}
            className="px-3 py-1.5 text-sm font-medium rounded-full bg-white/80 backdrop-blur border border-rose-200 text-rose-600 hover:bg-rose-50 transition-colors shadow-sm"
          >
            {t.langSwitch}
          </button>
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
