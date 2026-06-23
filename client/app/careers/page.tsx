import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Careers - Taste Pilot',
  description: 'Join the Taste Pilot team and help us shape the future of food tech and delivery.',
}

export default function CareersPage() {
  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Join Taste Pilot</h1>
            <p className="text-lg text-gray-600 mb-12">Help us build the future of food delivery and dining tech</p>
            
            <div className="max-w-4xl mx-auto text-left">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Work with Us?</h2>
                  <p className="text-gray-600 mb-6">
                    At Taste Pilot, we are a passionate group of designers, developers, foodies, and operations experts 
                    collaborating to connect people with their favorite local cuisines.
                  </p>
                  <p className="text-gray-600 mb-6">
                    We offer a fast-paced, collaborative work environment, competitive compensation, flexible work hours, 
                    health insurance, and of course, great meal perks!
                  </p>

                  <h3 className="text-xl font-bold text-gray-900 mb-3">Our Core values</h3>
                  <ul className="space-y-2 text-gray-600 mb-8">
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">✓</span>
                      <span><strong>Customer First:</strong> We make decisions with the diner's convenience in mind.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">✓</span>
                      <span><strong>Innovation:</strong> Using advanced AI, we build tools like the Meal Planner to enrich user experience.</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-orange-500 mr-2">✓</span>
                      <span><strong>Equality & Diversity:</strong> We foster an inclusive culture where every voice counts.</span>
                    </li>
                  </ul>
                </div>

                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">Open Positions</h2>
                  <div className="space-y-4">
                    <div className="border-b border-orange-100 pb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">Senior Full-Stack Engineer (Next.js/Node)</h4>
                      <p className="text-sm text-gray-600">Engineering • Remote (India)</p>
                    </div>
                    <div className="border-b border-orange-100 pb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">UI/UX Designer</h4>
                      <p className="text-sm text-gray-600">Product Design • Pune Office</p>
                    </div>
                    <div className="border-b border-orange-100 pb-3">
                      <h4 className="font-semibold text-gray-900 text-lg">Growth Marketing Manager</h4>
                      <p className="text-sm text-gray-600">Marketing • Raipur Office</p>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 text-lg">Operations Lead</h4>
                      <p className="text-sm text-gray-600">Logistics • Bangalore Office</p>
                    </div>
                  </div>
                  <p className="mt-6 text-sm text-gray-600 text-center">
                    Don't see a role for you? Send your CV to <a href="mailto:careers@tastepilot.local" className="text-orange-500 font-semibold">careers@tastepilot.local</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
