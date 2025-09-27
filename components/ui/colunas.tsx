const columnists = [
    {
        id: 1,
        name: 'Adriana da Silva',
        image: '/coluna1.png',
        description: 'Aqui vai ficar uma das matérias de destaque do colunista de maneira simples',
    },
    {
        id: 2,
        name: 'João Pereira',
        image: '/coluna2.png',
        description: 'Aqui vai ficar uma das matérias de destaque do colunista de maneira simples',
    },
    {
        id: 3,
        name: 'Adriana da Silva',
        image: '/coluna3.png',
        description: 'Aqui vai ficar uma das matérias de destaque do colunista de maneira simples',
    },
    {
        id: 4,
        name: 'João Pereira',
        image: '/coluna4.png',
        description: 'Aqui vai ficar uma das matérias de destaque do colunista de maneira simples',
    },
]

export default function ColunistasSection() {
    return (
        <section className="py-12 px-4 bg-[#f9f9f9]">
            <div className="max-w-[1200px] mx-auto">
                <h2 className="text-3xl font-bold text-[#15803D]">Colunas</h2>
                <p className="text-gray-600 mt-1 mb-6">Conheça quem faz nosso Portal acontecer.</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                    {columnists.map((colunista) => (
                        <div key={colunista.id} className="flex flex-col items-start space-y-2">
                            <div className="flex gap-2 items-center">
                                <img
                                    src={colunista.image}
                                    alt={colunista.name}
                                    className="w-16 h-16 rounded-lg object-cover"
                                />
                                <h3 className="font-semibold text-gray-800">{colunista.name}</h3>
                            </div>
                            <p className="text-sm text-gray-500">{colunista.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}