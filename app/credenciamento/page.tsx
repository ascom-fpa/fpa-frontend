"use client"

import { useEffect } from "react"
import Footer from "@/components/ui/footer"
import Header from "@/components/ui/header"

export default function Page() {
  useEffect(() => {
    const script = document.createElement("script")
    script.src = "//js.hsforms.net/forms/embed/v2.js"
    script.type = "text/javascript"
    script.charset = "utf-8"
    script.onload = () => {
      ;(window as any).hbspt.forms.create({
        region: "na1",
        portalId: "47050413",
        formId: "1e938f48-3c15-49cc-a89e-24fa4520021c",
        target: "#hubspot-form"
      })
    }
    document.body.appendChild(script)
  }, [])

  return (
    <main>
      <Header />
      <div className="max-w-[1300px] mx-auto px-4 my-10">
        <h1 className="text-4xl font-bold mb-4 text-primary">Credenciamento FPA</h1>

        {/* container onde o HubSpot form vai renderizar */}
        <div id="hubspot-form" className="bg-white rounded-xl shadow-md p-6"></div>
      </div>
      <Footer />
    </main>
  )
}