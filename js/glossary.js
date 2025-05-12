// Музыкальные термины и их определения
const musicalTerms = [
    {
        term: "Гитара",
        definition: "Струнный щипковый музыкальный инструмент. Применяется в качестве аккомпанирующего или сольного инструмента во многих стилях и направлениях музыки.",
        related: ["Акустическая гитара", "Электрогитара", "Бас-гитара"]
    },
    {
        term: "Синтезатор",
        definition: "Электронный музыкальный инструмент, создающий звук при помощи генераторов звуковых волн. Может имитировать звучание других инструментов или создавать уникальные звуки.",
        related: ["MIDI-контроллер", "Сэмплер", "Рабочая станция"]
    },
    {
        term: "Барабаны",
        definition: "Ударный музыкальный инструмент, состоящий из мембран, натянутых на корпус. Играют палочками, специальными щётками или руками.",
        related: ["Барабанная установка", "Перкуссия", "Том-том"]
    },
    {
        term: "Пианино",
        definition: "Клавишный струнный музыкальный инструмент с вертикальным расположением струн. Широко используется для обучения музыке и домашнего музицирования.",
        related: ["Рояль", "Фортепиано", "Клавесин"]
    },
    {
        term: "Скрипка",
        definition: "Смычковый струнный музыкальный инструмент с четырьмя струнами, настроенными по квинтам. Имеет высокий регистр и широкий диапазон выразительных возможностей.",
        related: ["Альт", "Виолончель", "Контрабас"]
    },
    {
        term: "Аккорд",
        definition: "Сочетание нескольких звуков разной высоты, воспринимаемое как звуковое единство. Основной элемент гармонии в музыке.",
        related: ["Трезвучие", "Септаккорд", "Арпеджио"]
    },
    {
        term: "Тембр",
        definition: "Окраска звука, позволяющая различать звуки одинаковой высоты и громкости, но издаваемые разными инструментами или голосами.",
        related: ["Обертоны", "Гармоники", "Спектр звука"]
    }
];

// Инициализация словаря
document.addEventListener('DOMContentLoaded', function() {
    const termsList = document.getElementById('termsList');
    const searchInput = document.getElementById('searchTerm');
    const playSoundBtn = document.getElementById('playSound');
    
    // Заполняем список терминов
    renderTerms(musicalTerms);
    
    // Поиск терминов
    searchInput.addEventListener('input', function() {
        const searchText = this.value.toLowerCase();
        const filteredTerms = musicalTerms.filter(term => 
            term.term.toLowerCase().includes(searchText) ||
            term.definition.toLowerCase().includes(searchText) ||
            (term.related && term.related.some(r => r.toLowerCase().includes(searchText)))
        );
        renderTerms(filteredTerms);
    });
    
    // Воспроизведение звука
    playSoundBtn.addEventListener('click', function() {
        const currentTerm = musicalTerms.find(t => t.term === document.getElementById('termTitle').textContent);
        if (currentTerm && currentTerm.sound) {
            const audio = new Audio(currentTerm.sound);
            audio.play();
        }
    });
});

// Отображение списка терминов
function renderTerms(terms) {
    const termsList = document.getElementById('termsList');
    termsList.innerHTML = '';
    
    if (terms.length === 0) {
        termsList.innerHTML = '<p class="no-results">Ничего не найдено</p>';
        return;
    }
    
    terms.forEach(term => {
        const termItem = document.createElement('div');
        termItem.className = 'term-item';
        termItem.textContent = term.term;
        termItem.addEventListener('click', () => showDefinition(term));
        termsList.appendChild(termItem);
    });
    
    // Показываем первый термин по умолчанию
    if (terms.length > 0) {
        showDefinition(terms[0]);
        termsList.firstChild.classList.add('active');
    }
}

// Показать определение термина
function showDefinition(term) {
    const termTitle = document.getElementById('termTitle');
    const definitionContent = document.getElementById('definitionContent');
    const relatedTerms = document.getElementById('relatedTerms');
    const playSoundBtn = document.getElementById('playSound');
    
    // Удаляем активный класс у всех терминов
    document.querySelectorAll('.term-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Добавляем активный класс к выбранному термину
    const activeTerm = [...document.querySelectorAll('.term-item')].find(item => 
        item.textContent === term.term
    );
    if (activeTerm) activeTerm.classList.add('active');
    
    // Заполняем информацию о термине
    termTitle.textContent = term.term;
    definitionContent.innerHTML = `<p>${term.definition}</p>`;
    
    // Кнопка воспроизведения звука
    playSoundBtn.disabled = !term.sound;
    
    // Связанные термины
    if (term.related && term.related.length > 0) {
        relatedTerms.innerHTML = `
            <h4>Связанные термины:</h4>
            <ul>
                ${term.related.map(t => `<li onclick="showRelatedTerm('${t}')">${t}</li>`).join('')}
            </ul>
        `;
    } else {
        relatedTerms.innerHTML = '';
    }
    
    // Прокручиваем к выбранному термину
    if (activeTerm) {
        activeTerm.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        });
    }
}

// Показать связанный термин
function showRelatedTerm(termName) {
    const term = musicalTerms.find(t => t.term === termName);
    if (term) {
        showDefinition(term);
    } else {
        // Если точного совпадения нет, ищем похожие
        const similarTerm = musicalTerms.find(t => 
            t.term.includes(termName) || 
            (t.related && t.related.includes(termName))
        );
        if (similarTerm) showDefinition(similarTerm);
    }
}

// Для использования в консоли
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { musicalTerms, showDefinition };
}