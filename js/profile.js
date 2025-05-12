// profile.js - Обработка личного кабинета пользователя

document.addEventListener('DOMContentLoaded', function() {
    // Проверяем авторизацию
    if (!checkAuth()) {
        return;
    }

    // Загружаем данные пользователя
    loadUserData();
    
    // Загружаем корзину пользователя
    loadUserCart();
    
    // Загружаем историю заказов
    loadOrderHistory();
});

/**
 * Загрузка данных пользователя
 */
function loadUserData() {
    const session = getSession();
    const users = getUsers();
    const currentUser = users.find(u => u.username === session.username);

    if (currentUser) {
        // Основная информация
        document.getElementById('username').textContent = currentUser.username;
        document.getElementById('user-email').textContent = currentUser.email;
        document.getElementById('reg-date').textContent = formatDate(currentUser.regDate);
    }
}

/**
 * Загрузка корзины пользователя
 */
function loadUserCart() {
    const session = getSession();
    const users = getUsers();
    const currentUser = users.find(u => u.username === session.username);
    
    const cartEmpty = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    
    if (!currentUser || !currentUser.cart || currentUser.cart.length === 0) {
        cartEmpty.style.display = 'block';
        cartContent.style.display = 'none';
        return;
    }
    
    cartEmpty.style.display = 'none';
    cartContent.style.display = 'block';
    
    const cartItems = document.getElementById('cartItemsProfile');
    cartItems.innerHTML = '';
    
    let total = 0;
    currentUser.cart.forEach(item => {
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
    
    document.getElementById('totalPriceProfile').textContent = `Общая сумма: ${total} руб.`;
}

/**
 * Загрузка истории заказов
 */
function loadOrderHistory() {
    const session = getSession();
    const users = getUsers();
    const currentUser = users.find(u => u.username === session.username);
    const orderHistory = document.getElementById('order-history');

    if (!currentUser || !currentUser.orders || currentUser.orders.length === 0) {
        orderHistory.innerHTML = '<p>У вас пока нет завершенных заказов</p>';
        return;
    }

    let html = '<div class="orders-list">';
    currentUser.orders.forEach((order, index) => {
        html += `
            <div class="order">
                <h4>Заказ #${index + 1} от ${formatDate(order.date)}</h4>
                <p>Статус: <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>
                <p>Товаров: ${order.items.length}</p>
                <p>Сумма: ${order.total} руб.</p>
                <button onclick="showOrderDetails(${index})" class="btn-details">Подробнее</button>
            </div>
        `;
    });
    html += '</div>';
    orderHistory.innerHTML = html;
}

/**
 * Добавление поля информации о пользователе
 */
function addUserInfoField(label, value) {
    const userInfo = document.querySelector('.user-info');
    const p = document.createElement('p');
    p.innerHTML = `${label}: <span>${value}</span>`;
    userInfo.appendChild(p);
}

/**
 * Удаление товара из корзины
 */
function removeFromCart(productName) {
    const session = getSession();
    let users = getUsers();
    const userIndex = users.findIndex(u => u.username === session.username);
    
    if (userIndex !== -1) {
        users[userIndex].cart = users[userIndex].cart.filter(item => item.name !== productName);
        localStorage.setItem('music_shop_users', JSON.stringify(users));
        loadUserCart();
    }
}

/**
 * Очистка корзины
 */
function clearCart() {
    if (!confirm('Вы уверены, что хотите очистить корзину?')) {
        return;
    }
    
    const session = getSession();
    let users = getUsers();
    const userIndex = users.findIndex(u => u.username === session.username);
    
    if (userIndex !== -1) {
        users[userIndex].cart = [];
        localStorage.setItem('music_shop_users', JSON.stringify(users));
        loadUserCart();
    }
}

/**
 * Оформление заказа
 */
function checkout() {
    const session = getSession();
    let users = getUsers();
    const userIndex = users.findIndex(u => u.username === session.username);
    
    if (userIndex === -1 || !users[userIndex].cart || users[userIndex].cart.length === 0) {
        alert('Корзина пуста!');
        return;
    }
    
    // Создаем заказ
    const order = {
        date: new Date().toISOString(),
        items: [...users[userIndex].cart],
        total: users[userIndex].cart.reduce((sum, item) => sum + item.price, 0),
        status: 'В обработке'
    };
    
    // Добавляем заказ в историю
    users[userIndex].orders = users[userIndex].orders || [];
    users[userIndex].orders.unshift(order);
    
    // Очищаем корзину
    users[userIndex].cart = [];
    
    // Сохраняем изменения
    localStorage.setItem('music_shop_users', JSON.stringify(users));
    
    // Обновляем интерфейс
    loadUserCart();
    loadOrderHistory();
    
    alert(`Заказ #${users[userIndex].orders.length} оформлен! Сумма: ${order.total} руб.`);
}

/**
 * Показать детали заказа
 */
function showOrderDetails(orderIndex) {
    const session = getSession();
    const users = getUsers();
    const currentUser = users.find(u => u.username === session.username);
    const order = currentUser.orders[orderIndex];
    
    let html = `<h4>Заказ #${orderIndex + 1} от ${formatDate(order.date)}</h4>`;
    html += `<p>Статус: <span class="status-${order.status.toLowerCase()}">${order.status}</span></p>`;
    html += '<ul class="order-items">';
    
    order.items.forEach(item => {
        html += `<li>${item.name} - ${item.price} руб.</li>`;
    });
    
    html += `</ul><p class="order-total">Итого: ${order.total} руб.</p>`;
    
    // Можно использовать модальное окно или другой способ отображения
    alert(html.replace(/<[^>]*>/g, '')); // Простой alert без HTML
}

/**
 * Форматирование даты
 */
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
}

// Вспомогательные функции для работы с auth.js

function checkAuth() {
    const session = getSession();
    if (!session || !session.isAuthenticated) {
        window.location.href = 'login.html?redirect=' + encodeURIComponent(window.location.pathname);
        return false;
    }
    return true;
}

function getSession() {
    return JSON.parse(localStorage.getItem('music_shop_session'));
}

function getUsers() {
    return JSON.parse(localStorage.getItem('music_shop_users')) || [];
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        localStorage.removeItem('music_shop_session');
        window.location.href = 'login.html';
    }
}