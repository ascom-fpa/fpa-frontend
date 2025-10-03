import { Twitter, Facebook, Instagram } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="text-white pt-6 w-full flex flex-col items-center">
            {/* Linha superior com redes sociais */}
            <div className="bg-[#3D3D3D]  w-full flex items-center justify-center border-b border-white/10 py-8">
                <div className="flex items-center space-x-6">
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
            <div className="container px-4 py-4 flex flex-col lg:flex-row items-center justify-center text-sm text-black mt-2">
                <div className="flex space-x-8 font-semibold lg:justify-between justify-center lg:text-start text-center gap-10 lg:flex-row flex-col items-center">
                    <a href='/' className="text-sm font-light hover:font-medium transition-all">Frente Parlamentar da Agropecuária - Todos os Direitos Reservados</a>
                    <a href="/sobre" className="font-light hover:font-medium transition-all">Sobre o Portal</a>
                    <a href="/politica-privacidade-e-termo-de-uso" className="font-light hover:font-medium transition-all">Política de Privacidade & Termo de Uso</a>
                    <a href="/contato" className="font-light hover:font-medium transition-all">Contato</a>
                </div>
            </div>
        </footer>
    );
}