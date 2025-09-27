export default function MostViewedSkeleton() {
    return (
        <div className="py-12 space-y-4">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold text-[#1C9658]">Mais lidas</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="rounded-xl overflow-hidden">
                        <div className="w-full h-48 bg-gray-300 rounded" />
                        <div className="p-4 space-y-2">
                            <div className="w-2/3 h-3 bg-gray-300 rounded" />
                            <div className="w-full h-4 bg-gray-300 rounded" />
                            <div className="w-5/6 h-4 bg-gray-200 rounded" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}