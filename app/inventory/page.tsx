'use client'

export default function InventoryPage() {
  const inventory = [
    { id: 1, name: 'Tomato Sauce', category: 'Ingredients', quantity: 15, unit: 'Liters', minLevel: 20, status: 'Low Stock' },
    { id: 2, name: 'Chicken Breast', category: 'Ingredients', quantity: 45, unit: 'kg', minLevel: 30, status: 'In Stock' },
    { id: 3, name: 'Cooking Oil', category: 'Ingredients', quantity: 0, unit: 'Liters', minLevel: 50, status: 'Out of Stock' },
    { id: 4, name: 'Napkins', category: 'Supplies', quantity: 500, unit: 'Pieces', minLevel: 200, status: 'In Stock' },
    { id: 5, name: 'Orange Juice', category: 'Beverages', quantity: 8, unit: 'Liters', minLevel: 15, status: 'Low Stock' },
  ]

  const getStatusColor = (status: string) => {
    if (status === 'In Stock') return 'var(--success-green)'
    if (status === 'Low Stock') return 'var(--warning-orange)'
    return 'var(--danger-red)'
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-box" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Inventory Management</h1>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Item
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>📦</div>
          <div className="stat-label">Total Items</div>
          <div className="stat-value">156</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>⚠️</div>
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>❌</div>
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value">3</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>✅</div>
          <div className="stat-label">Well Stocked</div>
          <div className="stat-value">141</div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit</th>
              <th>Min. Level</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.quantity} {item.unit}</td>
                <td>{item.minLevel} {item.unit}</td>
                <td>{item.minLevel} {item.unit}</td>
                <td>
                  <span style={{ color: getStatusColor(item.status), fontWeight: 600 }}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem', marginRight: '0.5rem' }}>
                    Restock
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
