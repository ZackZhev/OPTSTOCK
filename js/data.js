/**
 * OPT STOCK - Модуль работы с данными
 * Управление данными через LocalStorage
 */

const DataManager = {
    // Ключи для LocalStorage
    KEYS: {
        AUTH: 'optstock_auth',
        PRODUCTS: 'optstock_products',
        ORDERS: 'optstock_orders',
        IMAGES: 'optstock_images',
        SETTINGS: 'optstock_settings',
        ANALYTICS: 'optstock_analytics',
        VISITORS: 'optstock_visitors',
        PAGE_VIEWS: 'optstock_page_views',
        PRODUCT_VIEWS: 'optstock_product_views',
        BUTTON_CLICKS: 'optstock_button_clicks',
        USER_ACTIONS: 'optstock_user_actions'
    },

    // ==========================================
    // ИНИЦИАЛИЗАЦИЯ
    // ==========================================
    init() {
        // Инициализация базовых данных если их нет
        if (!this.getData(this.KEYS.AUTH)) {
            this.setData(this.KEYS.AUTH, {
                username: 'admin-optstock$$$',
                password: 'pass-optstock$$$', // В реальном проекте использовать хеширование!
                isLoggedIn: false,
                lastLogin: null
            });
        }

        if (!this.getData(this.KEYS.PRODUCTS)) {
            this.setData(this.KEYS.PRODUCTS, this.getDefaultProducts());
        }

        if (!this.getData(this.KEYS.ORDERS)) {
            this.setData(this.KEYS.ORDERS, this.getDefaultOrders());
        }

        if (!this.getData(this.KEYS.IMAGES)) {
            this.setData(this.KEYS.IMAGES, []);
        }

        if (!this.getData(this.KEYS.SETTINGS)) {
            this.setData(this.KEYS.SETTINGS, this.getDefaultSettings());
        }

        if (!this.getData(this.KEYS.ANALYTICS)) {
            this.setData(this.KEYS.ANALYTICS, this.getDefaultAnalytics());
        }

        if (!this.getData(this.KEYS.VISITORS)) {
            this.setData(this.KEYS.VISITORS, []);
        }

        if (!this.getData(this.KEYS.PAGE_VIEWS)) {
            this.setData(this.KEYS.PAGE_VIEWS, []);
        }

        if (!this.getData(this.KEYS.PRODUCT_VIEWS)) {
            this.setData(this.KEYS.PRODUCT_VIEWS, []);
        }

        if (!this.getData(this.KEYS.BUTTON_CLICKS)) {
            this.setData(this.KEYS.BUTTON_CLICKS, []);
        }

        if (!this.getData(this.KEYS.USER_ACTIONS)) {
            this.setData(this.KEYS.USER_ACTIONS, []);
        }
    },

    // ==========================================
    // БАЗОВЫЕ МЕТОДЫ РАБОТЫ С LOCALSTORAGE
    // ==========================================
    getData(key) {
        try {
            const data = localStorage.getItem(key);
            return data ? JSON.parse(data) : null;
        } catch (error) {
            console.error('Ошибка чтения данных:', error);
            return null;
        }
    },

    setData(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Ошибка записи данных:', error);
            return false;
        }
    },

    removeData(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Ошибка удаления данных:', error);
            return false;
        }
    },

    clearAll() {
        Object.values(this.KEYS).forEach(key => {
            this.removeData(key);
        });
        this.init();
    },

    // ==========================================
    // АВТОРИЗАЦИЯ
    // ==========================================
    login(username, password) {
        const auth = this.getData(this.KEYS.AUTH);
        if (auth.username === username && auth.password === password) {
            auth.isLoggedIn = true;
            auth.lastLogin = new Date().toISOString();
            this.setData(this.KEYS.AUTH, auth);
            return true;
        }
        return false;
    },

    logout() {
        const auth = this.getData(this.KEYS.AUTH);
        auth.isLoggedIn = false;
        this.setData(this.KEYS.AUTH, auth);
    },

    isLoggedIn() {
        const auth = this.getData(this.KEYS.AUTH);
        return auth && auth.isLoggedIn;
    },

    changePassword(newPassword) {
        const auth = this.getData(this.KEYS.AUTH);
        auth.password = newPassword;
        return this.setData(this.KEYS.AUTH, auth);
    },

    getCurrentUser() {
        const auth = this.getData(this.KEYS.AUTH);
        return auth ? auth.username : null;
    },

    // ==========================================
    // ТОВАРЫ
    // ==========================================
    getProducts() {
        return this.getData(this.KEYS.PRODUCTS) || [];
    },

    getProduct(id) {
        const products = this.getProducts();
        return products.find(p => p.id === id);
    },

    addProduct(product) {
        const products = this.getProducts();
        const newProduct = {
            id: this.generateId(),
            ...product,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        products.push(newProduct);
        this.setData(this.KEYS.PRODUCTS, products);
        return newProduct;
    },

    updateProduct(id, updates) {
        const products = this.getProducts();
        const index = products.findIndex(p => p.id === id);
        if (index !== -1) {
            products[index] = {
                ...products[index],
                ...updates,
                updatedAt: new Date().toISOString()
            };
            this.setData(this.KEYS.PRODUCTS, products);
            return products[index];
        }
        return null;
    },

    deleteProduct(id) {
        const products = this.getProducts();
        const filtered = products.filter(p => p.id !== id);
        return this.setData(this.KEYS.PRODUCTS, filtered);
    },

    // ==========================================
    // ЗАКАЗЫ
    // ==========================================
    getOrders() {
        return this.getData(this.KEYS.ORDERS) || [];
    },

    getOrder(id) {
        const orders = this.getOrders();
        return orders.find(o => o.id === id);
    },

    addOrder(order) {
        const orders = this.getOrders();
        const newOrder = {
            id: this.generateId(),
            ...order,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        orders.unshift(newOrder); // Новые заказы в начало
        this.setData(this.KEYS.ORDERS, orders);
        return newOrder;
    },

    updateOrderStatus(id, status) {
        const orders = this.getOrders();
        const index = orders.findIndex(o => o.id === id);
        if (index !== -1) {
            orders[index].status = status;
            orders[index].updatedAt = new Date().toISOString();
            this.setData(this.KEYS.ORDERS, orders);
            return orders[index];
        }
        return null;
    },

    deleteOrder(id) {
        const orders = this.getOrders();
        const filtered = orders.filter(o => o.id !== id);
        return this.setData(this.KEYS.ORDERS, filtered);
    },

    // ==========================================
    // ИЗОБРАЖЕНИЯ
    // ==========================================
    getImages() {
        return this.getData(this.KEYS.IMAGES) || [];
    },

    addImage(imageData) {
        const images = this.getImages();
        const newImage = {
            id: this.generateId(),
            data: imageData,
            uploadedAt: new Date().toISOString()
        };
        images.unshift(newImage); // Новые изображения в начало
        this.setData(this.KEYS.IMAGES, images);
        return newImage;
    },

    deleteImage(id) {
        const images = this.getImages();
        const filtered = images.filter(img => img.id !== id);
        return this.setData(this.KEYS.IMAGES, filtered);
    },

    // ==========================================
    // НАСТРОЙКИ
    // ==========================================
    getSettings() {
        return this.getData(this.KEYS.SETTINGS) || this.getDefaultSettings();
    },

    updateSettings(updates) {
        const settings = this.getSettings();
        const newSettings = { ...settings, ...updates };
        return this.setData(this.KEYS.SETTINGS, newSettings);
    },

    // ==========================================
    // АНАЛИТИКА
    // ==========================================
    getAnalytics() {
        return this.getData(this.KEYS.ANALYTICS) || this.getDefaultAnalytics();
    },

    trackClick(buttonName) {
        const analytics = this.getAnalytics();
        if (!analytics.clicks[buttonName]) {
            analytics.clicks[buttonName] = 0;
        }
        analytics.clicks[buttonName]++;
        this.setData(this.KEYS.ANALYTICS, analytics);
    },

    trackVisitor() {
        const visitors = this.getData(this.KEYS.VISITORS) || [];
        const sessionId = this.getSessionId();
        visitors.push({
            id: this.generateId(),
            sessionId: sessionId,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer,
            url: window.location.href,
            screenResolution: `${window.screen.width}x${window.screen.height}`,
            language: navigator.language
        });
        this.setData(this.KEYS.VISITORS, visitors);

        // Обновляем статистику
        const analytics = this.getAnalytics();
        analytics.totalVisitors = visitors.length;
        this.setData(this.KEYS.ANALYTICS, analytics);

        // Логируем действие
        this.logUserAction('Посещение сайта', { url: window.location.href });
    },

    // ==========================================
    // РАСШИРЕННОЕ ОТСЛЕЖИВАНИЕ
    // ==========================================

    // Отслеживание просмотров страниц
    trackPageView(pageName, pageData = {}) {
        const pageViews = this.getData(this.KEYS.PAGE_VIEWS) || [];
        const sessionId = this.getSessionId();
        pageViews.push({
            id: this.generateId(),
            sessionId: sessionId,
            pageName: pageName,
            url: window.location.href,
            timestamp: new Date().toISOString(),
            data: pageData,
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });

        // Ограничиваем количество записей (храним последние 1000)
        if (pageViews.length > 1000) {
            pageViews.shift();
        }

        this.setData(this.KEYS.PAGE_VIEWS, pageViews);
        this.logUserAction('Просмотр страницы', { pageName, ...pageData });
        return pageViews;
    },

    getPageViews() {
        return this.getData(this.KEYS.PAGE_VIEWS) || [];
    },

    // Отслеживание просмотров товаров
    trackProductView(productId, productName) {
        const productViews = this.getData(this.KEYS.PRODUCT_VIEWS) || [];
        const sessionId = this.getSessionId();
        productViews.push({
            id: this.generateId(),
            sessionId: sessionId,
            productId: productId,
            productName: productName,
            timestamp: new Date().toISOString(),
            url: window.location.href
        });

        // Ограничиваем количество записей
        if (productViews.length > 1000) {
            productViews.shift();
        }

        this.setData(this.KEYS.PRODUCT_VIEWS, productViews);
        this.logUserAction('Просмотр товара', { productId, productName });
        return productViews;
    },

    getProductViews() {
        return this.getData(this.KEYS.PRODUCT_VIEWS) || [];
    },

    // Получить популярные товары
    getPopularProducts(limit = 10) {
        const views = this.getProductViews();
        const productCounts = {};

        views.forEach(view => {
            if (!productCounts[view.productId]) {
                productCounts[view.productId] = {
                    id: view.productId,
                    name: view.productName,
                    views: 0
                };
            }
            productCounts[view.productId].views++;
        });

        return Object.values(productCounts)
            .sort((a, b) => b.views - a.views)
            .slice(0, limit);
    },

    // Отслеживание кликов по кнопкам
    trackButtonClick(buttonName, buttonData = {}) {
        const buttonClicks = this.getData(this.KEYS.BUTTON_CLICKS) || [];
        const sessionId = this.getSessionId();
        buttonClicks.push({
            id: this.generateId(),
            sessionId: sessionId,
            buttonName: buttonName,
            timestamp: new Date().toISOString(),
            data: buttonData,
            url: window.location.href
        });

        // Ограничиваем количество записей
        if (buttonClicks.length > 1000) {
            buttonClicks.shift();
        }

        this.setData(this.KEYS.BUTTON_CLICKS, buttonClicks);

        // Обновляем старую аналитику для совместимости
        this.trackClick(buttonName);
        this.logUserAction('Клик по кнопке', { buttonName, ...buttonData });
        return buttonClicks;
    },

    getButtonClicks() {
        return this.getData(this.KEYS.BUTTON_CLICKS) || [];
    },

    // Получить статистику кликов по кнопкам
    getButtonClicksStats() {
        const clicks = this.getButtonClicks();
        const stats = {};

        clicks.forEach(click => {
            if (!stats[click.buttonName]) {
                stats[click.buttonName] = 0;
            }
            stats[click.buttonName]++;
        });

        return Object.entries(stats)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count);
    },

    // Логирование действий пользователя
    logUserAction(actionType, actionData = {}) {
        const actions = this.getData(this.KEYS.USER_ACTIONS) || [];
        const sessionId = this.getSessionId();
        actions.push({
            id: this.generateId(),
            sessionId: sessionId,
            actionType: actionType,
            timestamp: new Date().toISOString(),
            data: actionData,
            url: window.location.href
        });

        // Ограничиваем количество записей (храним последние 500)
        if (actions.length > 500) {
            actions.shift();
        }

        this.setData(this.KEYS.USER_ACTIONS, actions);
        return actions;
    },

    getUserActions() {
        return this.getData(this.KEYS.USER_ACTIONS) || [];
    },

    // Получить действия по сессии
    getActionsBySession(sessionId) {
        const actions = this.getUserActions();
        return actions.filter(action => action.sessionId === sessionId);
    },

    // Получить уникальные сессии
    getUniqueSessions() {
        const visitors = this.getData(this.KEYS.VISITORS) || [];
        const sessions = new Set();
        visitors.forEach(visitor => {
            if (visitor.sessionId) {
                sessions.add(visitor.sessionId);
            }
        });
        return Array.from(sessions);
    },

    // Генерация или получение ID сессии
    getSessionId() {
        const SESSION_KEY = 'optstock_session_id';
        let sessionId = sessionStorage.getItem(SESSION_KEY);

        if (!sessionId) {
            sessionId = this.generateId();
            sessionStorage.setItem(SESSION_KEY, sessionId);
        }

        return sessionId;
    },

    // Получить статистику по времени
    getTimeBasedStats(period = 'day') {
        const now = new Date();
        const pageViews = this.getPageViews();
        const visitors = this.getData(this.KEYS.VISITORS) || [];

        let startTime;
        switch(period) {
            case 'hour':
                startTime = new Date(now - 60 * 60 * 1000);
                break;
            case 'day':
                startTime = new Date(now - 24 * 60 * 60 * 1000);
                break;
            case 'week':
                startTime = new Date(now - 7 * 24 * 60 * 60 * 1000);
                break;
            case 'month':
                startTime = new Date(now - 30 * 24 * 60 * 60 * 1000);
                break;
            default:
                startTime = new Date(now - 24 * 60 * 60 * 1000);
        }

        const filteredViews = pageViews.filter(view =>
            new Date(view.timestamp) >= startTime
        );

        const filteredVisitors = visitors.filter(visitor =>
            new Date(visitor.timestamp) >= startTime
        );

        // Группировка по часам для графика
        const hourlyData = {};
        filteredViews.forEach(view => {
            const hour = new Date(view.timestamp).getHours();
            if (!hourlyData[hour]) {
                hourlyData[hour] = 0;
            }
            hourlyData[hour]++;
        });

        return {
            period,
            totalViews: filteredViews.length,
            totalVisitors: filteredVisitors.length,
            hourlyData,
            uniqueSessions: new Set(filteredViews.map(v => v.sessionId)).size
        };
    },

    // Получить подробную статистику
    getDetailedStats() {
        const pageViews = this.getPageViews();
        const productViews = this.getProductViews();
        const buttonClicks = this.getButtonClicks();
        const visitors = this.getData(this.KEYS.VISITORS) || [];
        const orders = this.getOrders();

        // Уникальные посетители
        const uniqueSessions = new Set(visitors.map(v => v.sessionId)).size;

        // Конверсия
        const conversionRate = uniqueSessions > 0
            ? ((orders.length / uniqueSessions) * 100).toFixed(2)
            : 0;

        // Самая популярная страница
        const pageStats = {};
        pageViews.forEach(view => {
            if (!pageStats[view.pageName]) {
                pageStats[view.pageName] = 0;
            }
            pageStats[view.pageName]++;
        });
        const mostViewedPage = Object.entries(pageStats)
            .sort((a, b) => b[1] - a[1])[0];

        // Активность по часам
        const activityByHour = Array(24).fill(0);
        [...pageViews, ...buttonClicks].forEach(item => {
            const hour = new Date(item.timestamp).getHours();
            activityByHour[hour]++;
        });

        return {
            totalPageViews: pageViews.length,
            totalProductViews: productViews.length,
            totalButtonClicks: buttonClicks.length,
            totalVisitors: visitors.length,
            uniqueSessions,
            totalOrders: orders.length,
            conversionRate: conversionRate + '%',
            mostViewedPage: mostViewedPage ? { name: mostViewedPage[0], views: mostViewedPage[1] } : null,
            popularProducts: this.getPopularProducts(5),
            topButtons: this.getButtonClicksStats().slice(0, 5),
            activityByHour,
            timeBasedStats: {
                last24h: this.getTimeBasedStats('day'),
                last7d: this.getTimeBasedStats('week')
            }
        };
    },

    // ==========================================
    // СТАТИСТИКА
    // ==========================================
    getStats() {
        const products = this.getProducts();
        const orders = this.getOrders();
        const analytics = this.getAnalytics();
        const visitors = this.getData(this.KEYS.VISITORS) || [];

        return {
            totalProducts: products.length,
            totalOrders: orders.length,
            totalVisitors: visitors.length,
            conversionRate: visitors.length > 0
                ? ((orders.length / visitors.length) * 100).toFixed(1)
                : 0
        };
    },

    // ==========================================
    // ЭКСПОРТ/ИМПОРТ ДАННЫХ
    // ==========================================
    exportData() {
        const data = {};
        Object.entries(this.KEYS).forEach(([key, value]) => {
            data[key] = this.getData(value);
        });
        return JSON.stringify(data, null, 2);
    },

    importData(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            Object.entries(this.KEYS).forEach(([key, value]) => {
                if (data[key]) {
                    this.setData(value, data[key]);
                }
            });
            return true;
        } catch (error) {
            console.error('Ошибка импорта данных:', error);
            return false;
        }
    },

    // ==========================================
    // ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
    // ==========================================
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    getDefaultProducts() {
        return [
            {
                id: this.generateId(),
                name: 'Декоративная косметика',
                category: 'makeup',
                description: 'Помады, тени, тушь',
                price: 0,
                icon: '💄',
                image: '',
                visible: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Уход за кожей',
                category: 'skincare',
                description: 'Кремы, сыворотки',
                price: 0,
                icon: '🧴',
                image: '',
                visible: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Очищение',
                category: 'cleansing',
                description: 'Мицеллярка, пенки',
                price: 0,
                icon: '🧼',
                image: '',
                visible: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Маникюр',
                category: 'nails',
                description: 'Лаки, базы, топы',
                price: 0,
                icon: '💅',
                image: '',
                visible: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Парфюмерия',
                category: 'perfume',
                description: 'Духи, одеколоны',
                price: 0,
                icon: '🌸',
                image: '',
                visible: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: this.generateId(),
                name: 'Уход за волосами',
                category: 'haircare',
                description: 'Шампуни, маски',
                price: 0,
                icon: '💆‍♀️',
                image: '',
                visible: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    },

    getDefaultOrders() {
        return [
            {
                id: this.generateId(),
                customerName: 'Айжан К.',
                customerPhone: '+996555111222',
                products: ['Декоративная косметика'],
                total: 2500,
                status: 'pending',
                createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
                updatedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString()
            },
            {
                id: this.generateId(),
                customerName: 'Асель М.',
                customerPhone: '+996777333444',
                products: ['Уход за кожей', 'Парфюмерия'],
                total: 5800,
                status: 'processing',
                createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
                updatedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
            }
        ];
    },

    getDefaultSettings() {
        return {
            siteName: 'OPT STOCK',
            siteDescription: 'Премиум косметика оптом и в розницу',
            workingHours: '10:00 - 21:00',
            whatsappNumber: '996555123456',
            instagramHandle: 'optstock_kg',
            tiktokHandle: 'optstock_kg',
            dgisLink: 'https://2gis.kg/bishkek',
            heartsEnabled: true
        };
    },

    getDefaultAnalytics() {
        return {
            totalVisitors: 0,
            clicks: {},
            popularCategories: {
                makeup: 45,
                skincare: 38,
                perfume: 25,
                haircare: 20,
                nails: 15,
                cleansing: 12
            }
        };
    }
};

// Инициализация при загрузке
DataManager.init();

// Экспортируем для использования
window.DataManager = DataManager;
