"use client"
import { useEffect, useState } from "react"
import Footer from "@/components/ui/footer"
import Header from "@/components/ui/header"
import { getPauta } from "@/services/pauta";

export default function Page() {
  const [pautaImage, setPautaImage] = useState('');

  useEffect(() => {
    const script = document.createElement("script")
    script.src = "//js.hsforms.net/forms/embed/v2.js"
    script.type = "text/javascript"
    script.charset = "utf-8"
    script.onload = () => {
      ; (window as any).hbspt.forms.create({
        region: "na1",
        portalId: "47050413",
        formId: "1e938f48-3c15-49cc-a89e-24fa4520021c",
        target: "#hubspot-form"
      })
    }
    document.body.appendChild(script)
  }, [])

  useEffect(() => {
    fetchPauta()
  }, []);

  async function fetchPauta() {
    getPauta()
      .then(res => setPautaImage(res.imageUrl!))
  }

  return (
    <main>
      <Header />
      <div className="max-w-[1300px] mx-auto px-4 my-10">
        <h1 className="text-4xl font-bold mb-4 text-primary">Credenciamento FPA</h1>

        <div className="flex md:flex-row gap-10 mt-12 flex-col">

          <div className="lg:w-1/2 w-full">
            {pautaImage ? <img className=' rounded-xl  w-full' src={pautaImage} /> : <div className="overflow-hidden rounded-2xl lg:w-auto w-full h-[518px] bg-gray-200 animate-pulse" style={{ maxWidth: 435 }} />}
          </div>

          <div className="flex flex-col gap-6 lg:w-1/2 w-full">
            <div>
              <h2 className="font-semibold text-xl">Informações importantes</h2>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>2 jornalistas por veículo de comunicação</li>
                <li>1 auxiliar e 1 cinegrafista por veículo de tv</li>
                <li>Não serão aceitos credenciamentos de veículos de comunicação por gabinete parlamentar, apenas assessoria de imprensa com apresentação de crachá parlamentar</li>
                <li>Todos deverão apresentar crachá de credenciamento de imprensa para acessar o local</li>
              </ul>
            </div>

            {/* container onde o HubSpot form vai renderizar */}
            <div id="hubspot-form" className="bg-white rounded-xl shadow-md p-6"></div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}