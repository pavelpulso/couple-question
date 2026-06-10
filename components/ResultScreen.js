'use client'

import { useEffect } from 'react'

export default function ResultScreen({ t, result, names, onRestart }) {
  const { scores } = result
  const [s1, s2] = scores
  const winner = s1 > s2 ? 0 : s2 > s1 ? 1 : -1

  useEffect(() => {
    if (typeof window !== 'undefined') {
      import('canvas-confetti').then(({ default: confetti }) => {
        confetti({
          particleCount: 120,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#f43f5e', '#fb7185', '#fda4af', '#fecdd3'],
        })
      })
    }
  }, [])

  const total = s1 + s2
  const pct1 = total > 0 ? Math.round((s1 / total) * 100) : 50
  const pct2 = 100 - pct1

  return (
    <div className="float-in space-y-5">
      <div className="text-center">
        <div className="text-4xl mb-2">{winner === -1 ? '🏆🏆' : '🏆'}</div>
        <h2 className="text-2xl font-bold text-gray-800">{t.resultTitle}</h2>
        <p className="text-rose-500 font-medium mt-1">
          {winner === -1 ? t.resultDraw : t.resultWin(names[winner])}
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5 space-y-4">
        <ScoreRow label={names[0]} score={s1} pct={pct1} color="from-rose-400 to-pink-500" />
        <ScoreRow label={names[1]} score={s2} pct={pct2} color="from-violet-400 to-purple-500" />
      </div>

      <div className="bg-rose-50 border border-rose-100 rounded-2xl p-4">
        <p className="text-sm text-rose-700 leading-relaxed">💬 {t.resultDesc}</p>
      </div>

      <button
        onClick={onRestart}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold shadow-md hover:shadow-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all"
      >
        {t.restartBtn}
      </button>

      <p className="text-center text-xs text-gray-400">{t.gottmanNote}</p>
    </div>
  )
}

function ScoreRow({ label, score, pct, color }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-lg font-bold text-gray-800">{score} pts</span>
      </div>
      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-1000`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
