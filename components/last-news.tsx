import Link from "next/link";
import Newsletter from "./newsletter";
import { Button } from "./ui/button";
import { useContentStore } from "@/lib/content-store";
import { useEffect, useState } from "react";
import { getPauta } from "@/services/pauta";
import { Share2 } from "lucide-react";
import { showToast } from "@/utils/show-toast";

export default function LastNews() {
    const { fetchPosts, posts, magazineUrl } = useContentStore()

    const newsNoFeatured = posts.filter(post => !post.isFeatured)
    const [pautaImage, setPautaImage] = useState('');

    useEffect(() => {
        fetchPauta()
        fetchPosts()
    }, []);

    async function fetchPauta() {
        getPauta()
            .then(res => setPautaImage(res.imageUrl!))
    }

    return (
        <section className="py-8 px-4 bg-white">
            <div className="max-w-[1800px] mx-auto">
                <div className="flex gap-8">
                    {/* Recent News - 75% width */}
                    <div className="flex-1 w-3/4">
                        <h2 className="text-5xl font-bold text-[#419672] mb-8">Mais Recentes</h2>

                        {/* Featured Article */}
                        <div className="flex gap-20">
                            <div className="w-1/3">
                                {newsNoFeatured.slice(0, 3).map(post =>
                                    <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.id}`}>
                                        <article className="mb-8" key={post.id}>
                                            <div className="relative mb-4">
                                                <img
                                                    src={post.thumbnailUrl || "/placeholder.svg"}
                                                    alt={post.postTitle}
                                                    className="w-full h-64 object-cover rounded-lg"
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
                            <div className="w-2/3">
                                {/* Recent Articles List */}
                                <div className="space-y-6">
                                    {newsNoFeatured.concat(newsNoFeatured).map((post) => (
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
                        </div>

                    </div>

                    {/* Sidebar - 25% width */}
                    <aside className="w-1/4 space-y-8">
                        {/* Newsletter Signup */}
                        <Newsletter />
                        {magazineUrl && <iframe allowFullScreen src={magazineUrl + '#toolbar=0&navpanes=0&scrollbar=0"'} width="100%" height="500px" />}
                        <div className="relative flex justify-center">
                            {pautaImage && <img className='overflow-hidden rounded-2xl' src={pautaImage} width={435} height={518} />}
                            <Button className='absolute bottom-20 lg:text-2xl p-6 w-5/6 lg:whitespace-pre whitespace-normal'>
                                <Link href="https://share.hsforms.com/1HpOPSDwVScyoniT6RSACHAs0gbx" target='_blank'>Clique aqui para se cadastrar</Link>
                            </Button>
                        </div>
                    </aside>
                </div>
            </div>
        </section>
    )
}