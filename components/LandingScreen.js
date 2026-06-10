'use client'

import { Heart, Users, Zap, Shield } from 'lucide-react'

export default function LandingScreen({ t, onStart }) {
  const icons = [Heart, Shield, Users, Zap]

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

      <button
        onClick={onStart}
        className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-500 text-white font-semibold text-base shadow-md hover:shadow-lg hover:from-rose-600 hover:to-pink-600 active:scale-95 transition-all duration-200"
      >
        {t.startBtn} →
      </button>

      <p className="text-center text-xs text-gray-400">{t.gottmanNote}</p>
    </div>
  )
}
