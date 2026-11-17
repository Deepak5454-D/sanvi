import { useCallback, useEffect, useRef, useState } from 'react'

const N = 8 // vertical curtain panels
const HALF = N / 2

// Web Audio API based ambient Indian luxury classical flute / tanpura / harp chord generator
// Smooth, calming, continuous loop, zero external audio asset dependency
class LuxuryAudioPlayer {
  private ctx: AudioContext | null = null
  private gainNode: GainNode | null = null
  private intervalId: any = null
  private isMuted: boolean = false
  private isRunning: boolean = false

  init() {
    if (this.ctx) return
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext
    if (!AudioCtx) return
    this.ctx = new AudioCtx()
  }

  start(muted: boolean = false) {
    this.isMuted = muted
    this.init()
    if (!this.ctx) return

    if (this.ctx.state === 'suspended') {
      this.ctx.resume()
    }

    if (this.isRunning) return
    this.isRunning = true

    const ctx = this.ctx
    const masterGain = ctx.createGain()
    masterGain.gain.setValueAtTime(muted ? 0 : 0.001, ctx.currentTime)
    if (!muted) {
      masterGain.gain.exponentialRampToValueAtTime(0.5, ctx.currentTime + 1.2)
    }
    masterGain.connect(ctx.destination)
    this.gainNode = masterGain

    // Reverb / Convolver-like warmth using a stereo delay feedback loop
    const delay = ctx.createDelay()
    delay.delayTime.setValueAtTime(0.35, ctx.currentTime)
    const feedback = ctx.createGain()
    feedback.gain.setValueAtTime(0.38, ctx.currentTime)
    delay.connect(feedback)
    feedback.connect(delay)
    delay.connect(masterGain)

    // Deep Peaceful Ambient Base Drone - Soft silk warm temple resonance
    const droneFreqs = [110.0, 164.81, 220.0, 329.63] // A2, E3, A3, E4 (Meditative Yaman / Pahadi harmony)
    droneFreqs.forEach((freq, idx) => {
      const osc = ctx.createOscillator()
      const g = ctx.createGain()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      const filter = ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(450, ctx.currentTime)

      g.gain.setValueAtTime(0.08 / (idx + 1), ctx.currentTime)
      osc.connect(filter)
      filter.connect(g)
      g.connect(masterGain)
      osc.start()
    })

    // Gentle Bamboo Flute (Bansuri) / Calming Zen Chimes notes
    // Raag Pahadi peaceful scale: A3, B3, C#4, E4, F#4, A4, B4, C#5
    const calmMelody = [
      220.0, 246.94, 277.18, 329.63, 369.99, 440.0, 493.88, 554.37, 659.25
    ]
    let noteIdx = 0

    // Plays a breathy, warm soothing Indian flute note
    const playCalmFluteNote = () => {
      if (!this.ctx || !this.gainNode || !this.isRunning) return
      const t = this.ctx.currentTime

      const baseFreq = calmMelody[noteIdx % calmMelody.length]
      // Melodic phrasing with peaceful step variations
      noteIdx = (noteIdx + (Math.random() > 0.4 ? 1 : 2)) % calmMelody.length

      // Main flute oscillator
      const osc = this.ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.setValueAtTime(baseFreq, t)
      // Delicate gentle vibrato
      osc.frequency.exponentialRampToValueAtTime(baseFreq * 1.006, t + 0.8)
      osc.frequency.exponentialRampToValueAtTime(baseFreq, t + 1.8)

      // Soft harmonic overtone (gives wooden bansuri/silk character)
      const oscOvertone = this.ctx.createOscillator()
      oscOvertone.type = 'sine'
      oscOvertone.frequency.setValueAtTime(baseFreq * 2, t)

      const noteGain = this.ctx.createGain()
      const overtoneGain = this.ctx.createGain()

      // Soft breath-in attack, peaceful sustained body, slow soothing release
      noteGain.gain.setValueAtTime(0.0001, t)
      noteGain.gain.linearRampToValueAtTime(0.18, t + 0.45) // soft gradual swelling
      noteGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.8)

      overtoneGain.gain.setValueAtTime(0.0001, t)
      overtoneGain.gain.linearRampToValueAtTime(0.035, t + 0.45)
      overtoneGain.gain.exponentialRampToValueAtTime(0.0001, t + 2.2)

      const filter = this.ctx.createBiquadFilter()
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(900, t)

      osc.connect(filter)
      filter.connect(noteGain)
      noteGain.connect(masterGain)
      noteGain.connect(delay) // adds soothing temple echo

      oscOvertone.connect(overtoneGain)
      overtoneGain.connect(masterGain)

      osc.start(t)
      oscOvertone.start(t)
      osc.stop(t + 3.0)
      oscOvertone.stop(t + 2.5)
    }

    // Play first note gently after short delay
    setTimeout(() => playCalmFluteNote(), 400)
    this.intervalId = setInterval(playCalmFluteNote, 2200) // gentle, relaxed pacing
  }

  setMute(muted: boolean) {
    this.isMuted = muted
    if (!this.gainNode || !this.ctx) return
    const t = this.ctx.currentTime
    if (muted) {
      this.gainNode.gain.cancelScheduledValues(t)
      this.gainNode.gain.linearRampToValueAtTime(0.0001, t + 0.2)
    } else {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume()
      }
      this.gainNode.gain.cancelScheduledValues(t)
      this.gainNode.gain.linearRampToValueAtTime(0.5, t + 0.4)
    }
  }

  fadeOutAndStop() {
    if (!this.isRunning) return
    this.isRunning = false
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
    if (this.gainNode && this.ctx) {
      const t = this.ctx.currentTime
      try {
        this.gainNode.gain.cancelScheduledValues(t)
        this.gainNode.gain.linearRampToValueAtTime(0.0001, t + 2.0)
        setTimeout(() => {
          this.ctx?.close()
          this.ctx = null
        }, 2200)
      } catch (e) {
        // ignore
      }
    }
  }
}

// Global single audio instance to prevent duplicates across re-renders
let audioPlayerInstance: LuxuryAudioPlayer | null = null

export default function Intro() {
  const [phase, setPhase] = useState<'idle' | 'opening' | 'done'>('idle')
  const [muted, setMuted] = useState(false)
  const [progress, setProgress] = useState(0)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false)
  const [showPassModal, setShowPassModal] = useState(false)
  const [passInput, setPassInput] = useState('')
  const [passError, setPassError] = useState(false)
  const [toastMsg, setToastMsg] = useState<string | null>(null)

  const btn = useRef<HTMLButtonElement>(null)
  const timerRef = useRef<any>(null)
  const progressIntervalRef = useRef<any>(null)
  const hasTriggeredRef = useRef(false)
  const logoTapCountRef = useRef(0)
  const logoTapTimerRef = useRef<any>(null)

  // Check if admin is unlocked via URL param (?admin=sanvi) or saved localStorage
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const urlAdmin = params.get('admin') === 'sanvi' || params.get('preview') === 'admin'
    const storedAdmin = localStorage.getItem('sanvi_admin_unlocked') === 'true'

    if (urlAdmin || storedAdmin) {
      setIsAdminUnlocked(true)
      localStorage.setItem('sanvi_admin_unlocked', 'true')
    }
  }, [])

  // Keyboard shortcut (Ctrl + Shift + A or Alt + A) to open admin PIN dialog
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) || (e.altKey && (e.key === 'A' || e.key === 'a'))) {
        e.preventDefault()
        setShowPassModal(true)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Initialize audio instance safely once
  useEffect(() => {
    if (!audioPlayerInstance) {
      audioPlayerInstance = new LuxuryAudioPlayer()
    }
    
    // Attempt playback respecting browser autoplay rules
    const tryAudio = () => {
      if (audioPlayerInstance) {
        audioPlayerInstance.start(false)
      }
    }
    tryAudio()

    // Fallback: unlock audio on first customer touch/click if browser blocked autoplay
    const unlockUserGesture = () => {
      if (audioPlayerInstance) {
        audioPlayerInstance.start(muted)
      }
      window.removeEventListener('pointerdown', unlockUserGesture)
      window.removeEventListener('keydown', unlockUserGesture)
    }
    window.addEventListener('pointerdown', unlockUserGesture, { once: true })
    window.addEventListener('keydown', unlockUserGesture, { once: true })

    return () => {
      window.removeEventListener('pointerdown', unlockUserGesture)
      window.removeEventListener('keydown', unlockUserGesture)
    }
  }, [muted])

  // Body lock during intro
  useEffect(() => {
    const root = document.documentElement
    if (phase === 'done') {
      root.classList.remove('intro-lock')
      document.body.style.overflow = ''
      return
    }
    root.classList.add('intro-lock')
    document.body.style.overflow = 'hidden'
  }, [phase])

  // Trigger entrance transition
  const enter = useCallback(() => {
    if (hasTriggeredRef.current) return
    hasTriggeredRef.current = true

    if (timerRef.current) clearTimeout(timerRef.current)
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)

    setPhase('opening')
    if (audioPlayerInstance) {
      audioPlayerInstance.fadeOutAndStop()
    }

    setTimeout(() => {
      document.documentElement.classList.remove('intro-lock')
    }, 500)

    setTimeout(() => {
      setPhase('done')
      window.scrollTo(0, 0)
    }, 2500)
  }, [])

  // Automatic 10-second opening experience ONLY if admin unlocked
  useEffect(() => {
    if (phase !== 'idle') return
    if (!isAdminUnlocked) {
      // Client mode: stay on entrance page indefinitely
      setProgress(0)
      return
    }

    const duration = 10000 // 10 seconds auto-transition for admin
    const interval = 50
    let elapsed = 0

    progressIntervalRef.current = setInterval(() => {
      elapsed += interval
      setProgress(Math.min(100, (elapsed / duration) * 100))
    }, interval)

    timerRef.current = setTimeout(() => {
      enter()
    }, duration)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current)
    }
  }, [phase, enter, isAdminUnlocked])

  const handleClientAction = () => {
    if (isAdminUnlocked) {
      enter()
    } else {
      setToastMsg('We are preparing our grand collection. Launching soon!')
      setTimeout(() => setToastMsg(null), 3000)
    }
  }

  // Double/triple tap logo to open Admin PIN dialog on mobile/desktop
  const handleLogoTap = () => {
    logoTapCountRef.current += 1
    if (logoTapTimerRef.current) clearTimeout(logoTapTimerRef.current)

    if (logoTapCountRef.current >= 3) {
      logoTapCountRef.current = 0
      setShowPassModal(true)
    } else {
      logoTapTimerRef.current = setTimeout(() => {
        logoTapCountRef.current = 0
      }, 700)
    }
  }

  const handleVerifyPass = (e: React.FormEvent) => {
    e.preventDefault()
    // Secret PIN: 2026 or sanvi
    if (passInput.trim() === '2026' || passInput.trim().toLowerCase() === 'sanvi') {
      setIsAdminUnlocked(true)
      localStorage.setItem('sanvi_admin_unlocked', 'true')
      setShowPassModal(false)
      setPassError(false)
      setToastMsg('Admin Unlocked! Opening boutique...')
      setTimeout(() => {
        enter()
      }, 800)
    } else {
      setPassError(true)
      setTimeout(() => setPassError(false), 2000)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newMuted = !muted
    setMuted(newMuted)
    if (audioPlayerInstance) {
      audioPlayerInstance.setMute(newMuted)
    }
  }

  useEffect(() => {
    btn.current?.focus({ preventScroll: true })
  }, [])

  if (phase === 'done') return null
  const open = phase === 'opening'

  return (
    <div className="fixed inset-0 z-[100] [perspective:1800px] select-none" role="dialog" aria-label="Welcome to SANVI">
      {/* Silk Curtain Panels */}
      <div className="absolute inset-0 flex [transform-style:preserve-3d]">
        {Array.from({ length: N }).map((_, i) => {
          const left = i < HALF
          const dist = left ? HALF - 1 - i : i - HALF
          const shift = left ? -(i + 1) * (100 / N) : (N - i) * (100 / N)
          return (
            <div
              key={i}
              className="relative h-full flex-1 bg-wine will-change-transform"
              style={{
                background: `linear-gradient(${left ? 90 : 270}deg, #3d0d1e 0%, #491326 40%, #5a1830 100%)`,
                transformOrigin: left ? 'left center' : 'right center',
                transition: 'transform 1.6s cubic-bezier(.76,0,.24,1), opacity 1.3s ease',
                transitionDelay: open ? `${0.2 + dist * 0.12}s` : '0s',
                transform: open ? `translateX(${shift}vw) rotateY(${left ? -65 : 65}deg)` : 'none',
                opacity: open ? 0 : 1,
                boxShadow: open ? `${left ? '' : '-'}35px 0 70px rgba(0,0,0,.6)` : 'none',
              }}
            >
              {/* Vertical pure silk gold weaving zari line */}
              {i < N - 1 && (
                <span
                  className="absolute right-0 top-0 h-full w-px origin-center bg-gradient-to-b from-transparent via-gold/70 to-transparent"
                  style={{
                    animation: `lineGrow 1.8s cubic-bezier(.22,.61,.36,1) ${0.2 + Math.abs(i - (HALF - 1)) * 0.12}s backwards`,
                  }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* Top Bar with Brand Logo and Music Audio Toggle */}
      <div
        className="absolute top-0 inset-x-0 z-20 flex items-center justify-between px-6 sm:px-12 py-6 text-white transition-opacity duration-700"
        style={{ opacity: open ? 0 : 1 }}
      >
        <div className="flex items-center gap-3.5">
          {/* Authentic Silk Swan Brand Logo - Triple tap for secret admin entry */}
          <button
            type="button"
            onClick={handleLogoTap}
            title="SANVI"
            className="relative w-11 h-11 shrink-0 aspect-square rounded-full border border-gold/70 flex items-center justify-center bg-white shadow-[0_0_20px_rgba(198,161,91,0.35)] overflow-hidden p-1 active:scale-95 transition-transform"
          >
            <img
              src="/brand/swan-logo.png"
              alt="SANVI Swan Silk Logo"
              className="w-full h-full object-contain"
            />
          </button>
          <div onClick={handleLogoTap} className="cursor-pointer select-none">
            <span className="font-display text-sm tracking-[0.35em] text-champagne uppercase font-medium">SANVI</span>
            <span className="block text-[8px] font-sans tracking-[0.4em] text-gold/75 uppercase">Pure Silk Heritage</span>
          </div>
        </div>

        {/* Music Mute/Unmute Control */}
        <button
          onClick={toggleMute}
          className="group flex items-center gap-2.5 rounded-full border border-gold/40 bg-black/25 px-4 py-2 text-xs text-champagne/90 backdrop-blur-md transition-all duration-300 hover:border-gold hover:bg-gold/15 hover:text-white"
          title={muted ? 'Unmute Background Music' : 'Mute Background Music'}
          aria-label={muted ? 'Unmute music' : 'Mute music'}
        >
          <span className="relative flex h-2 w-2">
            {!muted && (
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
            )}
            <span className={`relative inline-flex rounded-full h-2 w-2 ${muted ? 'bg-white/40' : 'bg-gold'}`}></span>
          </span>
          <span className="label !text-[9px] !tracking-[0.25em]">
            {muted ? 'SOUND OFF' : 'MUSIC ON'}
          </span>
          <svg className="w-4 h-4 ml-0.5 text-gold group-hover:scale-110 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {muted ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            )}
          </svg>
        </button>
      </div>

      {/* Center Brand Reveal & Automatic Opening Experience */}
      <div
        className="absolute inset-0 grid place-items-center text-center px-6 transition-all duration-[800ms] ease-in pointer-events-auto"
        style={{
          opacity: open ? 0 : 1,
          transform: open ? 'scale(1.08) translateZ(60px)' : 'none',
          pointerEvents: open ? 'none' : 'auto',
        }}
      >
        <div className="max-w-xl mx-auto w-full pt-10 flex flex-col items-center">
          {/* Central Featured Swan Brand Crest - Triple tap also triggers passcode */}
          <div
            onClick={handleLogoTap}
            className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 aspect-square rounded-full border-2 border-gold/80 bg-white shadow-[0_0_40px_rgba(198,161,91,0.5)] mb-4 flex items-center justify-center overflow-hidden p-2.5 transition-transform duration-700 hover:scale-105 active:scale-95 cursor-pointer"
            style={{ animation: 'introIn 1.2s var(--ease) .3s both' }}
          >
            <img
              src="/brand/swan-logo.png"
              alt="SANVI Silk Crest"
              className="w-full h-full object-contain"
            />
          </div>

          <p
            className="label !text-[11px] !tracking-[0.55em] text-gold/85"
            style={{ animation: 'introIn 1.2s var(--ease) .45s both' }}
          >
            Kanchipuram · Handwoven
          </p>

          <div className="flex justify-center items-center gap-5 text-gold mt-6 text-lg">
            {['✦', '✧', '✦'].map((s, i) => (
              <span
                key={i}
                style={{
                  animation: `introIn 1s var(--ease) ${0.7 + i * 0.18}s both, twinkle 3.5s ease-in-out ${2 + i * 0.4}s infinite`,
                }}
              >
                {s}
              </span>
            ))}
          </div>

          <h1
            className="font-display text-6xl sm:text-7xl md:text-8xl tracking-[0.35em] mr-[-0.35em] mt-5 bg-gradient-to-b from-champagne via-gold to-[#9c7a35] bg-clip-text text-transparent drop-shadow-[0_4px_25px_rgba(198,161,91,0.3)]"
            style={{ animation: 'brandIn 1.8s var(--ease) 0.9s both' }}
          >
            SANVI
          </h1>

          <p
            className="label !tracking-[0.7em] mr-[-0.7em] text-champagne/80 mt-4 text-xs sm:text-sm"
            style={{ animation: 'introIn 1.2s var(--ease) 1.5s both' }}
          >
            Boutique
          </p>

          <p
            className="font-display text-xl sm:text-2xl md:text-3xl tracking-[0.45em] mr-[-0.45em] text-gold mt-5 uppercase font-light drop-shadow-[0_2px_14px_rgba(198,161,91,0.45)]"
            style={{ animation: 'introIn 1.2s var(--ease) 1.65s both' }}
          >
            Coming Soon
          </p>

          <div
            className="mx-auto mt-7 h-px w-28 bg-gradient-to-r from-transparent via-gold to-transparent"
            style={{ animation: 'lineSpread 1.4s var(--ease) 1.8s both' }}
          />

          {/* Action Button & Client / Admin Mode */}
          <div className="mt-10 flex flex-col items-center justify-center gap-3">
            <button
              ref={btn}
              onClick={handleClientAction}
              className="relative group rounded-full p-[2px] transition-transform duration-500 hover:scale-105 active:scale-95 focus-visible:outline-2 focus-visible:outline-gold focus-visible:outline-offset-4"
              style={{ animation: 'introIn 1.2s var(--ease) 1.9s both' }}
              aria-label={isAdminUnlocked ? 'Open SANVI boutique' : 'Coming Soon'}
            >
              {/* Outer soft glowing border */}
              <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-gold/50 via-champagne/60 to-gold/50 opacity-40 blur-md group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className="relative rounded-full border border-gold/80 bg-wine/90 backdrop-blur-md px-12 sm:px-14 py-4 text-champagne transition-all duration-500 group-hover:bg-gold group-hover:text-wine group-hover:shadow-[0_0_45px_rgba(198,161,91,.55)]">
                <span className="label !text-sm !font-semibold !tracking-[0.45em] mr-[-0.45em]">
                  {isAdminUnlocked ? 'OPEN' : 'NOTIFY ME'}
                </span>
              </div>
            </button>

            {/* Subtle progress bar ONLY if Admin Mode */}
            {isAdminUnlocked ? (
              <div
                className="flex items-center gap-2 text-[10px] text-gold/75 tracking-[0.25em] font-sans uppercase mt-3 transition-opacity duration-500"
                style={{ animation: 'introIn 1.2s var(--ease) 2.1s both' }}
              >
                <span>Entering boutique</span>
                <div className="w-16 h-1 rounded-full bg-black/40 overflow-hidden border border-gold/30">
                  <div
                    className="h-full bg-gradient-to-r from-champagne to-gold rounded-full transition-all duration-75"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            ) : (
              <p
                className="text-[10px] text-gold/70 tracking-[0.3em] font-sans uppercase mt-3"
                style={{ animation: 'introIn 1.2s var(--ease) 2.1s both' }}
              >
                Exclusive Launch · Winter 2026
              </p>
            )}
          </div>
        </div>
      </div>
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-8 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
          <div className="rounded-full bg-gold/90 text-wine px-6 py-2.5 text-xs font-semibold tracking-wider uppercase backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.5)] animate-bounce">
            {toastMsg}
          </div>
        </div>
      )}

      {/* Secret Admin Passcode Modal */}
      {showPassModal && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setShowPassModal(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl border border-gold/70 bg-wine/95 p-6 text-center text-champagne shadow-[0_0_50px_rgba(198,161,91,0.4)]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-12 rounded-full border border-gold/70 mx-auto mb-3 flex items-center justify-center bg-white/10">
              <span className="font-display text-gold text-xl">✦</span>
            </div>
            <h3 className="font-display text-xl tracking-[0.2em] text-white">ADMIN ACCESS</h3>
            <p className="text-[11px] text-champagne/70 tracking-widest mt-1 uppercase">Enter Secret Passcode to Unlock</p>

            <form onSubmit={handleVerifyPass} className="mt-5">
              <input
                type="password"
                autoFocus
                placeholder="Enter PIN (e.g. 2026)"
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className={`w-full text-center tracking-[0.4em] text-lg bg-black/40 border ${
                  passError ? 'border-red-400 text-red-300' : 'border-gold/60 text-gold'
                } rounded-xl px-4 py-3 placeholder:text-white/20 focus:outline-none focus:border-gold`}
              />
              {passError && <p className="text-red-400 text-[11px] mt-2">Incorrect passcode. Try again.</p>}

              <div className="mt-5 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowPassModal(false)}
                  className="flex-1 rounded-full border border-white/20 py-2.5 text-xs tracking-wider text-white/70 hover:bg-white/10"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-full bg-gold text-wine font-semibold py-2.5 text-xs tracking-wider hover:bg-champagne transition-colors"
                >
                  UNLOCK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
