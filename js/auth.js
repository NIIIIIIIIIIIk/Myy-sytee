/**
 */
function initAdmin() {
    const users = getUsers();
    const adminExists = users.some(u => u.role === 'admin');
    
    if (!adminExists) {
        const admin = {
            username: 'admin',
            email: 'admin@musicstore.com',
            password: 'admin123', 
            gender: 'male',
            regDate: new Date().toISOString(),
            role: 'admin',
            cart: [],
            orders: []
        };
        users.push(admin);
        localStorage.setItem('music_shop_users', JSON.stringify(users));
        console.log('Аккаунт администратора создан');
    }
}


initAdmin();

/**

 */
document.addEventListener('DOMContentLoaded', function() {
    console.log('Auth module loaded');
    

    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleRegistration(event);
        });
    }

    const loginForm = document.getElementById('authForm');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault();
            handleLogin(event);
        });
    }
});

/**
 
 */
function handleLogin(event) {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) {
        showError('Неверный логин или пароль', 'passwordError');
        return false;
    }
    
   
    const sessionData = {
        isAuthenticated: true,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        regDate: user.regDate,
        lastLogin: new Date().toISOString()
    };
    
    localStorage.setItem('music_shop_session', JSON.stringify(sessionData));
    
    // Перенаправление по роли
    if (user.role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || 'profile.html';
        window.location.href = redirectUrl;
    }
    
    return true;
}

/**

 */
function handleRegistration(event) {
    const formData = {
        username: document.getElementById('reg-username').value.trim(),
        email: document.getElementById('reg-email').value.trim(),
        password: document.getElementById('reg-password').value,
        passwordConfirm: document.getElementById('reg-password-confirm').value,
        gender: document.getElementById('reg-gender').value
    };

    if (!validateRegistrationForm(formData)) return false;
    if (userExists(formData.username, formData.email)) return false;

    registerUser(formData);
    

    if (authenticateUser(formData.username, formData.password)) {
        redirectAfterLogin();
    } else {
        window.location.href = 'login.html';
    }
}

/**

 */
function validateRegistrationForm(formData) {
    const usernameRegex = /^[A-Za-z0-9]{4,10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let isValid = true;


    if (!formData.username) {
        showError('Логин обязателен', 'usernameError');
        isValid = false;
    } else if (!usernameRegex.test(formData.username)) {
        showError('4-10 латинских букв/цифр', 'usernameError');
        isValid = false;
    } else {
        hideError('usernameError');
    }


    if (!formData.email) {
        showError('Email обязателен', 'emailError');
        isValid = false;
    } else if (!emailRegex.test(formData.email)) {
        showError('Некорректный email', 'emailError');
        isValid = false;
    } else {
        hideError('emailError');
    }


    if (!formData.password) {
        showError('Пароль обязателен', 'passwordError');
        isValid = false;
    } else if (formData.password.length < 6) {
        showError('Минимум 6 символов', 'passwordError');
        isValid = false;
    } else {
        hideError('passwordError');
    }


    if (!formData.passwordConfirm) {
        showError('Подтвердите пароль', 'passwordConfirmError');
        isValid = false;
    } else if (formData.password !== formData.passwordConfirm) {
        showError('Пароли не совпадают', 'passwordConfirmError');
        isValid = false;
    } else {
        hideError('passwordConfirmError');
    }

    return isValid;
}

/**

 */
function userExists(username, email) {
    const users = getUsers();
    
    if (users.some(u => u.username === username)) {
        showError('Логин занят', 'usernameError');
        return true;
    }

    if (users.some(u => u.email === email)) {
        showError('Email уже используется', 'emailError');
        return true;
    }

    return false;
}

/**

 */
function registerUser(userData) {
    const users = getUsers();
    
    const newUser = {
        username: userData.username,
        email: userData.email,
        password: userData.password,
        gender: userData.gender,
        regDate: new Date().toISOString(),
        role: 'user',
        cart: [],
        orders: []
    };

    users.push(newUser);
    localStorage.setItem('music_shop_users', JSON.stringify(users));
}

/**

 */
function authenticateUser(username, password) {
    const users = getUsers();
    const user = users.find(u => u.username === username && u.password === password);
    
    if (!user) return false;

    migrateCartToUser(username);

    const sessionData = {
        isAuthenticated: true,
        username: user.username,
        email: user.email,
        role: user.role || 'user',
        regDate: user.regDate,
        lastLogin: new Date().toISOString()
    };

    localStorage.setItem('music_shop_session', JSON.stringify(sessionData));
    return true;
}

/**

 */
function redirectAfterLogin() {
    const session = getSession();
    if (session.role === 'admin') {
        window.location.href = 'admin.html';
    } else {
        const urlParams = new URLSearchParams(window.location.search);
        const redirectUrl = urlParams.get('redirect') || 'profile.html';
        window.location.href = redirectUrl;
    }
}

/**

 */
function migrateCartToUser(username) {
    const guestCart = localStorage.getItem('guest_cart');
    if (!guestCart) return;

    const users = getUsers();
    const userIndex = users.findIndex(u => u.username === username);
    
    if (userIndex !== -1) {
        users[userIndex].cart = JSON.parse(guestCart);
        localStorage.setItem('music_shop_users', JSON.stringify(users));
        localStorage.removeItem('guest_cart');
    }
}

/**

 */
function isAdmin() {
    const session = getSession();
    return session && session.isAuthenticated && session.role === 'admin';
}

/**

 */
function logout() {
    localStorage.removeItem('music_shop_session');
    window.location.href = 'login.html';
}

/**

 */
function getSession() {
    return JSON.parse(localStorage.getItem('music_shop_session')) || {};
}

/**

 */
function getUsers() {
    return JSON.parse(localStorage.getItem('music_shop_users')) || [];
}

/**

 */
function showError(message, elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = message;
        element.style.display = 'block';
    }
}

/**

 */
function hideError(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = '';
        element.style.display = 'none';
    }
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        handleLogin,
        handleRegistration,
        isAdmin,
        logout,
        getSession,
        getUsers
    };
}