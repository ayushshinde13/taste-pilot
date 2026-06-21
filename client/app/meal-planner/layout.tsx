import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AI Meal Planner - Taste Pilot',
  description: 'Get personalized meal recommendations based on your goals and budget using AI.',
};

export default function MealPlannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}