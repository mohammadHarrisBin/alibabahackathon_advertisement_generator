"use client";
import React, { useState, useRef } from "react";
import { Send, RefreshCw, Edit } from "lucide-react";

export const FoodPromptBox = ({ onRegenerate, onAdjust }) => {
  const [prompt, setPrompt] = useState("");
  const [showAdjustments, setShowAdjustments] = useState(false);
  const [adjustments, setAdjustments] = useState({
    oily: false,
    spicy: false,
    salty: false,
    portionSize: "medium"
  });

  const handleSubmit = async(e) => {
    e.preventDefault();
    if (!prompt.trim()) return;
    await onRegenerate(prompt);
    setPrompt("");
  };

  const handleAdjustSubmit = () => {
    onAdjust(adjustments);
    setShowAdjustments(false);
  };

  return (
    <div className="mt-4 w-full max-w-2xl">
      <form onSubmit={handleSubmit} className="relative">
        
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden bg-black">
         
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Any extra food specifications to add (e.g., oily)..."
            className="flex-1 px-4 py-3 focus:outline-none"
          />
          <div className="flex">
            <button
              type="button"
              onClick={() => setShowAdjustments(!showAdjustments)}
              className="px-3 text-gray-500 hover:text-emerald-600 transition-colors"
              title="Adjust meal properties"
            >
              <Edit size={18} />
            </button>
            <button
              type="submit"
              disabled={!prompt.trim()}
              className="bg-emerald-600 text-white px-4 py-3 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </div>

        {/* Adjustment Panel */}
        {showAdjustments && (
          <div className="absolute bottom-full mb-2 left-0 right-0 border border-gray-200 rounded-lg shadow-lg p-4 z-10 bg-black">
            <h4 className="font-medium mb-3">Adjust Meal Properties</h4>

            <div className="space-y-3">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="oily"
                  checked={adjustments.oily}
                  onChange={() => setAdjustments(prev => ({...prev, oily: !prev.oily}))}
                  className="mr-2"
                />
                <label htmlFor="oily">Less Oily</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="spicy"
                  checked={adjustments.spicy}
                  onChange={() => setAdjustments(prev => ({...prev, spicy: !prev.spicy}))}
                  className="mr-2"
                />
                <label htmlFor="spicy">Less Spicy</label>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="salty"
                  checked={adjustments.salty}
                  onChange={() => setAdjustments(prev => ({...prev, salty: !prev.salty}))}
                  className="mr-2"
                />
                <label htmlFor="salty">Less Salty</label>
              </div>
              
              <div>
                <label htmlFor="portion" className="block mb-1">Portion Size:</label>
                <select
                  id="portion"
                  value={adjustments.portionSize}
                  onChange={(e) => setAdjustments(prev => ({...prev, portionSize: e.target.value}))}
                  className="w-full p-2 border rounded"
                >
                  <option value="small">Small</option>
                  <option value="medium">Medium</option>
                  <option value="large">Large</option>
                </select>
              </div>
              
              <button
                type="button"
                onClick={handleAdjustSubmit}
                className="w-full bg-emerald-600 text-white py-2 rounded-lg mt-2"
              >
                Apply Adjustments 
              </button>
            </div>
          </div>
        )}
      </form>

      {/* Regenerate Button */}
      <button
        onClick={() => onRegenerate(prompt)}
        className="mt-2 flex items-center text-sm text-emerald-600 hover:text-emerald-800"
      >
        <RefreshCw size={16} className="mr-1" />
        Regenerate with adjustments (Unstable)
      </button>
    </div>
  );
};

