/* ================================
   RESTAURANT POS SYSTEM - JAVASCRIPT
   ================================ */

// ========== GLOBAL STATE ==========
const state = {
  cart: [],
  darkMode: localStorage.getItem('darkMode') === 'true',
  currentUser: {
    name: 'John Manager',
    role: 'admin',
    avatar: 'JM'
  },
  selectedCurrency: localStorage.getItem('currency') || 'USD',
  taxRate: localStorage.getItem('taxRate') || 0.15,
  menuItems: [],
  tables: [],
  customers: [],
  staff: [],
  expenses: []
};

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function () {
  initializeApp();
});

function initializeApp() {
  setupTheme();
  setupNavigation();
  setupSidebar();
  setupEventListeners();
  loadDummyData();
  renderCurrentPage();
}

// ========== THEME SETUP ==========
function setupTheme() {
  if (state.darkMode) {
    document.body.classList.add('dark-mode');
  }
}

function toggleDarkMode() {
  state.darkMode = !state.darkMode;
  localStorage.setItem('darkMode', state.darkMode);
  document.body.classList.toggle('dark-mode');
}

// ========== SIDEBAR SETUP ==========
function setupSidebar() {
  const toggleBtn = document.querySelector('.toggle-sidebar');
  if (toggleBtn) {
    toggleBtn.addEventListener('click', function () {
      document.querySelector('.sidebar').classList.toggle('collapsed');
      document.querySelector('.main-container').classList.toggle('collapsed');
    });
  }
}

// ========== NAVIGATION ==========
function setupNavigation() {
  const navItems = document.querySelectorAll('.nav-item');
  navItems.forEach(item => {
    item.addEventListener('click', function (e) {
      e.preventDefault();
      const href = this.getAttribute('href');
      if (href && !href.startsWith('javascript')) {
        window.location.href = href;
      }
    });
  });

  // Set active nav item based on current page
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  navItems.forEach(item => {
    const itemHref = item.getAttribute('href');
    if (itemHref && itemHref.includes(currentPage)) {
      item.classList.add('active');
    } else if (currentPage === '' && itemHref === 'dashboard.html') {
      item.classList.add('active');
    }
  });
}

// ========== EVENT LISTENERS ==========
function setupEventListeners() {
  const themeToggle = document.querySelector('.theme-toggle, .mode-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', toggleDarkMode);
  }

  const logoutBtn = document.querySelector('.logout-btn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', function () {
      window.location.href = 'index.html';
    });
  }
}

// ========== MODAL FUNCTIONS ==========
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('active');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('active');
  }
}

document.addEventListener('click', function (e) {
  if (e.target.classList.contains('modal')) {
    e.target.classList.remove('active');
  }
  if (e.target.classList.contains('modal-close')) {
    e.target.closest('.modal').classList.remove('active');
  }
});

// ========== TOAST NOTIFICATIONS ==========
function showToast(message, type = 'success') {
  const container = document.querySelector('.toast-container') || createToastContainer();
  
  const icons = {
    success: '✓',
    warning: '⚠',
    error: '✕'
  };

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon">${icons[type]}</span>
    <span class="toast-message">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

function createToastContainer() {
  const container = document.createElement('div');
  container.className = 'toast-container';
  document.body.appendChild(container);
  return container;
}

// ========== FORM VALIDATION ==========
function validateForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return true;

  const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
  let isValid = true;

  inputs.forEach(input => {
    if (!input.value.trim()) {
      input.style.borderColor = 'var(--danger-red)';
      isValid = false;
    } else {
      input.style.borderColor = '';
    }
  });

  return isValid;
}

// ========== CART MANAGEMENT ==========
function addToCart(itemId, itemName, itemPrice) {
  const existingItem = state.cart.find(item => item.id === itemId);

  if (existingItem) {
    existingItem.quantity++;
  } else {
    state.cart.push({
      id: itemId,
      name: itemName,
      price: itemPrice,
      quantity: 1
    });
  }

  updateCart();
  showToast(`${itemName} added to cart!`, 'success');
}

function removeFromCart(itemId) {
  state.cart = state.cart.filter(item => item.id !== itemId);
  updateCart();
}

function updateQuantity(itemId, quantity) {
  const item = state.cart.find(item => item.id === itemId);
  if (item) {
    item.quantity = Math.max(1, quantity);
    updateCart();
  }
}

function updateCart() {
  const cartItems = document.getElementById('cart-items');
  const cartEmpty = document.getElementById('cart-empty');
  
  if (!cartItems) return;

  if (state.cart.length === 0) {
    cartItems.innerHTML = '';
    if (cartEmpty) cartEmpty.style.display = 'block';
    updateCartTotals();
    return;
  }

  if (cartEmpty) cartEmpty.style.display = 'none';

  cartItems.innerHTML = state.cart.map(item => `
    <div class="cart-item">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${formatCurrency(item.price)}</div>
      </div>
      <div class="quantity-control">
        <button onclick="updateQuantity('${item.id}', ${item.quantity - 1})">−</button>
        <span class="qty">${item.quantity}</span>
        <button onclick="updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
      </div>
      <button class="remove-item" onclick="removeFromCart('${item.id}')">✕</button>
    </div>
  `).join('');

  updateCartTotals();
}

function updateCartTotals() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * state.taxRate;
  const total = subtotal + tax;

  const subtotalEl = document.querySelector('[data-subtotal]');
  const taxEl = document.querySelector('[data-tax]');
  const totalEl = document.querySelector('[data-total]');
  const discountInput = document.getElementById('discount-amount');

  if (subtotalEl) subtotalEl.textContent = formatCurrency(subtotal);
  if (taxEl) taxEl.textContent = formatCurrency(tax);

  let finalTotal = total;
  if (discountInput && discountInput.value) {
    const discount = parseFloat(discountInput.value) || 0;
    finalTotal = Math.max(0, total - discount);
  }

  if (totalEl) totalEl.textContent = formatCurrency(finalTotal);
}

function clearCart() {
  state.cart = [];
  updateCart();
}

// ========== PAYMENT ==========
function processPayment() {
  if (state.cart.length === 0) {
    showToast('Cart is empty!', 'warning');
    return;
  }

  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * state.taxRate;
  const total = subtotal + tax;
  const discountInput = document.getElementById('discount-amount');
  const discount = discountInput ? parseFloat(discountInput.value) || 0 : 0;
  const finalTotal = Math.max(0, total - discount);

  const paymentModal = document.getElementById('payment-modal');
  const paymentSummary = document.getElementById('payment-summary');

  if (paymentSummary) {
    paymentSummary.innerHTML = `
      <div class="summary-row">
        <span>Subtotal:</span>
        <span>${formatCurrency(subtotal)}</span>
      </div>
      <div class="summary-row">
        <span>Tax (${(state.taxRate * 100).toFixed(0)}%):</span>
        <span>${formatCurrency(tax)}</span>
      </div>
      ${discount > 0 ? `
        <div class="summary-row">
          <span>Discount:</span>
          <span>-${formatCurrency(discount)}</span>
        </div>
      ` : ''}
      <div class="summary-row total">
        <span>Total:</span>
        <span>${formatCurrency(finalTotal)}</span>
      </div>
    `;
  }

  if (paymentModal) {
    openModal('payment-modal');
  }
}

function completePayment(method) {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * state.taxRate;
  const total = subtotal + tax;
  const discountInput = document.getElementById('discount-amount');
  const discount = discountInput ? parseFloat(discountInput.value) || 0 : 0;
  const finalTotal = Math.max(0, total - discount);

  showToast(`Payment of ${formatCurrency(finalTotal)} completed via ${method}!`, 'success');
  
  // Simulate saving to database
  logTransaction({
    date: new Date(),
    items: state.cart.length,
    amount: finalTotal,
    method: method,
    taxAmount: tax,
    discountAmount: discount
  });

  clearCart();
  closeModal('payment-modal');
}

function logTransaction(transaction) {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  transactions.unshift(transaction);
  localStorage.setItem('transactions', JSON.stringify(transactions.slice(0, 100)));
}

// ========== CURRENCY & FORMATTING ==========
function formatCurrency(amount) {
  const symbols = {
    'USD': '$',
    'GHS': '₵',
    'EUR': '€'
  };

  const symbol = symbols[state.selectedCurrency] || '$';
  return symbol + amount.toFixed(2);
}

function changeCurrency(currency) {
  state.selectedCurrency = currency;
  localStorage.setItem('currency', currency);
  updateCartTotals();
  showToast(`Currency changed to ${currency}`, 'success');
}

// ========== SPLIT BILL ==========
function openSplitBill() {
  const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * state.taxRate;
  const total = subtotal + tax;

  const splitInput = prompt('How many people to split the bill?', '2');
  if (splitInput && !isNaN(splitInput) && splitInput > 0) {
    const splitAmount = total / splitInput;
    showToast(`Bill split into ${splitInput} parts: ${formatCurrency(splitAmount)} each`, 'success');
  }
}

// ========== DUMMY DATA ==========
function loadDummyData() {
  state.menuItems = [
    { id: 'burger1', name: 'Classic Burger', price: 8.99, category: 'Fast Food', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300&h=200&fit=crop' },
    { id: 'burger2', name: 'Cheese Burger', price: 9.99, category: 'Fast Food', image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=300&h=200&fit=crop' },
    { id: 'pizza1', name: 'Margherita Pizza', price: 12.99, category: 'Fast Food', image: 'https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=300&h=200&fit=crop' },
    { id: 'pizza2', name: 'Pepperoni Pizza', price: 13.99, category: 'Fast Food', image: 'https://images.unsplash.com/photo-1628840042765-356cda07f641?w=300&h=200&fit=crop' },
    { id: 'salad1', name: 'Caesar Salad', price: 7.99, category: 'Local Dishes', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&h=200&fit=crop' },
    { id: 'rice1', name: 'Fried Rice', price: 10.99, category: 'Local Dishes', image: 'https://images.unsplash.com/photo-1571115764595-644a26bb6704?w=300&h=200&fit=crop' },
    { id: 'rice2', name: 'White Rice & Stew', price: 9.99, category: 'Local Dishes', image: 'https://images.unsplash.com/photo-1635330039767-813f89e92d53?w=300&h=200&fit=crop' },
    { id: 'dessert1', name: 'Chocolate Cake', price: 5.99, category: 'Desserts', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=200&fit=crop' },
    { id: 'coffee1', name: 'Espresso', price: 3.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?w=300&h=200&fit=crop' },
    { id: 'coffee2', name: 'Cappuccino', price: 4.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1572442197986-d6e40d6e2ef2?w=300&h=200&fit=crop' },
    { id: 'juice1', name: 'Orange Juice', price: 3.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=300&h=200&fit=crop' },
    { id: 'cola1', name: 'Coca Cola', price: 2.99, category: 'Drinks', image: 'https://images.unsplash.com/photo-1554866585-d4b644f6515f?w=300&h=200&fit=crop' }
  ];

  state.tables = [
    { id: 1, status: 'available', capacity: 2 },
    { id: 2, status: 'occupied', capacity: 2 },
    { id: 3, status: 'reserved', capacity: 4 },
    { id: 4, status: 'available', capacity: 4 },
    { id: 5, status: 'occupied', capacity: 6 },
    { id: 6, status: 'available', capacity: 6 },
    { id: 7, status: 'occupied', capacity: 2 },
    { id: 8, status: 'available', capacity: 4 },
    { id: 9, status: 'occupied', capacity: 4 },
    { id: 10, status: 'reserved', capacity: 8 }
  ];

  state.customers = [
    { id: 1, name: 'John Smith', phone: '+1 234 567 8901', points: 450, visits: 12 },
    { id: 2, name: 'Sarah Johnson', phone: '+1 234 567 8902', points: 320, visits: 8 },
    { id: 3, name: 'Mike Brown', phone: '+1 234 567 8903', points: 180, visits: 5 },
    { id: 4, name: 'Emily Davis', phone: '+1 234 567 8904', points: 670, visits: 18 },
    { id: 5, name: 'David Wilson', phone: '+1 234 567 8905', points: 250, visits: 7 }
  ];

  state.staff = [
    { id: 1, name: 'John Manager', role: 'Admin', shift: 'Morning', status: 'On Duty' },
    { id: 2, name: 'Alex Cashier', role: 'Cashier', shift: 'Morning', status: 'On Duty' },
    { id: 3, name: 'Sarah Waiter', role: 'Waiter', shift: 'Morning', status: 'On Duty' },
    { id: 4, name: 'Tom Chef', role: 'Chef', shift: 'Morning', status: 'On Duty' },
    { id: 5, name: 'Lisa Assistant', role: 'Assistant', shift: 'Evening', status: 'Off Duty' }
  ];

  state.expenses = [
    { id: 1, category: 'Food Supplies', amount: 250, date: new Date().toISOString().split('T')[0], description: 'Bulk groceries' },
    { id: 2, category: 'Utilities', amount: 150, date: new Date().toISOString().split('T')[0], description: 'Electricity bill' },
    { id: 3, category: 'Maintenance', amount: 80, date: new Date().toISOString().split('T')[0], description: 'Equipment repair' }
  ];
}

// ========== RENDER CURRENT PAGE ==========
function renderCurrentPage() {
  const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';

  if (currentPage.includes('orders')) renderOrdersPage();
  if (currentPage.includes('menu')) renderMenuPage();
  if (currentPage.includes('tables')) renderTablesPage();
  if (currentPage.includes('inventory')) renderInventoryPage();
  if (currentPage.includes('customers')) renderCustomersPage();
  if (currentPage.includes('staff')) renderStaffPage();
  if (currentPage.includes('reports')) renderReportsPage();
  if (currentPage.includes('expenses')) renderExpensesPage();
  if (currentPage.includes('settings')) renderSettingsPage();
  if (currentPage.includes('dashboard')) renderDashboard();
  if (currentPage.includes('index') || currentPage === '') renderLoginSetup();
}

// ========== ORDERS PAGE ==========
function renderOrdersPage() {
  const menuGrid = document.getElementById('menu-grid');
  if (!menuGrid) return;

  menuGrid.innerHTML = state.menuItems.map(item => `
    <div class="food-item">
      <img src="${item.image}" alt="${item.name}" class="food-image">
      <div class="food-details">
        <div class="food-name">${item.name}</div>
        <div class="food-category">${item.category}</div>
        <div class="food-price">${formatCurrency(item.price)}</div>
        <button class="btn btn-primary btn-small" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">
          Add to Cart
        </button>
      </div>
    </div>
  `).join('');

  // Filter functionality
  const filterBtns = document.querySelectorAll('.filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      filterBtns.forEach(b => b.style.opacity = '0.5');
      this.style.opacity = '1';
      
      const category = this.dataset.category;
      const filtered = category === 'all' 
        ? state.menuItems 
        : state.menuItems.filter(item => item.category === category);
      
      menuGrid.innerHTML = filtered.map(item => `
        <div class="food-item">
          <img src="${item.image}" alt="${item.name}" class="food-image">
          <div class="food-details">
            <div class="food-name">${item.name}</div>
            <div class="food-category">${item.category}</div>
            <div class="food-price">${formatCurrency(item.price)}</div>
            <button class="btn btn-primary btn-small" onclick="addToCart('${item.id}', '${item.name}', ${item.price})">
              Add to Cart
            </button>
          </div>
        </div>
      `).join('');
    });
  });

  // Initialize cart
  updateCart();

  // Payment button
  const paymentBtn = document.getElementById('payment-btn');
  if (paymentBtn) {
    paymentBtn.addEventListener('click', processPayment);
  }

  // Discount input
  const discountInput = document.getElementById('discount-amount');
  if (discountInput) {
    discountInput.addEventListener('change', updateCartTotals);
  }

  // Split bill
  const splitBtn = document.getElementById('split-btn');
  if (splitBtn) {
    splitBtn.addEventListener('click', openSplitBill);
  }
}

// ========== MENU MANAGEMENT PAGE ==========
function renderMenuPage() {
  const menuTable = document.getElementById('menu-table');
  if (!menuTable) return;

  menuTable.innerHTML = state.menuItems.map((item, index) => `
    <tr>
      <td>${index + 1}</td>
      <td>
        <img src="${item.image}" alt="${item.name}" style="width: 40px; height: 40px; border-radius: 4px;">
      </td>
      <td>${item.name}</td>
      <td>${item.category}</td>
      <td>${formatCurrency(item.price)}</td>
      <td>
        <span class="badge badge-success">Available</span>
      </td>
      <td>
        <button class="btn btn-outline btn-small" onclick="editMenuItem('${item.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteMenuItem('${item.id}')">Delete</button>
      </td>
    </tr>
  `).join('');

  // Add menu item
  const addMenuForm = document.getElementById('add-menu-form');
  if (addMenuForm) {
    addMenuForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm('add-menu-form')) {
        showToast('Menu item added successfully!', 'success');
        addMenuForm.reset();
        closeModal('add-menu-modal');
      }
    });
  }
}

function editMenuItem(id) {
  openModal('add-menu-modal');
  showToast('Edit mode enabled for item: ' + id, 'info');
}

function deleteMenuItem(id) {
  if (confirm('Are you sure you want to delete this item?')) {
    state.menuItems = state.menuItems.filter(item => item.id !== id);
    renderMenuPage();
    showToast('Menu item deleted!', 'success');
  }
}

// ========== TABLES PAGE ==========
function renderTablesPage() {
  const tablesGrid = document.getElementById('tables-grid');
  if (!tablesGrid) return;

  tablesGrid.innerHTML = state.tables.map(table => `
    <div class="card" style="text-align: center; cursor: pointer;" onclick="openTableModal(${table.id})">
      <div style="font-size: 2.5rem; margin-bottom: 1rem;">🪑</div>
      <h3>Table ${table.id}</h3>
      <p style="color: #999; margin-bottom: 1rem;">Capacity: ${table.capacity}</p>
      <span class="status-badge status-${table.status}">
        <span class="status-dot"></span>
        ${table.status.charAt(0).toUpperCase() + table.status.slice(1)}
      </span>
    </div>
  `).join('');
}

function openTableModal(tableId) {
  const table = state.tables.find(t => t.id === tableId);
  const modal = document.getElementById('table-modal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  content.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">Table ${tableId}</h2>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Table Capacity:</label>
        <p>${table.capacity} people</p>
      </div>
      <div class="form-group">
        <label>Status:</label>
        <p>
          <span class="status-badge status-${table.status}">
            <span class="status-dot"></span>
            ${table.status.charAt(0).toUpperCase() + table.status.slice(1)}
          </span>
        </p>
      </div>
      <div class="form-group" id="table-order-section" style="display: ${table.status === 'occupied' ? 'block' : 'none'}">
        <label>Current Order:</label>
        <p>Order #1234 - 3 items</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('table-modal')">Close</button>
      ${table.status === 'available' ? `<button class="btn btn-primary" onclick="reserveTable(${tableId})">Reserve</button>` : ''}
    </div>
  `;
  
  openModal('table-modal');
}

function reserveTable(tableId) {
  const modal = document.getElementById('reservation-modal');
  if (!modal) return;

  openModal('reservation-modal');
  showToast('Reservation form opened for Table ' + tableId, 'info');
}

// ========== INVENTORY PAGE ==========
function renderInventoryPage() {
  const inventoryTable = document.getElementById('inventory-table');
  if (!inventoryTable) return;

  const inventory = [
    { id: 1, name: 'Flour', unit: 'kg', stock: 25, minLevel: 10, supplier: 'Best Foods Inc' },
    { id: 2, name: 'Sugar', unit: 'kg', stock: 15, minLevel: 5, supplier: 'Sweet Supplies' },
    { id: 3, name: 'Oil', unit: 'L', stock: 8, minLevel: 5, supplier: 'Oil Co' },
    { id: 4, name: 'Tomato Sauce', unit: 'cans', stock: 3, minLevel: 10, supplier: 'Food Mart' },
    { id: 5, name: 'Cheese', unit: 'kg', stock: 12, minLevel: 8, supplier: 'Dairy Plus' }
  ];

  inventoryTable.innerHTML = inventory.map(item => {
    const isLowStock = item.stock < item.minLevel;
    return `
      <tr>
        <td>${item.name}</td>
        <td>${item.unit}</td>
        <td>
          <div style="display: flex; align-items: center; gap: 0.5rem;">
            <div style="flex: 1; height: 20px; background: #eee; border-radius: 10px; overflow: hidden;">
              <div style="height: 100%; background: ${isLowStock ? 'var(--danger-red)' : 'var(--success-green)'}; width: ${Math.min(item.stock * 10, 100)}%;"></div>
            </div>
            <span style="font-weight: 600;">${item.stock}</span>
          </div>
        </td>
        <td>
          ${isLowStock ? '<span class="badge badge-danger">Low Stock</span>' : '<span class="badge badge-success">OK</span>'}
        </td>
        <td>${item.supplier}</td>
        <td>
          <button class="btn btn-outline btn-small" onclick="editInventory('${item.id}')">Edit</button>
        </td>
      </tr>
    `;
  }).join('');
}

function editInventory(id) {
  openModal('inventory-modal');
}

// ========== CUSTOMERS PAGE ==========
function renderCustomersPage() {
  const customersTable = document.getElementById('customers-table');
  if (!customersTable) return;

  customersTable.innerHTML = state.customers.map(customer => `
    <tr>
      <td>${customer.name}</td>
      <td>${customer.phone}</td>
      <td>${customer.visits}</td>
      <td>
        <span class="badge badge-info">${customer.points} pts</span>
      </td>
      <td>
        <button class="btn btn-outline btn-small" onclick="viewCustomer('${customer.id}')">View</button>
        <button class="btn btn-primary btn-small" onclick="editCustomer('${customer.id}')">Edit</button>
      </td>
    </tr>
  `).join('');

  const addCustomerForm = document.getElementById('add-customer-form');
  if (addCustomerForm) {
    addCustomerForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm('add-customer-form')) {
        showToast('Customer added successfully!', 'success');
        addCustomerForm.reset();
        closeModal('add-customer-modal');
      }
    });
  }
}

function viewCustomer(id) {
  const customer = state.customers.find(c => c.id == id);
  if (!customer) return;

  const modal = document.getElementById('customer-modal');
  if (!modal) return;

  const content = modal.querySelector('.modal-content');
  content.innerHTML = `
    <div class="modal-header">
      <h2 class="modal-title">${customer.name}</h2>
      <button class="modal-close">✕</button>
    </div>
    <div class="modal-body">
      <div class="form-group">
        <label>Phone:</label>
        <p>${customer.phone}</p>
      </div>
      <div class="form-group">
        <label>Total Visits:</label>
        <p>${customer.visits}</p>
      </div>
      <div class="form-group">
        <label>Loyalty Points:</label>
        <p><strong>${customer.points}</strong></p>
      </div>
      <div class="form-group">
        <label>Purchase History:</label>
        <p>Last purchase: 2 days ago - $45.50</p>
      </div>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" onclick="closeModal('customer-modal')">Close</button>
    </div>
  `;

  openModal('customer-modal');
}

function editCustomer(id) {
  openModal('add-customer-modal');
}

// ========== STAFF PAGE ==========
function renderStaffPage() {
  const staffGrid = document.getElementById('staff-grid');
  if (!staffGrid) return;

  staffGrid.innerHTML = state.staff.map(staff => `
    <div class="card">
      <div style="font-size: 3rem; margin-bottom: 1rem; text-align: center;">👤</div>
      <h3>${staff.name}</h3>
      <p style="color: #999; margin-bottom: 0.5rem;">${staff.role}</p>
      <div style="margin-bottom: 1rem;">
        <p style="font-size: 0.9rem; margin-bottom: 0.25rem;">Shift: ${staff.shift}</p>
        <p style="font-size: 0.9rem;">Status: <span class="badge ${staff.status === 'On Duty' ? 'badge-success' : 'badge-warning'}">${staff.status}</span></p>
      </div>
      <button class="btn btn-outline w-full" onclick="editStaff('${staff.id}')">Edit</button>
    </div>
  `).join('');

  const addStaffForm = document.getElementById('add-staff-form');
  if (addStaffForm) {
    addStaffForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm('add-staff-form')) {
        showToast('Staff member added successfully!', 'success');
        addStaffForm.reset();
        closeModal('add-staff-modal');
      }
    });
  }
}

function editStaff(id) {
  openModal('add-staff-modal');
}

// ========== REPORTS PAGE ==========
function renderReportsPage() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  const salesTable = document.getElementById('sales-table');

  if (salesTable) {
    salesTable.innerHTML = (transactions.slice(0, 10)).map((trans, index) => `
      <tr>
        <td>#${1000 + index}</td>
        <td>${new Date(trans.date).toLocaleDateString()}</td>
        <td>${trans.items} items</td>
        <td>${formatCurrency(trans.amount)}</td>
        <td><span class="badge badge-success">${trans.method}</span></td>
      </tr>
    `).join('');
  }

  const dateRangeForm = document.getElementById('date-range-form');
  if (dateRangeForm) {
    dateRangeForm.addEventListener('submit', function (e) {
      e.preventDefault();
      showToast('Report generated successfully!', 'success');
    });
  }
}

// ========== EXPENSES PAGE ==========
function renderExpensesPage() {
  const expensesTable = document.getElementById('expenses-table');
  if (!expensesTable) return;

  expensesTable.innerHTML = state.expenses.map(expense => `
    <tr>
      <td>${expense.date}</td>
      <td>${expense.category}</td>
      <td>${expense.description}</td>
      <td>${formatCurrency(expense.amount)}</td>
      <td>
        <button class="btn btn-outline btn-small" onclick="editExpense('${expense.id}')">Edit</button>
        <button class="btn btn-danger btn-small" onclick="deleteExpense('${expense.id}')">Delete</button>
      </td>
    </tr>
  `).join('');

  const addExpenseForm = document.getElementById('add-expense-form');
  if (addExpenseForm) {
    addExpenseForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm('add-expense-form')) {
        showToast('Expense recorded successfully!', 'success');
        addExpenseForm.reset();
        closeModal('add-expense-modal');
      }
    });
  }
}

function editExpense(id) {
  openModal('add-expense-modal');
}

function deleteExpense(id) {
  if (confirm('Are you sure you want to delete this expense?')) {
    state.expenses = state.expenses.filter(e => e.id !== id);
    renderExpensesPage();
    showToast('Expense deleted!', 'success');
  }
}

// ========== SETTINGS PAGE ==========
function renderSettingsPage() {
  const currencySelect = document.getElementById('currency-select');
  const taxInput = document.getElementById('tax-rate');

  if (currencySelect) {
    currencySelect.value = state.selectedCurrency;
    currencySelect.addEventListener('change', function () {
      changeCurrency(this.value);
    });
  }

  if (taxInput) {
    taxInput.value = (state.taxRate * 100).toFixed(0);
    taxInput.addEventListener('change', function () {
      state.taxRate = parseFloat(this.value) / 100;
      localStorage.setItem('taxRate', state.taxRate);
      showToast('Tax rate updated!', 'success');
    });
  }

  const settingsForm = document.getElementById('settings-form');
  if (settingsForm) {
    settingsForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm('settings-form')) {
        showToast('Settings saved successfully!', 'success');
      }
    });
  }
}

// ========== DASHBOARD PAGE ==========
function renderDashboard() {
  const transactions = JSON.parse(localStorage.getItem('transactions') || '[]');
  
  // Calculate stats
  const totalRevenue = transactions.reduce((sum, t) => sum + t.amount, 0);
  const totalOrders = transactions.length;
  const occupiedTables = state.tables.filter(t => t.status === 'occupied').length;
  const lowStockItems = 3; // Simulated

  // Revenue cards
  const todayRevenue = transactions.filter(t => {
    const transDate = new Date(t.date).toDateString();
    const today = new Date().toDateString();
    return transDate === today;
  }).reduce((sum, t) => sum + t.amount, 0);

  const revenueTodayEl = document.querySelector('[data-revenue-today]');
  const revenueTotalEl = document.querySelector('[data-revenue-total]');
  const ordersEl = document.querySelector('[data-total-orders]');
  const tablesEl = document.querySelector('[data-active-tables]');

  if (revenueTodayEl) revenueTodayEl.textContent = formatCurrency(todayRevenue);
  if (revenueTotalEl) revenueTotalEl.textContent = formatCurrency(totalRevenue);
  if (ordersEl) ordersEl.textContent = totalOrders;
  if (tablesEl) tablesEl.textContent = occupiedTables;

  // Recent transactions
  const transactionsContainer = document.getElementById('recent-transactions');
  if (transactionsContainer) {
    transactionsContainer.innerHTML = transactions.slice(0, 5).map((trans, index) => `
      <tr>
        <td>#${1000 + index}</td>
        <td>${new Date(trans.date).toLocaleString()}</td>
        <td>${trans.items} items</td>
        <td>${formatCurrency(trans.amount)}</td>
      </tr>
    `).join('') || '<tr><td colspan="4" style="text-align: center;">No transactions yet</td></tr>';
  }

  // Best selling meals
  const bestSelling = document.getElementById('best-selling');
  if (bestSelling) {
    bestSelling.innerHTML = state.menuItems.slice(0, 4).map(item => `
      <div class="food-item">
        <img src="${item.image}" alt="${item.name}" class="food-image">
        <div class="food-details">
          <div class="food-name">${item.name}</div>
          <div class="food-category">${item.category}</div>
          <div class="food-price">${formatCurrency(item.price)}</div>
        </div>
      </div>
    `).join('');
  }
}

// ========== LOGIN PAGE SETUP ==========
function renderLoginSetup() {
  const loginForm = document.getElementById('login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (validateForm('login-form')) {
        const role = document.getElementById('role-select').value;
        state.currentUser.role = role;
        window.location.href = 'dashboard.html';
      }
    });
  }
}

// ========== UTILITY FUNCTIONS ==========
function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
