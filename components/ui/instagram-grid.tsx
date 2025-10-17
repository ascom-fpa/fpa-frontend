import { Instagram } from "lucide-react";
import Link from "next/link";

// /components/InstagramGrid.tsx
export default function InstagramGrid({ posts }: any) {
    return (
        <div className="flex flex-col gap-4 bg-white p-2 rounded-2xl shadow-md lg:w-fit sm:w-[46%] w-full">
            <Link target="_blank" href="https://www.instagram.com/fpagro/" className="flex text-[#1C9658] gap-2 items-center justify-center">
                <Instagram className="w-6 h-6" />
                <h3 className=" text-xl text-center">Instagram FPA</h3>
            </Link>
            <div className="flex lg:flex-wrap lg:flex-row flex-col gap-4 justify-center items-center overflow-hidden">
                {posts?.map((post: any) => (
                    <a
                        key={post.id}
                        href={post.permalink}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Veja a publicação do instagram ${post.caption}`}
                    >
                        <iframe
                            title={post.caption}
                            src={post.permalink + "embed"}
                            className="w-full aspect-[9/18] border-0 rounded-lg"
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                            scrolling="no"
                        ></iframe>
                        {/* <blockquote
                            className="instagram-media"
                            data-instgrm-permalink={post.permalink}
                            data-instgrm-version="14"
                        >
                        </blockquote>
                        <script async src="//www.instagram.com/embed.js"></script> */}
                    </a>
                ))}
            </div>
        </div>
    );
}