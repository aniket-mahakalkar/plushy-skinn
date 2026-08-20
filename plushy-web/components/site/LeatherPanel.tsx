'use client'

import './LeatherPanel.css'

interface LeatherPanelProps {
  color: string
  monogram?: string
  stitch?: boolean
  className?: string
}

function shade(hex: string, amount: number) {
  const n = hex.replace('#', '')
  const num = parseInt(n, 16)
  const r = Math.min(255, Math.max(0, (num >> 16) + amount))
  const g = Math.min(255, Math.max(0, ((num >> 8) & 0xff) + amount))
  const b = Math.min(255, Math.max(0, (num & 0xff) + amount))
  return `rgb(${r}, ${g}, ${b})`
}

function LeatherPanel({ color, monogram, stitch = true, className = '' }: LeatherPanelProps) {
  const light = shade(color, 30)
  const dark = shade(color, -35)

  return (
    <div
      className={`leather-panel ${stitch ? 'leather-panel--stitch' : ''} ${className}`}
      role="img"
      aria-label={`${monogram ?? 'leather'} product visual`}
      style={{
        backgroundColor: color,
        backgroundImage: `
          repeating-radial-gradient(circle at 0 0, rgba(255,255,255,0.05) 0, rgba(255,255,255,0.05) 1px, transparent 1px, transparent 7px),
          radial-gradient(ellipse at 50% 105%, rgba(0,0,0,0.3), transparent 65%),
          radial-gradient(circle at 28% 22%, rgba(255,255,255,0.24), transparent 45%),
          linear-gradient(135deg, ${light} 0%, ${color} 55%, ${dark} 100%)
        `,
        borderColor: `${light}66`,
      }}
    >
      {monogram && (
        <span className="leather-panel__monogram" style={{ color: light, textShadow: `1px 1px 0 ${dark}` }}>
          {monogram}
        </span>
      )}
    </div>
  )
}

export default LeatherPanel
