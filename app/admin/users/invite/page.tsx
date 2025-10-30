'use client'

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { CheckCheck, RefreshCcw, Trash2, UserPlus, KeyRound } from "lucide-react"
import { showToast } from "@/utils/show-toast"
import { ToastContainer } from "react-toastify"
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
    const [resetPasswordData, setResetPasswordData] = useState<{ newPassword: string, userId: string } | null>(null)

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
            showToast({ children: `Convite reenviado` })
        } catch (err) {
            showToast({ children: "Erro ao reenviar convite.", type: "error" })
            console.error("Erro ao reenviar convite", err)
        }
    }

    const handleResetPassword = async (userId: string) => {
        try {
            const { data } = await api.post(`/users/reset-password/${userId}`)

            if (data.data) {
                setResetPasswordData({ newPassword: data.data, userId })
            }

            showToast({ children: "Senha redefinida com sucesso!" })
        } catch (err) {
            showToast({ children: "Erro ao redefinir senha.", type: "error" })
            console.error("Erro ao redefinir senha", err)
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
                    <UserCard
                        key={user.id}
                        user={user}
                        onResend={() => handleResendInvite(user.id)}
                        onResetPassword={() => handleResetPassword(user.id)}
                        showNewPassword={resetPasswordData?.newPassword ? resetPasswordData.userId === user.id ? resetPasswordData.newPassword : undefined : undefined}
                    />
                ))}
            </div>

            <ToastContainer />
        </div>
    )
}

// ✅ Updated UserCard with Reset Password button
function UserCard({
    user,
    onResend,
    onResetPassword,
    showNewPassword,
}: {
    user: any
    onResend: () => void
    onResetPassword: () => void
    showNewPassword?: string
}) {
    return (
        <Card className="p-0 overflow-hidden">
            <CardContent className="relative flex flex-col gap-4 p-4 flex-1">
                <div>
                    <p className="font-semibold text-sm">{user.email}</p>
                    <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
            </CardContent>
            <CardFooter className="flex justify-between bg-[rgba(245,245,245)] py-2">
                {user.status === "pending" ? (
                    <Button size="sm" variant="link" onClick={onResend}>
                        <RefreshCcw className="w-4 h-4 mr-1" /> Reenviar convite
                    </Button>
                ) : (
                    <div className="flex flex-col gap-4">
                        {showNewPassword && <CardContent className="flex flex-col gap-2">
                            <p className="font-semibold">Nova senha gerada:</p>
                            <div className="flex items-center gap-2">
                                <Input
                                    readOnly
                                    value={showNewPassword}
                                    className="font-mono"
                                />
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        navigator.clipboard.writeText(showNewPassword)
                                        showToast({ children: "Senha copiada para área de transferência!" })
                                    }}
                                >
                                    Copiar
                                </Button>
                            </div>
                        </CardContent>}
                        <Button size="sm" variant="link" onClick={onResetPassword}>
                            <KeyRound className="w-4 h-4 mr-1" /> Redefinir senha
                        </Button>

                    </div>
                )}
            </CardFooter>
        </Card>
    )
}