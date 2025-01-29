// @todo: Темплейт карточки (вытаскиваем содержимое шаблона)
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");

// @todo: DOM узлы
const placesList = document.querySelector(".places__list");

// @todo: Функция удаления карточки
function deleteCard(cardElement) {
  cardElement.remove();
}

// @todo: Функция создания карточки
function makeCard({ name, link }, handleDelete) {
  const cardElement = cardTemplate.cloneNode(true);

  // Находим элементы только один раз для каждого клона
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");

  // Заполняем карточку
  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

  // Добавляем обработчик удаления с переданной функцией
  deleteButton.addEventListener("click", () => handleDelete(cardElement));

  return cardElement; // Функция возвращает созданную карточку
}

// @todo: Вывести карточки на страницу, вставляем карточки в DOM при итерации forEach
initialCards.forEach((cardData) => {
  const cardElement = makeCard(cardData, deleteCard);
  placesList.append(cardElement);
});
