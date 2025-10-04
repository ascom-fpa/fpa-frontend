'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCheck, RefreshCcw, Trash2, UserPlus } from "lucide-react"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { useContentStore } from "@/lib/content-store"
import axios from "axios"
import api from "@/services/axios"
import { showToast } from "@/utils/show-toast"
import { ToastContainer } from "react-toastify"

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
            const { data } = await api.get(`/users/invited?limit=100`)
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
            showToast({ children: "Convite enviado com sucesso!" })
            fetchUsers()
        } catch (err) {
            showToast({ children: "Erro ao enviar convite.", type: "error" })
            console.error("Erro ao convidar usuário", err)
        }
    }

    const handleResendInvite = async (userId: string) => {
        try {
            await api.post(`/users/resend-invite/${userId}`)
            showToast({ children: `Convite reenviado ` })
        } catch (err) {
            showToast({ children: "Erro ao reenviar convite.", type: "error" })
            console.error("Erro ao reenviar convite", err)
        }
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-semibold">Usuários convidados</h1>

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

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {users?.map((user) => (
                    <UserCard key={user.id} user={user} onResend={() => handleResendInvite(user.id)} />
                ))}
            </div>
            <ToastContainer />
        </div>
    )
}

function UserCard({ user, onResend }: { user: any, onResend: () => void }) {
    return (
        <Card className="p-0 overflow-hidden">
            <CardContent className="relative flex flex-col gap-4 p-4">
                <div>
                    <p className="font-semibold text-sm">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-end bg-[rgba(245,245,245)] py-2">
                {user.status == "pending"
                    ? <Button size="sm" variant="link" onClick={onResend}>
                        <RefreshCcw className="w-4 h-4 mr-1" /> Reenviar convite
                    </Button>
                    : <Button disabled size="sm" variant="link" onClick={onResend}>
                        <CheckCheck className="w-4 h-4 mr-1" /> Usuário ativo
                    </Button>
                }
            </CardFooter>
        </Card>
    )
}