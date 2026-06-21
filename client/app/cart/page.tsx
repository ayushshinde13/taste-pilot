import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Cart - Taste Pilot',
  description: 'Review your selected items and proceed to checkout.',
}

export default function CartPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Your Cart</h1>
          <p className="text-lg text-gray-600 mb-12">Review your selected items and proceed to checkout.</p>
          
          <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="flex flex-col items-center justify-center py-12">
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet</p>
              <a 
                href="/restaurants" 
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Browse Restaurants
              </a>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}