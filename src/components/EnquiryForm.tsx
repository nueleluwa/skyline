import { useEffect, useRef, useState, type FormEvent } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { config, enquiryTypes, properties } from "@/config"
import { Icon, useEnquiry } from "./site"

type Values = { name: string; email: string; phone: string; development: string; type: string; message: string }
type Errors = Partial<Record<keyof Values, string>>

const rules: Record<keyof Values, (v: string) => string> = {
  name: (v) => (v.trim().length >= 2 ? "" : "Please enter your full name."),
  email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
  phone: (v) => {
    const digits = v.replace(/\D/g, "")
    return /^[+()\d\s.-]+$/.test(v.trim()) && digits.length >= 7 && digits.length <= 15 ? "" : "Please enter a valid phone number."
  },
  development: (v) => (v ? "" : "Please choose a development."),
  type: (v) => (v ? "" : "Please select the type of enquiry."),
  message: (v) => (v.length <= 1500 ? "" : "Please keep your message under 1,500 characters."),
}

const summary = (v: Values) =>
  `Enquiry: ${v.development}\nType of enquiry: ${v.type}\n\nName: ${v.name}\nEmail: ${v.email}\nPhone: ${v.phone}\n` +
  (v.message ? `\nMessage:\n${v.message}\n` : "")

type Notice = { kind: "info" | "error" | "success"; title: string; text: string; fallback?: Values } | null

export function EnquiryForm() {
  const { type, setType } = useEnquiry()
  const [v, setV] = useState<Values>({ name: "", email: "", phone: "", development: properties[0], type: "", message: "" })
  const [errors, setErrors] = useState<Errors>({})
  const [honeypot, setHoneypot] = useState("")
  const [busy, setBusy] = useState(false)
  const [notice, setNotice] = useState<Notice>(null)
  const statusRef = useRef<HTMLDivElement>(null)

  // Links elsewhere on the page pre-select the enquiry type.
  useEffect(() => { if (type) { setV((p) => ({ ...p, type })); setErrors((e) => ({ ...e, type: "" })) } }, [type])
  useEffect(() => { if (notice) statusRef.current?.focus({ preventScroll: true }) }, [notice])

  const set = (k: keyof Values, val: string) => {
    setV((p) => ({ ...p, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: rules[k](val) }))
  }
  const blur = (k: keyof Values) => { if (v[k]) setErrors((e) => ({ ...e, [k]: rules[k](v[k]) })) }

  const submit = async (e: FormEvent) => {
    e.preventDefault()
    setNotice(null)
    if (honeypot) return
    const next: Errors = {}
    ;(Object.keys(rules) as (keyof Values)[]).forEach((k) => { const m = rules[k](v[k]); if (m) next[k] = m })
    setErrors(next)
    const first = Object.keys(next)[0]
    if (first) {
      setNotice({ kind: "error", title: "Please check the highlighted fields.", text: "Some details are missing or look incorrect." })
      document.getElementById(first === "type" || first === "development" ? `f-${first}` : `f-${first}`)?.focus()
      return
    }
    const endpoint = config.formEndpoint.trim()
    if (!endpoint) {
      setNotice({ kind: "info", title: "Your enquiry is ready.", text: "Choose how you would like to send it to our sales team, and we will respond personally.", fallback: v })
      return
    }
    setBusy(true)
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ ...v, source: location.href, submittedAt: new Date().toISOString() }),
      })
      if (!res.ok) throw new Error("HTTP " + res.status)
      setV({ name: "", email: "", phone: "", development: properties[0], type: "", message: "" })
      setType("")
      setNotice({ kind: "success", title: "Thank you.", text: "A member of our private client team will contact you personally within one working day." })
    } catch {
      setNotice({ kind: "error", title: "We could not send your enquiry.", text: "Please try again, or send it directly using one of the options below.", fallback: v })
    } finally {
      setBusy(false)
    }
  }

  const err = (k: keyof Values) => (errors[k] ? <p className="field__error" id={`e-${k}`}>{errors[k]}</p> : null)
  const inv = (k: keyof Values) => (errors[k] ? { "aria-invalid": true as const, "aria-describedby": `e-${k}` } : {})

  return (
    <form className={`form${busy ? " is-busy" : ""}`} id="enquiry-form" noValidate data-reveal style={{ ["--d" as string]: ".12s" }} aria-labelledby="form-title" onSubmit={submit}>
      <h3 className="form__title" id="form-title">Request a Private Briefing</h3>
      <p className="form__intro">Priority access opens to registered clients first. Fields marked * are required.</p>

      <div className="form__grid">
        <div className="field field--full">
          <Label htmlFor="f-name">Full name <i>*</i></Label>
          <Input id="f-name" name="name" autoComplete="name" required value={v.name} onChange={(e) => set("name", e.target.value)} onBlur={() => blur("name")} {...inv("name")} />
          {err("name")}
        </div>
        <div className="field">
          <Label htmlFor="f-email">Email address <i>*</i></Label>
          <Input id="f-email" name="email" type="email" autoComplete="email" inputMode="email" required value={v.email} onChange={(e) => set("email", e.target.value)} onBlur={() => blur("email")} {...inv("email")} />
          {err("email")}
        </div>
        <div className="field">
          <Label htmlFor="f-phone">Phone number <i>*</i></Label>
          <Input id="f-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" placeholder="e.g. 0902 544 1368" required value={v.phone} onChange={(e) => set("phone", e.target.value)} onBlur={() => blur("phone")} {...inv("phone")} />
          {err("phone")}
        </div>
        <div className="field">
          <Label htmlFor="f-development">Interested property <i>*</i></Label>
          <Select value={v.development} onValueChange={(x) => set("development", x ?? "")}>
            <SelectTrigger id="f-development" {...inv("development")}><SelectValue /></SelectTrigger>
            <SelectContent>{properties.map((p) => <SelectItem key={p} value={p}>{p}</SelectItem>)}</SelectContent>
          </Select>
          {err("development")}
        </div>
        <div className="field">
          <Label htmlFor="f-type">Type of enquiry <i>*</i></Label>
          <Select value={v.type || null} onValueChange={(x) => { set("type", x ?? ""); setType(x ?? "") }}>
            <SelectTrigger id="f-type" {...inv("type")}><SelectValue placeholder="Select…" /></SelectTrigger>
            <SelectContent>{enquiryTypes.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
          </Select>
          {err("type")}
        </div>
        <div className="field field--full">
          <Label htmlFor="f-message">Message</Label>
          <Textarea id="f-message" name="message" maxLength={1500} rows={4} value={v.message} onChange={(e) => set("message", e.target.value)} {...inv("message")} />
          {err("message")}
        </div>
        <div className="hp" aria-hidden="true">
          <label>Leave this field empty <input type="text" name="company" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} /></label>
        </div>
      </div>

      <div className="form__actions">
        <button className="btn btn--dark" type="submit">Request a Private Briefing <Icon name="arrow" /></button>
      </div>

      <div className="form__status" id="form-status" role="status" aria-live="polite" tabIndex={-1} ref={statusRef}>
        {notice && (
          <div className={`notice${notice.kind === "error" ? " notice--error" : notice.kind === "success" ? " notice--success" : ""}`}>
            <strong>{notice.title}</strong><span>{notice.text}</span>
            {notice.fallback && (
              <div className="notice__actions">
                <a className="btn btn--dark btn--sm" href={`mailto:${config.leadEmail}?subject=${encodeURIComponent(`Enquiry: ${notice.fallback.development} — ${notice.fallback.type}`)}&body=${encodeURIComponent(summary(notice.fallback))}`}>Send by email</a>
                <a className="btn btn--outline-dark btn--sm" href={`https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent(summary(notice.fallback))}`} target="_blank" rel="noopener">Send on WhatsApp</a>
              </div>
            )}
          </div>
        )}
      </div>
    </form>
  )
}
