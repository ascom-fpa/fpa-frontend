import { Menu } from "lucide-react";
import RespondeAgroDirect from "../agro";
import { Button } from "./button";
import Link from "next/link";
import { getLive, UpdateLiveData } from "@/services/live";
import { useEffect, useState } from "react";

export default function Header() {
    const [live, setLive] = useState<UpdateLiveData>({
        isEnabled: false,
        link: ''
    });

    useEffect(() => {
        fetchLiveUrl()
    }, []);

    async function fetchLiveUrl() {
        getLive()
            .then(res => setLive(res))
    }

    return (
        <header className="bg-[#419672] text-white">
            {/* Top bar */}
            <RespondeAgroDirect />

            {/* Main header */}
            <div className="py-4 px-4">
                <div className="flex justify-between items-center max-w-[1800px] mx-auto">
                    <div className="flex items-center space-x-4">
                        <Button variant="ghost" size="sm" className="text-white hover:bg-[#154B2B]">
                            <Menu className="h-6 w-6" />
                        </Button>
                        <div className="text-center">
                            <div className="text-sm font-medium">FRENTE PARLAMENTAR DA</div>
                            <div className="text-2xl font-bold">AGROPECUÁRIA</div>
                        </div>
                    </div>

                    <div className="flex items-center space-x-4">
                        {live.isEnabled && <Link href={live.link} className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                            <span className="font-medium">AO VIVO</span>
                        </Link>}
                        {/* <Link href="/admin">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-[#419672] bg-transparent"
                >
                  LOGIN
                </Button>
              </Link> */}
                    </div>
                </div>
            </div>
        </header>
    )
}