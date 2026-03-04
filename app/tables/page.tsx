'use client'

import { useState } from 'react'

interface Table {
  id: number
  status: 'occupied' | 'available' | 'reserved' | 'cleaning'
  guest: string | null
  time: string | null
  capacity: number
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, status: 'occupied', guest: 'John Doe', time: '45 min', capacity: 4 },
    { id: 2, status: 'available', guest: null, time: null, capacity: 2 },
    { id: 3, status: 'occupied', guest: 'Jane Smith', time: '20 min', capacity: 6 },
    { id: 4, status: 'reserved', guest: 'Mike Johnson', time: '18:00', capacity: 4 },
    { id: 5, status: 'available', guest: null, time: null, capacity: 8 },
    { id: 6, status: 'cleaning', guest: null, time: null, capacity: 4 },
    { id: 7, status: 'available', guest: null, time: null, capacity: 2 },
    { id: 8, status: 'occupied', guest: 'Sarah Williams', time: '1h 10min', capacity: 6 },
    { id: 9, status: 'reserved', guest: 'Tom Brown', time: '19:00', capacity: 4 },
    { id: 10, status: 'occupied', guest: 'Emily Davis', time: '35 min', capacity: 8 },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [newTable, setNewTable] = useState({ capacity: 4 })

  const statusColors: Record<string, string> = {
    occupied: '#10b981',
    available: '#3b82f6',
    reserved: '#f59e0b',
    cleaning: '#8b5cf6'
  }

  const statusLabels: Record<string, string> = {
    occupied: 'Occupied',
    available: 'Available',
    reserved: 'Reserved',
    cleaning: 'Cleaning'
  }

  const occupiedCount = tables.filter(t => t.status === 'occupied').length
  const availableCount = tables.filter(t => t.status === 'available').length
  const reservedCount = tables.filter(t => t.status === 'reserved').length
  const cleaningCount = tables.filter(t => t.status === 'cleaning').length

  const addTable = () => {
    const newId = Math.max(...tables.map(t => t.id), 0) + 1
    setTables([...tables, {
      id: newId,
      status: 'available',
      guest: null,
      time: null,
      capacity: newTable.capacity
    }])
    setShowAddModal(false)
    setNewTable({ capacity: 4 })
  }

  const deleteTable = (id: number) => {
    setTables(tables.filter(t => t.id !== id))
    setShowDeleteModal(false)
    setSelectedTableId(null)
  }

  const openDeleteModal = (id: number) => {
    setSelectedTableId(id)
    setShowDeleteModal(true)
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chair" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Table Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Table
        </button>
      </div>

      {/* Table Status Summary */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: '#10b981' }}>✓</div>
          <div className="stat-label">Available</div>
          <div className="stat-value">{availableCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>🕐</div>
          <div className="stat-label">Occupied</div>
          <div className="stat-value">{occupiedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>⏳</div>
          <div className="stat-label">Reserved</div>
          <div className="stat-value">{reservedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: '#8b5cf6' }}>🧹</div>
          <div className="stat-label">Cleaning</div>
          <div className="stat-value">{cleaningCount}</div>
        </div>
      </div>

      {/* Floor Plan */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Floor Plan</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
          {tables.map((table) => (
            <div
              key={table.id}
              style={{
                padding: '1.5rem',
                borderRadius: '12px',
                background: `linear-gradient(135deg, ${statusColors[table.status]}20 0%, ${statusColors[table.status]}10 100%)`,
                border: `2px solid ${statusColors[table.status]}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                position: 'relative'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  openDeleteModal(table.id)
                }}
                style={{
                  position: 'absolute',
                  top: '0.5rem',
                  right: '0.5rem',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: 'none',
                  background: 'var(--danger-red)',
                  color: 'white',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.8rem'
                }}
              >
                ×
              </button>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🪑</div>
              <div style={{ fontWeight: 600 }}>Table {table.id}</div>
              <div style={{ fontSize: '0.85rem', color: statusColors[table.status], textTransform: 'capitalize' }}>
                {statusLabels[table.status]}
              </div>
              {table.guest && (
                <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '0.25rem' }}>
                  {table.guest} • {table.time}
                </div>
              )}
              <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.25rem' }}>
                Capacity: {table.capacity}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reservations */}
      <div style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Reservations</h3>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Guest Name</th>
                <th>Phone</th>
                <th>Table</th>
                <th>Date & Time</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>+1 234 567 8900</td>
                <td>Table 4</td>
                <td>Today, 7:00 PM</td>
                <td><span style={{ color: 'var(--warning-orange)', fontWeight: 600 }}>Reserved</span></td>
                <td>
                  <button className="btn btn-primary btn-small">Seat</button>
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>+1 234 567 8901</td>
                <td>Table 9</td>
                <td>Today, 8:00 PM</td>
                <td><span style={{ color: 'var(--warning-orange)', fontWeight: 600 }}>Reserved</span></td>
                <td>
                  <button className="btn btn-primary btn-small">Seat</button>
                </td>
              </tr>
              <tr>
                <td>Mike Johnson</td>
                <td>+1 234 567 8902</td>
                <td>Table 2</td>
                <td>Tomorrow, 6:00 PM</td>
                <td><span style={{ color: '#8b5cf6', fontWeight: 600 }}>Confirmed</span></td>
                <td>
                  <button className="btn btn-outline btn-small">Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Table</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Table Capacity (seats)</label>
              <select 
                value={newTable.capacity}
                onChange={(e) => setNewTable({ capacity: parseInt(e.target.value) })}
              >
                <option value={2}>2 Seats</option>
                <option value={4}>4 Seats</option>
                <option value={6}>6 Seats</option>
                <option value={8}>8 Seats</option>
                <option value={10}>10 Seats</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addTable}>
                <i className="fas fa-plus"></i> Add Table
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
              <h2>Delete Table</h2>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            
            <p style={{ marginBottom: '1.5rem' }}>
              Are you sure you want to delete Table {selectedTableId}? This action cannot be undone.
            </p>

            <div className="modal-actions">
              <button 
                className="btn btn-danger" 
                style={{ flex: 1, background: 'var(--danger-red)' }} 
                onClick={() => selectedTableId && deleteTable(selectedTableId)}
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
