import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Press & Media - Taste Pilot',
  description: 'View the latest press releases, media kits, news coverage, and contact information for media inquiries.',
}

export default function PressPage() {
  const releases = [
    {
      id: 1,
      title: 'Taste Pilot Launches AI Meal Planner for Customized Diets',
      date: 'May 12, 2026',
      summary: 'Today Taste Pilot announced the rollout of its Gemini-powered AI Meal Planner, allowing users to compile nutritional preferences and generate ready-to-order meal catalogs.'
    },
    {
      id: 2,
      title: 'Taste Pilot Expands Operations to Raipur and Pune',
      date: 'March 18, 2026',
      summary: 'Marking a major milestone in regional expansion, Taste Pilot has formally rolled out delivery networks in Raipur and Pune, partner-linking over 20+ specialized kitchens.'
    }
  ]

  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Press Room</h1>
            <p className="text-lg text-gray-600 mb-12">Find news, announcements, and media assets about Taste Pilot</p>
            
            <div className="max-w-4xl mx-auto text-left grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
              <div className="md:col-span-2 space-y-8">
                <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 mb-6">Latest Press Releases</h2>
                {releases.map(release => (
                  <div key={release.id} className="space-y-2">
                    <p className="text-sm font-semibold text-orange-500">{release.date}</p>
                    <h3 className="text-xl font-bold text-gray-900 hover:text-orange-600 transition cursor-pointer">
                      {release.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed text-sm">
                      {release.summary}
                    </p>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-gray-900">Media Inquiries</h3>
                <p className="text-sm text-gray-600">
                  Are you a journalist or researcher working on a story about food tech or logistics? Contact our media relations team.
                </p>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Email Address:</p>
                  <a href="mailto:press@tastepilot.local" className="text-orange-500 font-semibold hover:underline">
                    press@tastepilot.local
                  </a>
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-gray-800">Media Kit:</p>
                  <p className="text-orange-500 font-semibold hover:underline cursor-pointer">
                    Download Logos & Imagery (.ZIP)
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
