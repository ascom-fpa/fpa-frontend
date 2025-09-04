// app/api/agro-obtentores/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // 1. Busca o token via rota interna segura
    const tokenRes = await fetch(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/agro`, {
      method: 'POST',
    });

    if (!tokenRes.ok) {
      const errData = await tokenRes.json();
      return NextResponse.json({ error: 'Erro ao obter token', details: errData }, { status: 500 });
    }

    const { access_token } = await tokenRes.json();

    // 2. Usa o token para buscar os dados da Embrapa
    const res = await fetch('https://api.cnptia.embrapa.br/agritec/v2/produtividade?idCultura=60&codigoIBGE=2112001&cad=70&dataPlantio=2024-05-01&idCultivar=24507&expectativaProdutividade=3', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      return NextResponse.json(data, { status: res.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Erro ao buscar obtentores da Embrapa:', err);
    return NextResponse.json({ error: 'Erro interno' }, { status: 500 });
  }
}