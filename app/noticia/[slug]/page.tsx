'use client'
import ViewPost from '@/app/admin/posts/view-post';
import LastNews from '@/components/last-news';
import PostPageSkeleton from '@/components/skeletons/post-page-skeleton';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { useContentStore } from '@/lib/content-store';
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
            <div style={{ background: currentPost?.postCategory.color }} className="p-5 capitalize text-white text-3xl text-center mt-5 mb-10">{currentPost?.postCategory.name}</div>

            {
                !currentPost
                    ? <PostPageSkeleton />
                    : <div>
                        <div className='max-w-[1000px] mx-auto px-4 my-10'>
                            <h1 className="text-4xl font-bold mb-4">{currentPost?.postTitle}</h1>

                            <div className="text-sm text-gray-500 mb-6">
                                Publicado em {new Date(currentPost?.createdAt || new Date()).toLocaleDateString('pt-BR')} por {`${currentPost?.postAuthor?.firstName} ${currentPost?.postAuthor?.lastName}`}
                            </div>

                            {currentPost?.thumbnailUrl && (
                                <img
                                    src={currentPost.thumbnailUrl}
                                    alt={currentPost.postTitle}
                                    className="rounded-lg mb-6 w-full max-h-[400px] object-cover"
                                />
                            )}

                            <article>
                                {currentPost?.postContent && <ViewPost postContent={currentPost.postContent} />}
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
                        <LastNews internalPage category={currentPost.postCategoryId} />
                    </div>

            }
            <Footer />
        </main>
    );
}