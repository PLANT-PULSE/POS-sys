'use client'

export default function ReportsPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chart-bar" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Reports & Analytics</h1>
        </div>
        <button className="btn btn-primary">
          <i className="fas fa-download"></i> Export Report
        </button>
      </div>

      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">$12,450</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> +15% from last period
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>🧾</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">342</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> +8% from last period
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>💵</div>
          <div className="stat-label">Average Order</div>
          <div className="stat-value">$36.40</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> +5% from last period
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>👥</div>
          <div className="stat-label">Customers Served</div>
          <div className="stat-value">298</div>
          <div className="stat-change positive">
            <i className="fas fa-arrow-up"></i> +12% from last period
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
        <div className="card">
          <h3>Sales by Category</h3>
          <div style={{ marginTop: '1.5rem' }}>
            {[
              { name: 'Fast Food', value: 45, color: 'var(--primary-red)' },
              { name: 'Local Dishes', value: 30, color: 'var(--accent-gold)' },
              { name: 'Drinks', value: 15, color: 'var(--info-blue)' },
              { name: 'Desserts', value: 10, color: 'var(--success-green)' }
            ].map((cat) => (
              <div key={cat.name} style={{ marginBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span>{cat.name}</span>
                  <span style={{ fontWeight: 600 }}>{cat.value}%</span>
                </div>
                <div style={{ height: 8, background: '#eee', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${cat.value}%`, background: cat.color, borderRadius: 4 }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h3>Top Selling Items</h3>
          <div style={{ marginTop: '1rem' }}>
            {[
              { name: 'Margherita Pizza', orders: 89, revenue: '$1,156' },
              { name: 'Classic Burger', orders: 76, revenue: '$683' },
              { name: 'Jollof Rice', orders: 65, revenue: '$714' },
              { name: 'Fruit Smoothie', orders: 54, revenue: '$323' },
              { name: 'Grilled Chicken', orders: 48, revenue: '$575' }
            ].map((item, idx) => (
              <div key={item.name} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.75rem 0', borderBottom: '1px solid rgba(196, 30, 58, 0.1)' }}>
                <div>
                  <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>{idx + 1}.</span>
                  <span>{item.name}</span>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 600 }}>{item.revenue}</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>{item.orders} orders</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Payment Methods</h3>
        <table className="table" style={{ marginTop: '1rem' }}>
          <thead>
            <tr>
              <th>Method</th>
              <th>Transactions</th>
              <th>Amount</th>
              <th>Percentage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>💵 Cash</td>
              <td>156</td>
              <td>$5,420</td>
              <td>43.5%</td>
            </tr>
            <tr>
              <td>💳 Card</td>
              <td>124</td>
              <td>$4,680</td>
              <td>37.6%</td>
            </tr>
            <tr>
              <td>📱 Mobile Payment</td>
              <td>45</td>
              <td>$1,890</td>
              <td>15.2%</td>
            </tr>
            <tr>
              <td>📝 Check</td>
              <td>17</td>
              <td>$460</td>
              <td>3.7%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  )
}
