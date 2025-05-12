document.addEventListener('DOMContentLoaded', function() {
    // Проверка прав администратора
    const session = getSession();
    if (!session.isAuthenticated || session.role !== 'admin') {
        alert('Доступ запрещен!');
        window.location.href = 'login.html';
        return;
    }

    // Инициализация админ-панели
    initAdminPanel();

    // Загрузка данных при первой загрузке
    loadAdminContent('products');
});

/**
 * Инициализация админ-панели
 */
function initAdminPanel() {
    // Обработчики для вкладок
    document.getElementById('admin-products').addEventListener('click', function(e) {
        e.preventDefault();
        loadAdminContent('products');
        setActiveTab(this);
    });

    document.getElementById('admin-orders').addEventListener('click', function(e) {
        e.preventDefault();
        loadAdminContent('orders');
        setActiveTab(this);
    });

    document.getElementById('admin-users').addEventListener('click', function(e) {
        e.preventDefault();
        loadAdminContent('users');
        setActiveTab(this);
    });

    // Кнопка выхода
    document.querySelector('.btn-logout').addEventListener('click', logout);
}

/**
 * Загрузка контента для админ-панели
 * @param {string} section - Раздел для загрузки (products|orders|users)
 */
function loadAdminContent(section) {
    const contentDiv = document.getElementById('admin-content');
    contentDiv.innerHTML = '<div class="loading">Загрузка...</div>';

    // Имитация загрузки данных (в реальном приложении здесь будет AJAX-запрос)
    setTimeout(() => {
        switch (section) {
            case 'products':
                contentDiv.innerHTML = getProductsContent();
                initProductsTable();
                break;
            case 'orders':
                contentDiv.innerHTML = getOrdersContent();
                initOrdersTable();
                break;
            case 'users':
                contentDiv.innerHTML = getUsersContent();
                initUsersTable();
                break;
        }
    }, 500);
}

/**
 * Установка активной вкладки
 * @param {HTMLElement} tabElement - Элемент вкладки
 */
function setActiveTab(tabElement) {
    // Удаляем активный класс у всех вкладок
    document.querySelectorAll('.admin-nav a').forEach(tab => {
        tab.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранной вкладке
    tabElement.classList.add('active');
}

/**
 * Генерация HTML для раздела "Товары"
 */
function getProductsContent() {
    return `
        <h2>Управление товарами</h2>
        <div class="admin-toolbar">
            <button class="btn btn-primary" onclick="showAddProductForm()">Добавить товар</button>
            <div class="admin-search">
                <input type="text" id="product-search" placeholder="Поиск товаров...">
                <button class="btn btn-search">Найти</button>
            </div>
        </div>
        <div class="admin-table-container">
            <table id="products-table" class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Название</th>
                        <th>Категория</th>
                        <th>Цена</th>
                        <th>Остаток</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Данные будут загружены динамически -->
                </tbody>
            </table>
        </div>
        <div id="product-form-modal" class="modal" style="display:none;">
            <!-- Форма добавления/редактирования товара -->
        </div>
    `;
}

/**
 * Генерация HTML для раздела "Заказы"
 */
function getOrdersContent() {
    return `
        <h2>Управление заказами</h2>
        <div class="admin-filters">
            <select id="order-status-filter">
                <option value="all">Все статусы</option>
                <option value="new">Новые</option>
                <option value="processing">В обработке</option>
                <option value="completed">Завершенные</option>
                <option value="cancelled">Отмененные</option>
            </select>
            <input type="date" id="order-date-filter">
        </div>
        <div class="admin-table-container">
            <table id="orders-table" class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Пользователь</th>
                        <th>Дата</th>
                        <th>Сумма</th>
                        <th>Статус</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Данные будут загружены динамически -->
                </tbody>
            </table>
        </div>
    `;
}

/**
 * Генерация HTML для раздела "Пользователи"
 */
function getUsersContent() {
    return `
        <h2>Управление пользователями</h2>
        <div class="admin-toolbar">
            <button class="btn btn-primary" onclick="showAddUserForm()">Добавить пользователя</button>
            <div class="admin-search">
                <input type="text" id="user-search" placeholder="Поиск пользователей...">
                <button class="btn btn-search">Найти</button>
            </div>
        </div>
        <div class="admin-table-container">
            <table id="users-table" class="admin-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Логин</th>
                        <th>Email</th>
                        <th>Роль</th>
                        <th>Дата регистрации</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    <!-- Данные будут загружены динамически -->
                </tbody>
            </table>
        </div>
        <div id="user-form-modal" class="modal" style="display:none;">
            <!-- Форма добавления/редактирования пользователя -->
        </div>
    `;
}

/**
 * Инициализация таблицы товаров
 */
function initProductsTable() {
    // В реальном приложении здесь будет загрузка данных с сервера
    const products = [
        { id: 1, name: 'Гитара Fender FA-125', category: 'Акустические гитары', price: 12500, stock: 5 },
        { id: 2, name: 'Гитара Yamaha C40', category: 'Акустические гитары', price: 15800, stock: 3 },
        { id: 3, name: 'Gibson Les Paul Standard', category: 'Электрогитары', price: 120000, stock: 2 },
        { id: 4, name: 'Yamaha PSR-E373', category: 'Синтезаторы', price: 25000, stock: 7 }
    ];

    const tbody = document.querySelector('#products-table tbody');
    tbody.innerHTML = products.map(product => `
        <tr>
            <td>${product.id}</td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>${product.price} руб.</td>
            <td>${product.stock}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editProduct(${product.id})">✏️</button>
                <button class="btn btn-delete" onclick="deleteProduct(${product.id})">🗑️</button>
            </td>
        </tr>
    `).join('');
}

/**
 * Инициализация таблицы заказов
 */
function initOrdersTable() {
    // В реальном приложении здесь будет загрузка данных с сервера
    const orders = [
        { id: 1001, user: 'user1', date: '2023-05-15', amount: 28500, status: 'completed' },
        { id: 1002, user: 'user2', date: '2023-05-16', amount: 120000, status: 'processing' },
        { id: 1003, user: 'admin', date: '2023-05-17', amount: 25000, status: 'new' }
    ];

    const tbody = document.querySelector('#orders-table tbody');
    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>${order.id}</td>
            <td>${order.user}</td>
            <td>${order.date}</td>
            <td>${order.amount} руб.</td>
            <td><span class="status-${order.status}">${getStatusText(order.status)}</span></td>
            <td class="actions">
                <button class="btn btn-view" onclick="viewOrderDetails(${order.id})">👁️</button>
                <button class="btn btn-edit" onclick="editOrderStatus(${order.id})">✏️</button>
            </td>
        </tr>
    `).join('');

    // Обработчики фильтров
    document.getElementById('order-status-filter').addEventListener('change', filterOrders);
    document.getElementById('order-date-filter').addEventListener('change', filterOrders);
}

/**
 * Инициализация таблицы пользователей
 */
function initUsersTable() {
    const users = getUsers();
    const tbody = document.querySelector('#users-table tbody');
    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${users.indexOf(user) + 1}</td>
            <td>${user.username}</td>
            <td>${user.email}</td>
            <td>${user.role === 'admin' ? 'Администратор' : 'Пользователь'}</td>
            <td>${new Date(user.regDate).toLocaleDateString()}</td>
            <td class="actions">
                <button class="btn btn-edit" onclick="editUser('${user.username}')">✏️</button>
                ${user.role !== 'admin' ? `<button class="btn btn-delete" onclick="deleteUser('${user.username}')">🗑️</button>` : ''}
            </td>
        </tr>
    `).join('');

    // Обработчик поиска
    document.getElementById('user-search').addEventListener('input', searchUsers);
}

/**
 * Вспомогательные функции
 */

function getStatusText(status) {
    const statuses = {
        'new': 'Новый',
        'processing': 'В обработке',
        'completed': 'Завершен',
        'cancelled': 'Отменен'
    };
    return statuses[status] || status;
}

function filterOrders() {
    const statusFilter = document.getElementById('order-status-filter').value;
    const dateFilter = document.getElementById('order-date-filter').value;
    
    // Здесь будет логика фильтрации
    console.log('Фильтрация по:', statusFilter, dateFilter);
}

function searchUsers() {
    const searchTerm = document.getElementById('user-search').value.toLowerCase();
    const rows = document.querySelectorAll('#users-table tbody tr');
    
    rows.forEach(row => {
        const username = row.cells[1].textContent.toLowerCase();
        const email = row.cells[2].textContent.toLowerCase();
        if (username.includes(searchTerm) || email.includes(searchTerm)) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    });
}

/**
 * Функции для работы с товарами
 */

function showAddProductForm() {
    // Реализация формы добавления товара
    alert('Форма добавления товара будет здесь');
}

function editProduct(id) {
    // Реализация редактирования товара
    console.log('Редактирование товара ID:', id);
}

function deleteProduct(id) {
    if (confirm('Вы уверены, что хотите удалить этот товар?')) {
        console.log('Удаление товара ID:', id);
    }
}

/**
 * Функции для работы с заказами
 */

function viewOrderDetails(id) {
    // Реализация просмотра деталей заказа
    console.log('Просмотр заказа ID:', id);
}

function editOrderStatus(id) {
    // Реализация изменения статуса заказа
    console.log('Изменение статуса заказа ID:', id);
}

/**
 * Функции для работы с пользователями
 */

function showAddUserForm() {
    // Реализация формы добавления пользователя
    alert('Форма добавления пользователя будет здесь');
}

function editUser(username) {
    // Реализация редактирования пользователя
    console.log('Редактирование пользователя:', username);
}

function deleteUser(username) {
    if (confirm(`Вы уверены, что хотите удалить пользователя ${username}?`)) {
        const users = getUsers();
        const updatedUsers = users.filter(u => u.username !== username);
        localStorage.setItem('music_shop_users', JSON.stringify(updatedUsers));
        initUsersTable(); // Обновляем таблицу
    }
}

// Экспорт функций для использования в HTML
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;
window.viewOrderDetails = viewOrderDetails;
window.editOrderStatus = editOrderStatus;
window.showAddProductForm = showAddProductForm;
window.showAddUserForm = showAddUserForm;
window.editUser = editUser;
window.deleteUser = deleteUser;
window.searchUsers = searchUsers;
window.filterOrders = filterOrders;