import { useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { newsletterSubscribe } from "@/services/newsletter"
import { showToast } from "@/utils/show-toast"
import { MailPlus } from "lucide-react"

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
        <div
            style={{ backgroundImage: "url('/newsletter-bg.png')", backgroundRepeat: 'no-repeat' }}
            className=" text-white rounded-2xl w-full lg:max-w-[435px] bg-cover relative overflow-hidden"
        >
            <div className="bg-[#419672] opacity-80 absolute top-0 left-0 w-full h-full"></div>
            <div className="relative z-20 py-10 px-5">
                <h3 className="text-3xl font-bold text-center m-0">Cadastre-se em nossa Newsletter</h3>
                <p className=" text-center font-light m-0">Cadastre-se agora e seja o primeiro a saber sobre nossas notícias.</p>
                <form onSubmit={handleNewsletterSubmit} className="space-y-4 mt-4">
                    <div>
                        <label className="block text-sm text-center font-light mb-2">Seu nome:</label>
                        <Input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-white text-gray-900"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-center font-light mb-2">Seu melhor email:</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-white text-gray-900"
                            required
                        />
                    </div>

                    <Button type="submit" className="flex gap-4 w-full bg-transparent border-white border hover:bg-white hover:text-[#419672] text-white font-light text-2xl py-2">
                        <MailPlus style={{ scale: 1.4 }} />
                        <span>Inscrever</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}