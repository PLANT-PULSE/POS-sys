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

// Budget configuration per category
interface BudgetConfig {
  category: string
  budget: number
  color: string
}

export default function ExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([
    { id: 1, date: '2026-03-04', description: 'Weekly Produce Delivery', category: 'Inventory', amount: 450, status: 'Paid' },
    { id: 2, date: '2026-03-01', description: 'Staff Salaries', category: 'Staff', amount: 3200, status: 'Paid' },
    { id: 3, date: '2026-03-02', description: 'Electricity Bill', category: 'Utilities', amount: 280, status: 'Paid' },
    { id: 4, date: '2026-03-03', description: 'Meat Supplier', category: 'Inventory', amount: 680, status: 'Pending' },
    { id: 5, date: '2026-03-04', description: 'Kitchen Equipment Repair', category: 'Maintenance', amount: 150, status: 'Paid' },
    { id: 6, date: '2026-03-01', description: 'Monthly Rent', category: 'Rent', amount: 1500, status: 'Paid' },
    { id: 7, date: '2026-03-02', description: 'Social Media Ads', category: 'Marketing', amount: 200, status: 'Paid' },
    { id: 8, date: '2026-03-03', description: 'Gas Delivery', category: 'Utilities', amount: 120, status: 'Paid' },
  ])

  // Budget configuration
  const [budgets] = useState<BudgetConfig[]>([
    { category: 'Inventory', budget: 3000, color: 'var(--warning-orange)' },
    { category: 'Staff', budget: 4000, color: 'var(--info-blue)' },
    { category: 'Utilities', budget: 600, color: 'var(--accent-gold)' },
    { category: 'Maintenance', budget: 500, color: 'var(--success-green)' },
    { category: 'Marketing', budget: 400, color: '#9333ea' },
    { category: 'Rent', budget: 1500, color: 'var(--primary-red)' },
  ])

  // Revenue data (would come from orders in real app)
  const monthlyRevenue = 12500 // Example monthly revenue

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showBudgetModal, setShowBudgetModal] = useState(false)

  const [newExpense, setNewExpense] = useState({
    description: '',
    category: 'Inventory',
    amount: 0,
    status: 'Pending'
  })

  const getStatusColor = (status: string) => {
    return status === 'Paid' ? 'var(--success-green)' : 'var(--warning-orange)'
  }

  const getCategoryColor = (category: string) => {
    const budget = budgets.find(b => b.category === category)
    return budget?.color || 'var(--info-blue)'
  }

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0)
  const pendingExpenses = expenses.filter(e => e.status === 'Pending').reduce((sum, e) => sum + e.amount, 0)
  
  // Calculate budget status
  const getBudgetStatus = (category: string) => {
    const spent = expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount, 0)
    const budget = budgets.find(b => b.category === category)
    if (!budget) return { spent: 0, remaining: 0, percentage: 0, status: 'ok' }
    
    const remaining = budget.budget - spent
    const percentage = (spent / budget.budget) * 100
    
    return {
      spent,
      remaining,
      percentage,
      status: percentage > 100 ? 'over' : percentage > 80 ? 'warning' : 'ok'
    }
  }

  // Monthly spending by category
  const categoryTotals = budgets.map(budget => ({
    ...budget,
    spent: expenses.filter(e => e.category === budget.category).reduce((sum, e) => sum + e.amount, 0)
  }))

  // Filter expenses based on search, category, and status
  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         expense.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || expense.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || expense.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const addExpense = () => {
    const newId = Math.max(...expenses.map(e => e.id), 0) + 1
    const today = new Date().toISOString().split('T')[0]
    setExpenses([...expenses, {
      id: newId,
      date: today,
      ...newExpense
    }])
    setShowAddModal(false)
    setNewExpense({ description: '', category: 'Inventory', amount: 0, status: 'Pending' })
  }

  const netProfit = monthlyRevenue - totalExpenses

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-receipt" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Expenses Management</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-outline" onClick={() => setShowBudgetModal(true)}>
            <i className="fas fa-chart-pie"></i> Budget
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> Add Expense
          </button>
        </div>
      </div>

      {/* Profit Overview */}
      <div style={{ 
        marginBottom: '2rem', 
        padding: '1.5rem', 
        background: netProfit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', 
        borderRadius: '12px',
        border: `2px solid ${netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)'}`
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Real Profit Calculation</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>
              ${netProfit.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.85rem', color: '#666' }}>
              Revenue ${monthlyRevenue.toLocaleString()} − Expenses ${totalExpenses.toLocaleString()}
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.9rem', color: '#666', marginBottom: '0.25rem' }}>Profit Margin</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>
              {((netProfit / monthlyRevenue) * 100).toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>💸</div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">${totalExpenses.toLocaleString()}</div>
          <div className="stat-change">This month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>⏳</div>
          <div className="stat-label">Pending</div>
          <div className="stat-value">${pendingExpenses.toLocaleString()}</div>
          <div className="stat-change">{expenses.filter(e => e.status === 'Pending').length} items</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>📈</div>
          <div className="stat-label">Revenue</div>
          <div className="stat-value">${monthlyRevenue.toLocaleString()}</div>
          <div className="stat-change">This month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>💰</div>
          <div className="stat-label">Net Profit</div>
          <div className="stat-value" style={{ color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>
            ${netProfit.toLocaleString()}
          </div>
          <div className="stat-change">{((netProfit / monthlyRevenue) * 100).toFixed(1)}% margin</div>
        </div>
      </div>

      {/* Budget Alerts */}
      {categoryTotals.some(c => c.spent > c.budget * 0.8) && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '2px solid var(--warning-orange)' }}>
          <h4 style={{ margin: '0 0 0.5rem', color: 'var(--warning-orange)' }}>
            <i className="fas fa-exclamation-triangle"></i> Budget Alerts
          </h4>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {categoryTotals.filter(c => c.spent > c.budget * 0.8).map(cat => (
              <span key={cat.category} style={{ 
                padding: '0.25rem 0.75rem', 
                background: cat.spent > cat.budget ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                borderRadius: '12px',
                fontSize: '0.85rem',
                color: cat.spent > cat.budget ? 'var(--danger-red)' : 'var(--warning-orange)'
              }}>
                {cat.category}: ${cat.spent}/${cat.budget} ({((cat.spent / cat.budget) * 100).toFixed(0)}%)
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', maxWidth: '300px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input 
            type="text" 
            placeholder="Search expenses..." 
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
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '130px' }}
        >
          <option value="all">All Categories</option>
          {budgets.map(b => (
            <option key={b.category} value={b.category}>{b.category}</option>
          ))}
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '130px' }}
        >
          <option value="all">All Status</option>
          <option value="Paid">Paid</option>
          <option value="Pending">Pending</option>
        </select>
      </div>

      {/* Expense Table */}
      <div className="card">
        {filteredExpenses.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <i className="fas fa-search" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block' }}></i>
            <p>No expenses found</p>
            {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
              <button 
                onClick={() => { setSearchQuery(''); setSelectedCategory('all'); setSelectedStatus('all'); }}
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
                <th>Date</th>
                <th>Description</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .map((expense) => (
                <tr key={expense.id}>
                  <td>{new Date(expense.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                  <td style={{ fontWeight: 600 }}>{expense.description}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      background: `${getCategoryColor(expense.category)}20`,
                      color: getCategoryColor(expense.category),
                      fontWeight: 600,
                      fontSize: '0.85rem'
                    }}>
                      {expense.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600 }}>${expense.amount.toLocaleString()}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem',
                      borderRadius: '12px',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      background: expense.status === 'Paid' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(245, 158, 11, 0.15)',
                      color: getStatusColor(expense.status)
                    }}>
                      {expense.status}
                    </span>
                  </td>
                  <td>
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
                {budgets.map(b => (
                  <option key={b.category} value={b.category}>{b.category}</option>
                ))}
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

      {/* Budget Modal */}
      {showBudgetModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h2>Budget Monitoring</h2>
              <button className="modal-close" onClick={() => setShowBudgetModal(false)}>×</button>
            </div>
            
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Track spending against monthly budget limits. Set alerts to prevent overspending.
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {categoryTotals.map(cat => {
                const status = getBudgetStatus(cat.category)
                const isOverBudget = status.percentage > 100
                const isWarning = status.percentage > 80 && status.percentage <= 100
                
                return (
                  <div key={cat.category} style={{ 
                    padding: '1rem', 
                    background: 'var(--secondary-cream)', 
                    borderRadius: '8px',
                    border: isOverBudget ? '2px solid var(--danger-red)' : isWarning ? '2px solid var(--warning-orange)' : '2px solid transparent'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: 600 }}>{cat.category}</span>
                      <span style={{ 
                        fontWeight: 700, 
                        color: isOverBudget ? 'var(--danger-red)' : isWarning ? 'var(--warning-orange)' : cat.color 
                      }}>
                        ${cat.spent.toLocaleString()} / ${cat.budget.toLocaleString()}
                      </span>
                    </div>
                    <div style={{ height: '8px', background: '#ddd', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ 
                        height: '100%', 
                        width: `${Math.min(status.percentage, 100)}%`,
                        background: isOverBudget ? 'var(--danger-red)' : isWarning ? 'var(--warning-orange)' : cat.color,
                        transition: 'width 0.3s'
                      }}></div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem', fontSize: '0.85rem', color: '#666' }}>
                      <span>{status.percentage.toFixed(0)}% used</span>
                      <span style={{ color: status.remaining >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                        {status.remaining >= 0 ? `$${status.remaining.toLocaleString()} left` : `$${Math.abs(status.remaining).toLocaleString()} over`}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem', color: 'var(--info-blue)' }}>💡 Budget Tips</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#666' }}>
                <li>Review budgets weekly to stay on track</li>
                <li>Set aside emergency fund for unexpected repairs</li>
                <li>Negotiate with suppliers for better rates</li>
              </ul>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowBudgetModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
