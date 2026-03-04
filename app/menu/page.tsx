'use client'

export default function MenuPage() {
  const menuItems = [
    { id: 1, name: 'Margherita Pizza', category: 'Fast Food', price: 12.99, status: 'Available', emoji: '🍕' },
    { id: 2, name: 'Classic Burger', category: 'Fast Food', price: 8.99, status: 'Available', emoji: '🍔' },
    { id: 3, name: 'Jollof Rice', category: 'Local Dishes', price: 10.99, status: 'Available', emoji: '🍝' },
    { id: 4, name: 'Fruit Smoothie', category: 'Drinks', price: 5.99, status: 'Available', emoji: '🥤' },
    { id: 5, name: 'Grilled Chicken', category: 'Local Dishes', price: 14.99, status: 'Available', emoji: '🍗' },
    { id: 6, name: 'Chocolate Cake', category: 'Desserts', price: 6.99, status: 'Unavailable', emoji: '🍰' },
    { id: 7, name: 'Vegetable Salad', category: 'Local Dishes', price: 7.99, status: 'Available', emoji: '🥗' },
    { id: 8, name: 'Orange Juice', category: 'Drinks', price: 3.99, status: 'Available', emoji: '🍊' },
  ]

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-list" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Menu Management</h1>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Item
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', maxWidth: '300px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input type="text" placeholder="Search menu items..." style={{ paddingLeft: '2.5rem' }} />
        </div>
        <select style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '150px' }}>
          <option>All Categories</option>
          <option>Fast Food</option>
          <option>Local Dishes</option>
          <option>Drinks</option>
          <option>Desserts</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Image</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.map((item, idx) => (
              <tr key={item.id}>
                <td>{idx + 1}</td>
                <td><div style={{ width: 50, height: 50, borderRadius: 8, background: '#f5f1e8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem' }}>{item.emoji}</div></td>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td>{item.category}</td>
                <td style={{ fontWeight: 600 }}>${item.price.toFixed(2)}</td>
                <td>
                  <span style={{ 
                    color: item.status === 'Available' ? 'var(--success-green)' : 'var(--danger-red)',
                    fontWeight: 600 
                  }}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                    <i className="fas fa-edit" style={{ color: 'var(--primary-red)' }}></i>
                  </button>
                  <button style={{ padding: '0.5rem', border: '1px solid var(--danger-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                    <i className="fas fa-trash" style={{ color: 'var(--danger-red)' }}></i>
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
