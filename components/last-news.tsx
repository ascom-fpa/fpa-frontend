'use client'

import Link from "next/link";
import Newsletter from "./newsletter";
import { Button } from "./ui/button";
import { useContentStore } from "@/lib/content-store";
import { useEffect, useRef, useState } from "react";
import { getPauta } from "@/services/pauta";
import { Maximize2, Minimize2, Share2 } from "lucide-react";
import { showToast } from "@/utils/show-toast";
import { RecentPostCardSkeleton, RecentPostRowSkeleton } from "./skeletons/recent-posts-skeleton";
import { getInstagramPosts } from "@/services/instagram";
import TwitterInstagramSkeleton from "./skeletons/twitter-instagram-skeleton";
import InstagramGrid from "./ui/instagram-grid";
import Script from "next/script";


interface IProps {
    category?: string
    internalPage?: boolean
}

export default function LastNews({ category, internalPage }: IProps) {
    const { posts } = useContentStore()
    const isLoading = !posts || posts.length === 0

    const newsNoFeatured = posts.filter(post => !post.isFeatured)

    const containerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [instagramPosts, setInstagramPosts] = useState([]);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    useEffect(() => {
        fetchInstagramPosts()
    }, []);

    async function fetchInstagramPosts() {
        try {
            const instagramPosts = await getInstagramPosts()
            setInstagramPosts(instagramPosts)
        } catch (error) {
            console.error("Error fetching tweets:", error)
        }
    }



    async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
        const response = await fetch(url)
        const blob = await response.blob()
        return new File([blob], filename, { type: mimeType })
    }

    return (
        <section className="py-8 px-4">
            <div className={`${internalPage ? `max-w-[1000px]` : `max-w-[1300px]`} mx-auto`}>
                <div className="flex gap-8 flex-wrap">
                    {/* Recent News - 75% width */}
                    <div className="flex-1 lg:w-3/4 w-full">
                        <h2 className="text-3xl font-bold text-[#1C9658] mb-8">Mais Recentes</h2>

                        {/* Featured Article */}
                        <div className="flex flex-col gap-10">
                            {isLoading
                                ? Array.from({ length: 3 }).map((_, index) => (
                                    <RecentPostCardSkeleton key={index} highlighted={index === 0} />
                                ))
                                : newsNoFeatured.slice(0, 5).map((post, index) =>
                                    <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.id}`}>
                                        <article className="flex gap-8" key={post.id}>
                                            <img
                                                src={post.thumbnailUrl || "/placeholder.svg"}
                                                alt={post.postTitle}
                                                className="min-w-[460px] max-h-[200px] object-cover rounded-lg"
                                            />
                                            <div className="flex flex-col gap-4">
                                                <span className='uppercase text-sm'>{post.postCategory.name}</span>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.postTitle}</h3>
                                            </div>
                                        </article>
                                        {index != 4 && <hr className="mt-10" />}
                                    </Link>
                                )}
                        </div>
                    </div>

                    {/* Sidebar - 25% width */}
                    {!internalPage && <aside className="lg:w-1/4  space-y-8">
                        {instagramPosts.length == 0
                            ? <TwitterInstagramSkeleton />
                            : <div className="w-fullflex flex-col">
                                <InstagramGrid posts={instagramPosts} />
                                <Script strategy="afterInteractive">
                                    {`
                                    twttr.widgets.createTimeline(
                                        {
                                            sourceType: "profile",
                                        screenName: "TwitterDev"
                                        },
                                        document.getElementById("twitter-timeline")
                                        );
                                    `}
                                </Script>
                                {/* <div ref={ref}>
                                    <a className="twitter-timeline"
                                    href="https://twitter.com/fpagropecuaria"
                                    data-width="300"
                                    data-height="300"
                                    >
                                    Tweets by @fpagropecuaria
                                    </a>
                                </div> */
                                }
                            </div>}
                    </aside>}
                </div>
            </div>
        </section>
    )
}