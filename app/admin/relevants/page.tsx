'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2 } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core"
import { SortableContext, arrayMove, rectSortingStrategy, useSortable, } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LabelInputFile } from "@/components/ui/label-input-file"
import { CreateRelevantData } from "@/services/relevants"

const formInitialState: CreateRelevantData = {
    title: "",
    description: "",
    videoFile: null,
    coverFile: null,
}

export default function RelevantsPage() {
    const [form, setForm] = useState<CreateRelevantData>(formInitialState)
    const { fetchRelevants, relevants, createRelevant, deleteRelevant, reorderRelevants, fileUploadProgress } = useContentStore()
    const [orderedRelevants, setOrderedRelevants] = useState<any[]>([])
    const sensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        fetchRelevants()
    }, [])

    useEffect(() => {
        setOrderedRelevants(relevants)
    }, [relevants])

    const handleUpload = async () => {
        if (!form.videoFile || !form.title) return

        await createRelevant(form)
        setForm(formInitialState)
        fetchRelevants()
    }

    const handleDragEnd = async (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = orderedRelevants.findIndex((w) => w.id === active.id)
        const newIndex = orderedRelevants.findIndex((w) => w.id === over.id)

        const newOrder = arrayMove(orderedRelevants, oldIndex, newIndex)
        setOrderedRelevants(newOrder)
        await reorderRelevants(active.id, newIndex)
        fetchRelevants()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento do fato em foco</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input placeholder="Título" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
                    <Input placeholder="Descrição opcional" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                    <LabelInputFile
                        id="video-upload"
                        label="Selecionar vídeo"
                        accept="video/*"
                        onChange={(file) => setForm({ ...form, videoFile: file })}
                    />

                    <LabelInputFile
                        id="cover-upload"
                        label="Selecionar imagem de capa"
                        accept="image/*"
                        onChange={(file) => setForm({ ...form, coverFile: file })}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!form.videoFile || !form.title}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar Relevant
                    </Button>
                </CardFooter>
            </Card>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedRelevants.map(w => w.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {orderedRelevants.map((relevant: any) => (
                            <SortableCard
                                key={relevant.id}
                                relevant={relevant}
                                onDelete={() => deleteRelevant(relevant.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableCard({ relevant, onDelete }: { relevant: any, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: relevant.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="p-0">
                <CardContent {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing flex flex-col gap-4 ">
                    <p className="font-semibold text-sm">{relevant.title}</p>
                    {relevant.videoUrl && (
                        <video className="object-contain max-h-64" controls src={relevant.videoUrl}></video>
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
                                <img
                                    src={relevant.imageUrl}
                                    alt="relevant-preview"
                                    className="w-full h-80 object-contain rounded"
                                />
                                {relevant.text && (
                                    <p className="mt-2 text-sm text-center text-muted-foreground">
                                        {relevant.text}
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