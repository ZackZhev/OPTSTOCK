/**
 * OPT STOCK - API клиент для админ панели
 * Работа с серверным API
 */

const AdminAPI = {
    baseURL: window.location.origin,

    // ==========================================
    // АВТОРИЗАЦИЯ
    // ==========================================

    async login(username, password) {
        try {
            const response = await fetch(`${this.baseURL}/api/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка входа:', error);
            throw error;
        }
    },

    async logout() {
        try {
            const response = await fetch(`${this.baseURL}/api/logout`, {
                method: 'POST'
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка выхода:', error);
            throw error;
        }
    },

    async checkAuth() {
        try {
            const response = await fetch(`${this.baseURL}/api/check-auth`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка проверки авторизации:', error);
            throw error;
        }
    },

    // ==========================================
    // ТОВАРЫ
    // ==========================================

    async getProducts() {
        try {
            const response = await fetch(`${this.baseURL}/api/products`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения товаров:', error);
            throw error;
        }
    },

    async getProduct(id) {
        try {
            const response = await fetch(`${this.baseURL}/api/products/${id}`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения товара:', error);
            throw error;
        }
    },

    async addProduct(product) {
        try {
            const response = await fetch(`${this.baseURL}/api/products`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка добавления товара:', error);
            throw error;
        }
    },

    async updateProduct(id, product) {
        try {
            const response = await fetch(`${this.baseURL}/api/products/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(product)
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка обновления товара:', error);
            throw error;
        }
    },

    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.baseURL}/api/products/${id}`, {
                method: 'DELETE'
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка удаления товара:', error);
            throw error;
        }
    },

    // ==========================================
    // ЗАКАЗЫ
    // ==========================================

    async getOrders() {
        try {
            const response = await fetch(`${this.baseURL}/api/orders`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения заказов:', error);
            throw error;
        }
    },

    async createOrder(order) {
        try {
            const response = await fetch(`${this.baseURL}/api/orders`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(order)
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка создания заказа:', error);
            throw error;
        }
    },

    async updateOrderStatus(id, status) {
        try {
            const response = await fetch(`${this.baseURL}/api/orders/${id}/status`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status })
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка обновления статуса заказа:', error);
            throw error;
        }
    },

    // ==========================================
    // НАСТРОЙКИ
    // ==========================================

    async getSettings() {
        try {
            const response = await fetch(`${this.baseURL}/api/settings`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения настроек:', error);
            throw error;
        }
    },

    async updateSettings(settings) {
        try {
            const response = await fetch(`${this.baseURL}/api/settings`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            });
            return await response.json();
        } catch (error) {
            console.error('Ошибка обновления настроек:', error);
            throw error;
        }
    },

    // ==========================================
    // СТАТИСТИКА
    // ==========================================

    async getStats() {
        try {
            const response = await fetch(`${this.baseURL}/api/stats`);
            return await response.json();
        } catch (error) {
            console.error('Ошибка получения статистики:', error);
            throw error;
        }
    }
};

// Экспортируем для использования
window.AdminAPI = AdminAPI;
