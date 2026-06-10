'use client'

import { useState } from 'react'
import { pickRandom } from '@/lib/questions'

// Per question: subStep 0 = P1 asks P2, subStep 1 = P2 asks P1 (same question)
// correct: answerer += q.p, asker += 1 | wrong: nobody scores

export default function QuizScreen({ t, lang, count, onDone }) {
  const [questions] = useState(() => pickRandom(count))
  const [index, setIndex] = useState(0)
  const [subStep, setSubStep] = useState(0)   // 0 or 1
  const [scores, setScores] = useState([0, 0])
  const [history, setHistory] = useState([])  // [{delta, index, subStep}]
  const [answered, setAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(null)
  const [animKey, setAnimKey] = useState(0)

  const q = questions[index]
  const askerIdx    = subStep          // subStep 0 → P1, subStep 1 → P2
  const answererIdx = 1 - subStep
  const askerName    = askerIdx === 0 ? t.player1 : t.player2
  const answererName = answererIdx === 0 ? t.player1 : t.player2

  const totalSteps = questions.length * 2
  const doneSteps  = index * 2 + subStep
  const progress   = (doneSteps / totalSteps) * 100

  function ptsLabel(n) {
    if (lang === 'ru') return `+${n} ${n === 1 ? 'балл' : n < 5 ? 'балла' : 'баллов'}`
    return `+${n} ${n === 1 ? 'pt' : 'pts'}`
  }

  function handleAnswer(correct) {
    const delta = [0, 0]
    if (correct) {
      delta[answererIdx] = q.p
      delta[askerIdx] = 1
    }
    setScores(s => [s[0] + delta[0], s[1] + delta[1]])
    setHistory(h => [...h, { delta, index, subStep }])
    setLastCorrect(correct)
    setAnswered(true)
  }

  function goNext() {
    if (subStep === 0) {
      setSubStep(1)
      setAnswered(false)
      setLastCorrect(null)
      setAnimKey(k => k + 1)
    } else {
      if (index + 1 >= questions.length) {
        onDone({ scores: [scores[0], scores[1]], questions })
        return
      }
      setIndex(i => i + 1)
      setSubStep(0)
      setAnswered(false)
      setLastCorrect(null)
      setAnimKey(k => k + 1)
    }
  }

  function goBack() {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setScores(s => [s[0] - last.delta[0], s[1] - last.delta[1]])
    setIndex(last.index)
    setSubStep(last.subStep)
    setAnswered(false)
    setLastCorrect(null)
    setAnimKey(k => k + 1)
  }

  const isLastStep = index + 1 >= questions.length && subStep === 1

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <ScorePill label={t.player1} score={scores[0]} active={answererIdx === 0 && !answered} />
          <ScorePill label={t.player2} score={scores[1]} active={answererIdx === 1 && !answered} />
        </div>
        <div className="text-right">
          <div className="text-xs text-gray-400">{t.questionOf(index + 1, questions.length)}</div>
        </div>
      </div>

      <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* subStep indicator */}
      <div className="flex rounded-xl overflow-hidden border border-rose-100">
        <div className={`flex-1 py-1.5 text-center text-xs font-medium transition-colors ${subStep === 0 ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-300'}`}>
          {t.player1} → {t.player2}
        </div>
        <div className={`flex-1 py-1.5 text-center text-xs font-medium transition-colors ${subStep === 1 ? 'bg-rose-500 text-white' : 'bg-rose-50 text-rose-300'}`}>
          {t.player2} → {t.player1}
        </div>
      </div>

      <div
        key={animKey}
        className="float-in bg-white rounded-2xl shadow-sm border border-rose-100 p-6 min-h-[170px] flex flex-col items-center justify-center gap-4"
      >
        <div className="text-xs font-medium text-rose-400 uppercase tracking-wide">
          {t.askerLabel(askerName)} · {t.answererLabel(answererName)}
        </div>

        <p className="text-gray-800 font-medium text-lg text-center leading-snug">
          {lang === 'ru' ? q.ru : q.en}
        </p>

        <div className="flex items-center gap-1 text-xs text-rose-300">
          {Array.from({ length: Math.min(q.p, 5) }).map((_, i) => <span key={i}>♥</span>)}
          <span className="ml-1 text-rose-400">{ptsLabel(q.p)}</span>
        </div>
      </div>

      {!answered ? (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => handleAnswer(true)}
            className="py-3.5 rounded-2xl bg-emerald-500 text-white font-semibold shadow hover:bg-emerald-600 active:scale-95 transition-all"
          >
            ✓ {t.correctBtn}
          </button>
          <button
            onClick={() => handleAnswer(false)}
            className="py-3.5 rounded-2xl bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 active:scale-95 transition-all"
          >
            ✗ {t.wrongBtn}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5 float-in">
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${lastCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
            {lastCorrect
              ? `🎉 ${ptsLabel(q.p)} → ${answererName}  ·  +1 → ${askerName}`
              : `💬 ${lang === 'ru' ? 'Хорошая тема для разговора!' : 'Great topic to discuss!'}`}
          </div>
          <button
            onClick={goNext}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all shadow"
          >
            {isLastStep
              ? (lang === 'ru' ? 'Посмотреть результаты' : 'See Results')
              : subStep === 0
                ? (lang === 'ru' ? 'Теперь меняемся →' : 'Switch roles →')
                : (lang === 'ru' ? 'Следующий вопрос →' : 'Next question →')}
          </button>
        </div>
      )}

      {history.length > 0 && (
        <button
          onClick={goBack}
          className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-500 font-medium hover:bg-gray-200 active:scale-95 transition-all text-sm"
        >
          {t.backBtn}
        </button>
      )}
    </div>
  )
}

function ScorePill({ label, score, active }) {
  return (
    <div className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${active ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-300' : 'bg-gray-100 text-gray-600'}`}>
      {label}: <span className="font-bold">{score}</span>
    </div>
  )
}
