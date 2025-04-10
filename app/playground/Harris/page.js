"use client";
import React, { useState } from "react";
import { connectionToMuhammadAli } from "./actions";
import UploadImage from "./components/upload-image";

function page() {
  const [analysis, setAnalysis] = useState(null);
  const [imageUrl, setImageUrl] = useState(null); // Track the uploaded image URL

  const handleAnalysis = async () => {
    const sickness = ["high blood pressure", "gout"];
    const ali_analysis = await connectionToMuhammadAli(sickness, imageUrl);

    setAnalysis(ali_analysis);
  };

  return (
    // step 1 : analyse video
    <div className="flex mt-6 ">
      {/* chat history */}
      <div className="mt-6 mr-3">
        <div>Diet History</div>
        <div className="bg-white text-black p-2 rounded-md mt-2 hover:bg-gray-200 hover:cursor-pointer">
          <p>21/01/2024 - Food Diary</p>
        </div>
      </div>

      <UploadImage imageUrl={imageUrl} setImageUrl={setImageUrl} />

      {/* main content */}
      {imageUrl && (
        <div>
          <button
            className="bg-red-300 p-10 hover:cursor-pointer"
            onClick={handleAnalysis}
          >
            Test
          </button>
          <div>{JSON.stringify(analysis)}</div>
        </div>
      )}
    </div>
  );
}

export default page;
