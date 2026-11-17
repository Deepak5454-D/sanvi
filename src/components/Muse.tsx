import { useCallback, useEffect, useRef, useState } from 'react'
import { MOODS, P, REELS, VIDEO, img } from '../data'
import { Arrow, Button, Pause, Play, Reveal, SectionHead, useEscape } from './ui'

const COL_A = [P.pinkOrange, P.green, P.orange, P.purple, P.redBrown]
const COL_B = [P.yellowRed, P.redWhite, P.redGold, P.park, P.colorful]

function Column({ ids, up }: { ids: string[]; up: boolean }) {
  return (
    <div style={{ transform: `perspective(900px) rotateY(${up ? 14 : -14}deg)` }} className="relative h-[560px] overflow-hidden w-32 lg:w-44 hidden md:block [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)]">
      <div className="flex flex-col gap-4" style={{ animation: `${up ? 'colUp' : 'colDown'} 40s linear infinite` }}>
        {[...ids, ...ids].map((id, i) => <img key={i} src={img(id, 400)} alt="" loading="lazy" className="w-full aspect-[3/4] object-cover rounded-lg" />)}
      </div>
    </div>
  )
}

export function Film() {
  const v = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState(false)
  const [muted, setMuted] = useState(true)
  const toggle = () => { const el = v.current!; el.paused ? el.play() : el.pause() }
  const corner = 'corner absolute w-8 h-8 border-gold '
  return (
    <section id="film" className="bg-white py-28 px-6 overflow-hidden">
      <Reveal>
        <SectionHead eyebrow="THE MUSE FILM"><span className="gold-grad italic">Feel the drape</span></SectionHead>
      </Reveal>
      <div className="max-w-7xl mx-auto mt-14 flex items-center justify-center gap-6">
        <Column ids={COL_A} up />
        <div data-reveal="frame" data-tilt="2.5" className="w-full max-w-4xl relative p-3 border border-gold/70 shadow-[0_40px_60px_-30px_rgba(73,19,38,.45)]">
          <span className={corner + '-top-1 -left-1 border-t-2 border-l-2'} /><span className={corner + '-top-1 -right-1 border-t-2 border-r-2'} />
          <span className={corner + '-bottom-1 -left-1 border-b-2 border-l-2'} /><span className={corner + '-bottom-1 -right-1 border-b-2 border-r-2'} />
          <div className="relative aspect-video bg-wine overflow-hidden group">
            <video ref={v} src={VIDEO} poster={img(P.redGold, 1400)} muted={muted} loop playsInline className="w-full h-full object-cover"
              onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onClick={toggle} />
            {!playing && (
              <button onClick={toggle} aria-label="Play film" className="absolute inset-0 grid place-items-center bg-wine/30 hover:bg-wine/20 transition scale-in group/p">
                <span className="w-20 h-20 rounded-full bg-white/90 text-maroon grid place-items-center shadow-2xl transition-transform duration-500 group-hover/p:scale-110"><Play className="w-8 h-8" /></span>
              </button>
            )}
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <button onClick={toggle} aria-label={playing ? 'Pause' : 'Play'} className="w-10 h-10 rounded-full bg-black/50 backdrop-blur text-white grid place-items-center transition-transform duration-300 hover:scale-110 active:scale-90"><span key={String(playing)} className="pop">{playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</span></button>
              <button onClick={() => setMuted(!muted)} className="label !text-[10px] rounded-full bg-black/50 backdrop-blur text-white px-5 transition-all duration-300 hover:bg-black/70 active:scale-95"><span key={String(muted)} className="tick inline-block">Sound {muted ? 'Off' : 'On'}</span></button>
            </div>
          </div>
        </div>
        <Column ids={COL_B} up={false} />
      </div>
      <div data-reveal className="text-center mt-14"><a href="#silk"><Button>Purchase the Collection</Button></a></div>
    </section>
  )
}

export function Reels() {
  const [i, setI] = useState(2)
  const [auto, setAuto] = useState(true)
  const [full, setFull] = useState(false)
  const [fullOut, setFullOut] = useState(false)
  const [muted, setMuted] = useState(true)
  const n = REELS.length
  const step = useCallback((d: number) => setI((v) => (v + d + n) % n), [n])
  useEffect(() => {
    if (!auto || full) return
    const t = setTimeout(() => step(1), 4500)
    return () => clearTimeout(t)
  }, [auto, i, full, step])
  const closeFull = useCallback(() => { setFullOut(true); setTimeout(() => { setFull(false); setFullOut(false) }, 300) }, [])
  useEscape(closeFull, full)
  const r = REELS[i]
  const ctl = 'w-12 h-12 rounded-full border border-gold/60 text-champagne grid place-items-center hover:bg-gold hover:text-wine hover:-translate-y-0.5 active:scale-90 transition-all duration-300'

  return (
    <section id="reels" className="bg-wine py-28 overflow-hidden">
      <Reveal><SectionHead eyebrow="THE MUSE REELS" dark>Silk, in motion.</SectionHead></Reveal>
      <div data-reveal className="relative h-[560px] mt-12 [perspective:1400px]">
        {REELS.map((reel, k) => {
          let o = k - i
          if (o > n / 2) o -= n
          if (o < -n / 2) o += n
          const a = Math.abs(o)
          const centre = o === 0
          return (
            <div key={reel.title} onClick={() => (centre ? setFull(true) : step(o))}
              className="absolute top-0 left-1/2 w-[250px] md:w-[290px] h-[520px] rounded-2xl overflow-hidden cursor-pointer border border-gold/40 shadow-[0_40px_60px_-20px_rgba(0,0,0,.7)] transition-all duration-[1000ms] ease-[cubic-bezier(.22,.61,.36,1)]"
              style={{ transform: `translateX(calc(-50% + ${o * (window.innerWidth < 768 ? 62 : 82)}%)) translateZ(${centre ? 120 : -a * 160}px) rotateY(${-o * 38}deg) rotateX(${centre ? 0 : 3}deg) scale(${centre ? 1.08 : 1})`, opacity: a > 2 ? 0 : centre ? 1 : 0.6, zIndex: 10 - a, pointerEvents: a > 2 ? 'none' : 'auto' }}>
              <img src={img(reel.img, 600)} alt={reel.title} className={`w-full h-full object-cover transition-transform duration-[1400ms] ease-out ${centre ? 'scale-110' : 'scale-100'}`} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
              <div className="absolute top-4 inset-x-4 flex justify-between text-white label !text-[10px]"><span>Reel {String(k + 1).padStart(2, '0')}</span><span>{reel.dur}</span></div>
              {centre && <span key={i} className="scale-in absolute inset-0 m-auto w-16 h-16 rounded-full bg-white/90 text-maroon grid place-items-center"><Play className="w-7 h-7" /></span>}
              <div className="absolute bottom-5 inset-x-4 text-white">
                <p className="label !text-[9px] text-champagne">{reel.fabric}</p>
                <p className="font-display text-2xl mt-1">{reel.title}</p>
                <p className="font-serif text-white/70">{reel.loc}</p>
                {centre && <div className="h-0.5 bg-white/20 mt-3"><div key={i + String(auto)} className="h-full bg-gold" style={{ animation: auto ? 'progress 4.5s linear forwards' : undefined, width: auto ? undefined : '35%' }} /></div>}
              </div>
            </div>
          )
        })}
      </div>
      <div className="flex justify-center gap-4 mt-6">
        <button aria-label="Previous reel" className={ctl} onClick={() => step(-1)}><Arrow dir="left" /></button>
        <button aria-label={auto ? 'Pause' : 'Play'} className={ctl} onClick={() => setAuto(!auto)}><span key={String(auto)} className="pop">{auto ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}</span></button>
        <button aria-label="Next reel" className={ctl} onClick={() => step(1)}><Arrow /></button>
      </div>

      {full && (
        <div className={`fixed inset-0 z-50 bg-black/95 grid place-items-center [perspective:1400px] ${fullOut ? 'closing' : ''}`} style={fullOut ? undefined : { animation: 'fadeIn .4s' }} onClick={closeFull}>
          <div className={`relative h-[88vh] aspect-[9/16] max-w-full bg-black ${fullOut ? 'closing-inner' : 'lift'}`} onClick={(e) => e.stopPropagation()}>
            <video src={VIDEO} poster={img(r.img, 900)} autoPlay loop muted={muted} playsInline className="w-full h-full object-cover" />
            <div className="absolute top-4 inset-x-4 flex justify-between">
              <button onClick={() => setMuted(!muted)} className="label !text-[10px] rounded-full bg-black/50 backdrop-blur text-white px-5 py-2 transition active:scale-95"><span key={String(muted)} className="tick inline-block">Sound {muted ? 'Off' : 'On'}</span></button>
              <button onClick={closeFull} aria-label="Close" className="w-10 h-10 rounded-full bg-black/50 text-white text-xl">×</button>
            </div>
            <div className="absolute bottom-6 left-5 text-white"><p className="label !text-[9px] text-champagne">{r.fabric}</p><p className="font-display text-2xl">{r.title}</p></div>
          </div>
        </div>
      )}
    </section>
  )
}
