'use client'

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2 } from "lucide-react"
import {
    AlertDialog, AlertDialogAction, AlertDialogCancel,
    AlertDialogContent, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { SendNewsletterData, sendNewsletterEmail } from "@/services/newsletter"
import { showToast } from "@/utils/show-toast"
import { useContentStore } from "@/lib/content-store"

const formInitialState: SendNewsletterData = {
    id: "",
    subject: ""
}

export default function Page() {
    const [form, setForm] = useState<SendNewsletterData>(formInitialState)

    const { setLoading } = useContentStore()

    const handleUpload = async () => {
        setLoading(true)
        sendNewsletterEmail(form)
            .then(_ => {
                showToast({ type: 'success', children: 'Newsletter enviada!' })
                setForm(formInitialState)
            })
            .catch(e => showToast({ type: 'error', children: e.response.data.message }))
            .finally(() => setLoading(false))
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento da newsletter</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="Assunto do email"
                        value={form.subject}
                        onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    />
                    <Input
                        placeholder="ID do template"
                        value={form.id}
                        onChange={(e) => setForm({ ...form, id: e.target.value })}
                    />

                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!form.id || !form.subject}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar Tag
                    </Button>
                </CardFooter>
            </Card>

            {/* <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {tags?.map((tag) => (
                    <SortableCard
                        key={tag.id}
                        tag={tag}
                        onDelete={() => deleteTag(tag.id)}
                    />
                ))}
            </div> */}

        </div>
    )
}

function SortableCard({ tag, onDelete }: { tag: any, onDelete: () => void }) {
    return (
        <div >
            <Card className="p-0">
                <CardContent className="relative flex flex-col gap-4 p-4">
                    <p className="font-semibold text-sm">{tag.name}</p>
                    <p style={{ color: tag.color }} className="font-semibold text-sm">{tag.slug}</p>
                    <p className="text-xs text-muted-foreground">{tag.description}</p>
                    {tag.iconUrl && (
                        <img src={tag.iconUrl} alt="ícone" className="w-20 h-20 object-contain" />
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
                                {tag.name}
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