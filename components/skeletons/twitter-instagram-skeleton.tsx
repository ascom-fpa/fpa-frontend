import { Instagram } from "lucide-react";
import Link from "next/link";

export default function TwitterInstagramSkeleton() {
    return (
        <div className="w-full space-y-6 pt-12 lg:pt-0 bg-white p-2 rounded-2xl shadow-md">
            <Link target="_blank" href="https://www.instagram.com/fpagro/" className="flex text-[#1C9658] gap-2 items-center justify-center pt-2">
                <h3 className=" text-3xl text-center">Instagram FPA</h3>
                <Instagram className="w-6 h-6" />
            </Link>
            <div className="flex flex-wrap gap-3 justify-center">
                {[...Array(2)].map((_, i) => (
                    <div key={i} className=" bg-gray-300 rounded w-full h-[500px] animate-pulse" />
                ))}
            </div>
        </div>
    )
}