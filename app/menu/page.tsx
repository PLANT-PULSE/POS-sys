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
  'Fish & Chips': 'https://images.unsplash.com/photo-1579208030886-b937da0925dc?w=200&h=200&fit=crop',
  'Pasta Carbonara': 'https://images.unsplash.com/photo-1612874742237-6526221588e3?w=200&h=200&fit=crop',
  'Coffee': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=200&h=200&fit=crop',
  'Ice Cream': 'https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=200&h=200&fit=crop',
}

interface MenuItem {
  id: number
  name: string
  category: string
  price: number
  status: string
  image?: string
  description?: string
}

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([
    { id: 1, name: 'Margherita Pizza', category: 'Fast Food', price: 12.99, status: 'Available', image: 'Margherita Pizza', description: 'Classic tomato and mozzarella pizza' },
    { id: 2, name: 'Classic Burger', category: 'Fast Food', price: 8.99, status: 'Available', image: 'Classic Burger', description: 'Juicy beef burger with fresh vegetables' },
    { id: 3, name: 'Jollof Rice', category: 'Local Dishes', price: 10.99, status: 'Available', image: 'Jollof Rice', description: 'Traditional jollof rice with chicken' },
    { id: 4, name: 'Fruit Smoothie', category: 'Drinks', price: 5.99, status: 'Available', image: 'Fruit Smoothie', description: 'Mixed fresh fruit smoothie' },
    { id: 5, name: 'Grilled Chicken', category: 'Local Dishes', price: 14.99, status: 'Available', image: 'Grilled Chicken', description: 'Grilled chicken with spices' },
    { id: 6, name: 'Chocolate Cake', category: 'Desserts', price: 6.99, status: 'Unavailable', image: 'Chocolate Cake', description: 'Rich chocolate layered cake' },
    { id: 7, name: 'Vegetable Salad', category: 'Local Dishes', price: 7.99, status: 'Available', image: 'Vegetable Salad', description: 'Fresh garden vegetables' },
    { id: 8, name: 'Orange Juice', category: 'Drinks', price: 3.99, status: 'Available', image: 'Orange Juice', description: 'Freshly squeezed orange juice' },
    { id: 9, name: 'Fish & Chips', category: 'Fast Food', price: 13.99, status: 'Available', image: 'Fish & Chips', description: 'Crispy fish with french fries' },
    { id: 10, name: 'Pasta Carbonara', category: 'Local Dishes', price: 12.99, status: 'Available', image: 'Pasta Carbonara', description: 'Creamy pasta with bacon' },
    { id: 11, name: 'Coffee', category: 'Drinks', price: 2.99, status: 'Available', image: 'Coffee', description: 'Hot fresh coffee' },
    { id: 12, name: 'Ice Cream', category: 'Desserts', price: 4.99, status: 'Available', image: 'Ice Cream', description: 'Variety of ice cream flavors' },
  ])

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null)
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null)
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Fast Food',
    price: 0,
    status: 'Available',
    image: '',
    description: ''
  })

  // Filter menu items based on search, category, and status
  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Category statistics
  const categoryStats = menuItems.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const availableCount = menuItems.filter(i => i.status === 'Available').length
  const unavailableCount = menuItems.filter(i => i.status === 'Unavailable').length

  const addMenuItem = () => {
    const newId = Math.max(...menuItems.map(m => m.id), 0) + 1
    setMenuItems([...menuItems, {
      id: newId,
      name: newItem.name,
      category: newItem.category,
      price: newItem.price,
      status: newItem.status,
      image: newItem.name,
      description: newItem.description
    }])
    setShowAddModal(false)
    setNewItem({ name: '', category: 'Fast Food', price: 0, status: 'Available', image: '', description: '' })
  }

  const updateMenuItem = () => {
    if (selectedItem) {
      setMenuItems(menuItems.map(m => 
        m.id === selectedItem.id 
          ? { ...m, name: selectedItem.name, category: selectedItem.category, price: selectedItem.price, status: selectedItem.status, description: selectedItem.description || '' }
          : m
      ))
      setShowEditModal(false)
      setSelectedItem(null)
    }
  }

  const deleteMenuItem = (id: number) => {
    setMenuItems(menuItems.filter(m => m.id !== id))
    setShowDeleteModal(false)
    setSelectedItemId(null)
  }

  const toggleItemStatus = (id: number) => {
    setMenuItems(menuItems.map(m => {
      if (m.id === id) {
        return { ...m, status: m.status === 'Available' ? 'Unavailable' : 'Available' }
      }
      return m
    }))
  }

  const openEditModal = (item: MenuItem) => {
    setSelectedItem({ ...item })
    setShowEditModal(true)
  }

  const openDeleteModal = (id: number) => {
    setSelectedItemId(id)
    setShowDeleteModal(true)
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-utensils" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Menu Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Item
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>🍽️</div>
          <div className="stat-label">Total Items</div>
          <div className="stat-value">{menuItems.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>✅</div>
          <div className="stat-label">Available</div>
          <div className="stat-value">{availableCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>❌</div>
          <div className="stat-label">Unavailable</div>
          <div className="stat-value">{unavailableCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>💰</div>
          <div className="stat-label">Avg. Price</div>
          <div className="stat-value">${(menuItems.reduce((s, i) => s + i.price, 0) / menuItems.length).toFixed(2)}</div>
        </div>
      </div>

      {/* Categories */}
      <div className="card" style={{ marginBottom: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Categories</h3>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {Object.entries(categoryStats).map(([cat, count]) => (
            <div 
              key={cat}
              style={{ 
                padding: '0.75rem 1.5rem', 
                background: 'var(--secondary-cream)', 
                borderRadius: '20px',
                cursor: 'pointer',
                border: selectedCategory === cat ? '2px solid var(--primary-red)' : '2px solid transparent'
              }}
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
            >
              <span style={{ fontWeight: 600 }}>{cat}</span>
              <span style={{ marginLeft: '0.5rem', color: '#666' }}>({count})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', maxWidth: '300px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input 
            type="text" 
            placeholder="Search menu items..." 
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
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '150px' }}
        >
          <option value="all">All Categories</option>
          <option value="Fast Food">Fast Food</option>
          <option value="Local Dishes">Local Dishes</option>
          <option value="Drinks">Drinks</option>
          <option value="Desserts">Desserts</option>
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '130px' }}
        >
          <option value="all">All Status</option>
          <option value="Available">Available</option>
          <option value="Unavailable">Unavailable</option>
        </select>
      </div>

      {/* Search Results Info */}
      {(searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all') && (
        <div style={{ marginBottom: '1rem', padding: '0.75rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
          <span style={{ color: '#666' }}>
            Showing {filteredItems.length} of {menuItems.length} items
          </span>
        </div>
      )}

      <div className="card">
        {filteredItems.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#999' }}>
            <i className="fas fa-utensils" style={{ fontSize: '3rem', marginBottom: '1rem', display: 'block', opacity: 0.5 }}></i>
            <p>No menu items found</p>
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
              {filteredItems.map((item, idx) => (
                <tr key={item.id} style={{ opacity: item.status === 'Unavailable' ? 0.6 : 1 }}>
                  <td>{idx + 1}</td>
                  <td>
                    <img 
                      src={foodImages[item.image || item.name] || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'} 
                      alt={item.name}
                      style={{ width: 50, height: 50, borderRadius: 8, objectFit: 'cover' }}
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop'
                      }}
                    />
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{item.name}</div>
                    {item.description && <div style={{ fontSize: '0.8rem', color: '#666' }}>{item.description}</div>}
                  </td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      background: 'var(--secondary-cream)',
                      fontSize: '0.85rem'
                    }}>
                      {item.category}
                    </span>
                  </td>
                  <td style={{ fontWeight: 700, fontSize: '1.1rem' }}>${item.price.toFixed(2)}</td>
                  <td>
                    <button 
                      onClick={() => toggleItemStatus(item.id)}
                      style={{ 
                        padding: '0.4rem 0.8rem',
                        border: 'none',
                        borderRadius: '20px',
                        cursor: 'pointer',
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        background: item.status === 'Available' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                        color: item.status === 'Available' ? '#10b981' : '#ef4444'
                      }}
                    >
                      {item.status === 'Available' ? '✓ Available' : '✕ Unavailable'}
                    </button>
                  </td>
                  <td>
                    <button 
                      onClick={() => openEditModal(item)}
                      style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}
                    >
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
        )}
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
              <label>Item Name *</label>
              <input 
                type="text" 
                placeholder="e.g., Grilled Chicken"
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
              <label>Price ($) *</label>
              <input 
                type="number" 
                placeholder="0.00"
                step="0.01"
                value={newItem.price || ''}
                onChange={(e) => setNewItem({ ...newItem, price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                placeholder="Brief description of the item..."
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                rows={2}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', fontFamily: 'inherit' }}
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
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                onClick={addMenuItem}
                disabled={!newItem.name || newItem.price <= 0}
              >
                <i className="fas fa-plus"></i> Add Item
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Menu Modal */}
      {showEditModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Menu Item</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Item Name *</label>
              <input 
                type="text" 
                value={selectedItem.name}
                onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Category</label>
              <select 
                value={selectedItem.category}
                onChange={(e) => setSelectedItem({ ...selectedItem, category: e.target.value })}
              >
                <option>Fast Food</option>
                <option>Local Dishes</option>
                <option>Drinks</option>
                <option>Desserts</option>
              </select>
            </div>

            <div className="form-group">
              <label>Price ($) *</label>
              <input 
                type="number" 
                step="0.01"
                value={selectedItem.price}
                onChange={(e) => setSelectedItem({ ...selectedItem, price: parseFloat(e.target.value) || 0 })}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                value={selectedItem.description || ''}
                onChange={(e) => setSelectedItem({ ...selectedItem, description: e.target.value })}
                rows={2}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', fontFamily: 'inherit' }}
              />
            </div>

            <div className="form-group">
              <label>Availability</label>
              <select 
                value={selectedItem.status}
                onChange={(e) => setSelectedItem({ ...selectedItem, status: e.target.value })}
              >
                <option>Available</option>
                <option>Unavailable</option>
              </select>
            </div>

            <div className="modal-actions">
              <button 
                className="btn btn-primary" 
                style={{ flex: 1 }} 
                onClick={updateMenuItem}
                disabled={!selectedItem.name || selectedItem.price <= 0}
              >
                <i className="fas fa-save"></i> Save Changes
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowEditModal(false)}>
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
