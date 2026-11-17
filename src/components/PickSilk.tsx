import { useRef, useState } from 'react'
import { SILKS, fmt, img } from '../data'
import { useStore } from '../store'
import { Plus, Reveal, SectionHead, WishBtn } from './ui'

function Card({ s, i }: { s: (typeof SILKS)[number]; i: number }) {
  const { add } = useStore()
  const ref = useRef<HTMLDivElement>(null)
  const [pressed, setPressed] = useState(false)
  const c = (SILKS.length - 1) / 2
  const d = i - c
  const dark = s.id !== 'silk2' && s.id !== 'silk3'
  const move = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect()
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
    if (ref.current) ref.current.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`
  }
  return (
    <div data-reveal className="group relative shrink-0 w-[240px] md:w-[250px] -mx-3 transition-all duration-[600ms] ease-[cubic-bezier(.22,.61,.36,1)] hover:z-30 hover:!translate-y-[-24px] hover:scale-[1.07]"
      style={{ '--d': `${i * 0.12}s`, transform: `translateY(${d * d * 14}px) rotate(${d * 4}deg)`, zIndex: 10 - Math.abs(Math.round(d)), perspective: 900 } as any}
      onMouseMove={move} onMouseLeave={() => ref.current && (ref.current.style.transform = '')}
      onMouseDown={() => setPressed(true)} onMouseUp={() => setPressed(false)} onMouseOut={() => setPressed(false)}>
      <div ref={ref} className="relative h-[460px] rounded-2xl overflow-hidden shadow-[0_24px_40px_-18px_rgba(0,0,0,.5)] transition-transform duration-300 ease-out"
        style={{ background: s.color, transformStyle: 'preserve-3d', scale: pressed ? '.96' : '1' }}>
        <h3 style={{ transform: 'translateZ(50px)' }} className={`absolute inset-x-0 top-5 px-3 text-center font-condensed uppercase leading-[.9] text-5xl ${dark ? 'text-white/95' : 'text-wine/90'}`}>{s.name}</h3>
        <img src={img(s.img, 600)} alt={s.name} draggable={false} className="absolute bottom-0 inset-x-0 h-[78%] w-full object-cover object-top transition-transform duration-[900ms] ease-out group-hover:scale-105 [mask-image:linear-gradient(to_top,black_85%,transparent)]" />
        <WishBtn id={s.id} className="icon3d absolute top-4 right-4 text-white drop-shadow z-10" />
        <div style={{ transform: 'translateZ(40px)' }} className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white">
          <span className="font-serif text-2xl drop-shadow">{fmt(s.price)}</span>
          <button aria-label={`Add ${s.name} to bag`} onClick={() => add({ id: s.id, name: s.name, price: s.price })} className="w-11 h-11 rounded-full bg-black grid place-items-center btn3d"><Plus /></button>
        </div>
      </div>
    </div>
  )
}

export default function PickSilk() {
  return (
    <section id="silk" className="bg-white py-28 overflow-hidden">
      <Reveal><SectionHead eyebrow="THE EDIT">Pick a Silk</SectionHead></Reveal>
      <div className="mt-16 pb-16 overflow-x-auto no-scrollbar">
        <div className="flex w-max mx-auto px-10 pt-10 items-start">
          {SILKS.map((s, i) => <Card key={s.id} s={s} i={i} />)}
        </div>
      </div>
      <p className="font-serif italic text-xl text-center text-maroon/70">Tilt a card, press it, poke the silk.</p>
    </section>
  )
}
