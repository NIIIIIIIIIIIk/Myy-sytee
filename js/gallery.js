// Инициализация слайдера
let currentSlide = 0;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;
const thumbnailsContainer = document.getElementById('thumbnails');
const currentSlideIndicator = document.getElementById('current-slide');
const totalSlidesIndicator = document.getElementById('total-slides');

// Установка общего количества слайдов
totalSlidesIndicator.textContent = totalSlides;

// Создание миниатюр
function createThumbnails() {
    slides.forEach((slide, index) => {
        const img = slide.querySelector('img');
        const thumbnail = document.createElement('img');
        thumbnail.src = img.src;
        thumbnail.alt = img.alt;
        thumbnail.dataset.index = index;
        
        if (index === 0) {
            thumbnail.classList.add('active-thumb');
        }
        
        thumbnail.addEventListener('click', () => {
            goToSlide(index);
        });
        
        thumbnailsContainer.appendChild(thumbnail);
    });
}

// Переход к конкретному слайду
function goToSlide(index) {
    // Проверка границ
    if (index >= totalSlides) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = totalSlides - 1;
    } else {
        currentSlide = index;
    }
    
    // Обновление слайдера
    const slider = document.querySelector('.slider');
    slider.style.transform = `translateX(-${currentSlide * 100}%)`;
    
    // Обновление активного класса
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    
    // Обновление индикатора
    currentSlideIndicator.textContent = currentSlide + 1;
    
    // Обновление активной миниатюры
    document.querySelectorAll('.thumbnails img').forEach((thumb, i) => {
        thumb.classList.toggle('active-thumb', i === currentSlide);
        
        // Прокрутка к активной миниатюре
        if (i === currentSlide) {
            thumb.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    });
}

// Переключение слайдов
function changeSlide(direction) {
    goToSlide(currentSlide + direction);
}

// Автоматическое перелистывание
let slideInterval;

function startAutoSlide() {
    slideInterval = setInterval(() => {
        changeSlide(1);
    }, 2500);
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    createThumbnails();
    
    // Автопрокрутка
    startAutoSlide();
    
    // Остановка автопрокрутки при наведении
    const sliderContainer = document.querySelector('.slider-container');
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
    
    // Управление с клавиатуры
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            changeSlide(-1);
        } else if (e.key === 'ArrowRight') {
            changeSlide(1);
        }
    });
});