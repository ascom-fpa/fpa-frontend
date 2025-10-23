import { useContentStore } from "@/lib/content-store"
import { useEffect } from "react";
import { ContentSlider } from "./content-slider";
import Link from "next/link";

export default function ColunistasSection() {

    const { fetchAuthors, authors } = useContentStore()

    useEffect(() => {
        fetchAuthors()
    }, []);

    return (
        <section className="bg-white rounded-2xl shadow-md p-4">
            <div className="max-w-[1300px] mx-auto">
                <h2 className="text-3xl font-bold text-[#1C9658]">Artigos</h2>
                <p id='videos' className="text-gray-600 mt-1 mb-2">Conheça o que pensam os parlamentares da FPA.</p>

                <ContentSlider arrowTop="lg:-top-16 -top-24" perView={4}>
                    {authors.filter(el => el.name).map((author) => (
                        <Link href={`/artigos/${author.id}`} key={author.id} className="flex flex-col items-start space-y-2">
                            <div className="flex gap-2 items-center">
                                <div className="rounded-full bg-white overflow-hidden">
                                    <img loading="lazy"
                                        src={author.photoUrl}
                                        alt={author.name}
                                        className="w-24 h-24 rounded-lg object-cover"
                                    />
                                </div>
                                <h3 className="font-semibold text-gray-800">{author.name}</h3>
                            </div>
                        </Link>
                    ))}
                </ContentSlider>

            </div>
        </section>
    )
}