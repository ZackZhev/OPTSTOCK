/**
 * OPT STOCK - Админ панель
 * JavaScript функционал для управления
 */

document.addEventListener('DOMContentLoaded', async function() {
    // Проверка AdminAPI
    if (!window.AdminAPI) {
        console.error('AdminAPI не загружен!');
        return;
    }

    console.log('AdminAPI загружен успешно');

    // Проверка авторизации
    await checkAuth();

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

    console.log('🔐 Админ панель загружена');
});

// ==========================================
// АВТОРИЗАЦИЯ
// ==========================================
async function checkAuth() {
    const loginPage = document.getElementById('loginPage');
    const adminPanel = document.getElementById('adminPanel');

    try {
        const result = await AdminAPI.checkAuth();

        if (result.authenticated) {
            if (loginPage) loginPage.style.display = 'none';
            if (adminPanel) adminPanel.style.display = 'flex';
            updateCurrentUser(result.username);

            // Загрузка данных после успешной авторизации
            await loadDashboard();
            await loadProducts();
            await loadOrders();
            await loadSettings();
        } else {
            if (loginPage) loginPage.style.display = 'flex';
            if (adminPanel) adminPanel.style.display = 'none';
        }
    } catch (error) {
        console.error('Ошибка проверки авторизации:', error);
        if (loginPage) loginPage.style.display = 'flex';
        if (adminPanel) adminPanel.style.display = 'none';
    }
}

async function handleLogin(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const errorDiv = document.getElementById('loginError');

    console.log('Попытка входа:', username);

    try {
        const result = await AdminAPI.login(username, password);

        if (result.success) {
            console.log('Вход успешен');
            window.location.reload();
        } else {
            console.log('Неверные учетные данные');
            errorDiv.textContent = 'Неверный логин или пароль. Попробуйте: OPT2027 / POPT2027';
            errorDiv.style.display = 'block';
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        errorDiv.textContent = 'Ошибка сервера. Проверьте подключение.';
        errorDiv.style.display = 'block';
    }
}

async function handleLogout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        try {
            await AdminAPI.logout();
            window.location.reload();
        } catch (error) {
            console.error('Ошибка выхода:', error);
            window.location.reload();
        }
    }
}

function updateCurrentUser(username) {
    const userSpan = document.getElementById('currentUser');
    if (userSpan) {
        userSpan.textContent = username || 'Admin';
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
async function loadDashboard() {
    try {
        const stats = await AdminAPI.getStats();

        document.getElementById('totalProducts').textContent = stats.totalProducts || 0;
        document.getElementById('totalOrders').textContent = stats.totalOrders || 0;
        document.getElementById('totalVisitors').textContent = stats.totalVisitors || 0;
        document.getElementById('conversionRate').textContent = (stats.conversionRate || 0) + '%';

        // Загрузка последних заказов
        await loadRecentOrders();
    } catch (error) {
        console.error('Ошибка загрузки панели:', error);
    }
}

async function loadRecentOrders() {
    try {
        const allOrders = await AdminAPI.getOrders();
        const orders = allOrders.slice(0, 5);
        const ordersList = document.getElementById('recentOrdersList');

        if (!ordersList) return;

        ordersList.innerHTML = '';

        if (orders.length === 0) {
            ordersList.innerHTML = '<p style="text-align: center; color: #666;">Нет заказов</p>';
            return;
        }

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
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
    }
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
async function loadProducts() {
    try {
        const products = await AdminAPI.getProducts();
        const productsList = document.getElementById('productsList');

        if (!productsList) return;

        productsList.innerHTML = '';

        if (products.length === 0) {
            productsList.innerHTML = '<p style="text-align: center; color: #666;">Нет товаров. Добавьте первый товар!</p>';
            return;
        }

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
    } catch (error) {
        console.error('Ошибка загрузки товаров:', error);
    }
}

// ==========================================
// ЗАКАЗЫ
// ==========================================
async function loadOrders() {
    try {
        const orders = await AdminAPI.getOrders();
        const ordersList = document.getElementById('ordersList');

        if (!ordersList) return;

        ordersList.innerHTML = '';

        if (orders.length === 0) {
            ordersList.innerHTML = '<p style="text-align: center; color: #666;">Нет заказов</p>';
            return;
        }

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
    } catch (error) {
        console.error('Ошибка загрузки заказов:', error);
    }
}

// ==========================================
// НАСТРОЙКИ
// ==========================================
async function loadSettings() {
    try {
        const settings = await AdminAPI.getSettings();

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
    } catch (error) {
        console.error('Ошибка загрузки настроек:', error);
    }
}

const saveSettingsBtn = document.getElementById('saveSettingsBtn');
if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', async function() {
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

        try {
            await AdminAPI.updateSettings(settings);
            alert('Настройки сохранены! Обновите главную страницу для применения изменений.');
        } catch (error) {
            console.error('Ошибка сохранения настроек:', error);
            alert('Ошибка сохранения настроек. Проверьте подключение.');
        }
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

async function openProductModal(productId = null) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const form = document.getElementById('productForm');

    if (productId) {
        // Режим редактирования
        try {
            const product = await AdminAPI.getProduct(productId);
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
        } catch (error) {
            console.error('Ошибка загрузки товара:', error);
            alert('Ошибка загрузки товара');
            return;
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

async function saveProduct() {
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

    try {
        if (productId) {
            // Обновление существующего товара
            await AdminAPI.updateProduct(productId, productData);
        } else {
            // Добавление нового товара
            await AdminAPI.addProduct(productData);
        }

        closeProductModal();
        await loadProducts();
        alert('Товар сохранен!');
    } catch (error) {
        console.error('Ошибка сохранения товара:', error);
        alert('Ошибка сохранения товара. Проверьте подключение.');
    }
}

// Глобальные функции для кнопок (вызываются через onclick)
window.editProduct = function(productId) {
    openProductModal(productId);
};

window.deleteProduct = async function(productId) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        try {
            await AdminAPI.deleteProduct(productId);
            await loadProducts();
            alert('Товар удален!');
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            alert('Ошибка удаления товара. Проверьте подключение.');
        }
    }
};

console.log('✅ Admin panel loaded');
