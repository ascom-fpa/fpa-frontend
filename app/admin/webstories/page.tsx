'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2 } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import {
    DndContext,
    closestCenter,
    PointerSensor,
    useSensor,
    useSensors,
} from "@dnd-kit/core"
import {
    SortableContext,
    arrayMove,
    rectSortingStrategy,
    useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LabelInputFile } from "@/components/ui/label-input-file"

interface SlideInput {
    file: File;
    text?: string;
}

export default function WebstoriesPage() {
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [slides, setSlides] = useState<SlideInput[]>([])
    const [isFeatured, setIsFeatured] = useState(false)

    const { fetchWebStories, webstories, createWebStory, deleteWebStory, reorderWebstories } = useContentStore()
    const [orderedWebstories, setOrderedWebstories] = useState<any[]>([])
    const sensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        fetchWebStories()
    }, [])

    useEffect(() => {
        setOrderedWebstories(webstories)
    }, [webstories])

    const handleUpload = async () => {
        if (!title || slides.length === 0) return

        await createWebStory({ slides, title, description, isFeatured })
        setTitle("")
        setDescription("")
        setSlides([])
        fetchWebStories()
    }

    const handleDragEnd = async (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = orderedWebstories.findIndex((w) => w.id === active.id)
        const newIndex = orderedWebstories.findIndex((w) => w.id === over.id)

        const newOrder = arrayMove(orderedWebstories, oldIndex, newIndex)
        setOrderedWebstories(newOrder)
        await reorderWebstories(active.id, newIndex)
        fetchWebStories()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento de Webstories</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input placeholder="Título" value={title} onChange={(e) => setTitle(e.target.value)} />
                    <Input placeholder="Descrição opcional" value={description} onChange={(e) => setDescription(e.target.value)} />

                    {slides.map((slide, index) => (
                        <div key={index} className="flex gap-4 items-center">
                            <LabelInputFile
                                id={`slide-${index}`}
                                label={`Slide ${index + 1}`}
                                accept="image/*"
                                onChange={(file) => {
                                    const updated = [...slides]
                                    updated[index].file = file!
                                    setSlides(updated)
                                }}
                            />
                            <Input
                                placeholder="Texto do slide"
                                value={slide.text || ""}
                                onChange={(e) => {
                                    const updated = [...slides]
                                    updated[index].text = e.target.value
                                    setSlides(updated)
                                }}
                            />
                            <div className="flex gap-2 items-center">
                                <label className="flex items-center space-x-2 text-sm ps-2">Webstory em destaque?</label>
                                <Input
                                    className="cursor-pointer"
                                    style={{ width: '20px', height: '20px' }}
                                    type="checkbox"
                                    placeholder="Slug (URL amigável)"
                                    checked={isFeatured}
                                    onChange={(e) => setIsFeatured(e.target.checked)}
                                />
                            </div>
                        </div>
                    ))}

                    <Button type="button" variant="outline" onClick={() => setSlides([...slides, { file: new File([], "") }])}>
                        + Adicionar Slide
                    </Button>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!title || slides.length === 0}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar Webstory
                    </Button>
                </CardFooter>
            </Card>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedWebstories.map(w => w.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {orderedWebstories.map((webstory: any) => (
                            <SortableCard
                                key={webstory.id}
                                webstory={webstory}
                                onDelete={async () => {
                                    await deleteWebStory(webstory.id)
                                    fetchWebStories()
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableCard({ webstory, onDelete }: { webstory: any, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: webstory.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="p-0">
                <CardContent {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing flex flex-col gap-4 ">
                    <p className="font-semibold text-sm">{webstory.title}</p>
                    {webstory.slides?.[0]?.imageUrl && (
                        <img className="object-contain max-h-64" src={webstory.slides[0].imageUrl} alt="webstory preview" />
                    )}
                </CardContent>
                <CardFooter className="flex justify-between bg-[rgba(245,245,245)] py-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={onDelete}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="mb-4">
                                {webstory.slides?.[0]?.imageUrl && (
                                    <img
                                        src={webstory.slides[0].imageUrl}
                                        alt="webstory-preview"
                                        className="w-full h-80 object-contain rounded"
                                    />
                                )}
                            </div>
                            <AlertDialogFooter>
                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                <AlertDialogAction onClick={onDelete}>Confirmar</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </CardFooter>
            </Card>
        </div>
    )
}