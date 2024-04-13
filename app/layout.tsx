import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/provider/theme-provider'
import { ToastProvider } from '@/provider/toast-provider'
import SessionProvider from '@/provider/session-provider'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Kolab',
  description: 'Kolab is a cutting-edge task management SaaS platform, seamlessly combining collaborative workspaces, intuitive task tracking, and efficient team communication to elevate your team&#39s productivity.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <SessionProvider>
        <body className={inter.className}>
          <ToastProvider/>
          <ThemeProvider
              attribute="class"
              defaultTheme="light"
              enableSystem
              disableTransitionOnChange>
            {children}
          </ThemeProvider>
        </body>
      </SessionProvider>
    </html>
  )
}
