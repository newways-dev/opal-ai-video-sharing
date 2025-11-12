import { ThemeProvider } from '@/components/theme'
import ReactQueryProvider from '@/react-query'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope } from 'next/font/google'
import type { Metadata } from 'next'
import { ReduxProvider } from '@/redux/provider'
import { Toaster } from 'sonner'
import './globals.css'

const manrope = Manrope({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Opal - AI Video Sharing',
  description: 'Share Videos with your friends',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={manrope.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ReduxProvider>
              <ReactQueryProvider>
                {children}
                <Toaster />
              </ReactQueryProvider>
            </ReduxProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
