'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { UploadCloud } from "lucide-react"
import { getPage, updatePage } from "@/services/page"
import { TipTapEditor } from "../posts/tiptap-editor"
import { useEditor, } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { showToast } from "@/utils/show-toast"

export default function Page() {
    const [content, setContent] = useState({});

    const editor = useEditor({
        immediatelyRender: false,
        shouldRerenderOnTransaction: false,
        editorProps: {
            attributes: {
                autocomplete: "off",
                autocorrect: "off",
                autocapitalize: "off",
                "aria-label": "Main content area, start typing to enter text.",
                class: "simple-editor",
            },
        },
        extensions: [
            StarterKit.configure({
                horizontalRule: false,
                link: {
                    openOnClick: false,
                    enableClickSelection: true,
                },
            }),
            HorizontalRule,
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            TaskList,
            TaskItem.configure({ nested: true }),
            Highlight.configure({ multicolor: true }),
            Image,
            Typography,
            Superscript,
            Subscript,
            Selection,

        ],
        content,
    })

    useEffect(() => {
        fetchPage()
    }, [])

    useEffect(() => {
        if (editor && content) {
            editor.commands.setContent(content)
        }
    }, [editor, content])

    async function fetchPage() {
        getPage("contact-page")
            .then(res => {
                setContent(res.content)
                showToast({type: 'success', children: 'Página atualizada com sucesso'})
            })
    }

    const handleUpload = async () => {
        const postContent = editor?.getJSON() || {}

        if (!postContent) return

        await updatePage({ content: postContent }, "contact-page")
        setContent({})
        fetchPage()
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento da página CONTATO</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4 max-h-[70vh]">
                    <TipTapEditor editor={editor} />
                </CardContent>
                <CardFooter className="flex justify-end fixed z-20">
                    <Button onClick={handleUpload} disabled={!content}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Atualizar página
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}