'use client'

import { ChevronDown, ChevronUp, Menu, X } from "lucide-react";
import RespondeAgroDirect from "../agro";
import { Button } from "./button";
import Link from "next/link";
import { getLive, UpdateLiveData } from "@/services/live";
import { useEffect, useState } from "react";
import { useContentStore } from "@/lib/content-store";

export default function Header() {
    const { categories, fetchCategories } = useContentStore()

    const [live, setLive] = useState<UpdateLiveData>({
        isEnabled: false,
        link: ''
    });

    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY >= 200); // change threshold if needed
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        fetchLiveUrl();
        fetchCategories()
    }, []);

    async function fetchLiveUrl() {
        const res = await getLive();
        setLive(res);
    }

    return (
        <>
            {/* Sidebar Overlay */}
            <div
                className={`fixed inset-0 z-40 backdrop-blur-xs opacity-50 transition-opacity ${isSidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
                onClick={() => setIsSidebarOpen(false)}
            ></div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-[#1C9658] text-white z-50 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-4 flex justify-between items-center border-b border-gray-200">
                    <h2 className="text-lg font-bold">Menu</h2>
                    <Button variant="ghost" size="sm" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>

                <nav className="p-4 space-y-4">
                    {/* Categorias com submenu */}
                    <div className="space-y-2">
                        <button
                            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                            className="cursor-pointer flex items-center justify-between w-full hover:scale-105 transition"
                        >
                            <span>Categorias</span>
                            {isCategoriesOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                        <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isCategoriesOpen ? 'max-h-96' : 'max-h-0'}`}>
                            <ul className="pl-4 mt-2 space-y-2">
                                {/* Exemplo fixo — substitua por .map futuramente */}
                                {categories.map(cat => <li key={cat.id}><Link href={`/categoria/${cat.id}`} className="block hover:scale-105">{cat.name}</Link></li>)}
                            </ul>
                        </div>
                    </div>
                    <Link onClick={() => setIsSidebarOpen(false)} href="/#mais-lidas" className="block hover:scale-105 transition">Mais lidas</Link>
                    <Link onClick={() => setIsSidebarOpen(false)} href="/#fato-em-foco" className="block hover:scale-105 transition">Fato em foco</Link>
                    <Link onClick={() => setIsSidebarOpen(false)} href="/#videos" className="block hover:scale-105 transition">Vídeos</Link>
                    <Link onClick={() => setIsSidebarOpen(false)} href="/#webstories" className="block hover:scale-105 transition">Webstories</Link>
                    <Link href="/sobre" className="block hover:scale-105 transition">Sobre</Link>
                    <Link href="/contato" className="block hover:scale-105 transition">Contato</Link>
                </nav>
            </aside>

            {/* Header */}
            <header className="bg-[#1C9658] text-white sticky top-0 left-0 z-40">
                {/* Top bar */}
                <RespondeAgroDirect />

                {/* Main header */}
                <div className="py-4 px-4">
                    <div className="flex justify-between items-center max-w-[1200px] mx-auto">
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-white hover:bg-[#154B2B]"
                            onClick={() => setIsSidebarOpen(true)}
                        >
                            <Menu className="h-6 w-6" />
                        </Button>
                        <Link href="/" className="text-center">
                            <img
                                src={isScrolled ? "/fpa-pequena.png" : "/fpa-grande.png"}
                                alt="logo FPA"
                                className={`${isScrolled ? 'max-w-[140px]':'max-w-[60px]'}`}
                            />
                            <link rel="preload" as="image" href="/fpa-pequena.png" />
                            <link rel="preload" as="image" href="/fpa-grande.png" />
                        </Link>
                        {live.isEnabled && (
                            <Link href={live.link} className="flex items-center space-x-2">
                                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                <span className="font-medium">AO VIVO</span>
                            </Link>
                        )}
                    </div>
                </div>
            </header>
        </>
    )
}