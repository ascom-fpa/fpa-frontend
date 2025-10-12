'use client'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { ArrowLeft, ArrowLeftCircle, ArrowRight, ArrowRightCircle } from 'lucide-react'
import { useEffect, useState } from 'react'

interface Props {
  children: React.ReactNode[]
  perView?: number
  youtube?: boolean
  arrowTop?: string
}

export function ContentSlider({ children, perView = 3, youtube = false, arrowTop = '-top-16' }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0)
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
        slides: { perView: youtube ? 1 : 2, spacing: 8 },
      },
    },
    slideChanged(s) {
      setCurrentSlide(s.track.details.rel) // `rel` = relative index of current slide
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
          <div onClick={() => {
            slider.current?.moveToIdx(index)
          }} className="keen-slider__slide cursor-pointer" key={index}>
            {(youtube && (currentSlide + 1 == index)) && <div className="absolute top-0 left-0 opacity-40 bg-white w-full h-full z-10"></div>}
            {child}
          </div>
        ))}
      </div>

      <button
        onClick={goPrev}
        className={`cursor-pointer transition-all hover:scale-110 absolute right-10 ${arrowTop} text-[#787878] z-10`}
        aria-label='Seta esquerda'
      >
        <ArrowLeft className="h-8 w-8" />
      </button>
      <button
        onClick={goNext}
        className={`cursor-pointer transition-all hover:scale-110 absolute right-0 ${arrowTop} text-[#787878] z-10`}
        aria-label='Seta direita'
      >
        <ArrowRight className="h-8 w-8" />
      </button>
    </div>
  )
}