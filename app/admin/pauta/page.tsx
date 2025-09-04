'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { UploadCloud } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import { LabelInputFile } from "@/components/ui/label-input-file"
import { getPauta, updatePauta } from "@/services/pauta"

export default function PautaPage() {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState('');

    useEffect(() => {
        fetchPautaUrl()
    }, [])

    async function fetchPautaUrl() {
        getPauta()
            .then(res => setPreviewUrl(res.imageUrl!))
    }

    const handleUpload = async () => {
        if (!file) return

        const form = new FormData()
        form.append('file', file)

        await updatePauta(form)
        setFile(null)
        fetchPautaUrl()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento da pauta</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <LabelInputFile
                        id="magazine-upload"
                        accept="pdf/*"
                        label="Capa da pauta FPA"
                        onChange={(file) => {
                            setFile(file)
                            const previewUrl = URL.createObjectURL(file!)
                            setPreviewUrl(previewUrl)
                        }}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!file}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Atualizar pauta
                    </Button>
                </CardFooter>
            </Card>

            <Card className="p-0">
                <CardContent className="relative flex flex-col gap-4 ">
                    {Boolean(previewUrl) && (
                        <div className="w-full overflow-auto">
                            <img src={previewUrl} alt="pauta fpa" />
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}