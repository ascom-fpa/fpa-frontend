'use client'

import 'keen-slider/keen-slider.min.css'
import { useKeenSlider } from 'keen-slider/react'
import { ArrowLeft, ArrowLeftCircle, ArrowRightCircle } from 'lucide-react'
import { useEffect, useRef } from 'react'

interface Video {
  id: string
  url: string
  updatedAt: string
}

interface Props {
  videos: any[]
  width?: number
  height?: number
  perView?: number
}

export function VideoSlider({ videos, width = 330, height = 220, perView = 3 }: Props) {
  const [sliderRef, slider] = useKeenSlider<HTMLDivElement>({
    slides: {
      perView,
      spacing: 8,
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
    if (slider.current) {
      slider.current.update()
    }
  }, [videos])

  return (
    <div className="relative">
      <div ref={sliderRef} className="keen-slider">
        {videos.map((video) => (
          <div className="keen-slider__slide" key={video.id}>
            <div style={{ width, height }} className="relative rounded-xl mx-auto overflow-hidden bg-black">
              <video className="w-full h-full object-cover" src={video.url || video.videoUrl} controls />
              <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded">
                {new Date(video.updatedAt).toLocaleDateString('pt-BR')}
              </div>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={goPrev}
        className="cursor-pointer absolute right-10 -top-16 bg-black/60 text-white p-2 rounded-full z-10"
      >
        <ArrowLeftCircle className="h-5 w-5" />
      </button>
      <button
        onClick={goNext}
        className="cursor-pointer absolute right-0 -top-16 bg-black/60 text-white p-2 rounded-full z-10"
      >
        <ArrowRightCircle className="h-5 w-5" />
      </button>
    </div>
  )
}