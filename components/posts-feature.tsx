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
                    lg:hover:scale-105
                    lg:w-[32%] w-full overflow-hidden rounded-lg
                  `}
                >
                  <article
                    className={`rounded-lg overflow-hidden relative lg:px-4 px-3 pb-2 h-[300px] cursor-pointer flex 
                        transition-all duration-300 ease-in-out items-end`}
                  >
                    <Image
                      // src={article.thumbnailUrl}
                      src={`/api/cache/image?url=${encodeURIComponent(article.thumbnailUrl)}`}
                      alt={article.postTitle}
                      fill
                      className={`object-cover transition-opacity duration-500 z-0 lg:opacity-100`}
                      priority={index === 0}
                    />

                    <div
                      className={`absolute w-full h-full top-0 left-0 bg-black lg:opacity-50 z-10 transition-opacity duration-500 opacity-50`}
                    />

                    <div className="relative z-20 flex flex-col gap-2">
                      <span
                        style={{ background: article.postCategory.color }}
                        className={`text-sm font-light text-white p-1 px-3 w-fit rounded-md text-center uppercase`}
                      >
                        {article.postCategory.name}
                      </span>
                      <h3
                        className={`lg:h-[100px] text-xl leading-tight font-medium text-white`}
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
    </section >
  )
}