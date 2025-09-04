'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { UploadCloud } from "lucide-react"
import { LabelInputFile } from "@/components/ui/label-input-file"
import { getLive, updateLive } from "@/services/live"
import { Input } from "@/components/ui/input"

export default function LivePage() {
    const [link, setLink] = useState('');
    const [isEnabled, setIsEnabled] = useState(false);

    useEffect(() => {
        fetchLiveUrl()
    }, [])

    async function fetchLiveUrl() {
        getLive()
            .then(res => setLink(res.link))
    }

    const handleUpload = async () => {
        if (!link) return

        await updateLive({ isEnabled, link })
        setLink('')
        setIsEnabled(false)
        fetchLiveUrl()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento do ao vivo</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="Link "
                        value={link}
                        onChange={(e) => setLink(e.target.value)}
                    />
                    <div className="flex gap-4 ms-2 items-center">
                        <label>Está ao vivo?</label>
                        <Input
                            placeholder="Destaque na home?"
                            checked={isEnabled}
                            onChange={(e) => setIsEnabled(e.target.checked)}
                            type="checkbox"
                            className="w-4 cursor-pointer"
                        />
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!link}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Atualizar ao vivo
                    </Button>
                </CardFooter>
            </Card>

            <Card className="p-0">
                <CardContent className="relative flex flex-col gap-4 ">
                    <div className="w-full overflow-auto flex gap-4">
                        <span className="font-semibold">Link atual:</span>
                        <span>{link}</span>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}