// /components/InstagramGrid.tsx
export default function InstagramGrid({ posts }: any) {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            {posts?.map((post: any) => (
                <a
                    key={post.id}
                    href={post.permalink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="overflow-hidden h-60"
                >
                    {post.media_type == "VIDEO" ?
                        <video className="object-cover h-full w-full" src={post.media_url}></video>
                        : <img
                            src={post.media_url}
                            alt={post.caption?.slice(0, 50) || "Instagram post"}
                            className=" object-cover h-full w-48"
                        />
                    }
                </a>
            ))}
        </div>
    );
}