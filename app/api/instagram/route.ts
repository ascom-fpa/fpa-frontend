// app/api/instagram/route.ts

export const revalidate = 86400;

export async function GET() {
    const token = process.env.INSTA_API;

    const res = await fetch(
        `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type,username&access_token=${token}`,
        {
            // Next.js vai cachear essa resposta por 10 minutos
            next: { revalidate },
        }
    );

    if (!res.ok) {
        return new Response("Erro ao buscar do Instagram", { status: res.status });
    }

    const data = await res.json();
    return Response.json(data);
}