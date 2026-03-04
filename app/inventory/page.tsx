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
  expiryDate?: string
  costPerUnit: number
  supplier?: string
  supplierPhone?: string
  lastRestocked?: string
  usagePerDay?: number
}

// Meal cost configuration - links ingredients to menu items
interface MealCostConfig {
  mealId: number
  mealName: string
  ingredients: { itemId: number, portion: number, unit: string }[]
  sellingPrice: number
}

interface RestockRecord {
  id: number
  itemId: number
  quantity: number
  date: string
  supplier: string
}

export default function InventoryPage() {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: 1, name: 'Tomato Sauce', category: 'Ingredients', quantity: 15, unit: 'Liters', minLevel: 20, status: 'Low Stock', costPerUnit: 5, supplier: 'Fresh Farms Ltd', supplierPhone: '+233 24 123 4567', lastRestocked: '2026-02-20', usagePerDay: 3 },
    { id: 2, name: 'Chicken Breast', category: 'Ingredients', quantity: 45, unit: 'kg', minLevel: 30, status: 'In Stock', costPerUnit: 15, supplier: 'Meat Masters', supplierPhone: '+233 24 234 5678', lastRestocked: '2026-02-25', usagePerDay: 8 },
    { id: 3, name: 'Cooking Oil', category: 'Ingredients', quantity: 8, unit: 'Liters', minLevel: 50, status: 'Out of Stock', costPerUnit: 8, supplier: 'Oil Ghana', supplierPhone: '+233 24 345 6789', lastRestocked: '2026-02-15', usagePerDay: 5 },
    { id: 4, name: 'Napkins', category: 'Supplies', quantity: 500, unit: 'Pieces', minLevel: 200, status: 'In Stock', costPerUnit: 0.5, supplier: 'Paper Co', supplierPhone: '+233 24 456 7890', lastRestocked: '2026-02-28' },
    { id: 5, name: 'Orange Juice', category: 'Beverages', quantity: 8, unit: 'Liters', minLevel: 15, status: 'Low Stock', costPerUnit: 4, supplier: 'Beverage Supplies', supplierPhone: '+233 24 567 8901', lastRestocked: '2026-02-22', usagePerDay: 2 },
    { id: 6, name: 'Rice (Jollof)', category: 'Ingredients', quantity: 25, unit: 'kg', minLevel: 20, status: 'In Stock', costPerUnit: 8, supplier: 'Rice Ghana', supplierPhone: '+233 24 678 9012', lastRestocked: '2026-02-27', usagePerDay: 10 },
    { id: 7, name: 'Fresh Milk', category: 'Ingredients', quantity: 5, unit: 'Liters', minLevel: 10, status: 'Low Stock', costPerUnit: 6, supplier: 'Dairy Farm', supplierPhone: '+233 24 789 0123', expiryDate: '2026-03-07', lastRestocked: '2026-03-01', usagePerDay: 2 },
    { id: 8, name: 'Ground Beef', category: 'Ingredients', quantity: 20, unit: 'kg', minLevel: 15, status: 'In Stock', costPerUnit: 18, supplier: 'Meat Masters', supplierPhone: '+233 24 234 5678', lastRestocked: '2026-03-02', usagePerDay: 5 },
  ])

  // Meal cost configurations - defines cost per meal based on ingredients
  const [mealCosts] = useState<MealCostConfig[]>([
    { mealId: 1, mealName: 'Jollof Rice', sellingPrice: 25, ingredients: [
      { itemId: 6, portion: 0.5, unit: 'kg' }, // Rice
      { itemId: 1, portion: 0.2, unit: 'Liters' }, // Tomato Sauce
      { itemId: 3, portion: 0.1, unit: 'Liters' }, // Oil
    ]},
    { mealId: 2, mealName: 'Chicken Fried Rice', sellingPrice: 35, ingredients: [
      { itemId: 6, portion: 0.5, unit: 'kg' }, // Rice
      { itemId: 2, portion: 0.3, unit: 'kg' }, // Chicken
      { itemId: 3, portion: 0.1, unit: 'Liters' }, // Oil
      { itemId: 7, portion: 0.1, unit: 'Liters' }, // Milk
    ]},
    { mealId: 3, mealName: 'Beef Stew', sellingPrice: 30, ingredients: [
      { itemId: 8, portion: 0.4, unit: 'kg' }, // Ground Beef
      { itemId: 1, portion: 0.3, unit: 'Liters' }, // Tomato Sauce
      { itemId: 3, portion: 0.1, unit: 'Liters' }, // Oil
    ]},
  ])

  const [restockHistory, setRestockHistory] = useState<RestockRecord[]>([
    { id: 1, itemId: 1, quantity: 30, date: '2026-02-20', supplier: 'Fresh Farms Ltd' },
    { id: 2, itemId: 2, quantity: 50, date: '2026-02-25', supplier: 'Meat Masters' },
    { id: 3, itemId: 3, quantity: 20, date: '2026-02-15', supplier: 'Oil Ghana' },
  ])

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRestockModal, setShowRestockModal] = useState(false)
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showMealCostModal, setShowMealCostModal] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [restockQuantity, setRestockQuantity] = useState(0)

  const [newItem, setNewItem] = useState({
    name: '',
    category: 'Ingredients',
    quantity: 0,
    unit: 'Pieces',
    minLevel: 10,
    costPerUnit: 0,
    supplier: '',
    supplierPhone: '',
    expiryDate: '',
    usagePerDay: 0
  })

  const getStatusColor = (status: string) => {
    if (status === 'In Stock') return 'var(--success-green)'
    if (status === 'Low Stock') return 'var(--warning-orange)'
    return 'var(--danger-red)'
  }

  const isExpiringSoon = (expiryDate?: string) => {
    if (!expiryDate) return false
    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 7 && daysUntilExpiry > 0
  }

  const isExpired = (expiryDate?: string) => {
    if (!expiryDate) return false
    return new Date(expiryDate) < new Date()
  }

  // Filter inventory items based on search and category
  const filteredItems = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (item.supplier && item.supplier.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  // Calculate totals
  const totalValue = inventory.reduce((sum, item) => sum + (item.quantity * item.costPerUnit), 0)
  const lowStockItems = inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').length
  const expiringItems = inventory.filter(i => isExpiringSoon(i.expiryDate) || isExpired(i.expiryDate)).length

  const addInventoryItem = () => {
    const newId = Math.max(...inventory.map(i => i.id), 0) + 1
    let status = 'In Stock'
    if (newItem.quantity === 0) status = 'Out of Stock'
    else if (newItem.quantity < newItem.minLevel) status = 'Low Stock'
    
    setInventory([...inventory, {
      id: newId,
      ...newItem,
      status,
      lastRestocked: new Date().toISOString().split('T')[0]
    }])
    setShowAddModal(false)
    setNewItem({ name: '', category: 'Ingredients', quantity: 0, unit: 'Pieces', minLevel: 10, costPerUnit: 0, supplier: '', supplierPhone: '', expiryDate: '', usagePerDay: 0 })
  }

  const restockItem = () => {
    if (selectedItem && restockQuantity > 0) {
      setInventory(inventory.map(item => {
        if (item.id === selectedItem.id) {
          const newQuantity = item.quantity + restockQuantity
          let status = 'In Stock'
          if (newQuantity === 0) status = 'Out of Stock'
          else if (newQuantity < item.minLevel) status = 'Low Stock'
          
          // Add to restock history
          const newRecord: RestockRecord = {
            id: Date.now(),
            itemId: item.id,
            quantity: restockQuantity,
            date: new Date().toISOString().split('T')[0],
            supplier: item.supplier || 'Unknown'
          }
          setRestockHistory([...restockHistory, newRecord])
          
          return { ...item, quantity: newQuantity, status, lastRestocked: new Date().toISOString().split('T')[0] }
        }
        return item
      }))
      setShowRestockModal(false)
      setSelectedItem(null)
      setRestockQuantity(0)
    }
  }

  const openRestockModal = (item: InventoryItem) => {
    setSelectedItem(item)
    setRestockQuantity(item.minLevel)
    setShowRestockModal(true)
  }

  const calculateMealCost = (itemId: number, portion: number) => {
    const item = inventory.find(i => i.id === itemId)
    if (item) {
      return (item.costPerUnit * portion).toFixed(2)
    }
    return '0.00'
  }

  // Calculate total cost of a meal based on ingredients
  const calculateTotalMealCost = (mealId: number): number => {
    const meal = mealCosts.find(m => m.mealId === mealId)
    if (!meal) return 0
    
    return meal.ingredients.reduce((total: number, ingredient) => {
      const item = inventory.find(i => i.id === ingredient.itemId)
      if (item) {
        return total + (item.costPerUnit * ingredient.portion)
      }
      return total
    }, 0)
  }

  // Calculate profit margin for a meal
  const calculateMealProfit = (mealId: number) => {
    const meal = mealCosts.find(m => m.mealId === mealId)
    if (!meal) return { cost: 0, profit: 0, margin: 0 }
    
    const cost = calculateTotalMealCost(mealId)
    const profit = meal.sellingPrice - cost
    const margin = (profit / meal.sellingPrice) * 100
    
    return {
      cost: cost.toFixed(2),
      profit: profit.toFixed(2),
      margin: margin.toFixed(1)
    }
  }

  // Calculate days until stock runs out based on usage
  const calculateDaysUntilStockout = (item: InventoryItem) => {
    if (!item.usagePerDay || item.usagePerDay === 0) return null
    return Math.floor(item.quantity / item.usagePerDay)
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-boxes" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Inventory Management</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn btn-primary" onClick={() => setShowMealCostModal(true)}>
            <i className="fas fa-calculator"></i> Meal Costs
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> Add Item
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>📦</div>
          <div className="stat-label">Total Items</div>
          <div className="stat-value">{inventory.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>⚠️</div>
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{lowStockItems}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>⏰</div>
          <div className="stat-label">Expiring Soon</div>
          <div className="stat-value">{expiringItems}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>💵</div>
          <div className="stat-label">Total Value</div>
          <div className="stat-value">${totalValue.toFixed(2)}</div>
        </div>
      </div>

      {/* Low Stock Alerts */}
      {lowStockItems > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px', border: '2px solid var(--warning-orange)' }}>
          <h4 style={{ margin: 0, color: 'var(--warning-orange)' }}>
            <i className="fas fa-exclamation-triangle"></i> Low Stock Alert: {lowStockItems} item(s) need restocking
          </h4>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            {inventory.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock').map(i => (
              <span key={i.id} style={{ marginRight: '1rem' }}>
                {i.name}: {i.quantity} {i.unit} (min: {i.minLevel})
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expiry Alerts */}
      {expiringItems > 0 && (
        <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', border: '2px solid var(--danger-red)' }}>
          <h4 style={{ margin: 0, color: 'var(--danger-red)' }}>
            <i className="fas fa-clock"></i> Expiry Warning: {expiringItems} item(s) expiring soon
          </h4>
          <div style={{ marginTop: '0.5rem', fontSize: '0.9rem', color: '#666' }}>
            {inventory.filter(i => isExpiringSoon(i.expiryDate) || isExpired(i.expiryDate)).map(i => (
              <span key={i.id} style={{ marginRight: '1rem', color: isExpired(i.expiryDate) ? 'var(--danger-red)' : 'var(--warning-orange)' }}>
                {i.name}: {i.expiryDate} {isExpired(i.expiryDate) ? '(EXPIRED)' : '(Expiring soon)'}
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
            placeholder="Search inventory..." 
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
          <option value="Ingredients">Ingredients</option>
          <option value="Supplies">Supplies</option>
          <option value="Beverages">Beverages</option>
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '130px' }}
        >
          <option value="all">All Status</option>
          <option value="In Stock">In Stock</option>
          <option value="Low Stock">Low Stock</option>
          <option value="Out of Stock">Out of Stock</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Unit Cost</th>
              <th>Total Value</th>
              <th>Supplier</th>
              <th>Expiry</th>
              <th>Daily Usage</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item, idx) => (
              <tr key={item.id} style={{ opacity: item.status === 'Out of Stock' ? 0.6 : 1 }}>
                <td>{idx + 1}</td>
                <td style={{ fontWeight: 600 }}>{item.name}</td>
                <td>
                  <span style={{ padding: '0.25rem 0.75rem', borderRadius: '12px', background: 'var(--secondary-cream)', fontSize: '0.85rem' }}>
                    {item.category}
                  </span>
                </td>
                <td>
                  <span style={{ fontWeight: 600, color: getStatusColor(item.status) }}>
                    {item.quantity} {item.unit}
                  </span>
                  <div style={{ fontSize: '0.75rem', color: '#666' }}>Min: {item.minLevel}</div>
                </td>
                <td>${item.costPerUnit.toFixed(2)}</td>
                <td style={{ fontWeight: 600 }}>${(item.quantity * item.costPerUnit).toFixed(2)}</td>
                <td>
                  {item.supplier ? (
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.supplier}</div>
                      <div style={{ fontSize: '0.75rem', color: '#666' }}>{item.supplierPhone}</div>
                    </div>
                  ) : '-'}
                </td>
                <td>
                  {item.expiryDate ? (
                    <span style={{ 
                      color: isExpired(item.expiryDate) ? 'var(--danger-red)' : isExpiringSoon(item.expiryDate) ? 'var(--warning-orange)' : '#666',
                      fontWeight: isExpired(item.expiryDate) || isExpiringSoon(item.expiryDate) ? 600 : 400
                    }}>
                      {item.expiryDate}
                      {isExpired(item.expiryDate) && ' (EXPIRED)'}
                      {isExpiringSoon(item.expiryDate) && ' (Soon)'}
                    </span>
                  ) : '-'}
                </td>
                <td>
                  {item.usagePerDay ? (
                    <div>
                      <span style={{ fontWeight: 600 }}>{item.usagePerDay} {item.unit}/day</span>
                      {calculateDaysUntilStockout(item) !== null && (
                        <div style={{ fontSize: '0.75rem', color: calculateDaysUntilStockout(item)! <= 3 ? 'var(--danger-red)' : '#666' }}>
                          ~{calculateDaysUntilStockout(item)} days left
                        </div>
                      )}
                    </div>
                  ) : '-'}
                </td>
                <td>
                  <span style={{ 
                    padding: '0.3rem 0.7rem',
                    borderRadius: '12px',
                    fontWeight: 600,
                    fontSize: '0.8rem',
                    background: item.status === 'In Stock' ? 'rgba(16, 185, 129, 0.15)' : 
                               item.status === 'Low Stock' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                    color: getStatusColor(item.status)
                  }}>
                    {item.status}
                  </span>
                </td>
                <td>
                  <button 
                    className="btn btn-primary btn-small" 
                    style={{ marginRight: '0.5rem' }}
                    onClick={() => openRestockModal(item)}
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

      {/* Restock History */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Restock History</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Item</th>
              <th>Quantity Added</th>
              <th>Supplier</th>
            </tr>
          </thead>
          <tbody>
            {restockHistory.map((record) => {
              const item = inventory.find(i => i.id === record.itemId)
              return (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td style={{ fontWeight: 600 }}>{item?.name || 'Unknown'}</td>
                  <td>{record.quantity} {item?.unit}</td>
                  <td>{record.supplier}</td>
                </tr>
              )
            })}
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
              <label>Item Name *</label>
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

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Min Level</label>
                <input 
                  type="number" 
                  placeholder="10"
                  value={newItem.minLevel || ''}
                  onChange={(e) => setNewItem({ ...newItem, minLevel: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Cost Per Unit ($)</label>
                <input 
                  type="number" 
                  placeholder="0.00"
                  step="0.01"
                  value={newItem.costPerUnit || ''}
                  onChange={(e) => setNewItem({ ...newItem, costPerUnit: parseFloat(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Daily Usage</label>
                <input 
                  type="number" 
                  placeholder="0"
                  value={newItem.usagePerDay || ''}
                  onChange={(e) => setNewItem({ ...newItem, usagePerDay: parseInt(e.target.value) || 0 })}
                />
              </div>
              <div className="form-group">
                <label>Expiry Date</label>
                <input 
                  type="date" 
                  value={newItem.expiryDate}
                  onChange={(e) => setNewItem({ ...newItem, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <h4 style={{ marginTop: '1rem', marginBottom: '0.5rem' }}>Supplier Information</h4>
            
            <div className="form-group">
              <label>Supplier Name</label>
              <input 
                type="text" 
                placeholder="e.g., Fresh Farms Ltd"
                value={newItem.supplier}
                onChange={(e) => setNewItem({ ...newItem, supplier: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Supplier Phone</label>
              <input 
                type="tel" 
                placeholder="+233 24 XXX XXXX"
                value={newItem.supplierPhone}
                onChange={(e) => setNewItem({ ...newItem, supplierPhone: e.target.value })}
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

      {/* Restock Modal */}
      {showRestockModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Restock {selectedItem.name}</h2>
              <button className="modal-close" onClick={() => setShowRestockModal(false)}>×</button>
            </div>
            
            <div style={{ marginBottom: '1rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
              <p style={{ margin: 0 }}>Current Stock: <strong>{selectedItem.quantity} {selectedItem.unit}</strong></p>
              <p style={{ margin: '0.5rem 0 0' }}>Min Level: <strong>{selectedItem.minLevel}</strong></p>
            </div>

            <div className="form-group">
              <label>Quantity to Add</label>
              <input 
                type="number" 
                placeholder="Enter quantity"
                value={restockQuantity}
                onChange={(e) => setRestockQuantity(parseInt(e.target.value) || 0)}
              />
            </div>

            <div style={{ marginBottom: '1rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
              <p style={{ margin: 0, color: 'var(--success-green)' }}>
                New Stock: <strong>{selectedItem.quantity + restockQuantity} {selectedItem.unit}</strong>
              </p>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={restockItem}>
                <i className="fas fa-plus"></i> Restock
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowRestockModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Meal Cost Calculator Modal */}
      {showMealCostModal && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '700px' }}>
            <div className="modal-header">
              <h2>Cost & Profit Control</h2>
              <button className="modal-close" onClick={() => setShowMealCostModal(false)}>×</button>
            </div>
            
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Calculate ingredient costs and profit margins for menu items. This helps control costs and maximize profitability.
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
              {mealCosts.map(meal => {
                const profit = calculateMealProfit(meal.mealId)
                const isProfitable = parseFloat(profit.margin) > 30
                
                return (
                  <div key={meal.mealId} style={{ 
                    padding: '1rem', 
                    background: isProfitable ? 'rgba(16, 185, 129, 0.1)' : 'rgba(245, 158, 11, 0.1)', 
                    borderRadius: '8px',
                    border: `2px solid ${isProfitable ? 'var(--success-green)' : 'var(--warning-orange)'}`
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                      <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{meal.mealName}</h4>
                      <span style={{ fontWeight: 700, fontSize: '1.2rem' }}>${meal.sellingPrice}</span>
                    </div>
                    
                    <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.75rem' }}>
                      <strong>Ingredients:</strong>
                      {meal.ingredients.map((ing, idx) => {
                        const item = inventory.find(i => i.id === ing.itemId)
                        return (
                          <span key={idx} style={{ display: 'block' }}>
                            • {item?.name}: {ing.portion} {ing.unit} = ${calculateMealCost(ing.itemId, ing.portion)}
                          </span>
                        )
                      })}
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', paddingTop: '0.75rem', borderTop: '1px solid #ddd' }}>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Cost</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>${profit.cost}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Profit</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: 'var(--success-green)' }}>${profit.profit}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>Margin</div>
                        <div style={{ fontWeight: 600, fontSize: '1.1rem', color: isProfitable ? 'var(--success-green)' : 'var(--warning-orange)' }}>
                          {profit.margin}%
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
              <h4 style={{ margin: '0 0 0.5rem' }}>💡 Tips for Profit Control</h4>
              <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#666' }}>
                <li>Aim for 30%+ profit margin on menu items</li>
                <li>Track daily usage to predict restocking needs</li>
                <li>Monitor expiry dates to reduce waste</li>
                <li>Negotiate with suppliers for bulk discounts</li>
              </ul>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowMealCostModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
