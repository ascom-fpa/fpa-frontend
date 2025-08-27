"use client"
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type React from "react"

import { useEffect, useState } from "react"
import { ChevronLeft, ChevronRight, Menu, Search, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { useContentStore } from "@/lib/content-store"
import Footer from '@/components/ui/footer'

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const { fetchBanners, banners, webstories, fetchWebStories, fetchPosts, posts, fetchRelevants, relevants } = useContentStore()

  useEffect(() => {
    fetchBanners()
    fetchWebStories()
    fetchPosts()
    fetchRelevants()
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % banners.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length)
  }

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle newsletter subscription
    console.log("Newsletter subscription:", { name, email })
    setName("")
    setEmail("")
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-[#419672] text-white">
        {/* Top bar */}
        <div className="bg-gray-100 text-black text-xs py-1 px-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex space-x-4">
              <span>COTAÇÃO DO AGRONEGÓCIO:</span>
              <span>r - 00.0012371535770034 ↓ 1.444</span>
              <span>Libra Esterlina - 00.0014039844541947 ↑ 2.3973</span>
              <span>WTI - 00.0020651541319644862</span>
            </div>
            <div className="flex items-center space-x-4">
              <span>SITE FPA</span>
              <Button variant="ghost" size="sm" className="text-black hover:bg-gray-200">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Main header */}
        <div className="py-4 px-4">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-[#154B2B]">
                <Menu className="h-6 w-6" />
              </Button>
              <div className="text-center">
                <div className="text-sm font-medium">FRENTE PARLAMENTAR DA</div>
                <div className="text-2xl font-bold">AGROPECUÁRIA</div>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                <span className="font-medium">AO VIVO</span>
              </div>
              {/* <Link href="/admin">
                <Button
                  variant="outline"
                  className="text-white border-white hover:bg-white hover:text-[#419672] bg-transparent"
                >
                  LOGIN
                </Button>
              </Link> */}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative h-[600px] overflow-hidden">
        {/* Todas as imagens empilhadas com opacidade controlada */}
        {banners.map((banner, index) => (
          <img
            key={banner.id}
            src={banner.imageUrl}
            alt={banner.text}
            className={`
        absolute inset-0 w-full h-full object-cover transition-opacity duration-700
        ${index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"}
      `}
          />
        ))}

        {/* Overlay escuro */}
        <div className="absolute inset-0 bg-black opacity-50 z-20" />

        {/* Texto acima das imagens */}
        <div className="relative z-30 flex items-center justify-center h-full text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold max-w-4xl leading-tight">
            {banners[currentSlide]?.text}
          </h1>
        </div>

        {/* Navegação */}
        <button
          onClick={prevSlide}
          className="cursor-pointer hover:scale-105 absolute left-4 top-1/2 transform -translate-y-1/2 z-40 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all"
        >
          <ChevronLeft className="h-6 w-6" />
        </button>
        <button
          onClick={nextSlide}
          className="cursor-pointer hover:scale-105 absolute right-4 top-1/2 transform -translate-y-1/2 z-40 bg-black bg-opacity-30 hover:bg-opacity-50 text-white p-2 rounded-full transition-all"
        >
          <ChevronRight className="h-6 w-6" />
        </button>
      </section>

      {/* News Articles */}
      <section className="py-8 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {posts.map((article, index) => (
              <article
                key={index}
                className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={article.thumbnailUrl || "/placeholder.svg"}
                    alt={article.postTitle}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-[#419672] text-white px-3 py-1 rounded text-sm font-medium">
                      {article.postCategory.name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 leading-tight">{article.postTitle}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{article.summary.slice(0, 100)}...</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content Section with Recent News (75%) and Sidebar (25%) */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-8">
            {/* Recent News - 75% width */}
            <div className="flex-1 w-3/4">
              <h2 className="text-3xl font-bold text-[#419672] mb-8">Mais Recentes</h2>

              {/* Featured Article */}
              {posts[0] && (
                <article className="mb-8">
                  <div className="relative mb-4">
                    <img
                      src={posts[0].thumbnailUrl || "/placeholder.svg"}
                      alt={posts[0].postTitle}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{posts[0].postTitle}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span>{new Date(posts[0].createdAt).toLocaleDateString('pt-BR')}</span>
                    <span className="mx-2">|</span>
                    <span className="border p-2 border-gray-400 rounded-xl">{posts[0].postCategory.name}</span>
                    <span className="mx-2">|</span>
                    <span>{`${posts[0].postAuthor.firstName} ${posts[0].postAuthor.lastName}`}</span>
                  </div>
                </article>
              )}

              {/* Recent Articles List */}
              <div className="space-y-6">
                {posts.slice(1).map((post) => (
                  <article key={post.id} className="flex items-start gap-4 pb-6 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-[#419672] uppercase tracking-wide">
                          {post.postCategory.name}
                        </span>
                        <Button variant="ghost" size="sm" className="p-0 h-auto text-gray-400 hover:text-gray-600">
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 leading-tight">{post.postTitle}</h3>
                      {post.description && (
                        <p className="text-sm text-gray-600 leading-relaxed">{post.description}</p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {/* Sidebar - 25% width */}
            <aside className="w-1/4 space-y-8">
              {/* Newsletter Signup */}
              <div className="bg-[#419672] text-white p-6 rounded-lg">
                <h3 className="text-xl font-bold text-center mb-2">Cadastre-se em nossa Newsletter</h3>
                <p className="text-sm text-center mb-6 opacity-90">
                  Cadastre-se agora e seja o primeiro a saber sobre nossas notícias.
                </p>

                <form onSubmit={handleNewsletterSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Seu nome:</label>
                    <Input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-white text-gray-900"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">Seu melhor email:</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-white text-gray-900"
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-[#154B2B] hover:bg-[#012D1C] text-white font-medium py-2">
                    📧 Inscrever
                  </Button>
                </form>
              </div>

              {/* Webstories */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Webstories</h3>
                <div className="flex gap-2 mb-4">
                  {webstories?.map((story) => (
                    <div key={story.id} className="relative">
                      <div className="w-[140px] h-[300px] rounded-md overflow-hidden border-2 border-[#419672]">
                        {/* <img
                          src={story.coverImageUrl || "/placeholder.svg"}
                          alt={story.title}
                          className="w-full h-full object-cover"
                        /> */}
                        <video className="h-full w-full object-cover" controls src={story.videoUrl}></video>
                      </div>
                      <div className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs px-1 rounded">
                        {new Date(story.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  ))}
                  <Button
                    variant="ghost"
                    className="w-16 h-16 rounded-full border-2 border-dashed border-gray-300 text-gray-400 hover:border-[#419672] hover:text-[#419672]"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </div>

                {/* <Button className="w-full bg-orange-400 hover:bg-orange-500 text-white font-medium">
                  COLOCAR A REVISTA
                </Button> */}
              </div>
            </aside>
          </div>
        </div>
      </section>

      {/* Highlighted Categories Section */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Política Agrícola Column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#B8860B] mb-6">Política Agrícola</h2>

              {/* Featured Article */}
              <article className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative">
                  <img
                    src="/agricultural-worker-in-field.png"
                    alt="Incentivo ao desenvolvimento e à produção de biocombustíveis"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <h3 className="text-white font-bold text-lg p-4 leading-tight">
                      Incentivo ao desenvolvimento e à produção de biocombustíveis é aprovado na CAPADR
                    </h3>
                  </div>
                </div>
              </article>

              {/* Recent Articles */}
              <div className="space-y-4">
                <article className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src="/political-meeting.png"
                    alt="Audiência pública"
                    className="w-20 h-15 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">10 de setembro às 10:20</p>
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      Uma audiência pública realizada nesta terça-feira (15), na Comissão de Relações Exteriores (CRE)
                      do Senado Federal, discutiu os possíveis caminhos...
                    </h4>
                  </div>
                </article>

                <article className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src="/agricultural-policy-discussion.png"
                    alt="Audiência pública"
                    className="w-20 h-15 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">10 de setembro às 10:20</p>
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      Uma audiência pública realizada nesta terça-feira (15), na Comissão de Relações Exteriores (CRE)
                      do Senado Federal, discutiu os possíveis caminhos...
                    </h4>
                  </div>
                </article>
              </div>
            </div>

            {/* Internacional Column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#419672] mb-6">Internacional</h2>

              {/* Featured Article */}
              <article className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative">
                  <img
                    src="/international-political-meeting-with-flags.png"
                    alt="Incentivo ao desenvolvimento e à produção de biocombustíveis"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <h3 className="text-white font-bold text-lg p-4 leading-tight">
                      Incentivo ao desenvolvimento e à produção de biocombustíveis é aprovado na CAPADR
                    </h3>
                  </div>
                </div>
              </article>

              {/* Recent Articles */}
              <div className="space-y-4">
                <article className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src="/international-conference.png"
                    alt="Audiência pública"
                    className="w-20 h-15 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">10 de setembro às 10:20</p>
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      Uma audiência pública realizada nesta terça-feira (15), na Comissão de Relações Exteriores (CRE)
                      do Senado Federal, discutiu os possíveis caminhos...
                    </h4>
                  </div>
                </article>

                <article className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src="/international-trade-meeting.png"
                    alt="Audiência pública"
                    className="w-20 h-15 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">10 de setembro às 10:20</p>
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      Uma audiência pública realizada nesta terça-feira (15), na Comissão de Relações Exteriores (CRE)
                      do Senado Federal, discutiu os possíveis caminhos...
                    </h4>
                  </div>
                </article>
              </div>
            </div>

            {/* Economia Column */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-[#DC2626] mb-6">Economia</h2>

              {/* Featured Article */}
              <article className="bg-white rounded-lg overflow-hidden shadow-md">
                <div className="relative">
                  <img
                    src="/economic-conference-with-international-flags.png"
                    alt="Incentivo ao desenvolvimento e à produção de biocombustíveis"
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-end">
                    <h3 className="text-white font-bold text-lg p-4 leading-tight">
                      Incentivo ao desenvolvimento e à produção de biocombustíveis é aprovado na CAPADR
                    </h3>
                  </div>
                </div>
              </article>

              {/* Recent Articles */}
              <div className="space-y-4">
                <article className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src="/economic-meeting.png"
                    alt="Audiência pública"
                    className="w-20 h-15 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">10 de setembro às 10:20</p>
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      Uma audiência pública realizada nesta terça-feira (15), na Comissão de Relações Exteriores (CRE)
                      do Senado Federal, discutiu os possíveis caminhos...
                    </h4>
                  </div>
                </article>

                <article className="flex gap-3 bg-white p-4 rounded-lg shadow-sm">
                  <img
                    src="/economic-policy-discussion.png"
                    alt="Audiência pública"
                    className="w-20 h-15 object-cover rounded flex-shrink-0"
                  />
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 mb-1">10 de setembro às 10:20</p>
                    <h4 className="text-sm font-medium text-gray-900 leading-tight">
                      Uma audiência pública realizada nesta terça-feira (15), na Comissão de Relações Exteriores (CRE)
                      do Senado Federal, discutiu os possíveis caminhos...
                    </h4>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Fato em Foco */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#15803D]">Fato em Foco</h2>
                <p className="text-gray-600">Acompanhe nossas notícias em 1 minuto</p>
              </div>
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={0}
              slidesPerView={6}
              navigation
              breakpoints={{
                640: { slidesPerView: 2.5 },
                768: { slidesPerView: 3.5 },
                1024: { slidesPerView: 4.5 },
              }}
              className="!pb-6"
            >
              {relevants.map((post) => (
                <SwiperSlide key={post.id}>
                  <div className="relative rounded-xl w-[180px] h-[320px] overflow-hidden bg-black">
                    <video
                      className="w-full h-full object-cover"
                      poster={post.coverImageUrl}
                      src={post.videoUrl}
                      controls
                    />

                    <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded">
                      1 min
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>

      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          {/* Fato em Foco */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold text-[#15803D]">Webstories</h2>
                <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
              </div>
            </div>
            <Swiper
              modules={[Navigation]}
              spaceBetween={0}
              slidesPerView={6}
              navigation
              breakpoints={{
                1024: { slidesPerView: 8 },
              }}
              className="!pb-6"
            >
              {webstories.map((story) => (
                <SwiperSlide key={story.id}>
                  <div className="relative rounded-xl w-[180px] h-[320px] overflow-hidden bg-black">
                    <video
                      className="w-full h-full object-cover"
                      poster={story.coverImageUrl}
                      src={story.videoUrl}
                      controls
                    />

                    <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded">
                      {new Date(story.updatedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  )
}
