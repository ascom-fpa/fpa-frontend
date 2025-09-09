interface Props {
    highlighted?: boolean
}

export default function PostsFeatureSkeleton({ highlighted }: Props) {
    return (
        <div
            className={`w-full animate-pulse rounded-lg overflow-hidden relative p-4 h-[300px] flex items-end ${highlighted ? 'bg-gray-200' : 'bg-white'
                }`}
        >
            <div className={`absolute inset-0 ${highlighted ? 'bg-gray-300' : 'bg-gray-100'}`} />
            <div className="relative z-10 space-y-2 w-full">
                <div className="w-1/3 h-4 bg-gray-400 rounded" />
                <div className="w-2/3 h-6 bg-gray-500 rounded" />
                <div className="w-full h-4 bg-gray-400 rounded" />
            </div>
        </div>
    )
}