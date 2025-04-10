'use client'
import React, { useState } from 'react';

function ProfilePage() {
  // Initial state with mock user data
  const [profile, setProfile] = useState({
    personalInfo: {
      name: 'John Doe',
      age: 35,
      gender: 'male',
      height: 175, // in cm
      weight: 75, // in kg
      email: 'john.doe@example.com',
    },
    healthConditions: {
      gout: false,
      diabetes: false,
      heartDisease: false,
      obesity: false,
      highBloodPressure: true,
      lowBloodPressure: false,
    },
    dietaryInfo: {
      allergies: ['Peanuts', 'Shellfish'],
      preferences: ['Low sodium', 'High protein'],
      additionalNotes: 'Prefer plant-based meals during weekdays.'
    }
  });

  // States for form handling
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(profile);
  const [newAllergy, setNewAllergy] = useState('');
  const [newPreference, setNewPreference] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Handle form input changes
  const handlePersonalInfoChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      personalInfo: {
        ...formData.personalInfo,
        [name]: name === 'age' || name === 'height' || name === 'weight' 
          ? parseInt(value) || '' 
          : value
      }
    });
  };

  // Handle health condition toggles
//   const handleHealthConditionChange = (condition) => {
//     setFormData({
//       ...formData,
//       healthConditions: {
//         ...formData.healthConditions,
//         [condition]: !formData.healthConditions[condition]
//       }
//     });
//   };
    const handleHealthConditionChange = (condition) => {
        // Create a copy of current health conditions
        const updatedHealthConditions = {
        ...formData.healthConditions
        };
        
        // If selecting one blood pressure condition, ensure the other is unselected
        if (condition === 'highBloodPressure' && !updatedHealthConditions[condition]) {
        updatedHealthConditions.lowBloodPressure = false;
        } else if (condition === 'lowBloodPressure' && !updatedHealthConditions[condition]) {
        updatedHealthConditions.highBloodPressure = false;
        }
        
        // Toggle the selected condition
        updatedHealthConditions[condition] = !updatedHealthConditions[condition];
        
        setFormData({
        ...formData,
        healthConditions: updatedHealthConditions
        });
    };


  // Handle adding new allergy
  const handleAddAllergy = () => {
    if (newAllergy.trim() && !formData.dietaryInfo.allergies.includes(newAllergy.trim())) {
      setFormData({
        ...formData,
        dietaryInfo: {
          ...formData.dietaryInfo,
          allergies: [...formData.dietaryInfo.allergies, newAllergy.trim()]
        }
      });
      setNewAllergy('');
    }
  };

  // Handle removing an allergy
  const handleRemoveAllergy = (allergy) => {
    setFormData({
      ...formData,
      dietaryInfo: {
        ...formData.dietaryInfo,
        allergies: formData.dietaryInfo.allergies.filter(item => item !== allergy)
      }
    });
  };

  // Handle adding new dietary preference
  const handleAddPreference = () => {
    if (newPreference.trim() && !formData.dietaryInfo.preferences.includes(newPreference.trim())) {
      setFormData({
        ...formData,
        dietaryInfo: {
          ...formData.dietaryInfo,
          preferences: [...formData.dietaryInfo.preferences, newPreference.trim()]
        }
      });
      setNewPreference('');
    }
  };

  // Handle removing a dietary preference
  const handleRemovePreference = (preference) => {
    setFormData({
      ...formData,
      dietaryInfo: {
        ...formData.dietaryInfo,
        preferences: formData.dietaryInfo.preferences.filter(item => item !== preference)
      }
    });
  };

  // Handle dietary notes change
  const handleNotesChange = (e) => {
    setFormData({
      ...formData,
      dietaryInfo: {
        ...formData.dietaryInfo,
        additionalNotes: e.target.value
      }
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      setProfile(formData);
      setIsSaving(false);
      setIsEditing(false);
      setSaveSuccess(true);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setSaveSuccess(false);
      }, 3000);
    }, 1000);
  };

  // Calculate BMI
  const calculateBMI = () => {
    const { height, weight } = profile.personalInfo;
    if (height && weight) {
      const heightInMeters = height / 100;
      const bmi = weight / (heightInMeters * heightInMeters);
      return bmi.toFixed(1);
    }
    return 'N/A';
  };

  // BMI category
  const getBMICategory = (bmi) => {
    if (bmi === 'N/A') return 'N/A';
    
    const numBMI = parseFloat(bmi);
    if (numBMI < 18.5) return 'Underweight';
    if (numBMI < 25) return 'Normal weight';
    if (numBMI < 30) return 'Overweight';
    return 'Obese';
  };

  // BMI color class
  const getBMIColorClass = (bmi) => {
    if (bmi === 'N/A') return 'bg-gray-200 text-gray-700';
    
    const numBMI = parseFloat(bmi);
    if (numBMI < 18.5) return 'bg-blue-100 text-blue-800';
    if (numBMI < 25) return 'bg-green-100 text-green-800';
    if (numBMI < 30) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const bmi = calculateBMI();
  const bmiCategory = getBMICategory(bmi);
  const bmiColorClass = getBMIColorClass(bmi);

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-50">
      {/* Header */}
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Profile</h1>
        <p className="text-gray-600 mt-2">Manage your personal information and health preferences</p>
      </header>

      {/* Success Message */}
      {saveSuccess && (
        <div className="mb-6 p-4 bg-green-100 text-green-700 rounded-lg flex items-center">
          <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          Profile saved successfully!
        </div>
      )}

      {/* Main Content */}
      <main className="flex flex-col gap-8">
        {/* Profile Summary Card (when not editing) */}
        {!isEditing && (
          <section className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-semibold text-gray-800">{profile.personalInfo.name}</h2>
                <p className="text-gray-600 mt-1">{profile.personalInfo.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 md:mt-0 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Edit Profile
              </button>
            </div>
            
            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">Age</p>
                <p className="text-lg font-medium">{profile.personalInfo.age} years</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">Gender</p>
                <p className="text-lg font-medium capitalize">{profile.personalInfo.gender}</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">Height</p>
                <p className="text-lg font-medium">{profile.personalInfo.height} cm</p>
              </div>
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="text-sm text-gray-500">Weight</p>
                <p className="text-lg font-medium">{profile.personalInfo.weight} kg</p>
              </div>
            </div>
            
            {/* BMI Card */}
            <div className="mt-6 p-4 border border-gray-200 rounded-lg">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div>
                  <h3 className="font-semibold text-gray-700">Body Mass Index (BMI)</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Based on your height and weight
                  </p>
                </div>
                <div className="mt-4 md:mt-0 flex items-center">
                  <div className={`px-3 py-2 rounded-lg ${bmiColorClass}`}>
                    <span className="text-xl font-bold">{bmi}</span>
                  </div>
                  <span className="ml-3 text-gray-700">{bmiCategory}</span>
                </div>
              </div>
            </div>
            
            {/* Health Conditions */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Health Conditions</h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(profile.healthConditions).map(([condition, active]) => (
                  active && (
                    <span key={condition} className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm">
                      {condition.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </span>
                  )
                ))}
                {!Object.values(profile.healthConditions).some(v => v) && (
                  <span className="text-gray-500">No health conditions specified</span>
                )}
              </div>
            </div>
            
            {/* Dietary Information */}
            <div className="mt-6">
              <h3 className="font-semibold text-gray-700 mb-3">Dietary Information</h3>
              
              <div className="mb-4">
                <h4 className="text-sm text-gray-500 mb-2">Allergies:</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.dietaryInfo.allergies.length > 0 ? (
                    profile.dietaryInfo.allergies.map((allergy, index) => (
                      <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                        {allergy}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No allergies specified</span>
                  )}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm text-gray-500 mb-2">Preferences:</h4>
                <div className="flex flex-wrap gap-2">
                  {profile.dietaryInfo.preferences.length > 0 ? (
                    profile.dietaryInfo.preferences.map((preference, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                        {preference}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No preferences specified</span>
                  )}
                </div>
              </div>
              
              {profile.dietaryInfo.additionalNotes && (
                <div>
                  <h4 className="text-sm text-gray-500 mb-2">Additional Notes:</h4>
                  <p className="p-3 bg-gray-100 rounded-lg text-gray-700">
                    {profile.dietaryInfo.additionalNotes}
                  </p>
                </div>
              )}
            </div>
          </section>
        )}
        
        {/* Edit Form */}
        {isEditing && (
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">Edit Profile</h2>
            
            {/* Personal Information */}
            <section className="mb-8">
              <h3 className="font-medium text-gray-700 mb-4 pb-2 border-b">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.personalInfo.name}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.personalInfo.email}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
                    Age
                  </label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    min="1"
                    max="120"
                    value={formData.personalInfo.age}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">
                    Gender
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.personalInfo.gender}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                    required
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer not to say">Prefer not to say</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">
                    Height (cm)
                  </label>
                  <input
                    type="number"
                    id="height"
                    name="height"
                    min="50"
                    max="250"
                    value={formData.personalInfo.height}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
                
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
                    Weight (kg)
                  </label>
                  <input
                    type="number"
                    id="weight"
                    name="weight"
                    min="20"
                    max="300"
                    value={formData.personalInfo.weight}
                    onChange={handlePersonalInfoChange}
                    className="w-full p-2 border border-gray-300 rounded-md"
                  />
                </div>
              </div>
            </section>
            
            {/* Health Conditions */}
            {/* <section className="mb-8">
              <h3 className="font-medium text-gray-700 mb-4 pb-2 border-b">Health Conditions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(formData.healthConditions).map(([condition, active]) => (
                  <div key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      id={condition}
                      checked={active}
                      onChange={() => handleHealthConditionChange(condition)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    />
                    <label htmlFor={condition} className="ml-2 text-gray-700">
                      {condition.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
            </section> */}

            {/* Health Conditions */}
            <section className="mb-8">
              <h3 className="font-medium text-gray-700 mb-4 pb-2 border-b">Health Conditions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {Object.entries(formData.healthConditions).map(([condition, active]) => (
                  <div key={condition} className="flex items-center">
                    <input
                      type="checkbox"
                      id={condition}
                      checked={active}
                      onChange={() => handleHealthConditionChange(condition)}
                      className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      disabled={(condition === 'highBloodPressure' && formData.healthConditions.lowBloodPressure) || 
                               (condition === 'lowBloodPressure' && formData.healthConditions.highBloodPressure)}
                    />
                    <label 
                      htmlFor={condition} 
                      className={`ml-2 ${((condition === 'highBloodPressure' && formData.healthConditions.lowBloodPressure) || 
                                        (condition === 'lowBloodPressure' && formData.healthConditions.highBloodPressure)) 
                                        ? 'text-gray-400' : 'text-gray-700'}`}
                    >
                      {condition.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase())}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mt-2 text-sm text-gray-500">
                Note: High Blood Pressure and Low Blood Pressure cannot be selected at the same time.
              </div>
            </section>
            
            {/* Dietary Information */}
            <section className="mb-8">
              <h3 className="font-medium text-gray-700 mb-4 pb-2 border-b">Dietary Information</h3>
              
              {/* Allergies */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Allergies
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.dietaryInfo.allergies.map((allergy, index) => (
                    <div key={index} className="flex items-center bg-yellow-100 px-3 py-1 rounded-full">
                      <span className="text-yellow-800">{allergy}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveAllergy(allergy)}
                        className="ml-2 text-yellow-800 hover:text-yellow-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newAllergy}
                    onChange={(e) => setNewAllergy(e.target.value)}
                    placeholder="Add allergy"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  />
                  <button
                    type="button"
                    onClick={handleAddAllergy}
                    className="px-4 bg-yellow-600 text-white rounded-r-md hover:bg-yellow-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Preferences */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dietary Preferences
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.dietaryInfo.preferences.map((preference, index) => (
                    <div key={index} className="flex items-center bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-blue-800">{preference}</span>
                      <button
                        type="button"
                        onClick={() => handleRemovePreference(preference)}
                        className="ml-2 text-blue-800 hover:text-blue-900"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
                <div className="flex">
                  <input
                    type="text"
                    value={newPreference}
                    onChange={(e) => setNewPreference(e.target.value)}
                    placeholder="Add preference"
                    className="flex-grow p-2 border border-gray-300 rounded-l-md"
                  />
                  <button
                    type="button"
                    onClick={handleAddPreference}
                    className="px-4 bg-blue-600 text-white rounded-r-md hover:bg-blue-700"
                  >
                    Add
                  </button>
                </div>
              </div>
              
              {/* Additional Notes */}
              <div>
                <label htmlFor="additionalNotes" className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Notes
                </label>
                <textarea
                  id="additionalNotes"
                  value={formData.dietaryInfo.additionalNotes}
                  onChange={handleNotesChange}
                  rows="3"
                  className="w-full p-2 border border-gray-300 rounded-md"
                  placeholder="Any additional dietary information or preferences..."
                ></textarea>
              </div>
            </section>
            
            {/* Form Buttons */}
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setFormData(profile);
                }}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSaving}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              >
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;