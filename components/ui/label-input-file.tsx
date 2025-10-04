import { useEffect, useState } from "react"
import { UploadCloud, X } from "lucide-react"

interface LabelInputFileProps {
  id: string
  label: string
  accept: string
  onChange: (file: File | null) => void
}

export function LabelInputFile({ id, label, accept, onChange }: LabelInputFileProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const isImage = accept.includes("image")
  const isVideo = accept.includes("video")

  useEffect(() => {
    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setPreviewUrl(url)
      return () => URL.revokeObjectURL(url)
    } else {
      setPreviewUrl(null)
    }
  }, [selectedFile])

  const handleChange = (file: File | null) => {
    setSelectedFile(file)
    onChange(file)
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={id}
        className="flex items-center gap-2 cursor-pointer rounded-md border border-dashed border-gray-300 px-4 py-3 hover:border-gray-400 transition-colors"
      >
        <UploadCloud className="w-5 h-5 text-gray-500" />
        <span className="text-sm text-gray-700">{label}</span>
      </label>

      <input
        id={id}
        type="file"
        accept={accept}
        onChange={(e) => handleChange(e.target.files?.[0] || null)}
        className="hidden"
      />

      {previewUrl && (
        <div className="relative group">
          {isImage && (
            <img
              src={previewUrl}
              alt="preview"
              className="w-full max-h-48 object-contain rounded border"
            />
          )}
          {isVideo && (
            <video
              src={previewUrl}
              controls
              className="w-full max-h-48 object-contain rounded border"
            />
          )}
          <button
            onClick={() => handleChange(null)}
            className="cursor-pointer absolute top-1 right-1 p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-80"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  )
}