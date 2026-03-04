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

// Table data
const tables = [
  { id: 1, status: 'occupied', guest: 'John Doe', capacity: 4 },
  { id: 2, status: 'available', capacity: 2 },
  { id: 3, status: 'occupied', guest: 'Jane Smith', capacity: 6 },
  { id: 4, status: 'reserved', guest: 'Mike Johnson', capacity: 4 },
  { id: 5, status: 'available', capacity: 8 },
  { id: 6, status: 'cleaning', capacity: 4 },
  { id: 7, status: 'available', capacity: 2 },
  { id: 8, status: 'occupied', guest: 'Sarah Williams', capacity: 6 },
]

// Staff/Waiters
const waiters = [
  { id: 1, name: 'Waiter Smith', initials: 'WS' },
  { id: 2, name: 'Barista Jones', initials: 'BJ' },
  { id: 3, name: 'Driver Wilson', initials: 'DW' },
]

interface CartItem {
  item: typeof menuItems[0]
  quantity: number
}

interface Order {
  id: number
  tableId: number | null
  tableName: string
  items: CartItem[]
  waiter: string
  status: 'Open' | 'Sent to Kitchen' | 'Ready' | 'Served' | 'Paid'
  subtotal: number
  tax: number
  discount: number
  total: number
  createdAt: Date
  paidAmount: number
}

export default function OrdersPage() {
  const [orderMode, setOrderMode] = useState<'counter' | 'table'>('counter')
  const [cart, setCart] = useState<CartItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [discount, setDiscount] = useState(0)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState('')
  const [orderComplete, setOrderComplete] = useState(false)
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('')
  const [showSearchResults, setShowSearchResults] = useState(false)
  
  // Table Selection (available in both modes now)
  const [selectedTable, setSelectedTable] = useState<{id: number, name: string} | null>(null)
  const [selectedWaiter, setSelectedWaiter] = useState(waiters[0].name)
  const [showTableSelector, setShowTableSelector] = useState(false)
  const [openOrders, setOpenOrders] = useState<Order[]>([])
  const [showActiveTables, setShowActiveTables] = useState(false)
  const [showBillPreview, setShowBillPreview] = useState(false)
  const [showSplitModal, setShowSplitModal] = useState(false)
  const [splitType, setSplitType] = useState<'equal' | 'custom' | null>(null)
  const [splitCount, setSplitCount] = useState(2)
  const [partialPayment, setPartialPayment] = useState(0)
  const [kitchenNotification, setKitchenNotification] = useState(false)
  const [showKitchenAnim, setShowKitchenAnim] = useState(false)

  const categories = ['all', 'Fast Food', 'Local Dishes', 'Drinks', 'Desserts']
  
  // Search results filtering
  const searchResults = searchQuery.length > 0 
    ? menuItems.filter(item => 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.category.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : []
  
  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => item.category === activeCategory)

  const addToCart = (item: typeof menuItems[0]) => {
    if (!selectedTable) {
      // If no table selected, show table selector in both modes
      setShowTableSelector(true)
      return
    }
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
    setShowSearchResults(false)
    setSearchQuery('')
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
    setSelectedTable(null)
  }

  const subtotal = cart.reduce((sum, c) => sum + (c.item.price * c.quantity), 0)
  const tax = subtotal * 0.15
  const total = subtotal + tax - discount

  // Table Selection function
  const selectTable = (table: typeof tables[0]) => {
    setSelectedTable({ id: table.id, name: `Table ${table.id}` })
    setShowTableSelector(false)
  }

  const saveAsOpenOrder = () => {
    if (cart.length === 0) return
    const newOrder: Order = {
      id: Date.now(),
      tableId: selectedTable?.id || null,
      tableName: selectedTable?.name || 'Counter',
      items: [...cart],
      waiter: selectedWaiter,
      status: 'Open',
      subtotal,
      tax,
      discount,
      total,
      createdAt: new Date(),
      paidAmount: 0
    }
    setOpenOrders([...openOrders, newOrder])
    setCart([])
    setDiscount(0)
    setSelectedTable(null)
    setOrderComplete(true)
    setTimeout(() => setOrderComplete(false), 3000)
  }

  const sendToKitchen = () => {
    if (cart.length === 0) return
    setShowKitchenAnim(true)
    setKitchenNotification(true)
    setTimeout(() => setShowKitchenAnim(false), 2000)
  }

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

  const processPartialPayment = () => {
    if (partialPayment > 0) {
      alert(`Partial payment of $${partialPayment.toFixed(2)} received!`)
      setPartialPayment(0)
      setShowPaymentModal(false)
    }
  }

  const viewBill = () => {
    setShowBillPreview(true)
  }

  // Handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value)
    if (e.target.value.length > 0) {
      setShowSearchResults(true)
    } else {
      setShowSearchResults(false)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setShowSearchResults(false)
  }

  return (
    <>
      {/* Kitchen Notification Toast */}
      {kitchenNotification && (
        <div style={{
          position: 'fixed',
          top: '100px',
          right: '20px',
          background: 'var(--success-green)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 1002,
          animation: 'slideIn 0.3s ease'
        }}>
          <i className="fas fa-check-circle"></i> Order sent to kitchen!
        </div>
      )}

      {/* Kitchen Animation Overlay */}
      {showKitchenAnim && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1003,
        }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>👨‍🍳</div>
            <h2>Sending to Kitchen...</h2>
            <p>Order is being prepared</p>
          </div>
        </div>
      )}

      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-shopping-cart" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Point of Sale</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          {/* Search Bar */}
          <div style={{ position: 'relative' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              background: 'white', 
              borderRadius: '8px',
              border: '1px solid #ddd',
              padding: '0 0.75rem'
            }}>
              <i className="fas fa-search" style={{ color: '#999' }}></i>
              <input 
                type="text"
                placeholder="Search menu items..."
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => searchQuery.length > 0 && setShowSearchResults(true)}
                style={{ 
                  border: 'none', 
                  padding: '0.6rem', 
                  outline: 'none',
                  width: '200px',
                  fontSize: '0.9rem'
                }}
              />
              {searchQuery && (
                <button 
                  onClick={clearSearch}
                  style={{ 
                    border: 'none', 
                    background: 'none', 
                    cursor: 'pointer',
                    color: '#999',
                    padding: '0.25rem'
                  }}
                >
                  <i className="fas fa-times"></i>
                </button>
              )}
            </div>
            
            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                marginTop: '0.5rem',
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 100
              }}>
                {searchResults.map((item) => (
                  <div 
                    key={item.id}
                    onClick={() => addToCart(item)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      cursor: 'pointer',
                      borderBottom: '1px solid #eee',
                      transition: 'background 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#f5f5f5'}
                    onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                  >
                    <img 
                      src={foodImages[item.name]} 
                      alt={item.name}
                      style={{ 
                        width: '40px', 
                        height: '40px', 
                        objectFit: 'cover', 
                        borderRadius: '6px',
                        marginRight: '0.75rem'
                      }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none'
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.name}</div>
                      <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.category}</div>
                    </div>
                    <div style={{ fontWeight: 700, color: 'var(--primary-red)' }}>${item.price.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            )}
            
            {/* No results found */}
            {showSearchResults && searchQuery.length > 0 && searchResults.length === 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                background: 'white',
                borderRadius: '8px',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                marginTop: '0.5rem',
                padding: '1rem',
                textAlign: 'center',
                color: '#666',
                zIndex: 100
              }}>
                <i className="fas fa-search" style={{ fontSize: '1.5rem', marginBottom: '0.5rem', display: 'block' }}></i>
                No items found for "{searchQuery}"
              </div>
            )}
          </div>
          
          {/* Table Selection - Available in both modes */}
          <button 
            className="btn btn-secondary"
            onClick={() => setShowTableSelector(true)}
            style={{ 
              background: selectedTable ? 'var(--success-green)' : undefined,
              color: selectedTable ? 'white' : undefined
            }}
          >
            <i className="fas fa-chair"></i> {selectedTable ? selectedTable.name : 'Select Table'}
          </button>
          
          {/* Mode Toggle */}
          <div style={{ 
            display: 'flex', 
            background: 'var(--secondary-cream)', 
            borderRadius: '8px', 
            padding: '4px',
            gap: '4px'
          }}>
            <button
              onClick={() => setOrderMode('counter')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                background: orderMode === 'counter' ? 'var(--primary-red)' : 'transparent',
                color: orderMode === 'counter' ? 'white' : 'var(--text-dark)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-shopping-bag"></i> Counter
            </button>
            <button
              onClick={() => setOrderMode('table')}
              style={{
                padding: '0.5rem 1rem',
                border: 'none',
                borderRadius: '6px',
                background: orderMode === 'table' ? 'var(--primary-red)' : 'transparent',
                color: orderMode === 'table' ? 'white' : 'var(--text-dark)',
                cursor: 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-utensils"></i> Table Service
            </button>
          </div>
          
          {/* Active Tables Button */}
          {orderMode === 'table' && (
            <button 
              className="btn btn-secondary"
              onClick={() => setShowActiveTables(!showActiveTables)}
            >
              <i className="fas fa-chair"></i> Active Tables ({openOrders.length})
            </button>
          )}
        </div>
      </div>

      {/* Main POS Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: showActiveTables && orderMode === 'table' ? '1fr 280px 380px' : '1fr 380px', gap: '2rem', marginTop: '2rem' }}>
        {/* Menu Items */}
        <div>
          {/* Table/Waiter Selection Info Bar */}
          {selectedTable && (
            <div style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
                <div style={{ 
                  background: 'var(--accent-gold)', 
                  padding: '0.75rem 1.5rem', 
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <i className="fas fa-chair" style={{ color: 'var(--text-dark)' }}></i>
                  <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>{selectedTable.name}</span>
                </div>
                
                <select 
                  value={selectedWaiter}
                  onChange={(e) => setSelectedWaiter(e.target.value)}
                  style={{ padding: '0.75rem', borderRadius: '8px', minWidth: '180px' }}
                >
                  {waiters.map(w => (
                    <option key={w.id} value={w.name}>{w.name}</option>
                  ))}
                </select>
                <span style={{ 
                  background: 'var(--info-blue)', 
                  padding: '0.5rem 1rem', 
                  borderRadius: '20px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: 'white'
                }}>
                  Waiter: {selectedWaiter}
                </span>
              </div>
            </div>
          )}

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

        {/* Active Tables Panel - Table Service Mode */}
        {showActiveTables && orderMode === 'table' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '1.5rem',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            height: 'fit-content',
            position: 'sticky',
            top: '100px'
          }}>
            <h3 style={{ marginBottom: '1rem' }}>Active Tables</h3>
            {openOrders.length === 0 ? (
              <p style={{ color: '#999', textAlign: 'center' }}>No active orders</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {openOrders.map(order => (
                  <div 
                    key={order.id}
                    style={{
                      padding: '1rem',
                      background: 'var(--secondary-cream)',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <strong>{order.tableName}</strong>
                      <span style={{ 
                        color: order.status === 'Paid' ? 'var(--success-green)' : 'var(--warning-orange)',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}>
                        {order.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#666' }}>
                      <div>Waiter: {order.waiter}</div>
                      <div>Items: {order.items.length}</div>
                      <div>Total: ${order.total.toFixed(2)}</div>
                      <div style={{ fontSize: '0.75rem' }}>
                        {Math.floor((Date.now() - order.createdAt.getTime()) / 60000)} min ago
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

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
            {/* Table Info Header */}
            {selectedTable && (
              <div style={{ 
                background: 'var(--accent-gold)', 
                padding: '0.75rem', 
                borderRadius: '8px',
                marginBottom: '1rem',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <span style={{ fontWeight: 700, color: 'var(--text-dark)' }}>
                  <i className="fas fa-chair"></i> {selectedTable.name}
                </span>
                <span style={{ fontSize: '0.85rem', color: 'var(--text-dark)' }}>{selectedWaiter}</span>
              </div>
            )}

            <h3 style={{ marginBottom: '1rem', paddingBottom: '1rem', borderBottom: '1px solid rgba(196, 30, 58, 0.1)' }}>
              Order Summary
            </h3>
            
            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                {!selectedTable ? 'Select a table first, then add items' : 'Your cart is empty'}
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
              {/* Counter Mode Buttons */}
              {orderMode === 'counter' && (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                  onClick={handlePayNow}
                  disabled={cart.length === 0 || !selectedTable}
                >
                  <i className="fas fa-credit-card"></i> Pay Now
                </button>
              )}

              {/* Table Service Mode Buttons */}
              {orderMode === 'table' && (
                <>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                    onClick={handlePayNow}
                    disabled={cart.length === 0 || !selectedTable}
                  >
                    <i className="fas fa-credit-card"></i> Pay Now
                  </button>
                  <button 
                    className="btn" 
                    style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', background: 'var(--accent-gold)', color: 'var(--text-dark)' }}
                    onClick={saveAsOpenOrder}
                    disabled={cart.length === 0 || !selectedTable}
                  >
                    <i className="fas fa-save"></i> Save as Open
                  </button>
                  <button 
                    className="btn" 
                    style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', background: 'var(--info-blue)', color: 'white' }}
                    onClick={sendToKitchen}
                    disabled={cart.length === 0}
                  >
                    <i className="fas fa-paper-plane"></i> Send to Kitchen
                  </button>
                </>
              )}

              <button 
                className="btn btn-secondary" 
                style={{ width: '100%', fontSize: '1.1rem', padding: '1rem' }}
                onClick={() => setShowSplitModal(true)}
                disabled={cart.length === 0 || !selectedTable}
              >
                <i className="fas fa-columns"></i> Split Bill
              </button>

              {(orderMode === 'table' || selectedTable) && (
                <button 
                  className="btn" 
                  style={{ width: '100%', fontSize: '1.1rem', padding: '1rem', background: 'var(--primary-green)', color: 'white' }}
                  onClick={viewBill}
                  disabled={cart.length === 0}
                >
                  <i className="fas fa-receipt"></i> View Bill
                </button>
              )}

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

      {/* Table Selector Modal */}
      {showTableSelector && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Select Table</h2>
              <button className="modal-close" onClick={() => setShowTableSelector(false)}>×</button>
            </div>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
              <p style={{ margin: 0, fontSize: '0.9rem' }}>
                <i className="fas fa-info-circle"></i> Select a table to link this order. The order will be associated with the table for tracking and payment.
              </p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1rem' }}>
              {tables.map(table => (
                <button
                  key={table.id}
                  onClick={() => selectTable(table)}
                  style={{
                    padding: '1.5rem',
                    borderRadius: '12px',
                    border: '2px solid',
                    background: table.status === 'available' ? 'rgba(16, 185, 129, 0.1)' :
                               table.status === 'occupied' ? 'rgba(196, 30, 58, 0.1)' :
                               table.status === 'reserved' ? 'rgba(245, 158, 11, 0.1)' :
                               'rgba(139, 92, 246, 0.1)',
                    borderColor: table.status === 'available' ? '#10b981' :
                                table.status === 'occupied' ? 'var(--primary-red)' :
                                table.status === 'reserved' ? '#f59e0b' : '#8b5cf6',
                    cursor: 'pointer',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🪑</div>
                  <div style={{ fontWeight: 600 }}>Table {table.id}</div>
                  <div style={{ 
                    fontSize: '0.85rem', 
                    color: table.status === 'available' ? '#10b981' :
                           table.status === 'occupied' ? 'var(--primary-red)' :
                           table.status === 'reserved' ? '#f59e0b' : '#8b5cf6',
                    textTransform: 'capitalize'
                  }}>
                    {table.status}
                  </div>
                  {table.guest && (
                    <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                      {table.guest}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Select Payment Method</h2>
              <button className="modal-close" onClick={() => setShowPaymentModal(false)}>×</button>
            </div>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span><i className="fas fa-chair"></i> <strong>Table:</strong> {selectedTable?.name || 'N/A'}</span>
                <span><i className="fas fa-user"></i> <strong>Waiter:</strong> {selectedWaiter}</span>
              </div>
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

            {/* Partial Payment Option - Table Service */}
            {orderMode === 'table' && (
              <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>
                  <input 
                    type="checkbox" 
                    style={{ width: 'auto', marginRight: '0.5rem' }}
                    onChange={(e) => {
                      if (!e.target.checked) setPartialPayment(0)
                    }}
                  />
                  Partial Payment
                </label>
                {partialPayment > 0 && (
                  <input 
                    type="number" 
                    placeholder="Enter partial amount"
                    value={partialPayment || ''}
                    onChange={(e) => setPartialPayment(parseFloat(e.target.value) || 0)}
                    style={{ marginTop: '0.5rem' }}
                  />
                )}
              </div>
            )}

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
              {orderMode === 'table' && partialPayment > 0 ? (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={processPartialPayment}
                  disabled={!paymentMethod || partialPayment <= 0}
                >
                  <i className="fas fa-check"></i> Process Partial (${partialPayment.toFixed(2)})
                </button>
              ) : (
                <button 
                  className="btn btn-primary" 
                  style={{ flex: 1 }}
                  onClick={processPayment}
                  disabled={!paymentMethod}
                >
                  <i className="fas fa-check"></i> Complete Payment
                </button>
              )}
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

      {/* Split Bill Modal */}
      {showSplitModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Split Bill</h2>
              <button className="modal-close" onClick={() => setShowSplitModal(false)}>×</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Split Type:</label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => setSplitType('equal')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    border: splitType === 'equal' ? '2px solid var(--primary-red)' : '2px solid #ddd',
                    borderRadius: '8px',
                    background: splitType === 'equal' ? 'rgba(196, 30, 58, 0.1)' : 'white',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  <i className="fas fa-divide"></i> Equal Split
                </button>
                <button
                  onClick={() => setSplitType('custom')}
                  style={{
                    flex: 1,
                    padding: '1rem',
                    border: splitType === 'custom' ? '2px solid var(--primary-red)' : '2px solid #ddd',
                    borderRadius: '8px',
                    background: splitType === 'custom' ? 'rgba(196, 30, 58, 0.1)' : 'white',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}
                >
                  <i className="fas fa-list"></i> Custom Split
                </button>
              </div>
            </div>

            {splitType === 'equal' && (
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem' }}>Number of Ways:</label>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {[2, 3, 4, 5, 6].map(num => (
                    <button
                      key={num}
                      onClick={() => setSplitCount(num)}
                      style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        border: splitCount === num ? '2px solid var(--primary-red)' : '2px solid #ddd',
                        background: splitCount === num ? 'var(--primary-red)' : 'white',
                        color: splitCount === num ? 'white' : 'var(--text-dark)',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '1.2rem'
                      }}
                    >
                      {num}
                    </button>
                  ))}
                </div>
                <div style={{ marginTop: '1rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>Each person pays:</div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-red)' }}>
                    ${(total / splitCount).toFixed(2)}
                  </div>
                </div>
              </div>
            )}

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => setShowSplitModal(false)}>
                Apply Split
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowSplitModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Preview Modal */}
      {showBillPreview && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '400px', maxHeight: '80vh', overflow: 'auto' }}>
            <div className="modal-header">
              <h2>Bill Preview</h2>
              <button className="modal-close" onClick={() => setShowBillPreview(false)}>×</button>
            </div>

            <div style={{ 
              background: 'white', 
              padding: '2rem', 
              border: '1px solid #ddd',
              fontFamily: 'monospace',
              fontSize: '0.9rem'
            }}>
              {/* Restaurant Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem', borderBottom: '2px dashed #333', paddingBottom: '1rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.5rem' }}>🍽️ RestaurantPOS</h2>
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>123 Main Street</p>
                <p style={{ margin: 0, fontSize: '0.85rem' }}>Tel: +1 234 567 8900</p>
              </div>

              {/* Order Details */}
              <div style={{ marginBottom: '1rem' }}>
                <div><strong>Table:</strong> {selectedTable?.name || 'N/A'}</div>
                <div><strong>Waiter:</strong> {selectedWaiter}</div>
                <div><strong>Date:</strong> {new Date().toLocaleDateString()}</div>
                <div><strong>Time:</strong> {new Date().toLocaleTimeString()}</div>
              </div>

              <div style={{ borderTop: '1px dashed #333', borderBottom: '1px dashed #333', padding: '0.5rem 0', marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600 }}>
                  <span>Item</span>
                  <span>Qty x Price</span>
                </div>
              </div>

              {cart.map((c, idx) => (
                <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{c.quantity}x {c.item.name}</span>
                  <span>${(c.item.price * c.quantity).toFixed(2)}</span>
                </div>
              ))}

              <div style={{ borderTop: '1px dashed #333', padding: '0.5rem 0', marginTop: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Tax (15%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                {discount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success-green)' }}>
                    <span>Discount:</span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '1.1rem', marginTop: '0.5rem' }}>
                  <span>TOTAL:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>

              <div style={{ textAlign: 'center', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '2px dashed #333' }}>
                <p style={{ margin: 0 }}>Thank you for dining with us!</p>
                <p style={{ margin: '0.25rem 0', fontSize: '0.85rem' }}>Please come again</p>
              </div>
            </div>

            <div className="modal-actions" style={{ marginTop: '1rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }}>
                <i className="fas fa-print"></i> Print Bill
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowBillPreview(false)}>
                Close
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
          <i className="fas fa-check-circle"></i> {orderMode === 'table' ? 'Order saved successfully!' : 'Payment Successful! Order Completed.'}
        </div>
      )}

      {/* Click outside to close search results */}
      {showSearchResults && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 50
          }}
          onClick={() => setShowSearchResults(false)}
        />
      )}

      <style jsx>{`
        @keyframes slideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @media (max-width: 1200px) {
          div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 900px) {
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
