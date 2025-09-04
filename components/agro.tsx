'use client'

import { getAgroData } from '@/services/agro'
import { useEffect, useState } from 'react'

type AgroData = {
    temperaturaMaxima: number[]
    temperaturaMinima: number[]
    produtividadeAlmejada: number[]
    produtividadeMediaMunicipio: number[]
    balancoHidrico: number[]
}

export default function RespondeAgroDirect() {
    const [data, setData] = useState<AgroData | null>(null)

    useEffect(() => {
        getAgroData()
            .then(result => {
                console.log(result)
                setData(result.data)
            })
            .catch(console.error);
    }, []);

    const tickerItems = [
        {
            label: 'Temp. Máxima',
            value: `${data ? data.temperaturaMaxima[0]?.toFixed(1) : 0}°C`,
        },
        {
            label: 'Temp. Mínima',
            value: `${data ? data.temperaturaMinima[0]?.toFixed(1) : 0}°C`,
        },
        {
            label: 'Prod. Almejada',
            value: `${data ? data.produtividadeAlmejada[0]?.toFixed(2) : 0} t/ha`,
        },
        {
            label: 'Prod. Média Município',
            value: `${data ? data.produtividadeMediaMunicipio[0]?.toFixed(2) : 0} t/ha`,
        },
        {
            label: 'Balanço Hídrico',
            value: `${data ? data.balancoHidrico[0]?.toFixed(2) : 0} mm`,
        },
    ]

    return (
        <div className="bg-white text-black w-full overflow-hidden py-1 text-sm">
            <div className="animate-marquee whitespace-nowrap px-4">
                {tickerItems.map((item, idx) => (
                    <span key={idx} className="mx-6 inline-block">
                        <strong>{item.label}:</strong> {item.value}
                    </span>
                ))}
            </div>
        </div>
    )
}