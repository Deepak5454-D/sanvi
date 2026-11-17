import { useRef, useState } from 'react'
import { LOOKS, P, fmt, img } from '../data'
import { useStore } from '../store'
import { Arrow, Reveal, WishBtn, Button } from './ui'

// zoom crops of the model photo stand in for each styled component
const PARTS = [
  { key: 'Saree', pct: 0.55, s: 1, pos: '50% 60%' },
  { key: 'Blouse', pct: 0.1, s: 2.6, pos: '50% 28%' },
  { key: 'Choker', pct: 0.06, s: 3.6, pos: '50% 20%' },
  { key: 'Jhumkas', pct: 0.04, s: 4, pos: '50% 12%' },
  { key: 'Ottiyanam', pct: 0.09, s: 2.8, pos: '50% 55%' },
  { key: 'Bangles', pct: 0.05, s: 1, pos: '50% 50%', alt: P.bracelet },
]

export default function TryLook() {
  const [i, setI] = useState(6)
  const { addMany, add } = useStore()
  const drag = useRef<number | null>(null)
  const go = (d: number) => setI((v) => Math.min(LOOKS.length - 1, Math.max(0, v + d)))
  const look = LOOKS[i]
  const rows = PARTS.map((p) => ({ ...p, id: `${look.id}-${p.key}`, name: p.key === 'Saree' ? look.name + ' Saree' : `${look.name} ${p.key}`, price: Math.round((look.price * p.pct) / 100) * 100, src: p.alt ?? look.img }))
  const total = rows.reduce((a, r) => a + r.price, 0)
  const final = total * 0.9

  return (
    <section id="look" className="bg-ivory py-28 px-6 overflow-hidden">
      <Reveal><h2 className="font-display text-5xl md:text-7xl text-wine text-center">Try the Look.</h2></Reveal>
      <div className="max-w-7xl mx-auto mt-14 grid lg:grid-cols-[1.25fr_1fr] gap-12 items-center">
        <div>
          <div data-reveal className="relative h-[540px] md:h-[640px] touch-pan-y select-none cursor-grab active:cursor-grabbing"
            onPointerDown={(e) => (drag.current = e.clientX)}
            onPointerUp={(e) => { if (drag.current !== null) { const d = e.clientX - drag.current; if (Math.abs(d) > 40) go(d < 0 ? 1 : -1) } drag.current = null }}
            onPointerLeave={() => (drag.current = null)}
            onWheel={(e) => { if (Math.abs(e.deltaX) > 30) go(e.deltaX > 0 ? 1 : -1) }}>
            {LOOKS.map((l, k) => {
              const o = k - i
              if (Math.abs(o) > 2) return null
              return (
                <div key={l.id} onClick={() => setI(k)} className="absolute top-0 left-1/2 h-full w-[260px] md:w-[330px] transition-all duration-[900ms] ease-[cubic-bezier(.22,.61,.36,1)]"
                  style={{ transform: `perspective(1400px) translateX(calc(-50% + ${o * 62}%)) translateZ(${o === 0 ? 40 : -Math.abs(o) * 60}px) rotateY(${-o * 24}deg) scale(${o === 0 ? 1 : 0.78})`, filter: o === 0 ? 'none' : 'blur(3px)', opacity: o === 0 ? 1 : 0.55, zIndex: 10 - Math.abs(o) }}>
                  <img data-tilt={o === 0 ? '7' : undefined} draggable={false} src={img(l.img, 800)} alt={l.name} className={`w-full h-full object-cover object-top rounded-t-[160px] rounded-b-lg border border-gold/40 transition-shadow duration-700 ${o === 0 ? 'shadow-2xl' : 'shadow-md'}`} />
                </div>
              )
            })}
          </div>
          <div className="flex items-center justify-center gap-6 mt-6">
            <button aria-label="Previous" onClick={() => go(-1)} disabled={i === 0} className="w-12 h-12 rounded-full border border-gold grid place-items-center text-maroon hover:bg-maroon hover:text-white transition disabled:opacity-30"><Arrow dir="left" /></button>
            <div className="text-center">
              <p key={i} className="font-serif text-2xl text-wine tick">{i + 1} of 8 · {look.name}</p>
              <p className="label !text-[9px] text-charcoal/50 mt-1">Scroll or drag</p>
            </div>
            <button aria-label="Next" onClick={() => go(1)} disabled={i === LOOKS.length - 1} className="w-12 h-12 rounded-full border border-gold grid place-items-center text-maroon hover:bg-maroon hover:text-white transition disabled:opacity-30"><Arrow /></button>
          </div>
        </div>

        <div key={look.id} data-tilt="2.5" className="bg-white rounded-2xl border border-gold/40 shadow-lg p-7 rise">
          <h3 className="font-serif text-3xl text-wine mb-4">In this look</h3>
          {rows.map((r, n) => (
            <div key={r.id} style={{ animationDelay: `${n * 70}ms` }} className="tick group/row flex items-center gap-4 py-3 border-b border-gold/20">
              <div className="w-14 h-14 rounded-md overflow-hidden bg-champagne/30 shrink-0">
                <img src={img(r.src, 300)} alt="" className="w-full h-full object-cover transition-transform duration-700" style={{ transform: `scale(${r.s})`, objectPosition: r.pos, transformOrigin: r.pos }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="label !text-[10px] truncate">{r.name}</p>
                <p className="font-serif text-lg text-charcoal/70">{fmt(r.price)}</p>
              </div>
              <WishBtn id={r.id} className="text-gold" />
              <button onClick={() => add({ id: r.id, name: r.name, price: r.price })} className="label !text-[10px] border border-maroon text-maroon rounded-full px-4 py-2 hover:bg-maroon hover:text-white btn3d">Add</button>
            </div>
          ))}
          <div className="mt-5 space-y-1 font-serif text-lg">
            <div className="flex justify-between text-charcoal/60"><span>Original total</span><span key={total} className="line-through tick">{fmt(total)}</span></div>
            <div className="flex justify-between text-maroon"><span>10% bundle discount</span><span key={total} className="tick">− {fmt(total * 0.1)}</span></div>
            <div className="flex justify-between text-2xl text-wine pt-2 border-t border-gold/40"><span>Final bundle price</span><span key={total} className="tick">{fmt(final)}</span></div>
          </div>
          <Button className="w-full mt-5" onClick={() => addMany(rows.map((r) => ({ id: r.id, name: r.name, price: Math.round(r.price * 0.9) })), `${look.name} look added to bag`)}>Add full look to bag</Button>
        </div>
      </div>
    </section>
  )
}
