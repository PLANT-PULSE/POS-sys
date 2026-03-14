'use client'

import { useState, createContext, useContext, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useIsMobile } from '@/hooks/use-mobile'

// Theme Context
const ThemeContext = createContext<{
  darkMode: boolean
  toggleDarkMode: () => void
}>({
  darkMode: false,
  toggleDarkMode: () => {}
})

export const useTheme = () => useContext(ThemeContext)

const navItems = [
  {
    title: 'Main',
    items: [
      { name: 'Dashboard', href: '/', icon: 'chart-line' },
      { name: 'Orders / POS', href: '/orders', icon: 'shopping-cart' },
      { name: 'Tables', href: '/tables', icon: 'chair' },
    ],
  },
  {
    title: 'Management',
    items: [
      { name: 'Menu', href: '/menu', icon: 'list' },
      { name: 'Inventory', href: '/inventory', icon: 'box' },
      { name: 'Customers', href: '/customers', icon: 'users' },
      { name: 'Staff', href: '/staff', icon: 'user-tie' },
    ],
  },
  {
    title: 'Analytics',
    items: [
      { name: 'Reports', href: '/reports', icon: 'chart-bar' },
      { name: 'Expenses', href: '/expenses', icon: 'receipt' },
    ],
  },
  {
    title: 'Settings',
    items: [
      { name: 'Settings', href: '/settings', icon: 'cog' },
    ],
  },
]

export default function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [darkMode, setDarkMode] = useState(false)
  const isMobile = useIsMobile()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode')
    } else {
      document.body.classList.remove('dark-mode')
    }
  }, [darkMode])

  const toggleDarkMode = () => setDarkMode(!darkMode)

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {/* Mobile Menu Overlay */}
      {isMobile && mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <div className="sidebar-logo">
                <i className="fas fa-utensils"></i>
                <span>RestaurantPOS</span>
              </div>
              <button className="mobile-menu-close" onClick={() => setMobileMenuOpen(false)}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <nav className="mobile-nav">
              {navItems.map((section) => (
                <div className="nav-section" key={section.title}>
                  <div className="nav-section-title">{section.title}</div>
                  {section.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className={`fas fa-${item.icon}`}></i>
                      <span>{item.name}</span>
                    </Link>
                  ))}
                </div>
              ))}
            </nav>
            <div className="mobile-menu-footer">
              <button className="theme-toggle-btn" onClick={toggleDarkMode}>
                <i className={`fas fa-${darkMode ? 'sun' : 'moon'}`}></i>
                <span>{darkMode ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      <div className={`layout ${collapsed ? 'collapsed' : ''} ${darkMode ? 'dark' : ''}`}>
        {/* Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-logo">
            <i className="fas fa-utensils"></i>
            <span>RestaurantPOS</span>
          </div>

          {navItems.map((section) => (
            <div className="nav-section" key={section.title}>
              <div className="nav-section-title">{section.title}</div>
              {section.items.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`nav-item ${pathname === item.href ? 'active' : ''}`}
                >
                  <i className={`fas fa-${item.icon}`}></i>
                  <span>{item.name}</span>
                </Link>
              ))}
            </div>
          ))}
        </aside>

        {/* Main Content */}
        <main className="main-container">
          {/* Top Bar */}
          <header className="topbar">
            <div className="topbar-left">
              {isMobile && (
                <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
                  <i className="fas fa-bars"></i>
                </button>
              )}
              {!isMobile && (
                <button className="toggle-sidebar" onClick={() => setCollapsed(!collapsed)}>
                  <i className="fas fa-bars"></i>
                </button>
              )}
              <h2 style={{ margin: 0, fontSize: isMobile ? '1rem' : '1.3rem' }}>
                {navItems.flatMap(s => s.items).find(i => i.href === pathname)?.name || 'POS System'}
              </h2>
            </div>
            <div className="topbar-right">
              {!isMobile && (
                <button className="theme-toggle" onClick={toggleDarkMode}>
                  <i className={`fas fa-${darkMode ? 'sun' : 'moon'}`}></i>
                </button>
              )}
              {!isMobile && (
                <div className="user-profile">
                  <div className="user-avatar">JM</div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>John Manager</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>Admin</div>
                  </div>
                </div>
              )}
              {isMobile && (
                <div className="user-avatar-small">JM</div>
              )}
            </div>
          </header>

          {/* Page Content */}
          <div className="content">
            {children}
          </div>
        </main>
      </div>

      <style jsx global>{`
        :root {
          --primary-red: #c41e3a;
          --primary-green: #2d5016;
          --secondary-cream: #f5f1e8;
          --accent-gold: #d4af37;
          --accent-orange: #ff8c42;
          --text-dark: #2c2c2c;
          --text-light: #f5f1e8;
          --border-color: rgba(212, 175, 55, 0.2);
          --success-green: #10b981;
          --warning-orange: #f59e0b;
          --danger-red: #ef4444;
          --info-blue: #3b82f6;
          --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          --card-bg: white;
          --topbar-bg: white;
        }

        body {
          background: linear-gradient(135deg, #f5f1e8 0%, #e8e3d8 100%);
          color: var(--text-dark);
        }

        body.dark-mode, .layout.dark {
          --card-bg: #2d2d2d;
          --topbar-bg: #1a1a1a;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
          color: var(--text-light);
        }

        body.dark-mode .card, .layout.dark .card {
          background: var(--card-bg);
          border-color: rgba(212, 175, 55, 0.3);
        }

        body.dark-mode .topbar, .layout.dark .topbar {
          background: var(--topbar-bg);
          border-color: rgba(212, 175, 55, 0.3);
        }

        body.dark-mode input, body.dark-mode textarea, body.dark-mode select,
        .layout.dark input, .layout.dark textarea, .layout.dark select {
          background: rgba(255, 255, 255, 0.1);
          border-color: rgba(212, 175, 55, 0.3);
          color: var(--text-light);
        }

        body.dark-mode .user-profile, .layout.dark .user-profile {
          background: rgba(255, 255, 255, 0.1);
        }

        body.dark-mode .toggle-sidebar, body.dark-mode .theme-toggle,
        .layout.dark .toggle-sidebar, .layout.dark .theme-toggle {
          color: var(--text-light);
        }

        body.dark-mode .table th, .layout.dark .table th {
          color: var(--text-light);
        }

        .layout {
          display: flex;
          min-height: 100vh;
        }

        .layout.collapsed .sidebar {
          width: 80px;
        }

        .layout.collapsed .sidebar-logo span {
          display: none;
        }

        .layout.collapsed .nav-section-title {
          display: none;
        }

        .layout.collapsed .nav-item {
          justify-content: center;
          padding: 0.75rem;
        }

        .layout.collapsed .nav-item span {
          display: none;
        }

        .layout.collapsed .main-container {
          margin-left: 80px;
        }

        .sidebar {
          position: fixed;
          left: 0;
          top: 0;
          width: 260px;
          height: 100vh;
          background: linear-gradient(180deg, #2d2d2d 0%, #1a1a1a 100%);
          color: var(--text-light);
          padding: 2rem 0;
          overflow-y: auto;
          box-shadow: 2px 0 15px rgba(0, 0, 0, 0.3);
          z-index: 1000;
          transition: var(--transition-smooth);
        }

        .sidebar-logo {
          padding: 0 1.5rem;
          margin-bottom: 2rem;
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-size: 1.3rem;
          font-weight: 700;
          color: var(--accent-gold);
        }

        .nav-section {
          margin-bottom: 2rem;
        }

        .nav-section-title {
          font-size: 0.85rem;
          font-weight: 700;
          text-transform: uppercase;
          color: rgba(212, 175, 55, 0.6);
          padding: 0.5rem 1.5rem;
          margin-bottom: 0.5rem;
          letter-spacing: 0.5px;
        }

        .nav-item {
          padding: 0.75rem 1.5rem;
          color: rgba(245, 241, 232, 0.7);
          cursor: pointer;
          transition: var(--transition-smooth);
          display: flex;
          align-items: center;
          gap: 1rem;
          text-decoration: none;
        }

        .nav-item:hover {
          background: rgba(212, 175, 55, 0.1);
          color: var(--accent-gold);
          padding-left: 2rem;
        }

        .nav-item.active {
          background: linear-gradient(90deg, rgba(196, 30, 58, 0.3) 0%, transparent 100%);
          color: var(--accent-gold);
          border-left: 3px solid var(--accent-gold);
          padding-left: calc(1.5rem - 3px);
        }

        .main-container {
          margin-left: 260px;
          transition: var(--transition-smooth);
          min-height: 100vh;
          flex: 1;
        }

        .topbar {
          background: white;
          border-bottom: 1px solid rgba(196, 30, 58, 0.1);
          padding: 1rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
          position: sticky;
          top: 0;
          z-index: 500;
        }

        .topbar-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .toggle-sidebar, .theme-toggle {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 1.3rem;
          color: var(--text-dark);
          padding: 0.5rem;
          border-radius: 8px;
          transition: var(--transition-smooth);
        }

        .toggle-sidebar:hover, .theme-toggle:hover {
          background: var(--secondary-cream);
        }

        .topbar-right {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem;
          background: var(--secondary-cream);
          border-radius: 8px;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--primary-red);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.9rem;
        }

        .content {
          padding: 2rem;
        }

        .card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(196, 30, 58, 0.1);
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 1rem;
          font-weight: 600;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          text-decoration: none;
          white-space: nowrap;
          transition: var(--transition-smooth);
        }

        .btn-primary {
          background: linear-gradient(135deg, var(--primary-red) 0%, #a01730 100%);
          color: white;
          box-shadow: 0 4px 15px rgba(196, 30, 58, 0.4);
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(196, 30, 58, 0.6);
        }

        .btn-secondary {
          background: var(--accent-gold);
          color: var(--text-dark);
        }

        .btn-outline {
          background: transparent;
          border: 2px solid var(--primary-red);
          color: var(--primary-red);
        }

        .btn-danger {
          background: var(--danger-red);
          color: white;
        }

        .btn-small {
          padding: 0.5rem 1rem;
          font-size: 0.85rem;
        }

        .page-header {
          margin-bottom: 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .page-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .page-title h1 {
          font-size: 2rem;
          margin: 0;
        }

        .grid {
          display: grid;
          gap: 1.5rem;
        }

        .grid-2 { grid-template-columns: repeat(2, 1fr); }
        .grid-3 { grid-template-columns: repeat(3, 1fr); }
        .grid-4 { grid-template-columns: repeat(4, 1fr); }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        input, textarea, select {
          width: 100%;
          padding: 0.75rem;
          border: 2px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          background: var(--secondary-cream);
          color: var(--text-dark);
        }

        input:focus, textarea:focus, select:focus {
          outline: none;
          border-color: var(--accent-gold);
          box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.2);
        }

        .table {
          width: 100%;
          border-collapse: collapse;
        }

        .table th, .table td {
          padding: 1rem;
          text-align: left;
          border-bottom: 1px solid var(--border-color);
        }

        .table th {
          font-weight: 600;
          color: var(--text-dark);
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.08);
          border: 1px solid rgba(196, 30, 58, 0.1);
        }

        .stat-card-icon {
          font-size: 2rem;
          margin-bottom: 0.5rem;
        }

        .stat-label {
          color: #666;
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }

        .stat-value {
          font-size: 1.8rem;
          font-weight: 700;
          color: var(--text-dark);
        }

        .stat-change {
          font-size: 0.85rem;
          margin-top: 0.5rem;
        }

        .stat-change.positive {
          color: var(--success-green);
        }

        /* Modal Styles */
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          max-height: 90vh;
          overflow-y: auto;
        }

        .layout.dark .modal-content {
          background: #2d2d2d;
          color: var(--text-light);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .modal-header h2 {
          margin: 0;
        }

        .modal-close {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
          color: #666;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
        }

        @media (max-width: 1024px) {
          .grid-4 { grid-template-columns: repeat(2, 1fr); }
        }

        @media (max-width: 768px) {
          .sidebar { width: 80px; }
          .main-container { margin-left: 80px; }
          .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
        }
      `}</style>
    </ThemeContext.Provider>
  )
}
