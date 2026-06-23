'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ChefHat, Coffee, Utensils, Apple, Flame, Target, AlertCircle, ShoppingBag, Eye } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { apiCall } from '@/lib/auth';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function MealPlannerClient() {
  const { addToCart } = useCart();
  const [formData, setFormData] = useState({
    occasion: '',
    budget: '',
    dietaryPreference: 'any',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [mealPlan, setMealPlan] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [addedItemName, setAddedItemName] = useState<string | null>(null);

  const occasions = [
    'Biryani Feast',
    'Pizza Party',
    'Burger Combo Meal',
    'Momos & Street Food',
    'Chinese Dinner',
    'South Indian Special',
    'Tandoori Delight',
    'Desserts & Bakery',
    'Cafe & Beverages',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.occasion || !formData.budget) {
      setErrorMsg('Please select an occasion and specify your budget.');
      return;
    }

    try {
      setIsGenerating(true);
      setErrorMsg(null);
      setMealPlan(null);

      const res = await apiCall('/ai/meal-planner', {
        method: 'POST',
        body: JSON.stringify({
          occasion: formData.occasion,
          budget: Number(formData.budget),
          dietaryPreference: formData.dietaryPreference,
        }),
      });

      const json = await res.json();

      if (res.ok && json.success && json.data) {
        setMealPlan(json.data);
      } else {
        setErrorMsg(json.message || 'Failed to generate meal plan. Make sure your Gemini API key is configured correctly.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'An error occurred while generating meal plan.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddToCart = (item: any) => {
    if (!item || !item.menuItemId || !item.restaurantId) return;

    addToCart(
      {
        id: item.menuItemId,
        name: item.name,
        price: item.price,
        isVeg: true,
      },
      item.restaurantId,
      item.restaurant
    );

    setAddedItemName(item.name);
    setTimeout(() => setAddedItemName(null), 2500);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      occasion: '',
      budget: '',
      dietaryPreference: 'any',
    });
    setMealPlan(null);
    setErrorMsg(null);
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 flex flex-col justify-between">
      <div>
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
              Get personalized meal recommendations generated live from actual restaurant menus using AI.
            </p>
          </motion.div>

          {errorMsg && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-start gap-3">
              <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Oops! Something went wrong</p>
                <p className="text-sm mt-0.5">{errorMsg}</p>
              </div>
            </div>
          )}

          {addedItemName && (
            <div className="fixed bottom-6 right-6 z-50 p-4 bg-green-600 text-white rounded-xl shadow-lg flex items-center gap-2">
              <ShoppingBag size={20} />
              <span>Added <strong>{addedItemName}</strong> to cart!</span>
            </div>
          )}

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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Occasion / Goal
                  </label>
                <select
                  name="occasion"
                  value={formData.occasion}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="" className="text-gray-900 bg-white">Select occasion</option>
                  {occasions.map(occ => (
                    <option key={occ} value={occ} className="text-gray-900 bg-white">{occ}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Dietary Preference
                </label>
                <select
                  name="dietaryPreference"
                  value={formData.dietaryPreference}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                >
                  <option value="any" className="text-gray-900 bg-white">Any (Veg & Non-Veg)</option>
                  <option value="veg" className="text-gray-900 bg-white">Pure Vegetarian</option>
                  <option value="non-veg" className="text-gray-900 bg-white">Non-Vegetarian</option>
                </select>
              </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Max Budget (₹)
                  </label>
                  <input
                    type="number"
                    name="budget"
                    placeholder="e.g. 500"
                    value={formData.budget}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                  />
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
                        Generating Plan...
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
                  <h2 className="text-2xl font-bold text-gray-900 mb-2 text-center">Your Custom Meal Combo</h2>
                  <p className="text-center text-gray-600 text-sm italic mb-6">"{mealPlan.summary}"</p>
                  
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className="grid grid-cols-1 gap-6"
                  >
                    {/* Starter Card */}
                    {mealPlan.mealPlan.starter && (
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-150 flex flex-col md:flex-row justify-between"
                      >
                        <div className="p-6 flex-1">
                          <span className="px-2.5 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full uppercase tracking-wider">Starter</span>
                          <h4 className="text-xl font-bold text-gray-900 mt-2">{mealPlan.mealPlan.starter.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">From: <strong className="text-orange-500">{mealPlan.mealPlan.starter.restaurant}</strong></p>
                          <p className="text-sm text-gray-600 mt-3">{mealPlan.mealPlan.starter.reason}</p>
                          
                          <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                            {mealPlan.mealPlan.starter.proteinLevel && <span>Protein: {mealPlan.mealPlan.starter.proteinLevel}</span>}
                            {mealPlan.mealPlan.starter.healthScore > 0 && <span>Health Score: {mealPlan.mealPlan.starter.healthScore}/10</span>}
                            <span>Price: ₹{mealPlan.mealPlan.starter.price}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-6 flex flex-col gap-2 items-center justify-center border-t md:border-t-0 md:border-l border-gray-150 w-full md:w-48">
                          <button
                            onClick={() => handleAddToCart(mealPlan.mealPlan.starter)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold transition"
                          >
                            <ShoppingBag size={16} />
                            Add to Cart
                          </button>
                          {mealPlan.mealPlan.starter.restaurantId && (
                            <Link
                              href={`/restaurant/${mealPlan.mealPlan.starter.restaurantId}`}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold transition"
                            >
                              <Eye size={16} />
                              View Menu
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Main Card */}
                    {mealPlan.mealPlan.main && (
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-150 flex flex-col md:flex-row justify-between"
                      >
                        <div className="p-6 flex-1">
                          <span className="px-2.5 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full uppercase tracking-wider">Main Course</span>
                          <h4 className="text-xl font-bold text-gray-900 mt-2">{mealPlan.mealPlan.main.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">From: <strong className="text-orange-500">{mealPlan.mealPlan.main.restaurant}</strong></p>
                          <p className="text-sm text-gray-600 mt-3">{mealPlan.mealPlan.main.reason}</p>
                          
                          <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                            {mealPlan.mealPlan.main.proteinLevel && <span>Protein: {mealPlan.mealPlan.main.proteinLevel}</span>}
                            {mealPlan.mealPlan.main.healthScore > 0 && <span>Health Score: {mealPlan.mealPlan.main.healthScore}/10</span>}
                            <span>Price: ₹{mealPlan.mealPlan.main.price}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-6 flex flex-col gap-2 items-center justify-center border-t md:border-t-0 md:border-l border-gray-150 w-full md:w-48">
                          <button
                            onClick={() => handleAddToCart(mealPlan.mealPlan.main)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold transition"
                          >
                            <ShoppingBag size={16} />
                            Add to Cart
                          </button>
                          {mealPlan.mealPlan.main.restaurantId && (
                            <Link
                              href={`/restaurant/${mealPlan.mealPlan.main.restaurantId}`}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold transition"
                            >
                              <Eye size={16} />
                              View Menu
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {/* Dessert Card */}
                    {mealPlan.mealPlan.dessert && mealPlan.mealPlan.dessert.name && (
                      <motion.div 
                        whileHover={{ y: -3 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-150 flex flex-col md:flex-row justify-between"
                      >
                        <div className="p-6 flex-1">
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-xs font-bold rounded-full uppercase tracking-wider">Dessert / Side</span>
                          <h4 className="text-xl font-bold text-gray-900 mt-2">{mealPlan.mealPlan.dessert.name}</h4>
                          <p className="text-xs text-gray-500 mt-1">From: <strong className="text-orange-500">{mealPlan.mealPlan.dessert.restaurant}</strong></p>
                          <p className="text-sm text-gray-600 mt-3">{mealPlan.mealPlan.dessert.reason}</p>
                          
                          <div className="flex gap-4 mt-4 pt-3 border-t border-gray-100 text-xs text-gray-500">
                            {mealPlan.mealPlan.dessert.proteinLevel && <span>Protein: {mealPlan.mealPlan.dessert.proteinLevel}</span>}
                            {mealPlan.mealPlan.dessert.healthScore > 0 && <span>Health Score: {mealPlan.mealPlan.dessert.healthScore}/10</span>}
                            <span>Price: ₹{mealPlan.mealPlan.dessert.price}</span>
                          </div>
                        </div>
                        <div className="bg-gray-50 p-6 flex flex-col gap-2 items-center justify-center border-t md:border-t-0 md:border-l border-gray-150 w-full md:w-48">
                          <button
                            onClick={() => handleAddToCart(mealPlan.mealPlan.dessert)}
                            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-orange-500 text-white rounded-lg hover:bg-orange-600 text-sm font-semibold transition"
                          >
                            <ShoppingBag size={16} />
                            Add to Cart
                          </button>
                          {mealPlan.mealPlan.dessert.restaurantId && (
                            <Link
                              href={`/restaurant/${mealPlan.mealPlan.dessert.restaurantId}`}
                              className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm font-semibold transition"
                            >
                              <Eye size={16} />
                              View Menu
                            </Link>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white rounded-2xl shadow-lg p-6 text-center border border-gray-150"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Total Daily Cost</h3>
                    <p className="text-3xl font-bold text-orange-600">₹{mealPlan.totalCost}</p>
                    <p className="text-gray-500 mt-1 text-sm">
                      {mealPlan.withinBudget ? '✅ Safely within your specified budget limit!' : '⚠️ Slightly exceeded due to tax/fees'}
                    </p>
                  </motion.div>
                </>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-150"
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
      </div>
      
      <Footer />
    </main>
  );
}