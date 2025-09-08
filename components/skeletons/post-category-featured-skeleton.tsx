// components/skeletons/PostsCategorySectionSkeleton.tsx

import { ArrowRight } from "lucide-react"

export default function PostsCategorySectionSkeleton() {
  return (
    <section className="py-12 px-4">
      <div className="max-w-[1800px] mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="space-y-6 animate-pulse">
              {/* Título da categoria */}
              <div className="w-2/3 h-6 bg-gray-300 rounded" />

              {/* Artigo em destaque */}
              <article className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative w-full h-[380px] bg-gray-200 rounded" />
                <div className="absolute bottom-0 p-6">
                  <div className="w-3/4 h-6 bg-gray-400 rounded" />
                </div>
              </article>

              {/* Artigos recentes */}
              <div className="space-y-8">
                {[...Array(2)].map((_, j) => (
                  <div key={j}>
                    <hr />
                    <article className="flex gap-4 items-center">
                      <div className="w-[280px] h-[140px] bg-gray-200 rounded hidden md:block flex-shrink-0" />
                      <div className="flex-1 space-y-2 max-w-[282px]">
                        <div className="w-1/2 h-3 bg-gray-300 rounded" />
                        <div className="w-full h-4 bg-gray-400 rounded" />
                      </div>
                    </article>
                  </div>
                ))}
              </div>

              {/* Ver mais */}
              <div className="flex gap-2 items-center text-gray-400">
                <div className="w-1/3 h-4 bg-gray-200 rounded" />
                <ArrowRight className="w-4 h-4 opacity-50" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}