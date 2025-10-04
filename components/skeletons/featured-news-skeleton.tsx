export default function FeaturedNewsSectionSkeleton() {
    return (
        <div className="flex gap-10 lg:flex-nowrap flex-wrap animate-pulse px-5">
            {/* Esquerda: destaque principal */}
            <div className="w-full lg:w-8/12">
                <div className="relative flex items-center justify-center overflow-hidden rounded-2xl h-[520px] bg-gray-300">
                    <div className="absolute top-0 left-0 w-full h-full bg-black rounded-2xl opacity-30 z-10" />
                    <div className="absolute m-10 w-2/3 h-12 bg-gray-400 rounded z-20" />
                </div>
            </div>

            {/* Direita: 3 notícias secundárias */}
            <div className="w-full lg:w-4/12 flex flex-col gap-10">
                {[...Array(3)].map((_, idx) => (
                    <article key={idx} className="flex items-start gap-4 pb-6 border-b border-gray-200">
                        <div className="flex-1 space-y-3">
                            <div className="flex items-center gap-10 mb-2">
                                <div className="h-4 w-20 bg-gray-300 rounded" />
                                <div className="flex gap-3">
                                    <div className="h-4 w-4 bg-gray-300 rounded-full" />
                                    <div className="h-4 w-4 bg-gray-300 rounded-full" />
                                </div>
                            </div>
                            <div className="h-6 w-2/3 bg-gray-400 rounded" />
                            <div className="h-4 w-full bg-gray-300 rounded" />
                            <div className="h-4 w-5/6 bg-gray-300 rounded" />
                        </div>
                    </article>
                ))}
            </div>
        </div>
    )
}