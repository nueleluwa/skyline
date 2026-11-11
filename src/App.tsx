import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { config } from "@/config"
import { Header } from "@/components/Header"
import { ArchitectureCarousel } from "@/components/ArchitectureCarousel"
import { EnquiryForm } from "@/components/EnquiryForm"
import { Lightbox, PlanDialog, type GalleryItem } from "@/components/Dialogs"
import { Btn, EnquiryLink, EnquiryProvider, Icon, useReveal } from "@/components/site"

const waHello = `https://wa.me/${config.whatsappNumber}?text=${encodeURIComponent("Hello, I'd like to know more about Montego Skyline II.")}`

const pillars = [
  { title: "Signature Residences", text: "Panoramic homes with private pool terraces, refined interiors and exceptional finishes, designed for those who expect more from where they live.", link: "View the floor plan", href: "#residences" },
  { title: "Hospitality", text: "A hotel-grade arrival experience and guest services that bring five-star standards to everyday living.", link: "Ask about hospitality", type: "Healthcare or hospitality partnership" },
  { title: "Healthcare", text: "Modern medical facilities within the towers, so world-class care is always a lift ride away.", link: "Ask about healthcare", type: "Healthcare or hospitality partnership" },
  { title: "Private Banking and Finance", text: "Convenient financial services under the same roof, built for residents, tenants and visitors alike.", link: "Ask about banking", type: "General enquiry" },
  { title: "Fine Dining and Retail", text: "Destination restaurants and curated retail behind a glazed, landscaped frontage on Remi-Olowude.", link: "Ask about retail and dining", type: "Retail or hospitality space" },
  { title: "Wellness and Spa", text: "Infinity pools, a spa and a fitness centre designed to resort standards, at the ocean's edge.", link: "Ask about wellness", type: "General enquiry" },
  { title: "Workspaces", text: "Premium offices where business on Victoria Island begins at your doorstep.", link: "Ask about workspaces", type: "Workspace" },
]

const clusters = [
  { title: "Living", blurb: "The residence", items: ["Ocean and skyline views through full-height glazing", "Master suite with walk-in closet", "Two further bedrooms, each with its own aspect", "Living and dining room opening onto the terrace", "Kitchen with pantry and laundry, kept apart from the living spaces", "Private pool terrace, with water at the edge of the living room"] },
  { title: "Leisure", blurb: "At the ocean's edge", items: ["Infinity pools that appear to meet the Atlantic, fed by water drawn from the ocean's edge", "A fitness and wellness centre designed to resort standards", "A private residents' club for entertaining and connection", "Fine dining and curated retail at the foot of the towers"] },
  { title: "Lifestyle and Service", blurb: "Every day, effortless", items: ["Round-the-clock security and white-glove concierge", "Secure, dedicated parking for residents and guests"] },
]

const gallery: (GalleryItem & { w: number; h: number })[] = [
  { src: "assets/img/crop-tower-520.webp", w: 510, h: 975, alt: "The taller tower glowing warmly at dusk, its curved terraces lit from within", caption: "The tower at dusk" },
  { src: "assets/img/crop-cascade-610.webp", w: 610, h: 560, alt: "Turquoise water cascading down the curved terraces of the building", caption: "Water descending the façade" },
  { src: "assets/img/crop-podium-1020.webp", w: 1020, h: 345, alt: "The glazed podium and landscaped frontage at the base of the development", caption: "Podium & landscaped frontage" },
]

function Accent({ children }: { children: string }) { return <span className="accent">{children}</span> }

export default function App() {
  return <EnquiryProvider><Page /></EnquiryProvider>
}

function Page() {
  useReveal()
  const [planOpen, setPlanOpen] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <div id="top">
      <a className="skip-link" href="#main">Skip to content</a>
      <Header />

      <main id="main">
        {/* HERO */}
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="hero__media">
            <img src="assets/img/hero-night-1449.webp" srcSet="assets/img/hero-night-900.webp 900w, assets/img/hero-night-1449.webp 1449w" sizes="(max-width: 900px) 100vw, 72vw" width={1449} height={1085} fetchPriority="high" alt="Montego Skyline II at night, outlined in electric blue light, with palm trees and landscaping in the foreground" />
          </div>
          <div className="container hero__inner">
            <div className="hero__copy">
              <p className="eyebrow">Oniru, Victoria Island</p>
              <h1 className="display" id="hero-title">Montego Skyline II, A city in the Sky. <Accent>Where Lagos Meets the World</Accent></h1>
              <p className="lede">Two sculptural towers on Victoria Island&rsquo;s Atlantic edge: a vertical city of luxury residences, five-star hospitality, world-class healthcare, private banking, fine dining and wellness.</p>
              <div className="hero__cta">
                <Btn variant="light" arrow href="#development">Discover the Development</Btn>
                <EnquiryLink className="btn btn--ghost" type="Floor plans and brochure">Request the Private Brochure</EnquiryLink>
              </div>
              <p className="hero__status">By Henry Montego Homes &middot; Remi-Olowude, Oniru, Victoria Island</p>
            </div>
          </div>
        </section>

        {/* FIGURES: only confirmed figures. Add height, residences, built-up area and coastal frontage once verified. */}
        <section className="figures" aria-label="Montego Skyline II at a glance">
          <ul className="container figures__list" data-reveal="stagger">
            <li><strong data-count>2</strong><span>Towers</span><small>Two curved wings, one skyline</small></li>
            <li><strong data-count>20</strong><span>Floors</span><small>Rising above the Atlantic coast</small></li>
          </ul>
        </section>

        {/* INTRODUCTION */}
        <section className="section intro" id="vision" aria-labelledby="vision-title">
          <div className="container intro__grid">
            <div data-reveal>
              <p className="eyebrow">The Vision</p>
              <h2 className="h2" id="vision-title">Not just a building. <Accent>A new chapter for the city.</Accent></h2>
            </div>
            <div data-reveal style={{ ["--d" as string]: ".12s" }}>
              <p className="lede">Great cities are remembered by their skylines.</p>
              <p className="lede">Rising in the heart of Oniru, Montego Skyline II brings together everything the world&rsquo;s most admired destinations offer: a place to live, to heal, to work, to dine and to unwind. Two sculptural towers, shaped by the Atlantic itself, hold it all under a single address.</p>
              <p className="lede">A morning swim above the ocean. A boardroom meeting a lift ride from home. A world-class consultation without leaving the building. A dinner as the sun sets over the lagoon. This is Lagos living at the highest global standard.</p>
              <a className="link-arrow" href="#development">Discover the development <Icon name="arrow" /></a>
            </div>
          </div>
        </section>

        {/* STATEMENT BANNER */}
        <section className="statement" aria-label="Statement">
          <blockquote className="container" data-reveal="stagger">
            <p>World-class luxury no longer belongs exclusively to Dubai, Miami, Monaco or Manhattan.</p>
            <p className="statement__close">It belongs here, in Lagos.</p>
          </blockquote>
        </section>

        {/* THE DEVELOPMENT */}
        <section className="section development" id="development" aria-labelledby="development-title">
          <div className="container">
            <header className="development__head" data-reveal>
              <p className="eyebrow">The Development</p>
              <h2 className="h2" id="development-title">One address. <Accent>Every dimension of a great life.</Accent></h2>
              <p className="lede">Montego Skyline II is designed as a complete, self-sustaining destination, where every part of daily life is considered and close at hand.</p>
            </header>
            <div className="pillars" data-reveal style={{ ["--d" as string]: ".12s" }}>
              {pillars.map((p, i) => (
                <Card key={p.title} className="pillar">
                  <CardHeader>
                    <Badge variant="outline" className="pillar__num">{String(i + 1).padStart(2, "0")}</Badge>
                    <CardTitle className="pillar__title">{p.title}</CardTitle>
                  </CardHeader>
                  <CardContent><CardDescription className="pillar__text">{p.text}</CardDescription></CardContent>
                  <CardFooter className="pillar__foot">
                    {p.href
                      ? <a className="link-arrow" href={p.href}>{p.link} <Icon name="arrow" /></a>
                      : <EnquiryLink className="link-arrow" type={p.type}>{p.link} <Icon name="arrow" /></EnquiryLink>}
                  </CardFooter>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* ARCHITECTURE. The bracketed "engineered for the future" line is left out until the claim is confirmed. */}
        <section className="section architecture" id="architecture" aria-labelledby="architecture-title">
          <div className="container split">
            <div data-reveal="right">
              <p className="eyebrow">The Architecture</p>
              <h2 className="h2" id="architecture-title">Designed to be seen <Accent>from across the lagoon.</Accent></h2>
              <p className="lede">Two curved wings rise and meet in a V, an architectural gesture that frames the Atlantic and gives the Lagos skyline a new silhouette. Turquoise water cascades down the terraces, linking the towers to the ocean they face.</p>
              <p className="lede">Every line, from the sweep of the façade to the glazed ground-floor frontage, was drawn to make the towers feel light, open and unmistakably Lagos.</p>
            </div>
            <ArchitectureCarousel />
          </div>
        </section>

        {/* RESIDENCES */}
        <section className="section residences" id="residences" aria-labelledby="residences-title">
          <div className="container residences__grid">
            <div data-reveal>
              <p className="eyebrow">The Residences</p>
              <h2 className="h2" id="residences-title">Homes that <Accent>belong to the horizon.</Accent></h2>
              <p className="lede">Expansive apartments with panoramic ocean and city views, framed by full-height glazing. Refined interiors and exceptional finishes, with space for family life and for entertaining.</p>
              <p className="lede">The typical residence offers three bedrooms, a master suite with walk-in closet, a living and dining room that opens onto the terrace, and a private pool terrace: water at the edge of your living room.</p>
              <div className="btn-row">
                <Btn variant="dark" arrow onClick={() => setPlanOpen(true)}>View the floor plan</Btn>
                <EnquiryLink className="btn btn--outline-dark" type="Floor plans and brochure">Ask for the brochure</EnquiryLink>
              </div>
            </div>
            <button className="plan__open" type="button" data-reveal="image" style={{ ["--d" as string]: ".12s" }} aria-label="Open the typical apartment floor plan in a larger view" onClick={() => setPlanOpen(true)}>
              <img src="assets/img/floorplan-1535.webp" srcSet="assets/img/floorplan-800.webp 800w, assets/img/floorplan-1535.webp 1535w" sizes="(max-width: 900px) 100vw, 58vw" width={1535} height={1023} loading="lazy" alt="Typical apartment floor plan showing master bedroom, two further bedrooms, living room, kitchen, pantry, laundry and a swimming pool terrace" />
              <span className="plan__hint"><Icon name="expand" /> Enlarge plan</span>
            </button>
          </div>
        </section>

        {/* AMENITIES */}
        <section className="section section--dark amenities" id="amenities" aria-labelledby="amenities-title">
          <div className="container">
            <header className="amenities__head" data-reveal>
              <p className="eyebrow">World-Class Amenities</p>
              <h2 className="h2" id="amenities-title">Every detail, <Accent>considered.</Accent></h2>
              <p className="lede">From the front door to the rooftop pools, a standard of living designed without compromise.</p>
            </header>
            <div className="amenity-clusters" data-reveal="stagger">
              {clusters.map((c, i) => (
                <article key={c.title} className="cluster" aria-labelledby={`cluster-${i}`}>
                  <header className="cluster__head">
                    <span className="cluster__num" aria-hidden="true">{String(i + 1).padStart(2, "0")}</span>
                    <p className="cluster__blurb">{c.blurb}</p>
                  </header>
                  <h3 className="cluster__title" id={`cluster-${i}`}>{c.title}</h3>
                  <ul className="cluster__list">{c.items.map((t) => <li key={t}>{t}</li>)}</ul>
                </article>
              ))}
            </div>
            <div className="amenities__foot" data-reveal>
              <p>Priority access opens to registered clients first.</p>
              {config.registerInterestUrl
                ? <Btn variant="light" arrow href={config.registerInterestUrl} target="_blank" rel="noopener">Register your interest</Btn>
                : <EnquiryLink className="btn btn--light">Register your interest <Icon name="arrow" /></EnquiryLink>}
            </div>
          </div>
        </section>

        {/* EXPERIENCE */}
        <section className="experience" id="experience" aria-labelledby="experience-title">
          <div className="experience__media" data-reveal="image">
            <img src="assets/img/experience-sunset-1494.webp" srcSet="assets/img/experience-sunset-900.webp 900w, assets/img/experience-sunset-1494.webp 1494w" sizes="(max-width: 900px) 100vw, 60vw" width={1494} height={1051} loading="lazy" alt="Sunset render of Montego Skyline II, with turquoise water cascading down the curved facade" />
          </div>
          <div className="experience__copy" data-reveal="right" style={{ ["--d" as string]: ".15s" }}>
            <p className="eyebrow">The Experience</p>
            <h2 className="h2" id="experience-title">Where the Atlantic Becomes Part of Home.</h2>
            <p className="lede">Water drawn from the ocean&rsquo;s edge courses through the development, feeding a series of infinity pools that dissolve the boundary between architecture and sea.</p>
            <p className="lede"><strong>Residents do not simply look at the Atlantic. They live within it.</strong></p>
          </div>
        </section>

        {/* GALLERY */}
        <section className="section gallery-section" id="gallery" aria-labelledby="gallery-title">
          <div className="container">
            <header className="gallery-section__head" data-reveal>
              <p className="eyebrow">The Gallery</p>
              <h2 className="h2" id="gallery-title">Architecture, Up Close.</h2>
              <p className="lede">Curved terraces, cascading water and a landscaped podium &mdash; details of Montego Skyline II.</p>
            </header>
            <div className="gallery" data-reveal="stagger-image" role="group" aria-label="Gallery of Montego Skyline II">
              {gallery.map((g, i) => (
                <button key={g.src} className="gallery__item" type="button" onClick={() => setLightbox(i)}>
                  <img src={g.src} width={g.w} height={g.h} loading="lazy" alt={g.alt} />
                  <span className="gallery__label">{g.caption}</span>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* INVESTMENT. Proof points are left out until verified: waterfront scarcity, rental demand/yield with source, flexible payment plan, mixed-use income streams. */}
        <section className="section investment" id="investment" aria-labelledby="investment-title">
          <div className="container intro__grid">
            <div data-reveal>
              <p className="eyebrow">The Opportunity</p>
              <h2 className="h2" id="investment-title">Why Oniru. <Accent>Why now.</Accent></h2>
            </div>
            <div data-reveal style={{ ["--d" as string]: ".12s" }}>
              <p className="lede">Victoria Island is Nigeria&rsquo;s most prestigious address for business, diplomacy and luxury living. Oniru&rsquo;s coastal frontage, scarce land and growing demand for mixed-use, branded developments make it one of the most compelling places in Lagos to own.</p>
              <p className="lede">Montego Skyline II is built to hold its value: a rare waterfront location, a landmark design and a mix of residential, hospitality, healthcare, retail and workspace that supports lasting demand.</p>
              <EnquiryLink className="btn btn--dark" type="Investment opportunity" style={{ marginTop: 36 }}>Speak to our investment team <Icon name="arrow" /></EnquiryLink>
            </div>
          </div>
        </section>

        {/* LOCATION. Travel times are left out until verified. */}
        <section className="section location" id="location" aria-labelledby="location-title">
          <div className="location__bg" aria-hidden="true">
            <img src="assets/img/wireframe-1490.webp" srcSet="assets/img/wireframe-900.webp 900w, assets/img/wireframe-1490.webp 1490w" sizes="100vw" width={1490} height={940} loading="lazy" alt="" />
          </div>
          <div className="container location__grid">
            <div data-reveal>
              <p className="eyebrow">Location</p>
              <h2 className="h2" id="location-title">Oniru, <Accent>Victoria Island.</Accent></h2>
              <p className="lede">At the centre of everything that matters.</p>
              <p className="lede">Oniru places you minutes from Lagos&rsquo; business districts, beaches, embassies, fine dining and international schools, without leaving the coast.</p>
              <dl className="location__facts">
                {[
                  ["The site", "Remi-Olowude, Oniru, Lagos"],
                  ["Sales office", "35 Bishop Aboyade Cole, Victoria Island"],
                  ["Phone", <a key="p" href="tel:+2349025441368">0902 544 1368</a>],
                  ["Email", <a key="e" href="mailto:info@henrymontegohomes.com">info@henrymontegohomes.com</a>],
                ].map(([dt, dd]) => (
                  <div key={String(dt)}><dt>{dt}</dt><dd>{dd}</dd></div>
                ))}
              </dl>
              <div className="location__links">
                <a className="link-arrow" href="https://maps.apple.com/?address=Remi%20Olowude%20Way,%20Eti-Osa,%20Lagos,%20Nigeria&ll=6.427016,3.468215&q=Remi%20Olowude%20Way&t=m" target="_blank" rel="noopener">Apple Maps <Icon name="arrow" /></a>
                <a className="link-arrow" href="https://www.google.com/maps/search/?api=1&query=6.427016,3.468215" target="_blank" rel="noopener">Google Maps <Icon name="arrow" /></a>
              </div>
              <EnquiryLink className="btn btn--light" style={{ marginTop: 34 }}>Request a Private Briefing <Icon name="arrow" /></EnquiryLink>
            </div>
            <div className="map" data-reveal style={{ ["--d" as string]: ".12s" }}>
              <iframe title="Map showing Remi-Olowude, Oniru, Lagos" loading="lazy" referrerPolicy="no-referrer-when-downgrade" src="https://www.openstreetmap.org/export/embed.html?bbox=3.462715%2C6.423516%2C3.473715%2C6.430516&layer=mapnik" />
              <div className="map__pin" aria-hidden="true"><span className="map__pin-dot" /><span className="map__pin-label">Montego Skyline II</span></div>
            </div>
          </div>
        </section>

        {/* DEVELOPER. "We'll send a Company profile." and the awards placeholder are left out. */}
        <section className="section developer" id="developer" aria-labelledby="developer-title">
          <div className="container">
            <header className="developer__head" data-reveal>
              <p className="eyebrow">The Developer</p>
              <h2 className="h2" id="developer-title">Built by a team <Accent>that delivers.</Accent></h2>
            </header>
            <ul className="figures__list figures__list--light" data-reveal="stagger">
              <li><strong data-count>10</strong><span>Years in business</span></li>
              <li><strong data-count>5</strong><span>Estates delivered</span></li>
              <li><strong data-count>200+</strong><span>Homes handed over</span></li>
            </ul>
            <div className="developer__cta" data-reveal>
              <EnquiryLink className="btn btn--dark" type="General enquiry">Meet Henry Montego Homes <Icon name="arrow" /></EnquiryLink>
            </div>
          </div>
        </section>

        {/* ENQUIRY */}
        <section className="section enquiry" id="enquire" aria-labelledby="enquire-title">
          <div className="container enquiry__grid">
            <div className="enquiry__intro" data-reveal>
              <p className="eyebrow">Enquire</p>
              <h2 className="h2" id="enquire-title">Reserve your place <Accent>in the skyline.</Accent></h2>
              <p className="lede">Whether you are choosing a home or making an investment, our private client team will guide you personally through availability, floor plans and payment options.</p>
              <p className="lede">Prefer to talk now? Call <a href="tel:+2349025441368">0902 544 1368</a> or <a href={waHello} target="_blank" rel="noopener">message us on WhatsApp</a>.</p>
              <ul className="contact-list">
                <li><Icon name="phone" /><div><small>Phone</small><a href="tel:+2349025441368">0902 544 1368</a></div></li>
                <li><Icon name="whatsapp" /><div><small>WhatsApp</small><a href={waHello} target="_blank" rel="noopener">Chat with our team</a></div></li>
                <li><Icon name="mail" /><div><small>Email</small><a href="mailto:info@henrymontegohomes.com">info@henrymontegohomes.com</a></div></li>
                <li><Icon name="pin" /><div><small>Office</small>35 Bishop Aboyade Cole, Victoria Island, Lagos, Nigeria.</div></li>
              </ul>
            </div>
            <EnquiryForm />
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="footer">
        <div className="container">
          <div className="footer__top">
            <a className="footer__brand" href="#top" aria-label="Henry Montego Homes — back to top"><img src="assets/logo/logo-footer.png" alt="Henry Montego Homes" width={754} height={503} loading="lazy" /></a>
            <p className="footer__statement">Creating developments that elevate African real estate to the highest global standard.</p>
            <EnquiryLink className="btn btn--dark">Request a Private Briefing <Icon name="arrow" /></EnquiryLink>
          </div>
          <Separator className="footer__rule" />
          <div className="footer__mid" data-reveal="stagger">
            <div>
              <h2>Explore</h2>
              <p><a href="#vision">The Vision</a><br /><a href="#development">The Development</a><br /><a href="#residences">Residences</a><br /><a href="#amenities">Amenities</a><br /><a href="#location">Location</a><br /><a href="#enquire">Enquire</a></p>
            </div>
            <div>
              <h2>Contact</h2>
              <p><a href="tel:+2349025441368">0902 544 1368</a><br /><a href="mailto:info@henrymontegohomes.com">info@henrymontegohomes.com</a><br /><a href={`https://wa.me/${config.whatsappNumber}`} target="_blank" rel="noopener">WhatsApp</a></p>
            </div>
            <div>
              <h2>Henry Montego Homes</h2>
              <address style={{ fontStyle: "normal" }}>35 Bishop Aboyade Cole,<br />Victoria Island, Lagos, Nigeria.</address>
            </div>
            <div>
              <h2>Follow</h2>
              <div className="footer__social">
                <a href="https://www.instagram.com/henrymontegohomes/" target="_blank" rel="noopener"><Icon name="instagram" /> Instagram</a>
              </div>
            </div>
          </div>
          <Separator className="footer__rule" />
          <div className="footer__bottom">
            <p>&copy; {new Date().getFullYear()} Henry Montego Homes Ltd. All rights reserved.</p>
            <p>Images are architectural renders and are illustrative only.</p>
          </div>
        </div>
      </footer>

      <a className="whatsapp" href={waHello} target="_blank" rel="noopener" aria-label="Chat with Henry Montego Homes on WhatsApp">
        <Icon name="whatsapp" /><span>Chat on WhatsApp</span>
      </a>

      <PlanDialog open={planOpen} onOpenChange={setPlanOpen} />
      <Lightbox items={gallery} index={lightbox} onIndex={setLightbox} onClose={() => setLightbox(null)} />
    </div>
  )
}
