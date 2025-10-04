export function RecentPostCardSkeleton() {
    return (
        <div className={`animate-pulse rounded-lg flex gap-4 `}>
            <div className="lg:min-w-[460px] h-64 bg-gray-200 rounded-lg mb-4" />
            <div className="w-full flex flex-col gap-8">
                <div className="w-[200px] h-4 bg-gray-200 rounded" />
                <div className="flex flex-col gap-1">
                    <div className="w-full h-8 bg-gray-200 rounded" />
                    <div className="w-[80%] h-8 bg-gray-200 rounded" />
                </div>
            </div>
        </div>
    )
}

export function RecentPostRowSkeleton() {
    return (
        <div className="animate-pulse flex items-start gap-4 pb-6 border-b border-gray-200">
            <div className="flex-1 space-y-2">
                <div className="flex items-center gap-10">
                    <div className="w-24 h-4 bg-gray-300 rounded" />
                    <div className="w-16 h-4 bg-gray-200 rounded" />
                </div>
                <div className="w-2/3 h-6 bg-gray-400 rounded" />
                <div className="w-full h-4 bg-gray-300 rounded" />
            </div>
        </div>
    )
}