'use client'

import LastNews from "@/components/last-news";
import FeaturedNewsSectionSkeleton from "@/components/skeletons/featured-news-skeleton";
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { useContentStore } from "@/lib/content-store";
import { showToast } from "@/utils/show-toast";
import { Divide, Share2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { use, useEffect, useState } from "react";

interface PageProps {
    params: {
        slug: string;
    };
}

export default function Page({ params }: PageProps) {
    const pathname = usePathname()

    const unwrappedParams = use(params as any);
    const { slug } = unwrappedParams as any;
    const [currentCategoryId, setCurrentCategoryId] = useState(slug);

    const { fetchPosts, posts, fetchCategory, currentCategory } = useContentStore()
    const newsNoFeatured = posts.filter(post => !post.isFeatured)

    useEffect(() => {
        getCategory()
    }, [pathname, params, slug]);

    async function getCategory() {
        await fetchCategory(slug)
        await fetchPosts({ categoryId: slug })
        setCurrentCategoryId(slug)
    }

    return (
        < div className="min-h-screen bg-[#F9F9F9]" >
            <Header category={currentCategory?.name || 'Categoria'} categoryColor={currentCategory?.color || 'black'} categoryId={currentCategory?.id} />

            {/* <h1 style={{ background: currentCategory?.color || 'black' }} className="p-5 capitalize text-white text-3xl text-center my-6">{currentCategory?.name || 'Categoria'}</h1> */}

            <div className="max-w-[1300px] lg:mx-auto my-10">
                {
                    (!newsNoFeatured.length || (currentCategory?.id != currentCategoryId))
                        ? <FeaturedNewsSectionSkeleton />
                        : <div className="flex gap-10 lg:flex-nowrap flex-wrap">
                            <div className="w-full lg:w-8/12">
                                {newsNoFeatured[0] &&
                                    <Link className="text-3xl h-full font-semibold text-gray-900 mb-2 leading-tight" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${newsNoFeatured[0].id}`}>
                                        <article className="relative flex items-end justify-center group overflow-hidden h-full lg:rounded-2xl ">
                                            <div className="absolute top-0 left-0 w-full h-full bg-black rounded-2xl opacity-30 z-10"></div>
                                            <img loading="lazy" className="w-full lg:h-full h-[400px] object-cover lg:rounded-2xl lg:group-hover:scale-120 transition-all" src={newsNoFeatured[0].thumbnailUrl} />
                                            <h2 className="absolute m-10 text-white text-center font-semibold md:text-3xl text-base z-20">{newsNoFeatured[0].postTitle}</h2>
                                        </article>
                                    </Link>
                                }
                            </div>
                            <div className="w-full lg:w-4/12 flex flex-col gap-4 lg:mx-auto mx-4 justify-between">
                                {newsNoFeatured.slice(1, 4).map((post, index) => (
                                    <article key={post.id} className="flex items-start gap-4 flex-col">
                                        <div className="flex-1">
                                            <div className="flex items-center mb-2 md:gap-10 gap-2">
                                                <span style={{ background: post.postCategory.color }} className={`md:text-xs text-[10px] rounded-md p-1 md:px-3 px-2 w-fit text-white font-medium uppercase tracking-wide`}>
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
                                                    <img loading="lazy"
                                                        width={16} height={16} src='/wpp.svg'
                                                        onClick={() => {
                                                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.slug}`)}`;
                                                            window.open(whatsappUrl, '_blank');
                                                        }}
                                                        className="h-4 w-4 hover:scale-110 transition-all text-green-600 cursor-pointer"
                                                    />
                                                </div>

                                            </div>

                                            <div className="flex gap-1 flex-col">
                                                <Link className="text-xl font-medium text-gray-900 mb-2 leading-tight" href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.id}`}>
                                                    <h3 >{post.postTitle}</h3>
                                                </Link>

                                                {post.summary && (
                                                    <p className="text-sm font-light text-gray-600 leading-relaxed">{post.summary}</p>
                                                )}
                                            </div>
                                        </div>
                                        {
                                            index < 2
                                                ? <div className="h-2 w-full  border-b border-gray-200"></div>
                                                : <div></div>
                                        }
                                    </article>
                                ))}
                            </div>
                        </div>
                }

                <LastNews isHome={false} category={currentCategory?.id} />
            </div>
            <Footer />
        </div >
    )
}