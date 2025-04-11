"use client"
import React from "react"
import { useState, useRef } from "react"
import { uploadToOSS } from "../actions"
import { Camera, Upload, X, Maximize2, Minimize2 } from "lucide-react"
import Image from "next/image"

export default function UploadImage({ imageUrl, setImageUrl, hasAnalysis = false }) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileChange = async (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      await handleFileUpload(files[0])
    }
  }

  const handleFileUpload = async (file) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file")
      return
    }

    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)
      const result = await uploadToOSS(formData)

      if (result.success) {
        setImageUrl(result.url)
      } else {
        setError(result.error || "Failed to upload image")
      }
    } catch (error) {
      console.error("Upload error:", error)
      setError("An error occurred during upload")
    } finally {
      setIsUploading(false)
    }
  }

  const clearImage = () => {
    setImageUrl(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div className="">
      
      {!imageUrl ? (
        <div
          className={`w-[500px] h-[350px] flex items-center justify-center border-2 border-dashed rounded-lg p-8 text-center ${
            isDragging ? "border-emerald-500 bg-emerald-50" : "border-gray-300"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="p-3 rounded-full bg-emerald-100">
              <Camera className="h-8 w-8 text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-medium">Drag and drop your food image here</p>
              <p className="text-sm text-muted-foreground mt-1">or click to browse from your device</p>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="px-4 py-2 bg-emerald-600 text-white rounded-md cursor-pointer hover:bg-emerald-700 transition-colors flex items-center"
            >
              <Upload className="h-4 w-4 mr-2" />
              {isUploading ? "Uploading..." : "Upload Image"}
            </label>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
          </div>
        </div>
      ) : (
        <div className={`relative rounded-lg overflow-hidden border border-gray-200 transition-all duration-300 ${
          hasAnalysis && !isExpanded ? "w-[500px] h-[50px]" : "w-[500px] h-[350px]"
        }`}>
          <div className="relative w-full h-full">
            <Image 
              src={imageUrl || "/placeholder.svg"} 
              fill
              alt="Uploaded food" 
              className="object-cover cursor-pointer"
              onClick={toggleExpand}
            />
          </div>
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={toggleExpand}
              className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
              aria-label={isExpanded ? "Minimize image" : "Expand image"}
            >
              {isExpanded ? (
                <Minimize2 className="h-5 w-5" />
              ) : (
                <Maximize2 className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={clearImage}
              className="p-1 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 transition-colors"
              aria-label="Remove image"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}