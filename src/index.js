import { Mtg } from "./api/mtg";
import { ColorStats } from "./widgets/colorStats";
import { ManaCostStats } from "./widgets/manaCostStats";

document.addEventListener("DOMContentLoaded", setup);

let deck = []; // Инициализация колоды

function setup() {
    const mtg = new Mtg();
    const deckContainer = document.getElementById('deckContainer'); // Элемент для отображения колоды

    mtg.loadCards()
        .then((cards) => {
            const menu = document.getElementById('listContainer');
            const list = document.createElement('ul');

            cards.forEach(card => {
                const listItem = document.createElement('li');
                listItem.innerHTML = card.name;
                listItem.addEventListener('click', () => {
                    displayCardDetails(card); // Отображаем детали карты
                });
                list.appendChild(listItem);
            });

            menu.innerHTML = '';
            menu.appendChild(list);
            updateWidgets(deck); // Инициализация виджетов
        });
}

// Функция для отображения деталей карты
function displayCardDetails(card) {
    const cardDetailContainer = document.getElementById('cardDetails');
    cardDetailContainer.innerHTML = '';

    const img = document.createElement('img');
    img.src = card.imageUrl;
    img.alt = card.name;

    const description = document.createElement('p');
    description.textContent = card.text || "No description available.";

    const addButton = document.createElement('button');
    addButton.textContent = 'Add to Deck';
    addButton.addEventListener('click', () => {
        addToDeck(card);
        updateWidgets(deck); // Обновляем виджеты
    });

    cardDetailContainer.appendChild(img);
    cardDetailContainer.appendChild(description);
    cardDetailContainer.appendChild(addButton);
}

// Функция для добавления карты в колоду
function addToDeck(card) {
    const existingCard = deck.find(c => c.id === card.id);
    if (existingCard) {
        // Увеличиваем количество, если карта уже в колоде
        if (existingCard.count < (card.rarity === 'Rare' || card.rarity === 'Mythic' ? 1 : 4)) {
            existingCard.count++;
        }
    } else {
        // Добавляем новую карту в колоду
        deck.push({ ...card, count: 1 });
    }
    displayDeck(deck, deckContainer); // Обновляем отображение колоды
}

// Функция для отображения колоды
function displayDeck(deck, deckContainer) {
    deckContainer.innerHTML = '';

    deck.forEach(card => {
        const cardDiv = document.createElement('div');
        cardDiv.classList.add('deck-card');

        const img = document.createElement('img');
        img.src = card.imageUrl;
        img.alt = card.name;

        const count = document.createElement('span');
        count.textContent = `x${card.count}`;

        const removeButton = document.createElement('button');
        removeButton.textContent = 'Remove';
        removeButton.addEventListener('click', () => {
            removeFromDeck(card);  // Функция удаления карты
        });

        cardDiv.appendChild(img);
        cardDiv.appendChild(count);
        cardDiv.appendChild(removeButton);

        deckContainer.appendChild(cardDiv);
    });
}

// Функция для удаления карты из колоды
function removeFromDeck(card) {
    const cardIndex = deck.findIndex(c => c.id === card.id);
    if (cardIndex > -1) {
        // Уменьшаем количество карт или полностью удаляем карту
        if (deck[cardIndex].count > 1) {
            deck[cardIndex].count--;
        } else {
            deck.splice(cardIndex, 1);
        }

        // Обновляем отображение колоды
        displayDeck(deck, document.getElementById('deckContainer'));
        
        // Пересчитываем и обновляем виджеты
        updateWidgets(deck);
    }
}

// Функция для обновления виджетов
function updateWidgets(deck) {
    const colorStatsElement = document.getElementById("colorStats");
    const manaStatsElement = document.getElementById("manaStats");

    // Очищаем старые виджеты
    colorStatsElement.innerHTML = '';
    manaStatsElement.innerHTML = '';

    // Создаём новые виджеты с обновлёнными данными колоды
    new ColorStats(deck).buildStats(colorStatsElement);
    new ManaCostStats(deck).buildStats(manaStatsElement);
}
