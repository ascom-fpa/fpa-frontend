'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Trash2, UserPlus } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useContentStore } from "@/lib/content-store"
import axios from "axios"
import api from "@/services/axios"

enum UserRoleEnum {
    ADMIN = 'ADMIN',
    MAIN_EDITOR = 'MAIN_EDITOR',
    EDITOR = 'EDITOR',
    READER = 'READER',
}

export default function UsersPage() {
    const [email, setEmail] = useState("")
    const [role, setRole] = useState<UserRoleEnum | null>(null)
    const [users, setUsers] = useState<any[]>([])

    const fetchUsers = async () => {
        try {
            const { data } = await api.get(`/users`)
            setUsers(data.data.users)
        } catch (err) {
            console.error("Erro ao buscar usuários", err)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleInvite = async () => {
        if (!email || !role) return
        try {
            await api.post(`/users/invite`, { email, role })
            setEmail("")
            setRole(null)
            fetchUsers()
        } catch (err) {
            console.error("Erro ao convidar usuário", err)
        }
    }

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/users/${id}`)
            fetchUsers()
        } catch (err) {
            console.error("Erro ao excluir usuário", err)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Gerenciamento de Usuários</h1>

            <Card>
                <CardContent className="p-4 flex flex-col gap-4">
                    <Input
                        placeholder="E-mail do usuário"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <select
                        value={role || ""}
                        onChange={(e) => setRole(e.target.value as UserRoleEnum)}
                        className="border rounded-md p-2"
                    >
                        <option value="">Selecione uma permissão</option>
                        <option value={UserRoleEnum.MAIN_EDITOR}>Main Editor</option>
                        <option value={UserRoleEnum.EDITOR}>Editor</option>
                        <option value={UserRoleEnum.ADMIN}>Admin</option>
                    </select>
                </CardContent>
                <CardFooter className="flex justify-end">
                    <Button onClick={handleInvite} disabled={!email || !role}>
                        <UserPlus className="mr-2 h-4 w-4" /> Convidar usuário
                    </Button>
                </CardFooter>
            </Card>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {users?.map((user) => (
                    <UserCard key={user.id} user={user} onDelete={() => handleDelete(user.id)} />
                ))}
            </div>
        </div>
    )
}

function UserCard({ user, onDelete }: { user: any, onDelete: () => void }) {
    return (
        <Card className="p-0">
            <CardContent className="relative flex flex-col gap-4 p-4">
                <div>
                    <p className="font-semibold text-sm">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-[rgba(245,245,245)] py-2">
                <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Deseja realmente excluir este usuário?</AlertDialogTitle>
                        </AlertDialogHeader>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
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