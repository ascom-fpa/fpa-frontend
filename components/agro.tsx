'use client'

import { useState } from 'react'

export default function RespondeAgroDirect() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const handleSearch = async () => {
        setLoading(true)
        setError(null)

        try {
            const response = await fetch(`https://api.cnptia.embrapa.br/respondeagro/v1/search?query=${encodeURIComponent(query)}`, {
                headers: {
                    Authorization: `Bearer SEU_TOKEN_AQUI`, // ⚠️ Cuidado: não exponha tokens sensíveis
                },
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.error || 'Erro ao buscar dados')
            }

            setResults(data.data || [])
        } catch (err: any) {
            setError(err.message || 'Erro desconhecido')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-4">
            <input
                type="text"
                placeholder="Digite uma dúvida do agro..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="border p-2 w-full rounded"
            />
            <button
                onClick={handleSearch}
                disabled={!query || loading}
                className="bg-green-700 text-white px-4 py-2 rounded"
            >
                {loading ? 'Buscando...' : 'Buscar na Embrapa'}
            </button>

            {error && <p className="text-red-500">{error}</p>}

            <ul className="space-y-3">
                {results.map((item, i) => (
                    <li key={i} className="border p-3 rounded">
                        <p className="font-bold text-green-800">{item.question}</p>
                        <p className="text-gray-700">{item.answer}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}