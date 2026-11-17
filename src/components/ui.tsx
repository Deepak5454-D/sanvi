import { useEffect, useRef, useState, type ReactNode } from 'react'
import { useStore } from '../store'

export const Heart = ({ on, className = 'w-5 h-5' }: { on?: boolean; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill={on ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.6">
    <path d="M12 20.5s-7.5-4.6-7.5-10A4.3 4.3 0 0 1 12 7.8a4.3 4.3 0 0 1 7.5 2.7c0 5.4-7.5 10-7.5 10z" />
  </svg>
)
export const Bag = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6">
    <path d="M5 8h14l-1 12H6L5 8z" /><path d="M9 8V6a3 3 0 0 1 6 0v2" />
  </svg>
)
export const Arrow = ({ dir = 'right', className = 'w-5 h-5' }: { dir?: 'left' | 'right'; className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6" style={{ transform: dir === 'left' ? 'scaleX(-1)' : undefined }}>
    <path d="M4 12h16M14 6l6 6-6 6" />
  </svg>
)
export const Plus = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14" /></svg>
)
export const Close = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 24 24" className={className} fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M6 6l12 12M18 6L6 18" /></svg>
)
export const Play = ({ className = 'w-5 h-5' }) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M8 5v14l11-7z" /></svg>)
export const Pause = ({ className = 'w-5 h-5' }) => (<svg viewBox="0 0 24 24" className={className} fill="currentColor"><path d="M7 5h3.5v14H7zM13.5 5H17v14h-3.5z" /></svg>)

export function WishBtn({ id, className = '' }: { id: string; className?: string }) {
  const { wish, toggleWish } = useStore()
  const on = wish.has(id)
  return (
    <button aria-label="Toggle wishlist" aria-pressed={on} onClick={(e) => { e.stopPropagation(); toggleWish(id) }}
      className={`transition-all duration-300 active:scale-90 hover:scale-110 ${on ? 'text-maroon' : ''} ${className}`}>
      <span key={String(on)} className={`block ${on ? 'pop' : ''}`}><Heart on={on} /></span>
    </button>
  )
}

export function Button({ variant = 'maroon', className = '', ...p }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'maroon' | 'white' | 'outline' }) {
  const v = {
    maroon: 'bg-maroon text-white hover:bg-wine',
    white: 'bg-white text-maroon hover:bg-champagne',
    outline: 'border border-maroon text-maroon hover:bg-maroon hover:text-white',
  }[variant]
  return <button {...p} className={`btn3d label rounded-full px-7 py-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg active:translate-y-0 active:scale-[.97] shadow-sm ${v} ${className}`} />
}

export function SectionHead({ eyebrow, children, dark }: { eyebrow?: string; children: ReactNode; dark?: boolean }) {
  return (
    <div className="text-center">
      {eyebrow && <p className={`label mb-5 ${dark ? 'text-gold' : 'text-gold'}`}>{eyebrow}</p>}
      <h2 className={`font-display text-4xl md:text-6xl leading-tight ${dark ? 'text-white' : 'text-wine'}`}>{children}</h2>
    </div>
  )
}

export function Reveal({ children, className = '' }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); io.disconnect() } }, { threshold: 0.12 })
    ref.current && io.observe(ref.current)
    return () => io.disconnect()
  }, [])
  return <div ref={ref} className={`${className} ${seen ? 'rise' : 'opacity-0'}`}>{children}</div>
}

export function useEscape(fn: () => void, active = true) {
  useEffect(() => {
    if (!active) return
    const h = (e: KeyboardEvent) => e.key === 'Escape' && fn()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [fn, active])
}
