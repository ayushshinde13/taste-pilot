import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'AI Concierge - Taste Pilot',
  description: 'Get personalized food recommendations with our AI Concierge powered by advanced machine learning.',
}

export default function Concierge() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">AI Concierge</h1>
          <p className="text-lg text-gray-600 mb-12">Get personalized food recommendations based on your preferences, budget, and mood.</p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
              <div className="text-4xl mb-4">🍔</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Smart Recommendations</h3>
              <p className="text-gray-700">AI-powered suggestions tailored to your taste preferences</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
              <div className="text-4xl mb-4">⏱️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Delivery</h3>
              <p className="text-gray-700">Find restaurants closest to you with fastest delivery times</p>
            </div>
            
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-8 border border-orange-200">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Budget Friendly</h3>
              <p className="text-gray-700">Recommendations within your budget with best value options</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}