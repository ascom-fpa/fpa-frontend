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
    isHome?: boolean
}

export default function LastNews({ category, internalPage, isHome = true }: IProps) {
    const { posts, fetchPosts, postsPagination } = useContentStore()
    const isLoading = !posts || posts.length === 0

    const newsNoFeatured = isHome ? posts.filter(post => !post.isFeatured) : posts

    const containerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [instagramPosts, setInstagramPosts] = useState([]);
    const [pautaImage, setPautaImage] = useState('');

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    useEffect(() => {
        fetchInstagramPosts()
        fetchPauta()
    }, []);

    async function fetchPauta() {
        getPauta()
            .then(res => setPautaImage(res.imageUrl!))
    }

    async function fetchInstagramPosts() {
        try {
            const instagramPosts = await getInstagramPosts()
            setInstagramPosts(instagramPosts)
        } catch (error) {
            console.error("Error fetching tweets:", error)
        }
    }

    function loadMorePosts() {
        fetchPosts({ page: postsPagination.page + 1, limit: 5, categoryId: category })
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
                    <div className="flex-1 lg:w-3/4 w-full bg-white h-fit p-4 rounded-2xl shadow-md" ref={containerRef}>
                        <h2 className="text-3xl font-bold text-[#1C9658] mb-8">Mais Recentes</h2>

                        {/* Featured Article */}
                        <div className="flex flex-col gap-10">
                            {isLoading
                                ? Array.from({ length: 3 }).map((_, index) => (
                                    <RecentPostCardSkeleton key={index} highlighted={index === 0} />
                                ))
                                : newsNoFeatured.slice(isHome ? 0 : 4, isHome ? 6 : -1).map((post, index, arr) =>
                                    <Link key={index + post.id} href={`/noticia/${post.id}`}>
                                        <article className="flex lg:flex-row flex-col gap-8" key={post.id}>
                                            <img
                                                src={post.thumbnailUrl || "/placeholder.svg"}
                                                alt={post.postTitle}
                                                className="lg:w-[460px] rounded-lg"
                                            />
                                            <div className="flex flex-col gap-4">
                                                <span className='uppercase text-sm'>{post.postCategory.name}</span>
                                                <h3 className="text-2xl font-semibold text-gray-900 mb-2">{post.postTitle}</h3>
                                            </div>
                                        </article>
                                        {(index != arr.length - 1) && <hr className="mt-10" />}
                                    </Link>
                                )}
                        </div>
                        <button
                            onClick={loadMorePosts}
                            className="cursor-pointer bg-primary text-white transition-all hover:scale-105 text-center p-2 rounded-lg mt-4 px-4">
                            Carregar mais
                        </button>


                    </div>
                    {/* Sidebar - 25% width */}
                    {!internalPage && <aside className="lg:w-1/4  space-y-8">
                        {instagramPosts.length == 0
                            ? <TwitterInstagramSkeleton />
                            : <div className="w-full flex flex-col">
                                <InstagramGrid posts={instagramPosts} />
                                <div className="relative flex-col gap-4 flex justify-center mt-4">
                                    {pautaImage ? <img className=' rounded-2xl lg:w-auto w-full' src={pautaImage} /> : <div className="overflow-hidden rounded-2xl lg:w-auto w-full h-[518px] bg-gray-200 animate-pulse" style={{ maxWidth: 435 }} />}
                                    <Link className="bg-primary text-white transition-all hover:scale-105 text-center text-xl p-2 rounded-xl" href="/credenciamento" target='_blank'>Clique aqui para se cadastrar</Link>
                                </div>
                            </div>}
                    </aside>}
                </div>
            </div>
        </section>
    )
}