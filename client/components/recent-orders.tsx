'use client'

import { ChevronRight, MapPin, Calendar, DollarSign } from 'lucide-react'

interface Order {
  id: string
  restaurant: string
  items: string[]
  total: number
  status: 'delivered' | 'pending' | 'cancelled'
  date: string
}

export default function RecentOrders() {
  const orders: Order[] = [
    {
      id: 'ORD001',
      restaurant: 'Margherita Pizzeria',
      items: ['Margherita Pizza', 'Garlic Bread'],
      total: 599,
      status: 'delivered',
      date: '2024-06-20',
    },
    {
      id: 'ORD002',
      restaurant: 'Burger Haven',
      items: ['Deluxe Burger', 'Fries', 'Coke'],
      total: 349,
      status: 'pending',
      date: '2024-06-19',
    },
    {
      id: 'ORD003',
      restaurant: 'Spice Route',
      items: ['Chicken Biryani', 'Raita'],
      total: 399,
      status: 'delivered',
      date: '2024-06-18',
    },
    {
      id: 'ORD004',
      restaurant: 'Pasta Paradise',
      items: ['Carbonara Pasta', 'Tiramisu'],
      total: 449,
      status: 'cancelled',
      date: '2024-06-17',
    },
    {
      id: 'ORD005',
      restaurant: 'Healthy Bites',
      items: ['Buddha Bowl', 'Green Juice'],
      total: 299,
      status: 'delivered',
      date: '2024-06-16',
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-blue-100 text-blue-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: string) => {
    return status.charAt(0).toUpperCase() + status.slice(1)
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Recent Orders</h2>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.id}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg hover:border-orange-200 transition"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-gray-900">{order.restaurant}</h3>
                <p className="text-sm text-gray-500">Order ID: {order.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
                {getStatusLabel(order.status)}
              </span>
            </div>

            <div className="mb-4">
              <p className="text-sm text-gray-600 font-medium">Items:</p>
              <p className="text-gray-700">{order.items.join(', ')}</p>
            </div>

            <div className="grid grid-cols-3 gap-4 py-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Order Date</p>
                  <p className="text-sm font-semibold text-gray-900">
                    {new Date(order.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-gray-400" />
                <div>
                  <p className="text-xs text-gray-500">Total Amount</p>
                  <p className="text-sm font-semibold text-gray-900">₹{order.total}</p>
                </div>
              </div>
              <button className="flex items-center gap-2 text-orange-500 font-semibold hover:text-orange-600 transition">
                <span>View</span>
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
