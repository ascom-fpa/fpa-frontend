// app/api/agro-token/route.ts
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const EMBRAPA_AUTH = process.env.EMBRAPA_BASIC_AUTH || ''; // mantenha isso no .env.local

    const response = await fetch('https://api.cnptia.embrapa.br/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${EMBRAPA_AUTH}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('Erro ao buscar token da Embrapa:', err);
    return NextResponse.json({ error: 'Erro ao buscar token da Embrapa' }, { status: 500 });
  }
}