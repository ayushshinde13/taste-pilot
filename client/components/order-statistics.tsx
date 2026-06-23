'use client'

import { TrendingUp, Clock, CheckCircle, Award } from 'lucide-react'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

interface Order {
  _id: string
  totalAmount: number
  status: 'Placed' | 'Preparing' | 'Out for Delivery' | 'Delivered' | 'Cancelled'
  items: OrderItem[]
  createdAt: string
}

interface OrderStatisticsProps {
  orders: Order[]
}

export default function OrderStatistics({ orders }: OrderStatisticsProps) {
  const totalOrders = orders.length
  
  const pendingOrders = orders.filter(
    (o) => ['Placed', 'Preparing', 'Out for Delivery'].includes(o.status)
  ).length

  const completedOrders = orders.filter((o) => o.status === 'Delivered').length

  const deliveredTotal = orders
    .filter((o) => o.status === 'Delivered')
    .reduce((sum, o) => sum + o.totalAmount, 0)

  const loyaltyPoints = Math.round(deliveredTotal * 0.1)

  const stats = [
    {
      title: 'Total Orders',
      value: totalOrders,
      icon: <TrendingUp size={28} />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Pending Orders',
      value: pendingOrders,
      icon: <Clock size={28} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed Orders',
      value: completedOrders,
      icon: <CheckCircle size={28} />,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Loyalty Points',
      value: loyaltyPoints.toLocaleString('en-IN'),
      icon: <Award size={28} />,
      color: 'text-purple-500',
      bgColor: 'bg-purple-50',
    },
  ]

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Order Statistics</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div
            key={idx}
            className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-lg transition"
          >
            <div className={`w-14 h-14 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
              <div className={stat.color}>{stat.icon}</div>
            </div>
            <p className="text-gray-600 text-sm font-medium mb-2">{stat.title}</p>
            <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
