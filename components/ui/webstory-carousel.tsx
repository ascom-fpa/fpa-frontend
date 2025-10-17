"use client"

import { useState } from "react"
import Image from "next/image"
import WebstoryViewer from "./webstory-viewer"
import { WebStory } from "@/services/webstories"
import { ContentSlider } from "./content-slider"

interface IProps {
    webstories: WebStory[]
}

export default function WebstoriesCarousel({ webstories }: IProps) {
    const [selectedStory, setSelectedStory] = useState<WebStory | null>(null)

    return (
        <section id="webstories" className="my-12 bg-white rounded-2xl shadow-md p-4">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl md:text-3xl font-bold text-[#1C9658]">Webstories</h2>
                    </div>
                </div>

                <ContentSlider perView={4}>
                    {webstories.map((story) => (
                        <div
                            key={story.id}
                            className="flex-shrink-0 "
                        >
                            <div
                                className="lg:w-[200px] lg:h-[340px] w-full h-full object-contain rounded-xl overflow-hidden border-2 border-[#1C9658] cursor-pointer"
                                onClick={() => setSelectedStory(story)}
                            >
                                <Image
                                    src={story.slides?.[0]?.imageUrl || "/placeholder.jpg"}
                                    alt={story.title}
                                    width={100}
                                    height={180}
                                    className="object-cover w-full h-full"
                                    unoptimized
                                />
                            </div>
                            {/* <p className="text-xs text-center mt-2 w-[100px] truncate">{story.title}</p> */}
                        </div>
                    ))}
                </ContentSlider>

            </div>

            <WebstoryViewer
                open={!!selectedStory}
                onClose={() => setSelectedStory(null)}
                webstory={selectedStory}
            />
        </section>
    )
}