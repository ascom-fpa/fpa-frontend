'use client'
import ViewPost from '@/app/admin/posts/view-post';
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
        console.log(slug)
        fetchPost(slug)
    }

    return (
        <main>
            <Header />
            <div style={{ background: currentPost?.postCategory.color }} className="p-5 capitalize text-white text-4xl text-center my-10">{currentPost?.postCategory.name}</div>

            <div className='max-w-[1200px] mx-auto px-4 my-10'>
                <h1 className="text-6xl font-bold mb-4">{currentPost?.postTitle}</h1>

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
            </div>
        </main>
    );
}