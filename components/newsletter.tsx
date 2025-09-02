import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { newsletterSubscribe } from "@/services/newsletter"
import { showToast } from "@/utils/show-toast"

export default function Newsletter() {
    const [email, setEmail] = useState("")
    const [name, setName] = useState("")

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        // Handle newsletter subscription
        newsletterSubscribe({ name, email }).then(_ => {
            showToast({ type: 'success', children: 'Parabéns, agora você faz parte da nossa newsletter!' })
        }).catch(e => {
            showToast({ type: 'error', children: e.response.data.message })
        })
        setName("")
        setEmail("")
    }

    return (
        <div className="bg-[#419672] text-white p-6 rounded-lg">
            <h3 className="text-xl font-bold text-center mb-2">Cadastre-se em nossa Newsletter</h3>
            <p className="text-sm text-center mb-6 opacity-90">
                Cadastre-se agora e seja o primeiro a saber sobre nossas notícias.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-2">Seu nome:</label>
                    <Input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full bg-white text-gray-900"
                        required
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Seu melhor email:</label>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-white text-gray-900"
                        required
                    />
                </div>

                <Button type="submit" className="w-full bg-[#154B2B] hover:bg-[#012D1C] text-white font-medium py-2">
                    📧 Inscrever
                </Button>
            </form>
        </div>
    )
}