import Navbar from '@/components/navbar'
import Footer from '@/components/footer'

export const metadata = {
  title: 'Blog - Taste Pilot',
  description: 'Read the latest stories, recipes, culinary guides, and food technology articles from Taste Pilot.',
}

export default function BlogPage() {
  const articles = [
    {
      id: 1,
      title: 'Top 10 Street Foods in Raipur & Pune',
      excerpt: 'Discover the hidden gems, spicy delights, and sweet cravings that define local street food culture in Raipur and Pune.',
      date: 'June 20, 2026',
      readTime: '5 min read',
      author: 'Aarav Sharma',
      tag: 'Culinary Tour'
    },
    {
      id: 2,
      title: 'How AI is Personalizing Your Food Recommendations',
      excerpt: 'Ever wonder why you get suggested exactly what you want? Explore how Taste Pilot uses advanced models to tailor menus to your diet.',
      date: 'June 15, 2026',
      readTime: '8 min read',
      author: 'Dr. Priya Patel',
      tag: 'Technology'
    },
    {
      id: 3,
      title: 'The Rise of Eco-Friendly Food Packaging',
      excerpt: 'How local restaurants and delivery riders are joining hands to minimize single-use plastics and embrace green containers.',
      date: 'June 10, 2026',
      readTime: '6 min read',
      author: 'Rajesh Mehta',
      tag: 'Sustainability'
    }
  ]

  return (
    <main className="min-h-screen w-full bg-white flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Taste Pilot Blog</h1>
            <p className="text-lg text-gray-600 mb-12">Insights, stories, and news from the intersection of food and technology</p>
            
            <div className="max-w-5xl mx-auto text-left grid grid-cols-1 md:grid-cols-3 gap-8">
              {articles.map(article => (
                <div key={article.id} className="border border-gray-250 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition bg-white flex flex-col justify-between h-full">
                  <div className="p-6">
                    <span className="inline-block bg-orange-100 text-orange-600 text-xs font-semibold px-2 py-1 rounded mb-4">
                      {article.tag}
                    </span>
                    <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight hover:text-orange-500 transition cursor-pointer">
                      {article.title}
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">
                      {article.excerpt}
                    </p>
                  </div>
                  
                  <div className="p-6 pt-0 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                    <div>
                      <p className="font-semibold text-gray-800">{article.author}</p>
                      <p>{article.date}</p>
                    </div>
                    <span>{article.readTime}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </main>
  )
}
