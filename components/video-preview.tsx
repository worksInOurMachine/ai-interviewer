"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"

export default function VideoPreview() {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let stream: MediaStream | null = null
    async function start() {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false,
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
        }
      } catch (e) {
        setError("Camera permission denied or unavailable.")
      }
    }
    start()
    return () => {
      if (stream) stream.getTracks().forEach((t) => t.stop())
    }
  }, [])

  if (error) {
    return <div className="flex h-full items-center justify-center p-6 text-center text-muted-foreground">{error}</div>
  }

  return (
    <div className="relative h-full bg-black">
      <motion.video
        ref={videoRef}
        className="h-full w-full object-cover"
        initial={{ opacity: 0.6 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4 }}
        muted
        playsInline
      />
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-md bg-background/70 px-2 py-1 text-xs text-foreground">
        Live
      </div>
    </div>
  )
}
