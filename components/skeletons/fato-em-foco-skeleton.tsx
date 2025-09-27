// components/skeletons/FatoEmFocoSkeleton.tsx

import { ArrowLeft, ArrowRight } from 'lucide-react'

export default function FatoEmFocoSkeleton() {
    return (
        <section id='fato-em-foco' className="py-12 px-4 bg-white">
            <div className="max-w-[1500px] mx-auto">
                <div className="space-y-4">
                    {/* Título */}
                    <div className="flex justify-between items-center">
                        <div>
                            <h2 className="text-4xl font-bold text-[#1C9658]">Minuto FPA</h2>
                            <p className="text-gray-600">Acompanhe nossas notícias em 1 minuto</p>
                        </div>
                    </div>

                    {/* Skeleton Slider */}
                    <div className="relative">
                        <div className="flex gap-3 overflow-hidden">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="flex flex-col gap-2 items-center">
                                    <div className="w-[200px] h-[300px] bg-gray-300 rounded-xl" />
                                </div>
                            ))}
                        </div>

                        {/* Botões */}
                        <button
                            className="cursor-default absolute right-10 -top-16 text-[#c2c2c2]"
                            disabled
                        >
                            <ArrowLeft className="h-8 w-8" />
                        </button>
                        <button
                            className="cursor-default absolute right-0 -top-16 text-[#c2c2c2]"
                            disabled
                        >
                            <ArrowRight className="h-8 w-8" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    )
}