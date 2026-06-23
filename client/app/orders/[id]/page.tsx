'use client'

import { useState, useEffect, use, useRef } from 'react'
import Navbar from '@/components/navbar'
import Footer from '@/components/footer'
import { apiCall, isAuthenticated, getToken } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Clock, MapPin, CheckCircle, Package, Truck, Smile, AlertCircle, Lock, Wifi, WifiOff } from 'lucide-react'
import { io, Socket } from 'socket.io-client'

const loadRazorpayScript = () => {
  return new Promise<boolean>((resolve) => {
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

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: orderId } = use(params)
  const [order, setOrder] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isPaying, setIsPaying] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [selectedUpiApp, setSelectedUpiApp] = useState<string>('gpay')
  const [isSocketConnected, setIsSocketConnected] = useState(false)
  const socketRef = useRef<Socket | null>(null)
  const router = useRouter()

  const fetchOrderDetails = async (showLoader = false) => {
    try {
      if (showLoader) setIsLoading(true)
      const res = await apiCall(`/orders/${orderId}`)
      const json = await res.json()
      if (json.success && json.data) {
        console.log(`[Poll] ${new Date().toLocaleTimeString()} | Status: ${json.data.status} | Payment: ${json.data.paymentStatus}`)
        setOrder(json.data)
        setError(null)
      } else {
        if (showLoader) {
          setError(json.message || 'Failed to load order details')
        }
      }
    } catch (err: any) {
      console.error('[Poll Error]', err)
      if (showLoader) {
        setError(err.message || 'Connection error')
      }
    } finally {
      if (showLoader) setIsLoading(false)
    }
  }

  const handleSimulatePayment = async () => {
    try {
      setIsPaying(true)
      setPaymentError(null)
      const res = await apiCall(`/orders/${orderId}/pay`, {
        method: 'PUT',
      })
      const json = await res.json()
      if (json.success && json.data) {
        setOrder(json.data)
        // After paying, re-subscribe socket to catch updates
        if (socketRef.current?.connected) {
          socketRef.current.emit('join-order', orderId)
        }
      } else {
        setPaymentError(json.message || 'Payment simulation failed')
      }
    } catch (err: any) {
      console.error(err)
      setPaymentError(err.message || 'Connection error during payment')
    } finally {
      setIsPaying(false)
    }
  }

  const handleRazorpayPayment = async () => {
    try {
      setIsPaying(true)
      setPaymentError(null)

      const scriptLoaded = await loadRazorpayScript()
      if (!scriptLoaded) {
        setPaymentError('Failed to load Razorpay SDK. Please check your internet connection.')
        setIsPaying(false)
        return
      }

      const res = await apiCall('/payment/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId }),
      })
      const json = await res.json()
      if (!json.success || !json.data) {
        setPaymentError(json.message || 'Failed to create payment order')
        setIsPaying(false)
        return
      }

      const { razorpayOrderId, amount, currency, key } = json.data

      const options = {
        key: key,
        amount: amount,
        currency: currency,
        name: 'Taste Pilot',
        description: `Order Payment for #${orderId.substring(0, 12)}`,
        order_id: razorpayOrderId,
        handler: async function (response: any) {
          try {
            setIsPaying(true)
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
            if (verifyJson.success && verifyJson.data?.order) {
              setOrder(verifyJson.data.order)
            } else {
              setPaymentError(verifyJson.message || 'Payment verification failed')
            }
          } catch (verifyErr: any) {
            console.error(verifyErr)
            setPaymentError(verifyErr.message || 'Error verifying payment')
          } finally {
            setIsPaying(false)
          }
        },
        prefill: {
          name: order?.user?.name || '',
          email: order?.user?.email || '',
        },
        theme: {
          color: '#f97316',
        },
        modal: {
          ondismiss: function () {
            setIsPaying(false)
          }
        }
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.open()
    } catch (err: any) {
      console.error(err)
      setPaymentError(err.message || 'An error occurred during checkout setup')
      setIsPaying(false)
    }
  }

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push('/auth/login')
      return
    }

    // Initial fetch
    fetchOrderDetails(true)

    // Polling fallback every 4 seconds
    const interval = setInterval(() => {
      fetchOrderDetails(false)
    }, 4000)

    // Setup Socket.IO for real-time updates
    const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'
    const token = getToken()
    const socket: Socket = io(apiBase, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionAttempts: 5,
      reconnectionDelay: 2000,
    })

    socketRef.current = socket

    socket.on('connect', () => {
      console.log('[Socket] Connected:', socket.id)
      setIsSocketConnected(true)
      socket.emit('join-order', orderId)
    })

    socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
      setIsSocketConnected(false)
    })

    socket.on('joined-order', ({ orderId: joinedId }: any) => {
      console.log('[Socket] Joined order room:', joinedId)
    })

    socket.on('order-status-updated', (updatedOrder: any) => {
      if (updatedOrder._id === orderId || updatedOrder._id?.toString() === orderId) {
        console.log(`[Socket] Real-time update | Status: ${updatedOrder.status} | Payment: ${updatedOrder.paymentStatus}`)
        setOrder(updatedOrder)
      }
    })

    socket.on('order-created', (createdOrder: any) => {
      if (createdOrder._id === orderId || createdOrder._id?.toString() === orderId) {
        setOrder(createdOrder)
      }
    })

    return () => {
      clearInterval(interval)
      socket.emit('leave-order', orderId)
      socket.disconnect()
    }
  }, [orderId])

  const steps = [
    { label: 'Placed', icon: CheckCircle, desc: 'Order received by restaurant' },
    { label: 'Preparing', icon: Package, desc: 'Chef is cooking your meal' },
    { label: 'Out for Delivery', icon: Truck, desc: 'Rider is on the way' },
    { label: 'Delivered', icon: Smile, desc: 'Enjoy your delicious meal!' },
  ]

  const getStepIndex = (status: string) => {
    switch (status) {
      case 'Placed': return 0
      case 'Preparing': return 1
      case 'Out for Delivery': return 2
      case 'Delivered': return 3
      default: return -1
    }
  }

  const isUpiPending = order && order.paymentMethod === 'UPI' && order.paymentStatus === 'pending'
  const activeStepIndex = (order && !isUpiPending) ? getStepIndex(order.status) : -1

  return (
    <main className="min-h-screen w-full bg-gray-50 flex flex-col justify-between">
      <div>
        <Navbar />
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
          
          {/* Back Link */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.push('/orders')}
              className="flex items-center gap-2 text-orange-500 hover:text-orange-600 transition font-medium"
            >
              <ArrowLeft size={16} />
              Back to My Orders
            </button>
            {/* Socket connection indicator */}
            <div className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full ${isSocketConnected ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
              {isSocketConnected ? <Wifi size={12} /> : <WifiOff size={12} />}
              {isSocketConnected ? 'Live' : 'Polling'}
            </div>
          </div>

          {isLoading ? (
            <div className="bg-white p-12 rounded-xl border border-gray-250 animate-pulse space-y-6 text-center">
              <div className="h-6 bg-gray-200 rounded w-1/3 mx-auto"></div>
              <div className="h-32 bg-gray-100 rounded"></div>
              <div className="h-20 bg-gray-150 rounded w-2/3 mx-auto"></div>
            </div>
          ) : error ? (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <AlertCircle className="mx-auto text-red-500 w-12 h-12 mb-4" />
              <p className="text-red-500 text-lg mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition font-medium"
              >
                Retry
              </button>
            </div>
          ) : order ? (
            <div className="space-y-6">
              
              {/* Header Box */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID: #{order._id.substring(0, 12)}</p>
                  <h2 className="text-2xl font-bold text-gray-900 mt-1">{order.restaurant?.name || 'Restaurant'}</h2>
                  <p className="text-sm text-gray-600 mt-1">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-left md:text-right">
                  <span className="text-sm text-gray-600 block">
                    {order.paymentMethod === 'COD' ? 'Pay on Delivery' : 'Online Payment'}
                  </span>
                  <span className="text-2xl font-bold text-orange-500 block">₹{order.totalAmount}</span>
                  <span className={`text-xs font-semibold mt-1 block ${order.paymentStatus === 'paid' ? 'text-green-600' : 'text-amber-600'}`}>
                    {order.paymentStatus === 'paid' ? '✓ Payment Confirmed' : '⏳ Payment Pending'}
                  </span>
                </div>
              </div>

              {isUpiPending && (
                <div className="bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 rounded-2xl p-6 shadow-md space-y-6 animate-fadeIn">
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-orange-100 text-orange-600 rounded-xl">
                      <Lock className="w-6 h-6 animate-pulse" />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-950">Confirm Payment via UPI</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Complete the payment below to start preparing and tracking your order.
                      </p>
                    </div>
                  </div>

                  {paymentError && (
                    <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
                      {paymentError}
                    </div>
                  )}

                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-gray-500">Select UPI Application</label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {[
                        { id: 'gpay', name: 'Google Pay', color: 'border-blue-500 bg-blue-50/50 text-blue-700', activeIcon: '🔵' },
                        { id: 'phonepe', name: 'PhonePe', color: 'border-purple-500 bg-purple-50/50 text-purple-700', activeIcon: '🟣' },
                        { id: 'paytm', name: 'Paytm', color: 'border-cyan-500 bg-cyan-50/50 text-cyan-700', activeIcon: '💎' },
                        { id: 'bhim', name: 'BHIM UPI', color: 'border-emerald-500 bg-emerald-50/50 text-emerald-700', activeIcon: '🟢' },
                      ].map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedUpiApp(app.id)}
                          className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 transition ${
                            selectedUpiApp === app.id
                              ? `${app.color} font-bold scale-102`
                              : 'bg-white border-gray-200 hover:bg-gray-50 text-gray-700'
                          }`}
                        >
                          <span className="text-2xl mb-1">{app.activeIcon}</span>
                          <span className="text-xs">{app.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white/80 border border-orange-100 rounded-xl p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 animate-fadeIn">
                    <div>
                      <span className="text-xs text-gray-500 block uppercase font-semibold">Amount to Pay</span>
                      <span className="text-2xl font-black text-gray-900">₹{order.totalAmount}</span>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      <button
                        onClick={handleRazorpayPayment}
                        disabled={isPaying}
                        className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-md hover:shadow-lg w-full sm:w-auto active:scale-98 cursor-pointer"
                      >
                        💳 Pay with Razorpay
                      </button>
                      <button
                        onClick={handleSimulatePayment}
                        disabled={isPaying}
                        className="px-5 py-3 bg-white hover:bg-gray-50 text-orange-500 border border-orange-200 hover:border-orange-300 font-bold rounded-xl transition disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto active:scale-98 cursor-pointer"
                      >
                        {isPaying ? '⏳ Processing...' : '⚡ Simulate Payment'}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Status Tracker Panel */}
              <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-gray-900 text-lg">Delivery Progress</h3>
                  {!isUpiPending && order.status !== 'Cancelled' && order.status !== 'Delivered' && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full animate-pulse">
                      Updating in real-time...
                    </span>
                  )}
                </div>

                {isUpiPending && (
                  <div className="mb-6 p-4 bg-amber-50 rounded-lg border border-amber-200 flex items-start gap-3 text-amber-800">
                    <Lock size={20} className="mt-0.5 text-amber-600" />
                    <div>
                      <p className="font-bold text-sm">Delivery Tracking is Locked</p>
                      <p className="text-xs mt-0.5 text-amber-700">Please complete the UPI payment above to begin tracking and processing your order.</p>
                    </div>
                  </div>
                )}
                
                {order.status === 'Cancelled' ? (
                  <div className="p-4 bg-red-50 rounded-lg border border-red-200 flex items-center gap-3 text-red-700">
                    <AlertCircle size={24} />
                    <div>
                      <p className="font-bold">This order has been cancelled</p>
                      {order.cancelReason && <p className="text-sm mt-0.5">Reason: {order.cancelReason}</p>}
                    </div>
                  </div>
                ) : (
                  <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 mt-4">
                    {/* Background Progress Line */}
                    <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 -translate-y-1/2 hidden md:block z-0" />
                    {activeStepIndex >= 0 && (
                      <div 
                        className="absolute top-1/2 left-0 h-1 bg-orange-500 -translate-y-1/2 hidden md:block z-0 transition-all duration-700 ease-in-out" 
                        style={{ width: `${(activeStepIndex / (steps.length - 1)) * 100}%` }}
                      />
                    )}

                    {steps.map((step, idx) => {
                      const StepIcon = step.icon
                      const isCompleted = activeStepIndex >= 0 && idx <= activeStepIndex
                      const isActive = idx === activeStepIndex
                      
                      return (
                        <div key={idx} className="flex md:flex-col items-center gap-4 md:gap-2 flex-1 w-full z-10">
                          {/* Step Icon Bubble */}
                          <div
                            className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                              isCompleted 
                                ? 'bg-orange-500 border-orange-500 text-white' 
                                : 'bg-white border-gray-300 text-gray-400'
                            } ${isActive ? 'ring-4 ring-orange-100 scale-110' : ''}`}
                          >
                            <StepIcon size={20} />
                          </div>

                          {/* Step Info */}
                          <div className="text-left md:text-center">
                            <p className={`font-semibold text-sm ${isCompleted ? 'text-gray-900' : 'text-gray-400'}`}>
                              {step.label}
                            </p>
                            <p className="text-xs text-gray-500 max-w-[150px] hidden md:block mt-1">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Delivered Celebration */}
                {order.status === 'Delivered' && (
                  <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
                    <p className="text-2xl mb-1">🎉</p>
                    <p className="font-bold text-green-700">Your order has been delivered!</p>
                    <p className="text-sm text-green-600 mt-0.5">Enjoy your meal. Thank you for ordering from {order.restaurant?.name}!</p>
                  </div>
                )}
              </div>

              {/* Order Info & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Items Summary */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg border-b pb-2">Ordered Items</h3>
                  <div className="divide-y divide-gray-100">
                    {order.items.map((item: any, idx: number) => (
                      <div key={idx} className="py-2.5 flex justify-between items-center text-sm">
                        <div className="min-w-0">
                          <p className="font-medium text-gray-900 truncate">{item.name}</p>
                          <p className="text-gray-500 text-xs">₹{item.price} each</p>
                        </div>
                        <div className="text-right">
                          <span className="text-gray-600 mr-4">Qty: {item.quantity}</span>
                          <span className="font-semibold text-gray-900">₹{item.price * item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery Information */}
                <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm space-y-4">
                  <h3 className="font-bold text-gray-900 text-lg border-b pb-2">Delivery Details</h3>
                  
                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2.5">
                      <MapPin className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Delivery Address</p>
                        <p className="text-gray-600 mt-1 leading-relaxed">
                          {order.deliveryAddress?.street},<br />
                          {order.deliveryAddress?.city}, {order.deliveryAddress?.state} - {order.deliveryAddress?.pincode}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 border-t pt-3 mt-3">
                      <Clock className="text-gray-400 w-5 h-5 mt-0.5" />
                      <div>
                        <p className="font-medium text-gray-900">Estimated Delivery Time</p>
                        <p className="text-gray-600 mt-1">
                          {order.status === 'Delivered' 
                            ? 'Delivered successfully' 
                            : order.status === 'Cancelled'
                            ? 'Cancelled'
                            : 'Approx. 35 - 45 minutes'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5 border-t pt-3 mt-3">
                      <div className="w-5 h-5 mt-0.5 flex items-center justify-center">
                        <span className="text-gray-400 text-sm">💳</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Payment Method</p>
                        <p className="text-gray-600 mt-1">
                          {order.paymentMethod === 'COD' ? 'Cash on Delivery' : 'UPI / Online Payment'}
                          {' · '}
                          <span className={order.paymentStatus === 'paid' ? 'text-green-600 font-medium' : 'text-amber-600 font-medium'}>
                            {order.paymentStatus === 'paid' ? 'Paid' : 'Pending'}
                          </span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          ) : (
            <div className="bg-white p-8 rounded-xl border border-gray-200 text-center">
              <p className="text-gray-600">Order not found.</p>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </main>
  )
}
