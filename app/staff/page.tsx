'use client'

export default function StaffPage() {
  const staff = [
    { id: 1, name: 'John Manager', role: 'Manager', phone: '+1 234 567 8900', shift: 'Morning', status: 'On Duty', initials: 'JM' },
    { id: 2, name: 'Chef Kitchen', role: 'Chef', phone: '+1 234 567 8901', shift: 'Morning', status: 'On Duty', initials: 'CK' },
    { id: 3, name: 'Waiter Smith', role: 'Waiter', phone: '+1 234 567 8902', shift: 'Evening', status: 'On Duty', initials: 'WS' },
    { id: 4, name: 'Barista Jones', role: 'Barista', phone: '+1 234 567 8903', shift: 'Morning', status: 'On Leave', initials: 'BJ' },
    { id: 5, name: 'Driver Wilson', role: 'Delivery', phone: '+1 234 567 8904', shift: 'Evening', status: 'Off Duty', initials: 'DW' },
  ]

  const getStatusColor = (status: string) => {
    if (status === 'On Duty') return 'var(--success-green)'
    if (status === 'On Leave') return 'var(--warning-orange)'
    return 'var(--danger-red)'
  }

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-user-tie" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Staff Management</h1>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-plus"></i> Add Staff
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>👥</div>
          <div className="stat-label">Total Staff</div>
          <div className="stat-value">18</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>🟢</div>
          <div className="stat-label">On Duty</div>
          <div className="stat-value">12</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>🟡</div>
          <div className="stat-label">On Leave</div>
          <div className="stat-value">2</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--danger-red)' }}>🔴</div>
          <div className="stat-label">Off Duty</div>
          <div className="stat-value">4</div>
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
                  <button style={{ padding: '0.5rem', border: '1px solid var(--primary-red)', borderRadius: 6, background: 'transparent', cursor: 'pointer' }}>
                    <i className="fas fa-edit" style={{ color: 'var(--primary-red)' }}></i>
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
