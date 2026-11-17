import { SHOWROOM, TICKER } from '../data'
import { Button } from './ui'

export default function Hero() {
  const move = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    e.currentTarget.style.setProperty('--mx', String((e.clientX - r.left) / r.width - 0.5))
    e.currentTarget.style.setProperty('--my', String((e.clientY - r.top) / r.height - 0.5))
  }
  const items = [...TICKER, ...TICKER, ...TICKER, ...TICKER]
  return (
    <section id="home" onPointerMove={move} className="relative h-screen min-h-[640px] flex flex-col overflow-hidden" style={{ '--mx': 0, '--my': 0 } as any}>
      <div className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: 'translate3d(calc(var(--mx) * -22px), calc(var(--my) * -14px), 0)' }}>
      <img src={SHOWROOM} alt="Silk saree showroom shelves" data-parallax="0.3" className="kb absolute inset-0 w-full h-full object-cover scale-105" style={{ animation: 'kenburns 26s ease-out forwards' }} />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-wine/70 via-wine/45 to-wine/85" />
      <div className="relative flex-1 grid place-items-center text-center text-white px-6">
        <div className="max-w-4xl transition-transform duration-700 ease-out [perspective:1000px]" style={{ transform: 'translate3d(calc(var(--mx) * 14px), calc(var(--my) * 8px), 0) rotateY(calc(var(--mx) * 3deg)) rotateX(calc(var(--my) * -2deg))' }}>
          <p className="label text-champagne mb-6 hero-in" style={{ '--d': '.2s' } as any}>Kanchipuram · Since the first loom</p>
          <h1 className="font-display text-6xl md:text-8xl leading-[1.02] hero-in" style={{ '--d': '.4s' } as any}>Woven for the <em className="text-champagne">Divine.</em></h1>
          <p className="font-serif text-xl md:text-2xl mt-6 max-w-xl mx-auto text-white/90 hero-in" style={{ '--d': '.7s' } as any}>
            Where temple looms meet timeless elegance. Discover the art of pure Indian silk.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center hero-in" style={{ '--d': '.95s' } as any}>
            <a href="#look"><Button>Try the Look</Button></a>
            <a href="#rack"><Button variant="white">Browse the Rack</Button></a>
          </div>
        </div>
      </div>
      <div className="relative bg-maroon border-y border-gold/50 py-4 overflow-hidden ticker-wrap">
        <div className="flex w-max" style={{ animation: 'ticker 30s linear infinite' }}>
          {items.map((t, i) => (
            <span key={i} className="label text-gold whitespace-nowrap px-8 flex items-center gap-16">{t}<span className="text-gold/50">✦</span></span>
          ))}
        </div>
      </div>
    </section>
  )
}
