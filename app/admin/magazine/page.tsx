'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { UploadCloud } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import { LabelInputFile } from "@/components/ui/label-input-file"

export default function MagazinePage() {
    const [file, setFile] = useState<File | null>(null)
    const [previewUrl, setPreviewUrl] = useState('');

    const { fetchMagazineUrl, magazineUrl, createMagazine } = useContentStore()
    useEffect(() => {
        fetchMagazineUrl()
    }, [])

    const handleUpload = async () => {
        await createMagazine(file)
        setFile(null)
        fetchMagazineUrl()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento da revista</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <LabelInputFile
                        id="magazine-upload"
                        accept="pdf/*"
                        label="Revista FPA"
                        onChange={(file) => {
                            setFile(file)
                            const previewUrl = URL.createObjectURL(file!)
                            setPreviewUrl(previewUrl)
                        }}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!file}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar revista
                    </Button>
                </CardFooter>
            </Card>

            <Card className="p-0">
                <CardContent className="relative flex flex-col gap-4 ">
                    {Boolean(magazineUrl || previewUrl) && (
                        <div className="w-full overflow-auto">
                            <iframe allowFullScreen src={magazineUrl || previewUrl} width="100%" height="500px" />
                            <a
                                href={magazineUrl || previewUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-500 hover:underline mt-2 inline-block"
                            >
                                Abrir revista completa
                            </a>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}