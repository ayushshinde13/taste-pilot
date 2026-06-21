import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'About Us - Taste Pilot',
  description: 'Learn more about Taste Pilot and our mission to deliver delicious food to your doorstep.',
}

export default function AboutPage() {
  return (
    <main className="min-h-screen w-full bg-white">
      <Navbar />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About Taste Pilot</h1>
          <p className="text-lg text-gray-600 mb-12">Your trusted partner for delicious food delivery</p>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="text-left">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                <p className="text-gray-600 mb-4">
                  Taste Pilot was founded with a simple mission: to connect food lovers with the best local restaurants 
                  and deliver exceptional dining experiences to their doorsteps.
                </p>
                <p className="text-gray-600 mb-4">
                  We believe that great food has the power to bring people together and create memorable moments. 
                  Our platform makes it easier than ever to discover new flavors and enjoy your favorite dishes 
                  from the comfort of your home.
                </p>
                
                <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Why Choose Us?</h2>
                <ul className="space-y-2 text-left text-gray-600">
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Fast and reliable delivery service</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Wide selection of restaurants and cuisines</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>Quality guarantee for every order</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-orange-500 mr-2">✓</span>
                    <span>AI-powered personalized recommendations</span>
                  </li>
                </ul>
              </div>
              
              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200">
                <div className="text-6xl mb-6">🍽️</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Commitment</h3>
                <p className="text-gray-700">
                  We're committed to providing safe, hygienic, and timely food delivery services. 
                  Our team works closely with restaurants to ensure the highest quality standards 
                  and customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}