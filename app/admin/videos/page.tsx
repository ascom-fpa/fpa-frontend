'use client'

import { useEffect, useState } from "react"
import { createVideo, deleteVideo } from "@/services/videos"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2, MoveVertical } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove, rectSortingStrategy, } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LabelInputFile } from "@/components/ui/label-input-file"

export default function VideoPage() {
    const [description, setDescription] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const { fetchVideos, videos } = useContentStore()
    const sensors = useSensors(useSensor(PointerSensor))
    const [orderedVideos, setOrderedVideos] = useState<any[]>([])

    useEffect(() => {
        fetchVideos()
    }, [])

    useEffect(() => {
        setOrderedVideos(videos)
    }, [videos])

    useEffect(() => {
        fetchVideos()
    }, [])

    const handleUpload = async () => {
        if (!file) return
        const formData = new FormData()
        formData.append("file", file)
        formData.append("description", description)
        await createVideo(formData as any)
        setDescription("")
        setFile(null)
        fetchVideos()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento de Videos</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="Descrição do video"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <LabelInputFile
                        id="video-upload"
                        label="Selecionar video"
                        accept="video/*"
                        onChange={(file) => setFile(file)}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!file || !description}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar video
                    </Button>
                </CardFooter>
            </Card>

            <DndContext sensors={sensors} collisionDetection={closestCenter} >
                <SortableContext items={orderedVideos.map(b => b.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {orderedVideos.map((video: any, index: number) => (
                            <SortableCard
                                key={video.id}
                                video={video}
                                onDelete={() => {
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableCard({ video, onDelete }: { video: any, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id: video.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div style={style} >
            <Card className="p-0">
                <CardContent {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing flex flex-col gap-4 ">
                    <p className="font-semibold text-sm">{video.text}</p>
                    {video.url && (
                        <video controls src={video.url}></video>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between bg-[rgba(245,245,245)] py-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button
                                onMouseDown={(e) => e.stopPropagation()}
                                onTouchStart={(e) => e.stopPropagation()}
                                size="sm" variant="destructive" onClick={onDelete}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deseja realmente excluir esse video?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="mb-4">
                                <img
                                    src={video.imageUrl}
                                    alt="video-preview"
                                    className="w-full h-80 object-contain rounded"
                                />
                                {video.text && (
                                    <p className="mt-2 text-sm text-center text-muted-foreground">
                                        {video.text}
                                    </p>
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