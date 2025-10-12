import { useState, useEffect } from "react"

type LazyYouTubeProps = {
  embedHtml: string
  title?: string
}

export function LazyYouTube({ embedHtml, title }: LazyYouTubeProps) {
  const [visible, setVisible] = useState(false)
  const [ref, setRef] = useState<HTMLDivElement | null>(null)

  // Observe when the element becomes visible
  useEffect(() => {
    if (!ref) return
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 }
    )
    observer.observe(ref)
    return () => observer.disconnect()
  }, [ref])

  return (
    <div
      ref={setRef}
    >
      {!visible ? (
        // Skeleton placeholder before the video loads
        <div className="animate-pulse w-full h-full bg-gray-300 dark:bg-gray-700" />
      ) : (
        // When visible, render the YouTube iframe (privacy-enhanced)
        <div
          className="video-wrapper"
          dangerouslySetInnerHTML={{
            __html: embedHtml.replace(
              "www.youtube.com",
              "www.youtube-nocookie.com"
            ),
          }}
          aria-label={title || "YouTube video"}
        />
      )}
    </div>
  )
}