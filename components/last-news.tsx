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


interface IProps {
    category?: string
}

export default function LastNews({ category }: IProps) {
    const { fetchPosts, posts, fetchMagazineUrl, magazineUrl } = useContentStore()
    const isLoading = !posts || posts.length === 0

    const newsNoFeatured = posts.filter(post => !post.isFeatured)
    const [pautaImage, setPautaImage] = useState('');

    const containerRef = useRef<HTMLDivElement>(null)
    const [isFullscreen, setIsFullscreen] = useState(false)

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    useEffect(() => {
        fetchPauta()
        category ? fetchPosts({ categoryId: category }) : fetchPosts()
        fetchMagazineUrl()
    }, [category]);

    async function fetchPauta() {
        getPauta()
            .then(res => setPautaImage(res.imageUrl!))
    }

    async function urlToFile(url: string, filename: string, mimeType: string): Promise<File> {
        const response = await fetch(url)
        const blob = await response.blob()
        return new File([blob], filename, { type: mimeType })
    }

    return (
        <section className="py-8 px-4">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex gap-8 flex-wrap">
                    {/* Recent News - 75% width */}
                    <div className="flex-1 lg:w-3/4 w-full">
                        <h2 className="text-5xl font-bold text-[#1C9658] mb-8">Mais Recentes</h2>

                        {/* Featured Article */}
                        <div className="flex gap-10 lg:flex-nowrap flex-wrap">
                            <div className="w-full lg:max-w-[540px]">
                                {isLoading
                                    ? Array.from({ length: 3 }).map((_, index) => (
                                        <RecentPostCardSkeleton key={index} highlighted={index === 0} />
                                    ))
                                    : newsNoFeatured.slice(0, 3).map(post =>
                                        <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.id}`}>
                                            <article className="mb-8 w-fit" key={post.id}>
                                                <div className="relative mb-4">
                                                    <img
                                                        src={post.thumbnailUrl || "/placeholder.svg"}
                                                        alt={post.postTitle}
                                                        className="w-full h-64  md:w-[540px] object-cover rounded-lg"
                                                    />
                                                </div>
                                                <h3 className="text-2xl font-bold text-gray-900 mb-2">{post.postTitle}</h3>
                                                <div className="flex items-center text-sm text-gray-600 mb-4">
                                                    <span>{new Date(post.createdAt).toLocaleDateString('pt-BR')}</span>
                                                    <span className="mx-2">/</span>
                                                    <span className='uppercase'>{post.postCategory.name}</span>
                                                    <span className="mx-2">/</span>
                                                    <span>{`${post.postAuthor.firstName} ${post.postAuthor.lastName}`}</span>
                                                </div>
                                            </article>
                                        </Link>
                                    )}
                            </div>
                            <div className="w-full lg:w-2/3">
                                {/* Recent Articles List */}
                                <div className="space-y-6">
                                    {isLoading
                                        ? Array.from({ length: 6 }).map((_, index) => (
                                            <RecentPostRowSkeleton key={index} />
                                        ))
                                        : newsNoFeatured.slice(3).map((post) => (
                                            <article key={post.id} className="flex items-start gap-4 pb-6 border-b border-gray-200">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-10 mb-2">
                                                        <span style={{ color: post.postCategory.color }} className={`text-xs font-medium uppercase tracking-wide`}>
                                                            {post.postCategory.name}
                                                        </span>
                                                        <div className="flex gap-5">
                                                            <Share2
                                                                onClick={() => {
                                                                    navigator.clipboard.writeText(`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.slug}`)
                                                                        .then(() => {
                                                                            // Opcional: notifique o usuário (alert, toast, etc.)
                                                                            showToast({ type: 'success', children: 'Link copiado para a área de transferência' })
                                                                        })
                                                                        .catch(err => {
                                                                            console.error('Erro ao copiar link:', err);
                                                                        });
                                                                }}
                                                                className="h-4 w-4 hover:scale-110 transition-all text-gray-500 cursor-pointer" />
                                                            <img
                                                                width={16} height={16} src='/wpp.svg'
                                                                onClick={() => {
                                                                    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.slug}`)}`;
                                                                    window.open(whatsappUrl, '_blank');
                                                                }}
                                                                className="h-4 w-4 hover:scale-110 transition-all text-green-600 cursor-pointer"
                                                            />
                                                        </div>

                                                    </div>
                                                    <Link className="text-3xl font-semibold text-gray-900 mb-2 leading-tight" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.id}`}>
                                                        <h3 >{post.postTitle}</h3>
                                                    </Link>

                                                    {post.summary && (
                                                        <p className="text-sm font-light text-gray-600 leading-relaxed">{post.summary}</p>
                                                    )}
                                                </div>
                                            </article>
                                        ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - 25% width */}
                    <aside className="w-full lg:w-1/4 space-y-8">
                        {/* Newsletter Signup */}
                        <Newsletter />

                        {magazineUrl
                            ? <div className='relative'>
                                <div className="absolute z-20 border-[14px] top-0 left-0 w-full bg-transparent border-white h-[500px]"></div>
                                <iframe
                                    src={`https://docs.google.com/gview?url=${encodeURIComponent(magazineUrl)}&embedded=true`}
                                    className='h-[500px] w-full'
                                    frameBorder={0}
                                />
                            </div>
                            // <div
                            //     ref={containerRef}
                            //     className={`relative flex justify-center bg-gray-100 rounded-xl mx-auto transition-all ${isFullscreen ? 'w-[90vw] h-[90vh]' : 'w-full h-[580px]'
                            //         }`}
                            // >
                            //     {/* Botão de fullscreen */}
                            //     <button
                            //         onClick={toggleFullscreen}
                            //         className="absolute top-4 right-4 z-10 bg-white shadow p-2 rounded-full hover:scale-110 transition-all cursor-pointer"
                            //         title={isFullscreen ? 'Sair do modo tela cheia' : 'Ver em tela cheia'}
                            //     >
                            //         {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
                            //     </button>

                            //     {/* PDF */}
                            //     <Document file={magazineUrl}>
                            //         <Page
                            //             pageNumber={1}
                            //             height={isFullscreen ? window.innerHeight * 0.9 : 580}
                            //         />
                            //     </Document>
                            // </div>
                            : <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-md" />
                        }
                        <div className="relative flex justify-center">
                            {pautaImage ? <img className='overflow-hidden rounded-2xl lg:w-auto w-full' src={pautaImage} width={435} height={518} /> : <div className="overflow-hidden rounded-2xl lg:w-auto w-full h-[518px] bg-gray-200 animate-pulse" style={{ maxWidth: 435 }} />}
                            <Button className='absolute bottom-20 lg:text-2xl p-2 w-5/6 h-fit whitespace-pre-wrap break-words'>
                                <Link href="https://share.hsforms.com/1HpOPSDwVScyoniT6RSACHAs0gbx" target='_blank'>Clique aqui para se cadastrar</Link>
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}