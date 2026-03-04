'use client'

import { useState } from 'react'

// Food images
const foodImages: Record<string, string> = {
  'Margherita Pizza': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200&h=200&fit=crop',
  'Classic Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
  'Jollof Rice': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200&h=200&fit=crop',
  'Fruit Smoothie': 'https://images.unsplash.com/photo-1505252585461-04db1eb84625?w=200&h=200&fit=crop',
  'Grilled Chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
  'Chocolate Cake': 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200&h=200&fit=crop',
  'Vegetable Salad': 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&h=200&fit=crop',
  'Orange Juice': 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=200&h=200&fit=crop',
}

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  status: string
  image?: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Margherita Pizza', category: 'Fast Food', price: 12.99, status: 'Available', image: 'Margherita Pizza' },
    { id: 2, name: 'Classic Burger', category: 'Fast Food', price: 8.99, status: 'Available', image: 'Classic Burger' },
    { id: 3, name: 'Jollof Rice', category: 'Local Dishes', price: 10.99, status: 'Available', image: 'Jollof Rice' },
    { id: 4, name: 'Fruit Smoothie', category: 'Drinks', price: 5.99, status: 'Available', image: 'Fruit Smoothie' },
    { id: 5, name: 'Grilled Chicken', category: 'Local Dishes', price: 14.99, status: 'Available', image: 'Grilled Chicken' },
    { id: 6, name: 'Chocolate Cake', category: 'Desserts', price: 6.99, status: 'Unavailable', image: 'Chocolate Cake' },
    { id: 7, name: 'Vegetable Salad', category: 'Local Dishes', price: 7.99, status: 'Available', image: 'Vegetable Salad' },
    { id: 8, name: 'Orange Juice', category: 'Drinks', price: 3.99, status: 'Available', image: 'Orange Juice' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Fast Food',
    price: 0,
    status: 'Available',
    image: ''
  })

  const addMenuItem = () => {
    const newId = Math.max(...menuItems.map(m => m.id), 0) + 1
    setMenuItems([...menuItems, {
      id: newId,
      name: newItem.name,
      category: newItem.category,
      price: newItem.price,
      status: newItem.status,
      image: newItem.name
    }])
    setShowAddModal(false)
    setNewItem({ name: '', category: 'Fast Food', price: 0, status: 'Available', image: '' })
  }

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(m => m.id !== id))
    setShowDeleteModal(false)
    setSelectedItemId(null)
  }

  const openDeleteModal = (id: number) => {
    setSelectedItemId(id)
    setShowDeleteModal(true)
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-list" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Menu Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
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
                <td>
                  <img 
                    src={foodImages[item.image || item.name]} 
                    alt={item.name}
                    style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none'
                    }}
                  />
                </td>
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
                  <button 
                    onClick={() => openDeleteModal(item.id)}
                    style={{ padding: '0.5rem', border: '1px solid var(--danger-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}
                  >
                    <i className="fas fa-trash" style={{ color: 'var(--danger-red)' }}></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Menu Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Menu Item</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Item Name</label>
              <input 
                type="text" 
                placeholder="e.g., Margherita Pizza"
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
                <option>Fast Food</option>
                <option>Local Dishes</option>
                <option>Drinks</option>
                <option>Desserts</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price ($)</label>
              <input 
                type="number" 
                placeholder="0.00"
                value={newItem.price || ''}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select 
                value={newItem.status}
                onChange={(e) => setNewItem({ ...newItem, status: e.target.value })}
              >
                <option>Available</option>
                <option>Unavailable</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addMenuItem}>
                <i className="fas fa-plus"></i> Add Item
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Delete Menu Item</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete this menu item? This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button 
                className="btn btn-danger" 
                style={{ flex: 1, background: 'var(--danger-red)' }} 
                onClick={() => selectedItemId && deleteMenuItem(selectedItemId)}
              >
                <i className="fas fa-trash"></i> Delete
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowDeleteModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
