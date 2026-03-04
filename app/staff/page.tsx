'use client'

import { useState } from 'react'

interface Staff {
  id: number
  name: string
  role: string
  phone: string
  shift: string
  status: string
  initials: string
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, name: 'John Manager', role: 'Manager', phone: '+1 234 567 8900', shift: 'Morning', status: 'On Duty', initials: 'JM' },
    { id: 2, name: 'Chef Kitchen', role: 'Chef', phone: '+1 234 567 8901', shift: 'Morning', status: 'On Duty', initials: 'CK' },
    { id: 3, name: 'Waiter Smith', role: 'Waiter', phone: '+1 234 567 8902', shift: 'Evening', status: 'On Duty', initials: 'WS' },
    { id: 4, name: 'Barista Jones', role: 'Barista', phone: '+1 234 567 8903', shift: 'Morning', status: 'On Leave', initials: 'BJ' },
    { id: 5, name: 'Driver Wilson', role: 'Delivery', phone: '+1 234 567 8904', shift: 'Evening', status: 'Off Duty', initials: 'DW' },
  ])

  const [showAddModal, setShowAddModal] = useState(false)
  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Waiter',
    phone: '',
    shift: 'Morning',
    status: 'On Duty'
  })

  const getStatusColor = (status: string) => {
    if (status === 'On Duty') return 'var(--success-green)'
    if (status === 'On Leave') return 'var(--warning-orange)'
    return 'var(--danger-red)'
  }

  const addStaffMember = () => {
    const newId = Math.max(...staff.map(s => s.id), 0) + 1
    const initials = newStaff.name.split(' ').map(n => n[0]).join('').toUpperCase()
    setStaff([...staff, {
      id: newId,
      ...newStaff,
      initials
    }])
    setShowAddModal(false)
    setNewStaff({ name: '', role: 'Waiter', phone: '', shift: 'Morning', status: 'On Duty' })
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-user-tie" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Staff Management</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <i className="fas fa-plus"></i> Add Staff
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>👥</div>
          <div className="stat-label">Total Staff</div>
          <div className="stat-value">{staff.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>🟢</div>
          <div className="stat-label">On Duty</div>
          <div className="stat-value">{staff.filter(s => s.status === 'On Duty').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>🟡</div>
          <div className="stat-label">On Leave</div>
          <div className="stat-value">{staff.filter(s => s.status === 'On Leave').length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>🔴</div>
          <div className="stat-label">Off Duty</div>
          <div className="stat-value">{staff.filter(s => s.status === 'Off Duty').length}</div>
        </div>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Photo</th>
              <th>Name</th>
              <th>Role</th>
              <th>Phone</th>
              <th>Shift</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map((member, idx) => (
              <tr key={member.id}>
                <td>{idx + 1}</td>
                <td>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                    {member.initials}
                  </div>
                </td>
                <td style={{ fontWeight: 600 }}>{member.name}</td>
                <td>{member.role}</td>
                <td>{member.phone}</td>
                <td>{member.shift}</td>
                <td>
                  <span style={{ color: getStatusColor(member.status), fontWeight: 600 }}>
                    {member.status}
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

      {/* Add Staff Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Staff Member</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            
            <div className="form-group">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="e.g., John Smith"
                value={newStaff.name}
                onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Role</label>
              <select 
                value={newStaff.role}
                onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}
              >
                <option>Manager</option>
                <option>Chef</option>
                <option>Waiter</option>
                <option>Barista</option>
                <option>Delivery</option>
              </select>
            </div>

            <div className="form-group">
              <label>Phone Number</label>
              <input 
                type="tel" 
                placeholder="e.g., +1 234 567 8900"
                value={newStaff.phone}
                onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label>Shift</label>
              <select 
                value={newStaff.shift}
                onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}
              >
                <option>Morning</option>
                <option>Evening</option>
                <option>Night</option>
              </select>
            </div>

            <div className="form-group">
              <label>Status</label>
              <select 
                value={newStaff.status}
                onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}
              >
                <option>On Duty</option>
                <option>Off Duty</option>
                <option>On Leave</option>
              </select>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addStaffMember}>
                <i className="fas fa-plus"></i> Add Staff
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
