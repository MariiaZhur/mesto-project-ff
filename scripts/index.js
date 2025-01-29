// @todo: Темплейт карточки (вытаскиваем cодержимое шаблона)
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
function makeCard({ name, link }) {
  const cardElement = cardTemplate.cloneNode(true);

  // Находим элементы только один раз для каждого клона
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  // Заполняем карточку
  cardTitle.textContent = name;
  cardImage.src = link;
  cardImage.alt = name;

  // Добавляем обработчик удаления
  deleteButton.addEventListener("click", () => deleteCard(cardElement));
  // Добавляем карточку в список
  placesList.append(cardElement);
}
// @todo: Вывести карточки на страницу
// метод forEach
initialCards.forEach(makeCard);
