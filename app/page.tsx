'use client'

// Food images for dashboard
const foodImages: Record<string, string> = {
  'Margherita Pizza': 'https://images.unsplash.com/photo-1604382355076-af4b0eb60143?w=200&h=200&fit=crop',
  'Classic Burger': 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&h=200&fit=crop',
  'Jollof Rice': 'https://images.unsplash.com/photo-1633945274405-b6c8069047b0?w=200&h=200&fit=crop',
  'Grilled Chicken': 'https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=200&h=200&fit=crop',
}

export default function Home() {
  return (
    <>
      {/* Page Header */}
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chart-line" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Business Overview</h1>
        </div>
        <div>
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-4">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>💰</div>
          <div className="stat-label">Revenue Today</div>
          <div className="stat-value">$2,450</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> +12% from yesterday
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>📊</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">$45,230</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> +8% this month
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>📦</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">342</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> +5 since yesterday
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>🪑</div>
          <div className="stat-label">Active Tables</div>
          <div className="stat-value">8/12</div>
          <div className="stat-change">
            <i className="fas fa-check-circle"></i> In service
          </div>
        </div>
      </div>

      {/* Charts and Data Sections */}
      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        {/* Sales Chart */}
        <div className="card">
          <h3>Sales Trend (Last 7 Days)</h3>
          <div style={{ height: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1rem', marginTop: '1.5rem' }}>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, var(--primary-red) 0%, rgba(196, 30, 58, 0.3) 100%)', height: '60%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>$1,200</span>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, var(--primary-red) 0%, rgba(196, 30, 58, 0.3) 100%)', height: '75%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>$1,500</span>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, var(--primary-red) 0%, rgba(196, 30, 58, 0.3) 100%)', height: '45%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>$900</span>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, var(--primary-red) 0%, rgba(196, 30, 58, 0.3) 100%)', height: '80%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>$1,800</span>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, var(--primary-red) 0%, rgba(196, 30, 58, 0.3) 100%)', height: '70%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>$1,400</span>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, var(--primary-red) 0%, rgba(196, 30, 58, 0.3) 100%)', height: '85%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>$1,950</span>
            </div>
            <div style={{ flex: 1, background: 'linear-gradient(180deg, var(--accent-gold) 0%, rgba(212, 175, 55, 0.3) 100%)', height: '90%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
              <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>$2,100</span>
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(196, 30, 58, 0.1)' }}>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Mon • Tue • Wed • Thu • Fri • Sat • Sun</p>
          </div>
        </div>

        {/* Quick Alerts */}
        <div className="card">
          <h3>Quick Alerts</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger-red)', borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>⚠️ Low Stock Alert</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Tomato sauce inventory below threshold</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--warning-orange)', borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>📢 Special Offer</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Don't forget weekend promotion (10% off)</p>
            </div>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid var(--success-green)', borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>✓ Top Performer</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>Margherita Pizza is the best seller today</p>
            </div>
          </div>
        </div>
      </div>

      {/* Best Selling Meals */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Best Selling Meals</h3>
          <a href="/menu" style={{ color: 'var(--primary-red)', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
        </div>
        <div className="grid grid-4">
          {[
            { name: 'Margherita Pizza', orders: 89, price: '$12.99', image: 'Margherita Pizza' },
            { name: 'Classic Burger', orders: 76, price: '$8.99', image: 'Classic Burger' },
            { name: 'Jollof Rice', orders: 65, price: '$10.99', image: 'Jollof Rice' },
            { name: 'Grilled Chicken', orders: 48, price: '$14.99', image: 'Grilled Chicken' },
          ].map((item, idx) => (
            <div key={idx} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
              <img 
                src={foodImages[item.image]} 
                alt={item.name}
                style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '8px', marginBottom: '0.5rem' }}
              />
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: 'var(--primary-red)', fontWeight: 700 }}>{item.price}</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>{item.orders} orders today</div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Transactions */}
      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Recent Transactions</h3>
          <a href="/reports" style={{ color: 'var(--primary-red)', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>#ORD-001</td>
                <td>Today, 2:30 PM</td>
                <td>2x Margherita Pizza, 1x Coke</td>
                <td style={{ fontWeight: 600 }}>$31.98</td>
              </tr>
              <tr>
                <td>#ORD-002</td>
                <td>Today, 2:15 PM</td>
                <td>1x Classic Burger, 1x Fries</td>
                <td style={{ fontWeight: 600 }}>$12.99</td>
              </tr>
              <tr>
                <td>#ORD-003</td>
                <td>Today, 1:45 PM</td>
                <td>3x Jollof Rice, 2x Fruit Smoothie</td>
                <td style={{ fontWeight: 600 }}>$42.96</td>
              </tr>
              <tr>
                <td>#ORD-004</td>
                <td>Today, 1:20 PM</td>
                <td>1x Grilled Chicken, 1x Salad</td>
                <td style={{ fontWeight: 600 }}>$22.98</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
