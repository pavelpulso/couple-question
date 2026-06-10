'use client'

import { useState } from 'react'

export default function LandingScreen({ t, onStart }) {
  const defaultCount = t.countOptions.find(o => o.default)?.value ?? 20
  const [count, setCount] = useState(defaultCount)
  const [names, setNames] = useState(['', ''])

  const n1 = names[0].trim() || t.player1
  const n2 = names[1].trim() || t.player2

  return (
    <div className="float-in space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-rose-100 mb-2">
          <span className="text-3xl heartbeat">❤️</span>
        </div>
        <h1 className="text-3xl font-bold text-rose-700 tracking-tight">{t.title}</h1>
        <p className="text-rose-500 font-medium">{t.subtitle}</p>
        <p className="text-gray-500 text-sm">{t.tagline}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800 text-base">{t.whyTitle}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{t.whyText}</p>
        <ul className="space-y-2 pt-1">
          {t.whyPoints.map((point, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
              <span className="mt-0.5 flex-shrink-0 w-5 h-5 rounded-full bg-rose-100 flex items-center justify-center">
                {['💛', '🕊️', '🤝', '✨'][i]}
              </span>
              {point}
            </li>
          ))}
        </ul>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5">
        <h2 className="font-semibold text-gray-800 text-base mb-2">{t.howToPlay}</h2>
        <p className="text-gray-600 text-sm leading-relaxed">{t.howToPlayText}</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800 text-base">{t.nameTitle}</h2>
        <div className="grid grid-cols-2 gap-3">
          {[0, 1].map(i => (
            <input
              key={i}
              type="text"
              maxLength={20}
              placeholder={i === 0 ? t.namePlaceholder1 : t.namePlaceholder2}
              value={names[i]}
              onChange={e => setNames(prev => prev.map((v, j) => j === i ? e.target.value : v))}
              className="w-full px-4 py-2.5 rounded-xl border-2 border-gray-100 bg-gray-50 text-gray-800 placeholder-gray-400 focus:outline-none focus:border-rose-300 focus:bg-white transition-all text-sm"
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-rose-100 p-5 space-y-3">
        <h2 className="font-semibold text-gray-800 text-base">{t.countLabel}</h2>
        <div className="grid grid-cols-4 gap-2">
          {t.countOptions.map(opt => (
            <button
              key={opt.value}
              onClick={() => setCount(opt.value)}
              className={`flex flex-col items-center py-3 rounded-xl border-2 transition-all ${
                count === opt.value
                  ? 'border-rose-400 bg-rose-50 text-rose-700'
                  : 'border-gray-100 bg-gray-50 text-gray-600 hover:border-rose-200'
              }`}
            >
              <span className="text-xl font-bold">{opt.label}</span>
              <span className="text-[10px] mt-0.5 text-center leading-tight opacity-70">{opt.sublabel}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => onStart({ count, names: [n1, n2] })}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base shadow-md hover:shadow-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all duration-200"
      >
        {t.startBtn} →
      </button>

      <p className="text-center text-xs text-gray-400">{t.gottmanNote}</p>
    </div>
  )
}
