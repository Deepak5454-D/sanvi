import { MOODS, img } from '../data'
import { Reveal, SectionHead } from './ui'

export default function Archive() {
  return (
    <section id="archive" className="bg-white py-28 px-6">
      <Reveal>
        <SectionHead eyebrow="THE SANVI ARCHIVE">Six Moods. <span className="gold-grad italic">Timeless Drapes</span></SectionHead>
        <p className="font-serif italic text-2xl text-maroon/80 max-w-6xl mx-auto mt-6 md:text-right">Woven by hand, worn for a lifetime.</p>
      </Reveal>
      <div className="max-w-7xl mx-auto mt-14 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-14">
        {MOODS.map((m, i) => (
          <a key={m.name} data-tilt="9" data-reveal="img" style={{ '--d': `${i * 0.1}s` } as any} href={i === 0 ? '#bridal' : '#silk'} className="group block text-center">
            <div className="relative pt-5 transition-all duration-500 group-hover:-translate-y-3">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                <span className="w-2.5 h-2.5 rotate-45 bg-gold float" />
              </div>
              <div style={{ transform: 'translateZ(18px)' }} className="rounded-t-[999px] rounded-b-md border border-gold p-1.5 transition-shadow duration-500 shadow-[0_14px_24px_-14px_rgba(73,19,38,.35)] group-hover:shadow-[0_0_35px_rgba(198,161,91,.55),0_30px_40px_-18px_rgba(73,19,38,.45)] bg-white">
                <div className="aspect-[3/4.4] overflow-hidden rounded-t-[999px] rounded-b-sm">
                  <img src={img(m.img, 600)} alt={m.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                </div>
              </div>
            </div>
            <p style={{ transform: 'translateZ(30px)' }} className="label !text-[10px] mt-6 text-wine transition-[letter-spacing,color] duration-500 group-hover:!tracking-[0.42em] group-hover:text-maroon">{m.name}</p>
          </a>
        ))}
      </div>
    </section>
  )
}
