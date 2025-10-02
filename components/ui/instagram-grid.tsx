import { Instagram } from "lucide-react";
import Link from "next/link";

// /components/InstagramGrid.tsx
export default function InstagramGrid({ posts }: any) {
    return (
        <div className="flex flex-col gap-4 bg-white p-2 rounded-2xl shadow-md">
            <Link target="_blank" href="https://www.instagram.com/fpagro/" className="flex text-[#1C9658] gap-2 items-center justify-center">
                <h3 className=" font-medium text-xl text-center">Instagram FPA</h3>
                <Instagram className="w-5 h-5" />
            </Link>
            <div className="flex lg:flex-wrap lg:flex-row flex-col gap-4 justify-center items-center">
                {posts?.map((post: any) => (
                    <a
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-all hover:scale-105"
                    >
                        {post.media_type == "VIDEO" ?
                            <video className="lg:w-[140px] h-fit object-contain" src={post.media_url}></video>
                            : <img
                                src={post.media_url}
                                alt={post.caption?.slice(0, 50) || "Instagram post"}
                                className="lg:w-[140px] object-contain"
                            />
                        }
                    </a>
                ))}
            </div>
        </div>
    );
}