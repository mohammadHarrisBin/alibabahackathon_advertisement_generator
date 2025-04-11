import React, { useState } from 'react';
import { AlertTriangle, BookCheck, Check, Info, Leaf, Pizza, ThumbsDown } from "lucide-react";

export default function NutritionCard({ analysis, setJournalData }) {
  const [activeTab, setActiveTab] = useState('nutrition');
  
  if (!analysis) return null;

  // Function to determine nutrient bar color based on risk level
  const getNutrientColor = (value, thresholds) => {
    if (value <= thresholds.low) return 'bg-blue-500'; // Safe - Green
    if (value <= thresholds.moderate) return 'bg-yellow-500'; // Moderate - Yellow
    if (value <= thresholds.high) return 'bg-orange-500'; // High - Orange
    return 'bg-red-500'; // Very High - Red
  };

  // Threshold configurations for each nutrient
  const nutrientThresholds = {
    sugar: { low: 10, moderate: 25, high: 50 }, // grams
    fiber: { low: 3, moderate: 5, high: 10 }, // grams
    sodium: { low: 500, moderate: 1500, high: 2300 }, // mg
    purines: { low: 100, moderate: 200, high: 300 } // mg
  };

  const getRiskBadge = (risk) => {
    switch (risk) {
      case "Low":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-black text-green-800">
            <Check className="h-3 w-3 mr-1" /> Low Risk
          </span>
        );
      case "Moderate":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <Info className="h-3 w-3 mr-1" /> Moderate Risk
          </span>
        );
      case "High":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <AlertTriangle className="h-3 w-3 mr-1" /> High Risk
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-[500px] relative mt-4 bg-black rounded-lg border shadow-sm">
      {/* Card Header */}
      <div className="p-4 border-b">
        <div className="flex items-center text-lg font-bold">
          <Pizza className="h-5 w-5 mr-2 text-emerald-600" />
          Nutrition Analysis
          <button
          onClick={()=>setJournalData((prev)=>[...prev, analysis])}
          className='flex absolute right-2 top-6 text-blue-600 ml-20 p-2'>
          <BookCheck size={20}/> 
          <span className='text-sm ml-2 cursor-pointer'>Save to journal</span>
          {/* Save to jounal */}
          </button>
        </div>
        <p className="text-sm text-emerald-500">Analysis based on {analysis.sicknesses.join(", ")}</p>

        {/* <p className="text-sm text-emerald-500 mt-3">Additional prompts: </p>
        <p className='text-sm'>{analysis.prompts}</p> */}

      </div>

      {/* Card Content */}
      <div className="p-4">
        {/* Tabs */}
        <div className="mb-4">
          <div className="grid w-full grid-cols-3 bg-emerald-600 rounded-lg p-1">
            <button 
              onClick={() => setActiveTab('nutrition')}
              className={`py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'nutrition' ? 'bg-white shadow text-black' : 'hover:bg-gray-200 text-black'
              }`}
            >
              Nutrition Facts
            </button>
            <button 
              onClick={() => setActiveTab('risks')}
              className={`py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'risks' ? 'bg-white shadow text-black' : 'hover:bg-gray-200 text-black'
              }`}
            >
              Health Risks
            </button>
            <button 
              onClick={() => setActiveTab('recommendations')}
              className={`py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === 'recommendations' ? 'bg-white shadow text-black' : 'hover:bg-gray-200 text-black'
              }`}
            >
              Recommendations
            </button>
          </div>
        </div>

        {/* Nutrition Tab */}
        {activeTab === 'nutrition' && (
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-emerald-600 p-3 rounded-lg">
                <div className="text-sm text-white">Calories</div>
                <div className="text-xl font-bold">{analysis.kcal} kcal</div>
              </div>
              <div className="bg-emerald-600 p-3 rounded-lg">
                <div className="text-sm text-white">Protein</div>
                <div className="text-xl font-bold">{analysis.protein}g</div>
              </div>
              <div className="bg-emerald-600 p-3 rounded-lg">
                <div className="text-sm text-white">Carbs</div>
                <div className="text-xl font-bold">{analysis.carbs}g</div>
              </div>
              <div className="bg-emerald-600 p-3 rounded-lg">
                <div className="text-sm text-white">Fat</div>
                <div className="text-xl font-bold">{analysis.fat}g</div>
              </div>
            </div>

            <div className="space-y-3 mt-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Sugar</span>
                  <span className="text-sm font-medium">{analysis.sugar}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getNutrientColor(analysis.sugar, nutrientThresholds.sugar)}`}
                    style={{ width: `${Math.min((analysis.sugar / 50) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Fiber</span>
                  <span className="text-sm font-medium">{analysis.fiber}g</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getNutrientColor(analysis.fiber, nutrientThresholds.fiber)}`}
                    style={{ width: `${Math.min((analysis.fiber / 30) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Sodium</span>
                  <span className="text-sm font-medium">{analysis.sodium}mg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getNutrientColor(analysis.sodium, nutrientThresholds.sodium)}`}
                    style={{ width: `${Math.min((analysis.sodium / 2300) * 100, 100)}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm">Purines</span>
                  <span className="text-sm font-medium">{analysis.purines}mg</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${getNutrientColor(analysis.purines, nutrientThresholds.purines)}`}
                    style={{ width: `${Math.min((analysis.purines / 300) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>

            <div className="mt-4">
              <h4 className="font-medium mb-2">Ingredients</h4>
              <div className="flex flex-wrap gap-2">
                {analysis.ingredients.map((ingredient, i) => (
                  <span key={i} className="px-2 py-1 text-sm bg-emerald-600 border border-gray-200 rounded-md">
                    {ingredient}
                  </span>
                ))}
              </div>
            </div>

            {analysis.highPurineIngredients && analysis.highPurineIngredients.length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2 text-amber-600 flex items-center">
                  <ThumbsDown className="h-4 w-4 mr-1" /> High Purine Ingredients
                </h4>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.highPurineIngredients.map((item, i) => (
                    <li key={i}>
                      {item.ingredient} ({item.purineLevel} mg/100g)
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Risks Tab */}
        {activeTab === 'risks' && (
          <div className="pt-4 space-y-4">
            {analysis.sicknesses.map((sickness, i) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{sickness}</h3>
                  {getRiskBadge(analysis.riskLevels[sickness].level)}
                </div>
                <p className="text-sm text-white">
                  {analysis.riskLevels[sickness].reason}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="pt-4 space-y-4">
            {analysis.sicknesses.map((sickness, i) => (
              <div key={i} className="border rounded-lg p-4">
                <h3 className="font-medium mb-2 flex items-center">
                  <Leaf className="h-4 w-4 mr-1 text-emerald-600" />
                  Recommendations for {sickness}
                </h3>
                <ul className="list-disc pl-5 space-y-1">
                  {analysis.recommendations[sickness].map((rec, j) => (
                    <li key={j} className="text-sm">
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
        
      </div>
    </div>
  );
}