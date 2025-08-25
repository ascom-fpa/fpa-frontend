"use client"

import { Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useContentStore } from "@/lib/content-store"

export function Loading() {
    const { loading } = useContentStore()

    return (
        <AnimatePresence>
            {loading && (
                <motion.div
                    className="fixed inset-0 z-[9999] flex items-center justify-center backdrop-opacity-100 backdrop-blur-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <Loader2 className="h-10 w-10 animate-spin text-black" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}