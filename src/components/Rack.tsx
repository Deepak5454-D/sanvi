import { useCallback, useEffect, useState } from 'react'
import { FILTERS, PIECES, fmt, img, type Piece } from '../data'
import { useStore } from '../store'
import { Arrow, Close, Reveal, WishBtn, useEscape } from './ui'

const SIZES = ['34', '36', '38', '40', '42']

function Detail({ list, index, setIndex, onClose: finish }: { list: Piece[]; index: number; setIndex: (i: number) => void; onClose: () => void }) {
  const [out, setOut] = useState(false)
  const onClose = useCallback(() => { setOut(true); setTimeout(finish, 300) }, [finish])
  const p = list[index]
  const { add } = useStore()
  const [back, setBack] = useState(false)
  const [size, setSize] = useState<string | null>(null)
  const [hint, setHint] = useState(false)
  const n = list.length
  const step = useCallback((d: number) => { setIndex((index + d + n) % n); setBack(false); setSize(null); setHint(false) }, [index, n, setIndex])
  useEscape(onClose)
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'ArrowRight') step(1); if (e.key === 'ArrowLeft') step(-1) }
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [step])
  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 bg-wine/70 backdrop-blur-md [perspective:1400px] ${out ? 'closing' : ''}`} style={out ? undefined : { animation: 'fadeIn .45s' }} onClick={onClose} role="dialog" aria-label={p.name}>
      <button aria-label="Close" onClick={onClose} className="absolute top-6 right-6 text-white w-11 h-11 rounded-full border border-white/40 grid place-items-center hover:bg-white/10 hover:rotate-90 transition-all duration-500"><Close /></button>
      <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1) }} className="absolute left-3 md:left-10 text-white w-12 h-12 rounded-full border border-white/40 grid place-items-center hover:bg-white/10 z-10"><Arrow dir="left" /></button>
      <button aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1) }} className="absolute right-3 md:right-10 text-white w-12 h-12 rounded-full border border-white/40 grid place-items-center hover:bg-white/10 z-10"><Arrow /></button>
      <div key={p.id} onClick={(e) => e.stopPropagation()} className={`${out ? 'closing-inner' : 'lift'} flex flex-col md:flex-row items-center gap-8 md:gap-16 max-h-full overflow-auto py-6 px-10`}>
        <div className="relative">
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-10 h-8 border-2 border-b-0 border-champagne rounded-t-full" />
          <div className="h-3 w-60 mx-auto bg-gradient-to-b from-[#a8743f] to-[#6d4521] rounded-full shadow-lg" />
          <img key={String(back)} src={img(back ? p.back : p.front, 900)} alt={`${p.name} ${back ? 'back' : 'front'}`} className="h-[52vh] md:h-[68vh] aspect-[3/4.4] object-cover object-top rounded-md shadow-2xl -mt-1 scale-in" data-tilt="6" />
        </div>
        <div className="text-white max-w-sm w-full">
          <p className="label text-champagne mb-3">{p.kind === 'blouse' ? 'Blouse' : 'Saree'}</p>
          <h3 className="font-display text-3xl tracking-[0.18em] uppercase">{p.name}</h3>
          <p className="font-serif text-3xl mt-3">{fmt(p.price)}</p>
          <div className="inline-flex mt-6 rounded-full border border-white/40 p-1">
            {['Front', 'Back'].map((s) => (
              <button key={s} onClick={() => setBack(s === 'Back')} className={`label !text-[10px] px-5 py-2 rounded-full transition ${(s === 'Back') === back ? 'bg-white text-maroon' : 'text-white'}`}>{s}</button>
            ))}
          </div>
          <div className="mt-6 flex gap-2 flex-wrap">
            {SIZES.map((s) => (
              <button key={s} onClick={() => { setSize(s); setHint(false) }} aria-pressed={size === s}
                className={`w-12 h-12 rounded-full border text-sm transition-all duration-300 active:scale-90 ${size === s ? 'bg-champagne text-wine border-champagne scale-110' : 'border-white/50 hover:border-champagne'}`}>{s}</button>
            ))}
          </div>
          {hint && <p className="text-champagne text-sm mt-3 tick">Please choose a size to continue.</p>}
          <div className="flex items-center gap-4 mt-8">
            <button onClick={() => { if (!size) return setHint(true); add({ id: p.id, name: p.name, price: p.price, size }) }}
              className="label flex-1 rounded-full bg-white text-maroon py-4 hover:bg-champagne transition">{size ? `Add to bag · Size ${size}` : 'Select a size'}</button>
            <WishBtn id={p.id} className="text-white" />
          </div>
          <a href="#bridal" onClick={onClose} className="label !text-[10px] inline-block mt-6 underline underline-offset-4 text-champagne">See availability</a>
        </div>
      </div>
    </div>
  )
}

export default function Rack() {
  const [filter, setFilter] = useState('All Pieces')
  const [hover, setHover] = useState<string | null>(null)
  const [open, setOpen] = useState<number | null>(null)
  const list = PIECES.filter((p) => filter === 'All Pieces' || p.cats.includes(filter))
  const count = (f: string) => PIECES.filter((p) => f === 'All Pieces' || p.cats.includes(f)).length
  const close = useCallback(() => setOpen(null), [])

  return (
    <section id="rack" className="bg-gradient-to-b from-ivory to-champagne/30 py-28 px-6">
      <Reveal><h2 className="font-display text-4xl md:text-6xl text-wine text-center">Every silk, on the rail.</h2></Reveal>
      <div data-reveal className="flex flex-wrap justify-center gap-3 mt-10">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} aria-pressed={filter === f}
            className={`label !text-[10px] px-5 py-3 rounded-full border transition-all duration-500 active:scale-95 ${filter === f ? 'bg-maroon text-white border-maroon' : 'border-gold text-wine hover:bg-champagne/50'}`}>
            {f} <span className="opacity-60 ml-1">{count(f)}</span>
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mt-16 overflow-x-auto no-scrollbar pb-10">
        <div data-reveal="frame" className="relative min-w-max mx-auto px-6 pt-8 [perspective:1400px]">
          <div className="absolute top-8 inset-x-0 h-[7px] rounded-full bg-gradient-to-b from-white via-[#c9cdd1] to-[#7d8288] shadow-[0_6px_10px_rgba(0,0,0,.25)]" />
          <div className="flex justify-center min-h-[420px]">
            {PIECES.map((p, n) => {
              const on = hover === p.id
              const k = list.findIndex((x) => x.id === p.id)
              const shown = k >= 0
              return (
                <button key={p.id} onMouseEnter={() => setHover(p.id)} onMouseLeave={() => setHover(null)} onFocus={() => setHover(p.id)} onBlur={() => setHover(null)}
                  onClick={() => setOpen(k)} aria-label={p.name} tabIndex={shown ? 0 : -1} aria-hidden={!shown}
                  className={`relative flex flex-col items-center text-left transition-all duration-[800ms] ease-[cubic-bezier(.22,.61,.36,1)] ${shown ? 'w-[170px] mx-2 opacity-100' : 'w-0 mx-0 opacity-0 pointer-events-none overflow-hidden [transform:perspective(800px)_rotateY(80deg)_translateY(-24px)]'}`}
                  style={{ animation: 'hangIn .9s backwards', animationDelay: `${n * 80}ms`, zIndex: on ? 20 : 1 }}>
                  <div className={`flex flex-col items-center origin-top transition-transform duration-700 [transform-style:preserve-3d] ${on ? 'sway' : 'idle-sway'}`} style={{ transform: on ? 'perspective(900px) translateY(8px) translateZ(40px) scale(1.08) rotateY(-9deg) rotate(-1.5deg)' : 'perspective(900px)', animationDelay: on ? undefined : `${n * -0.6}s` }}>
                    <div className="w-5 h-6 border-2 border-b-0 border-[#9aa0a6] rounded-t-full" />
                    <div className="h-2.5 w-36 rounded-full bg-gradient-to-b from-[#b8854c] to-[#6d4521] shadow" />
                    <div className={`mt-1 rounded-sm overflow-hidden transition-all duration-500 ${on ? 'shadow-[0_25px_40px_rgba(73,19,38,.4)] ring-2 ring-gold' : 'shadow-[0_10px_18px_rgba(0,0,0,.2)]'}`}>
                      <img src={img(p.front, 500)} alt={p.name} loading="lazy" className={`w-[150px] h-[240px] object-cover object-top transition-transform duration-700 ${on ? 'scale-110' : ''}`} />
                    </div>
                  </div>
                  <div className={`mt-6 text-center transition-all duration-500 ${on ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
                    <p className="label !text-[10px] text-wine">{p.name}</p>
                    <p className="font-serif text-lg">{fmt(p.price)}</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <p key={list.length} className="font-serif italic text-xl text-maroon tick">Explore the collection · {list.length} pieces</p>
        {filter !== 'All Pieces' && <button onClick={() => setFilter('All Pieces')} className="label !text-[10px] underline mt-3 text-wine">Reset to All Pieces</button>}
        <p className="label !text-[9px] text-charcoal/40 mt-4">AI-generated studio imagery</p>
      </div>
      {open !== null && list[open] && <Detail list={list} index={open} setIndex={setOpen} onClose={close} />}
    </section>
  )
}
