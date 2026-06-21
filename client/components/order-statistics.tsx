'use client'

import { TrendingUp, Clock, CheckCircle, Award } from 'lucide-react'

interface StatCard {
  title: string
  value: string | number
  icon: React.ReactNode
  color: string
  bgColor: string
}

export default function OrderStatistics() {
  const stats: StatCard[] = [
    {
      title: 'Total Orders',
      value: 24,
      icon: <TrendingUp size={28} />,
      color: 'text-orange-500',
      bgColor: 'bg-orange-50',
    },
    {
      title: 'Pending Orders',
      value: 2,
      icon: <Clock size={28} />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50',
    },
    {
      title: 'Completed Orders',
      value: 22,
      icon: <CheckCircle size={28} />,
      color: 'text-green-500',
      bgColor: 'bg-green-50',
    },
    {
      title: 'Loyalty Points',
      value: '1,200',
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
