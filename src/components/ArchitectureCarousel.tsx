import { useEffect, useState } from "react"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"

const slides = [
  {
    label: "By day",
    src: "assets/img/development-day-1494.webp",
    srcSet: "assets/img/development-day-800.webp 800w, assets/img/development-day-1494.webp 1494w",
    w: 1494, h: 1051,
    alt: "Daytime render of Montego Skyline II: curved white terraces rising in a V-shape against a clear blue sky",
  },
  {
    label: "By night",
    src: "assets/img/wireframe-1490.webp",
    srcSet: "assets/img/wireframe-900.webp 900w, assets/img/wireframe-1490.webp 1490w",
    w: 1490, h: 940,
    alt: "Line drawing of Montego Skyline II at night: two curved wings meeting in a V, outlined in light",
  },
]

/** One image at a time: starts on the daytime render; arrows, dots or a swipe move to the night drawing. */
export function ArchitectureCarousel() {
  const [api, setApi] = useState<CarouselApi>()
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (!api) return
    const on = () => setIndex(api.selectedScrollSnap())
    on()
    api.on("select", on)
    return () => { api.off("select", on) }
  }, [api])

  return (
    <div className="arch-carousel" data-reveal style={{ ["--d" as string]: ".12s" }}>
      <Carousel setApi={setApi} opts={{ loop: true }} aria-label="Montego Skyline II by day and by night">
        <CarouselContent>
          {slides.map((s, i) => (
            <CarouselItem key={s.label} aria-label={`${s.label}, ${i + 1} of ${slides.length}`}>
              <img src={s.src} srcSet={s.srcSet} sizes="(max-width: 900px) 100vw, 58vw" width={s.w} height={s.h} loading={i === 0 ? "eager" : "lazy"} alt={s.alt} draggable={false} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
      <div className="arch-carousel__bar">
        <p aria-live="polite">{slides[index]?.label}</p>
        <div className="arch-carousel__dots" role="group" aria-label="Choose image">
          {slides.map((s, i) => (
            <button key={s.label} type="button" aria-label={s.label} aria-current={index === i} onClick={() => api?.scrollTo(i)} />
          ))}
        </div>
      </div>
    </div>
  )
}
