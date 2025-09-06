'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function PostsFeature({ postsFeature }: any) {
  const [activeIndex, setActiveIndex] = useState(0)

  return (
    <section className="py-8 px-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid md:grid-cols-4 gap-6">
          {postsFeature.map((article: any, index: number) => {
            const isActive = index === activeIndex

            return (
            <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${article.id}`}>
              <article
                key={index}
                className={`rounded-lg overflow-hidden relative p-4 h-[300px] cursor-pointer transition-all duration-300 ease-in-out flex ${isActive ? 'items-end' : 'items-center'} hover:scale-105`}
                onMouseEnter={() => setActiveIndex(index)}
              >
                <div
                  className={`absolute inset-0 bg-cover bg-center transition-opacity duration-400 z-0 ${isActive ? 'opacity-100' : 'opacity-0'}`}
                  style={{
                    backgroundImage: `url(${article.thumbnailUrl})`,
                  }}
                ></div>
                <div className={`absolute w-full h-full transition-all top-0 left-0  bg-black ${isActive ? 'opacity-30' : 'opacity-0'} z-10 transition-opacity`}></div>

                <div className="relative z-20 flex flex-col gap-4">
                  <span
                    style={{ color: isActive ? '#fff' : article.postCategory.color }}
                    className="text-sm font-light uppercase"
                  >
                    {article.postCategory.name}
                  </span>
                  <h3 className={`font-bold text-2xl ${isActive ? 'text-white' : 'text-[#3D3D3D]'} leading-tight`}>
                    {article.postTitle}
                  </h3>
                  <p className={`${isActive ? 'text-white' : 'text-[#787878]'} text-sm leading-relaxed`}>
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