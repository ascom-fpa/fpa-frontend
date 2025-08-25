"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { UploadCloud, Trash2 } from "lucide-react"
import { useContentStore } from "@/lib/content-store"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { LabelInputFile } from "@/components/ui/label-input-file"
import { PostStatusEnum } from "@/enums/post"
import { CreatePostData } from "@/services/posts"
import { MultiSelect } from "@/components/ui/multi-select"

const formInitialState: CreatePostData = {
    postTitle: "",
    postCategoryId: "",
    postContent: {},
    postStatus: PostStatusEnum.DRAFT,
    summary: "",
    relatedTags: [],
    slug: "",
    thumbnailFile: null
}

export default function PostsAdminPage() {
    const [form, setForm] = useState<CreatePostData>(formInitialState)
    const { posts, fetchPosts, createPost, deletePost, fetchTags, tags, fetchCategories, categories } = useContentStore()
    const [orderedPosts, setOrderedPosts] = useState<any[]>([])

    useEffect(() => {
        fetchPosts()
        fetchTags()
        fetchCategories()
    }, [])

    useEffect(() => {
        setOrderedPosts(posts)
    }, [posts])

    const handleUpload = async () => {
        if (!form.postTitle || !form.postCategoryId) return

        await createPost(form)
        setForm(formInitialState)
        fetchPosts()
    }

    console.log(tags, posts)

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
                    <textarea
                        placeholder="Conteúdo (JSON string por enquanto)"
                        className="border rounded-md px-3 py-2 text-sm text-gray-700"
                        rows={6}
                        value={JSON.stringify(form.postContent, null, 2)}
                        onChange={(e) => {
                            try {
                                const json = JSON.parse(e.target.value)
                                setForm({ ...form, postContent: json })
                            } catch (err) {
                                // você pode exibir um erro se quiser
                            }
                        }}
                    />

                    <LabelInputFile
                        id="thumbnail-upload"
                        label="Selecionar thumbnail"
                        accept="image/*"
                        onChange={(file) => setForm({ ...form, thumbnailFile: file })}
                    />
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleUpload} disabled={!form.postTitle}>
                        <UploadCloud className="mr-2 h-4 w-4" /> Enviar Tag
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {orderedPosts?.map((post) => (
                    <PostCard key={post.id} post={post} onDelete={() => deletePost(post.id)} />
                ))}
            </div>
        </div>
    )
}

function PostCard({ post, onDelete }: { post: any; onDelete: () => void }) {
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
            </CardFooter>
        </Card>
    )
}
