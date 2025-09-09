'use client'
import "@/components/tiptap-templates/simple-editor.scss"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

import { useIsMobile } from "@/hooks/use-mobile"
import Highlight from "@tiptap/extension-highlight"
import HorizontalRule from "@tiptap/extension-horizontal-rule"
import Image from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import Subscript from "@tiptap/extension-subscript"
import Superscript from "@tiptap/extension-superscript"
import TextAlign from "@tiptap/extension-text-align"
import Typography from "@tiptap/extension-typography"
import { Selection } from "@tiptap/extensions"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import React from "react"

export default function ViewPost({ postContent }: any) {
    const isMobile = useIsMobile()
    const [mobileView, setMobileView] = React.useState<"main" | "highlighter" | "link">("main")

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
        editable: false,
        content: postContent
    })

    React.useEffect(() => {
        if (!isMobile && mobileView !== "main") {
            setMobileView("main")
        }
    }, [isMobile, mobileView])

    return (
        <div>
            <EditorContext.Provider value={{ editor }}>
                <EditorContent
                    editor={editor}
                    role="presentation"
                />
            </EditorContext.Provider>
        </div>
    )
}