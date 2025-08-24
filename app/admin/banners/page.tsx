'use client'

import { useEffect, useState } from "react"
import { createBanner, deleteBanner, reorderBanners } from "@/services/banners"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2, MoveVertical } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, } from "@dnd-kit/core"
import { SortableContext, useSortable, verticalListSortingStrategy, arrayMove, rectSortingStrategy, } from "@dnd-kit/sortable"
import { SortableCard } from "@/components/sortable-card"

export default function BannerPage() {
    const [text, setText] = useState("")
    const [link, setLink] = useState("")
    const [file, setFile] = useState<File | null>(null)
    const [bannerToDelete, setBannerToDelete] = useState<string | null>(null)
    const [bannerToDeleteData, setBannerToDeleteData] = useState<any | null>(null)

    const { fetchBanners, banners } = useContentStore()
    const sensors = useSensors(useSensor(PointerSensor))
    const [orderedBanners, setOrderedBanners] = useState<any[]>([])

    useEffect(() => {
        fetchBanners()
    }, [])

    useEffect(() => {
        setOrderedBanners(banners)
    }, [banners])

    const handleDragEnd = async (event: any) => {
        const { active, over } = event
        if (!over || active.id === over.id) return

        const oldIndex = orderedBanners.findIndex((b) => b.id === active.id)
        const newIndex = orderedBanners.findIndex((b) => b.id === over.id)

        const newOrder = arrayMove(orderedBanners, oldIndex, newIndex)
        setOrderedBanners(newOrder)
        await reorderBanners(active.id, newIndex)
        fetchBanners()
    }


    useEffect(() => {
        fetchBanners()
    }, [])

    const handleUpload = async () => {
        if (!file) return
        const formData = new FormData()
        formData.append("file", file)
        formData.append("text", text)
        formData.append("link", link)
        await createBanner(formData as any)
        setText("")
        setLink("")
        setFile(null)
        fetchBanners()
    }

    const confirmDelete = async () => {
        if (bannerToDelete) {
            await deleteBanner(bannerToDelete)
            setBannerToDelete(null)
            setBannerToDeleteData(null)
            fetchBanners()
        }
    }

    const handleReorder = async (id: string, newIndex: number) => {
        await reorderBanners(id, newIndex)
        fetchBanners()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento de Banners</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="Texto do banner"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                    />
                    <Input
                        placeholder="Link opcional"
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <Input
                        type="file"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!file || !text}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar banner
                    </Button>
                </CardFooter>
            </Card>

            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext items={orderedBanners.map(b => b.id)} strategy={rectSortingStrategy}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                        {orderedBanners.map((banner: any, index: number) => (
                            <SortableCard
                                key={banner.id}
                                banner={banner}
                                onDelete={() => {
                                    setBannerToDelete(banner.id)
                                    setBannerToDeleteData(banner)
                                }}
                            />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>
        </div>
    )
}