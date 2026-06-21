'use client'

import { useState } from 'react'
import { MapPin, Plus, Trash2, Edit2 } from 'lucide-react'

interface Address {
  id: string
  name: string
  address: string
  city: string
  phone: string
  isDefault: boolean
}

export default function SavedAddresses() {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      name: 'Home',
      address: '123 Green Street, Apt 4B',
      city: 'Mumbai, Maharashtra 400001',
      phone: '+91 98765 43210',
      isDefault: true,
    },
    {
      id: '2',
      name: 'Office',
      address: '456 Business Plaza, Floor 5',
      city: 'Mumbai, Maharashtra 400002',
      phone: '+91 98765 43210',
      isDefault: false,
    },
  ])

  const [showAddForm, setShowAddForm] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
  })

  const handleAddAddress = () => {
    if (formData.name && formData.address && formData.city) {
      const newAddress: Address = {
        id: Date.now().toString(),
        ...formData,
        isDefault: addresses.length === 0,
      }
      setAddresses([...addresses, newAddress])
      setFormData({ name: '', address: '', city: '', phone: '' })
      setShowAddForm(false)
    }
  }

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter(addr => addr.id !== id))
  }

  const handleSetDefault = (id: string) => {
    setAddresses(
      addresses.map(addr => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {/* Add Address Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Address</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Label</label>
                <input
                  type="text"
                  placeholder="e.g., Home, Office"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address</label>
              <input
                type="text"
                placeholder="123 Street Name, Apartment/Suite"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">City & Postal Code</label>
              <input
                type="text"
                placeholder="City, State 000000"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={handleAddAddress}
                className="flex-1 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
              >
                Save Address
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`rounded-xl p-6 border-2 transition ${
              addr.isDefault
                ? 'bg-orange-50 border-orange-300'
                : 'bg-white border-gray-200 hover:border-orange-200'
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-orange-500" size={24} />
                <h3 className="text-lg font-bold text-gray-900">{addr.name}</h3>
              </div>
              {addr.isDefault && (
                <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full">
                  Default
                </span>
              )}
            </div>

            <p className="text-gray-700 font-medium mb-1">{addr.address}</p>
            <p className="text-gray-600 text-sm mb-4">{addr.city}</p>
            <p className="text-gray-600 text-sm mb-4">Phone: {addr.phone}</p>

            <div className="flex gap-3 pt-4 border-t border-gray-200">
              <button
                onClick={() => handleSetDefault(addr.id)}
                className={`flex-1 py-2 rounded-lg font-semibold transition ${
                  addr.isDefault
                    ? 'bg-orange-500 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {addr.isDefault ? 'Default Address' : 'Set as Default'}
              </button>
              <button className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition">
                <Edit2 size={18} />
              </button>
              <button
                onClick={() => handleDeleteAddress(addr.id)}
                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
