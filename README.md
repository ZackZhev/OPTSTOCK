# 🌸 OPT STOCK - Премиум Косметика

Современный веб-сайт для магазина премиум косметики с элегантным дизайном и интерактивными элементами.

## 📁 Структура проекта

```
opt-stock-project/
│
├── index.html          # Главная страница
├── css/
│   └── style.css      # Стили сайта
├── js/
│   └── main.js        # JavaScript функционал
├── images/            # Папка для изображений
│   └── (добавьте логотип и другие изображения)
└── README.md          # Документация
```

## 🚀 Быстрый старт

### Вариант 1: Простой запуск (без сервера)

1. Скачайте все файлы проекта
2. Откройте файл `index.html` в любом браузере
3. Готово! Сайт работает

### Вариант 2: Запуск с локальным сервером (рекомендуется)

#### Используя VS Code:
1. Откройте папку проекта в VS Code
2. Установите расширение "Live Server"
3. Нажмите правой кнопкой на `index.html` → "Open with Live Server"
4. Сайт откроется в браузере с автообновлением

#### Используя Python:
```bash
# Перейдите в папку проекта
cd opt-stock-project

# Python 3
python -m http.server 8000

# Откройте в браузере: http://localhost:8000
```

#### Используя Node.js:
```bash
# Установите http-server глобально
npm install -g http-server

# Запустите в папке проекта
http-server

# Откройте в браузере: http://localhost:8080
```

## ⚙️ Настройка

### 1. Добавьте свои контактные данные

Откройте `index.html` и замените следующие значения:

```html
<!-- WhatsApp -->
<a href="https://wa.me/996555123456" ...>
Замените 996555123456 на ваш номер телефона

<!-- Instagram -->
<a href="https://www.instagram.com/optstock_kg" ...>
Замените optstock_kg на ваш Instagram аккаунт

<!-- TikTok -->
<a href="https://www.tiktok.com/@optstock_kg" ...>
Замените optstock_kg на ваш TikTok аккаунт

<!-- 2ГИС -->
<a href="https://2gis.kg/bishkek" ...>
Замените на вашу ссылку 2ГИС
```

### 2. Измените часы работы

В `index.html` найдите:
```html
<div class="hours">Открыты ежедневно: 10:00 - 21:00</div>
```

### 3. Добавьте логотип

1. Поместите файл логотипа в папку `images/`
2. Переименуйте в `logo.png`
3. В `index.html` замените:
```html
<span class="logo-text">Opt</span>
<!-- на -->
<img src="images/logo.png" alt="OPT STOCK">
```

### 4. Добавьте favicon

1. Поместите файл `favicon.png` в папку `images/`
2. В `index.html` уже есть строка:
```html
<link rel="icon" type="image/png" href="images/favicon.png">
```

## 🎨 Кастомизация дизайна

### Изменение цветов

Откройте `css/style.css` и измените CSS переменные:

```css
:root {
    --primary-pink: #FF6B9D;      /* Основной розовый */
    --primary-purple: #C06C84;    /* Основной фиолетовый */
    --accent-gold: #D4AF37;       /* Акцентный золотой */
    --text-dark: #2C2C2C;         /* Тёмный текст */
    --text-light: #6B6B6B;        /* Светлый текст */
    --bg-cream: #FFF8F3;          /* Кремовый фон */
    --white: #FFFFFF;             /* Белый */
}
```

### Изменение шрифтов

В `index.html` в секции `<head>` измените ссылку на Google Fonts:

```html
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Montserrat:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
```

Затем в `css/style.css` измените:
```css
body {
    font-family: 'Montserrat', sans-serif;
}

h1, .catalog-title {
    font-family: 'Playfair Display', serif;
}
```

## 📱 Адаптивность

Сайт полностью адаптивен и отлично работает на:
- 💻 Десктопах (1920px+)
- 💻 Ноутбуках (1366px+)
- 📱 Планшетах (768px+)
- 📱 Смартфонах (320px+)

## ✨ Особенности

### Анимации
- ✅ Плавное появление элементов при скролле
- ✅ Hover-эффекты на всех кнопках и карточках
- ✅ Ripple-эффект при клике
- ✅ Параллакс для декоративных элементов
- ✅ Вращающиеся декоративные emoji

### Интерактивность
- ✅ Плавная прокрутка к якорям
- ✅ Анимация при наведении
- ✅ Клик по карточкам товаров
- ✅ Вибрация на мобильных устройствах

### Оптимизация
- ✅ Lazy loading для изображений
- ✅ Минимальное использование ресурсов
- ✅ Быстрая загрузка
- ✅ SEO-оптимизация

## 🔧 Дополнительные функции

### Добавить Google Analytics

В `index.html` перед закрывающим тегом `</head>` добавьте:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### Добавить мета-теги для соцсетей

В `index.html` в секции `<head>` добавьте:

```html
<!-- Open Graph / Facebook -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://ваш-сайт.com/">
<meta property="og:title" content="OPT STOCK - Премиум Косметика">
<meta property="og:description" content="Оригинальная косметика оптом и в розницу">
<meta property="og:image" content="https://ваш-сайт.com/images/preview.jpg">

<!-- Twitter -->
<meta property="twitter:card" content="summary_large_image">
<meta property="twitter:url" content="https://ваш-сайт.com/">
<meta property="twitter:title" content="OPT STOCK - Премиум Косметика">
<meta property="twitter:description" content="Оригинальная косметика оптом и в розницу">
<meta property="twitter:image" content="https://ваш-сайт.com/images/preview.jpg">
```

## 📦 Деплой

### GitHub Pages
1. Создайте репозиторий на GitHub
2. Загрузите все файлы проекта
3. Перейдите в Settings → Pages
4. Выберите ветку main → Save
5. Сайт будет доступен по адресу: `https://ваш-username.github.io/название-репозитория/`

### Netlify
1. Зарегистрируйтесь на netlify.com
2. Перетащите папку проекта на страницу деплоя
3. Сайт автоматически опубликуется

### Vercel
1. Установите Vercel CLI: `npm i -g vercel`
2. В папке проекта выполните: `vercel`
3. Следуйте инструкциям

## 🐛 Поддержка браузеров

- ✅ Chrome (рекомендуется)
- ✅ Firefox
- ✅ Safari
- ✅ Edge
- ✅ Opera
- ⚠️ Internet Explorer (не поддерживается)

## 📝 Лицензия

Этот проект создан для OPT STOCK. Все права защищены.

## 🤝 Поддержка

Если у вас возникли вопросы или проблемы:

1. Проверьте, что все файлы на месте
2. Убедитесь, что пути к CSS и JS правильные
3. Откройте консоль браузера (F12) для проверки ошибок
4. Проверьте, что все ссылки обновлены на ваши

## 📞 Контакты

- 📱 WhatsApp: +996 555 123 456
- 📸 Instagram: @optstock_kg
- 🎵 TikTok: @optstock_kg

---

Сделано с ❤️ для OPT STOCK
