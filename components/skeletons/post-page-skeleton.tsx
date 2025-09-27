// components/skeletons/PostPageSkeleton.tsx

export default function PostPageSkeleton() {
  return (
    <div className="max-w-[1300px] mx-auto px-4 my-10 animate-pulse">
      {/* Título */}
      <div className="h-10 bg-gray-300 rounded w-2/3 mb-4" />

      {/* Autor + Data */}
      <div className="h-4 bg-gray-200 rounded w-1/4 mb-6" />

      {/* Imagem (thumbnail) */}
      <div className="w-full max-h-[400px] h-[300px] bg-gray-300 rounded-lg mb-6" />

      {/* Conteúdo (vários parágrafos variáveis) */}
      <div className="space-y-4 mb-10">
        {[...Array(6)].map((_, idx) => (
          <div key={idx} className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full" />
            <div className="h-4 bg-gray-200 rounded w-5/6" />
            <div className="h-4 bg-gray-200 rounded w-4/6" />
          </div>
        ))}
      </div>

      {/* Tags */}
      <div className="space-y-4">
        <div className="h-6 bg-gray-300 w-24 rounded" />
        <div className="flex gap-3">
          {[...Array(3)].map((_, idx) => (
            <div key={idx} className="h-6 bg-gray-200 w-16 rounded" />
          ))}
        </div>
      </div>
    </div>
  )
}