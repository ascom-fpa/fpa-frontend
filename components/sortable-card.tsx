import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { Card, CardContent, CardFooter } from "./ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Trash2 } from "lucide-react"

export function SortableCard({ banner, onDelete }: { banner: any, onDelete: () => void }) {
    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: banner.id })
    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    }

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
            <Card className="relative cursor-grab active:cursor-grabbing h-[400px]">
                <img src={banner.imageUrl} alt="banner" className="w-full h-40 object-cover rounded-t-lg" />
                <CardContent className="p-4">
                    <p className="font-semibold text-sm">{banner.text}</p>
                    {banner.link && (
                        <a
                            href={banner.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-500 hover:underline"
                        >
                            {banner.link}
                        </a>
                    )}
                </CardContent>
                <CardFooter className="flex justify-between">
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive" onClick={onDelete}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deseja realmente excluir esse banner?</AlertDialogTitle>
                            </AlertDialogHeader>
                            <div className="mb-4">
                                <img
                                    src={banner.imageUrl}
                                    alt="banner-preview"
                                    className="w-full h-80 object-contain rounded"
                                />
                                {banner.text && (
                                    <p className="mt-2 text-sm text-center text-muted-foreground">
                                        {banner.text}
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
