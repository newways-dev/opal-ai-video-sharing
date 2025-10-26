import { ThemeProvider } from '@/components/theme'
import ReactQueryProvider from '@/react-query'
import { ClerkProvider } from '@clerk/nextjs'
import { Manrope } from 'next/font/google'
import type { Metadata } from 'next'
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
        <body className={`${manrope.className} bg-[#171717]`}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <ReactQueryProvider>{children}</ReactQueryProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
