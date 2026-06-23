'use client'

import { useState } from 'react'
import { MapPin, Plus, Trash2, Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiCall } from '@/lib/auth'

export default function SavedAddresses() {
  const { user, refreshUser } = useAuth()
  const [showAddForm, setShowAddForm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [actionId, setActionId] = useState<string | null>(null) // tracker for default/delete loaders
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    label: '',
    street: '',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '',
    phone: '',
    locality: '',
    latitude: '',
    longitude: '',
  })

  const handleAddAddress = async () => {
    if (!formData.label || !formData.street || !formData.city || !formData.state || !formData.pincode) {
      setErrorMsg('Please fill in all required fields.')
      return
    }

    try {
      setIsLoading(true)
      setErrorMsg(null)
      setSuccessMsg(null)

      const res = await apiCall('/auth/addresses', {
        method: 'POST',
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (res.ok && json.success) {
        await refreshUser()
        setSuccessMsg('Address saved successfully!')
        setFormData({
          label: '',
          street: '',
          city: 'Raipur',
          state: 'Chhattisgarh',
          pincode: '',
          phone: '',
          locality: '',
          latitude: '',
          longitude: '',
        })
        setShowAddForm(false)
        setTimeout(() => setSuccessMsg(null), 3000)
      } else {
        setErrorMsg(json.message || 'Failed to save address')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while saving address')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteAddress = async (id: string) => {
    try {
      setActionId(id)
      setErrorMsg(null)
      setSuccessMsg(null)

      const res = await apiCall(`/auth/addresses/${id}`, {
        method: 'DELETE',
      })

      const json = await res.json()

      if (res.ok && json.success) {
        await refreshUser()
        setSuccessMsg('Address deleted successfully!')
        setTimeout(() => setSuccessMsg(null), 3000)
      } else {
        setErrorMsg(json.message || 'Failed to delete address')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while deleting address')
    } finally {
      setActionId(null)
    }
  }

  const handleSetDefault = async (id: string) => {
    try {
      setActionId(id)
      setErrorMsg(null)
      setSuccessMsg(null)

      const res = await apiCall(`/auth/addresses/${id}/default`, {
        method: 'PUT',
      })

      const json = await res.json()

      if (res.ok && json.success) {
        await refreshUser()
        setSuccessMsg('Default address updated!')
        setTimeout(() => setSuccessMsg(null), 3000)
      } else {
        setErrorMsg(json.message || 'Failed to update default address')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while updating default address')
    } finally {
      setActionId(null)
    }
  }

  const addresses = user?.addresses || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Saved Addresses</h2>
        <button
          onClick={() => {
            setErrorMsg(null)
            setShowAddForm(!showAddForm)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          <Plus size={18} />
          Add Address
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg flex items-center gap-2">
          <AlertCircle size={16} />
          {errorMsg}
        </div>
      )}

      {/* Add Address Form */}
      {showAddForm && (
        <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">Add New Address</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Address Label *</label>
                <input
                  type="text"
                  placeholder="e.g., Home, Office"
                  value={formData.label}
                  onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  placeholder="+91 98765 43210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Street Address *</label>
              <input
                type="text"
                placeholder="123 Street Name, Apartment/Suite"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                <input
                  type="text"
                  placeholder="City"
                  value={formData.city}
                  disabled
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-500 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                <input
                  type="text"
                  placeholder="State"
                  value={formData.state}
                  disabled
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-500 bg-gray-100 cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                <input
                  type="text"
                  placeholder="000000"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Locality</label>
                <input
                  type="text"
                  placeholder="e.g., Madhapur, Andheri West"
                  value={formData.locality}
                  onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Latitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 17.4484"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Longitude</label>
                <input
                  type="number"
                  step="any"
                  placeholder="e.g., 78.3915"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                />
              </div>
            </div>
            <div className="flex gap-3 pt-4 border-t border-gray-150">
              <button
                onClick={handleAddAddress}
                disabled={isLoading}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {isLoading && <Loader2 size={16} className="animate-spin" />}
                Save Address
              </button>
              <button
                onClick={() => setShowAddForm(false)}
                disabled={isLoading}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 font-semibold rounded-lg hover:bg-gray-300 transition disabled:opacity-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Addresses Grid */}
      {addresses.length === 0 ? (
        <div className="bg-white rounded-xl shadow-md p-8 text-center border border-gray-100">
          <p className="text-gray-500">No addresses saved yet. Click 'Add Address' to get started!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((addr: any) => (
            <div
              key={addr._id}
              className={`rounded-xl p-6 border-2 transition ${
                addr.isDefault
                  ? 'bg-orange-50/50 border-orange-300'
                  : 'bg-white border-gray-200 hover:border-orange-200'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <MapPin className="text-orange-500" size={24} />
                  <h3 className="text-lg font-bold text-gray-900">{addr.label}</h3>
                </div>
                {addr.isDefault && (
                  <span className="px-3 py-1 bg-orange-500 text-white text-xs font-semibold rounded-full shadow-sm">
                    Default
                  </span>
                )}
              </div>

              <p className="text-gray-700 font-medium mb-1">{addr.street}</p>
              <p className="text-gray-600 text-sm mb-1">
                {addr.locality && `${addr.locality}, `}{addr.city}, {addr.state} {addr.pincode}
              </p>
              {addr.latitude !== undefined && addr.longitude !== undefined && (
                <p className="text-gray-500 text-xs mb-3 font-mono">
                  Coordinates: {addr.latitude}, {addr.longitude}
                </p>
              )}
              {addr.phone && <p className="text-gray-600 text-sm mb-4">Phone: {addr.phone}</p>}

              <div className="flex gap-3 pt-4 border-t border-gray-150">
                <button
                  onClick={() => handleSetDefault(addr._id)}
                  disabled={addr.isDefault || actionId !== null}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg font-semibold transition ${
                    addr.isDefault
                      ? 'bg-orange-500 text-white cursor-default shadow-sm'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50'
                  }`}
                >
                  {actionId === addr._id && <Loader2 size={16} className="animate-spin" />}
                  {addr.isDefault ? 'Default Address' : 'Set as Default'}
                </button>
                <button
                  onClick={() => handleDeleteAddress(addr._id)}
                  disabled={actionId !== null}
                  className="p-2 text-red-600 hover:bg-red-50 disabled:opacity-50 rounded-lg transition"
                >
                  {actionId === addr._id ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Trash2 size={18} />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
