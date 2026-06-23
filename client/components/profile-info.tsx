'use client'

import { useState, useEffect } from 'react'
import { Edit2, Mail, Phone, MapPin, Calendar, CheckCircle } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { apiCall } from '@/lib/auth'

const AVATARS = [
  '/avatars/male_1.png',
  '/avatars/male_2.png',
  '/avatars/male_3.png',
  '/avatars/male_4.png',
  '/avatars/male_5.png',
  '/avatars/female_1.png',
  '/avatars/female_2.png',
  '/avatars/female_3.png',
  '/avatars/female_4.png',
  '/avatars/female_5.png',
]

export default function ProfileInfo() {
  const { user, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dob: '',
    avatar: '/avatars/male_1.png',
  })

  // Sync profile details when user context loads
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        dob: user.dob ? new Date(user.dob).toISOString().split('T')[0] : '',
        avatar: user.avatar || '/avatars/male_1.png',
      })
    }
  }, [user])

  const handleSave = async () => {
    try {
      setIsLoading(true)
      setSuccessMsg(null)
      setErrorMsg(null)

      const res = await apiCall('/auth/profile', {
        method: 'PUT',
        body: JSON.stringify(formData),
      })

      const json = await res.json()

      if (res.ok && json.success) {
        await refreshUser()
        setSuccessMsg('Profile updated successfully!')
        setIsEditing(false)
        setTimeout(() => setSuccessMsg(null), 3000)
      } else {
        setErrorMsg(json.message || 'Failed to update profile')
      }
    } catch (err: any) {
      console.error(err)
      setErrorMsg(err.message || 'An error occurred while saving profile')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100 animate-pulse space-y-4">
        <div className="h-6 bg-gray-200 rounded w-1/4"></div>
        <div className="h-20 bg-gray-100 rounded"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
        <button
          onClick={() => {
            setErrorMsg(null)
            setIsEditing(!isEditing)
          }}
          className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition"
        >
          <Edit2 size={18} />
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {successMsg && (
        <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg flex items-center gap-2">
          <CheckCircle size={16} />
          {successMsg}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {errorMsg}
        </div>
      )}

      {/* Profile Card */}
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        {!isEditing ? (
          <>
            {/* Display Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex items-start gap-4">
                {/* Circular Avatar */}
                <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 border-2 border-orange-500 shadow">
                  <img
                    src={user.avatar || '/avatars/male_1.png'}
                    alt="Profile Avatar"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
                  <p className="text-gray-500">Member since {user.createdAt ? new Date(user.createdAt).getFullYear() : '2026'}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="text-gray-900 font-medium">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="text-orange-500" size={20} />
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p className="text-gray-900 font-medium">{user.phone || 'Not provided'}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <MapPin className="text-orange-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Default Address</p>
                  <p className="text-gray-900 font-medium">
                    {user.addresses?.find((addr: any) => addr.isDefault)?.street || 'None saved'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <Calendar className="text-orange-500" size={20} />
                <div>
                  <p className="text-sm text-gray-500">Date of Birth</p>
                  <p className="text-gray-900 font-medium">
                    {user.dob
                      ? new Date(user.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      : 'Not provided'}
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Edit Mode */}
            <div className="space-y-6">
              {/* Avatar Selector Grid */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Choose Avatar</label>
                <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
                  {AVATARS.map((avatarUrl) => (
                    <button
                      key={avatarUrl}
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, avatar: avatarUrl }))}
                      className={`relative aspect-square rounded-full overflow-hidden border-4 transition ${
                        formData.avatar === avatarUrl
                          ? 'border-orange-500 scale-105 shadow'
                          : 'border-gray-200 hover:border-orange-200'
                      }`}
                    >
                      <img src={avatarUrl} alt="Avatar option" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                  <input
                    type="email"
                    name="email"
                    disabled
                    value={user.email}
                    className="w-full px-4 py-2 border border-gray-200 bg-gray-100 rounded-lg text-gray-500 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Date of Birth</label>
                  <input
                    type="date"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-gray-900 bg-white"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                disabled={isLoading}
                className="w-full px-4 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition disabled:opacity-50"
              >
                {isLoading ? 'Saving Changes...' : 'Save Changes'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
