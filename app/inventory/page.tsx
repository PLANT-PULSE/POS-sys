'use client'

import { useState } from 'react'

interface InventoryItem {
  id: number
  name: string
  category: string
  quantity: number
  unit: string
  minLevel: number
  status: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Tomato Sauce', category: 'Ingredients', quantity: 15, unit: 'Liters', minLevel: 20, status: 'Low Stock' },
    { id: 2, name: 'Chicken Breast', category: 'Ingredients', quantity: 45, unit: 'kg', minLevel: 30, status: 'In Stock' },
    { id: 3, name: 'Cooking Oil', category: 'Ingredients', quantity: 0, unit: 'Liters', minLevel: 50, status: 'Out of Stock' },
    { id: 4, name: 'Napkins', category: 'Supplies', quantity: 500, unit: 'Pieces', minLevel: 200, status: 'In Stock' },
    { id: 5, name: 'Orange Juice', category: 'Beverages', quantity: 8, unit: 'Liters', minLevel: 15, status: 'Low Stock' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Ingredients',
    quantity: 0,
    unit: 'Pieces',
    minLevel: 10
  })

  const getStatusColor = (status: string) => {
    if (status === 'In Stock') return 'var(--success-green)'
    if (status === 'Low Stock') return 'var(--warning-orange)'
    return 'var(--danger-red)'
  }

  const addInventoryItem = () => {
    const newId = Math.max(...inventory.map(i => i.id), 0) + 1
    let status = 'In Stock'
    if (newItem.quantity === 0) status = 'Out of Stock'
    else if (newItem.quantity < newItem.minLevel) status = 'Low Stock'
    
    setInventory([...inventory, {
      id: newId,
      ...newItem,
      status
    }])
    setShowAddModal(false)
    setNewItem({ name: '', category: 'Ingredients', quantity: 0, unit: 'Pieces', minLevel: 10 })
  }

  const restockItem = (id: number) => {
    setInventory(inventory.map(item => {
      if (item.id === id) {
        const newQuantity = item.quantity + item.minLevel
        let status = 'In Stock'
        if (newQuantity === 0) status = 'Out of Stock'
        else if (newQuantity < item.minLevel) status = 'Low Stock'
        return { ...item, quantity: newQuantity, status }
      }
      return item
    }))
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-box" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Inventory Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
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
          <div className="stat-value">{inventory.filter(i => i.status === 'Low Stock').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>❌</div>
          <div className="stat-label">Out of Stock</div>
          <div className="stat-value">{inventory.filter(i => i.status === 'Out of Stock').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>✅</div>
          <div className="stat-label">Well Stocked</div>
          <div className="stat-value">{inventory.filter(i => i.status === 'In Stock').length}</div>
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
                  <button 
                    className="btn btn-primary btn-small" 
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => restockItem(item.id)}
                  >
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

      {/* Add Inventory Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Inventory Item</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Item Name</label>
              <input 
                type="text" 
                placeholder="e.g., Tomato Sauce"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
              >
                <option>Ingredients</option>
                <option>Supplies</option>
                <option>Beverages</option>
              </select>
            </div>

            <div className="form-group">
              <label>Quantity</label>
              <input 
                type="number" 
                placeholder="0"
                value={newItem.quantity || ''}
                onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>Unit</label>
              <select 
                value={newItem.unit}
                onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
              >
                <option>Pieces</option>
                <option>Liters</option>
                <option>kg</option>
                <option>Boxes</option>
              </select>
            </div>

            <div className="form-group">
              <label>Minimum Level</label>
              <input 
                type="number" 
                placeholder="10"
                value={newItem.minLevel || ''}
                onChange={(e) => setNewItem({ ...newItem, minLevel: parseInt(e.target.value) || 0 })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addInventoryItem}>
                <i className="fas fa-plus"></i> Add Item
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
