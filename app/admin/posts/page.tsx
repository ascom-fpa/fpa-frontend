"use client"

import { nanoid } from "nanoid" // certifique-se de instalar: npm i nanoid

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2, AlertTriangle, Copy } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { LabelInputFile } from "@/components/ui/label-input-file"
import { PostStatusEnum } from "@/enums/post"
import { CreatePostData } from "@/services/posts"
import { MultiSelect } from "@/components/ui/multi-select"
import { TipTapEditor } from "./tiptap-editor"
import { useEditor } from "@tiptap/react"

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
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"
import content from "@/components/tiptap-templates/data/content.json"
import ViewPost from "./view-post"

const formInitialState: CreatePostData = {
    postTitle: "",
    postCategoryId: "",
    postContent: {},
    postStatus: PostStatusEnum.DRAFT,
    summary: "",
    relatedTags: [],
    slug: "",
    thumbnailFile: null,
    files: [],
    isFeatured: false,
}

export default function PostsAdminPage() {
    const [form, setForm] = useState<CreatePostData>(formInitialState)
    const {
        posts, fetchPosts, createPost, deletePost,
        fetchTags, tags, fetchCategories, categories,
        pushCurrentPostFiles, currentPostFiles, setLoading
    } = useContentStore()
    const [orderedPosts, setOrderedPosts] = useState<any[]>([])

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
            ImageUploadNode.configure({
                accept: "image/*",
                maxSize: MAX_FILE_SIZE,
                limit: 3,
                upload: (file, progress, signal) =>
                    handleImageUpload(file, progress, signal, pushCurrentPostFiles),
                onError: (error) => console.error("Upload failed:", error),
            }),
        ],
        content,
    })

    useEffect(() => {
        fetchPosts()
        fetchTags()
        fetchCategories()
    }, [])

    useEffect(() => {
        setOrderedPosts(posts)
    }, [posts])

    const handleUpload = async () => {
        setLoading(true)
        if (!form.postTitle || !form.postCategoryId || !form.postStatus || !form.slug || !form.thumbnailFile || !form.summary) return
        form.files = currentPostFiles

        form.postContent = editor?.getJSON() || {}
        await createPost(form)
        setForm(formInitialState)
        fetchPosts()
        setLoading(false)
    }

    async function handleDuplicate(duplicatedPost: CreatePostData) {
        setLoading(true)
        await createPost(duplicatedPost)
        await fetchPosts()
        setLoading(false)
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento de Matérias</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="Título"
                        value={form.postTitle}
                        onChange={(e) => setForm({ ...form, postTitle: e.target.value })}
                    />

                    <Input
                        placeholder="Resumo da matéria"
                        value={form.summary}
                        onChange={(e) => setForm({ ...form, summary: e.target.value })}
                    />

                    <Input
                        placeholder="Slug (URL amigável)"
                        value={form.slug}
                        onChange={(e) => setForm({ ...form, slug: e.target.value })}
                    />

                    <div className="flex gap-2 items-center">
                        <label className="flex items-center space-x-2">Matéria em destaque?</label>
                        <Input
                            className="cursor-pointer"
                            style={{ width: '20px', height: '20px' }}
                            type="checkbox"
                            placeholder="Slug (URL amigável)"
                            checked={form.isFeatured}
                            onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                        />
                    </div>

                    <select
                        value={form.postStatus}
                        onChange={(e) => setForm({ ...form, postStatus: e.target.value as PostStatusEnum })}
                        className="cursor-pointer border rounded-md px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="">Selecionar status da matéria</option>
                        <option value="draft">Rascunho</option>
                        <option value="revision">Revisão</option>
                        <option value="posted">Publicado</option>
                        <option value="removed">Removido</option>
                    </select>

                    <select
                        value={form.postCategoryId}
                        onChange={(e) => setForm({ ...form, postCategoryId: e.target.value })}
                        className="cursor-pointer border rounded-md px-3 py-2 text-sm text-gray-700"
                    >
                        <option value="">Selecionar categoria</option>
                        {categories.map(category => <option value={category.id}>{category.name}</option>)}
                    </select>


                    {/* Para seleção de tags relacionadas */}
                    <MultiSelect
                        selected={form.relatedTags || []}
                        onChange={(tags) => setForm({ ...form, relatedTags: tags })}
                        options={tags.map(tag => ({ label: tag.name, value: tag.id }))}
                    />

                    {/* Editor de conteúdo pode ser implementado com Tiptap ou outro */}
                    <TipTapEditor editor={editor} />

                    <LabelInputFile
                        id="thumbnail-upload"
                        label="Selecionar thumbnail"
                        accept="image/*"
                        onChange={(file) => setForm({ ...form, thumbnailFile: file })}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!form.postTitle || !form.postCategoryId || !form.postStatus || !form.slug}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar matéria
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {orderedPosts?.map((post) => (
                    <PostCard key={post.id} post={post} onDelete={() => deletePost(post.id)} handleDuplicate={handleDuplicate} />
                ))}
            </div>
        </div>
    )
}

function PostCard({ post, onDelete, handleDuplicate }: { post: any; onDelete: () => void, handleDuplicate: any }) {
    return (
        <Card className="p-0">
            <CardContent className="flex flex-col gap-4">
                <p className="font-semibold text-sm">{post.postTitle}</p>
                {post.thumbnailUrl && (
                    <img
                        src={post.thumbnailUrl}
                        alt="post-thumbnail"
                        className="w-full h-40 object-cover rounded"
                    />
                )}
                {post.summary && <p className="text-sm text-muted-foreground">{post.summary}</p>}
            </CardContent>
            <CardFooter className="flex justify-between bg-[rgba(245,245,245)] py-2">
                {/* BOTÃO VER POST */}
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="outline">
                            Ver post
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="h-[90vh] w-[90vw] overflow-y-auto">
                        <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl">{post.postTitle}</AlertDialogTitle>
                        </AlertDialogHeader>

                        {post.thumbnailUrl && (
                            <img
                                src={post.thumbnailUrl}
                                alt="post-thumbnail"
                                className="w-full max-h-96 object-cover rounded my-4"
                            />
                        )}

                        {post.summary && (
                            <p className="text-muted-foreground mb-4">{post.summary}</p>
                        )}

                        {/* Aqui você pode substituir por seu componente de leitura Tiptap */}
                        <ViewPost postContent={post.postContent} />

                        <AlertDialogFooter className="mt-6 fixed right-10">
                            <AlertDialogCancel>Fechar</AlertDialogCancel>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive" onClick={onDelete}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deseja realmente excluir?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <div className="mb-4">
                            {post.thumbnailUrl && (
                                <img
                                    src={post.thumbnailUrl}
                                    alt="post-preview"
                                    className="w-full h-80 object-contain rounded"
                                />
                            )}
                            {post.postTitle && (
                                <p className="mt-2 text-sm text-center text-muted-foreground">
                                    {post.postTitle}
                                </p>
                            )}
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={onDelete}>Confirmar</AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="secondary">
                            <Copy className="w-4 h-4 mr-1" />
                            Duplicar
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle className="flex items-center gap-2">
                                <AlertTriangle className="text-yellow-600 w-5 h-5" />
                                Confirmar duplicação
                            </AlertDialogTitle>
                        </AlertDialogHeader>
                        <p className="text-muted-foreground text-sm mt-2">
                            Deseja duplicar este post com um novo título e slug aleatórios?
                        </p>
                        <AlertDialogFooter className="mt-4">
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                                onClick={async () => {
                                    const randomSuffix = nanoid(12)
                                    const duplicatedPost = {
                                        ...post,
                                        id: undefined,
                                        postTitle: `${post.postTitle} - Cópia ${randomSuffix}`,
                                        slug: `${post.slug}-${randomSuffix}`,
                                        postContent: post.postContent ?? {}, // ou [] ou null, dependendo do que seu schema aceita
                                    }

                                    handleDuplicate(duplicatedPost)
                                }}
                            >
                                Confirmar
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </CardFooter>
        </Card>
    )
}
