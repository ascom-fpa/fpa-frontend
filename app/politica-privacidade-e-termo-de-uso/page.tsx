'use client'
import ViewPost from '@/app/admin/posts/view-post';
import Footer from '@/components/ui/footer';
import Header from '@/components/ui/header';
import { useContentStore } from '@/lib/content-store';
import { getPage } from '@/services/page';
import { useEffect, useState } from 'react';

export default function Page() {
    const [content, setContent] = useState({});

    useEffect(() => {
        fetchPage()
    }, [])
    async function fetchPage() {
        getPage("usage-terms-page")
            .then(res => {
                setContent(res.content)
            })
    }


    return (
        <main>
            <Header />

            <div className='max-w-[1200px] mx-auto px-4 my-10'>
                <h1 className="text-6xl font-bold mb-4">Política de Privacidade & Termo de Uso</h1>

                <article>
                    {Boolean(Object.values(content).length) && <ViewPost postContent={content} />}
                </article>
            </div>
            <Footer />
        </main>
    );
}