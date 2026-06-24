'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { useCart } from '@/context/CartContext'
import { apiCall, isAuthenticated } from '@/lib/auth'
import { useAuth } from '@/context/AuthContext'
import { Trash2, Plus, Minus, ShoppingBag, MapPin, CreditCard, ChevronRight } from 'lucide-react'
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && (window as any).Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function CartPage() {
  const { cartItems, restaurantId, restaurantName, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const router = useRouter()
  
  const [address, setAddress] = useState({
    street: '',
    city: 'Raipur',
    state: 'Chhattisgarh',
    pincode: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'UPI'>('COD')

  useEffect(() => {
    const defaultAddress = user?.addresses?.find((a: any) => a.isDefault)
    if (defaultAddress) {
      setAddress({
        street: defaultAddress.street || '',
        city: 'Raipur',
        state: 'Chhattisgarh',
        pincode: defaultAddress.pincode || '',
      })
    }
  }, [user])

  const deliveryFee = totalPrice > 500 ? 0 : 30
  const finalTotal = totalPrice + deliveryFee

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setAddress((prev) => ({ ...prev, [name]: value }))
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault()
    
    if (!isAuthenticated()) {
      alert('Please log in to place an order.')
      router.push('/auth/login')
      return
    }

    if (!address.street.trim() || !address.pincode.trim()) {
      setError('Please fill in your street and pincode details.')
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const payload = {
        restaurantId,
        items: cartItems.map((item) => ({
          menuItemId: item.id,
          quantity: item.quantity,
        })),
        deliveryAddress: {
          street: address.street.trim(),
          city: address.city,
          state: address.state,
          pincode: address.pincode.trim(),
        },
        paymentMethod,
      }

      // 1. Stage order in backend
      const res = await apiCall('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      })

      const json = await res.json()

      if (!res.ok || !json.success) {
        setError(json.message || 'Failed to place order')
        setIsLoading(false)
        return
      }

      const orderId = json.data._id

      // 2. COD flow
      if (paymentMethod === 'COD') {
        clearCart()
        alert('Order placed successfully!')
        router.push(`/orders/${orderId}`)
      } else {
        // UPI flow (Razorpay)
        const scriptLoaded = await loadRazorpayScript()
        if (!scriptLoaded) {
          setError('Failed to load Razorpay SDK. Please check your internet connection.')
          setIsLoading(false)
          return
        }

        const rzpOrderRes = await apiCall('/payment/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ orderId }),
        })
        const rzpOrderJson = await rzpOrderRes.json()
        if (!rzpOrderRes.ok || !rzpOrderJson.success) {
          setError(rzpOrderJson.message || 'Failed to create payment order.')
          setIsLoading(false)
          return
        }

        const { razorpayOrderId, amount, currency, key } = rzpOrderJson.data

        const options = {
          key: key,
          amount: amount,
          currency: currency,
          name: 'Taste Pilot',
          description: `Order Payment for #${orderId.substring(0, 12)}`,
          order_id: razorpayOrderId,
          handler: async function (response: any) {
            try {
              setIsLoading(true)
              const verifyRes = await apiCall('/payment/verify', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  razorpayOrderId: response.razorpay_order_id,
                  razorpayPaymentId: response.razorpay_payment_id,
                  razorpaySignature: response.razorpay_signature,
                }),
              })
              const verifyJson = await verifyRes.json()
              if (verifyJson.success) {
                clearCart()
                alert('Order placed and paid successfully!')
                router.push(`/orders/${orderId}`)
              } else {
                setError(verifyJson.message || 'Payment verification failed.')
              }
            } catch (verifyErr: any) {
              console.error(verifyErr)
              setError(verifyErr.message || 'Error verifying payment.')
            } finally {
              setIsLoading(false)
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
          },
          theme: {
            color: '#f97316',
          },
          modal: {
            ondismiss: async function () {
              setIsLoading(true)
              try {
                // Cancel the staged order since checkout was dismissed
                await apiCall(`/orders/${orderId}/cancel`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ reason: 'Payment cancelled during checkout' }),
                })
                setError('Payment was cancelled. Order not placed.')
              } catch (cancelErr) {
                console.error('Failed to cancel order after payment dismissal:', cancelErr)
                setError('Payment was cancelled.')
              } finally {
                setIsLoading(false)
              }
            }
          }
        }

        const rzp = new (window as any).Razorpay(options)
        rzp.open()
      }
    } catch (err: any) {
      console.error(err)
      setError(err.message || 'An error occurred while placing order')
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Shopping Cart</h1>

          {cartItems.length === 0 ? (
            <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-md p-10 text-center border border-gray-150">
              <div className="text-6xl mb-6">🛒</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-600 mb-8">Looks like you haven't added anything to your cart yet</p>
              <a 
                href="/restaurants" 
                className="px-6 py-3 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Browse Restaurants
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Left Column: Cart items and Delivery details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Restaurant Header */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                  <p className="text-xs font-semibold text-orange-500 uppercase tracking-wider">Ordering From</p>
                  <h2 className="text-xl font-bold text-gray-900 mt-1">{restaurantName}</h2>
                </div>

                {/* Cart Items List */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900">Items in Cart</h3>
                    <span className="text-sm text-gray-600">{cartItems.length} unique item(s)</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {cartItems.map((item) => (
                      <div key={item.id} className="p-4 flex items-center justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            {item.isVeg !== undefined && (
                              <span className={`w-3 h-3 rounded-full ${item.isVeg ? 'bg-green-500' : 'bg-red-500'} inline-block`} />
                            )}
                            <h4 className="font-semibold text-gray-900 truncate">{item.name}</h4>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">₹{item.price} each</p>
                        </div>

                        {/* Quantity Adjusters */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="font-semibold text-gray-900 w-6 text-center">{item.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 rounded-md border border-gray-300 hover:bg-gray-100 text-gray-700"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        {/* Price & Remove */}
                        <div className="flex items-center gap-4">
                          <span className="font-bold text-gray-900 w-16 text-right">
                            ₹{item.price * item.quantity}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-gray-400 hover:text-red-500 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Address Form */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <MapPin className="text-orange-500 w-5 h-5" />
                    <h3 className="font-bold text-gray-900 text-lg">Delivery Address</h3>
                  </div>
                  
                  {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handlePlaceOrder} className="space-y-4">
                    <div>
                      <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        name="street"
                        id="street"
                        required
                        value={address.street}
                        onChange={handleInputChange}
                        placeholder="e.g. Flat 302, Gachibowli Heights"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          name="city"
                          id="city"
                          required
                          disabled
                          value={address.city}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-500 bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                          State
                        </label>
                        <input
                          type="text"
                          name="state"
                          id="state"
                          required
                          disabled
                          value={address.state}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none text-gray-500 bg-gray-100 cursor-not-allowed"
                        />
                      </div>
                      <div>
                        <label htmlFor="pincode" className="block text-sm font-medium text-gray-700 mb-1">
                          Pincode
                        </label>
                        <input
                          type="text"
                          name="pincode"
                          id="pincode"
                          required
                          value={address.pincode}
                          onChange={handleInputChange}
                          placeholder="e.g. 500032"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-gray-900 bg-white"
                        />
                      </div>
                    </div>
                  </form>
                </div>
              </div>

              {/* Right Column: Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-24 space-y-6">
                  <h3 className="font-bold text-gray-900 text-lg border-b pb-3">Order Summary</h3>

                  <div className="space-y-3 text-sm text-gray-700">
                    <div className="flex justify-between">
                      <span>Items Subtotal</span>
                      <span className="font-medium text-gray-900">₹{totalPrice}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee</span>
                      <span>{deliveryFee === 0 ? <span className="text-green-600 font-medium">FREE</span> : `₹${deliveryFee}`}</span>
                    </div>
                    {deliveryFee > 0 && (
                      <p className="text-xs text-gray-500">Free delivery on orders above ₹500</p>
                    )}
                    <div className="border-t pt-3 flex justify-between text-base font-bold text-gray-900">
                      <span>Total Amount</span>
                      <span className="text-orange-500">₹{finalTotal}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Select Payment Method</label>
                    <div className="grid grid-cols-1 gap-3">
                      {/* Cash on Delivery option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('COD')}
                        className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 ${
                          paymentMethod === 'COD'
                            ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-full bg-orange-100 text-orange-600">
                          <CreditCard size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">Cash on Delivery (COD)</p>
                          <p className="text-xs text-gray-600 mt-0.5">Pay at your doorstep upon food delivery.</p>
                        </div>
                      </button>

                      {/* UPI Payment option */}
                      <button
                        type="button"
                        onClick={() => setPaymentMethod('UPI')}
                        className={`w-full text-left p-4 rounded-xl border transition flex items-start gap-3 ${
                          paymentMethod === 'UPI'
                            ? 'bg-orange-50 border-orange-500 ring-2 ring-orange-200'
                            : 'bg-white border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="mt-0.5 p-1.5 rounded-full bg-orange-100 text-orange-600">
                          <ShoppingBag size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-gray-900">UPI / Online Payment</p>
                          <p className="text-xs text-gray-600 mt-0.5">Pay instantly using any UPI app (Google Pay, PhonePe, Paytm, etc.).</p>
                        </div>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handlePlaceOrder}
                    disabled={isLoading}
                    className="w-full py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isLoading ? 'Placing Order...' : 'Place Order'}
                    {!isLoading && <ChevronRight size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </main>
  )
}