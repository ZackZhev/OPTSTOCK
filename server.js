const express = require('express');
const path = require('path');
const fs = require('fs').promises;
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'opt-stock-secret-2027',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 часа
}));

// Статические файлы
app.use(express.static(__dirname));

// База данных (JSON файлы)
const DB_PATH = path.join(__dirname, 'database');

// Создаем папку для БД если её нет
async function initDatabase() {
    try {
        await fs.mkdir(DB_PATH, { recursive: true });

        // Инициализируем файлы БД
        const files = {
            'users.json': { users: [{ username: 'OPT2027', password: 'POPT2027', role: 'admin' }] },
            'products.json': { products: [] },
            'orders.json': { orders: [] },
            'settings.json': {
                siteName: 'OPT STOCK',
                whatsappNumber: '996555123456',
                instagramHandle: 'opt_stock_',
                dgisLink: 'https://go.2gis.com/kWt7B'
            }
        };

        for (const [filename, defaultData] of Object.entries(files)) {
            const filepath = path.join(DB_PATH, filename);
            try {
                await fs.access(filepath);
            } catch {
                await fs.writeFile(filepath, JSON.stringify(defaultData, null, 2));
            }
        }
    } catch (error) {
        console.error('Ошибка инициализации БД:', error);
    }
}

// Функции для работы с БД
async function readDB(filename) {
    const filepath = path.join(DB_PATH, filename);
    const data = await fs.readFile(filepath, 'utf8');
    return JSON.parse(data);
}

async function writeDB(filename, data) {
    const filepath = path.join(DB_PATH, filename);
    await fs.writeFile(filepath, JSON.stringify(data, null, 2));
}

// Middleware для проверки авторизации
function requireAuth(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).json({ error: 'Не авторизован' });
    }
}

// ==========================================
// API ENDPOINTS - АВТОРИЗАЦИЯ
// ==========================================

// Вход
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        const db = await readDB('users.json');
        const user = db.users.find(u => u.username === username && u.password === password);

        if (user) {
            req.session.user = { username: user.username, role: user.role };
            res.json({ success: true, user: { username: user.username, role: user.role } });
        } else {
            res.status(401).json({ error: 'Неверный логин или пароль' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка сервера' });
    }
});

// Выход
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ success: true });
});

// Проверка авторизации
app.get('/api/check-auth', (req, res) => {
    if (req.session && req.session.user) {
        res.json({ authenticated: true, user: req.session.user });
    } else {
        res.json({ authenticated: false });
    }
});

// ==========================================
// API ENDPOINTS - ТОВАРЫ
// ==========================================

// Получить все товары
app.get('/api/products', async (req, res) => {
    try {
        const db = await readDB('products.json');
        res.json(db.products);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения товаров' });
    }
});

// Получить товар по ID
app.get('/api/products/:id', async (req, res) => {
    try {
        const db = await readDB('products.json');
        const product = db.products.find(p => p.id === req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: 'Товар не найден' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения товара' });
    }
});

// Добавить товар
app.post('/api/products', requireAuth, async (req, res) => {
    try {
        const db = await readDB('products.json');
        const newProduct = {
            id: Date.now().toString(),
            ...req.body,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        db.products.push(newProduct);
        await writeDB('products.json', db);

        res.json(newProduct);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка добавления товара' });
    }
});

// Обновить товар
app.put('/api/products/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDB('products.json');
        const index = db.products.findIndex(p => p.id === req.params.id);

        if (index !== -1) {
            db.products[index] = {
                ...db.products[index],
                ...req.body,
                updatedAt: new Date().toISOString()
            };
            await writeDB('products.json', db);
            res.json(db.products[index]);
        } else {
            res.status(404).json({ error: 'Товар не найден' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления товара' });
    }
});

// Удалить товар
app.delete('/api/products/:id', requireAuth, async (req, res) => {
    try {
        const db = await readDB('products.json');
        db.products = db.products.filter(p => p.id !== req.params.id);
        await writeDB('products.json', db);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка удаления товара' });
    }
});

// ==========================================
// API ENDPOINTS - ЗАКАЗЫ
// ==========================================

// Получить все заказы
app.get('/api/orders', requireAuth, async (req, res) => {
    try {
        const db = await readDB('orders.json');
        res.json(db.orders);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения заказов' });
    }
});

// Добавить заказ
app.post('/api/orders', async (req, res) => {
    try {
        const db = await readDB('orders.json');
        const newOrder = {
            id: Date.now().toString(),
            ...req.body,
            status: 'pending',
            createdAt: new Date().toISOString()
        };

        db.orders.push(newOrder);
        await writeDB('orders.json', db);

        res.json(newOrder);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка создания заказа' });
    }
});

// Обновить статус заказа
app.patch('/api/orders/:id/status', requireAuth, async (req, res) => {
    try {
        const db = await readDB('orders.json');
        const order = db.orders.find(o => o.id === req.params.id);

        if (order) {
            order.status = req.body.status;
            order.updatedAt = new Date().toISOString();
            await writeDB('orders.json', db);
            res.json(order);
        } else {
            res.status(404).json({ error: 'Заказ не найден' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления заказа' });
    }
});

// ==========================================
// API ENDPOINTS - НАСТРОЙКИ
// ==========================================

// Получить настройки
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await readDB('settings.json');
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения настроек' });
    }
});

// Обновить настройки
app.put('/api/settings', requireAuth, async (req, res) => {
    try {
        await writeDB('settings.json', req.body);
        res.json(req.body);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления настроек' });
    }
});

// ==========================================
// СТАТИСТИКА
// ==========================================

app.get('/api/stats', requireAuth, async (req, res) => {
    try {
        const products = await readDB('products.json');
        const orders = await readDB('orders.json');

        res.json({
            totalProducts: products.products.length,
            totalOrders: orders.orders.length,
            pendingOrders: orders.orders.filter(o => o.status === 'pending').length,
            completedOrders: orders.orders.filter(o => o.status === 'completed').length
        });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения статистики' });
    }
});

// ==========================================
// МАРШРУТЫ ДЛЯ СТРАНИЦ
// ==========================================

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Инициализация и запуск сервера
initDatabase().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Сервер запущен на порту ${PORT}`);
        console.log(`📊 Админ панель: http://localhost:${PORT}/admin`);
        console.log(`🌐 Сайт: http://localhost:${PORT}`);
    });
}).catch(error => {
    console.error('Ошибка запуска сервера:', error);
});
