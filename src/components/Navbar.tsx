import { useEffect, useState } from 'react'
import { useStore } from '../store'
import { Bag, Close, Heart } from './ui'
import { fmt } from '../data'

const LINKS = [['Home', '#home'], ['Collections', '#archive'], ['Try the Look', '#look'], ['The Rack', '#rack'], ['Bridal', '#bridal'], ['Our Story', '#story']]

export default function Navbar() {
  const { count, wish, setBagOpen } = useStore()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState('#home')
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) setActive('#' + e.target.id) }), { rootMargin: '-45% 0px -50% 0px' })
    LINKS.forEach(([, h]) => { const el = document.querySelector(h); el && io.observe(el) })
    return () => io.disconnect()
  }, [])
  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 40)
    h(); window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])
  return (
    <header className="fixed top-4 inset-x-0 z-40 px-4 nav-in [perspective:1000px]">
      <nav className={`mx-auto max-w-6xl rounded-full border border-gold/50 backdrop-blur-xl transition-all duration-500 flex items-center justify-between px-6 ${scrolled ? 'bg-wine/80 py-2.5 shadow-[0_22px_40px_-14px_rgba(0,0,0,.55)] [transform:rotateX(1.5deg)]' : 'bg-white/10 py-4 shadow-[0_10px_30px_-12px_rgba(0,0,0,.35)]'} text-white`}>
        <a href="#home" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 shrink-0 aspect-square rounded-full border border-gold/70 bg-white p-1 shadow-[0_0_15px_rgba(198,161,91,0.3)] overflow-hidden flex items-center justify-center transition-transform duration-300 group-hover:scale-105">
            <img src="/brand/swan-logo.png" alt="SANVI Swan Logo" className="w-full h-full object-contain" />
          </div>
          <span className="font-display text-xl tracking-[0.35em] text-white group-hover:text-champagne transition-colors">SANVI</span>
        </a>
        <ul className="hidden lg:flex gap-8">
          {LINKS.map(([l, h]) => (
            <li key={l}><a href={h} className={`nav-link label !text-[10px] !tracking-[0.2em] opacity-90 hover:text-champagne transition-colors ${active === h ? 'active' : ''}`}>{l}</a></li>
          ))}
        </ul>
        <div className="flex items-center gap-4">
          <span className="icon3d relative hidden sm:block" title="Wishlist">
            <Heart className="w-5 h-5" />
            {wish.size > 0 && <span className="absolute -top-2 -right-2 text-[9px] bg-gold text-wine rounded-full w-4 h-4 grid place-items-center">{wish.size}</span>}
          </span>
          <button onClick={() => setBagOpen(true)} className="icon3d relative" aria-label="Open bag">
            <Bag />
            <span key={count} className={`absolute -top-2 -right-2 text-[9px] bg-gold text-wine rounded-full w-4 h-4 grid place-items-center ${count ? 'pop' : ''}`}>{count}</span>
          </button>
          <a href="#bridal" className="label !text-[10px] hidden md:block rounded-full bg-white text-maroon px-5 py-2.5 hover:bg-champagne hover:-translate-y-0.5 active:scale-95 transition-all duration-300">Visit the Store</a>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">
            {open ? <Close /> : <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 8h16M4 16h16" /></svg>}
          </button>
        </div>
      </nav>
      {open && (
        <div className="lg:hidden mx-auto max-w-6xl mt-2 rounded-3xl border border-gold/50 bg-wine/95 backdrop-blur-xl p-6 text-white rise">
          {LINKS.map(([l, h]) => (
            <a key={l} href={h} onClick={() => setOpen(false)} className="block py-3 label border-b border-white/10 last:border-0">{l}</a>
          ))}
        </div>
      )}
    </header>
  )
}

export function BagDrawer() {
  const { bagOpen, setBagOpen, bag, remove, toast } = useStore()
  const total = bag.reduce((a, b) => a + b.price * b.qty, 0)
  return (
    <>
      {toast && <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[70] bg-wine text-champagne label !tracking-[0.18em] px-6 py-3 rounded-full shadow-2xl rise border border-gold/50">{toast}</div>}
      {bagOpen && (
        <div className="fixed inset-0 z-[60]" role="dialog">
          <div className="absolute inset-0 bg-black/50" style={{ animation: 'fadeIn .3s' }} onClick={() => setBagOpen(false)} />
          <aside className="absolute right-0 top-0 h-full w-full max-w-md bg-ivory p-8 flex flex-col shadow-2xl" style={{ animation: 'drawerIn .5s cubic-bezier(.22,.61,.36,1)' }}>
            <div className="flex justify-between items-center mb-8">
              <h3 className="font-display text-3xl text-wine">Your Bag</h3>
              <button onClick={() => setBagOpen(false)} aria-label="Close"><Close /></button>
            </div>
            <div className="flex-1 overflow-auto">
              {bag.length === 0 && <p className="font-serif text-xl text-charcoal/60">Your bag is empty. Pick a silk to begin.</p>}
              {bag.map((b) => (
                <div key={b.id + (b.size ?? '')} className="tick flex justify-between py-4 border-b border-gold/30">
                  <div>
                    <p className="label !text-[11px]">{b.name}</p>
                    <p className="font-serif text-charcoal/60">Qty {b.qty}{b.size && ` · Size ${b.size}`}</p>
                    <button onClick={() => remove(b.id + (b.size ?? ''))} className="text-xs underline text-maroon mt-1">Remove</button>
                  </div>
                  <p className="font-serif text-xl">{fmt(b.price * b.qty)}</p>
                </div>
              ))}
            </div>
            <div className="pt-6 border-t border-gold/40">
              <div className="flex justify-between font-serif text-2xl mb-4"><span>Total</span><span>{fmt(total)}</span></div>
              <p className="text-xs text-charcoal/50 text-center">Prototype only. Checkout is not connected.</p>
            </div>
          </aside>
        </div>
      )}
    </>
  )
}
