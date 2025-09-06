import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-[#2A2A2A] text-white pt-6">
            {/* Linha superior com redes sociais */}
            <div className="container mx-auto px-4 flex items-center justify-between border-b border-white/10 pb-4">
                <span className="text-sm text-white">
                    Frente Parlamentar da Agropecuária - Todos os Direitos Reservados
                </span>
                <div className="flex items-center space-x-4">
                    <a target='_blank' href="https://twitter.com/fpagropecuaria" className="hover:text-gray-300">
                        <Twitter className="w-5 h-5" />
                    </a>
                    <a target='_blank' href="https://www.facebook.com/fpagropecuaria" className="hover:text-gray-300">
                        <Facebook className="w-5 h-5" />
                    </a>
                    <a target='_blank' href="https://www.instagram.com/fpagro/" className="hover:text-gray-300">
                        <Instagram className="w-5 h-5" />
                    </a>
                </div>
            </div>

            {/* Linha inferior de navegação */}
            <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between text-sm text-white mt-2">
                <div className="flex space-x-8 font-semibold text-center">
                    <a href="/sobre" className="hover:underline">Sobre o Portal</a>
                    <a href="/politica-privacidade-e-termo-de-uso" className="hover:underline">Política de Privacidade & Termo de Uso</a>
                    <a href="/contato" className="hover:underline">Contato</a>
                </div>
            </div>
        </footer>
    );
}