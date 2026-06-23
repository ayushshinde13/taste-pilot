import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Help Center - Taste Pilot',
  description: 'Find answers to common questions about orders, payments, refunds, delivery, and account settings.',
}

export default function HelpCenterPage() {
  const faqs = [
    {
      q: 'How do I check my order status?',
      a: 'Go to the Orders tab in the top navigation bar. There, you can see live tracking updates for current orders and view receipts for completed purchases.'
    },
    {
      q: 'Can I cancel my order after placing it?',
      a: 'Orders can only be cancelled within 60 seconds of placing them, as kitchens begin preparing items immediately to ensure fast delivery.'
    },
    {
      q: 'What payment modes are supported?',
      a: 'We support all major credit/debit cards, UPI apps (Google Pay, PhonePe, Paytm), Net Banking, and popular digital wallets.'
    },
    {
      q: 'How do refunds work?',
      a: 'If your order was cancelled or failed due to system errors, the refund is initiated instantly and will be credited to your account within 3-5 business days.'
    }
  ]

  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Support & Help Center</h1>
            <p className="text-lg text-gray-600 mb-12">We are here to help you get the best dining experience</p>
            
            <div className="max-w-3xl mx-auto text-left space-y-8">
              <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-6">Frequently Asked Questions</h2>
              <div className="space-y-6">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 border border-gray-150 rounded-xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 mb-2">
                      Q: {faq.q}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {faq.a}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
