let cart = [];

function validateAuthForm() {
    const username = document.getElementById("username").value;
    const dob = document.getElementById("dob").value;
    
    let valid = true;

    // Проверка логина
    if (!/^[а-яА-Я0-9]{4,10}$/.test(username)) {
        document.getElementById("usernameError").innerText = "Логин должен содержать от 4 до 10 символов.";
        valid = false;
    } else {
        document.getElementById("usernameError").innerText = "";
    }

    // Проверка даты рождения
    if (!dob || new Date(dob) > new Date()) { // Исправлено условие
        document.getElementById("dobError").innerText = "Дата рождения обязательна и не может быть позже текущей.";
        valid = false;
    } else {
        document.getElementById("dobError").innerText = "";
    }

    // Если все проверки пройдены, сохраняем данные и переходим на другую страницу
    if (valid) {
        localStorage.setItem("username", username);
        window.location.href = "description.html";
    }

    return false; // Отменяем стандартное поведение формы
}

// Функция для отображения определения термина в словаре.
function showDefinition(term) {
   const definitions = {
       "гитара": "Струнный музыкальный инструмент.",
       "синтезатор": "Электронный музыкальный инструмент.",
       // Добавьте другие определения здесь.
   };
   document.getElementById("definition").innerText = definitions[term] || "Определение не найдено."; // Исправлено использование оператора ||
}

// Функция для поиска термина в словаре.
document.getElementById("searchTerm").addEventListener("input", function() {
   const searchTerm = this.value.toLowerCase();
   const terms = document.querySelectorAll("#termsList li");
   terms.forEach(function(term) {
       if (term.textContent.toLowerCase().includes(searchTerm)) {
           term.style.display = "block";
       } else {
           term.style.display = "none";
       }
   });
});

let currentSlide = 0;
const slides = [
    "images/slide1.jpg",
    "images/slide2.jpg",
    "images/slide3.jpg",
    "images/slide4.jpg",
    "images/slide5.jpg",
];

function changeSlide(direction) {
    currentSlide += direction;

    if (currentSlide < 0) {
        currentSlide = slides.length - 1;
    } else if (currentSlide >= slides.length) { // Исправлено 'slides.lnegth'
        currentSlide = 0;
    }

    document.getElementById('slideImage').src = slides[currentSlide]; // Исправлено 'scr' на 'src'
    document.getElementById('slideIndicator').textContent = (currentSlide + 1) + ' из ' + slides.length;
}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('slideImage').src = slides[currentSlide];
    document.getElementById('slideIndicator').textContent = (currentSlide + 1) + ' из ' + slides.length;
});