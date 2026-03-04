'use client'

export default function CustomersPage() {
  const customers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+1 234 567 8900', orders: 45, spent: 1234, type: 'VIP' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+1 234 567 8901', orders: 32, spent: 892, type: 'Regular' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+1 234 567 8902', orders: 28, spent: 756, type: 'Regular' },
    { id: 4, name: 'Sarah Williams', email: 'sarah@example.com', phone: '+1 234 567 8903', orders: 15, spent: 445, type: 'New' },
  ]

  const getTypeColor = (type: string) => {
    if (type === 'VIP') return 'var(--accent-gold)'
    if (type === 'New') return 'var(--success-green)'
    return 'var(--info-blue)'
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-users" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Customer Management</h1>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Customer
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>👥</div>
          <div className="stat-label">Total Customers</div>
          <div className="stat-value">248</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>🆕</div>
          <div className="stat-label">New This Month</div>
          <div className="stat-value">32</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>⭐</div>
          <div className="stat-label">VIP Customers</div>
          <div className="stat-value">18</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">$45,230</div>
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
    </>
  )
}
