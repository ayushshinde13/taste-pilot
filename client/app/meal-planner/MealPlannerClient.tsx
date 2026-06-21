'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChefHat, Coffee, Utensils, Apple, Flame, Target } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

export default function MealPlannerClient() {
  const [formData, setFormData] = useState({
    goal: '',
    budget: '',
    preferences: '',
    days: '1',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);

  const goals = [
    'Weight Loss',
    'Weight Gain',
    'High Protein',
    'Vegetarian',
    'Muscle Building',
    'Healthy Lifestyle',
  ];

  const dayOptions = [
    { value: '1', label: '1 Day' },
    { value: '3', label: '3 Days' },
    { value: '7', label: '7 Days' },
  ];

  const sampleMealPlan = {
    breakfast: {
      name: 'Protein Oatmeal with Berries',
      estimatedCost: 120,
      calories: 350,
      protein: '15g',
      category: 'Breakfast',
    },
    lunch: {
      name: 'Grilled Chicken Salad',
      estimatedCost: 280,
      calories: 420,
      protein: '32g',
      category: 'Lunch',
    },
    dinner: {
      name: 'Salmon with Quinoa',
      estimatedCost: 350,
      calories: 520,
      protein: '40g',
      category: 'Dinner',
    },
    snacks: {
      name: 'Greek Yogurt with Nuts',
      estimatedCost: 100,
      calories: 180,
      protein: '12g',
      category: 'Snacks',
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsGenerating(true);

    // Simulate API call
    setTimeout(() => {
      setMealPlan(sampleMealPlan);
      setIsGenerating(false);
    }, 2000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLTextAreaElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      goal: '',
      budget: '',
      preferences: '',
      days: '1',
    });
    setMealPlan(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100">
      <Navbar />
      
      <div className="max-w-6xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            AI Meal Planner
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get personalized meal recommendations based on your goals and budget.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bg-white rounded-2xl shadow-xl p-6 md:p-8"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <Target className="mr-2 text-orange-600" size={24} />
              Your Preferences
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Goal
                </label>
                <select
                  name="goal"
                  value={formData.goal}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  <option value="">Select your goal</option>
                  {goals.map(goal => (
                    <option key={goal} value={goal}>{goal}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <textarea
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Example: My budget is ₹300 per day. I prefer vegetarian meals. I want high protein meals."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Additional Preferences
                </label>
                <textarea
                  name="preferences"
                  value={formData.preferences}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Examples: No spicy food, South Indian food only, High protein diet, Low calorie meals, Eggitarian diet"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {dayOptions.map(option => (
                    <button
                      key={option.value}
                      type="button"
                      onClick={() => setFormData({...formData, days: option.value})}
                      className={`py-3 px-4 rounded-lg border transition ${
                        formData.days === option.value
                          ? 'bg-orange-600 text-white border-orange-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="submit"
                  disabled={isGenerating}
                  className="flex-1 py-3 px-6 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                      Generating...
                    </>
                  ) : (
                    'Generate Meal Plan'
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={resetForm}
                  className="py-3 px-6 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition"
                >
                  Reset
                </button>
              </div>
            </form>
          </motion.div>

          {/* AI Response Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {mealPlan ? (
              <>
                <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Your Personalized Meal Plan</h2>
                
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                  className="grid grid-cols-1 md:grid-cols-2 gap-6"
                >
                  {/* Breakfast Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="bg-orange-500 p-4">
                      <div className="flex items-center text-white">
                        <ChefHat size={24} className="mr-2" />
                        <h3 className="text-lg font-semibold">Breakfast</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{mealPlan.breakfast.name}</h4>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Flame className="text-orange-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.breakfast.calories} cal</span>
                        </div>
                        <div className="flex items-center">
                          <Apple className="text-green-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.breakfast.protein} protein</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span className="text-lg font-bold text-orange-600">₹{mealPlan.breakfast.estimatedCost}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Lunch Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="bg-orange-500 p-4">
                      <div className="flex items-center text-white">
                        <Utensils size={24} className="mr-2" />
                        <h3 className="text-lg font-semibold">Lunch</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{mealPlan.lunch.name}</h4>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Flame className="text-orange-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.lunch.calories} cal</span>
                        </div>
                        <div className="flex items-center">
                          <Apple className="text-green-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.lunch.protein} protein</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span className="text-lg font-bold text-orange-600">₹{mealPlan.lunch.estimatedCost}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Dinner Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="bg-orange-500 p-4">
                      <div className="flex items-center text-white">
                        <Coffee size={24} className="mr-2" />
                        <h3 className="text-lg font-semibold">Dinner</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{mealPlan.dinner.name}</h4>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Flame className="text-orange-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.dinner.calories} cal</span>
                        </div>
                        <div className="flex items-center">
                          <Apple className="text-green-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.dinner.protein} protein</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span className="text-lg font-bold text-orange-600">₹{mealPlan.dinner.estimatedCost}</span>
                      </div>
                    </div>
                  </motion.div>

                  {/* Snacks Card */}
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100"
                  >
                    <div className="bg-orange-500 p-4">
                      <div className="flex items-center text-white">
                        <Apple size={24} className="mr-2" />
                        <h3 className="text-lg font-semibold">Snacks</h3>
                      </div>
                    </div>
                    <div className="p-6">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{mealPlan.snacks.name}</h4>
                      <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center">
                          <Flame className="text-orange-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.snacks.calories} cal</span>
                        </div>
                        <div className="flex items-center">
                          <Apple className="text-green-500 mr-1" size={16} />
                          <span className="text-sm text-gray-600">{mealPlan.snacks.protein} protein</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between items-center">
                        <span className="text-gray-600">Estimated Cost:</span>
                        <span className="text-lg font-bold text-orange-600">₹{mealPlan.snacks.estimatedCost}</span>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white rounded-2xl shadow-lg p-6 text-center"
                >
                  <h3 className="text-xl font-bold text-gray-900 mb-2">Total Daily Cost</h3>
                  <p className="text-3xl font-bold text-orange-600">₹{mealPlan.breakfast.estimatedCost + mealPlan.lunch.estimatedCost + mealPlan.dinner.estimatedCost + mealPlan.snacks.estimatedCost}</p>
                  <p className="text-gray-600 mt-2">Based on your preferences and budget</p>
                </motion.div>
              </>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-lg p-12 text-center"
              >
                <div className="mx-auto flex justify-center">
                  <ChefHat className="text-orange-500" size={64} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Your Meal Plan Awaits</h3>
                <p className="text-gray-600">Fill out the form to generate a personalized meal plan based on your goals and budget.</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
      
      <Footer />
    </main>
  );
}