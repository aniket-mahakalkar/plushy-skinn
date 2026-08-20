'use client'

import type { ReactNode } from 'react'
import { ConfigProvider } from 'antd'

function AdminThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#5e7238', // --tan-deep
          colorLink: '#5e7238',
          colorError: '#8a2e2e', // --danger-text
          colorSuccess: '#3d5a2c', // --success-text
          borderRadius: 8,
          fontFamily:
            'var(--font-inter), system-ui, "Segoe UI", Roboto, sans-serif',
          colorBgLayout: '#faf8ef', // --cream
        },
        components: {
          Layout: {
            siderBg: '#131310', // --ink
            triggerBg: '#131310',
          },
          Menu: {
            darkItemBg: '#131310',
            darkItemSelectedBg: '#5e7238',
            darkItemColor: 'rgba(239, 225, 205, 0.75)',
            darkItemHoverColor: '#faf8ef',
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  )
}

export default AdminThemeProvider
