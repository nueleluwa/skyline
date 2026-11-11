import { createContext, useContext, useEffect, useState, type ComponentProps, type ReactNode } from "react"

/* ---- Icons (sprite in /public/sprite.svg) ---------------------------------- */
export function Icon({ name, className = "icon" }: { name: string; className?: string }) {
  return (
    <svg className={className} aria-hidden="true" focusable="false">
      <use href={`sprite.svg#i-${name}`} />
    </svg>
  )
}

/* ---- The site's own button (deliberately not a shadcn component) ----------- */
type BtnProps = {
  variant?: "light" | "dark" | "ghost" | "outline-dark" | "outline-light"
  small?: boolean
  arrow?: boolean
  children: ReactNode
  className?: string
} & ({ href: string } & Omit<ComponentProps<"a">, "className" | "children"> | { href?: undefined } & Omit<ComponentProps<"button">, "className" | "children">)

export function Btn({ variant = "dark", small, arrow, children, className = "", ...rest }: BtnProps) {
  const cls = `btn btn--${variant}${small ? " btn--sm" : ""} ${className}`.trim()
  const content = (<>{children}{arrow && <Icon name="arrow" />}</>)
  if ("href" in rest && rest.href !== undefined) {
    return <a className={cls} {...(rest as ComponentProps<"a">)}>{content}</a>
  }
  return <button className={cls} type="button" {...(rest as ComponentProps<"button">)}>{content}</button>
}

/* ---- Enquiry-type pre-selection shared between links and the form ---------- */
type EnquiryCtx = { type: string; setType: (t: string) => void; goToEnquiry: (t?: string) => void }
const Ctx = createContext<EnquiryCtx>({ type: "", setType: () => {}, goToEnquiry: () => {} })
export const useEnquiry = () => useContext(Ctx)

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches

export function EnquiryProvider({ children }: { children: ReactNode }) {
  const [type, setType] = useState("")
  const goToEnquiry = (t?: string) => {
    if (t) setType(t)
    document.getElementById("enquire")?.scrollIntoView({ behavior: reduceMotion() ? "auto" : "smooth", block: "start" })
    window.setTimeout(() => document.getElementById("f-name")?.focus({ preventScroll: true }), reduceMotion() ? 0 : 700)
  }
  return <Ctx.Provider value={{ type, setType, goToEnquiry }}>{children}</Ctx.Provider>
}

/** A link to the enquiry form that can pre-select the enquiry type. */
export function EnquiryLink({ type, children, className, ...rest }: { type?: string } & ComponentProps<"a">) {
  const { goToEnquiry } = useEnquiry()
  return (
    <a
      href="#enquire"
      className={className}
      {...rest}
      onClick={(e) => { e.preventDefault(); goToEnquiry(type) }}
    >
      {children}
    </a>
  )
}

/* ---- Scroll reveal, header state, active section --------------------------- */
export function useReveal() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add("js")
    ;(window as unknown as { __revealReady?: boolean }).__revealReady = true

    const items = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    const counters = Array.from(document.querySelectorAll<HTMLElement>("[data-count]"))

    // Give each child of a stagger group its position in the sequence (drives the CSS delay).
    items.forEach((el) => {
      if ((el.dataset.reveal ?? "").startsWith("stagger")) {
        Array.from(el.children).forEach((c, i) => (c as HTMLElement).style.setProperty("--i", String(i)))
      }
    })

    if (reduceMotion() || !("IntersectionObserver" in window)) {
      items.forEach((el) => el.classList.add("is-visible"))
      return
    }

    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add("is-visible"); obs.unobserve(e.target) } })
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 })
    items.forEach((el) => io.observe(el))

    // Count-up for figures. The final value is always in the markup; it is only replayed when first seen.
    const countIo = new IntersectionObserver((entries, obs) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return
        obs.unobserve(e.target)
        const el = e.target as HTMLElement
        const m = (el.textContent ?? "").trim().match(/^(\d+)(.*)$/)
        if (!m) return
        const target = Number(m[1]), suffix = m[2], dur = 1400, t0 = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - t0) / dur)
          el.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 4)))) + suffix
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      })
    }, { threshold: 0.6 })
    counters.forEach((el) => countIo.observe(el))

    return () => { io.disconnect(); countIo.disconnect() }
  }, [])
}

export function useScrolled() {
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24)
    on()
    window.addEventListener("scroll", on, { passive: true })
    return () => window.removeEventListener("scroll", on)
  }, [])
  return scrolled
}

export function useActiveSection(ids: string[]) {
  const [active, setActive] = useState<string | null>(null)
  useEffect(() => {
    if (!("IntersectionObserver" in window)) return
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) setActive(ids.includes(e.target.id) ? e.target.id : null) })
    }, { rootMargin: "-45% 0px -50% 0px" })
    document.querySelectorAll("main section[id]").forEach((t) => io.observe(t))
    return () => io.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return active
}
