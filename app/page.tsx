"use client"
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Menu, Search, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useContentStore } from "@/lib/content-store"
import Footer from '@/components/ui/footer'
import { getRecentTweets } from '@/services/twitter'
import { VideoSlider } from '@/components/ui/video-home'
import ColunistasSection from '@/components/ui/colunas'
import { ContentSlider } from '@/components/ui/content-slider'
import Link from 'next/link'

export default function Home() {
  const ref = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('async', 'true');
    ref.current?.appendChild(script);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0)
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")

  const {
    fetchBanners, banners, webstories,
    fetchWebStories, fetchPosts, posts,
    fetchRelevants, relevants, fetchPostsFeatured,
    postsFeature, fetchVideos, videos, fetchMostViewed, mostViewed
  } = useContentStore()

  const newsNoFeatured = posts.filter(post => !post.isFeatured)
  const [tweets, setTweets] = useState();

  useEffect(() => {
    fetchBanners()
    fetchWebStories()
    fetchPosts()
    fetchRelevants()
    fetchPostsFeatured()
    fetchTweets()
    fetchVideos()
    fetchMostViewed()
  }, []);

  async function fetchTweets() {
    try {
      const tweets = await getRecentTweets("fpagroupecuaria")
      console.log(tweets)
      setTweets(tweets)
    } catch (error) {
      console.error("Error fetching tweets:", error)
    }
  }

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
            {postsFeature.map((article, index) => (
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
                    <span style={{ backgroundColor: article.postCategory.color }} className={`text-white px-3 py-1 rounded text-sm font-medium`}>
                      {article.postCategory.name}
                    </span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-3 text-gray-900 leading-tight">{article.postTitle}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{article.summary?.slice(0, 100)}...</p>
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
              {newsNoFeatured[0] && (
                <article className="mb-8">
                  <div className="relative mb-4">
                    <img
                      src={newsNoFeatured[0].thumbnailUrl || "/placeholder.svg"}
                      alt={newsNoFeatured[0].postTitle}
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{newsNoFeatured[0].postTitle}</h3>
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <span>{new Date(newsNoFeatured[0].createdAt).toLocaleDateString('pt-BR')}</span>
                    <span className="mx-2">|</span>
                    <span className="border p-2 border-gray-400 rounded-xl">{newsNoFeatured[0].postCategory.name}</span>
                    <span className="mx-2">|</span>
                    <span>{`${newsNoFeatured[0].postAuthor.firstName} ${newsNoFeatured[0].postAuthor.lastName}`}</span>
                  </div>
                </article>
              )}

              {/* Recent Articles List */}
              <div className="space-y-6">
                {newsNoFeatured.slice(1).map((post) => (
                  <article key={post.id} className="flex items-start gap-4 pb-6 border-b border-gray-200">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-xs font-medium text-[${post.postCategory.color}] uppercase tracking-wide`}>
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
            <VideoSlider perView={5} videos={relevants} width={200} height={300} />
          </div>
        </div>
      </section>

      <section className="px-4 bg-gray-50">
        <div className="grid">
          <div className="grid-cols-9">
            <div className="max-w-7xl mx-auto py-12 ">
              {/* Mais lidas */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-[#15803D]">Mais lidas</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                  </div>
                </div>
                {mostViewed.length > 0 && (
                  <ContentSlider perView={4}>
                    {mostViewed.map((post) => (
                      <Link
                        key={post.id}
                        href={`/noticia/${post.slug}`}
                        className="block rounded-xl overflow-hidden bg-white shadow-md transition hover:shadow-lg"
                      >
                        <div className="w-full h-48 overflow-hidden">
                          <img
                            src={post.thumbnailUrl || '/placeholder.jpg'}
                            alt={post.postTitle}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-4">
                          <p className="text-sm text-gray-500">
                            {new Date(post.updatedAt).toLocaleDateString('pt-BR')}
                          </p>
                          <h3 className="text-md font-semibold text-gray-800 mt-1 line-clamp-2">
                            {post.postTitle}
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </ContentSlider>
                )}
              </div>
            </div>
            <div className="max-w-7xl mx-auto py-12 ">
              {/* Videos */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-[#15803D]">Vídeos</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                  </div>
                </div>
                <VideoSlider videos={videos} />
              </div>
            </div>
            <div className="max-w-7xl mx-auto py-12 ">
              {/* Webstories */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-bold text-[#15803D]">Webstories</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                  </div>
                </div>
                <VideoSlider perView={4} videos={webstories} width={200} height={300} />
              </div>
            </div>
            < ColunistasSection />
          </div>
          <div className="grid-cols-3">
            <div ref={ref}>
              <a
                className="twitter-timeline"
                data-height="600"
                data-theme="light"
                data-chrome="nofooter noheader"
                href="https://twitter.com/FPAgropecuaria?ref_src=twsrc%5Etfw"
              >
                Tweets by FPAgropecuaria
              </a>
            </div>
          </div>
        </div>

      </section>
      <Footer />
    </div>
  )
}
