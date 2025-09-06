"use client"
import 'swiper/css'
import 'swiper/css/navigation'

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight, Menu, MessageSquare, Search, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useContentStore } from "@/lib/content-store"
import Footer from '@/components/ui/footer'
import { getRecentTweets } from '@/services/twitter'
import { VideoSlider } from '@/components/ui/video-home'
import ColunistasSection from '@/components/ui/colunas'
import { ContentSlider } from '@/components/ui/content-slider'
import Link from 'next/link'
import { ToastContainer } from 'react-toastify'
import Script from 'next/script'
import { getLive, UpdateLiveData } from '@/services/live'
import { getPauta } from '@/services/pauta'
import { showToast } from '@/utils/show-toast'
import RespondeAgroDirect from '@/components/agro'
import PostsFeature from '@/components/posts-feature'
import Header from '@/components/ui/header'
import { getInstagramPosts } from '@/services/instagram'
import InstagramGrid from '@/components/ui/instagram-grid'
import LastNews from '@/components/last-news'

export default function Home() {
  const ref = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('async', 'true');
    ref.current?.appendChild(script);
  }, []);

  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const {
    fetchBanners, banners, webstories,
    fetchWebStories, fetchRelevants, relevants, fetchPostsFeatured,
    postsFeature, fetchVideos, videos, fetchMostViewed, mostViewed,
    fetchPostsCategoryFeatured, postsCategoryFeatured
  } = useContentStore()

  const [tweets, setTweets] = useState();
  const [instagramPosts, setInstagramPosts] = useState([]);

  useEffect(() => {
    fetchBanners()
    fetchWebStories()
    fetchRelevants()
    fetchPostsFeatured()
    fetchTweets()
    fetchVideos()
    fetchMostViewed()
    fetchPostsCategoryFeatured()
    fetchInstagramPosts()
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

  async function fetchInstagramPosts() {
    try {
      const instagramPosts = await getInstagramPosts()
      console.log(instagramPosts)
      setInstagramPosts(instagramPosts)
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

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: 0.4, // 40% visível
      }
    )

    if (sliderRef.current) {
      observer.observe(sliderRef.current)
    }

    return () => {
      if (sliderRef.current) {
        observer.unobserve(sliderRef.current)
      }
    }
  }, [])

  // ⏱️ Autoplay
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5000)

    return () => clearInterval(interval)
  }, [isVisible, banners.length])

  return (
    <div className="min-h-screen bg-[#F9F9F9]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section ref={sliderRef} className="relative h-[600px] overflow-hidden">
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

      {/* Featured news */}
      <PostsFeature postsFeature={postsFeature} />

      {/* Main Content Section with Recent News (75%) and Sidebar (25%) */}
      <LastNews />

      <hr className='mx-auto max-w-[80vw]' />

      {/* Highlighted Categories Section */}
      <section className="py-12 px-4 ">
        <div className="max-w-[1800px] mx-auto">
          <div className="grid md:grid-cols-3 gap-8">

            {postsCategoryFeatured.categories.map(postCategory => <div className="space-y-6">
              <h2 style={{ color: postCategory?.color }} className={`text-4xl font-semibold mb-6 capitalize cursor-pointer transition-all hover:scale-105`}>{postCategory?.name}</h2>

              {/* Featured Article */}
              {/* <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${postCategory.slug}`}> */}
              <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${postsCategoryFeatured?.postsByCategory[postCategory.id][0].id}`}>
                <article className="bg-white rounded-lg overflow-hidden shadow-md  cursor-pointer transition-all hover:scale-105">
                  <div className="relative">
                    <img
                      src={postsCategoryFeatured?.postsByCategory[postCategory.id][0]?.thumbnailUrl}
                      alt="Incentivo ao desenvolvimento e à produção de biocombustíveis"
                      className="w-full h-[380px] object-cover"
                    />
                    <div className="absolute inset-0 bg-black opacity-50 flex items-end">
                    </div>
                    <h3 className="absolute bottom-0 text-white font-semibold md:text-3xl text-2xl p-8 leading-tight">
                      {postsCategoryFeatured?.postsByCategory[postCategory.id][0]?.postTitle}
                    </h3>
                  </div>
                </article>
              </Link>

              {/* Recent Articles */}
              <div className="space-y-8">
                {
                  postsCategoryFeatured?.postsByCategory && postsCategoryFeatured?.postsByCategory[postCategory.id].slice(1).map(post => <>
                    <hr />
                    <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.id}`}>
                      <article className="flex gap-4 items-center cursor-pointer transition-all hover:scale-105">
                        <img
                          src={post.thumbnailUrl}
                          alt="Audiência pública"
                          className="w-[280px] h-[140px] object-cover rounded flex-shrink-0 md:block hidden"
                        />
                        <div className="flex-1 max-w-[282px]">
                          <p className="text-xs text-gray-500 mb-1">{new Date(post.createdAt).toLocaleDateString('pt-BR')}&nbsp;{new Date(post.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                          <h4 className="text-sm  text-gray-900 leading-tight">{post.summary}</h4>
                        </div>
                      </article>
                    </Link>
                  </>
                  )
                }
              </div>

              <Link style={{ color: postCategory.color }} className='flex gap-2' href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${postCategory.slug}`}>
                <span>Ver mais em {postCategory.name}</span>
                <ArrowRight className='w-4' />
              </Link>
            </div>
            )}

          </div>
        </div>
      </section>

      <section id='fato-em-foco' className="py-12 px-4 bg-white">
        <div className="max-w-[1800px] mx-auto">
          {/* Fato em Foco */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-5xl font-bold text-[#419672]">Fato em Foco</h2>
                <p className="text-gray-600">Acompanhe nossas notícias em 1 minuto</p>
              </div>
            </div>
            <VideoSlider perView={7} videos={relevants} width={200} height={300} />
          </div>
        </div>
      </section>

      <section id='mais-lidas' className="px-4 bg-gray-50 max-w-[1800px] mx-auto ">
        <div className="flex gap-20 lg:flex-nowrap flex-wrap lg:flex-row flex-col-reverse">
          <div className="w-full lg:w-9/12">
            <div className="py-12 ">
              {/* Mais lidas */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-5xl font-bold text-[#419672]">Mais lidas</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                  </div>
                </div>
                {mostViewed.length > 0 && (
                  <ContentSlider perView={4}>
                    {mostViewed.map((post) => (
                      <Link
                        key={post.id}
                        href={`/noticia/${post.id}`}
                        className="block rounded-xl overflow-hidden transition-all hover:translate-y-1 cursor-pointer"
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
                            {new Date(post.updatedAt).toLocaleDateString('pt-BR')} às {new Date(post.updatedAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                          <h3 className="text-md font-medium text-gray-800 mt-1 line-clamp-2">
                            {post.summary} || Lorem ipsum, dolor sit amet consectetur adipisicing elit. Sequi, harum consequuntur earum atque ipsam voluptatem
                          </h3>
                        </div>
                      </Link>
                    ))}
                  </ContentSlider>
                )}
              </div>
            </div>
            <div className="py-12 " id='videos'>
              {/* Videos */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-5xl font-bold text-[#419672]">Vídeos</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                  </div>
                </div>
                <VideoSlider id="videos" perView={4} videos={videos} />
              </div>
            </div>
            <div id='webstories' className="py-12 ">
              {/* Webstories */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-5xl font-bold text-[#419672]">Webstories</h2>
                    <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                  </div>
                </div>
                <VideoSlider perView={6} videos={webstories} width={200} height={300} />
              </div>
            </div>
            <ColunistasSection />
          </div>
          <div className="w-full lg:w-3/12 flex flex-col">
            <InstagramGrid posts={instagramPosts} />
            <Script strategy="afterInteractive">
              {`
           twttr.widgets.createTimeline(
              {
                sourceType: "profile",
              screenName: "TwitterDev"
               },
              document.getElementById("twitter-timeline")
              );
        `}
            </Script>
            <div ref={ref}>
              <a className="twitter-timeline"
                href="https://twitter.com/fpagropecuaria"
                data-width="300"
                data-height="300"
              >
                Tweets by @fpagropecuaria
              </a>
            </div>
          </div>
        </div>

      </section>
      <Footer />
      <ToastContainer position="top-right" autoClose={false} />
    </div>
  )
}
