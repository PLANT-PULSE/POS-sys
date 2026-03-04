'use client'

import { useState } from 'react'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  address?: string
  orders: number
  spent: number
  loyaltyPoints: number
  type: string
  joinDate: string
  lastVisit?: string
  birthday?: string
}

interface PurchaseHistory {
  id: number
  customerId: number
  date: string
  item: string
  quantity: number
  amount: number
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', address: 'Accra, Ghana', orders: 45, spent: 1234, loyaltyPoints: 450, type: 'VIP', joinDate: '2025-06-15', lastVisit: '2026-03-01', birthday: '1990-05-20' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', address: 'Tema, Ghana', orders: 32, spent: 892, loyaltyPoints: 280, type: 'Regular', joinDate: '2025-08-20', lastVisit: '2026-02-28' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234 567 8902', orders: 28, spent: 756, loyaltyPoints: 190, type: 'Regular', joinDate: '2025-10-10', lastVisit: '2026-02-25' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 234 567 8903', orders: 15, spent: 445, loyaltyPoints: 120, type: 'New', joinDate: '2026-01-05', lastVisit: '2026-03-02', birthday: '1995-03-15' },
  ])

  const [purchaseHistory] = useState<PurchaseHistory[]>([
    { id: 1, customerId: 1, date: '2026-03-01', item: 'Jollof Rice', quantity: 2, amount: 50 },
    { id: 2, customerId: 1, date: '2026-02-28', item: 'Chicken Fried Rice', quantity: 1, amount: 35 },
    { id: 3, customerId: 1, date: '2026-02-25', item: 'Beef Stew', quantity: 2, amount: 60 },
    { id: 4, customerId: 2, date: '2026-02-28', item: 'Jollof Rice', quantity: 1, amount: 25 },
    { id: 5, customerId: 2, date: '2026-02-20', item: 'Orange Juice', quantity: 2, amount: 16 },
    { id: 6, customerId: 3, date: '2026-02-25', item: 'Beef Stew', quantity: 1, amount: 30 },
  ])

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showHistoryModal, setShowHistoryModal] = useState(false)
  const [showPromoModal, setShowPromoModal] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    birthday: ''
  })

  // Points configuration
  const POINTS_PER_DOLLAR = 1 // 1 point per $1 spent
  const POINTS_FOR_DISCOUNT = 100 // 100 points = $10 discount
  const VIP_THRESHOLD = 300 // Points threshold for VIP

  const getTypeColor = (type: string) => {
    if (type === 'VIP') return 'var(--accent-gold)'
    if (type === 'New') return 'var(--success-green)'
    return 'var(--info-blue)'
  }

  const getCustomerHistory = (customerId: number) => {
    return purchaseHistory.filter(p => p.customerId === customerId)
  }

  // Filter customers based on search and type
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.phone.includes(searchQuery)
    const matchesType = selectedType === 'all' || customer.type === selectedType
    return matchesSearch && matchesType
  })

  const addCustomer = () => {
    const newId = Math.max(...customers.map(c => c.id), 0) + 1
    setCustomers([...customers, {
      id: newId,
      ...newCustomer,
      orders: 0,
      spent: 0,
      loyaltyPoints: 0,
      type: 'New',
      joinDate: new Date().toISOString().split('T')[0]
    }])
    setShowAddModal(false)
    setNewCustomer({ name: '', email: '', phone: '', address: '', birthday: '' })
  }

  const openHistoryModal = (customer: Customer) => {
    setSelectedCustomer(customer)
    setShowHistoryModal(true)
  }

  const calculatePointsValue = (points: number) => {
    return Math.floor(points / POINTS_FOR_DISCOUNT) * 10
  }

  const isBirthdayMonth = (birthday?: string) => {
    if (!birthday) return false
    const birthMonth = new Date(birthday).getMonth()
    const currentMonth = new Date().getMonth()
    return birthMonth === currentMonth
  }

  // Send promotional message (simulated)
  const sendPromotion = (type: string) => {
    alert(`Promotion "${type}" sent to ${selectedCustomer?.name}!`)
    setShowPromoModal(false)
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-users" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Customer Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Customer
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>👥</div>
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">{customers.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>🆕</div>
          <div className="stat-label">New This Month</div>
          <div className="stat-value">{customers.filter(c => c.type === 'New').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>⭐</div>
          <div className="stat-label">VIP Customers</div>
          <div className="stat-value">{customers.filter(c => c.type === 'VIP').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${customers.reduce((sum, c) => sum + c.spent, 0).toLocaleString()}</div>
        </div>
      </div>

      {/* Birthday & Promo Alerts */}
      <div style={{ marginBottom: '2rem' }}>
        {customers.filter(c => isBirthdayMonth(c.birthday)).length > 0 && (
          <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '8px', border: '2px solid #9333ea' }}>
            <h4 style={{ margin: 0, color: '#9333ea' }}>
              <i className="fas fa-birthday-cake"></i> Birthday Specials: {customers.filter(c => isBirthdayMonth(c.birthday)).length} customer(s) have birthdays this month!
            </h4>
            <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
              {customers.filter(c => isBirthdayMonth(c.birthday)).map(c => (
                <span key={c.id} style={{ marginRight: '1rem' }}>
                  🎂 {c.name} - {new Date(c.birthday!).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* VIP Customer Benefits Info */}
        <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '2px solid var(--accent-gold)' }}>
          <h4 style={{ margin: 0, color: 'var(--accent-gold)' }}>
            <i className="fas fa-crown"></i> Loyalty Program Benefits
          </h4>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666', display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            <span>💎 <strong>VIP:</strong> 300+ points, priority service</span>
            <span>🎁 <strong>Redeem:</strong> 100 points = $10 discount</span>
            <span>📱 <strong>Earn:</strong> 1 point per $1 spent</span>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', maxWidth: '300px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input 
            type="text" 
            placeholder="Search customers..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }} 
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              style={{ 
                position: 'absolute', 
                right: '0.75rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                border: 'none', 
                background: 'none', 
                cursor: 'pointer',
                color: '#999'
              }}
            >
              <i className="fas fa-times"></i>
            </button>
          )}
        </div>
        <select 
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '150px' }}
        >
          <option value="all">All Types</option>
          <option value="VIP">VIP</option>
          <option value="Regular">Regular</option>
          <option value="New">New</option>
        </select>
      </div>

      {/* Search Results Info */}
      {searchQuery && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
          <span style={{ color: '#666' }}>
            Found {filteredCustomers.length} result(s) for "{searchQuery}"
          </span>
        </div>
      )}

      <div className="card">
        {filteredCustomers.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
            <p>No customers found</p>
            {(searchQuery || selectedType !== 'all') && (
              <button 
                onClick={() => { setSearchQuery(''); setSelectedType('all'); }}
                className="btn btn-secondary"
                style={{ marginTop: '1rem' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Loyalty Points</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.map((customer, idx) => (
                <tr key={customer.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ 
                        width: 36, 
                        height: 36, 
                        borderRadius: '50%', 
                        background: getTypeColor(customer.type),
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 600,
                        fontSize: '0.85rem'
                      }}>
                        {customer.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>
                          {customer.name}
                          {customer.type === 'VIP' && <i className="fas fa-crown" style={{ color: 'var(--accent-gold)', marginLeft: '0.5rem', fontSize: '0.75rem' }}></i>}
                          {isBirthdayMonth(customer.birthday) && <span style={{ marginLeft: '0.5rem' }}>🎂</span>}
                        </div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>
                          Joined: {customer.joinDate}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ fontSize: '0.9rem' }}>{customer.email}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>{customer.phone}</div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600 }}>{customer.orders}</span>
                    {customer.lastVisit && (
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>
                        Last: {customer.lastVisit}
                      </div>
                    )}
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--success-green)' }}>${customer.spent.toLocaleString()}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 600, color: customer.loyaltyPoints >= VIP_THRESHOLD ? 'var(--accent-gold)' : 'var(--info-blue)' }}>
                        ⭐ {customer.loyaltyPoints}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>
                      = ${calculatePointsValue(customer.loyaltyPoints)} value
                    </div>
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.3rem 0.7rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.8rem',
                      background: customer.type === 'VIP' ? 'rgba(245, 158, 11, 0.15)' : 
                                 customer.type === 'New' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(59, 130, 246, 0.15)',
                      color: getTypeColor(customer.type)
                    }}>
                      {customer.type}
                    </span>
                  </td>
                  <td>
                    <button 
                      style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}
                      onClick={() => openHistoryModal(customer)}
                      title="View Order History"
                    >
                      <i className="fas fa-history" style={{ color: 'var(--primary-red)' }}></i>
                    </button>
                    <button 
                      style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid var(--info-blue)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}
                      onClick={() => { setSelectedCustomer(customer); setShowPromoModal(true); }}
                      title="Send Promotion"
                    >
                      <i className="fas fa-bullhorn" style={{ color: 'var(--info-blue)' }}></i>
                    </button>
                    <button style={{ padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                      <i className="fas fa-edit" style={{ color: 'var(--primary-red)' }}></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Customer Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Customer</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Full Name *</label>
              <input 
                type="text" 
                placeholder="e.g., John Doe"
                value={newCustomer.name}
                onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="e.g., john@example.com"
                value={newCustomer.email}
                onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone *</label>
              <input 
                type="tel" 
                placeholder="e.g., +233 24 XXX XXXX"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Address</label>
              <input 
                type="text" 
                placeholder="e.g., Accra, Ghana"
                value={newCustomer.address}
                onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Birthday</label>
              <input 
                type="date" 
                value={newCustomer.birthday}
                onChange={(e) => setNewCustomer({ ...newCustomer, birthday: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addCustomer}>
                <i className="fas fa-plus"></i> Add Customer
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Purchase History Modal */}
      {showHistoryModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Purchase History - {selectedCustomer.name}</h2>
              <button className="modal-close" onClick={() => setShowHistoryModal(false)}>×</button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Orders</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedCustomer.orders}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Total Spent</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--success-green)' }}>${selectedCustomer.spent}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Points Earned</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent-gold)' }}>⭐ {selectedCustomer.loyaltyPoints}</div>
              </div>
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Recent Orders</h4>
            {getCustomerHistory(selectedCustomer.id).length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
                <i className="fas fa-receipt" style={{ fontSize: '2rem', marginBottom: '0.5rem', display: 'block' }}></i>
                <p>No purchase history yet</p>
              </div>
            ) : (
              <table className="table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {getCustomerHistory(selectedCustomer.id).map(order => (
                    <tr key={order.id}>
                      <td>{order.date}</td>
                      <td style={{ fontWeight: 600 }}>{order.item}</td>
                      <td>{order.quantity}</td>
                      <td style={{ color: 'var(--success-green)', fontWeight: 600 }}>${order.amount}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            <div style={{ marginTop: '1.5rem' }}>
              <button 
                className="btn btn-outline" 
                style={{ width: '100%' }}
                onClick={() => setShowHistoryModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Promotion Modal */}
      {showPromoModal && selectedCustomer && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Send Promotion to {selectedCustomer.name}</h2>
              <button className="modal-close" onClick={() => setShowPromoModal(false)}>×</button>
            </div>

            <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.85rem', color: '#666' }}>Customer Details</div>
              <div style={{ fontWeight: 600 }}>{selectedCustomer.name} ({selectedCustomer.type})</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>{selectedCustomer.phone}</div>
              <div style={{ fontSize: '0.9rem', color: '#666' }}>Points: ⭐ {selectedCustomer.loyaltyPoints}</div>
            </div>

            <h4 style={{ marginBottom: '1rem' }}>Select Promotion Type</h4>
            
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <button 
                className="btn btn-primary"
                style={{ justifyContent: 'flex-start', padding: '1rem' }}
                onClick={() => sendPromotion('10% Off Next Order')}
              >
                <span style={{ marginRight: '0.5rem' }}>🏷️</span> 10% Off Next Order
              </button>
              
              <button 
                className="btn btn-primary"
                style={{ justifyContent: 'flex-start', padding: '1rem' }}
                onClick={() => sendPromotion('$10 Discount (100 Points)')}
              >
                <span style={{ marginRight: '0.5rem' }}>🎁</span> $10 Discount (100 Points)
              </button>
              
              <button 
                className="btn btn-primary"
                style={{ justifyContent: 'flex-start', padding: '1rem' }}
                onClick={() => sendPromotion('Free Drink')}
              >
                <span style={{ marginRight: '0.5rem' }}>🥤</span> Free Drink with Any Meal
              </button>
              
              <button 
                className="btn btn-primary"
                style={{ justifyContent: 'flex-start', padding: '1rem' }}
                onClick={() => sendPromotion('Birthday Special')}
              >
                <span style={{ marginRight: '0.5rem' }}>🎂</span> Birthday Special - 20% Off
              </button>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowPromoModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
