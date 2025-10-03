'use client'
import ViewPost from '@/app/admin/posts/view-post';
import LastNews from '@/components/last-news';
import PostPageSkeleton from '@/components/skeletons/post-page-skeleton';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { useContentStore } from '@/lib/content-store';
import Link from 'next/link';
import { useEffect } from 'react';

interface PageProps {
    params: {
        slug: string;
    };
}

export default function Page({ params }: PageProps) {
    const { currentPost, fetchPost } = useContentStore()

    useEffect(() => {
        getPost()
    }, []);

    async function getPost() {
        const { slug } = await params
        fetchPost(slug)
    }

    return (
        <main>
            <Header />
            <div style={{ background: currentPost?.postCategory.color }} className="p-5 text-white text-3xl text-center mt-5 mb-10">
                <Link href={`/categoria/${currentPost?.postCategory.id}`}>
                    {currentPost?.postCategory.name}
                </Link>
            </div>

            {
                !currentPost
                    ? <PostPageSkeleton />
                    : <div>
                        <div className='max-w-[1000px] mx-auto px-4 my-10'>
                            <h1 className="text-3xl font-semibold mb-4">{currentPost?.postTitle}</h1>

                            <div className="text-sm text-gray-500 mb-6">
                                Publicado em {new Date(currentPost?.createdAt || new Date()).toLocaleDateString('pt-BR')}
                            </div>

                            {(
                                (typeof currentPost?.postContent == "string" && !currentPost?.postContent?.includes('img') && currentPost?.thumbnailUrl) ||
                                (typeof currentPost?.postContent == "object") && currentPost?.thumbnailUrl) &&
                                (
                                    <img
                                        src={currentPost.thumbnailUrl}
                                        alt={currentPost.postTitle}
                                        className="rounded-lg mb-6 w-full max-h-[400px] object-cover"
                                    />
                                )}

                            <article>
                                {typeof currentPost?.postContent == 'object'
                                    ? <ViewPost postContent={currentPost.postContent} />
                                    : <div dangerouslySetInnerHTML={{ __html: currentPost?.postContent || '' }}></div>
                                }
                            </article>

                            {
                                Boolean(currentPost?.relatedTags?.length) &&
                                <div className="flex flex-col gap-4">
                                    <h6 className="font-semibold text-2xl text-[#006B2D]">Tags</h6>
                                    {currentPost?.relatedTags?.map(tag => <div className="flex gap-3">{tag?.name}</div>
                                    )}
                                </div>
                            }

                        </div>
                        <LastNews isHome={false} internalPage category={currentPost.postCategoryId} />
                    </div>

            }
            <Footer />
        </main>
    );
}