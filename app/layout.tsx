import type { Metadata } from 'next'
import { UnifrakturCook, Crimson_Text } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n'
import { Footer } from '@/components/footer'
import './globals.css'

const _unifraktur = UnifrakturCook({ 
  weight: '700',
  subsets: ["latin"],
  variable: '--font-display'
});

const _crimson = Crimson_Text({ 
  weight: ['400', '600', '700'],
  subsets: ["latin"],
  variable: '--font-body'
});

export const metadata: Metadata = {
  title: "Thieves' Cant Translator | D&D 5e Rogue's Companion",
  description: "Translate English or French to Thieves Cant for your D&D 5e Rogue character. Includes dictionary, symbols, and hobo signs.",
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${_unifraktur.variable} ${_crimson.variable} font-serif antialiased min-h-screen flex flex-col`}>
        <I18nProvider>
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  )
}
