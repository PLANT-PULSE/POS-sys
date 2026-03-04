'use client'

import { useState } from 'react'

interface Customer {
  id: number
  name: string
  email: string
  phone: string
  orders: number
  spent: number
  type: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', orders: 45, spent: 1234, type: 'VIP' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', orders: 32, spent: 892, type: 'Regular' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234 567 8902', orders: 28, spent: 756, type: 'Regular' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 234 567 8903', orders: 15, spent: 445, type: 'New' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newCustomer, setNewCustomer] = useState({
    name: '',
    email: '',
    phone: '',
    type: 'Regular'
  })

  const getTypeColor = (type: string) => {
    if (type === 'VIP') return 'var(--accent-gold)'
    if (type === 'New') return 'var(--success-green)'
    return 'var(--info-blue)'
  }

  const addCustomer = () => {
    const newId = Math.max(...customers.map(c => c.id), 0) + 1
    setCustomers([...customers, {
      id: newId,
      ...newCustomer,
      orders: 0,
      spent: 0
    }])
    setShowAddModal(false)
    setNewCustomer({ name: '', email: '', phone: '', type: 'Regular' })
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

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Total Orders</th>
              <th>Total Spent</th>
              <th>Type</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((customer, idx) => (
              <tr key={customer.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{customer.name}</td>
                <td>{customer.email}</td>
                <td>{customer.phone}</td>
                <td>{customer.orders}</td>
                <td style={{ fontWeight: 600 }}>${customer.spent}</td>
                <td>
                  <span style={{ color: getTypeColor(customer.type), fontWeight: 600 }}>
                    {customer.type}
                  </span>
                </td>
                <td>
                  <button style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                    <i className="fas fa-eye" style={{ color: 'var(--primary-red)' }}></i>
                  </button>
                  <button style={{ padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                    <i className="fas fa-edit" style={{ color: 'var(--primary-red)' }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
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
              <label>Full Name</label>
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
              <label>Phone</label>
              <input 
                type="tel" 
                placeholder="e.g., +1 234 567 8900"
                value={newCustomer.phone}
                onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Customer Type</label>
              <select 
                value={newCustomer.type}
                onChange={(e) => setNewCustomer({ ...newCustomer, type: e.target.value })}
              >
                <option>Regular</option>
                <option>VIP</option>
                <option>New</option>
              </select>
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
    </>
  )
}
