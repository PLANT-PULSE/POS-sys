'use client'

import { useState } from 'react'

interface SalesData {
  date: string
  revenue: number
  orders: number
  customers: number
  profit: number
}

interface TopItem {
  name: string
  orders: number
  revenue: number
  profit: number
}

interface StaffPerformance {
  id: number
  name: string
  role: string
  orders: number
  sales: number
  rating: number
}

export default function ReportsPage() {
  const [exporting, setExporting] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)
  const [showExportModal, setShowExportModal] = useState(false)
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv' | 'excel'>('pdf')
  const [dateRange, setDateRange] = useState('today')
  const [activeTab, setActiveTab] = useState<'sales' | 'profit' | 'items' | 'staff'>('sales')

  // Sample sales data
  const [salesData] = useState<SalesData[]>([
    { date: '2026-03-04', revenue: 1250, orders: 45, customers: 42, profit: 480 },
    { date: '2026-03-03', revenue: 1180, orders: 42, customers: 38, profit: 450 },
    { date: '2026-03-02', revenue: 980, orders: 35, customers: 32, profit: 380 },
    { date: '2026-03-01', revenue: 1450, orders: 52, customers: 48, profit: 560 },
    { date: '2026-02-28', revenue: 1320, orders: 48, customers: 44, profit: 510 },
    { date: '2026-02-27', revenue: 1100, orders: 40, customers: 36, profit: 420 },
    { date: '2026-02-26', revenue: 890, orders: 32, customers: 28, profit: 340 },
  ])

  // Weekly summary
  const weeklyData = {
    totalRevenue: salesData.reduce((sum, d) => sum + d.revenue, 0),
    totalOrders: salesData.reduce((sum, d) => sum + d.orders, 0),
    totalCustomers: salesData.reduce((sum, d) => sum + d.customers, 0),
    totalProfit: salesData.reduce((sum, d) => sum + d.profit, 0),
    averageOrder: salesData.reduce((sum, d) => sum + d.revenue, 0) / salesData.reduce((sum, d) => sum + d.orders, 0)
  }

  // Monthly data
  const monthlyData = {
    revenue: weeklyData.totalRevenue * 4, // Approximate monthly
    orders: weeklyData.totalOrders * 4,
    profit: weeklyData.totalProfit * 4
  }

  // Estimated costs (for profit calculation)
  const estimatedCosts = {
    ingredient: monthlyData.profit * 2.5, // Cost of goods sold
    staff: 3200,
    utilities: 450,
    rent: 1500,
    marketing: 300,
    maintenance: 200,
    other: 150
  }

  const totalMonthlyExpenses = Object.values(estimatedCosts).reduce((a, b) => a + b, 0)
  const netProfit = monthlyData.revenue - totalMonthlyExpenses

  // Top selling items
  const [topItems] = useState<TopItem[]>([
    { name: 'Jollof Rice', orders: 156, revenue: 3900, profit: 1560 },
    { name: 'Chicken Fried Rice', orders: 124, revenue: 4340, profit: 1736 },
    { name: 'Beef Stew', orders: 98, revenue: 2940, profit: 1176 },
    { name: 'Grilled Chicken', orders: 87, revenue: 3045, profit: 1218 },
    { name: 'Orange Juice', orders: 76, revenue: 608, profit: 304 },
  ])

  // Staff performance
  const [staffPerformance] = useState<StaffPerformance[]>([
    { id: 1, name: 'Waiter Smith', role: 'Waiter', orders: 145, sales: 4200, rating: 4.8 },
    { id: 2, name: 'Waiter Jones', role: 'Waiter', orders: 132, sales: 3850, rating: 4.7 },
    { id: 3, name: 'Chef Kitchen', role: 'Chef', orders: 0, sales: 0, rating: 4.9 },
    { id: 4, name: 'Barista Wilson', role: 'Barista', orders: 89, sales: 1240, rating: 4.6 },
    { id: 5, name: 'Cashier Doe', role: 'Cashier', orders: 178, sales: 5120, rating: 4.9 },
  ])

  const handleExport = () => {
    setShowExportModal(true)
  }

  const processExport = () => {
    setShowExportModal(false)
    setExporting(true)
    
    // Simulate export process
    setTimeout(() => {
      setExporting(false)
      setExportSuccess(true)
      
      // Create a simple download simulation
      const reportData = {
        title: 'Restaurant POS Report',
        generatedAt: new Date().toLocaleString(),
        dateRange,
        data: {
          totalRevenue: `$${weeklyData.totalRevenue}`,
          totalOrders: weeklyData.totalOrders.toString(),
          averageOrder: `$${weeklyData.averageOrder.toFixed(2)}`,
          customersServed: weeklyData.totalCustomers.toString(),
          profit: `$${weeklyData.totalProfit}`
        }
      }
      
      // For PDF simulation - in real app would use jsPDF or similar
      const blob = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `pos-report-${dateRange}.${exportFormat === 'pdf' ? 'json' : exportFormat}`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      setTimeout(() => setExportSuccess(false), 3000)
    }, 2000)
  }

  const getBestSellingIndex = (index: number) => {
    const colors = ['var(--accent-gold)', 'var(--info-blue)', 'var(--warning-orange)', 'var(--success-green)', 'var(--primary-red)']
    return colors[index] || 'var(--info-blue)'
  }

  return (
    <>
      {/* Export Success Toast */}
      {exportSuccess && (
        <div style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          background: 'var(--success-green)',
          color: 'white',
          padding: '1rem 2rem',
          borderRadius: '8px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
          zIndex: 1001,
          animation: 'slideIn 0.3s ease'
        }}>
          <i className="fas fa-check-circle"></i> Report exported successfully!
        </div>
      )}

      {/* Export Loading Overlay */}
      {exporting && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1002
        }}>
          <div style={{
            background: 'white',
            padding: '3rem',
            borderRadius: '16px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
              {exportFormat === 'pdf' ? '📄' : exportFormat === 'csv' ? '📊' : '📈'}
            </div>
            <h2>Generating Report...</h2>
            <p>Please wait while we prepare your {exportFormat.toUpperCase()} file</p>
            <div style={{ 
              marginTop: '1rem', 
              height: '4px', 
              background: '#eee', 
              borderRadius: '2px',
              overflow: 'hidden'
            }}>
              <div style={{
                height: '100%',
                background: 'var(--primary-red)',
                animation: 'progress 2s ease-in-out'
              }}></div>
            </div>
          </div>
        </div>
      )}

      <div className="page-header">
        <div className="page-title">
          <i className="fas fa-chart-bar" style={{ color: 'var(--primary-red)', fontSize: '2rem' }}></i>
          <h1>Reports & Analytics</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            style={{ padding: '0.75rem', borderRadius: '8px', border: '2px solid var(--border-color)' }}
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="btn btn-primary" onClick={handleExport}>
            <i className="fas fa-download"></i> Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-4" style={{ marginBottom: '2rem' }}>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--success-green)' }}>💰</div>
          <div className="stat-label">Total Revenue</div>
          <div className="stat-value">${weeklyData.totalRevenue.toLocaleString()}</div>
          <div className="stat-change">This week</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--info-blue)' }}>📋</div>
          <div className="stat-label">Total Orders</div>
          <div className="stat-value">{weeklyData.totalOrders}</div>
          <div className="stat-change">{weeklyData.totalCustomers} customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--accent-gold)' }}>📊</div>
          <div className="stat-label">Average Order</div>
          <div className="stat-value">${weeklyData.averageOrder.toFixed(2)}</div>
          <div className="stat-change">Per transaction</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-icon" style={{ color: 'var(--primary-red)' }}>💵</div>
          <div className="stat-label">Net Profit</div>
          <div className="stat-value">${weeklyData.totalProfit.toLocaleString()}</div>
          <div className="stat-change">This week</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem' }}>
        <button 
          onClick={() => setActiveTab('sales')}
          style={{ 
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: activeTab === 'sales' ? 'var(--primary-red)' : 'transparent',
            color: activeTab === 'sales' ? 'white' : '#666',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          📈 Sales Performance
        </button>
        <button 
          onClick={() => setActiveTab('profit')}
          style={{ 
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: activeTab === 'profit' ? 'var(--primary-red)' : 'transparent',
            color: activeTab === 'profit' ? 'white' : '#666',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          💰 Profit Analysis
        </button>
        <button 
          onClick={() => setActiveTab('items')}
          style={{ 
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: activeTab === 'items' ? 'var(--primary-red)' : 'transparent',
            color: activeTab === 'items' ? 'white' : '#666',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          ⭐ Best-Selling Items
        </button>
        <button 
          onClick={() => setActiveTab('staff')}
          style={{ 
            padding: '0.75rem 1.5rem',
            border: 'none',
            background: activeTab === 'staff' ? 'var(--primary-red)' : 'transparent',
            color: activeTab === 'staff' ? 'white' : '#666',
            borderRadius: '8px 8px 0 0',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s'
          }}
        >
          👥 Staff Performance
        </button>
      </div>

      {/* Sales Performance Tab */}
      {activeTab === 'sales' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Daily Sales Performance</h3>
          <table className="table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Orders</th>
                <th>Customers</th>
                <th>Revenue</th>
                <th>Profit</th>
                <th>Avg Order</th>
              </tr>
            </thead>
            <tbody>
              {salesData.map((day, idx) => (
                <tr key={idx}>
                  <td style={{ fontWeight: 600 }}>{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</td>
                  <td>{day.orders}</td>
                  <td>{day.customers}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success-green)' }}>${day.revenue.toLocaleString()}</td>
                  <td style={{ fontWeight: 600, color: 'var(--primary-red)' }}>${day.profit.toLocaleString()}</td>
                  <td>${(day.revenue / day.orders).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Profit Analysis Tab */}
      {activeTab === 'profit' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Profit Analysis (Monthly Estimate)</h3>
          
          <div className="grid grid-2" style={{ gap: '2rem' }}>
            {/* Revenue & Profit */}
            <div>
              <h4 style={{ marginBottom: '1rem' }}>💰 Revenue vs Expenses</h4>
              <div style={{ padding: '1.5rem', background: 'var(--secondary-cream)', borderRadius: '12px' }}>
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Revenue</span>
                    <span style={{ fontWeight: 700, color: 'var(--success-green)' }}>${monthlyData.revenue.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--success-green)', borderRadius: '4px', width: '100%' }}></div>
                </div>
                
                <div style={{ marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span>Total Expenses</span>
                    <span style={{ fontWeight: 700, color: 'var(--danger-red)' }}>-${totalMonthlyExpenses.toLocaleString()}</span>
                  </div>
                  <div style={{ height: '8px', background: 'var(--danger-red)', borderRadius: '4px', width: `${(totalMonthlyExpenses / monthlyData.revenue) * 100}%` }}></div>
                </div>
                
                <div style={{ 
                  padding: '1rem', 
                  background: netProfit >= 0 ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)', 
                  borderRadius: '8px',
                  border: `2px solid ${netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)'}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontWeight: 700, fontSize: '1.1rem' }}>Net Profit</span>
                    <span style={{ fontWeight: 700, fontSize: '1.5rem', color: netProfit >= 0 ? 'var(--success-green)' : 'var(--danger-red)' }}>
                      ${netProfit.toLocaleString()}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666', marginTop: '0.25rem' }}>
                    Profit Margin: {((netProfit / monthlyData.revenue) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div>
              <h4 style={{ marginBottom: '1rem' }}>📊 Expense Breakdown</h4>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {Object.entries(estimatedCosts).map(([key, value]) => (
                  <div key={key} style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between',
                    padding: '0.75rem',
                    background: 'var(--secondary-cream)',
                    borderRadius: '8px'
                  }}>
                    <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                    <span style={{ fontWeight: 600 }}>${value.toLocaleString()}</span>
                  </div>
                ))}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  padding: '0.75rem',
                  background: 'var(--danger-red)',
                  color: 'white',
                  borderRadius: '8px',
                  fontWeight: 700
                }}>
                  <span>Total Expenses</span>
                  <span>${totalMonthlyExpenses.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.1)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: 'var(--info-blue)' }}>💡 Profit Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#666' }}>
              <li>Food costs should be 25-35% of revenue for healthy margins</li>
              <li>Staff costs typically should not exceed 30% of revenue</li>
              <li>Monitor utilities and look for energy-saving opportunities</li>
            </ul>
          </div>
        </div>
      )}

      {/* Best-Selling Items Tab */}
      {activeTab === 'items' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Top Selling Items</h3>
          
          <div style={{ display: 'grid', gap: '1rem' }}>
            {topItems.map((item, idx) => (
              <div key={idx} style={{ 
                display: 'flex', 
                alignItems: 'center',
                padding: '1rem',
                background: idx === 0 ? 'rgba(245, 158, 11, 0.1)' : 'var(--secondary-cream)',
                borderRadius: '12px',
                border: idx === 0 ? '2px solid var(--accent-gold)' : '2px solid transparent'
              }}>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  borderRadius: '50%', 
                  background: getBestSellingIndex(idx),
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  marginRight: '1rem'
                }}>
                  {idx + 1}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>
                    {item.name}
                    {idx === 0 && <span style={{ marginLeft: '0.5rem' }}>🏆</span>}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>
                    {item.orders} orders
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--success-green)', fontSize: '1.1rem' }}>
                    ${item.revenue.toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-red)' }}>
                    Profit: ${item.profit.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: 'var(--success-green)' }}>📈 Menu Insights</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#666' }}>
              <li>Jollof Rice is your best seller - consider promoting it more</li>
              <li>Consider bundling items to increase average order value</li>
              <li>Review low-performing items for potential removal</li>
            </ul>
          </div>
        </div>
      )}

      {/* Staff Performance Tab */}
      {activeTab === 'staff' && (
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Staff Performance Report</h3>
          
          <table className="table">
            <thead>
              <tr>
                <th>#</th>
                <th>Staff Name</th>
                <th>Role</th>
                <th>Orders Handled</th>
                <th>Total Sales</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {staffPerformance
                .sort((a, b) => b.sales - a.sales)
                .map((staff, idx) => (
                <tr key={staff.id}>
                  <td>
                    {idx === 0 ? (
                      <span style={{ fontSize: '1.2rem' }}>🥇</span>
                    ) : idx === 1 ? (
                      <span style={{ fontSize: '1.2rem' }}>🥈</span>
                    ) : idx === 2 ? (
                      <span style={{ fontSize: '1.2rem' }}>🥉</span>
                    ) : (
                      idx + 1
                    )}
                  </td>
                  <td style={{ fontWeight: 600 }}>{staff.name}</td>
                  <td>
                    <span style={{ 
                      padding: '0.25rem 0.75rem', 
                      borderRadius: '12px', 
                      background: 'var(--secondary-cream)',
                      fontSize: '0.85rem'
                    }}>
                      {staff.role}
                    </span>
                  </td>
                  <td>{staff.orders}</td>
                  <td style={{ fontWeight: 600, color: 'var(--success-green)' }}>
                    ${staff.sales.toLocaleString()}
                  </td>
                  <td>
                    <span style={{ color: 'var(--accent-gold)', fontWeight: 600 }}>
                      ⭐ {staff.rating}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(147, 51, 234, 0.1)', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem', color: '#9333ea' }}>👥 Staff Management Tips</h4>
            <ul style={{ margin: 0, paddingLeft: '1.2rem', fontSize: '0.9rem', color: '#666' }}>
              <li>Use performance data for employee recognition and rewards</li>
              <li>Identify training needs based on ratings</li>
              <li>Consider commission or bonuses for top performers</li>
            </ul>
          </div>
        </div>
      )}

      {/* Export Modal */}
      {showExportModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>Export Report</h2>
              <button className="modal-close" onClick={() => setShowExportModal(false)}>×</button>
            </div>
            
            <p style={{ marginBottom: '1.5rem', color: '#666' }}>
              Choose your preferred format to export the report data.
            </p>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <button 
                onClick={() => setExportFormat('pdf')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  border: exportFormat === 'pdf' ? '2px solid var(--primary-red)' : '2px solid var(--border-color)',
                  borderRadius: '8px',
                  background: exportFormat === 'pdf' ? 'rgba(239, 68, 68, 0.05)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '2rem' }}>📄</span>
                <div>
                  <div style={{ fontWeight: 600 }}>PDF Document</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Best for printing and sharing</div>
                </div>
              </button>

              <button 
                onClick={() => setExportFormat('excel')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  border: exportFormat === 'excel' ? '2px solid var(--primary-red)' : '2px solid var(--border-color)',
                  borderRadius: '8px',
                  background: exportFormat === 'excel' ? 'rgba(239, 68, 68, 0.05)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '2rem' }}>📊</span>
                <div>
                  <div style={{ fontWeight: 600 }}>Excel Spreadsheet</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Best for data analysis</div>
                </div>
              </button>

              <button 
                onClick={() => setExportFormat('csv')}
                style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '1rem',
                  padding: '1rem',
                  border: exportFormat === 'csv' ? '2px solid var(--primary-red)' : '2px solid var(--border-color)',
                  borderRadius: '8px',
                  background: exportFormat === 'csv' ? 'rgba(239, 68, 68, 0.05)' : 'white',
                  cursor: 'pointer',
                  textAlign: 'left'
                }}
              >
                <span style={{ fontSize: '2rem' }}>📈</span>
                <div>
                  <div style={{ fontWeight: 600 }}>CSV File</div>
                  <div style={{ fontSize: '0.85rem', color: '#666' }}>Universal data format</div>
                </div>
              </button>
            </div>

            <div className="modal-actions" style={{ marginTop: '1.5rem' }}>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={processExport}>
                <i className="fas fa-download"></i> Download {exportFormat.toUpperCase()}
              </button>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowExportModal(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
