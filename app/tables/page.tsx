'use client'

export default function TablesPage() {
  const tables = [
    { id: 1, status: 'occupied', guest: 'John Doe', time: '45 min' },
    { id: 2, status: 'available', guest: null, time: null },
    { id: 3, status: 'occupied', guest: 'Jane Smith', time: '20 min' },
    { id: 4, status: 'reserved', guest: 'Mike Johnson', time: '18:00' },
    { id: 5, status: 'available', guest: null, time: null },
    { id: 6, status: 'cleaning', guest: null, time: null },
    { id: 7, status: 'available', guest: null, time: null },
    { id: 8, status: 'occupied', guest: 'Sarah Williams', time: '1h 10min' },
    { id: 9, status: 'reserved', guest: 'Tom Brown', time: '19:00' },
    { id: 10, status: 'occupied', guest: 'Emily Davis', time: '35 min' },
    { id: 11, status: 'available', guest: null, time: null },
    { id: 12, status: 'cleaning', guest: null, time: null },
  ]

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

  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chair" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Table Management</h1>
        </div>
        <button className="btn btn-primary">
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
                transition: 'transform 0.2s'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.02)'
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'scale(1)'
              }}
            >
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
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Seat</button>
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>+1 234 567 8901</td>
                <td>Table 9</td>
                <td>Today, 8:00 PM</td>
                <td><span style={{ color: 'var(--warning-orange)', fontWeight: 600 }}>Reserved</span></td>
                <td>
                  <button className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Seat</button>
                </td>
              </tr>
              <tr>
                <td>Mike Johnson</td>
                <td>+1 234 567 8902</td>
                <td>Table 2</td>
                <td>Tomorrow, 6:00 PM</td>
                <td><span style={{ color: '#8b5cf6', fontWeight: 600 }}>Confirmed</span></td>
                <td>
                  <button className="btn" style={{ border: '1px solid var(--primary-red)', color: 'var(--primary-red)', background: 'transparent', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>Edit</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
