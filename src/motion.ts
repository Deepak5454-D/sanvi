import { useEffect } from 'react'

// Scroll reveals (once per element) and gentle parallax, driven by data attributes.
export function useMotion() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const els = document.querySelectorAll<HTMLElement>('[data-reveal]')
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } }),
      { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
    )
    els.forEach((el) => io.observe(el))

    const par = Array.from(document.querySelectorAll<HTMLElement>('[data-parallax]'))
    let raf = 0
    const run = () => {
      raf = 0
      const vh = window.innerHeight
      par.forEach((el) => {
        // measure the parent so our own translate never feeds back into the calculation
        const r = (el.parentElement as HTMLElement).getBoundingClientRect()
        if (r.bottom < -200 || r.top > vh + 200) return
        const f = parseFloat(el.dataset.parallax || '0')
        el.style.translate = `0 ${-(r.top + r.height / 2 - vh / 2) * f}px`
      })
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(run) }
    if (!reduce && par.length) { window.addEventListener('scroll', onScroll, { passive: true }); run() }
    // Delegated tilt: mouse follows cursor, touch tilts toward the finger while pressed.
    let cur: HTMLElement | null = null
    const reset = (el: HTMLElement | null) => {
      if (!el) return
      el.classList.remove('tilting')
      el.style.removeProperty('--rx'); el.style.removeProperty('--ry'); el.style.removeProperty('--tz')
    }
    const tilt = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.('[data-tilt]') as HTMLElement | null
      if (el !== cur) { reset(cur); cur = el }
      if (!el) return
      const r = el.getBoundingClientRect()
      const max = parseFloat(el.dataset.tilt || '8')
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5
      el.classList.add('tilting')
      el.style.setProperty('--ry', `${x * max}deg`)
      el.style.setProperty('--rx', `${-y * max}deg`)
      el.style.setProperty('--tz', `${Math.min(14, max * 1.4)}px`)
    }
    const release = () => { reset(cur); cur = null }
    const onMove = (e: PointerEvent) => { if (e.pointerType === 'mouse' || e.buttons) tilt(e) }
    const onDown = (e: PointerEvent) => { if (e.pointerType !== 'mouse') tilt(e) }
    if (!reduce) {
      document.addEventListener('pointermove', onMove, { passive: true })
      document.addEventListener('pointerdown', onDown, { passive: true })
      document.addEventListener('pointerup', release)
      document.addEventListener('pointercancel', release)
      document.documentElement.addEventListener('mouseleave', release)
    }
    return () => {
      io.disconnect(); window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf)
      document.removeEventListener('pointermove', onMove); document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('pointerup', release); document.removeEventListener('pointercancel', release)
      document.documentElement.removeEventListener('mouseleave', release)
    }
  }, [])
}
