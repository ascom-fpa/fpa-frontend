// /components/InstagramGrid.tsx
export default function InstagramGrid({ posts }: any) {
    return (
        <div className="flex flex-col gap-4 my-4">
            <h3 className="text-[#419672] font-medium text-xl text-center">Instagram FPA</h3>
            <div className="flex flex-wrap gap-3 justify-center">
                {posts?.map((post: any) => (
                    <a
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="overflow-hidden aspect-square transition-all hover:scale-105"
                    >
                        {post.media_type == "VIDEO" ?
                            <video className="object-cover h-full w-full " src={post.media_url}></video>
                            : <img
                                src={post.media_url}
                                alt={post.caption?.slice(0, 50) || "Instagram post"}
                                className="h-full w-36 object-contain"
                            />
                        }
                    </a>
                ))}
            </div>
        </div>
    );
}