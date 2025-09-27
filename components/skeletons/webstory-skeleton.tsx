// components/skeletons/WebstoriesCarouselSkeleton.tsx

export default function WebstoriesCarouselSkeleton() {
    return (
        <section id="webstories" className="py-12 animate-pulse">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-4xl md:text-4xl font-bold text-[#1C9658]">Webstories</h2>
                        <p className="text-gray-600">As matérias mais lidas do nosso portal</p>
                    </div>
                </div>

                <div className="flex gap-4 overflow-x-auto scrollbar-hide">
                    {[...Array(5)].map((_, i) => (
                        <div key={i} className="flex-shrink-0">
                            <div className="w-[200px] h-[340px] rounded-xl overflow-hidden border-2 border-gray-200 bg-gray-300" />
                            <div className="h-3 w-[100px] mt-2 bg-gray-300 rounded mx-auto" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}