'use client'

import type { ReactNode } from 'react'
import { ConfigProvider } from 'antd'

function SiteThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5e7238', // --tan-deep
          colorLink: '#5e7238',
          colorError: '#8a2e2e', // --danger-text
          colorSuccess: '#3d5a2c', // --success-text
          borderRadius: 3, // --radius
          fontFamily: 'var(--font-inter), system-ui, "Segoe UI", Roboto, sans-serif',
          colorBgContainer: '#ffffff', // --paper
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default SiteThemeProvider
