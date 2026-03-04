'use client'

export default function SettingsPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-cog" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Settings</h1>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '2rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Restaurant Information</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Restaurant Name</label>
            <input type="text" defaultValue="RestaurantPOS" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Address</label>
            <textarea rows={2} defaultValue="123 Main Street, City, Country" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Phone Number</label>
            <input type="tel" defaultValue="+1 234 567 8900" />
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Business Settings</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Currency</label>
            <select defaultValue="USD">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="GHS">GHS (₵)</option>
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Tax Rate (%)</label>
            <input type="number" defaultValue="15" min="0" max="100" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
              Enable Loyalty Points
            </label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
              Enable Reservation System
            </label>
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Payment Methods</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
              Enable Cash Payments
            </label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto' }} />
              Enable Card Payments
            </label>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600 }}>
              <input type="checkbox" style={{ width: 'auto' }} />
              Enable Mobile Payments
            </label>
          </div>
          <button className="btn btn-primary">Save Changes</button>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Account Settings</h3>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Admin Name</label>
            <input type="text" defaultValue="John Manager" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Email</label>
            <input type="email" defaultValue="john@restaurantpos.com" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Current Password</label>
            <input type="password" placeholder="Enter current password" />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>New Password</label>
            <input type="password" placeholder="Enter new password" />
          </div>
          <button className="btn btn-primary">Update Password</button>
        </div>
      </div>
    </>
  )
}
