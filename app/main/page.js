"use client";
import React, { useEffect, useState } from "react";
import { connectionToMuhammadAli } from "./actions";
import UploadImage from "./components/upload-image";
import NutritionCard from "./components/nutrition-card";
import {
  Leaf,
  Pizza,
  AlertTriangle,
  Check,
  Info,
  ThumbsDown,
  Settings,
  X,
  BookCheckIcon,
} from "lucide-react";
import { FoodPromptBox } from "./components/prompbox";
import FoodTrackerJournal from "./components/journal-booklet";

function Page() {
  const [analysis, setAnalysis] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showJournal, setShowJournal] = useState(false);
  const [selectedIllnesses, setSelectedIllnesses] = useState([
    "high blood pressure",
    "gout",
  ]);
  const [customIllness, setCustomIllness] = useState("");
  const [journalData, setJournalData] = useState([]);

  const illnesses = [
    "high blood pressure",
    "gout",
    "diabetes",
    "heart disease",
    "obesity",
    "kidney disease",
  ];

  const handleAnalysis = async (prompt = "") => {
    if (!imageUrl) return;

    setIsLoading(true);
    try {
      const ali_analysis = await connectionToMuhammadAli(
        selectedIllnesses,
        imageUrl,
        prompt
      );
      setAnalysis(ali_analysis);
    } catch (error) {
      console.error("Analysis failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleIllness = (illness) => {
    setSelectedIllnesses((prev) =>
      prev.includes(illness)
        ? prev.filter((i) => i !== illness)
        : [...prev, illness]
    );
  };

  const addCustomIllness = () => {
    if (customIllness.trim() && !selectedIllnesses.includes(customIllness)) {
      setSelectedIllnesses((prev) => [...prev, customIllness]);
      setCustomIllness("");
    }
  };

  useEffect(() => {
    if (imageUrl) {
      handleAnalysis();
    }
  }, [imageUrl]);

  return (
    <div className="flex justify-center">
      {/* Main Content */}
      <div className="flex flex-col mt-6 justify-center items-center">
        <UploadImage
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
          hasAnalysis={!!analysis}
        />

        {isLoading ? (
          <div className="mt-10 flex flex-col items-center space-y-4">
            <div className="relative w-10 h-10">
              <div className="absolute inset-0 rounded-full border-4 border-emerald-200 animate-ping"></div>
              <div className="absolute inset-2 rounded-full border-4 border-emerald-400 animate-pulse"></div>
              <div className="absolute inset-4 rounded-full border-4 border-emerald-600 animate-spin"></div>
            </div>
            <div className="text-emerald-700 font-medium">
              <span className="animate-pulse inline-block">Analyzing</span>
              <span className="animate-pulse delay-75 inline-block mx-1">
                your
              </span>
              <span className="animate-pulse delay-100 inline-block">meal</span>
              <span className="animate-pulse delay-150 inline-block">...</span>
            </div>
            <div className="flex space-x-2">
              {["🍎", "🥦", "🍗", "🥑", "🍣"].map((emoji, i) => (
                <span
                  key={i}
                  className="text-2xl animate-bounce"
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        ) : imageUrl && analysis ? (
          <>
            <NutritionCard
              analysis={analysis}
              setJournalData={setJournalData}
            />

            {/* <FoodPromptBox onRegenerate={handleAnalysis}/> */}
          </>
        ) : imageUrl ? (
          <button
            onClick={handleAnalysis}
            className="mt-4 px-4 py-2 rounded-md text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
          >
            Analyze Meal
          </button>
        ) : null}
      </div>

      {/* Side Buttons */}
      <div className="flex flex-col ml-4 mt-3 not-dark:text-white">
        {/* Settings Button */}
        <button
          onClick={() => {
            setShowSettings(!showSettings);
            setShowJournal(false);
          }}
          className="bg-emerald-600 p-3 rounded-2xl mt-4 hover:cursor-pointer hover:bg-gray-300 hover:text-emerald-600 transition-colors"
        >
          <Settings size={20} />
        </button>

        {/* Journal Button */}
        <button
          onClick={() => {
            setShowJournal(!showJournal);
            setShowSettings(false);
          }}
          className="bg-blue-600 p-3 rounded-2xl mt-4 hover:cursor-pointer hover:bg-gray-300 hover:text-blue-600 transition-colors"
        >
          <BookCheckIcon size={20} />
        </button>

        {/* Settings Overlay */}
        {showSettings && (
          <div className="absolute mt-20 w-64 bg-black rounded-lg shadow-xl border border-gray-200 p-4 z-10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Health Conditions</h3>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-3">
              {illnesses.map((illness) => (
                <label key={illness} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={selectedIllnesses.includes(illness)}
                    onChange={() => toggleIllness(illness)}
                    className="rounded text-emerald-600"
                  />
                  <span className="capitalize">{illness}</span>
                </label>
              ))}

              <div className="pt-2">
                <div className="flex">
                  <input
                    type="text"
                    value={customIllness}
                    onChange={(e) => setCustomIllness(e.target.value)}
                    placeholder="Add custom condition"
                    className="flex-1 px-2 py-1 text-sm border rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <button
                    onClick={addCustomIllness}
                    className="px-2 py-1 bg-emerald-600 text-white rounded-r-md hover:bg-emerald-700"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="pt-2">
                <h4 className="text-sm font-medium mb-1">
                  Selected Conditions:
                </h4>
                {selectedIllnesses.length > 0 ? (
                  <div className="flex flex-wrap gap-1">
                    {selectedIllnesses.map((illness) => (
                      <span
                        key={illness}
                        className="px-2 py-1 text-xs bg-emerald-100 text-emerald-800 rounded-full capitalize"
                      >
                        {illness}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-gray-500">
                    No conditions selected
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Journal Overlay */}
        {showJournal && (
          <div className=" absolute top-[-320]  mt-100 bg-[#0A0A0A] not-dark:bg-white bg-opacity-50 flex items-center justify-center z-50 ">
            <div className="w-full max-w-2xl bg-black not-dark:bg-white rounded-lg shadow-xl border border-gray-200 p-4">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl not-dark:text-black">Food Journal</h3>
                <button
                  onClick={() => setShowJournal(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <FoodTrackerJournal journalData={journalData} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
