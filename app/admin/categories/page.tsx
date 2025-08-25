'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2 } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
    DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from "@dnd-kit/core"
import {
    SortableContext, arrayMove, rectSortingStrategy, useSortable,
} from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { LabelInputFile } from "@/components/ui/label-input-file"
import { Category, CreateCategoryData } from "@/services/categories"

const formInitialState: CreateCategoryData = {
    name: "",
    description: "",
    slug: "",
}

export default function CategoryPage() {
    const [form, setForm] = useState<CreateCategoryData>(formInitialState)
    const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
    const [categoryToDeleteData, setCategoryToDeleteData] = useState<any | null>(null)

    const {
        fetchCategories,
        categories,
        createCategory,
        deleteCategory,
        reorderCategories,
    } = useContentStore()

    const [orderedCategories, setOrderedCategories] = useState<Category[]>([])
    const sensors = useSensors(useSensor(PointerSensor))

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        setOrderedCategories(categories)
    }, [categories])

    const handleUpload = async () => {
        if (!form.name) return

        // if (form.iconFile) formData.append("icon", form.iconFile)

        await createCategory(form)
        setForm(formInitialState)
        fetchCategories()
    }

    const handleDragEnd = async (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = orderedCategories.findIndex((c) => c.id === active.id)
        const newIndex = orderedCategories.findIndex((c) => c.id === over.id)

        const newOrder = arrayMove(orderedCategories, oldIndex, newIndex)
        setOrderedCategories(newOrder)
        await reorderCategories(active.id, newIndex)
        fetchCategories()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento de Categorias</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="Nome da categoria"
                        value={form.name}
                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                    />
                    <Input
                        placeholder="Descrição opcional"
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                    />
                    <Input
                        placeholder="Slug. Ex: tecnologia"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />
                    {/* <LabelInputFile
                        id="icon-upload"
                        label="Selecionar ícone"
                        accept="image/*"
                        onChange={(file) => setForm({ ...form, iconFile: file })}
                    /> */}
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!form.name}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar Categoria
                    </Button>
                </CardFooter>
            </Card>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedCategories.map(c => c.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {orderedCategories.map((category) => (
                            <SortableCard
                                key={category.id}
                                category={category}
                                onDelete={() => deleteCategory(category.id)}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}

function SortableCard({ category, onDelete }: { category: any, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: category.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style}>
            <Card className="p-0">
                <CardContent {...attributes} {...listeners} className="relative cursor-grab active:cursor-grabbing flex flex-col gap-4 p-4">
                    <p className="font-semibold text-sm">{category.name}</p>
                    <p className="font-semibold text-sm">{category.slug}</p>
                    <p className="text-xs text-muted-foreground">{category.description}</p>
                    {category.iconUrl && (
                        <img src={category.iconUrl} alt="ícone" className="w-20 h-20 object-contain" />
                    )}
                </CardContent>
                <CardFooter className="flex justify-between bg-[rgba(245,245,245)] py-2">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="mb-4 text-sm text-muted-foreground">
                                {category.name}
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