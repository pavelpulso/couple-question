'use client'

import { useState } from 'react'
import { pickRandom } from '@/lib/questions'

// round 0: P1 asks P2; round 1: P2 asks P1
// asker idx:   round 0 → 0, round 1 → 1
// answerer idx: round 0 → 1, round 1 → 0
// correct: answerer += q.p, asker += 1; wrong: nobody scores

export default function QuizScreen({ t, lang, onDone }) {
  const [questions] = useState(() => pickRandom(20))
  const [round, setRound] = useState(0)             // 0 or 1
  const [index, setIndex] = useState(0)
  const [scores, setScores] = useState([0, 0])      // [p1, p2]
  const [history, setHistory] = useState([])        // [{scoreDelta: [d0,d1]}]
  const [answered, setAnswered] = useState(false)
  const [lastCorrect, setLastCorrect] = useState(null)
  const [animKey, setAnimKey] = useState(0)
  const [showTransition, setShowTransition] = useState(false)

  const q = questions[index]
  const askerIdx = round        // round 0 → P1 asks, round 1 → P2 asks
  const answererIdx = 1 - round
  const askerName = askerIdx === 0 ? t.player1 : t.player2
  const answererName = answererIdx === 0 ? t.player1 : t.player2
  const totalSteps = questions.length * 2
  const doneSteps = round * questions.length + index
  const progress = (doneSteps / totalSteps) * 100

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
    const newScores = [scores[0] + delta[0], scores[1] + delta[1]]
    setScores(newScores)
    setHistory(h => [...h, { delta, round, index }])
    setLastCorrect(correct)
    setAnswered(true)
  }

  function goNext() {
    const isLastInRound = index + 1 >= questions.length
    if (isLastInRound && round === 0) {
      setShowTransition(true)
      setAnswered(false)
      setLastCorrect(null)
      return
    }
    if (isLastInRound && round === 1) {
      onDone({ scores, questions })
      return
    }
    setIndex(i => i + 1)
    setAnswered(false)
    setLastCorrect(null)
    setAnimKey(k => k + 1)
  }

  function startRound2() {
    setRound(1)
    setIndex(0)
    setShowTransition(false)
    setAnimKey(k => k + 1)
  }

  function goBack() {
    if (history.length === 0) return
    const last = history[history.length - 1]
    setHistory(h => h.slice(0, -1))
    setScores([scores[0] - last.delta[0], scores[1] - last.delta[1]])
    // if going back across round boundary
    if (last.round !== round) {
      setRound(last.round)
      setShowTransition(false)
    }
    setIndex(last.index)
    setAnswered(false)
    setLastCorrect(null)
    setAnimKey(k => k + 1)
  }

  if (showTransition) {
    const nextAsker = t.player2
    const nextAnswerer = t.player1
    return (
      <div className="float-in space-y-5 text-center">
        <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-8 space-y-3">
          <div className="text-4xl">🔄</div>
          <h2 className="text-xl font-bold text-gray-800">{t.roundTransitionTitle(nextAsker)}</h2>
          <p className="text-gray-500 text-sm">{t.roundTransitionDesc(nextAsker, nextAnswerer)}</p>
          <div className="flex justify-center gap-6 pt-2">
            <ScorePill label={t.player1} score={scores[0]} active={false} />
            <ScorePill label={t.player2} score={scores[1]} active={false} />
          </div>
        </div>
        <button
          onClick={startRound2}
          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-md hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all"
        >
          {t.roundTransitionBtn}
        </button>
        {history.length > 0 && (
          <button onClick={goBack} className="w-full py-2.5 rounded-2xl bg-gray-100 text-gray-600 font-medium hover:bg-gray-200 active:scale-95 transition-all text-sm">
            {t.backBtn}
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex gap-3">
          <ScorePill label={t.player1} score={scores[0]} active={answererIdx === 0 && !answered} />
          <ScorePill label={t.player2} score={scores[1]} active={answererIdx === 1 && !answered} />
        </div>
        <div className="text-right">
          <div className="text-xs text-rose-400 font-medium">{t.round(round + 1)}</div>
          <div className="text-xs text-gray-400">{t.questionOf(index + 1, questions.length)}</div>
        </div>
      </div>

      <div className="h-1.5 bg-rose-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-rose-400 to-pink-400 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div
        key={animKey}
        className="float-in bg-white rounded-2xl shadow-sm border border-rose-100 p-6 min-h-[190px] flex flex-col items-center justify-center gap-4"
      >
        <div className="flex gap-3 text-xs font-medium text-rose-400 uppercase tracking-wide">
          <span>{t.askerLabel(askerName)}</span>
          <span className="text-rose-200">·</span>
          <span>{t.answererLabel(answererName)}</span>
        </div>

        <p className="text-gray-800 font-medium text-lg text-center leading-snug">
          {lang === 'ru' ? q.ru : q.en}
        </p>

        <div className="flex items-center gap-1 text-xs text-rose-300">
          {Array.from({ length: Math.min(q.p, 5) }).map((_, i) => (
            <span key={i}>♥</span>
          ))}
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
            {index + 1 >= questions.length && round === 1
              ? (lang === 'ru' ? 'Посмотреть результаты' : 'See Results')
              : (lang === 'ru' ? 'Следующий →' : 'Next →')}
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
