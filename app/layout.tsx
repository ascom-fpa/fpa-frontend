import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import Script from 'next/script'

export const metadata = {
  title: 'Portal FPA',
  description: 'FPA Notícias é seu portal confiável de informações sobre política, economia, cultura e muito mais. Atualizações diárias com imparcialidade e profundidade.',
  keywords: ['notícias', 'jornalismo', 'FPA', 'política', 'economia', 'cultura', 'atualidades', 'Brasil', 'mundo', 'opinião'],
  openGraph: {
    title: 'FPA Notícias',
    description: 'Informação de qualidade sobre política, economia e cultura. Acesse agora o portal FPA Notícias.',
    url: 'https://www.fpanoticias.com.br/',
    siteName: 'FPA Notícias',
    images: [
      {
        url: 'https://www.fpanoticias.com.br/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'FPA Notícias',
      },
    ],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FPA Notícias',
    description: 'Acompanhe as principais notícias do Brasil e do mundo com profundidade e agilidade no FPA Notícias.',
    images: ['https://www.fpanoticias.com.br/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <head>
        <link rel="shortcut icon" href="favicon.png" type="image/x-icon" />
      </head>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-K56PQX18ME"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());

          gtag('config', 'G-K56PQX18ME');
        `}
      </Script>
      <body cz-shortcut-listen="true">{children}</body>
    </html>
  )
}
