'use client'
import React, { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function FoodTracker() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);

  // Handle file selection
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock analysis results
      const mockResults = {
        sicknesses: ['heart disease', 'gout'],
        kcal: 500,
        protein: 25,
        carbs: 60,
        fat: 15,
        sugar: 5,
        fiber: 3,
        sodium: 400,
        purines: 200,
        ingredients: [
          'rice', 'chicken',
          'egg', 'cucumber',
          'beans', 'fish',
          'spices'
        ],
        highPurineIngredients: [
          { ingredient: 'chicken', purineLevel: 150 },
          { ingredient: 'fish', purineLevel: 200 }
        ],
        riskLevels: { 'heart disease': 'Moderate', gout: 'High' },
        'heart disease': ['Limit sodium intake.', 'Choose lean protein sources.']
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Reset the form
  const handleReset = () => {
    setSelectedImage(null);
    setPrompt('');
    setAnalysisResults(null);
  };

  // Prepare data for pie chart
  const prepareMacroData = () => {
    if (!analysisResults) return [];
    
    return [
      { name: 'Protein', value: analysisResults.protein, color: '#FF8042' },
      { name: 'Carbs', value: analysisResults.carbs, color: '#0088FE' },
      { name: 'Fat', value: analysisResults.fat, color: '#FFBB28' }
    ];
  };

  // Prepare data for purine bar chart
  const preparePurineData = () => {
    if (!analysisResults?.highPurineIngredients) return [];
    return analysisResults.highPurineIngredients.map(item => ({
      name: item.ingredient,
      value: item.purineLevel
    }));
  };
  
  // Get risk level badge color
  const getRiskLevelColor = (level) => {
    switch(level) {
      case 'Low': return 'bg-green-500';
      case 'Moderate': return 'bg-yellow-500';
      case 'High': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 rounded-lg shadow-md">
      {/* Header Section */}
      <header className="text-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Food & Nutrition Tracker</h1>
        <p className="text-gray-600 mt-2">
          Monitor your food intake and manage your health effectively.
        </p>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-6">
        {!analysisResults ? (
          <>
            {/* Upload Photo Section */}
            <section className="p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Step 1: Upload a Photo of Your Meal</h2>
              
              {selectedImage ? (
                <div className="mb-4">
                  <img 
                    src={selectedImage} 
                    alt="Selected meal" 
                    className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                  />
                  <button 
                    onClick={handleReset}
                    className="mt-2 text-sm text-red-600 hover:text-red-800"
                  >
                    Remove image
                  </button>
                </div>
              ) : (
                <div className="mb-4">
                  <label 
                    className="block w-full p-12 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleFileSelect}
                    />
                    <span className="text-gray-600">Click to upload or drag and drop</span>
                  </label>
                </div>
              )}
              
              <p className="text-sm text-gray-600">
                Take a clear photo of your meal for accurate analysis.
              </p>
            </section>

            {/* Enter Prompt Section */}
            <section className="p-4 bg-white rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">Step 2: Provide Additional Details</h2>
              <label htmlFor="prompt" className="block text-gray-700 mb-1">
                Describe your meal or add notes:
              </label>
              <input
                type="text"
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., grilled chicken with vegetables"
                className="w-full p-2 border border-gray-300 rounded-md mb-4"
              />
              <button 
                onClick={handleSubmit}
                disabled={!selectedImage}
                className={`px-4 py-2 rounded-md text-white ${
                  selectedImage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                }`}
              >
                Analyze Meal
              </button>
            </section>
          </>
        ) : (
          <div className="flex flex-col gap-6">
            {/* Analysis Overview Card */}
            <section className="p-6 bg-white rounded-lg shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Analysis Results</h2>
                <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {analysisResults.kcal} kcal
                </span>
              </div>
              
              <div className="flex flex-col md:flex-row gap-6">
                {/* Image Column */}
                <div className="w-full md:w-1/3">
                  <div className="bg-gray-100 rounded-lg overflow-hidden shadow-sm">
                    <img 
                      src={selectedImage} 
                      alt="Analyzed meal" 
                      className="w-full object-cover h-48"
                    />
                  </div>
                  
                  <div className="mt-4">
                    <h3 className="font-semibold text-gray-700 mb-2">Ingredients Detected</h3>
                    <div className="flex flex-wrap gap-2">
                      {analysisResults.ingredients.map((item, index) => (
                        <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Info Column */}
                <div className="w-full md:w-2/3">
                  {/* Nutritional Information */}
                  <div className="mb-6">
                    <h3 className="font-semibold text-gray-700 mb-3">Nutritional Information</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Protein</p>
                        <p className="text-lg font-semibold">{analysisResults.protein}g</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Carbs</p>
                        <p className="text-lg font-semibold">{analysisResults.carbs}g</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Fat</p>
                        <p className="text-lg font-semibold">{analysisResults.fat}g</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Sugar</p>
                        <p className="text-lg font-semibold">{analysisResults.sugar}g</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Fiber</p>
                        <p className="text-lg font-semibold">{analysisResults.fiber}g</p>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">Sodium</p>
                        <p className="text-lg font-semibold">{analysisResults.sodium}mg</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Health Risk Indicators */}
                  <div>
                    <h3 className="font-semibold text-gray-700 mb-3">Health Risk Assessment</h3>
                    <div className="space-y-3">
                      {analysisResults.sicknesses.map((sickness, index) => (
                        <div key={index} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between">
                            <span className="font-medium">{sickness}</span>
                            <span className={`px-2 py-1 rounded-md text-xs text-white ${getRiskLevelColor(analysisResults.riskLevels[sickness])}`}>
                              {analysisResults.riskLevels[sickness]} Risk
                            </span>
                          </div>
                          {analysisResults[sickness] && (
                            <ul className="mt-2 text-sm text-gray-600 list-disc list-inside">
                              {analysisResults[sickness].map((advice, idx) => (
                                <li key={idx}>{advice}</li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
            
            {/* Charts Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Macronutrient Pie Chart */}
              <section className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4 text-center">Macronutrient Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareMacroData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareMacroData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}g`} />
                      <Legend verticalAlign="bottom" height={36} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </section>
              
              {/* Purine Content Bar Chart */}
              <section className="p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold text-gray-700 mb-4 text-center">
                  High Purine Ingredients
                  <span className="block text-sm font-normal text-gray-500 mt-1">
                    Total purine content: {analysisResults.purines}mg
                  </span>
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={preparePurineData()} margin={{ top: 5, right: 30, left: 20, bottom: 30 }}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis label={{ value: 'mg', angle: -90, position: 'insideLeft' }} />
                      <Tooltip formatter={(value) => `${value}mg`} />
                      <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </section>
            </div>
            
            <div className="flex justify-between">
              <button 
                onClick={handleReset}
                className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800"
              >
                Track Another Meal
              </button>
              
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white">
                Save Results
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg">
            <p className="text-xl">Analyzing your meal...</p>
            <div className="mt-4 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div className="bg-blue-600 h-full animate-pulse"></div>
            </div>
          </div>
        </div>
      )}

      {/* Footer Section */}
      <footer className="mt-8 text-center">
        <p className="text-sm text-gray-600">
          Powered by AI Nutrition Analysis | © 2025
        </p>
      </footer>
    </div>
  );
}

export default FoodTracker;