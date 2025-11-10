// Admin Panel JavaScript

// Check authentication on page load
document.addEventListener('DOMContentLoaded', function() {
    if (DataManager.isLoggedIn()) {
        showDashboard();
        initializeAdmin();
    } else {
        showLogin();
    }
});

// Login Form Handler
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        const errorMessage = document.getElementById('loginError');

        if (DataManager.login(username, password)) {
            showDashboard();
            initializeAdmin();
            showToast('Добро пожаловать!', 'success');
        } else {
            errorMessage.textContent = 'Неверное имя пользователя или пароль';
            errorMessage.classList.add('show');
        }
    });
}

// Logout Handler
const logoutBtn = document.getElementById('logoutBtn');
if (logoutBtn) {
    logoutBtn.addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите выйти?')) {
            DataManager.logout();
            showLogin();
            showToast('Вы вышли из системы', 'info');
        }
    });
}

// Show/Hide Screens
function showLogin() {
    document.getElementById('loginScreen').style.display = 'flex';
    document.getElementById('adminDashboard').style.display = 'none';
}

function showDashboard() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('adminDashboard').style.display = 'flex';
}

// Initialize Admin Panel
function initializeAdmin() {
    // Set current user
    const currentUser = DataManager.getCurrentUser();
    document.getElementById('currentUser').textContent = `Привет, ${currentUser}`;

    // Load dashboard stats
    loadDashboardStats();

    // Setup navigation
    setupNavigation();

    // Setup product management
    setupProductManagement();

    // Setup order management
    setupOrderManagement();

    // Setup settings
    setupSettings();

    // Setup analytics
    setupAnalytics();

    // Setup data management
    setupDataManagement();
}

// Navigation
function setupNavigation() {
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.getAttribute('data-section');

            // Update active nav item
            navItems.forEach(nav => nav.classList.remove('active'));
            this.classList.add('active');

            // Update active section
            const sections = document.querySelectorAll('.content-section');
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(section).classList.add('active');

            // Update section title
            const titles = {
                'dashboard': 'Панель управления',
                'products': 'Товары',
                'orders': 'Заказы',
                'settings': 'Настройки',
                'analytics': 'Аналитика',
                'data': 'Экспорт/Импорт'
            };
            document.getElementById('sectionTitle').textContent = titles[section];

            // Load section data
            if (section === 'dashboard') loadDashboardStats();
            if (section === 'products') loadProducts();
            if (section === 'orders') loadOrders();
            if (section === 'settings') loadSettings();
            if (section === 'analytics') loadAnalytics();
        });
    });
}

// Dashboard Stats
function loadDashboardStats() {
    const products = DataManager.getProducts();
    const orders = DataManager.getOrders();
    const detailedStats = DataManager.getDetailedStats();

    // Update stat cards with new detailed stats
    document.getElementById('statsProducts').textContent = products.length;
    document.getElementById('statsOrders').textContent = orders.length;
    document.getElementById('statsVisitors').textContent = detailedStats.uniqueSessions;
    document.getElementById('statsClicks').textContent = detailedStats.totalButtonClicks;

    // Load recent orders
    loadRecentOrders();

    // Load popular categories
    loadPopularCategories();
}

function loadRecentOrders() {
    const orders = DataManager.getOrders().slice(-5).reverse();
    const container = document.getElementById('recentOrders');

    if (orders.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light); padding: 1rem;">Нет заказов</p>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-item">
            <div class="order-info">
                <h4>${order.customerName}</h4>
                <p>${order.customerPhone} • ${new Date(order.createdAt).toLocaleString('ru-RU')}</p>
            </div>
            <span class="order-status status-${order.status}">
                ${getStatusText(order.status)}
            </span>
        </div>
    `).join('');
}

function loadPopularCategories() {
    const products = DataManager.getProducts();
    const categories = {
        'makeup': { icon: '💄', name: 'Макияж', count: 0 },
        'skincare': { icon: '✨', name: 'Уход за кожей', count: 0 },
        'cleansing': { icon: '🧼', name: 'Очищение', count: 0 },
        'nails': { icon: '💅', name: 'Маникюр', count: 0 },
        'perfume': { icon: '🌸', name: 'Парфюмерия', count: 0 },
        'haircare': { icon: '💇', name: 'Уход за волосами', count: 0 }
    };

    products.forEach(product => {
        if (categories[product.category]) {
            categories[product.category].count++;
        }
    });

    const maxCount = Math.max(...Object.values(categories).map(cat => cat.count), 1);
    const container = document.getElementById('popularCategories');

    container.innerHTML = Object.entries(categories).map(([key, cat]) => `
        <div class="category-item">
            <div class="category-info">
                <span class="category-icon">${cat.icon}</span>
                <span>${cat.name}</span>
            </div>
            <div class="category-bar">
                <div class="category-progress" style="width: ${(cat.count / maxCount) * 100}%"></div>
            </div>
            <span class="category-count">${cat.count}</span>
        </div>
    `).join('');
}

// Product Management
function setupProductManagement() {
    // Add product button
    document.getElementById('addProductBtn').addEventListener('click', function() {
        openProductModal();
    });

    // Product form
    document.getElementById('productForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveProduct();
    });

    // Modal close buttons
    document.querySelectorAll('.modal-close').forEach(btn => {
        btn.addEventListener('click', function() {
            closeProductModal();
        });
    });

    // Load products
    loadProducts();
}

function loadProducts() {
    const products = DataManager.getProducts();
    const container = document.getElementById('productsGrid');

    if (products.length === 0) {
        container.innerHTML = '<p style="color: var(--text-light);">Нет товаров. Нажмите "+ Добавить товар" для создания.</p>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card">
            <img src="${product.image || 'images/placeholder.jpg'}"
                 alt="${product.name}"
                 class="product-image"
                 onerror="this.src='images/placeholder.jpg'">
            <div class="product-content">
                <div class="product-header">
                    <h3 class="product-title">${product.name}</h3>
                    <span class="product-icon">${product.icon || '📦'}</span>
                </div>
                <span class="product-category">${getCategoryName(product.category)}</span>
                <p class="product-description">${product.description || 'Нет описания'}</p>
                <p class="product-price">${product.price > 0 ? product.price + ' сом' : 'Цена не указана'}</p>
                <div class="product-visibility">
                    <span class="visibility-badge ${product.visible ? 'visible' : 'hidden'}">
                        ${product.visible ? '👁️ Видимый' : '🙈 Скрытый'}
                    </span>
                </div>
                <div class="product-actions">
                    <button class="btn-small btn-edit" onclick="editProduct('${product.id}')">
                        Редактировать
                    </button>
                    <button class="btn-small btn-delete" onclick="deleteProduct('${product.id}')">
                        Удалить
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    const title = document.getElementById('modalTitle');

    form.reset();

    if (productId) {
        const product = DataManager.getProducts().find(p => p.id === productId);
        if (product) {
            title.textContent = 'Редактировать товар';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description || '';
            document.getElementById('productPrice').value = product.price || 0;
            document.getElementById('productIcon').value = product.icon || '';
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productVisible').checked = product.visible !== false;
        }
    } else {
        title.textContent = 'Добавить товар';
        document.getElementById('productVisible').checked = true;
    }

    modal.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
}

function saveProduct() {
    const id = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        icon: document.getElementById('productIcon').value || '📦',
        image: document.getElementById('productImage').value || 'images/placeholder.jpg',
        visible: document.getElementById('productVisible').checked
    };

    if (id) {
        // Update existing product
        DataManager.updateProduct(id, productData);
        showToast('Товар обновлен', 'success');
    } else {
        // Add new product
        DataManager.addProduct(productData);
        showToast('Товар добавлен', 'success');
    }

    closeProductModal();
    loadProducts();
    loadDashboardStats();
}

function editProduct(id) {
    openProductModal(id);
}

function deleteProduct(id) {
    const product = DataManager.getProducts().find(p => p.id === id);
    if (confirm(`Вы уверены, что хотите удалить товар "${product.name}"?`)) {
        DataManager.deleteProduct(id);
        showToast('Товар удален', 'success');
        loadProducts();
        loadDashboardStats();
    }
}

function getCategoryName(category) {
    const categories = {
        'makeup': '💄 Макияж',
        'skincare': '✨ Уход за кожей',
        'cleansing': '🧼 Очищение',
        'nails': '💅 Маникюр',
        'perfume': '🌸 Парфюмерия',
        'haircare': '💇 Уход за волосами'
    };
    return categories[category] || category;
}

// Order Management
function setupOrderManagement() {
    loadOrders();
}

function loadOrders() {
    const orders = DataManager.getOrders();
    const container = document.getElementById('ordersTable');

    if (orders.length === 0) {
        container.innerHTML = '<p style="padding: 2rem; text-align: center; color: var(--text-light);">Нет заказов</p>';
        return;
    }

    container.innerHTML = `
        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Клиент</th>
                        <th>Телефон</th>
                        <th>Товары</th>
                        <th>Дата</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    ${orders.map(order => `
                        <tr>
                            <td><strong>#${order.id.slice(0, 8)}</strong></td>
                            <td>${order.customerName}</td>
                            <td>${order.customerPhone}</td>
                            <td>${order.products ? order.products.join(', ') : 'Н/Д'}</td>
                            <td>${new Date(order.createdAt).toLocaleString('ru-RU')}</td>
                            <td>
                                <span class="order-status status-${order.status}">
                                    ${getStatusText(order.status)}
                                </span>
                            </td>
                            <td>
                                <div class="table-actions">
                                    <select onchange="changeOrderStatus('${order.id}', this.value)"
                                            style="padding: 0.5rem; border: 1px solid var(--border); border-radius: 0.25rem; font-size: 0.875rem;">
                                        <option value="">Изменить статус</option>
                                        <option value="pending">В ожидании</option>
                                        <option value="processing">В обработке</option>
                                        <option value="completed">Завершен</option>
                                    </select>
                                    <button class="btn-small btn-delete" onclick="deleteOrder('${order.id}')">
                                        Удалить
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;
}

function changeOrderStatus(orderId, newStatus) {
    if (!newStatus) return;
    DataManager.updateOrderStatus(orderId, newStatus);
    showToast('Статус заказа обновлен', 'success');
    loadOrders();
    loadDashboardStats();
}

function deleteOrder(id) {
    if (confirm('Вы уверены, что хотите удалить этот заказ?')) {
        DataManager.deleteOrder(id);
        showToast('Заказ удален', 'success');
        loadOrders();
        loadDashboardStats();
    }
}

function getStatusText(status) {
    const statuses = {
        'pending': 'В ожидании',
        'processing': 'В обработке',
        'completed': 'Завершен'
    };
    return statuses[status] || status;
}

// Settings Management
function setupSettings() {
    // Settings form
    document.getElementById('settingsForm').addEventListener('submit', function(e) {
        e.preventDefault();
        saveSettings();
    });

    // Password form
    document.getElementById('passwordForm').addEventListener('submit', function(e) {
        e.preventDefault();
        changePassword();
    });

    loadSettings();
}

function loadSettings() {
    const settings = DataManager.getSettings();
    document.getElementById('siteName').value = settings.siteName || '';
    document.getElementById('siteDescription').value = settings.siteDescription || '';
    document.getElementById('workingHours').value = settings.workingHours || '';
    document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
    document.getElementById('instagramHandle').value = settings.instagramHandle || '';
    document.getElementById('tiktokHandle').value = settings.tiktokHandle || '';
    document.getElementById('heartsEnabled').checked = settings.heartsEnabled !== false;
}

function saveSettings() {
    const settings = {
        siteName: document.getElementById('siteName').value,
        siteDescription: document.getElementById('siteDescription').value,
        workingHours: document.getElementById('workingHours').value,
        whatsappNumber: document.getElementById('whatsappNumber').value,
        instagramHandle: document.getElementById('instagramHandle').value,
        tiktokHandle: document.getElementById('tiktokHandle').value,
        heartsEnabled: document.getElementById('heartsEnabled').checked
    };

    DataManager.updateSettings(settings);
    showToast('Настройки сохранены', 'success');
}

function changePassword() {
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Verify current password
    const auth = DataManager.getData('AUTH');
    if (!auth || auth.password !== currentPassword) {
        showToast('Неверный текущий пароль', 'error');
        return;
    }

    // Check if new passwords match
    if (newPassword !== confirmPassword) {
        showToast('Пароли не совпадают', 'error');
        return;
    }

    // Check password length
    if (newPassword.length < 6) {
        showToast('Пароль должен быть не менее 6 символов', 'error');
        return;
    }

    // Change password
    DataManager.changePassword(newPassword);
    showToast('Пароль успешно изменен', 'success');
    document.getElementById('passwordForm').reset();
}

// Analytics
function setupAnalytics() {
    loadAnalytics();
}

function loadAnalytics() {
    const detailedStats = DataManager.getDetailedStats();

    // Основная статистика
    document.getElementById('totalPageViews').textContent = detailedStats.totalPageViews;
    document.getElementById('totalProductViews').textContent = detailedStats.totalProductViews;
    document.getElementById('totalButtonClicks').textContent = detailedStats.totalButtonClicks;
    document.getElementById('conversionRate').textContent = detailedStats.conversionRate;

    // Популярные товары
    const popularProductsContainer = document.getElementById('popularProducts');
    if (detailedStats.popularProducts.length === 0) {
        popularProductsContainer.innerHTML = '<p style="padding: 1rem; color: var(--text-light);">Нет данных</p>';
    } else {
        popularProductsContainer.innerHTML = detailedStats.popularProducts.map((product, index) => `
            <div class="analytics-item">
                <div>
                    <span class="analytics-label">${index + 1}. ${product.name}</span>
                </div>
                <span class="analytics-value">${product.views} 👁️</span>
            </div>
        `).join('');
    }

    // Клики по кнопкам
    const clicksContainer = document.getElementById('clicksAnalytics');
    if (detailedStats.topButtons.length === 0) {
        clicksContainer.innerHTML = '<p style="padding: 1rem; color: var(--text-light);">Нет данных о кликах</p>';
    } else {
        clicksContainer.innerHTML = detailedStats.topButtons.map(button => `
            <div class="analytics-item">
                <span class="analytics-label">${button.name}</span>
                <span class="analytics-value">${button.count}</span>
            </div>
        `).join('');
    }

    // Активность по часам
    renderHourlyActivity(detailedStats.activityByHour);

    // История посещений с фильтром по сессиям
    const visitors = DataManager.getData(DataManager.KEYS.VISITORS) || [];
    const uniqueSessions = DataManager.getUniqueSessions();

    // Заполняем фильтр сессиями
    const sessionFilter = document.getElementById('sessionFilter');
    sessionFilter.innerHTML = '<option value="all">Все сессии</option>' +
        uniqueSessions.map(sessionId => `
            <option value="${sessionId}">Сессия ${sessionId.substring(0, 8)}...</option>
        `).join('');

    document.getElementById('sessionCount').textContent = `Всего сессий: ${uniqueSessions.length}`;

    // Обработчик фильтра
    sessionFilter.addEventListener('change', function() {
        const selectedSession = this.value;
        loadVisitorsBySession(selectedSession);
    });

    loadVisitorsBySession('all');

    // Действия пользователей
    loadUserActions();

    // Просмотры страниц
    loadPageViews();

    // Статистика за период
    const stats24h = detailedStats.timeBasedStats.last24h;
    document.getElementById('period24hViews').textContent = stats24h.totalViews;
    document.getElementById('period24hVisitors').textContent = stats24h.totalVisitors;
    document.getElementById('period24hSessions').textContent = stats24h.uniqueSessions;
}

function renderHourlyActivity(activityByHour) {
    const container = document.getElementById('hourlyActivity');
    const maxActivity = Math.max(...activityByHour, 1);

    const chartHTML = `
        <div class="chart-bar">
            ${activityByHour.map((count, hour) => {
                const height = (count / maxActivity) * 100;
                return `
                    <div class="bar-item">
                        <div class="bar" style="height: ${height}%">
                            ${count > 0 ? `<span class="bar-value">${count}</span>` : ''}
                        </div>
                        <span class="bar-label">${hour}:00</span>
                    </div>
                `;
            }).join('')}
        </div>
    `;

    container.innerHTML = chartHTML;
}

function loadVisitorsBySession(sessionId) {
    const visitors = DataManager.getData(DataManager.KEYS.VISITORS) || [];
    const filteredVisitors = sessionId === 'all'
        ? visitors
        : visitors.filter(v => v.sessionId === sessionId);

    const visitorsContainer = document.getElementById('visitorsAnalytics');

    if (filteredVisitors.length === 0) {
        visitorsContainer.innerHTML = '<p style="padding: 1rem; color: var(--text-light);">Нет данных о посетителях</p>';
    } else {
        visitorsContainer.innerHTML = filteredVisitors.slice(-20).reverse().map(visitor => `
            <div class="analytics-item">
                <div style="flex: 1;">
                    <div class="analytics-label">
                        <span class="action-badge visit">Посещение</span>
                        ${new Date(visitor.timestamp).toLocaleString('ru-RU')}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem;">
                        Сессия: ${visitor.sessionId ? visitor.sessionId.substring(0, 12) + '...' : 'N/A'}<br>
                        ${visitor.url || 'N/A'}<br>
                        ${visitor.screenResolution || 'N/A'} • ${visitor.language || 'N/A'}
                    </div>
                </div>
            </div>
        `).join('');
    }
}

function loadUserActions() {
    const actions = DataManager.getUserActions();
    const container = document.getElementById('userActions');

    if (actions.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: var(--text-light);">Нет данных о действиях</p>';
        return;
    }

    container.innerHTML = actions.slice(-30).reverse().map(action => {
        const badgeClass = action.actionType.includes('Просмотр') ? 'view'
                         : action.actionType.includes('Клик') ? 'click'
                         : 'visit';

        return `
            <div class="analytics-item">
                <div style="flex: 1;">
                    <div class="analytics-label">
                        <span class="action-badge ${badgeClass}">${action.actionType}</span>
                        ${new Date(action.timestamp).toLocaleString('ru-RU')}
                    </div>
                    <div style="font-size: 0.75rem; color: var(--text-light); margin-top: 0.25rem;">
                        ${action.data.productName ? `Товар: ${action.data.productName}` : ''}
                        ${action.data.buttonName ? `Кнопка: ${action.data.buttonName}` : ''}
                        ${action.data.pageName ? `Страница: ${action.data.pageName}` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function loadPageViews() {
    const pageViews = DataManager.getPageViews();
    const container = document.getElementById('pageViewsAnalytics');

    if (pageViews.length === 0) {
        container.innerHTML = '<p style="padding: 1rem; color: var(--text-light);">Нет данных о просмотрах</p>';
        return;
    }

    // Группируем по страницам
    const pageStats = {};
    pageViews.forEach(view => {
        if (!pageStats[view.pageName]) {
            pageStats[view.pageName] = 0;
        }
        pageStats[view.pageName]++;
    });

    const sortedPages = Object.entries(pageStats)
        .sort((a, b) => b[1] - a[1]);

    container.innerHTML = sortedPages.map(([page, count]) => `
        <div class="analytics-item">
            <span class="analytics-label">${page}</span>
            <span class="analytics-value">${count}</span>
        </div>
    `).join('');
}

// Data Management
function setupDataManagement() {
    // Export data
    document.getElementById('exportDataBtn').addEventListener('click', function() {
        const data = DataManager.exportData();
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `optstock-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        showToast('Данные экспортированы', 'success');
    });

    // Import data
    document.getElementById('importDataBtn').addEventListener('click', function() {
        document.getElementById('importFileInput').click();
    });

    document.getElementById('importFileInput').addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = function(event) {
            try {
                const result = DataManager.importData(event.target.result);
                if (result.success) {
                    showToast('Данные импортированы успешно', 'success');
                    location.reload();
                } else {
                    showToast('Ошибка импорта: ' + result.message, 'error');
                }
            } catch (error) {
                showToast('Ошибка при чтении файла', 'error');
            }
        };
        reader.readAsText(file);
    });

    // Clear data
    document.getElementById('clearDataBtn').addEventListener('click', function() {
        if (confirm('⚠️ ВНИМАНИЕ! Это действие удалит ВСЕ данные безвозвратно!\n\nВы уверены, что хотите продолжить?')) {
            if (confirm('Последнее предупреждение! Все данные будут удалены. Продолжить?')) {
                DataManager.clearAll();
                showToast('Все данные удалены', 'info');
                setTimeout(() => {
                    location.reload();
                }, 1500);
            }
        }
    });
}

// Toast Notification
function showToast(message, type = 'info') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type}`;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Global functions for inline event handlers
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.changeOrderStatus = changeOrderStatus;
window.deleteOrder = deleteOrder;
