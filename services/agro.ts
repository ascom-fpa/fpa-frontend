export async function getAgroData() {
    const res = await fetch('/api/agro/produtividade');
    const data = await res.json();

    https://api.cnptia.embrapa.br/agritec/produtividade

    return data;
}
