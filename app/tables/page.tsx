'use client'

import { useState } from 'react'

interface Table {
  id: number
  status: 'occupied' | 'available' | 'reserved' | 'cleaning'
  guest: string | null
  time: string | null
  capacity: number
  bill: number
  waiter: string | null
  orderItems: { name: string; quantity: number }[]
}

interface Reservation {
  id: number
  guestName: string
  phone: string
  tableId: number
  dateTime: string
  status: 'pending' | 'confirmed' | 'seated' | 'cancelled'
}

export default function TablesPage() {
  const [tables, setTables] = useState<Table[]>([
    { id: 1, status: 'occupied', guest: 'John Doe', time: '45 min', capacity: 4, bill: 240, waiter: 'Waiter Smith', orderItems: [{ name: 'Jollof Rice', quantity: 2 }, { name: 'Grilled Chicken', quantity: 1 }] },
    { id: 2, status: 'available', guest: null, time: null, capacity: 2, bill: 0, waiter: null, orderItems: [] },
    { id: 3, status: 'occupied', guest: 'Jane Smith', time: '20 min', capacity: 6, bill: 180, waiter: 'Barista Jones', orderItems: [{ name: 'Pizza', quantity: 2 }, { name: 'Smoothie', quantity: 3 }] },
    { id: 4, status: 'reserved', guest: 'Mike Johnson', time: '18:00', capacity: 4, bill: 0, waiter: null, orderItems: [] },
    { id: 5, status: 'available', guest: null, time: null, capacity: 8, bill: 0, waiter: null, orderItems: [] },
    { id: 6, status: 'cleaning', guest: null, time: null, capacity: 4, bill: 0, waiter: null, orderItems: [] },
    { id: 7, status: 'available', guest: null, time: null, capacity: 2, bill: 0, waiter: null, orderItems: [] },
    { id: 8, status: 'occupied', guest: 'Sarah Williams', time: '1h 10min', capacity: 6, bill: 320, waiter: 'Waiter Smith', orderItems: [{ name: 'Burger', quantity: 3 }, { name: 'Fries', quantity: 2 }, { name: 'Coke', quantity: 3 }] },
    { id: 9, status: 'reserved', guest: 'Tom Brown', time: '19:00', capacity: 4, bill: 0, waiter: null, orderItems: [] },
    { id: 10, status: 'occupied', guest: 'Emily Davis', time: '35 min', capacity: 8, bill: 450, waiter: 'Driver Wilson', orderItems: [{ name: 'Pasta', quantity: 2 }, { name: 'Salad', quantity: 2 }, { name: 'Wine', quantity: 2 }] },
    { id: 11, status: 'available', guest: null, time: null, capacity: 4, bill: 0, waiter: null, orderItems: [] },
    { id: 12, status: 'reserved', guest: 'Lisa Anderson', time: '20:00', capacity: 6, bill: 0, waiter: null, orderItems: [] },
  ])

  const [reservations, setReservations] = useState<Reservation[]>([
    { id: 1, guestName: 'John Doe', phone: '+1 234 567 8900', tableId: 4, dateTime: 'Today, 7:00 PM', status: 'confirmed' },
    { id: 2, guestName: 'Jane Smith', phone: '+1 234 567 8901', tableId: 9, dateTime: 'Today, 8:00 PM', status: 'pending' },
    { id: 3, guestName: 'Mike Johnson', phone: '+1 234 567 8902', tableId: 12, dateTime: 'Tomorrow, 6:00 PM', status: 'confirmed' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [showReservationModal, setShowReservationModal] = useState(false)
  const [showTableDetailsModal, setShowTableDetailsModal] = useState(false)
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null)
  const [selectedTable, setSelectedTable] = useState<Table | null>(null)
  const [newTable, setNewTable] = useState({ capacity: 4 })
  const [newReservation, setNewReservation] = useState({
    guestName: '',
    phone: '',
    tableId: 0,
    dateTime: ''
  })

  const statusColors: Record<string, string> = {
    occupied: '#ef4444',  // Red
    available: '#10b981', // Green
    reserved: '#f97316',  // Orange
    cleaning: '#8b5cf6'  // Purple
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
  const totalBill = tables.reduce((sum, t) => sum + t.bill, 0)

  const addTable = () => {
    const newId = Math.max(...tables.map(t => t.id), 0) + 1
    setTables([...tables, {
      id: newId,
      status: 'available',
      guest: null,
      time: null,
      capacity: newTable.capacity,
      bill: 0,
      waiter: null,
      orderItems: []
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

  const openTableDetails = (table: Table) => {
    setSelectedTable(table)
    setShowTableDetailsModal(true)
  }

  const updateTableStatus = (tableId: number, newStatus: Table['status'], guest?: string) => {
    setTables(tables.map(t => {
      if (t.id === tableId) {
        return {
          ...t,
          status: newStatus,
          guest: newStatus === 'occupied' ? guest || 'Guest' : null,
          time: newStatus === 'occupied' ? '0 min' : null,
          bill: newStatus === 'available' || newStatus === 'cleaning' ? 0 : t.bill,
          waiter: newStatus === 'occupied' ? t.waiter : null,
          orderItems: newStatus === 'available' || newStatus === 'cleaning' ? [] : t.orderItems
        }
      }
      return t
    }))
    setShowTableDetailsModal(false)
  }

  const addReservation = () => {
    if (newReservation.guestName && newReservation.phone && newReservation.tableId && newReservation.dateTime) {
      const newId = Math.max(...reservations.map(r => r.id), 0) + 1
      setReservations([...reservations, {
        id: newId,
        ...newReservation,
        status: 'pending'
      }])
      // Update table to reserved
      setTables(tables.map(t => {
        if (t.id === newReservation.tableId) {
          return { ...t, status: 'reserved' as const, guest: newReservation.guestName }
        }
        return t
      }))
      setShowReservationModal(false)
      setNewReservation({ guestName: '', phone: '', tableId: 0, dateTime: '' })
    }
  }

  const seatReservation = (reservation: Reservation) => {
    setTables(tables.map(t => {
      if (t.id === reservation.tableId) {
        return { ...t, status: 'occupied' as const, guest: reservation.guestName, time: '0 min', bill: 0, waiter: 'Waiter Smith', orderItems: [] }
      }
      return t
    }))
    setReservations(reservations.map(r => 
      r.id === reservation.id ? { ...r, status: 'seated' as const } : r
    ))
  }

  const cancelReservation = (reservationId: number, tableId: number) => {
    setReservations(reservations.filter(r => r.id !== reservationId))
    setTables(tables.map(t => {
      if (t.id === tableId && t.status === 'reserved') {
        return { ...t, status: 'available' as const, guest: null }
      }
      return t
    }))
  }

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chair" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Table Management</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button className="btn" style={{ background: 'var(--accent-gold)', color: 'var(--text-dark)' }} onClick={() => setShowReservationModal(true)}>
            <i className="fas fa-calendar-plus"></i> Add Reservation
          </button>
          <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
            <i className="fas fa-plus"></i> Add Table
          </button>
        </div>
      </div>

      {/* Table Status Summary */}
      <div className="grid grid-5" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: '#10b981' }}>🟢</div>
          <div className="stat-label">Available</div>
          <div className="stat-value">{availableCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: '#ef4444' }}>🔴</div>
          <div className="stat-label">Occupied</div>
          <div className="stat-value">{occupiedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: '#f97316' }}>🟠</div>
          <div className="stat-label">Reserved</div>
          <div className="stat-value">{reservedCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: '#8b5cf6' }}>🧹</div>
          <div className="stat-label">Cleaning</div>
          <div className="stat-value">{cleaningCount}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>💰</div>
          <div className="stat-label">Total Bills</div>
          <div className="stat-value">${totalBill}</div>
        </div>
      </div>

      {/* Floor Plan - Restaurant Layout */}
      <div className="card">
        <h3 style={{ marginBottom: '1.5rem' }}>Restaurant Floor Layout</h3>
        
        {/* Legend */}
        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#10b981' }}></div>
            <span style={{ fontSize: '0.9rem' }}>Available</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#ef4444' }}></div>
            <span style={{ fontSize: '0.9rem' }}>Occupied</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#f97316' }}></div>
            <span style={{ fontSize: '0.9rem' }}>Reserved</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ width: 16, height: 16, borderRadius: 4, background: '#8b5cf6' }}></div>
            <span style={{ fontSize: '0.9rem' }}>Cleaning</span>
          </div>
        </div>

        {/* Tables Grid - Restaurant Floor */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(4, 1fr)', 
          gap: '1.5rem',
          padding: '1.5rem',
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
          borderRadius: '12px',
          border: '2px dashed #dee2e6'
        }}>
          {tables.map((table) => (
            <div
              key={table.id}
              onClick={() => openTableDetails(table)}
              style={{
                padding: '1.25rem',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${statusColors[table.status]}20 0%, ${statusColors[table.status]}05 100%)`,
                border: `3px solid ${statusColors[table.status]}`,
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: `0 4px 15px ${statusColors[table.status]}30`
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.03)'
                e.currentTarget.style.boxShadow = `0 8px 25px ${statusColors[table.status]}50`
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
                e.currentTarget.style.boxShadow = `0 4px 15px ${statusColors[table.status]}30`
              }}
            >
              {/* Table Icon */}
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>
                {table.status === 'occupied' ? '🍽️' : table.status === 'reserved' ? '📅' : table.status === 'cleaning' ? '🧹' : '🪑'}
              </div>
              
              {/* Table Number */}
              <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-dark)' }}>
                Table {table.id}
              </div>
              
              {/* Status */}
              <div style={{ 
                fontSize: '0.85rem', 
                color: statusColors[table.status], 
                textTransform: 'capitalize',
                fontWeight: 600,
                marginBottom: '0.5rem'
              }}>
                {statusLabels[table.status]}
              </div>

              {/* Occupied Details */}
              {table.status === 'occupied' && (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '8px', 
                  padding: '0.5rem',
                  marginTop: '0.5rem',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontWeight: 600 }}>{table.guest}</div>
                  <div style={{ color: '#666' }}>{table.time}</div>
                  <div style={{ color: 'var(--primary-red)', fontWeight: 700, marginTop: '0.25rem' }}>
                    ${table.bill}
                  </div>
                </div>
              )}

              {/* Reserved Details */}
              {table.status === 'reserved' && table.guest && (
                <div style={{ 
                  background: 'white', 
                  borderRadius: '8px', 
                  padding: '0.5rem',
                  marginTop: '0.5rem',
                  fontSize: '0.8rem'
                }}>
                  <div style={{ fontWeight: 600 }}>{table.guest}</div>
                  <div style={{ color: '#666' }}>{table.time}</div>
                </div>
              )}

              {/* Capacity */}
              <div style={{ fontSize: '0.75rem', color: '#999', marginTop: '0.5rem' }}>
                👥 {table.capacity} seats
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Bills Summary */}
      <div className="card" style={{ marginTop: '2rem' }}>
        <h3 style={{ marginBottom: '1rem' }}>Active Bills</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Table</th>
              <th>Guest</th>
              <th>Waiter</th>
              <th>Time</th>
              <th>Items</th>
              <th>Bill</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.filter(t => t.status === 'occupied').map((table) => (
              <tr key={table.id}>
                <td style={{ fontWeight: 600 }}>Table {table.id}</td>
                <td>{table.guest}</td>
                <td>{table.waiter}</td>
                <td>{table.time}</td>
                <td>
                  {table.orderItems.map((item, idx) => (
                    <div key={idx}>{item.quantity}x {item.name}</div>
                  ))}
                </td>
                <td style={{ fontWeight: 700, color: 'var(--primary-red)' }}>${table.bill}</td>
                <td>
                  <button 
                    className="btn btn-primary btn-small"
                    onClick={() => openTableDetails(table)}
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tables.filter(t => t.status === 'occupied').length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
            No active bills at the moment
          </div>
        )}
      </div>

      {/* Reservations */}
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
              {reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td style={{ fontWeight: 600 }}>{reservation.guestName}</td>
                  <td>{reservation.phone}</td>
                  <td>Table {reservation.tableId}</td>
                  <td>{reservation.dateTime}</td>
                  <td>
                    <span style={{ 
                      color: reservation.status === 'confirmed' ? '#10b981' : 
                             reservation.status === 'pending' ? '#f97316' :
                             reservation.status === 'seated' ? 'var(--primary-red)' : '#999',
                      fontWeight: 600,
                      textTransform: 'capitalize'
                    }}>
                      {reservation.status}
                    </span>
                  </td>
                  <td>
                    {reservation.status !== 'seated' && (
                      <>
                        <button 
                          className="btn btn-primary btn-small" 
                          style={{ marginRight: '0.5rem' }}
                          onClick={() => seatReservation(reservation)}
                        >
                          Seat
                        </button>
                        <button 
                          className="btn btn-outline btn-small"
                          onClick={() => cancelReservation(reservation.id, reservation.tableId)}
                        >
                          Cancel
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {reservations.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#999' }}>
              No reservations
            </div>
          )}
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

      {/* Add Reservation Modal */}
      {showReservationModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add Reservation</h2>
              <button className="modal-close" onClick={() => setShowReservationModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Guest Name</label>
              <input 
                type="text" 
                placeholder="Enter guest name"
                value={newReservation.guestName}
                onChange={(e) => setNewReservation({ ...newReservation, guestName: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                placeholder="+1 234 567 8900"
                value={newReservation.phone}
                onChange={(e) => setNewReservation({ ...newReservation, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Select Table</label>
              <select 
                value={newReservation.tableId}
                onChange={(e) => setNewReservation({ ...newReservation, tableId: parseInt(e.target.value) })}
              >
                <option value={0}>Select a table</option>
                {tables.filter(t => t.status === 'available').map(t => (
                  <option key={t.id} value={t.id}>Table {t.id} ({t.capacity} seats)</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Date & Time</label>
              <input 
                type="datetime-local" 
                value={newReservation.dateTime}
                onChange={(e) => setNewReservation({ ...newReservation, dateTime: e.target.value })}
              />
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addReservation}>
                <i className="fas fa-calendar-plus"></i> Add Reservation
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowReservationModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Table Details Modal */}
      {showTableDetailsModal && selectedTable && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h2>Table {selectedTable.id} Details</h2>
              <button className="modal-close" onClick={() => setShowTableDetailsModal(false)}>×</button>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              {/* Status Badge */}
              <div style={{ 
                display: 'inline-block',
                padding: '0.5rem 1rem',
                borderRadius: '20px',
                background: statusColors[selectedTable.status],
                color: 'white',
                fontWeight: 600,
                marginBottom: '1rem'
              }}>
                {statusLabels[selectedTable.status]}
              </div>

              {/* Table Info */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Capacity</div>
                  <div style={{ fontWeight: 600 }}>{selectedTable.capacity} seats</div>
                </div>
                {selectedTable.status === 'occupied' && (
                  <>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Guest</div>
                      <div style={{ fontWeight: 600 }}>{selectedTable.guest}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Waiter</div>
                      <div style={{ fontWeight: 600 }}>{selectedTable.waiter}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Time</div>
                      <div style={{ fontWeight: 600 }}>{selectedTable.time}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#666' }}>Current Bill</div>
                      <div style={{ fontWeight: 700, fontSize: '1.25rem', color: 'var(--primary-red)' }}>${selectedTable.bill}</div>
                    </div>
                  </>
                )}
              </div>

              {/* Order Items */}
              {selectedTable.status === 'occupied' && selectedTable.orderItems.length > 0 && (
                <div style={{ marginTop: '1rem' }}>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '0.5rem' }}>Order Items</div>
                  <div style={{ background: 'var(--secondary-cream)', borderRadius: '8px', padding: '0.75rem' }}>
                    {selectedTable.orderItems.map((item, idx) => (
                      <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.25rem 0' }}>
                        <span>{item.quantity}x {item.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {selectedTable.status === 'available' && (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    const guestName = prompt('Enter guest name:')
                    if (guestName) {
                      updateTableStatus(selectedTable.id, 'occupied', guestName)
                    }
                  }}
                >
                  <i className="fas fa-user-plus"></i> Seat Guest
                </button>
              )}
              {selectedTable.status === 'occupied' && (
                <>
                  <button 
                    className="btn btn-primary" 
                    style={{ width: '100%' }}
                    onClick={() => {
                      updateTableStatus(selectedTable.id, 'cleaning')
                    }}
                  >
                    <i className="fas fa-check"></i> Mark as Paid & Done
                  </button>
                  <button 
                    className="btn" 
                    style={{ width: '100%', background: 'var(--accent-gold)', color: 'var(--text-dark)' }}
                    onClick={() => {
                      // View bill - would redirect to orders
                      alert(`Viewing bill for Table ${selectedTable.id}`)
                    }}
                  >
                    <i className="fas fa-receipt"></i> View Full Bill
                  </button>
                </>
              )}
              {selectedTable.status === 'reserved' && (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    updateTableStatus(selectedTable.id, 'occupied', selectedTable.guest || 'Guest')
                  }}
                >
                  <i className="fas fa-user-check"></i> Seat Guest
                </button>
              )}
              {selectedTable.status === 'cleaning' && (
                <button 
                  className="btn btn-primary" 
                  style={{ width: '100%' }}
                  onClick={() => {
                    updateTableStatus(selectedTable.id, 'available')
                  }}
                >
                  <i className="fas fa-check"></i> Mark as Available
                </button>
              )}
              <button 
                className="btn" 
                style={{ width: '100%', border: '2px solid var(--danger-red)', color: 'var(--danger-red)', background: 'transparent' }}
                onClick={() => openDeleteModal(selectedTable.id)}
              >
                <i className="fas fa-trash"></i> Delete Table
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
