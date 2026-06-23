import RestaurantsClient from './RestaurantsClient'

export const dynamic = 'force-dynamic'

async function getRestaurants() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
  try {
    const res = await fetch(`${apiUrl}/api/restaurants?limit=120`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
      return []
    }

    const json = await res.json()
    if (json && json.success && json.data) {
      return json.data
    }
    return []
  } catch (err: any) {
    console.error(`[ERROR] Failed to fetch restaurants from "${apiUrl}/api/restaurants?limit=120" in Server Component.`, err.message)
    return []
  }
}

export default async function RestaurantsPage() {
  const restaurants = await getRestaurants()
  return <RestaurantsClient initialRestaurants={restaurants} />
}