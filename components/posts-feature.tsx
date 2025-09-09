'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import PostsFeatureSkeleton from './skeletons/post-feature-skeleton'

export default function PostsFeature({ postsFeature }: any) {
  const [activeIndex, setActiveIndex] = useState(0)
  const isLoading = !postsFeature || postsFeature.length === 0

  return (
    <section className="py-8 px-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex gap-6 overflow-x-auto md:overflow-visible">
          {isLoading
            ? Array.from({ length: 4 }).map((_, index) => (
              <PostsFeatureSkeleton key={index} highlighted={index === 0} />
            ))
            : postsFeature.map((article: any, index: number) => {
              const isActive = index === activeIndex

              return (
                <Link
                  key={index}
                  href={`/noticia/${article.id}`}
                  prefetch
                  className={`
                      transition-all duration-500 ease-in-out 
                      flex-shrink-0 
                      ${isActive ? 'grow basis-[30%]' : 'basis-[22%]'}
                    `}
                  onMouseEnter={() => setActiveIndex(index)}
                >
                  <article
                    className={`rounded-lg overflow-hidden relative p-4 h-[300px] cursor-pointer flex 
                        ${isActive ? 'items-end' : 'items-center'} 
                        hover:scale-105 transition-all duration-300 ease-in-out`}
                  >
                    <Image
                      src={article.thumbnailUrl}
                      alt={article.postTitle}
                      fill
                      className="object-cover transition-opacity duration-500 z-0"
                      style={{ opacity: isActive ? 1 : 0 }}
                      priority={index === 0}
                    />

                    <div
                      className={`absolute w-full h-full top-0 left-0 bg-black ${isActive ? 'opacity-30' : 'opacity-0'
                        } z-10 transition-opacity duration-500`}
                    />

                    <div className="relative z-20 flex flex-col gap-4">
                      <span
                        style={{ color: isActive ? '#fff' : article.postCategory.color }}
                        className="text-sm font-light uppercase"
                      >
                        {article.postCategory.name}
                      </span>
                      <h3
                        className={`font-bold text-2xl ${isActive ? 'text-white' : 'text-[#3D3D3D]'
                          } leading-tight`}
                      >
                        {article.postTitle}
                      </h3>
                      <p
                        className={`${isActive ? 'text-white' : 'text-[#787878]'
                          } text-sm leading-relaxed`}
                      >
                        {article.summary?.slice(0, 100)}...
                      </p>
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