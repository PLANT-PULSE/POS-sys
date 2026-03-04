'use client'

import { useState } from 'react'

interface Expense {
  id: number
  date: string
  description: string
  category: string
  amount: number
  status: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: 'Mar 1, 2026', description: 'Weekly Produce Delivery', category: 'Inventory', amount: 450, status: 'Paid' },
    { id: 2, date: 'Mar 1, 2026', description: 'Staff Salaries', category: 'Staff', amount: 1200, status: 'Paid' },
    { id: 3, date: 'Mar 2, 2026', description: 'Electricity Bill', category: 'Utilities', amount: 280, status: 'Paid' },
    { id: 4, date: 'Mar 3, 2026', description: 'Meat Supplier', category: 'Inventory', amount: 680, status: 'Pending' },
    { id: 5, date: 'Mar 4, 2026', description: 'Kitchen Equipment Repair', category: 'Maintenance', amount: 150, status: 'Paid' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Inventory',
    amount: 0,
    status: 'Pending'
  })

  const getStatusColor = (status: string) => {
    return status === 'Paid' ? 'var(--success-green)' : 'var(--warning-orange)'
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)

  const addExpense = () => {
    const newId = Math.max(...expenses.map(e => e.id), 0) + 1
    const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    setExpenses([...expenses, {
      id: newId,
      date: today,
      ...newExpense
    }])
    setShowAddModal(false)
    setNewExpense({ description: '', category: 'Inventory', amount: 0, status: 'Pending' })
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-receipt" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Expenses Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Expense
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>💸</div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${totalExpenses.toLocaleString()}</div>
          <div className="stat-change">This month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>📦</div>
          <div className="stat-label">Inventory Costs</div>
          <div className="stat-value">${expenses.filter(e => e.category === 'Inventory').reduce((s, e) => s + e.amount, 0)}</div>
          <div className="stat-change">58% of total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>👥</div>
          <div className="stat-label">Staff Costs</div>
          <div className="stat-value">${expenses.filter(e => e.category === 'Staff').reduce((s, e) => s + e.amount, 0)}</div>
          <div className="stat-change">28% of total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>⚡</div>
          <div className="stat-label">Utilities</div>
          <div className="stat-value">${expenses.filter(e => e.category === 'Utilities').reduce((s, e) => s + e.amount, 0)}</div>
          <div className="stat-change">14% of total</div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Description</th>
              <th>Category</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id}>
                <td>{expense.date}</td>
                <td style={{ fontWeight: 600 }}>{expense.description}</td>
                <td>{expense.category}</td>
                <td style={{ fontWeight: 600 }}>${expense.amount}</td>
                <td>
                  <span style={{ color: getStatusColor(expense.status), fontWeight: 600 }}>
                    {expense.status}
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

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Expense</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Description</label>
              <input 
                type="text" 
                placeholder="e.g., Weekly Produce Delivery"
                value={newExpense.description}
                onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={newExpense.category}
                onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              >
                <option>Inventory</option>
                <option>Staff</option>
                <option>Utilities</option>
                <option>Maintenance</option>
                <option>Marketing</option>
              </select>
            </div>

            <div className="form-group">
              <label>Amount ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={newExpense.amount || ''}
                onChange={(e) => setNewExpense({ ...newExpense, amount: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                value={newExpense.status}
                onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value })}
              >
                <option>Pending</option>
                <option>Paid</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addExpense}>
                <i className="fas fa-plus"></i> Add Expense
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
