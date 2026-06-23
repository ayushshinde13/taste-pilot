import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Privacy Policy - Taste Pilot',
  description: 'Read the Taste Pilot Privacy Policy to learn how we collect, use, and protect your personal information.',
}

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
            <p className="text-lg text-gray-600 mb-12">Your privacy matters to us. Learn how we handle your data.</p>
            
            <div className="max-w-3xl mx-auto text-left space-y-6 text-sm text-gray-600 leading-relaxed">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">1. Information We Collect</h2>
              <p>
                We collect personal information that you provide to us directly when registering, placing an order, or communicating with us. 
                This includes your full name, email address, password hash, delivery address, phone number, and location coordinates.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">2. How We Use Your Information</h2>
              <p>
                We use your details to process orders, verify logins, coordinate deliveries with riders and restaurants, and provide personalized 
                dining suggestions using our AI models.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">3. Data Sharing</h2>
              <p>
                We do not sell your personal data to third parties. We share delivery addresses and contact numbers with active delivery riders 
                and restaurant partners exclusively to fulfill your orders.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">4. Contact Information</h2>
              <p>
                If you have any questions about this Privacy Policy, please reach out to us at <a href="mailto:privacy@tastepilot.local" className="text-orange-500 font-semibold">privacy@tastepilot.local</a>.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
