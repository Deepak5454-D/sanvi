import { P, img } from '../data'
import { Button, Reveal } from './ui'

export default function Bridal() {
  return (
    <>
      <section id="bridal" className="bg-ivory py-28 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="order-2 lg:order-1">
            <p data-reveal className="font-serif italic text-2xl text-gold">For the muhurtham and the moments after.</p>
            <h2 data-reveal style={{ '--d': '.15s' } as any} className="font-display text-5xl md:text-7xl text-wine mt-4 leading-tight">The Bridal <span className="gold-grad italic">Collection</span></h2>
            <p data-reveal style={{ '--d': '.3s' } as any} className="font-serif text-xl text-charcoal/75 mt-6 max-w-lg">Heirloom Kanchipuram sarees in pure zari, woven over weeks by master weavers and finished with temple borders, for the day you will be remembered by.</p>
            <ul className="mt-8 space-y-3 label !text-[11px] text-wine">
              {['Pure zari muhurtham sarees', 'Coordinated blouses and jewellery', 'Private bridal appointments'].map((t, n) => (
                <li key={t} data-reveal style={{ '--d': `${0.4 + n * 0.12}s` } as any} className="group flex items-center gap-4"><span className="w-6 h-px bg-gold transition-all duration-500 group-hover:w-12" />{t}</li>
              ))}
            </ul>
            <div data-reveal style={{ '--d': '.8s' } as any} className="mt-10"><Button>Book a Bridal Appointment</Button></div>
          </div>
          <div className="order-1 lg:order-2 grid grid-cols-2 gap-5">
            {[P.bride, P.jewel].map((id, k) => (
              <div key={id} data-tilt="8" data-reveal="img" data-parallax={k ? '-0.05' : '0.05'} style={{ '--d': `${k * 0.2}s` } as any} className={`group overflow-hidden rounded-t-[999px] rounded-b-md border border-gold p-1.5 bg-white ${k ? 'mt-14' : ''}`}>
                <div className="overflow-hidden rounded-t-[999px] rounded-b-sm"><img src={img(id, 700)} alt="Bridal silk saree" loading="lazy" className="w-full aspect-[3/4.6] object-cover object-top transition-transform duration-[1200ms] ease-out group-hover:scale-105" /></div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <footer id="story" className="bg-wine text-champagne py-16 px-6 text-center">
        <div data-reveal className="w-16 h-16 shrink-0 aspect-square rounded-full border-2 border-gold/75 p-2 bg-white mx-auto mb-4 flex items-center justify-center overflow-hidden shadow-[0_0_25px_rgba(198,161,91,0.35)]">
          <img src="/brand/swan-logo.png" alt="SANVI Swan Logo" className="w-full h-full object-contain" />
        </div>
        <p data-reveal className="font-display text-3xl tracking-[0.4em] transition-[letter-spacing] duration-700 hover:tracking-[0.5em]">SANVI</p>
        <p data-reveal style={{ '--d': '.15s' } as any} className="font-serif italic text-xl mt-4 text-champagne/80 max-w-xl mx-auto">Our story begins at a Kanchipuram loom, where every thread is a prayer.</p>
        <p data-reveal style={{ '--d': '.3s' } as any} className="label !text-[9px] mt-8 text-champagne/50">Frontend prototype · No real payments or orders</p>
      </footer>
    </>
  )
}
