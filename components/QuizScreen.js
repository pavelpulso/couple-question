'use client'

import { useState, useEffect } from 'react'
import { pickRandom } from '@/lib/questions'

export default function QuizScreen({ t, lang, onDone }) {
  const [questions] = useState(() => pickRandom(20))
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState([0, 0]) // [p1, p2]
  const [asker, setAsker] = useState(0) // 0 = player1 asks, 1 = player2 asks
  const [answered, setAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(null)
  const [key, setKey] = useState(0) // for animation reset

  const q = questions[index]
  const progress = ((index) / questions.length) * 100
  const answerer = asker === 0 ? 1 : 0

  function handleAnswer(correct) {
    setLastCorrect(correct)
    setAnswered(true)

    if (correct) {
      const pts = q.p
      const newScores = [...scores]
      newScores[answerer] += pts
      setScores(newScores)
    }
  }

  function next() {
    if (index + 1 >= questions.length) {
      onDone({ scores, questions })
      return
    }
    setIndex(i => i + 1)
    setAsker(a => a === 0 ? 1 : 0)
    setAnswered(false)
    setLastCorrect(null)
    setKey(k => k + 1)
  }

  const pointsLabel = (pts) => `+${pts} ${lang === 'ru' ? (pts === 1 ? 'балл' : pts < 5 ? 'балла' : 'баллов') : (pts === 1 ? 'pt' : 'pts')}`

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <ScorePill label={t.player1} score={scores[0]} active={answerer === 0 && !answered} />
          <ScorePill label={t.player2} score={scores[1]} active={answerer === 1 && !answered} />
        </div>
        <span className="text-xs text-gray-400 font-medium">
          {t.questionOf(index + 1, questions.length)}
        </span>
      </div>

      <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        key={key}
        className="float-in bg-white rounded-2xl shadow-sm border border-rose-100 p-6 min-h-[180px] flex flex-col items-center justify-center gap-4"
      >
        <div className="text-xs font-medium text-rose-400 uppercase tracking-wide">
          {asker === 0 ? t.player1 : t.player2} → {answerer === 0 ? t.player1 : t.player2}
        </div>

        <p className="text-gray-800 font-medium text-lg text-center leading-snug">
          {lang === 'ru' ? q.ru : q.en}
        </p>

        <div className="flex items-center gap-1.5 text-xs text-rose-300">
          {Array.from({ length: q.p }).map((_, i) => (
            <span key={i}>♥</span>
          ))}
          <span className="ml-1 text-rose-400">{pointsLabel(q.p)}</span>
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
        <div className="space-y-3 float-in">
          <div className={`rounded-xl p-3 text-center text-sm font-medium ${lastCorrect ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
            {lastCorrect ? `🎉 ${pointsLabel(q.p)} → ${answerer === 0 ? t.player1 : t.player2}` : '💬 ' + (lang === 'ru' ? 'Хорошая тема для разговора!' : 'Great topic to discuss!')}
          </div>
          <button
            onClick={next}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all shadow"
          >
            {index + 1 >= questions.length
              ? (lang === 'ru' ? 'Посмотреть результаты' : 'See Results')
              : (lang === 'ru' ? 'Следующий вопрос →' : 'Next question →')}
          </button>
        </div>
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
