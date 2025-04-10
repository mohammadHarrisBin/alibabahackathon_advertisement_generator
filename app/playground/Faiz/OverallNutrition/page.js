'use client'
import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

function FoodTracker() {
  const [meals, setMeals] = useState([]);
  const [showAddMealModal, setShowAddMealModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState(null);
  const [dailyTotals, setDailyTotals] = useState({
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    sugar: 0,
    fiber: 0,
    sodium: 0
  });

  // Calculate daily totals whenever meals change
  useEffect(() => {
    if (meals.length > 0) {
      const totals = meals.reduce((acc, meal) => {
        return {
          kcal: acc.kcal + meal.kcal,
          protein: acc.protein + meal.protein,
          carbs: acc.carbs + meal.carbs,
          fat: acc.fat + meal.fat,
          sugar: acc.sugar + meal.sugar,
          fiber: acc.fiber + meal.fiber,
          sodium: acc.sodium + meal.sodium
        };
      }, { kcal: 0, protein: 0, carbs: 0, fat: 0, sugar: 0, fiber: 0, sodium: 0 });
      
      setDailyTotals(totals);
    }
  }, [meals]);

  // Open add meal modal
  const handleOpenAddMeal = () => {
    setShowAddMealModal(true);
    resetMealForm();
  };

  // Close add meal modal
  const handleCloseAddMeal = () => {
    setShowAddMealModal(false);
    resetMealForm();
  };

  // Reset meal form
  const resetMealForm = () => {
    setSelectedImage(null);
    setPrompt('');
    setAnalysisResults(null);
  };

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

  // Handle form submission for analysis
  const handleSubmitForAnalysis = () => {
    if (!selectedImage) {
      alert('Please upload an image first');
      return;
    }
    
    setIsAnalyzing(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Mock analysis results
      const currentTime = new Date();
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
        'heart disease': ['Limit sodium intake.', 'Choose lean protein sources.'],
        time: `${currentTime.getHours()}:${currentTime.getMinutes().toString().padStart(2, '0')}`,
        image: selectedImage,
        description: prompt || 'Mixed meal'
      };
      
      setAnalysisResults(mockResults);
      setIsAnalyzing(false);
    }, 2000);
  };

  // Save meal to the list
  const handleSaveMeal = () => {
    if (analysisResults) {
      // Add meal with current time to the meals array
      const newMeals = [...meals, {
        ...analysisResults,
        id: Date.now() // Use timestamp as unique ID
      }];
      
      setMeals(newMeals);
      handleCloseAddMeal();
    }
  };

  // Delete a meal
  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter(meal => meal.id !== mealId));
  };

  // Get meal type based on time
  const getMealType = (timeString) => {
    const hour = parseInt(timeString.split(':')[0]);
    
    if (hour >= 5 && hour < 11) return 'Breakfast';
    if (hour >= 11 && hour < 15) return 'Lunch';
    if (hour >= 15 && hour < 18) return 'Snack';
    if (hour >= 18 && hour < 22) return 'Dinner';
    return 'Late Night';
  };

  // Prepare data for macro pie chart
  const prepareDailyMacroData = () => {
    return [
      { name: 'Protein', value: dailyTotals.protein, color: '#FF8042' },
      { name: 'Carbs', value: dailyTotals.carbs, color: '#0088FE' },
      { name: 'Fat', value: dailyTotals.fat, color: '#FFBB28' }
    ];
  };

  // Prepare data for meal analysis pie chart
  const prepareMealMacroData = () => {
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

  // Group meals by type
  const getMealsByType = () => {
    const mealsByType = {};
    
    meals.forEach(meal => {
      const type = getMealType(meal.time);
      if (!mealsByType[type]) {
        mealsByType[type] = [];
      }
      mealsByType[type].push(meal);
    });
    
    return mealsByType;
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <header className="mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Food & Nutrition Tracker</h1>
          <p className="text-gray-600">
            Today, {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        
        <button 
          onClick={handleOpenAddMeal}
          className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-md"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex flex-col gap-6">
        {/* Daily Summary */}
        <section className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Daily Summary</h2>
          
          {meals.length === 0 ? (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No meals tracked today</p>
              <button 
                onClick={handleOpenAddMeal}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
              >
                Add Your First Meal
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Macro Distribution Chart */}
              <div className="col-span-1 p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-700 mb-2 text-center">Macro Distribution</h3>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDailyMacroData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareDailyMacroData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => `${value}g`} />
                      <Legend verticalAlign="bottom" height={24} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              {/* Daily Totals */}
              <div className="col-span-2">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-700">Calories</p>
                    <p className="text-lg font-semibold">{dailyTotals.kcal} kcal</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Protein</p>
                    <p className="text-lg font-semibold">{dailyTotals.protein}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Carbs</p>
                    <p className="text-lg font-semibold">{dailyTotals.carbs}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Fat</p>
                    <p className="text-lg font-semibold">{dailyTotals.fat}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Sugar</p>
                    <p className="text-lg font-semibold">{dailyTotals.sugar}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Fiber</p>
                    <p className="text-lg font-semibold">{dailyTotals.fiber}g</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Sodium</p>
                    <p className="text-lg font-semibold">{dailyTotals.sodium}mg</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-500">Meals</p>
                    <p className="text-lg font-semibold">{meals.length}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>
        
        {/* Today's Meals Section */}
        <section className="p-6 bg-white rounded-lg shadow-sm">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Today's Meals</h2>
          
          {meals.length === 0 ? (
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No meals recorded yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {Object.entries(getMealsByType()).map(([mealType, mealsList]) => (
                <div key={mealType} className="border-b pb-4 last:border-0">
                  <h3 className="font-medium text-lg text-gray-700 mb-3">{mealType}</h3>
                  <div className="space-y-3">
                    {mealsList.map(meal => (
                      <div key={meal.id} className="flex items-center bg-gray-50 rounded-lg p-3">
                        <div className="w-16 h-16 flex-shrink-0 mr-4">
                          <img 
                            src={meal.image} 
                            alt={meal.description} 
                            className="w-full h-full object-cover rounded-md"
                          />
                        </div>
                        <div className="flex-grow">
                          <div className="flex justify-between">
                            <div>
                              <p className="font-medium">{meal.description}</p>
                              <p className="text-sm text-gray-500">{meal.time} • {meal.kcal} kcal</p>
                            </div>
                            <button 
                              onClick={() => handleDeleteMeal(meal.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <div className="mt-1 flex flex-wrap gap-2">
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs">
                              P: {meal.protein}g
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs">
                              C: {meal.carbs}g
                            </span>
                            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-md text-xs">
                              F: {meal.fat}g
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Add Meal Modal */}
      {showAddMealModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Modal Background */}
          <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"
            onClick={handleCloseAddMeal}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-screen overflow-y-auto">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center sticky top-0 bg-white z-10">
              <h2 className="text-xl font-semibold text-gray-800">Add New Meal</h2>
              <button 
                onClick={handleCloseAddMeal}
                className="text-gray-500 hover:text-gray-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            {/* Modal Content */}
            <div className="p-6">
              {!analysisResults ? (
                <>
                  {/* Upload Photo Section */}
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 1: Upload a Photo of Your Meal</h3>
                    
                    {selectedImage ? (
                      <div className="mb-4">
                        <img 
                          src={selectedImage} 
                          alt="Selected meal" 
                          className="w-full max-h-64 object-contain rounded-lg border border-gray-200"
                        />
                        <button 
                          onClick={() => setSelectedImage(null)}
                          className="mt-2 text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          Remove image
                        </button>
                      </div>
                    ) : (
                      <div className="mb-4">
                        <label 
                          className="block w-full p-12 text-center border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
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
                  </section>

                  {/* Enter Prompt Section */}
                  <section className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Step 2: Provide Additional Details</h3>
                    <label htmlFor="prompt" className="block text-gray-700 mb-1">
                      Describe your meal or add notes:
                    </label>
                    <input
                      type="text"
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="e.g., grilled chicken with vegetables"
                      className="w-full p-2 border border-gray-300 rounded-md mb-4 focus:ring-2 focus:ring-blue-300 focus:border-blue-500 outline-none"
                    />
                    <button 
                      onClick={handleSubmitForAnalysis}
                      disabled={!selectedImage}
                      className={`px-4 py-2 rounded-md text-white transition-colors ${
                        selectedImage ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'
                      }`}
                    >
                      Analyze Meal
                    </button>
                  </section>
                </>
              ) : (
                <>
                  {/* Analysis Results */}
                  <section>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Analysis Results</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        {analysisResults.kcal} kcal
                      </span>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-6">
                      {/* Image and Ingredients */}
                      <div className="w-full md:w-2/5">
                        <div className="mb-4">
                          <img 
                            src={selectedImage} 
                            alt="Analyzed meal" 
                            className="w-full object-cover rounded-lg shadow-sm"
                          />
                        </div>
                        
                        <div>
                          <h4 className="font-semibold text-gray-700 mb-2">Ingredients Detected</h4>
                          <div className="flex flex-wrap gap-2">
                            {analysisResults.ingredients.map((item, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 text-gray-800 rounded-md text-sm">
                                {item}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      {/* Nutritional Information */}
                      <div className="w-full md:w-3/5">
                        <h4 className="font-semibold text-gray-700 mb-2">Nutritional Information</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
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
                        
                        {/* Macronutrient Pie Chart */}
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-700 mb-2 text-center">Macronutrient Distribution</h4>
                          <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={prepareMealMacroData()}
                                  cx="50%"
                                  cy="50%"
                                  labelLine={false}
                                  outerRadius={60}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                >
                                  {prepareMealMacroData().map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                  ))}
                                </Pie>
                                <Tooltip formatter={(value) => `${value}g`} />
                                <Legend verticalAlign="bottom" height={24} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Health Risk Assessment */}
                    <div className="mt-6">
                      <h4 className="font-semibold text-gray-700 mb-3">Health Risk Assessment</h4>
                      <div className="space-y-3">
                        {analysisResults.sicknesses.map((sickness, index) => (
                          <div key={index} className="p-3 border border-gray-200 rounded-lg shadow-sm">
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
                  </section>
                </>
              )}
            </div>
            
            {/* Modal Footer */}
            <div className="p-4 border-t flex justify-end sticky bottom-0 bg-white z-10">
              <button 
                onClick={handleCloseAddMeal}
                className="px-4 py-2 mr-2 bg-gray-200 hover:bg-gray-300 rounded-md text-gray-800 transition-colors"
              >
                Cancel
              </button>
              
              {analysisResults && (
                <button 
                  onClick={handleSaveMeal}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors"
                >
                  Save Meal
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isAnalyzing && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-purple-500/20 backdrop-blur-sm"></div>
          <div className="relative bg-white p-6 rounded-lg shadow-lg">
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