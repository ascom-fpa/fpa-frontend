'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PostsFeatureSkeleton from './skeletons/post-feature-skeleton'

export default function PostsFeature({ postsFeature }: any) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isLoading = !postsFeature || postsFeature.length === 0

  return (
    <section id='mais-lidas' className="py-8 px-4">
      <div className="max-w-[1300px] mx-auto">
        <div className="flex lg:flex-row flex-col gap-6">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
              <PostsFeatureSkeleton key={index} highlighted={index === 0} />
            ))
            : postsFeature.slice(0, 3).map((article: any, index: number) => {
              const isActive = index === activeIndex

              return (
                <Link
                  key={index}
                  href={`/noticia/${article.id}`}
                  prefetch
                  className={`
                    flex-shrink-0 
                    transition-all duration-500 ease-in-out
                    w-full overflow-hidden rounded-lg
                    ${isActive ? 'flex-[2_1_0%] lg:max-w-[500px]' : 'flex-[1_1_0%] lg:max-w-[400px]'}
                  `}
                  onMouseEnter={() => {
                    setActiveIndex(index)
                  }}
                >
                  <article
                    className={`rounded-lg overflow-hidden relative lg:px-4 px-8 pb-2 h-[300px] cursor-pointer flex 
                        lg:hover:scale-105 lg:hover:pb-4 lg:hover:px-8 transition-all duration-300 ease-in-out items-end`}
                  >
                    <Image
                      src={article.thumbnailUrl}
                      alt={article.postTitle}
                      fill
                      className={`object-cover transition-opacity duration-500 z-0 ${isActive ? 'lg:opacity-100' : 'lg:opacity-0'}`}
                      priority={index === 0}
                    />

                    <div
                      className={`absolute w-full h-full top-0 left-0 bg-black ${isActive ? 'lg:opacity-50' : 'lg:opacity-0'
                        } z-10 transition-opacity duration-500 opacity-50`}
                    />

                    <div className="relative z-20 flex flex-col gap-4">
                      <span
                        className={`text-sm font-light uppercase text-white ${isActive ? 'lg:text-white' : `lg:text-[${article.postCategory.color}]`}`}
                      >
                        {article.postCategory.name}
                      </span>
                      <h3
                        className={`lg:font-bold text-2xl ${isActive ? 'lg:text-white' : 'lg:text-[#3D3D3D]'
                          } leading-tight font-medium  text-white`}
                      >
                        {article.postTitle}
                      </h3>
                    </div>
                  </article>
                </Link>
              )
            })}
        </div>
      </div>
    </section>
  )
}