import { useState } from "react"
import { Sheet, SheetContent, SheetDescription, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Btn, EnquiryLink, useActiveSection, useScrolled } from "./site"

export const navItems = [
  { id: "vision", label: "The Vision" },
  { id: "development", label: "The Development" },
  { id: "residences", label: "Residences" },
  { id: "amenities", label: "Amenities" },
  { id: "location", label: "Location" },
  { id: "enquire", label: "Enquire" },
]

export function Header() {
  const scrolled = useScrolled()
  const active = useActiveSection(navItems.map((n) => n.id))
  const [open, setOpen] = useState(false)

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`} id="site-header">
      <div className="container site-header__inner">
        <a className="brand" href="#top" aria-label="Henry Montego Homes — back to top">
          <img src="assets/logo/logo.png" alt="Henry Montego Homes" width={1310} height={580} />
        </a>

        <nav className="site-nav" aria-label="Primary">
          <ul>
            {navItems.map((n) => (
              <li key={n.id}><a href={`#${n.id}`} aria-current={active === n.id ? "true" : undefined}>{n.label}</a></li>
            ))}
          </ul>
        </nav>

        <EnquiryLink className="btn btn--outline-light site-header__cta">
          Request a Private Briefing <svg className="icon" aria-hidden="true"><use href="sprite.svg#i-arrow" /></svg>
        </EnquiryLink>

        {/* Mobile menu: shadcn Sheet */}
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger className="nav-toggle" aria-label="Open menu"><span /></SheetTrigger>
          <SheetContent side="right" className="sheet-nav">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">Jump to a section of the page</SheetDescription>
            <ul>
              {navItems.map((n) => (
                <li key={n.id}>
                  <a href={`#${n.id}`} aria-current={active === n.id ? "true" : undefined} onClick={() => setOpen(false)}>{n.label}</a>
                </li>
              ))}
            </ul>
            <Btn variant="light" arrow href="#enquire" onClick={() => setOpen(false)}>Request a Private Briefing</Btn>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
