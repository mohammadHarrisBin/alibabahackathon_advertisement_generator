// app/page.jsx
"use client"; // Required for client-side components

import React, { useState } from "react";
import { uploadToOSS } from "../actions";
// import { uploadToOSS } from "../actions/uploadToOSS";

export default function UploadImage({imageUrl, setImageUrl}) {
//   const [imageUrl, setImageUrl] = useState(null); // Track the uploaded image URL
  const [loading, setLoading] = useState(false); // Track loading state

  const handleFileUpload = async (event) => {
    event.preventDefault();
    setLoading(true);

    const formData = new FormData(event.target);
    const response = await uploadToOSS(formData);

    if (response.success) {
      setImageUrl(response.url); // Save the OSS URL
    } else {
      alert(`Error uploading file: ${response.error}`);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <h1 className="text-2xl font-bold">Upload an Image to OSS</h1>

      {/* File Upload Form */}
      <form onSubmit={handleFileUpload} className="mt-4">
        <input type="file" name="file" accept="image/*" required />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded-md ml-2"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>
      </form>

      {/* Display Uploaded Image */}
      {imageUrl && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold">Uploaded Image:</h2>
          <img src={imageUrl} alt="Uploaded" className="max-w-full h-auto mt-2" />
        </div>
      )}
    </div>
  );
}