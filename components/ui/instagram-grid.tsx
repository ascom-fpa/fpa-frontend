import { Instagram } from "lucide-react";
import Link from "next/link";

// /components/InstagramGrid.tsx
export default function InstagramGrid({ posts }: any) {
    return (
        <div className="flex flex-col gap-4 my-4">
            <Link target="_blank" href="https://www.instagram.com/fpagro/" className="flex text-[#1C9658] gap-2 items-center justify-center">
                <h3 className=" font-medium text-xl text-center">Instagram FPA</h3>
                <Instagram className="w-5 h-5" />
            </Link>
            <div className="flex flex-wrap gap-4 justify-center">
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
                                className="w-[140px] object-contain"
                            />
                        }
                    </a>
                ))}
            </div>
        </div>
    );
}