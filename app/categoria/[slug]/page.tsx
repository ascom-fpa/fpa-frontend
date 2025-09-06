'use client'

import LastNews from "@/components/last-news";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { useContentStore } from "@/lib/content-store";
import { showToast } from "@/utils/show-toast";
import { Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

interface PageProps {
    params: {
        slug: string;
    };
}

export default function Page({ params }: PageProps) {
    const pathname = usePathname()

    const { fetchPosts, posts, fetchCategory, currentCategory } = useContentStore()
    const newsNoFeatured = posts.filter(post => !post.isFeatured)

    useEffect(() => {
        getCategory()
    }, [pathname]);

    async function getCategory() {
        const { slug } = await params
        fetchCategory(slug)
        fetchPosts({categoryId: slug})
    }

    return (
        < div className="min-h-screen bg-[#F9F9F9]" >
            <Header />

            <h1 style={{ background: currentCategory?.color }} className="p-5 capitalize text-white text-4xl text-center my-10">{currentCategory?.name}</h1>

            <div className="max-w-[1800px] mx-auto">
                <div className="flex gap-10 lg:flex-nowrap flex-wrap">
                    <div className="w-full lg:w-8/12">
                        {newsNoFeatured[0] &&
                            <Link className="text-3xl font-semibold text-gray-900 mb-2 leading-tight " href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${newsNoFeatured[0].id}`}>
                                <article className="relative flex items-center justify-center group overflow-hidden rounded-2xl ">
                                    <div className="absolute top-0 left-0 w-full h-full bg-black rounded-2xl opacity-30 z-10"></div>
                                    <img className="w-full rounded-2xl group-hover:scale-120 transition-all" src={newsNoFeatured[0].thumbnailUrl} />
                                    <h2 className="absolute m-10 text-white text-center font-semibold lg:text-6xl text-2xl z-20">{newsNoFeatured[0].postTitle}</h2>
                                </article>
                            </Link>
                        }
                    </div>
                    <div className="w-full lg:w-4/12 flex flex-col gap-10">
                        {newsNoFeatured.concat(newsNoFeatured).slice(1, 4).map((post) => (
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
                                                            console.log('Link copiado para a área de transferência!');
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

                {currentCategory && <LastNews category={currentCategory.id} />}
            </div>
            <Footer />
        </div >
    )
}