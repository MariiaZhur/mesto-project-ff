// Функция создания карточки
export function makeCard(cardData, cardTemplate, onOpenModal) {
  const cardElement = cardTemplate.cloneNode(true);

  // Находим элементы внутри карточки
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button"); // Находим кнопку лайка

  // Заполняем карточку
  cardTitle.textContent = cardData.name;
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;

  // Добавление обработчика клика по картинке
  // Используем переданный колбэк
  cardImage.addEventListener("click", () => onOpenModal(cardData.name, cardData.link)); 

  // Добавляем обработчик удаления
  deleteButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Останавливаем события
    deleteCardPlace(cardElement); // Удаляем карточку
  });
  // обработчик лайка
  likeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Останавливаем всплытие другого события
    toggleLike(likeButton); // вызывает функцию toggleLike, передаем ей кнопку как аргумент
  });

  return cardElement; // Возвращаем созданную карточку
}
// Функция удаления карточки
function deleteCardPlace(cardElement) {
  cardElement.remove();
}
// Функция переключения стиля лайка
function toggleLike(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

