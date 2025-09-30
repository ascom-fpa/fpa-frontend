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
import WebstoriesCarousel from '@/components/ui/webstory-carousel'
import FatoEmFocoSkeleton from '@/components/skeletons/fato-em-foco-skeleton'
import PostsCategorySectionSkeleton from '@/components/skeletons/post-category-featured-skeleton'
import MostViewedSkeleton from '@/components/skeletons/most-viewed-skeleton'
import VideosSkeleton from '@/components/skeletons/videos-skeleton'
import TwitterInstagramSkeleton from '@/components/skeletons/twitter-instagram-skeleton'
import WebstoriesCarouselSkeleton from '@/components/skeletons/webstory-skeleton'
import Newsletter from '@/components/newsletter'

export default function Home() {
  const ref = useRef<any>(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.setAttribute('src', 'https://platform.twitter.com/widgets.js');
    script.setAttribute('async', 'true');
    ref.current?.appendChild(script);
  }, []);

  const [pautaImage, setPautaImage] = useState('');
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sliderRef = useRef<HTMLDivElement>(null)

  const {
    fetchBanners, banners, webstories,
    fetchWebStories, fetchRelevants, relevants, fetchPostsFeatured,
    postsFeature, fetchVideos, videos, fetchMostViewed,
    fetchPostsCategoryFeatured, postsCategoryFeatured,
    fetchPosts, fetchMagazineUrl, magazineUrl
  } = useContentStore()

  const [tweets, setTweets] = useState();

  useEffect(() => {
    fetchBanners()
    fetchWebStories()
    fetchRelevants()
    fetchPostsFeatured()
    fetchTweets()
    fetchVideos()
    fetchMostViewed()
    fetchPostsCategoryFeatured()
    fetchPosts()
  }, []);

  useEffect(() => {
    fetchPauta()
    fetchMagazineUrl()
  }, []);

  async function fetchPauta() {
    getPauta()
      .then(res => setPautaImage(res.imageUrl!))
  }

  async function fetchTweets() {
    try {
      const tweets = await getRecentTweets("fpagroupecuaria")
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
          <h1 className="text-3xl md:text-6xl font-bold max-w-4xl leading-tight">
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

      {/* Highlighted Categories Section */}
      {
        postsCategoryFeatured?.categories?.length > 0
          ? <section className="my-12">
            <div className="max-w-[1300px] mx-auto bg-white rounded-2xl shadow-md p-4">
              <div className="grid md:grid-cols-3 gap-12">

                {postsCategoryFeatured.categories.map(postCategory => <div className="space-y-6">
                  <h2 style={{ color: postCategory?.color }} className={`text-3xl font-bold mb-6 capitalize cursor-pointer transition-all hover:scale-105`}>{postCategory?.name}</h2>

                  {/* Featured Article */}
                  {/* <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${postCategory.slug}`}> */}
                  <Link className='' href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${postsCategoryFeatured?.postsByCategory[postCategory?.id][0]?.id}`}>
                    <article className="bg-white rounded-2xl overflow-hidden shadow-md flex self-center cursor-pointer transition-all hover:scale-105 w-fit">
                      <div className="relative max-w-[460px]">
                        <img
                          src={postsCategoryFeatured?.postsByCategory[postCategory.id][0]?.thumbnailUrl}
                          alt="Incentivo ao desenvolvimento e à produção de biocombustíveis"
                          className="h-[320px] max-w-[400px] object-cover"
                        />
                        <div className="absolute inset-0 bg-black opacity-50 flex items-end">
                        </div>
                        <h3 className="absolute bottom-0 text-white font-semibold text-xl p-8 leading-tight">
                          {postsCategoryFeatured?.postsByCategory[postCategory.id][0]?.postTitle}
                        </h3>
                      </div>
                    </article>
                  </Link>

                  {/* Recent Articles */}
                  <div className="space-y-8">
                    {
                      postsCategoryFeatured?.postsByCategory && postsCategoryFeatured?.postsByCategory[postCategory.id].slice(1).map(post => <>
                        <hr className='mt-6' />
                        <Link href={`${process.env.NEXT_PUBLIC_FRONT_URL}/noticia/${post.id}`}>
                          <article className={`flex gap-4 items-start cursor-pointer transition-all hover:scale-105`}>
                            <img
                              src={post.thumbnailUrl}
                              alt="Audiência pública"
                              className="w-[180px] h-[120px] object-cover rounded-2xl flex-shrink-0 md:block hidden"
                            />
                            <div className="flex-1 max-w-[282px]">
                              <p className="text-xs text-gray-500 mb-1">{new Date(post.createdAt).toLocaleDateString('pt-BR')}&nbsp;{new Date(post.createdAt).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                              <h4 className="text-sm  text-gray-900 leading-tight">{post.postTitle}</h4>
                            </div>
                          </article>
                        </Link>
                      </>
                      )
                    }
                  </div>

                  <Link style={{ color: postCategory.color }} className='flex gap-2' href={`${process.env.NEXT_PUBLIC_FRONT_URL}/categoria/${postCategory.id}`}>
                    <span>Ver mais em {postCategory.name}</span>
                    <ArrowRight className='w-4' />
                  </Link>
                </div>
                )}

              </div>
            </div>
          </section> :
          <PostsCategorySectionSkeleton />
      }

      {relevants.length === 0 ? (
        <FatoEmFocoSkeleton />
      ) : <section id='fato-em-foco' className="py-12 px-4">
        <div className="max-w-[1300px] mx-auto bg-white 2xl:p-8 p-4 rounded-2xl shadow-md">
          {/* Minuto FPA */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-3xl font-bold text-[#1C9658]">Minuto FPA</h2>
                <p className="text-gray-600">Acompanhe nossas notícias em 1 minuto</p>
              </div>
            </div>
            <ContentSlider perView={4}>
              {relevants.map((video) => (
                <div onClick={() => {
                  const videoElement = document.getElementById(`video-${video.id}`);
                  if (videoElement?.requestFullscreen) {
                    videoElement.requestFullscreen();
                  }
                }} className={`cursor-pointer`} key={video.id}>
                  <div className="relative rounded-xl mx-auto overflow-hidden bg-black">
                    <video id={`video-${video.id}`} className="w-full h-full object-cover" src={video.videoUrl || ""} controls />
                    <div className="absolute top-2 left-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded">
                      {new Date(video.updatedAt).toLocaleDateString('pt-BR')}
                    </div>
                  </div>
                  {/* <span className='text-black capitalize'>{video.description}</span> */}
                </div>
              ))}
              {/* <VideoSlider perView={7} videos={relevants} width={200} height={300} /> */}
            </ContentSlider>
          </div>
        </div>
      </section>
      }
      <section id='mais-lidas' className="px-4 bg-gray-50 max-w-[1300px] mx-auto ">
        <div className="flex gap-10 lg:flex-nowrap flex-wrap lg:flex-row flex-col-reverse">
          <div className="w-full lg:w-9/12">
            <ColunistasSection />
            {videos.length === 0
              ? <VideosSkeleton />
              : <div className="my-12 bg-white rounded-2xl shadow-md p-4" id='videos'>
                {/* Videos */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h2 className="text-3xl font-bold text-[#1C9658]">Vídeos</h2>
                      <p className="text-gray-600">As matérias mais lidas em nosos portal</p>
                    </div>
                  </div>
                  <ContentSlider perView={1}>
                    {
                      videos.map(video => <div className='rounded-2xl video-wrapper' dangerouslySetInnerHTML={{ __html: video.embed }}></div>)
                    }
                  </ContentSlider>
                  {/* <VideoSlider id="videos" perView={4} videos={videos} /> */}
                </div>
              </div>}
            {webstories.length == 0
              ? <WebstoriesCarouselSkeleton />
              : <WebstoriesCarousel webstories={webstories} />}
          </div>
          <div>
            {/* Newsletter Signup */}
            <Newsletter />

            {magazineUrl
              ? <div className='relative'>
                <div className="absolute z-20 border-[14px] top-0 left-0 w-full bg-transparent border-white h-[460px]"></div>
                <iframe
                  src={`https://docs.google.com/gview?url=${encodeURIComponent(magazineUrl)}&embedded=true`}
                  className='h-[400px] w-full'
                  frameBorder={0}
                />
              </div>
              : <div className="w-full h-[460px] bg-gray-200 animate-pulse rounded-md" />
            }
            <div className="relative flex justify-center">
              {pautaImage ? <img className='overflow-hidden rounded-2xl lg:w-auto w-full' src={pautaImage} width={435} height={518} /> : <div className="overflow-hidden rounded-2xl lg:w-auto w-full h-[518px] bg-gray-200 animate-pulse" style={{ maxWidth: 435 }} />}
              <Button className='absolute bottom-20 lg:text-2xl p-2 w-5/6 h-fit whitespace-pre-wrap break-words'>
                {/* <Link href="https://share.hsforms.com/1HpOPSDwVScyoniT6RSACHAs0gbx" target='_blank'>Clique aqui para se cadastrar</Link> */}
                <Link href="https://fpagropecuaria.org.br/credenciamento-fpa/" target='_blank'>Clique aqui para se cadastrar</Link>
              </Button>
            </div>
          </div>
        </div>

      </section>
      <Footer />
      <ToastContainer position="top-right" autoClose={false} />
    </div>
  )
}
