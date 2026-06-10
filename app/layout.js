import './globals.css'

export const metadata = {
  title: 'Love Map / Карта любви',
  description: 'A Gottman-inspired quiz game for couples | Викторина для пар по методу Готмана',
  openGraph: {
    title: 'Love Map Quiz',
    description: 'How well do you know your partner?',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-fuchsia-50">
        {children}
      </body>
    </html>
  )
}
