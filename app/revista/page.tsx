"use client"
import Footer from "@/components/ui/footer";
import Header from "@/components/ui/header";
import { useContentStore } from "@/lib/content-store";
import { useEffect } from "react";

export default function Page() {
    const { fetchMagazineUrl, magazineUrl, createMagazine } = useContentStore()
    useEffect(() => {
        fetchMagazineUrl()
    }, [])

    return (
        <main>
            <Header />

            <div className='max-w-[1300px] mx-auto px-4 my-10'>
                <h1 className="text-4xl font-bold mb-4 text-primary">Revista FPA</h1>

                <div className="w-full overflow-auto">
                    {magazineUrl ? <iframe allowFullScreen src={magazineUrl} width="100%" height="860px" /> : 'Carregando...'}
                    <a
                        href={magazineUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                    >
                        Abrir revista completa
                    </a>
                </div>
            </div>
            <Footer />
        </main>
    )
}