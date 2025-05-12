// shop.js - Работа с корзиной и синхронизация с профилем

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    if (!checkAuth()) {
        // Если пользователь не авторизован, используем временную корзину в localStorage
        loadCart();
    } else {
        // Если авторизован - загружаем корзину из профиля
        loadUserCart();
    }
});

// Глобальные переменные
let cart = [];

// Функция добавления товара в корзину
function addToCart(name, price) {
    if (!checkAuth()) {
        // Для неавторизованных пользователей
        const item = { name, price };
        cart.push(item);
        saveCart();
        updateCartDisplay();
        alert(`Товар "${name}" добавлен в корзину. Для сохранения корзины войдите в систему.`);
        return;
    }

    // Для авторизованных пользователей
    const session = getSession();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === session.username);

    if (userIndex !== -1) {
        const item = { name, price };
        users[userIndex].cart = users[userIndex].cart || [];
        users[userIndex].cart.push(item);
        localStorage.setItem('music_shop_users', JSON.stringify(users));
        
        // Обновляем отображение
        cart = users[userIndex].cart;
        updateCartDisplay();
        alert(`Товар "${name}" добавлен в корзину`);
    }
}

// Функция удаления товара из корзины
function removeFromCart(name) {
    if (!checkAuth()) {
        // Для неавторизованных пользователей
        cart = cart.filter(item => item.name !== name);
        saveCart();
        updateCartDisplay();
        return;
    }

    // Для авторизованных пользователей
    const session = getSession();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === session.username);

    if (userIndex !== -1) {
        users[userIndex].cart = users[userIndex].cart.filter(item => item.name !== name);
        localStorage.setItem('music_shop_users', JSON.stringify(users));
        
        // Обновляем отображение
        cart = users[userIndex].cart;
        updateCartDisplay();
    }
}

// Функция обновления отображения корзины
function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');
    
    // Очищаем корзину
    cartItems.innerHTML = '';
    
    // Добавляем товары
    let total = 0;
    cart.forEach(item => {
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <span class="item-name">${item.name}</span>
            <span class="item-price">${item.price} руб.</span>
            <button onclick="removeFromCart('${item.name}')" class="btn-remove">×</button>
        `;
        cartItems.appendChild(li);
        total += item.price;
    });
    
    // Обновляем общую сумму
    totalPrice.textContent = `Общая сумма: ${total} руб.`;
}

// Функция оформления заказа
function checkout() {
    if (cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }

    if (!checkAuth()) {
        if (confirm('Для оформления заказа необходимо войти в систему. Хотите перейти на страницу входа?')) {
            window.location.href = 'login.html?redirect=shop.html';
        }
        return;
    }

    const session = getSession();
    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === session.username);

    if (userIndex !== -1) {
        // Создаем заказ
        const order = {
            date: new Date().toISOString(),
            items: [...cart],
            total: cart.reduce((sum, item) => sum + item.price, 0),
            status: 'В обработке'
        };

        // Добавляем заказ в историю
        users[userIndex].orders = users[userIndex].orders || [];
        users[userIndex].orders.unshift(order);

        // Очищаем корзину
        users[userIndex].cart = [];
        localStorage.setItem('music_shop_users', JSON.stringify(users));
        
        // Обновляем локальную корзину
        cart = [];
        updateCartDisplay();
        
        alert(`Заказ оформлен! Номер заказа: #${users[userIndex].orders.length}. Общая сумма: ${order.total} руб.`);
    }
}

// Загрузка корзины для авторизованных пользователей
function loadUserCart() {
    const session = getSession();
    const users = getUsers();
    const user = users.find(u => u.username === session.username);

    if (user && user.cart) {
        cart = user.cart;
        updateCartDisplay();
    }
}

// Работа с корзиной для неавторизованных пользователей
function saveCart() {
    localStorage.setItem('guest_cart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('guest_cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartDisplay();
    }
}

// Перенос корзины при авторизации
function migrateCartToUser(username) {
    const savedCart = localStorage.getItem('guest_cart');
    if (!savedCart) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username);

    if (userIndex !== -1) {
        const guestCart = JSON.parse(savedCart);
        users[userIndex].cart = users[userIndex].cart || [];
        
        // Добавляем только уникальные товары
        guestCart.forEach(item => {
            if (!users[userIndex].cart.some(i => i.name === item.name)) {
                users[userIndex].cart.push(item);
            }
        });

        localStorage.setItem('music_shop_users', JSON.stringify(users));
        localStorage.removeItem('guest_cart');
    }
}

// Вспомогательные функции
function checkAuth() {
    const session = getSession();
    return session && session.isAuthenticated;
}

function getSession() {
    return JSON.parse(localStorage.getItem('music_shop_session'));
}

function getUsers() {
    return JSON.parse(localStorage.getItem('music_shop_users')) || [];
}

// Функция для переключения категорий
function toggleCategory(categoryId) {
    const category = document.getElementById(categoryId);
    const toggle = category.previousElementSibling;
    
    if (category.classList.contains('active')) {
        category.classList.remove('active');
        toggle.textContent = toggle.textContent.replace('▲', '▼');
    } else {
        category.classList.add('active');
        toggle.textContent = toggle.textContent.replace('▼', '▲');
    }
}