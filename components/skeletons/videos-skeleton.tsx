export default function VideosSkeleton() {
    return (
        <div className="py-12 space-y-4" >
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-5xl font-bold text-[#1C9658]">Vídeos</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden">
                        <div className="w-full h-[280px] bg-gray-300" />
                    </div>
                ))}
            </div>
        </div >
    )
}