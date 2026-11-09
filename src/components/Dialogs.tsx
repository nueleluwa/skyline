import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import { Icon, useEnquiry } from "./site"

/* ---- Floor plan --------------------------------------------------------------- */
export function PlanDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const [zoomed, setZoomed] = useState(false)
  const { goToEnquiry } = useEnquiry()
  useEffect(() => { if (!open) setZoomed(false) }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="modal-content" showCloseButton>
        <DialogTitle className="sr-only">Typical apartment floor plan</DialogTitle>
        <DialogDescription className="sr-only">Master bedroom with walk-in closet, two further bedrooms, living room, kitchen, pantry, laundry and swimming pool terrace.</DialogDescription>
        <div className={`plan-stage${zoomed ? " is-zoomed" : ""}`} onClick={() => setZoomed((z) => !z)}>
          <img
            src="assets/img/floorplan-1535.webp" width={1535} height={1023}
            alt="Typical apartment floor plan: master bedroom with walk-in closet, bedrooms 1 and 2, living room, kitchen, pantry, laundry, lobby, ante room, bath and swimming pool terrace"
          />
        </div>
        <div className="modal__bar">
          <p className="modal__caption">Typical apartment plan</p>
          <button type="button" className="btn btn--ghost btn--sm" aria-pressed={zoomed} onClick={() => setZoomed((z) => !z)}>
            <Icon name="expand" /> {zoomed ? "Fit to screen" : "Zoom in"}
          </button>
          <button
            type="button" className="btn btn--light btn--sm"
            onClick={() => { onOpenChange(false); goToEnquiry("Floor plans and brochure") }}
          >
            Request a Private Briefing <Icon name="arrow" />
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/* ---- Gallery lightbox ------------------------------------------------------- */
export type GalleryItem = { src: string; alt: string; caption: string }

export function Lightbox({ items, index, onIndex, onClose }: {
  items: GalleryItem[]; index: number | null; onIndex: (i: number) => void; onClose: () => void
}) {
  const open = index !== null
  const i = index ?? 0
  const go = (n: number) => onIndex((n + items.length) % items.length)
  const item = items[i]

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(i - 1)
      if (e.key === "ArrowRight") go(i + 1)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, i])

  const [x0, setX0] = useState<number | null>(null)

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose() }}>
      <DialogContent
        className="modal-content"
        onTouchStart={(e: React.TouchEvent) => setX0(e.touches[0].clientX)}
        onTouchEnd={(e: React.TouchEvent) => {
          if (x0 === null) return
          const dx = e.changedTouches[0].clientX - x0
          if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1))
          setX0(null)
        }}
      >
        <DialogTitle className="sr-only">Image viewer</DialogTitle>
        <DialogDescription className="sr-only">Use the arrow keys or the buttons to move between images.</DialogDescription>
        <button type="button" className="modal__nav modal__nav--prev" aria-label="Previous image" onClick={() => go(i - 1)}><Icon name="arrow" /></button>
        <button type="button" className="modal__nav modal__nav--next" aria-label="Next image" onClick={() => go(i + 1)}><Icon name="arrow" /></button>
        {item && (
          <figure className="modal__figure">
            <img src={item.src} alt={item.alt} />
            <figcaption className="modal__caption">{item.caption}</figcaption>
          </figure>
        )}
      </DialogContent>
    </Dialog>
  )
}
