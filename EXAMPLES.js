// ============================================
// ПРИМЕРЫ КАСТОМИЗАЦИИ И РАСШИРЕНИЯ
// ============================================

// 1. ДОБАВИТЬ МОДАЛЬНОЕ ОКНО ДЛЯ ТОВАРОВ
// Добавьте в index.html перед закрывающим </body>:

/*
<div id="productModal" class="modal">
    <div class="modal-content">
        <span class="close">&times;</span>
        <h2 id="modalTitle"></h2>
        <p id="modalDescription"></p>
        <button class="btn btn-whatsapp" onclick="orderProduct()">Заказать в WhatsApp</button>
    </div>
</div>
*/

// И добавьте стили в style.css:

/*
.modal {
    display: none;
    position: fixed;
    z-index: 1000;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,0.7);
    backdrop-filter: blur(10px);
}

.modal-content {
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(255, 248, 243, 0.98) 100%);
    margin: 10% auto;
    padding: 40px;
    border-radius: 30px;
    width: 90%;
    max-width: 500px;
    box-shadow: 0 30px 80px rgba(255, 107, 157, 0.3);
}

.close {
    color: #aaa;
    float: right;
    font-size: 36px;
    font-weight: bold;
    cursor: pointer;
    transition: color 0.3s;
}

.close:hover {
    color: var(--primary-pink);
}
*/

// JavaScript для модального окна:
function showProductModal(productName, description) {
    const modal = document.getElementById('productModal');
    const modalTitle = document.getElementById('modalTitle');
    const modalDescription = document.getElementById('modalDescription');
    
    modalTitle.textContent = productName;
    modalDescription.textContent = description;
    modal.style.display = 'block';
}

function orderProduct() {
    const productName = document.getElementById('modalTitle').textContent;
    const phoneNumber = '996555123456'; // Ваш номер
    const message = `Здравствуйте! Хочу заказать: ${productName}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
}

// Закрытие модального окна
window.onclick = function(event) {
    const modal = document.getElementById('productModal');
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// ============================================
// 2. ДОБАВИТЬ ГАЛЕРЕЮ ТОВАРОВ
// ============================================

/*
<div class="gallery">
    <div class="gallery-item">
        <img src="images/product1.jpg" alt="Товар 1" class="lazy">
        <div class="gallery-overlay">
            <h3>Название товара</h3>
            <p>Цена: 1500 сом</p>
            <button class="btn-small">Заказать</button>
        </div>
    </div>
</div>
*/

// CSS для галереи:
/*
.gallery {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    padding: 20px;
}

.gallery-item {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s;
}

.gallery-item:hover {
    transform: scale(1.05);
}

.gallery-item img {
    width: 100%;
    height: 300px;
    object-fit: cover;
}

.gallery-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.8), transparent);
    color: white;
    padding: 20px;
    transform: translateY(100%);
    transition: transform 0.3s;
}

.gallery-item:hover .gallery-overlay {
    transform: translateY(0);
}
*/

// ============================================
// 3. ДОБАВИТЬ ФОРМУ ОБРАТНОЙ СВЯЗИ
// ============================================

/*
<section class="contact-form-section">
    <h2>Свяжитесь с нами</h2>
    <form id="contactForm">
        <input type="text" name="name" placeholder="Ваше имя" required>
        <input type="tel" name="phone" placeholder="Телефон" required>
        <textarea name="message" placeholder="Сообщение" rows="4" required></textarea>
        <button type="submit" class="btn btn-whatsapp">Отправить</button>
    </form>
</section>
*/

// JavaScript для формы:
document.getElementById('contactForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(this);
    const name = formData.get('name');
    const phone = formData.get('phone');
    const message = formData.get('message');
    
    // Отправка в WhatsApp
    const phoneNumber = '996555123456';
    const text = `Новая заявка!\n\nИмя: ${name}\nТелефон: ${phone}\nСообщение: ${message}`;
    
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`, '_blank');
    
    // Очистка формы
    this.reset();
    alert('Спасибо! Мы скоро свяжемся с вами.');
});

// ============================================
// 4. ДОБАВИТЬ СЧЕТЧИК ПОСЕТИТЕЛЕЙ
// ============================================

// Простой счетчик с использованием localStorage:
function updateVisitorCount() {
    let count = localStorage.getItem('visitorCount') || 0;
    count = parseInt(count) + 1;
    localStorage.setItem('visitorCount', count);
    
    const counterElement = document.getElementById('visitorCounter');
    if (counterElement) {
        counterElement.textContent = count;
    }
}

// Вызвать при загрузке страницы:
// updateVisitorCount();

// ============================================
// 5. ДОБАВИТЬ СЛАЙДЕР/КАРУСЕЛЬ АКЦИЙ
// ============================================

/*
<div class="slider">
    <div class="slider-track">
        <div class="slide">Скидка 20% на всю косметику!</div>
        <div class="slide">Бесплатная доставка от 3000 сом</div>
        <div class="slide">Новая коллекция уже в продаже!</div>
    </div>
</div>
*/

// CSS для слайдера:
/*
.slider {
    overflow: hidden;
    background: linear-gradient(135deg, var(--primary-pink), var(--primary-purple));
    color: white;
    padding: 15px 0;
    margin-bottom: 30px;
}

.slider-track {
    display: flex;
    animation: scroll 20s linear infinite;
}

.slide {
    min-width: 100%;
    text-align: center;
    font-size: 18px;
    font-weight: 600;
}

@keyframes scroll {
    0% { transform: translateX(0); }
    100% { transform: translateX(-300%); }
}
*/

// ============================================
// 6. ДОБАВИТЬ УВЕДОМЛЕНИЯ (TOAST)
// ============================================

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    // Стили для toast
    Object.assign(toast.style, {
        position: 'fixed',
        bottom: '20px',
        right: '20px',
        padding: '15px 25px',
        borderRadius: '10px',
        background: type === 'success' ? 'linear-gradient(135deg, #25D366, #128C7E)' : 'linear-gradient(135deg, #FF6B6B, #C06C84)',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease'
    });
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Использование:
// showToast('Товар добавлен в корзину!', 'success');
// showToast('Ошибка! Попробуйте снова.', 'error');

// ============================================
// 7. ИНТЕГРАЦИЯ С TELEGRAM BOT
// ============================================

function sendToTelegram(data) {
    const botToken = 'YOUR_BOT_TOKEN';
    const chatId = 'YOUR_CHAT_ID';
    const message = `Новый заказ!\n\n${JSON.stringify(data, null, 2)}`;
    
    fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            chat_id: chatId,
            text: message,
            parse_mode: 'HTML'
        })
    })
    .then(response => response.json())
    .then(data => console.log('Отправлено в Telegram:', data))
    .catch(error => console.error('Ошибка:', error));
}

// ============================================
// 8. ДОБАВИТЬ КОРЗИНУ ПОКУПОК
// ============================================

class ShoppingCart {
    constructor() {
        this.items = JSON.parse(localStorage.getItem('cart')) || [];
    }
    
    addItem(product) {
        this.items.push(product);
        this.save();
        showToast('Товар добавлен в корзину!');
    }
    
    removeItem(index) {
        this.items.splice(index, 1);
        this.save();
    }
    
    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }
    
    getTotal() {
        return this.items.reduce((sum, item) => sum + item.price, 0);
    }
    
    clear() {
        this.items = [];
        this.save();
    }
}

// Использование:
const cart = new ShoppingCart();
// cart.addItem({ name: 'Помада', price: 1500 });

// ============================================
// Эти примеры помогут вам расширить функционал сайта
// Не забудьте протестировать каждую добавленную функцию!
// ============================================
