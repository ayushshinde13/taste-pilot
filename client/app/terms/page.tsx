import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Terms & Conditions - Taste Pilot',
  description: 'Review the Terms & Conditions governing your use of the Taste Pilot website, apps, and delivery services.',
}

export default function TermsPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Terms & Conditions</h1>
            <p className="text-lg text-gray-600 mb-12">Please review our rules and terms of usage before ordering.</p>
            
            <div className="max-w-3xl mx-auto text-left space-y-6 text-sm text-gray-600 leading-relaxed">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">1. Agreement to Terms</h2>
              <p>
                By creating an account or placing food orders on Taste Pilot, you agree to be bound by these Terms and Conditions. 
                If you do not agree to all of these terms, do not access or use our platforms.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">2. Account Registration</h2>
              <p>
                You are responsible for keeping your registration email and password confidential. You agree to accept responsibility 
                for all activities that occur under your account.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">3. Ordering & Cancellation</h2>
              <p>
                All orders are subject to availability and kitchen operating hours. Once placed, an order can only be cancelled 
                within 60 seconds. Late cancellations are subject to a cancellation fee matching the value of the order.
              </p>

              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-4">4. Limitation of Liability</h2>
              <p>
                Taste Pilot connects you with third-party local restaurants. While we mandate quality and hygiene standards, 
                we are not directly liable for issues relating to food quality or preparation faults.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
