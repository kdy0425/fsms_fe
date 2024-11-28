import React from 'react'
import { Providers } from '@/store/providers'
import MyApp from './app'
import { MessageProvider } from '@/store/MessageContext'
import MessageDisplay from './components/MessageDisplay'

export const metadata = {
  title: 'fsms-fe',
  description: '유가보조금 포털시스템 개발 템플릿',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body>
        <Providers>
          <MessageProvider>
            <MessageDisplay/>
          <MyApp>{children}</MyApp>
          </MessageProvider>
        </Providers>
      </body>
    </html>
  )
}