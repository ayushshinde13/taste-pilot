'use client'

import { Zap, Users, Award, Shield } from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: 'Wide Variety',
    description: 'Choose from thousands of restaurants and cuisines at your fingertips',
  },
  {
    icon: Zap,
    title: 'Fast Delivery',
    description: 'Get your food delivered quickly with our efficient delivery network',
  },
  {
    icon: Award,
    title: 'Best Quality',
    description: 'We partner only with the best restaurants for top-notch quality',
  },
  {
    icon: Shield,
    title: 'Easy Payment',
    description: 'Multiple payment options for secure and convenient transactions',
  },
]

export default function Features() {
  return (
    <section className="w-full bg-white py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900">
            Why Choose Taste Pilot?
          </h2>
          <p className="text-lg text-gray-600">
            Experience the best food delivery service with our premium features
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="rounded-xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-8 text-center transition hover:shadow-lg hover:border-orange-500"
              >
                <div className="mb-4 flex justify-center">
                  <div className="rounded-full bg-orange-100 p-4">
                    <Icon size={32} className="text-orange-500" />
                  </div>
                </div>
                <h3 className="mb-2 text-xl font-bold text-gray-900">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
