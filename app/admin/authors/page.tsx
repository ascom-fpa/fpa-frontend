'use client'

import { useEffect, useState } from "react"
import { createAuthor, deleteAuthor } from "@/services/authors"
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

export default function AuthorPage() {
    const [name, setName] = useState("")
    const [file, setFile] = useState<File | null>(null)

    const { fetchAuthors, authors } = useContentStore()
    const sensors = useSensors(useSensor(PointerSensor))
    const [orderedAuthors, setOrderedAuthors] = useState<any[]>([])

    useEffect(() => {
        fetchAuthors()
    }, [])

    useEffect(() => {
        setOrderedAuthors(authors)
    }, [authors])

    useEffect(() => {
        fetchAuthors()
    }, [])

    const handleUpload = async () => {
        if (!file) return
        const formData = new FormData()
        formData.append("file", file)
        formData.append("name", name)
        await createAuthor(formData as any)
        setName("")
        setFile(null)
        fetchAuthors()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento de Parlamentares</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="Nome do parlamentar"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <LabelInputFile
                        id="cover-file"
                        label="Selecionar foto do parlamentar"
                        accept="image/*"
                        onChange={(file) => setFile(file)}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!file || !name}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar author
                    </Button>
                </CardFooter>
            </Card>

            <DndContext sensors={sensors} collisionDetection={closestCenter} >
                <SortableContext items={orderedAuthors.map(b => b.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {orderedAuthors.map((author: any, index: number) => (
                            <SortableCard
                                key={author.id}
                                author={author}
                                onDelete={() => {
                                    // setAuthorToDelete(author.id)
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableCard({ author, onDelete }: { author: any, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition, } = useSortable({ id: author.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div
            ref={setNodeRef} style={style} >
            <Card className="p-0">
                <CardContent {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing flex flex-col gap-4 ">
                    <img src={author.photoUrl} alt="author" className="w-full h-40 object-contain rounded-t-lg" />
                    <p className="font-semibold text-sm text-center">{author.name}</p>
                    {author.link && (
                        <a
                            href={author.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline w-fit"
                        >
                            {author.link}
                        </a>
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
                                <AlertDialogTitle>Deseja realmente excluir esse parlamentar?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="mb-4">
                                <img
                                    src={author.photoUrl}
                                    alt="author-preview"
                                    className="w-full h-80 object-contain rounded"
                                />
                                {author.name && (
                                    <p className="mt-2 text-sm text-center text-muted-foreground">
                                        {author.name}
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