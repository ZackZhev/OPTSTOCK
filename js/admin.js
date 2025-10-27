/**
 * OPT STOCK - Админ панель
 * JavaScript функционал для управления
 */

document.addEventListener('DOMContentLoaded', function() {
    // Проверка DataManager
    if (!window.DataManager) {
        console.error('DataManager не загружен!');
        return;
    }

    console.log('DataManager загружен успешно');

    // Проверка авторизации
    checkAuth();

    // Обработчик формы входа
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Обработчик выхода
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // Навигация по вкладкам
    initTabNavigation();

    // Инициализация модального окна товаров
    initProductModal();

    // Загрузка данных
    if (DataManager && DataManager.isLoggedIn()) {
        loadDashboard();
        loadProducts();
        loadOrders();
        loadSettings();
    }

    console.log('🔐 Админ панель загружена');
});

// ==========================================
// АВТОРИЗАЦИЯ
// ==========================================
function checkAuth() {
    const loginPage = document.getElementById('loginPage');
    const adminPanel = document.getElementById('adminPanel');

    if (!DataManager) {
        console.error('DataManager не загружен');
        return;
    }

    if (DataManager.isLoggedIn()) {
        if (loginPage) loginPage.style.display = 'none';
        if (adminPanel) adminPanel.style.display = 'flex';
        updateCurrentUser();
    } else {
        if (loginPage) loginPage.style.display = 'flex';
        if (adminPanel) adminPanel.style.display = 'none';
    }
}

function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    console.log('Попытка входа:', username);

    // Проверка наличия auth данных
    const authData = DataManager.getData(DataManager.KEYS.AUTH);
    console.log('Auth данные:', authData);

    if (DataManager.login(username, password)) {
        console.log('Вход успешен');
        window.location.reload();
    } else {
        console.log('Неверные учетные данные');
        errorDiv.textContent = 'Неверный логин или пароль. Попробуйте: admin / admin123';
        errorDiv.style.display = 'block';
    }
}

function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        DataManager.logout();
        window.location.reload();
    }
}

function updateCurrentUser() {
    const userSpan = document.getElementById('currentUser');
    if (userSpan) {
        userSpan.textContent = DataManager.getCurrentUser();
    }
}

// ==========================================
// НАВИГАЦИЯ
// ==========================================
function initTabNavigation() {
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            switchTab(tabName);
        });
    });
}

function switchTab(tabName) {
    // Скрыть все вкладки
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Деактивировать все кнопки навигации
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // Показать выбранную вкладку
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Активировать кнопку
    const selectedNav = document.querySelector(`[data-tab="${tabName}"]`);
    if (selectedNav) {
        selectedNav.classList.add('active');
    }
}

// ==========================================
// DASHBOARD
// ==========================================
function loadDashboard() {
    const stats = DataManager.getStats();

    document.getElementById('totalProducts').textContent = stats.totalProducts;
    document.getElementById('totalOrders').textContent = stats.totalOrders;
    document.getElementById('totalVisitors').textContent = stats.totalVisitors;
    document.getElementById('conversionRate').textContent = stats.conversionRate + '%';

    // Загрузка последних заказов
    loadRecentOrders();
}

function loadRecentOrders() {
    const orders = DataManager.getOrders().slice(0, 5);
    const ordersList = document.getElementById('recentOrdersList');

    if (!ordersList) return;

    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <div>
                <strong>${order.customerName}</strong>
                <p>${order.products.join(', ')}</p>
            </div>
            <div>
                <span class="order-status status-${order.status}">${getStatusText(order.status)}</span>
                <p>${order.total} сом</p>
            </div>
        `;
        ordersList.appendChild(orderDiv);
    });
}

function getStatusText(status) {
    const statusMap = {
        'pending': 'В ожидании',
        'processing': 'В обработке',
        'completed': 'Завершен'
    };
    return statusMap[status] || status;
}

// ==========================================
// ТОВАРЫ
// ==========================================
function loadProducts() {
    const products = DataManager.getProducts();
    const productsList = document.getElementById('productsList');

    if (!productsList) return;

    productsList.innerHTML = '';

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-card';
        productDiv.innerHTML = `
            <div class="product-info">
                <div class="product-icon-display">${product.icon}</div>
                <div>
                    <h4>${product.name}</h4>
                    <p>${product.description}</p>
                    ${product.price > 0 ? `<strong>${product.price} сом</strong>` : ''}
                </div>
            </div>
            <div class="product-actions">
                <button class="btn-edit" onclick="editProduct('${product.id}')">✏️ Изменить</button>
                <button class="btn-delete" onclick="deleteProduct('${product.id}')">🗑️ Удалить</button>
            </div>
        `;
        productsList.appendChild(productDiv);
    });
}

// ==========================================
// ЗАКАЗЫ
// ==========================================
function loadOrders() {
    const orders = DataManager.getOrders();
    const ordersList = document.getElementById('ordersList');

    if (!ordersList) return;

    ordersList.innerHTML = '';

    orders.forEach(order => {
        const orderDiv = document.createElement('div');
        orderDiv.className = 'order-item';
        orderDiv.innerHTML = `
            <div class="order-header">
                <span class="order-number">Заказ #${order.id.slice(0, 8)}</span>
                <span class="order-status ${order.status}">${getStatusText(order.status)}</span>
            </div>
            <p><strong>Клиент:</strong> ${order.customerName} (${order.customerPhone})</p>
            <p><strong>Товары:</strong> ${order.products.join(', ')}</p>
            <p><strong>Сумма:</strong> ${order.total} сом</p>
            <p><strong>Дата:</strong> ${new Date(order.createdAt).toLocaleString('ru-RU')}</p>
        `;
        ordersList.appendChild(orderDiv);
    });
}

// ==========================================
// НАСТРОЙКИ
// ==========================================
function loadSettings() {
    const settings = DataManager.getSettings();

    document.getElementById('siteName').value = settings.siteName || '';
    document.getElementById('siteDescription').value = settings.siteDescription || '';
    document.getElementById('workingHours').value = settings.workingHours || '';
    document.getElementById('whatsappNumber').value = settings.whatsappNumber || '';
    document.getElementById('instagramHandle').value = settings.instagramHandle || '';
    document.getElementById('tiktokHandle').value = settings.tiktokHandle || '';
    document.getElementById('dgisLink').value = settings.dgisLink || '';

    // Загрузка настройки сердечек
    const heartsCheckbox = document.getElementById('heartsEnabled');
    if (heartsCheckbox) {
        heartsCheckbox.checked = settings.heartsEnabled !== false;
    }
}

const saveSettingsBtn = document.getElementById('saveSettingsBtn');
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', function() {
        const settings = {
            siteName: document.getElementById('siteName').value,
            siteDescription: document.getElementById('siteDescription').value,
            workingHours: document.getElementById('workingHours').value,
            whatsappNumber: document.getElementById('whatsappNumber').value,
            instagramHandle: document.getElementById('instagramHandle').value,
            tiktokHandle: document.getElementById('tiktokHandle').value,
            dgisLink: document.getElementById('dgisLink').value,
            heartsEnabled: document.getElementById('heartsEnabled')?.checked ?? true
        };

        DataManager.updateSettings(settings);
        alert('Настройки сохранены! Обновите главную страницу для применения изменений.');
    });
}

// ==========================================
// МОДАЛЬНОЕ ОКНО ТОВАРОВ
// ==========================================
function initProductModal() {
    const modal = document.getElementById('productModal');
    const addProductBtn = document.getElementById('addProductBtn');
    const saveProductBtn = document.getElementById('saveProductBtn');
    const closeBtns = document.querySelectorAll('.modal-close');

    if (addProductBtn) {
        addProductBtn.addEventListener('click', () => openProductModal());
    }

    if (saveProductBtn) {
        saveProductBtn.addEventListener('click', saveProduct);
    }

    closeBtns.forEach(btn => {
        btn.addEventListener('click', closeProductModal);
    });

    // Закрытие по клику вне модального окна
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeProductModal();
        }
    });
}

function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');

    if (productId) {
        // Режим редактирования
        const product = DataManager.getProduct(productId);
        if (product) {
            modalTitle.textContent = 'Редактировать товар';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productIcon').value = product.icon;
            document.getElementById('productPrice').value = product.price || '';
            document.getElementById('productVisible').checked = product.visible !== false;
        }
    } else {
        // Режим добавления
        modalTitle.textContent = 'Добавить товар';
        form.reset();
        document.getElementById('productId').value = '';
        document.getElementById('productVisible').checked = true;
    }

    modal.style.display = 'flex';
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.style.display = 'none';
}

function saveProduct() {
    const productId = document.getElementById('productId').value;
    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        description: document.getElementById('productDescription').value,
        icon: document.getElementById('productIcon').value || '💄',
        price: parseFloat(document.getElementById('productPrice').value) || 0,
        visible: document.getElementById('productVisible').checked
    };

    if (!productData.name || !productData.category || !productData.description) {
        alert('Пожалуйста, заполните все обязательные поля');
        return;
    }

    if (productId) {
        // Обновление существующего товара
        DataManager.updateProduct(productId, productData);
    } else {
        // Добавление нового товара
        DataManager.addProduct(productData);
    }

    closeProductModal();
    loadProducts();
    alert('Товар сохранен!');
}

// Глобальные функции для кнопок (вызываются через onclick)
window.editProduct = function(productId) {
    openProductModal(productId);
};

window.deleteProduct = function(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        DataManager.deleteProduct(productId);
        loadProducts();
        alert('Товар удален!');
    }
};

console.log('✅ Admin panel loaded');
