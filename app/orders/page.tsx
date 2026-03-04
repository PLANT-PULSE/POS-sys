'use client'

import { useState } from 'react'

// Food images from placeholder services
const foodImages: Record<string, string> = {
  'Margherita Pizza': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200&h=200&fit=crop',
  'Classic Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
  'Jollof Rice': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200&h=200&fit=crop',
  'Fruit Smoothie': 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop',
  'Grilled Chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
  'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
  'Vegetable Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
  'Orange Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop',
  'Fish & Chips': 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=200&h=200&fit=crop',
  'Pasta Carbonara': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop',
  'Coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
  'Ice Cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&h=200&fit=crop',
}

const menuItems = [
  { id: 1, name: 'Margherita Pizza', price: 12.99, category: 'Fast Food' },
  { id: 2, name: 'Classic Burger', price: 8.99, category: 'Fast Food' },
  { id: 3, name: 'Jollof Rice', price: 10.99, category: 'Local Dishes' },
  { id: 4, name: 'Fruit Smoothie', price: 5.99, category: 'Drinks' },
  { id: 5, name: 'Grilled Chicken', price: 11.99, category: 'Local Dishes' },
  { id: 6, name: 'Chocolate Cake', price: 6.99, category: 'Desserts' },
  { id: 7, name: 'Vegetable Salad', price: 7.99, category: 'Local Dishes' },
  { id: 8, name: 'Orange Juice', price: 3.99, category: 'Drinks' },
  { id: 9, name: 'Fish & Chips', price: 13.99, category: 'Fast Food' },
  { id: 10, name: 'Pasta Carbonara', price: 12.99, category: 'Local Dishes' },
  { id: 11, name: 'Coffee', price: 2.99, category: 'Drinks' },
  { id: 12, name: 'Ice Cream', price: 4.99, category: 'Desserts' },
]

export default function OrdersPage() {
  const [cart, setCart] = useState<Array<{item: typeof menuItems[0], quantity: number}>>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [discount, setDiscount] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [orderComplete, setOrderComplete] = useState(false)

  const categories = ['all', 'Fast Food', 'Local Dishes', 'Drinks', 'Desserts']
  
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  const addToCart = (item: typeof menuItems[0]) => {
    const existingItem = cart.find(c => c.item.id === item.id)
    if (existingItem) {
      setCart(cart.map(c => 
        c.item.id === item.id 
          ? { ...c, quantity: c.quantity + 1 }
          : c
      ))
    } else {
      setCart([...cart, { item, quantity: 1 }])
    }
  }

  const removeFromCart = (itemId: number) => {
    const existingItem = cart.find(c => c.item.id === itemId)
    if (existingItem && existingItem.quantity > 1) {
      setCart(cart.map(c => 
        c.item.id === itemId 
          ? { ...c, quantity: c.quantity - 1 }
          : c
      ))
    } else {
      setCart(cart.filter(c => c.item.id !== itemId))
    }
  }

  const clearCart = () => {
    setCart([])
    setDiscount(0)
  }

  const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0)
  const tax = subtotal * 0.15
  const total = subtotal + tax - discount

  const handlePayNow = () => {
    if (cart.length > 0) {
      setShowPaymentModal(true)
    }
  }

  const processPayment = () => {
    if (paymentMethod) {
      setShowPaymentModal(false)
      setOrderComplete(true)
      setTimeout(() => {
        setOrderComplete(false)
        clearCart()
      }, 3000)
    }
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-shopping-cart" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Point of Sale</h1>
        </div>
      </div>

      {/* Main POS Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '2rem', marginTop: '2rem' }}>
        {/* Menu Items */}
        <div>
          {/* Category Filter */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button 
                key={cat}
                className={`btn ${activeCategory === cat ? 'btn-primary' : ''}`}
                style={{ 
                  opacity: activeCategory === cat ? 1 : 0.5,
                  background: activeCategory === cat ? 'linear-gradient(135deg, var(--primary-red) 0%, #a01730 100%)' : 'var(--secondary-cream)',
                  color: activeCategory === cat ? 'white' : 'var(--text-dark)'
                }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === 'all' ? 'All Items' : cat}
              </button>
            ))}
          </div>

          {/* Menu Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
            {filteredItems.map((item) => (
              <div 
                key={item.id}
                onClick={() => addToCart(item)}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '2px solid transparent',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(196, 30, 58, 0.15)'
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                }}
              >
                <img 
                  src={foodImages[item.name]} 
                  alt={item.name}
                  style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
                <div style={{ fontWeight: 600, marginBottom: '0.25rem', fontSize: '0.85rem' }}>{item.name}</div>
                <div style={{ color: 'var(--primary-red)', fontWeight: 700 }}>${item.price.toFixed(2)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Panel */}
        <div>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.08)',
            border: '1px solid rgba(196, 30, 58, 0.1)',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(196, 30, 58, 0.1)' }}>
              Order Summary
            </h3>
            
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                Your cart is empty
              </div>
            ) : (
              <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                {cart.map((c) => (
                  <div key={c.item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 0', borderBottom: '1px solid rgba(196, 30, 58, 0.1)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{c.item.name}</div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>${c.item.price.toFixed(2)} each</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <button 
                        onClick={() => removeFromCart(c.item.id)}
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                      >-</button>
                      <span style={{ fontWeight: 600, minWidth: 20, textAlign: 'center' }}>{c.quantity}</span>
                      <button 
                        onClick={() => addToCart(c.item)}
                        style={{ width: 28, height: 28, borderRadius: 6, border: '1px solid #ddd', background: '#fff', cursor: 'pointer' }}
                      >+</button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div style={{ height: '1px', background: 'rgba(196, 30, 58, 0.1)', margin: '1rem 0' }}></div>

            {/* Discount */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: '0.9rem', display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Discount ($)</label>
              <input 
                type="number" 
                placeholder="0.00" 
                min="0" 
                step="0.01" 
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                style={{ padding: '0.6rem', width: '100%' }} 
              />
            </div>

            {/* Summary */}
            <div style={{ marginBottom: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                <span>Tax (15%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', color: 'var(--success-green)' }}>
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderTop: '2px solid rgba(196, 30, 58, 0.2)', marginTop: '0.5rem', fontSize: '1.25rem', fontWeight: 700 }}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                onClick={handlePayNow}
                disabled={cart.length === 0}
              >
                <i className="fas fa-credit-card"></i> Pay Now
              </button>
              <button className="btn btn-secondary" style={{ width: '100%', background: 'var(--accent-gold)', color: 'var(--text-dark)' }}>
                <i className="fas fa-share-alt"></i> Split Bill
              </button>
              <button 
                className="btn" 
                style={{ width: '100%', border: '2px solid var(--primary-red)', color: 'var(--primary-red)', background: 'transparent' }}
                onClick={clearCart}
              >
                <i className="fas fa-trash"></i> Clear Cart
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Select Payment Method</h2>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #ddd' }}>
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', borderBottom: '1px solid #ddd' }}>
                <span>Tax (15%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', color: 'var(--success-green)' }}>
                  <span>Discount:</span>
                  <span>-${discount.toFixed(2)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Payment Method:</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
                {['Cash', 'Card', 'Mobile Payment', 'Check'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '1rem',
                      border: paymentMethod === method ? '2px solid var(--primary-red)' : '2px solid #ddd',
                      borderRadius: '8px',
                      background: paymentMethod === method ? 'rgba(196, 30, 58, 0.1)' : 'white',
                      cursor: 'pointer',
                      fontWeight: 600,
                      transition: 'all 0.2s'
                    }}
                  >
                    {method === 'Cash' && '💵'} {method === 'Card' && '💳'} {method === 'Mobile Payment' && '📱'} {method === 'Check' && '📝'} {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }}
                onClick={processPayment}
                disabled={!paymentMethod}
              >
                <i className="fas fa-check"></i> Complete Payment
              </button>
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }}
                onClick={() => setShowPaymentModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Order Complete Toast */}
      {orderComplete && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--success-green)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 1001,
          animation: 'slideIn 0.3s ease'
        }}>
          <i className="fas fa-check-circle"></i> Payment Successful! Order Completed.
        </div>
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 1200px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr 320px !important;
          }
        }
        @media (max-width: 900px) {
          div[style*="grid-template-columns: 1fr 380px"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
          }
        }
        @media (max-width: 600px) {
          div[style*="grid-template-columns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `}</style>
    </>
  )
}
