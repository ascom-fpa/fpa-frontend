export default function TwitterInstagramSkeleton() {
    return (
        <div className="w-full lg:w-3/12 space-y-6 pt-12 lg:pt-0">
            <div className="flex flex-wrap gap-3 justify-center">
                {[...Array(9)].map((_, i) => (
                    <div key={i} className="aspect-square bg-gray-300 rounded w-36" />
                ))}
            </div>

            <div className="h-8 w-40 bg-gray-300 rounded mx-auto mt-6" />
            <div className="w-full h-[300px] bg-gray-200 rounded" />
        </div>
    )
}