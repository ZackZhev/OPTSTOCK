/**
 * OPT STOCK - Премиум Косметика
 * JavaScript функционал
 */

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', function() {

    // ==========================================
    // ПАДАЮЩИЕ СЕРДЕЧКИ
    // ==========================================
    // Проверяем настройки перед созданием сердечек
    if (typeof DataManager !== 'undefined') {
        const settings = DataManager.getSettings();
        if (settings.heartsEnabled !== false) {
            createFallingHearts();
        } else {
            console.log('Анимация сердечек отключена в настройках');
        }
    } else {
        // Если DataManager не загружен, показываем сердечки по умолчанию
        createFallingHearts();
    }

    // ==========================================
    // КАРУСЕЛЬ ТОВАРОВ
    // ==========================================
    initProductCarousel();

    // ==========================================
    // ТРЕКИНГ ПОСЕТИТЕЛЕЙ
    // ==========================================
    if (typeof DataManager !== 'undefined') {
        DataManager.trackVisitor();
    }

    // ==========================================
    // ЗАГРУЗКА ТОВАРОВ ИЗ БАЗЫ ДАННЫХ
    // ==========================================
    loadProductsFromDatabase();

    // ==========================================
    // ЗАГРУЗКА НАСТРОЕК ИЗ АДМИНКИ
    // ==========================================
    loadSettingsFromDatabase();

    // ==========================================
    // СЕКРЕТНЫЙ ДОСТУП К АДМИНКЕ
    // ==========================================
    const logo = document.querySelector('.logo-container');
    let clickCount = 0;
    let clickTimer = null;

    if (logo) {
        logo.addEventListener('click', function() {
            clickCount++;

            if (clickTimer) {
                clearTimeout(clickTimer);
            }

            clickTimer = setTimeout(() => {
                clickCount = 0;
            }, 500);

            if (clickCount === 3) {
                window.location.href = 'admin.html';
                clickCount = 0;
            }
        });
    }
    
    // ==========================================
    // ПЛАВНАЯ ПРОКРУТКА К ЯКОРЯМ
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // АНИМАЦИЯ ПРИ СКРОЛЛЕ (Intersection Observer)
    // ==========================================
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Применяем анимацию к карточкам товаров
    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeInObserver.observe(card);
    });

    // ==========================================
    // ЭФФЕКТ ПАРАЛЛАКСА ДЛЯ ДЕКОРАТИВНЫХ ЭЛЕМЕНТОВ
    // ==========================================
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        document.querySelectorAll('.hero-decoration').forEach((el, index) => {
            const speed = (index + 1) * 20;
            const x = (mouseX - 0.5) * speed;
            const y = (mouseY - 0.5) * speed;
            el.style.transform = `translate(${x}px, ${y}px)`;
        });
    });

    // ==========================================
    // RIPPLE ЭФФЕКТ ДЛЯ КНОПОК
    // ==========================================
    function createRipple(event) {
        const button = event.currentTarget;
        const ripple = document.createElement('span');
        const rect = button.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.style.position = 'absolute';
        ripple.style.borderRadius = '50%';
        ripple.style.background = 'rgba(255, 255, 255, 0.5)';
        ripple.style.transform = 'scale(0)';
        ripple.style.animation = 'ripple 0.6s ease-out';
        ripple.style.pointerEvents = 'none';
        ripple.classList.add('ripple-effect');
        
        button.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }

    // Применяем ripple эффект ко всем кнопкам и соц.ссылкам
    document.querySelectorAll('.btn, .social-link').forEach(button => {
        button.addEventListener('click', createRipple);
    });

    // ==========================================
    // КЛИК ПО КАРТОЧКЕ ТОВАРА
    // ==========================================
    document.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const productName = this.querySelector('.product-name').textContent;
            
            // Анимация клика
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);

            // Можно добавить логику для открытия каталога или отправки в WhatsApp
            console.log(`Выбрана категория: ${category} - ${productName}`);
            
            // Пример: отправить в WhatsApp
            // const phoneNumber = '996555123456';
            // const message = `Здравствуйте! Интересует категория: ${productName}`;
            // window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });
    });

    // ==========================================
    // АНИМАЦИЯ ЛОГОТИПА
    // ==========================================
    const logo = document.querySelector('.logo-container');
    if (logo) {
        logo.addEventListener('mouseenter', function() {
            this.style.animation = 'none';
            setTimeout(() => {
                this.style.animation = '';
            }, 10);
        });
    }

    // ==========================================
    // ОТСЛЕЖИВАНИЕ КЛИКОВ ПО КНОПКАМ (для аналитики)
    // ==========================================
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const buttonText = this.querySelector('.btn-text') ? this.querySelector('.btn-text').textContent : 'Unknown';
            console.log(`Клик по кнопке: ${buttonText}`);

            // Трекинг в DataManager
            if (typeof DataManager !== 'undefined') {
                DataManager.trackClick(buttonText);
            }

            // Здесь можно добавить Google Analytics или другую аналитику
            // gtag('event', 'button_click', {
            //     'button_name': buttonText
            // });
        });
    });

    // ==========================================
    // LAZY LOADING ДЛЯ ИЗОБРАЖЕНИЙ (если будут)
    // ==========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img.lazy').forEach(img => {
            imageObserver.observe(img);
        });
    }

    // ==========================================
    // ПОКАЗАТЬ/СКРЫТЬ ЭЛЕМЕНТЫ ПРИ СКРОЛЛЕ
    // ==========================================
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Определяем направление скролла
        if (scrollTop > lastScrollTop) {
            // Скролл вниз
        } else {
            // Скролл вверх
        }
        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    }, false);

    // ==========================================
    // АНИМАЦИЯ ЧИСЕЛ (если добавите статистику)
    // ==========================================
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            element.textContent = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    // Пример использования:
    // const statsObserver = new IntersectionObserver((entries) => {
    //     entries.forEach(entry => {
    //         if (entry.isIntersecting) {
    //             animateValue(entry.target, 0, 1000, 2000);
    //             statsObserver.unobserve(entry.target);
    //         }
    //     });
    // });

    // ==========================================
    // КОПИРОВАНИЕ НОМЕРА ТЕЛЕФОНА
    // ==========================================
    function copyToClipboard(text) {
        if (navigator.clipboard) {
            navigator.clipboard.writeText(text).then(() => {
                console.log('Номер скопирован в буфер обмена');
                // Можно показать уведомление
            });
        }
    }

    // ==========================================
    // ПРЕДОТВРАЩЕНИЕ ДВОЙНОГО КЛИКА
    // ==========================================
    let clickTimeout;
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', function(e) {
            if (clickTimeout) {
                clearTimeout(clickTimeout);
            }
            clickTimeout = setTimeout(() => {
                clickTimeout = null;
            }, 300);
        });
    });

    // ==========================================
    // ВИБРАЦИЯ ПРИ КЛИКЕ (для мобильных)
    // ==========================================
    if ('vibrate' in navigator) {
        document.querySelectorAll('.btn, .product-card').forEach(element => {
            element.addEventListener('click', () => {
                navigator.vibrate(50); // Вибрация 50ms
            });
        });
    }

    // ==========================================
    // CONSOLE LOG ДЛЯ РАЗРАБОТКИ
    // ==========================================
    console.log('%c🌸 OPT STOCK - Премиум Косметика 💄', 'color: #FF6B9D; font-size: 20px; font-weight: bold;');
    console.log('%cСайт успешно загружен!', 'color: #C06C84; font-size: 14px;');
    
});

// ==========================================
// ДОПОЛНИТЕЛЬНЫЕ УТИЛИТЫ
// ==========================================

/**
 * Получить параметры из URL
 */
function getURLParams() {
    const params = {};
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    for (const [key, value] of urlParams) {
        params[key] = value;
    }
    
    return params;
}

/**
 * Проверка мобильного устройства
 */
function isMobile() {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * Проверка iOS устройства
 */
function isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
}

// ==========================================
// ЗАГРУЗКА ТОВАРОВ ИЗ БАЗЫ ДАННЫХ
// ==========================================
function loadProductsFromDatabase() {
    if (typeof DataManager === 'undefined') {
        console.log('DataManager не загружен, используются статические товары');
        return;
    }

    const products = DataManager.getProducts().filter(p => p.visible);
    const productsGrid = document.querySelector('.products-grid');

    if (!productsGrid || products.length === 0) {
        console.log('Товары не найдены или элемент не существует');
        return;
    }

    // Очищаем текущие товары
    productsGrid.innerHTML = '';

    // Добавляем товары из базы данных
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);

        // Генерируем подробное описание на основе категории
        const detailedDescriptions = {
            makeup: 'Широкий ассортимент помад, теней для век, туши для ресниц, румян и хайлайтеров. Все продукты сертифицированы и протестированы дерматологами.',
            skincare: 'Профессиональные кремы, сыворотки и маски для лица. Подходят для всех типов кожи. Натуральные компоненты и инновационные формулы.',
            cleansing: 'Мицеллярная вода, пенки, гели и тоники для умывания. Бережно очищают кожу, не нарушая её естественный баланс.',
            nails: 'Лаки для ногтей, базовые и топовые покрытия, средства для укрепления ногтей. Стойкие формулы и яркие цвета.',
            perfume: 'Изысканные ароматы от мировых брендов. Духи, туалетная вода, одеколоны и парфюмированные дезодоранты.',
            haircare: 'Профессиональные шампуни, кондиционеры, маски и сыворотки для волос. Восстановление, питание и защита волос.'
        };

        const badges = {
            makeup: 'Оптом и в розницу',
            skincare: 'Премиум качество',
            cleansing: 'Для всех типов кожи',
            nails: 'Профессиональная линия',
            perfume: 'Оригинальная продукция',
            haircare: 'Салонный уход дома'
        };

        const detailedDescription = detailedDescriptions[product.category] || product.description;
        const badge = badges[product.category] || 'Премиум качество';

        productCard.innerHTML = `
            <div class="product-icon">${product.icon}</div>
            <div class="product-name">${product.name}</div>
            <div class="product-description">${product.description}</div>
            ${product.price > 0 ? `<div class="product-price">${product.price} сом</div>` : ''}
            <div class="product-details">
                <h4>${product.name}</h4>
                <p>${detailedDescription}</p>
                <span class="details-badge">${badge}</span>
            </div>
        `;

        // Добавляем обработчик клика
        productCard.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            const productName = this.querySelector('.product-name').textContent;

            // Анимация клика
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);

            console.log(`Выбрана категория: ${category} - ${productName}`);

            // Вибрация на мобильных
            if ('vibrate' in navigator) {
                navigator.vibrate(50);
            }

            // Отправка в WhatsApp
            const settings = DataManager.getSettings();
            const phoneNumber = settings.whatsappNumber;
            const message = `Здравствуйте! Интересует категория: ${productName}`;
            window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
        });

        productsGrid.appendChild(productCard);
    });

    // Применяем анимацию появления к новым карточкам
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.product-card').forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
        fadeInObserver.observe(card);
    });

    console.log(`Загружено ${products.length} товаров из базы данных`);
}

// ==========================================
// ЗАГРУЗКА НАСТРОЕК ИЗ АДМИНКИ
// ==========================================
function loadSettingsFromDatabase() {
    if (typeof DataManager === 'undefined') {
        console.log('DataManager не загружен, используются статические настройки');
        return;
    }

    const settings = DataManager.getSettings();

    if (!settings) {
        console.log('Настройки не найдены');
        return;
    }

    console.log('Загружены настройки:', settings);

    // Обновляем название сайта
    const siteTitle = document.querySelector('h1');
    if (siteTitle && settings.siteName) {
        siteTitle.textContent = settings.siteName;
    }

    // Обновляем описание
    const subtitles = document.querySelectorAll('.subtitle');
    if (subtitles.length > 0 && settings.siteDescription) {
        subtitles[0].innerHTML = settings.siteDescription;
    }

    // Обновляем часы работы
    const hoursDiv = document.querySelector('.hours');
    if (hoursDiv && settings.workingHours) {
        hoursDiv.textContent = `Открыты ежедневно: ${settings.workingHours}`;
    }

    // Обновляем ссылки на социальные сети и контакты

    // WhatsApp кнопка
    const whatsappBtns = document.querySelectorAll('a[href^="https://wa.me/"]');
    whatsappBtns.forEach(btn => {
        if (settings.whatsappNumber) {
            btn.href = `https://wa.me/${settings.whatsappNumber}`;
        }
    });

    // Instagram ссылки
    const instagramLinks = document.querySelectorAll('a[href*="instagram.com"]');
    instagramLinks.forEach(link => {
        if (settings.instagramHandle) {
            link.href = `https://www.instagram.com/${settings.instagramHandle}`;
        }
    });

    // TikTok ссылки
    const tiktokLinks = document.querySelectorAll('a[href*="tiktok.com"]');
    tiktokLinks.forEach(link => {
        if (settings.tiktokHandle) {
            link.href = `https://www.tiktok.com/@${settings.tiktokHandle}`;
        }
    });

    // 2ГИС ссылки
    const dgisLinks = document.querySelectorAll('a[href*="2gis"]');
    dgisLinks.forEach(link => {
        if (settings.dgisLink) {
            link.href = settings.dgisLink;
        }
    });

    console.log('Настройки применены к сайту');
}

// ==========================================
// ПАДАЮЩИЕ СЕРДЕЧКИ
// ==========================================
function createFallingHearts() {
    const heartsContainer = document.getElementById('heartsContainer');

    if (!heartsContainer) {
        console.log('Контейнер для сердечек не найден');
        return;
    }

    // Варианты сердечек (разные цвета и стили)
    const heartTypes = ['💕', '💖', '💗', '💓', '💞', '💝', '❤️', '🩷', '💘', '♥️'];

    // Функция создания одного сердечка
    function createHeart() {
        const heart = document.createElement('div');
        heart.className = 'heart';

        // Случайный тип сердечка
        heart.textContent = heartTypes[Math.floor(Math.random() * heartTypes.length)];

        // Случайная позиция по горизонтали
        const leftPosition = Math.random() * 100;
        heart.style.left = leftPosition + '%';

        // Случайный размер (увеличен для МАКСИМАЛЬНОЙ видимости)
        const size = 25 + Math.random() * 40; // от 25px до 65px
        heart.style.fontSize = size + 'px';

        // Случайная длительность падения
        const duration = 6 + Math.random() * 10; // от 6 до 16 секунд
        heart.style.animationDuration = duration + 's';

        // Случайная задержка старта
        const delay = Math.random() * 3;
        heart.style.animationDelay = delay + 's';

        // Добавляем покачивание
        const swayAnimation = `sway ${2 + Math.random() * 2}s ease-in-out infinite`;
        heart.style.animation = `fall ${duration}s linear infinite, ${swayAnimation}`;

        heartsContainer.appendChild(heart);

        // Удаляем сердечко после завершения анимации (экономим память)
        setTimeout(() => {
            if (heart.parentNode) {
                heart.remove();
            }
        }, (duration + delay) * 1000);
    }

    // Создаём начальную партию сердечек (МНОГО для заметного эффекта)
    for (let i = 0; i < 35; i++) {
        setTimeout(() => {
            createHeart();
        }, i * 200); // С интервалом 200ms
    }

    // Продолжаем создавать сердечки с интервалом
    setInterval(() => {
        createHeart();
    }, 600); // Каждые 0.6 секунды новое сердечко (ЧАЩЕ!)

    console.log('💕 Падающие сердечки активированы');
}

// ==========================================
// КАРУСЕЛЬ ТОВАРОВ - ГОРИЗОНТАЛЬНАЯ ПРОКРУТКА
// ==========================================
function initProductCarousel() {
    const prevBtn = document.querySelector('.carousel-btn-prev');
    const nextBtn = document.querySelector('.carousel-btn-next');
    const productsGrid = document.querySelector('.products-grid');
    const wrapper = document.querySelector('.products-carousel-wrapper');
    const indicatorsContainer = document.getElementById('carouselIndicators');

    console.log('Инициализация горизонтальной карусели товаров...');

    if (!prevBtn || !nextBtn || !productsGrid || !wrapper) {
        console.error('Элементы карусели не найдены!');
        return;
    }

    let currentIndex = 0;
    const cardWidth = 305; // width + gap
    const cards = productsGrid.querySelectorAll('.product-card');

    // Создаем индикаторы
    function createIndicators() {
        if (!indicatorsContainer) return;

        indicatorsContainer.innerHTML = '';
        const totalPages = Math.ceil(cards.length / getVisibleCards());

        for (let i = 0; i < totalPages; i++) {
            const indicator = document.createElement('div');
            indicator.className = 'carousel-indicator';
            if (i === 0) indicator.classList.add('active');

            indicator.addEventListener('click', () => goToPage(i));
            indicatorsContainer.appendChild(indicator);
        }
    }

    // Получаем количество видимых карточек
    function getVisibleCards() {
        const width = window.innerWidth;
        if (width <= 768) return 1;
        if (width <= 1024) return 2;
        return 3;
    }

    // Переход на страницу
    function goToPage(page) {
        currentIndex = page;
        const offset = -currentIndex * cardWidth * getVisibleCards();
        productsGrid.style.transform = `translateX(${offset}px)`;
        updateIndicators();
        updateButtons();
    }

    // Обновляем индикаторы
    function updateIndicators() {
        if (!indicatorsContainer) return;

        const indicators = indicatorsContainer.querySelectorAll('.carousel-indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === currentIndex);
        });
    }

    // Обновляем кнопки
    function updateButtons() {
        const totalPages = Math.ceil(cards.length / getVisibleCards());
        prevBtn.disabled = currentIndex <= 0;
        nextBtn.disabled = currentIndex >= totalPages - 1;
    }

    // Обработчики кнопок
    prevBtn.addEventListener('click', () => {
        if (currentIndex > 0) {
            goToPage(currentIndex - 1);
        }
    });

    nextBtn.addEventListener('click', () => {
        const totalPages = Math.ceil(cards.length / getVisibleCards());
        if (currentIndex < totalPages - 1) {
            goToPage(currentIndex + 1);
        }
    });

    // Поддержка клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });

    // Поддержка свайпов на touch устройствах
    let touchStartX = 0;
    let touchEndX = 0;

    wrapper.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    wrapper.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;

        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextBtn.click();
            } else {
                prevBtn.click();
            }
        }
    }, { passive: true });

    // Обработка изменения размера окна
    let resizeTimeout;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            currentIndex = 0;
            createIndicators();
            goToPage(0);
        }, 250);
    });

    // Инициализация
    createIndicators();
    updateButtons();

    console.log('🎠 Карусель товаров активирована');
    console.log(`Всего товаров: ${cards.length}`);
}

// Экспорт функций для использования в других модулях
window.OptStock = {
    isMobile,
    isIOS,
    getURLParams,
    copyToClipboard: copyToClipboard,
    loadProductsFromDatabase,
    loadSettingsFromDatabase,
    createFallingHearts,
    initProductCarousel
};
