'use client'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle } from 'lucide-react'
import { useEffect } from 'react'

interface Props {
  children: React.ReactNode[]
  perView?: number
}

export function ContentSlider({ children, perView = 3 }: Props) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView,
      spacing: 16,
    },
    breakpoints: {
      '(max-width: 1024px)': {
        slides: { perView: 2, spacing: 12 },
      },
      '(max-width: 640px)': {
        slides: { perView: 1, spacing: 8 },
      },
    },
  })

  const goPrev = () => slider.current?.prev()
  const goNext = () => slider.current?.next()

  useEffect(() => {
    slider.current?.update()
  }, [children])

  return (
    <div className="relative ">
      <div ref={sliderRef} className="keen-slider">
        {children.map((child, index) => (
          <div className="keen-slider__slide" key={index}>
            {child}
          </div>
        ))}
      </div>

      <button
        onClick={goPrev}
        className="cursor-pointer transition-all hover:scale-110 absolute right-10 -top-16 text-[#787878] z-10"
      >
        <ArrowLeft className="h-8 w-8" />
      </button>
      <button
        onClick={goNext}
        className="cursor-pointer transition-all hover:scale-110 absolute right-0 -top-16 text-[#787878] z-10"
      >
        <ArrowRight className="h-8 w-8" />
      </button>
    </div>
  )
}