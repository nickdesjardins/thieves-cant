import type { Metadata } from 'next'
import { UnifrakturCook, Crimson_Text } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { I18nProvider } from '@/lib/i18n'
import { Navigation } from "@/components/navigation";
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
    icon: '/favicon.png',
    apple: '/favicon.png',
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
          <Navigation />
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
