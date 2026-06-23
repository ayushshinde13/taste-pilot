import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Contact Us - Taste Pilot',
  description: 'Get in touch with the Taste Pilot support, partnership, or sales teams.',
}

export default function ContactPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Contact Taste Pilot</h1>
            <p className="text-lg text-gray-600 mb-12">Have any questions? We would love to hear from you.</p>
            
            <div className="max-w-4xl mx-auto text-left grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900">Reach Out to Support</h2>
                <p className="text-gray-600 leading-relaxed text-sm">
                  Our customer care team is available 24/7 to resolve any ordering, delivery, or account queries.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl">📧</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Customer Support</p>
                      <a href="mailto:support@tastepilot.local" className="text-orange-500 font-semibold hover:underline text-sm">
                        support@tastepilot.local
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="text-orange-500 text-xl">🤝</span>
                    <div>
                      <p className="font-semibold text-gray-800 text-sm">Partner Partnerships</p>
                      <a href="mailto:partners@tastepilot.local" className="text-orange-500 font-semibold hover:underline text-sm">
                        partners@tastepilot.local
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-8 border border-orange-200 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Headquarters</h3>
                <p className="text-gray-700 text-sm">
                  Taste Pilot Technology Ltd.<br />
                  Plot 18, Cyber Gateway Sector,<br />
                  HITEC City, Hyderabad,<br />
                  Telangana - 500081
                </p>
                <p className="text-gray-700 text-sm font-semibold">
                  Raipur & Pune Branch Hubs coming soon!
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
