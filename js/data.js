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
        VISITORS: 'optstock_visitors'
    },

    // ==========================================
    // ИНИЦИАЛИЗАЦИЯ
    // ==========================================
    init() {
        // Инициализация базовых данных если их нет
        if (!this.getData(this.KEYS.AUTH)) {
            this.setData(this.KEYS.AUTH, {
                username: 'admin',
                password: 'admin123', // В реальном проекте использовать хеширование!
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
        visitors.push({
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        });
        this.setData(this.KEYS.VISITORS, visitors);

        // Обновляем статистику
        const analytics = this.getAnalytics();
        analytics.totalVisitors = visitors.length;
        this.setData(this.KEYS.ANALYTICS, analytics);
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
