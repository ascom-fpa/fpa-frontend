export async function getAgroData() {
    const res = await fetch('/api/agro/produtividade');
    const data = await res.json();

    if (res.ok) {
        console.log('Access Token:', data);
    } else {
        console.error('Erro ao buscar token', data);
    }

    https://api.cnptia.embrapa.br/agritec/produtividade

    return data;
}
