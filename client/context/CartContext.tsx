'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image?: string
  isVeg?: boolean
}

interface CartContextType {
  cartItems: CartItem[]
  restaurantId: string | null
  restaurantName: string | null
  addToCart: (item: any, resId: string, resName: string) => void
  removeFromCart: (itemId: string) => void
  updateQuantity: (itemId: string, quantity: number) => void
  clearCart: () => void
  totalPrice: number
  totalItems: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [restaurantId, setRestaurantId] = useState<string | null>(null)
  const [restaurantName, setRestaurantName] = useState<string | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedCart = localStorage.getItem('cartItems')
      const storedResId = localStorage.getItem('cartRestaurantId')
      const storedResName = localStorage.getItem('cartRestaurantName')

      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart))
        } catch (e) {
          console.error('Error parsing cart items', e)
        }
      }
      if (storedResId) setRestaurantId(storedResId)
      if (storedResName) setRestaurantName(storedResName)
    }
  }, [])

  // Sync cart to localStorage whenever it changes
  const saveCartToStorage = (items: CartItem[], resId: string | null, resName: string | null) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('cartItems', JSON.stringify(items))
      if (resId) {
        localStorage.setItem('cartRestaurantId', resId)
      } else {
        localStorage.removeItem('cartRestaurantId')
      }
      if (resName) {
        localStorage.setItem('cartRestaurantName', resName)
      } else {
        localStorage.removeItem('cartRestaurantName')
      }
    }
  }

  const addToCart = (item: any, resId: string, resName: string) => {
    setCartItems((prevItems) => {
      // If adding item from a different restaurant, clear previous cart items
      if (restaurantId && restaurantId !== resId) {
        const confirmClear = window.confirm(
          `Your cart contains items from "${restaurantName}". Clear cart and add items from "${resName}"?`
        )
        if (!confirmClear) return prevItems

        const newItems = [{ ...item, quantity: 1 }]
        setRestaurantId(resId)
        setRestaurantName(resName)
        saveCartToStorage(newItems, resId, resName)
        return newItems
      }

      let newItems = [...prevItems]
      const existingItem = prevItems.find((i) => i.id === item.id)

      if (existingItem) {
        newItems = prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        )
      } else {
        newItems = [...prevItems, { ...item, quantity: 1 }]
      }

      setRestaurantId(resId)
      setRestaurantName(resName)
      saveCartToStorage(newItems, resId, resName)
      return newItems
    })
  }

  const removeFromCart = (itemId: string) => {
    setCartItems((prevItems) => {
      const newItems = prevItems.filter((i) => i.id !== itemId)
      const nextResId = newItems.length === 0 ? null : restaurantId
      const nextResName = newItems.length === 0 ? null : restaurantName

      if (newItems.length === 0) {
        setRestaurantId(null)
        setRestaurantName(null)
      }

      saveCartToStorage(newItems, nextResId, nextResName)
      return newItems
    })
  }

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId)
      return
    }

    setCartItems((prevItems) => {
      const newItems = prevItems.map((i) =>
        i.id === itemId ? { ...i, quantity } : i
      )
      saveCartToStorage(newItems, restaurantId, restaurantName)
      return newItems
    })
  }

  const clearCart = () => {
    setCartItems([])
    setRestaurantId(null)
    setRestaurantName(null)
    saveCartToStorage([], null, null)
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        restaurantId,
        restaurantName,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
