'use client'

import { useState } from 'react'

// Data from the system - in real app would come from API/database
const inventoryItems = [
  { id: 1, name: 'Tomato Sauce', category: 'Ingredients', quantity: 15, unit: 'Liters', minLevel: 20, status: 'Low Stock', costPerUnit: 5 },
  { id: 2, name: 'Chicken Breast', category: 'Ingredients', quantity: 45, unit: 'kg', minLevel: 30, status: 'In Stock', costPerUnit: 15 },
  { id: 3, name: 'Cooking Oil', category: 'Ingredients', quantity: 8, unit: 'Liters', minLevel: 50, status: 'Out of Stock', costPerUnit: 8 },
  { id: 4, name: 'Napkins', category: 'Supplies', quantity: 500, unit: 'Pieces', minLevel: 200, status: 'In Stock', costPerUnit: 0.5 },
  { id: 5, name: 'Orange Juice', category: 'Beverages', quantity: 8, unit: 'Liters', minLevel: 15, status: 'Low Stock', costPerUnit: 4 },
  { id: 6, name: 'Rice (Jollof)', category: 'Ingredients', quantity: 25, unit: 'kg', minLevel: 20, status: 'In Stock', costPerUnit: 8 },
  { id: 7, name: 'Fresh Milk', category: 'Ingredients', quantity: 5, unit: 'Liters', minLevel: 10, status: 'Low Stock', costPerUnit: 6 },
  { id: 8, name: 'Ground Beef', category: 'Ingredients', quantity: 20, unit: 'kg', minLevel: 15, status: 'In Stock', costPerUnit: 18 },
]

const orders = [
  { id: 'ORD-001', date: '2026-03-04', time: '14:30', items: ['Margherita Pizza', 'Coke'], quantities: [2, 1], total: 31.98, status: 'Completed', payment: 'Card' },
  { id: 'ORD-002', date: '2026-03-04', time: '14:15', items: ['Classic Burger', 'Fries'], quantities: [1, 1], total: 12.99, status: 'Completed', payment: 'Cash' },
  { id: 'ORD-003', date: '2026-03-04', time: '13:45', items: ['Jollof Rice', 'Fruit Smoothie'], quantities: [3, 2], total: 42.96, status: 'Completed', payment: 'Card' },
  { id: 'ORD-004', date: '2026-03-04', time: '13:20', items: ['Grilled Chicken', 'Salad'], quantities: [1, 1], total: 22.98, status: 'Completed', payment: 'Mobile' },
  { id: 'ORD-005', date: '2026-03-04', time: '12:50', items: ['Beef Stew', 'Rice'], quantities: [2, 2], total: 35.96, status: 'Completed', payment: 'Card' },
  { id: 'ORD-006', date: '2026-03-04', time: '12:15', items: ['Chicken Fried Rice'], quantities: [1], total: 15.99, status: 'Completed', payment: 'Cash' },
  { id: 'ORD-007', date: '2026-03-03', time: '19:30', items: ['Jollof Rice', 'Chicken'], quantities: [2, 1], total: 38.97, status: 'Completed', payment: 'Card' },
  { id: 'ORD-008', date: '2026-03-03', time: '18:45', items: ['Margherita Pizza', 'Fries'], quantities: [1, 1], total: 16.99, status: 'Completed', payment: 'Mobile' },
]

const menuItems = [
  { id: 1, name: 'Jollof Rice', price: 25, category: 'Main Course', orders: 156 },
  { id: 2, name: 'Chicken Fried Rice', price: 35, category: 'Main Course', orders: 124 },
  { id: 3, name: 'Beef Stew', price: 30, category: 'Main Course', orders: 98 },
  { id: 4, name: 'Grilled Chicken', price: 35, category: 'Main Course', orders: 87 },
  { id: 5, name: 'Margherita Pizza', price: 25, category: 'Pizza', orders: 89 },
  { id: 6, name: 'Classic Burger', price: 15, category: 'Burger', orders: 76 },
]

const staffMembers = [
  { id: 1, name: 'John Manager', role: 'Manager', status: 'On Duty' },
  { id: 2, name: 'Chef Kitchen', role: 'Chef', status: 'On Duty' },
  { id: 3, name: 'Waiter Smith', role: 'Waiter', status: 'On Duty' },
  { id: 4, name: 'Barista Jones', role: 'Barista', status: 'On Leave' },
  { id: 5, name: 'Driver Wilson', role: 'Delivery', status: 'Off Duty' },
]

const tables = [
  { id: 1, number: 1, status: 'Occupied', customers: 4 },
  { id: 2, number: 2, status: 'Available', customers: 0 },
  { id: 3, number: 3, status: 'Occupied', customers: 2 },
  { id: 4, number: 4, status: 'Reserved', customers: 0 },
  { id: 5, number: 5, status: 'Occupied', customers: 6 },
  { id: 6, number: 6, status: 'Available', customers: 0 },
  { id: 7, number: 7, status: 'Occupied', customers: 3 },
  { id: 8, number: 8, status: 'Occupied', customers: 2 },
  { id: 9, number: 9, status: 'Available', customers: 0 },
  { id: 10, number: 10, status: 'Available', customers: 0 },
  { id: 11, number: 11, status: 'Reserved', customers: 0 },
  { id: 12, number: 12, status: 'Available', customers: 0 },
]

const expenses = [
  { id: 1, date: '2026-03-04', description: 'Weekly Produce Delivery', category: 'Inventory', amount: 450, status: 'Paid' },
  { id: 2, date: '2026-03-01', description: 'Staff Salaries', category: 'Staff', amount: 3200, status: 'Paid' },
  { id: 3, date: '2026-03-02', description: 'Electricity Bill', category: 'Utilities', amount: 280, status: 'Paid' },
  { id: 4, date: '2026-03-03', description: 'Meat Supplier', category: 'Inventory', amount: 680, status: 'Pending' },
  { id: 5, date: '2026-03-04', description: 'Kitchen Equipment Repair', category: 'Maintenance', amount: 150, status: 'Paid' },
]

const customers = [
  { id: 1, name: 'John Doe', type: 'VIP', spent: 1234, orders: 45 },
  { id: 2, name: 'Jane Smith', type: 'Regular', spent: 892, orders: 32 },
  { id: 3, name: 'Mike Johnson', type: 'Regular', spent: 756, orders: 28 },
  { id: 4, name: 'Sarah Williams', type: 'New', spent: 445, orders: 15 },
]

export default function Home() {
  const todayOrders = orders.filter(o => o.date === '2026-03-04')
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0)
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrdersCount = orders.length
  const averageOrder = totalRevenue / totalOrdersCount

  const lowStockItems = inventoryItems.filter(i => i.status === 'Low Stock' || i.status === 'Out of Stock')
  const outOfStockCount = inventoryItems.filter(i => i.status === 'Out of Stock').length

  const occupiedTables = tables.filter(t => t.status === 'Occupied').length
  const availableTables = tables.filter(t => t.status === 'Available').length

  const totalExpensesAmount = expenses.reduce((sum, e) => sum + e.amount, 0)
  const netProfit = totalRevenue - totalExpensesAmount

  const onDutyStaff = staffMembers.filter(s => s.status === 'On Duty').length
  const topSellingItems = [...menuItems].sort((a, b) => b.orders - a.orders).slice(0, 4)

  const today = new Date()
  const formattedDate = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <>
      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chart-line" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <div>
            <h1>Business Overview</h1>
            <p style={{ fontSize: '0.9rem', color: '#666', margin: 0 }}>{formattedDate}</p>
          </div>
        </div>
        <div>
          <button className="btn btn-secondary">
            <i className="fas fa-download"></i> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-4">
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>💰</div>
          <div className="stat-label">Revenue Today</div>
          <div className="stat-value">${todayRevenue.toFixed(2)}</div>
          <div className="stat-change positive">
            <i className="fas fa-receipt"></i> {todayOrders.length} orders
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>📊</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${totalRevenue.toFixed(2)}</div>
          <div className="stat-change positive">
            <i className="fas fa-chart-line"></i> All time
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>📦</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{totalOrdersCount}</div>
          <div className="stat-change">
            <i className="fas fa-dollar-sign"></i> Avg ${averageOrder.toFixed(2)}/order
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>💵</div>
          <div className="stat-label">Net Profit</div>
          <div className="stat-value" style={{ color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>
            ${netProfit.toFixed(2)}
          </div>
          <div className="stat-change" style={{ color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>
            <i className="fas fa-minus-circle"></i> -${totalExpensesAmount} expenses
          </div>
        </div>
      </div>

      <div className="grid grid-4" style={{ marginTop: '1rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>🪑</div>
          <div className="stat-label">Tables</div>
          <div className="stat-value">{occupiedTables}/{tables.length}</div>
          <div className="stat-change">
            <i className="fas fa-check-circle"></i> {availableTables} available
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--warning-orange)' }}>⚠️</div>
          <div className="stat-label">Low Stock</div>
          <div className="stat-value">{lowStockItems.length}</div>
          <div className="stat-change negative">
            <i className="fas fa-exclamation-triangle"></i> {outOfStockCount} out of stock
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>👥</div>
          <div className="stat-label">Staff On Duty</div>
          <div className="stat-value">{onDutyStaff}/{staffMembers.length}</div>
          <div className="stat-change">
            <i className="fas fa-user-check"></i> Active now
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>⭐</div>
          <div className="stat-label">VIP Customers</div>
          <div className="stat-value">{customers.filter(c => c.type === 'VIP').length}</div>
          <div className="stat-change">
            <i className="fas fa-crown"></i> Top spenders
          </div>
        </div>
      </div>

      <div className="grid grid-2" style={{ marginTop: '2rem' }}>
        <div className="card">
          <h3>Sales Trend (Last 7 Days)</h3>
          <div style={{ height: 250, display: 'flex', alignItems: 'flex-end', justifyContent: 'space-around', gap: '1rem', marginTop: '1.5rem' }}>
            {[60, 75, 45, 80, 70, 85, 90].map((height, idx) => (
              <div key={idx} style={{ flex: 1, background: 'linear-gradient(180deg, var(--primary-red) 0%, rgba(196, 30, 58, 0.3) 100%)', height: height + '%', borderRadius: '8px 8px 0 0', position: 'relative' }}>
                <span style={{ position: 'absolute', top: -25, width: '100%', textAlign: 'center', fontWeight: 600, fontSize: '0.8rem' }}>${(height * 25).toFixed(0)}</span>
              </div>
            ))}
          </div>
          <div style={{ textAlign: 'center', marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid rgba(196, 30, 58, 0.1)' }}>
            <p style={{ color: '#999', fontSize: '0.9rem' }}>Mon • Tue • Wed • Thu • Fri • Sat • Sun</p>
          </div>
        </div>

        <div className="card">
          <h3>Quick Alerts</h3>
          <div style={{ marginTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderLeft: '4px solid var(--danger-red)', borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>⚠️ Low Stock Alert</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>
                {lowStockItems.length > 0 ? `${lowStockItems.map(i => i.name).join(', ')} below threshold` : 'All items in stock'}
              </p>
            </div>
            
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', borderLeft: '4px solid var(--warning-orange)', borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>📢 Busy Period</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{occupiedTables} tables occupied - Consider adding more staff</p>
            </div>

            <div style={{ padding: '1rem', background: netProfit >= 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)', borderLeft: `4px solid ${netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)'}`, borderRadius: 8 }}>
              <p style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{netProfit >= 0 ? '✓ Profitable Day' : '⚠️ Loss Alert'}</p>
              <p style={{ fontSize: '0.9rem', color: '#666' }}>{netProfit >= 0 ? `Net profit: $${netProfit.toFixed(2)} after expenses` : 'Expenses exceed revenue today'}</p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Best Selling Meals</h3>
          <a href="/menu" style={{ color: 'var(--primary-red)', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
        </div>
        <div className="grid grid-4">
          {topSellingItems.map((item, idx) => (
            <div key={item.id} className="card" style={{ textAlign: 'center', padding: '1rem' }}>
              <div style={{ width: 50, height: 50, borderRadius: '50%', background: idx === 0 ? 'var(--accent-gold)' : idx === 1 ? 'var(--info-blue)' : 'var(--secondary-cream)', color: idx < 2 ? 'white' : 'var(--primary-red)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '1.2rem', margin: '0 auto 0.75rem' }}>
                {idx + 1}
              </div>
              <div style={{ fontWeight: 600 }}>{item.name}</div>
              <div style={{ color: 'var(--primary-red)', fontWeight: 700 }}>${item.price}</div>
              <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.5rem' }}>{item.orders} orders</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3>Recent Transactions</h3>
          <a href="/orders" style={{ color: 'var(--primary-red)', textDecoration: 'none', fontWeight: 600 }}>View All →</a>
        </div>
        <div className="card">
          <table className="table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Date & Time</th>
                <th>Items</th>
                <th>Payment</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {todayOrders.slice(0, 6).map((order) => (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600 }}>#{order.id}</td>
                  <td>{order.time}</td>
                  <td>
                    {order.items.map((item, idx) => (
                      <span key={idx}>{order.quantities[idx]}x {item}{idx < order.items.length - 1 ? ', ' : ''}</span>
                    ))}
                  </td>
                  <td>
                    <span style={{ padding: '0.2rem 0.5rem', borderRadius: '8px', fontSize: '0.75rem', background: order.payment === 'Card' ? 'rgba(59, 130, 246, 0.15)' : order.payment === 'Cash' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(147, 51, 234, 0.15)', color: order.payment === 'Card' ? 'var(--info-blue)' : order.payment === 'Cash' ? 'var(--success-green)' : '#9333ea' }}>
                      {order.payment}
                    </span>
                  </td>
                  <td style={{ fontWeight: 600, color: 'var(--success-green)' }}>${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div style={{ marginTop: '2rem' }}>
        <div className="grid grid-3">
          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>📦 Inventory Status</h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <span>In Stock</span>
                <span style={{ fontWeight: 600, color: 'var(--success-green)' }}>{inventoryItems.filter(i => i.status === 'In Stock').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                <span>Low Stock</span>
                <span style={{ fontWeight: 600, color: 'var(--warning-orange)' }}>{inventoryItems.filter(i => i.status === 'Low Stock').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <span>Out of Stock</span>
                <span style={{ fontWeight: 600, color: 'var(--danger-red)' }}>{inventoryItems.filter(i => i.status === 'Out of Stock').length}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>🪑 Tables Status</h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <span>Occupied</span>
                <span style={{ fontWeight: 600, color: 'var(--danger-red)' }}>{occupiedTables}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <span>Available</span>
                <span style={{ fontWeight: 600, color: 'var(--success-green)' }}>{availableTables}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '8px' }}>
                <span>Reserved</span>
                <span style={{ fontWeight: 600, color: '#9333ea' }}>{tables.filter(t => t.status === 'Reserved').length}</span>
              </div>
            </div>
          </div>

          <div className="card">
            <h4 style={{ marginBottom: '1rem' }}>👥 Staff Status</h4>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
                <span>On Duty</span>
                <span style={{ fontWeight: 600, color: 'var(--success-green)' }}>{staffMembers.filter(s => s.status === 'On Duty').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(245, 158, 11, 0.1)', borderRadius: '8px' }}>
                <span>On Leave</span>
                <span style={{ fontWeight: 600, color: 'var(--warning-orange)' }}>{staffMembers.filter(s => s.status === 'On Leave').length}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
                <span>Off Duty</span>
                <span style={{ fontWeight: 600, color: 'var(--danger-red)' }}>{staffMembers.filter(s => s.status === 'Off Duty').length}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
