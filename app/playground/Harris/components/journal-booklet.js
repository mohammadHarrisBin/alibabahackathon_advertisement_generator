import React from 'react';

function FoodTrackerJournal({ journalData }) {
  // Check if journalData is valid array
  if (!journalData || !Array.isArray(journalData) || journalData.length === 0) {
    return <div className="p-4 text-gray-500">No meal data available</div>;
  }
  
  // Calculate totals from all journal entries
  const totals = {
    kcal: 0,
    protein: 0,
    carbs: 0,
    fat: 0
  };
  
  // Combine all ingredients and unique sicknesses
  const allIngredients = [];
  const allHighPurineIngredients = [];
  const uniqueSicknesses = new Set();
  
  // Process all journal entries
  journalData.forEach(entry => {
    // Add nutrition totals
    totals.kcal += entry.kcal || 0;
    totals.protein += entry.protein || 0;
    totals.carbs += entry.carbs || 0;
    totals.fat += entry.fat || 0;
    
    // Collect ingredients
    if (entry.ingredients && Array.isArray(entry.ingredients)) {
      allIngredients.push(...entry.ingredients);
    }
    
    // Collect high purine ingredients
    if (entry.highPurineIngredients && Array.isArray(entry.highPurineIngredients)) {
      allHighPurineIngredients.push(...entry.highPurineIngredients);
    }
    
    // Collect unique sicknesses
    if (entry.sicknesses && Array.isArray(entry.sicknesses)) {
      entry.sicknesses.forEach(sickness => uniqueSicknesses.add(sickness));
    }
  });
  
  // Get unique ingredients
  const uniqueIngredients = [...new Set(allIngredients)];
  
  // Combine high purine ingredients (may contain duplicates with different values)
  const mergedHighPurineIngredients = [];
  const seenIngredients = {};
  
  allHighPurineIngredients.forEach(item => {
    if (!seenIngredients[item.ingredient]) {
      seenIngredients[item.ingredient] = true;
      mergedHighPurineIngredients.push(item);
    }
  });
  
  // Get the highest risk level for each sickness across all entries
  const consolidatedRiskLevels = {};
  const consolidatedRecommendations = {};
  
  [...uniqueSicknesses].forEach(sickness => {
    let highestRisk = { level: 'Low', reason: '' };
    const allRecommendations = new Set();
    
    journalData.forEach(entry => {
      if (entry.riskLevels && entry.riskLevels[sickness]) {
        const riskLevel = entry.riskLevels[sickness];
        const riskPriority = { 'High': 3, 'Moderate': 2, 'Low': 1 };
        
        if (riskPriority[riskLevel.level] > riskPriority[highestRisk.level]) {
          highestRisk = riskLevel;
        }
      }
      
      if (entry.recommendations && entry.recommendations[sickness]) {
        entry.recommendations[sickness].forEach(rec => allRecommendations.add(rec));
      }
    });
    
    consolidatedRiskLevels[sickness] = highestRisk;
    consolidatedRecommendations[sickness] = [...allRecommendations];
  });

  const getRiskColor = (level) => {
    switch(level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Moderate': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-4 space-y-6 min-h-screen ">
      {/* Nutrition Summary */}
      {/* <p>{JSON.stringify(journalData)}</p> */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="font-bold text-lg mb-2 text-white">Total Nutrition Summary</h2>
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-400">Calories</p>
            <p className="font-bold text-white">{Math.round(totals.kcal)} kcal</p>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-400">Protein</p>
            <p className="font-bold text-white">{Math.round(totals.protein)}g</p>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-400">Carbs</p>
            <p className="font-bold text-white">{Math.round(totals.carbs)}g</p>
          </div>
          <div className="bg-gray-700 p-2 rounded">
            <p className="text-sm text-gray-400">Fat</p>
            <p className="font-bold text-white">{Math.round(totals.fat)}g</p>
          </div>
        </div>
      </div>
      
      {/* Ingredients */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="font-bold text-lg mb-2 text-white">All Ingredients</h2>
        <div className="flex flex-wrap gap-2">
          {uniqueIngredients.map((ingredient, index) => (
            <span key={index} className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white">
              {ingredient}
            </span>
          ))}
        </div>
      </div>
      
      {/* Health Risks */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="font-bold text-lg mb-2 text-white">Health Considerations</h2>
        {[...uniqueSicknesses].map((sickness) => (
          <div key={sickness} className="mb-4 last:mb-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-white">{sickness}</h3>
              <span className={`text-xs px-2 py-1 rounded-full ${getRiskColor(consolidatedRiskLevels[sickness]?.level)}`}>
                {consolidatedRiskLevels[sickness]?.level || 'Unknown'} Risk
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-2">{consolidatedRiskLevels[sickness]?.reason}</p>
            
            <div className="bg-gray-700 p-3 rounded">
              <h4 className="text-sm font-medium mb-1 text-white">Recommendations:</h4>
              <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
                {consolidatedRecommendations[sickness]?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      {/* High Purine Ingredients */}
      {mergedHighPurineIngredients.length > 0 && (
        <div className="bg-gray-800 p-4 rounded-lg">
          <h2 className="font-bold text-lg mb-2 text-white">High Purine Ingredients</h2>
          <div className="bg-gray-700 p-3 rounded">
            <ul className="space-y-2 text-white">
              {mergedHighPurineIngredients.map((item, index) => (
                <li key={index} className="flex justify-between">
                  <span>{item.ingredient}</span>
                  <span className="font-medium">{item.purineLevel} mg purines</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Individual Entries */}
      <div className="bg-gray-800 p-4 rounded-lg">
        <h2 className="font-bold text-lg mb-2 text-white">Individual Meal Entries</h2>
        <div className="space-y-4">
          {journalData.map((entry, index) => (
            <div key={index} className="bg-gray-700 p-3 rounded">
              <h3 className="font-medium text-white">Meal {index + 1}</h3>
              <div className="grid grid-cols-4 gap-2 mt-2">
                <div>
                  <p className="text-xs text-gray-400">Calories</p>
                  <p className="text-sm text-white">{entry.kcal} kcal</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Protein</p>
                  <p className="text-sm text-white">{entry.protein}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Carbs</p>
                  <p className="text-sm text-white">{entry.carbs}g</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Fat</p>
                  <p className="text-sm text-white">{entry.fat}g</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default FoodTrackerJournal;