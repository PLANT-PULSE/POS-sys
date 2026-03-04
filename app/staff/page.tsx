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
  email?: string
  salary?: number
  hireDate?: string
  permissions?: string[]
}

const ROLE_PERMISSIONS: { [key: string]: string[] } = {
  'Admin': ['full_access', 'manage_staff', 'manage_inventory', 'view_reports', 'process_orders', 'manage_customers'],
  'Manager': ['view_reports', 'manage_inventory', 'process_orders', 'manage_customers', 'view_staff'],
  'Chef': ['view_orders', 'manage_kitchen', 'view_inventory'],
  'Cashier': ['process_orders', 'view_menu', 'view_customers'],
  'Waiter': ['take_orders', 'view_menu', 'view_tables'],
  'Barista': ['prepare_drinks', 'view_menu', 'process_orders'],
  'Delivery': ['view_deliveries', 'update_order_status'],
}

interface AttendanceRecord {
  id: number
  staffId: number
  date: string
  clockIn: string
  clockOut: string
  hoursWorked: number
  status: string
}

interface SalesPerformance {
  staffId: number
  ordersHandled: number
  totalSales: number
  rating: number
}

export default function StaffPage() {
  const [staff, setStaff] = useState<Staff[]>([
    { id: 1, name: 'John Manager', role: 'Manager', phone: '+233 24 123 4567', shift: 'Morning', status: 'On Duty', initials: 'JM', email: 'john@restaurant.com', salary: 2500, hireDate: '2024-01-15', permissions: ROLE_PERMISSIONS['Manager'] },
    { id: 2, name: 'Chef Kitchen', role: 'Chef', phone: '+233 24 234 5678', shift: 'Morning', status: 'On Duty', initials: 'CK', email: 'chef@restaurant.com', salary: 1800, hireDate: '2024-03-20', permissions: ROLE_PERMISSIONS['Chef'] },
    { id: 3, name: 'Waiter Smith', role: 'Waiter', phone: '+233 24 345 6789', shift: 'Evening', status: 'On Duty', initials: 'WS', email: 'waiter@restaurant.com', salary: 800, hireDate: '2024-06-10', permissions: ROLE_PERMISSIONS['Waiter'] },
    { id: 4, name: 'Barista Jones', role: 'Barista', phone: '+233 24 456 7890', shift: 'Morning', status: 'On Leave', initials: 'BJ', email: 'barista@restaurant.com', salary: 900, hireDate: '2024-08-05', permissions: ROLE_PERMISSIONS['Barista'] },
    { id: 5, name: 'Driver Wilson', role: 'Delivery', phone: '+233 24 567 8901', shift: 'Evening', status: 'Off Duty', initials: 'DW', email: 'driver@restaurant.com', salary: 750, hireDate: '2024-09-12', permissions: ROLE_PERMISSIONS['Delivery'] },
    { id: 6, name: 'Admin User', role: 'Admin', phone: '+233 24 678 9012', shift: 'Morning', status: 'On Duty', initials: 'AU', email: 'admin@restaurant.com', salary: 3500, hireDate: '2023-12-01', permissions: ROLE_PERMISSIONS['Admin'] },
  ])

  const [attendanceRecords] = useState<AttendanceRecord[]>([
    { id: 1, staffId: 1, date: '2026-03-04', clockIn: '08:00', clockOut: '17:00', hoursWorked: 9, status: 'Present' },
    { id: 2, staffId: 2, date: '2026-03-04', clockIn: '07:30', clockOut: '16:30', hoursWorked: 9, status: 'Present' },
    { id: 3, staffId: 3, date: '2026-03-04', clockIn: '14:00', clockOut: '22:00', hoursWorked: 8, status: 'Present' },
    { id: 4, staffId: 4, date: '2026-03-04', clockIn: '-', clockOut: '-', hoursWorked: 0, status: 'On Leave' },
    { id: 5, staffId: 5, date: '2026-03-04', clockIn: '16:00', clockOut: '23:00', hoursWorked: 7, status: 'Present' },
  ])

  const [salesPerformance] = useState<SalesPerformance[]>([
    { staffId: 1, ordersHandled: 0, totalSales: 0, rating: 4.8 },
    { staffId: 2, ordersHandled: 0, totalSales: 0, rating: 4.9 },
    { staffId: 3, ordersHandled: 45, totalSales: 1250, rating: 4.7 },
    { staffId: 4, ordersHandled: 30, totalSales: 450, rating: 4.5 },
    { staffId: 5, ordersHandled: 20, totalSales: 380, rating: 4.6 },
    { staffId: 6, ordersHandled: 0, totalSales: 0, rating: 5.0 },
  ])

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPermissionModal, setShowPermissionModal] = useState(false)
  const [showAttendanceModal, setShowAttendanceModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedStaffMember, setSelectedStaffMember] = useState<Staff | null>(null)

  const [newStaff, setNewStaff] = useState({
    name: '',
    role: 'Waiter',
    phone: '',
    shift: 'Morning',
    status: 'On Duty',
    email: '',
    salary: 0
  })

  const getStatusColor = (status: string) => {
    if (status === 'On Duty') return 'var(--success-green)'
    if (status === 'On Leave') return 'var(--warning-orange)'
    return 'var(--danger-red)'
  }

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.phone.includes(searchQuery)
    const matchesRole = selectedRole === 'all' || member.role === selectedRole
    const matchesStatus = selectedStatus === 'all' || member.status === selectedStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  const addStaffMember = () => {
    const newId = Math.max(...staff.map(s => s.id), 0) + 1
    const initials = newStaff.name.split(' ').map(n => n[0]).join('').toUpperCase()
    setStaff([...staff, {
      id: newId,
      ...newStaff,
      initials,
      hireDate: new Date().toISOString().split('T')[0],
      permissions: ROLE_PERMISSIONS[newStaff.role] || []
    }])
    setShowAddModal(false)
    setNewStaff({ name: '', role: 'Waiter', phone: '', shift: 'Morning', status: 'On Duty', email: '', salary: 0 })
  }

  const openPermissionModal = (member: Staff) => {
    setSelectedStaffMember(member)
    setShowPermissionModal(true)
  }

  const openAttendanceModal = (member: Staff) => {
    setSelectedStaffMember(member)
    setShowAttendanceModal(true)
  }

  const openEditModal = (member: Staff) => {
    setSelectedStaffMember({ ...member })
    setShowEditModal(true)
  }

  const saveEditStaff = () => {
    if (selectedStaffMember) {
      setStaff(staff.map(m => m.id === selectedStaffMember.id ? selectedStaffMember : m))
      setShowEditModal(false)
      setSelectedStaffMember(null)
    }
  }

  const getStaffAttendance = (staffId: number) => {
    return attendanceRecords.filter(a => a.staffId === staffId && a.date === '2026-03-04')[0]
  }

  const getStaffPerformance = (staffId: number) => {
    return salesPerformance.find(p => p.staffId === staffId)
  }

  const calculateTotalPayroll = () => {
    return staff.reduce((sum, s) => sum + (s.salary || 0), 0)
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
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>💵</div>
          <div className="stat-label">Monthly Payroll</div>
          <div className="stat-value">${calculateTotalPayroll().toLocaleString()}</div>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px', border: '2px solid var(--info-blue)' }}>
        <h4 style={{ margin: '0 0 0.5rem', color: 'var(--info-blue)' }}>
          <i className="fas fa-shield-alt"></i> Role-Based Permissions
        </h4>
        <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.85rem', color: '#666' }}>
          <span>🔐 <strong>Admin:</strong> Full system access</span>
          <span>👔 <strong>Manager:</strong> Reports, Inventory, Orders</span>
          <span>👨‍🍳 <strong>Chef:</strong> Kitchen & Orders view</span>
          <span>💰 <strong>Cashier:</strong> Process payments</span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', maxWidth: '300px', position: 'relative' }}>
          <i className="fas fa-search" style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#999' }}></i>
          <input 
            type="text" 
            placeholder="Search staff..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '2.5rem', width: '100%' }} 
          />
        </div>
        <select 
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '130px' }}
        >
          <option value="all">All Roles</option>
          <option value="Admin">Admin</option>
          <option value="Manager">Manager</option>
          <option value="Chef">Chef</option>
          <option value="Waiter">Waiter</option>
          <option value="Barista">Barista</option>
          <option value="Delivery">Delivery</option>
        </select>
        <select 
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)', minWidth: '130px' }}
        >
          <option value="all">All Status</option>
          <option value="On Duty">On Duty</option>
          <option value="Off Duty">Off Duty</option>
          <option value="On Leave">On Leave</option>
        </select>
      </div>

      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Staff Member</th>
              <th>Role</th>
              <th>Shift</th>
              <th>Today</th>
              <th>Performance</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map((member, idx) => {
              const attendance = getStaffAttendance(member.id)
              const performance = getStaffPerformance(member.id)
              
              return (
                <tr key={member.id}>
                  <td>{idx + 1}</td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--primary-red)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600 }}>
                        {member.initials}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{member.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#666' }}>{member.email}</div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ padding: '0.3rem 0.7rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.8rem', background: member.role === 'Admin' ? 'rgba(239, 68, 68, 0.15)' : member.role === 'Manager' ? 'rgba(147, 51, 234, 0.15)' : 'rgba(59, 130, 246, 0.15)', color: member.role === 'Admin' ? 'var(--danger-red)' : member.role === 'Manager' ? '#9333ea' : 'var(--info-blue)' }}>
                      {member.role}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{member.shift}</div>
                    <div style={{ fontSize: '0.75rem', color: '#666' }}>${member.salary}/month</div>
                  </td>
                  <td>
                    {attendance ? (
                      <div>
                        <div style={{ fontSize: '0.8rem', color: attendance.status === 'Present' ? 'var(--success-green)' : attendance.status === 'Late' ? 'var(--warning-orange)' : 'var(--danger-red)', fontWeight: 600 }}>
                          {attendance.status}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: '#666' }}>
                          {attendance.clockIn !== '-' ? `${attendance.clockIn} - ${attendance.clockOut}` : 'N/A'}
                        </div>
                      </div>
                    ) : <span style={{ color: '#999' }}>-</span>}
                  </td>
                  <td>
                    {performance && performance.ordersHandled > 0 ? (
                      <div>
                        <div style={{ fontWeight: 600 }}>{performance.ordersHandled} orders</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--success-green)' }}>${performance.totalSales} sales</div>
                      </div>
                    ) : <span style={{ color: '#999', fontSize: '0.85rem' }}>No data</span>}
                  </td>
                  <td>
                    <span style={{ padding: '0.3rem 0.7rem', borderRadius: '12px', fontWeight: 600, fontSize: '0.8rem', background: member.status === 'On Duty' ? 'rgba(16, 185, 129, 0.15)' : member.status === 'On Leave' ? 'rgba(245, 158, 11, 0.15)' : 'rgba(239, 68, 68, 0.15)', color: getStatusColor(member.status) }}>
                      {member.status}
                    </span>
                  </td>
                  <td>
                    <button style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid var(--info-blue)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }} onClick={() => openAttendanceModal(member)}>
                      <i className="fas fa-clock" style={{ color: 'var(--info-blue)' }}></i>
                    </button>
                    <button style={{ marginRight: '0.5rem', padding: '0.5rem', border: '1px solid var(--accent-gold)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }} onClick={() => openPermissionModal(member)}>
                      <i className="fas fa-shield-alt" style={{ color: 'var(--accent-gold)' }}></i>
                    </button>
                    <button style={{ padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }} onClick={() => openEditModal(member)}>
                      <i className="fas fa-edit" style={{ color: 'var(--primary-red)' }}></i>
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Add New Staff Member</h2>
              <button className="modal-close" onClick={() => setShowAddModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label>Full Name *</label>
              <input type="text" placeholder="e.g., John Smith" value={newStaff.name} onChange={(e) => setNewStaff({ ...newStaff, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select value={newStaff.role} onChange={(e) => setNewStaff({ ...newStaff, role: e.target.value })}>
                <option>Admin</option>
                <option>Manager</option>
                <option>Chef</option>
                <option>Cashier</option>
                <option>Waiter</option>
                <option>Barista</option>
                <option>Delivery</option>
              </select>
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="e.g., john@restaurant.com" value={newStaff.email} onChange={(e) => setNewStaff({ ...newStaff, email: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input type="tel" placeholder="e.g., +233 24 XXX XXXX" value={newStaff.phone} onChange={(e) => setNewStaff({ ...newStaff, phone: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Shift</label>
                <select value={newStaff.shift} onChange={(e) => setNewStaff({ ...newStaff, shift: e.target.value })}>
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={newStaff.status} onChange={(e) => setNewStaff({ ...newStaff, status: e.target.value })}>
                  <option>On Duty</option>
                  <option>Off Duty</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Monthly Salary ($)</label>
              <input type="number" placeholder="0" value={newStaff.salary || ''} onChange={(e) => setNewStaff({ ...newStaff, salary: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={addStaffMember}><i className="fas fa-plus"></i> Add Staff</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAddModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showPermissionModal && selectedStaffMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Permissions - {selectedStaffMember.name}</h2>
              <button className="modal-close" onClick={() => setShowPermissionModal(false)}>×</button>
            </div>
            <div style={{ marginBottom: '1.5rem', padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px' }}>
              <div style={{ fontWeight: 600 }}>{selectedStaffMember.role}</div>
            </div>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {(selectedStaffMember.permissions || ROLE_PERMISSIONS[selectedStaffMember.role] || []).map((permission, idx) => (
                <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', border: '1px solid var(--success-green)' }}>
                  <i className="fas fa-check-circle" style={{ color: 'var(--success-green)' }}></i>
                  <span style={{ fontWeight: 500, textTransform: 'capitalize' }}>{permission.replace(/_/g, ' ')}</span>
                </div>
              ))}
            </div>
            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowPermissionModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showAttendanceModal && selectedStaffMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Attendance - {selectedStaffMember.name}</h2>
              <button className="modal-close" onClick={() => setShowAttendanceModal(false)}>×</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Hours Today</div>
                <div style={{ fontSize: '1.5rem', fontWeight: 700 }}>{getStaffAttendance(selectedStaffMember.id)?.hoursWorked || 0}h</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Status</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: getStatusColor(getStaffAttendance(selectedStaffMember.id)?.status || 'N/A') }}>{getStaffAttendance(selectedStaffMember.id)?.status || 'N/A'}</div>
              </div>
              <div style={{ padding: '1rem', background: 'var(--secondary-cream)', borderRadius: '8px', textAlign: 'center' }}>
                <div style={{ fontSize: '0.85rem', color: '#666' }}>Salary</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>${selectedStaffMember.salary}</div>
              </div>
            </div>
            <div className="modal-actions">
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowAttendanceModal(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && selectedStaffMember && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Edit Staff Member</h2>
              <button className="modal-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" value={selectedStaffMember.name} onChange={(e) => setSelectedStaffMember({ ...selectedStaffMember, name: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={selectedStaffMember.role} onChange={(e) => setSelectedStaffMember({ ...selectedStaffMember, role: e.target.value, permissions: ROLE_PERMISSIONS[e.target.value] || [] })}>
                <option>Admin</option>
                <option>Manager</option>
                <option>Chef</option>
                <option>Cashier</option>
                <option>Waiter</option>
                <option>Barista</option>
                <option>Delivery</option>
              </select>
            </div>
            <div className="form-group">
              <label>Phone</label>
              <input type="tel" value={selectedStaffMember.phone} onChange={(e) => setSelectedStaffMember({ ...selectedStaffMember, phone: e.target.value })} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={selectedStaffMember.email || ''} onChange={(e) => setSelectedStaffMember({ ...selectedStaffMember, email: e.target.value })} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div className="form-group">
                <label>Shift</label>
                <select value={selectedStaffMember.shift} onChange={(e) => setSelectedStaffMember({ ...selectedStaffMember, shift: e.target.value })}>
                  <option>Morning</option>
                  <option>Evening</option>
                  <option>Night</option>
                </select>
              </div>
              <div className="form-group">
                <label>Status</label>
                <select value={selectedStaffMember.status} onChange={(e) => setSelectedStaffMember({ ...selectedStaffMember, status: e.target.value })}>
                  <option>On Duty</option>
                  <option>Off Duty</option>
                  <option>On Leave</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Monthly Salary ($)</label>
              <input type="number" value={selectedStaffMember.salary || 0} onChange={(e) => setSelectedStaffMember({ ...selectedStaffMember, salary: parseInt(e.target.value) || 0 })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={saveEditStaff}><i className="fas fa-save"></i> Save Changes</button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowEditModal(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
