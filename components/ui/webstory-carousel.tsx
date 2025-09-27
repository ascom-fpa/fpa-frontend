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
        <section id="webstories" className="py-12">
            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-3xl md:text-3xl font-bold text-[#1C9658]">Webstories</h2>
                        <p className="text-gray-600">As matérias mais lidas do nosso portal</p>
                    </div>
                </div>

                <ContentSlider perView={4}>
                    {webstories.map((story) => (
                        <div
                            key={story.id}
                            className="flex-shrink-0 cursor-pointer"
                            onClick={() => setSelectedStory(story)}
                        >
                            <div className="w-[200px] h-[340px] rounded-xl overflow-hidden border-2 border-[#1C9658]">
                                <Image
                                    src={story.slides?.[0]?.imageUrl || "/placeholder.jpg"}
                                    alt={story.title}
                                    width={100}
                                    height={180}
                                    className="object-cover w-full h-full"
                                />
                            </div>
                            <p className="text-xs text-center mt-2 w-[100px] truncate">{story.title}</p>
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