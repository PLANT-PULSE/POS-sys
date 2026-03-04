'use client'

export default function ExpensesPage() {
  const expenses = [
    { id: 1, date: 'Mar 1, 2026', description: 'Weekly Produce Delivery', category: 'Inventory', amount: 450, status: 'Paid' },
    { id: 2, date: 'Mar 1, 2026', description: 'Staff Salaries', category: 'Staff', amount: 1200, status: 'Paid' },
    { id: 3, date: 'Mar 2, 2026', description: 'Electricity Bill', category: 'Utilities', amount: 280, status: 'Paid' },
    { id: 4, date: 'Mar 3, 2026', description: 'Meat Supplier', category: 'Inventory', amount: 680, status: 'Pending' },
    { id: 5, date: 'Mar 4, 2026', description: 'Kitchen Equipment Repair', category: 'Maintenance', amount: 150, status: 'Paid' },
  ]

  const getStatusColor = (status: string) => {
    return status === 'Paid' ? 'var(--success-green)' : 'var(--warning-orange)'
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-receipt" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Expenses Management</h1>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Expense
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>💸</div>
          <div className="stat-label">Total Expenses</div>
          <div className="stat-value">$4,230</div>
          <div className="stat-change">This month</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>📦</div>
          <div className="stat-label">Inventory Costs</div>
          <div className="stat-value">$2,450</div>
          <div className="stat-change">58% of total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>👥</div>
          <div className="stat-label">Staff Costs</div>
          <div className="stat-value">$1,200</div>
          <div className="stat-change">28% of total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>⚡</div>
          <div className="stat-label">Utilities</div>
          <div className="stat-value">$580</div>
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
                  <button style={{ padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                    <i className="fas fa-eye" style={{ color: 'var(--primary-red)' }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
