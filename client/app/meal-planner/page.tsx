import { motion } from 'framer-motion';
import { Loader2, ChefHat, Coffee, Utensils, Apple, Flame, Target } from 'lucide-react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import MealPlannerClient from './MealPlannerClient';

export async function generateMetadata() {
  return {
    title: 'AI Meal Planner - Taste Pilot',
    description: 'Get personalized meal recommendations based on your goals and budget using AI.',
  };
}

export default function MealPlannerPage() {
  return <MealPlannerClient />;
}