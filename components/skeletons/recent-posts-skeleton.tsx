interface Props {
    highlighted?: boolean
}

export function RecentPostCardSkeleton({ highlighted }: Props) {
    return (
        <div className={`animate-pulse mb-8 rounded-lg overflow-hidden ${highlighted ? 'bg-gray-100' : 'bg-white'}`}>
            <div className="w-full h-64 bg-gray-300 rounded-lg mb-4" />
            <div className="space-y-2 px-2">
                <div className="w-3/4 h-5 bg-gray-400 rounded" />
                <div className="w-full h-4 bg-gray-300 rounded" />
                <div className="w-2/3 h-4 bg-gray-300 rounded" />
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