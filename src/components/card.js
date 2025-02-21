import { openModalImage, closeModal } from "./modal.js";

// Функция создания карточки
export function makeCard({ name: title, link }, cardTemplate) {
  const cardElement = cardTemplate.cloneNode(true);

  // Находим элементы внутри карточки
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button"); // Находим кнопку лайка

  // Заполняем карточку
  cardTitle.textContent = title;
  cardImage.src = link;
  cardImage.alt = title;

  // Добавление обработчика клика по картинке
  cardImage.addEventListener("click", () => openModalImage(title, link));

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
//обработка и отправка новой карточки
export function handleNewCardSubmit(
  event,
  newCardModal,
  newCardForm,
  cardTemplate,
  placesList
) {
  event.preventDefault(); // Отменяем стандартное поведение формы

  // Находим инпуты
  const placeNameInput = newCardForm.querySelector(
    ".popup__input_type_card-name"
  );
  const placeLinkInput = newCardForm.querySelector(".popup__input_type_url");

  // Создаём объект новой карточки
  const newCardInfo = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  // Создаём карточку и добавляем в начало списка
  const newCard = makeCard(newCardInfo, cardTemplate, openModalImage);
  placesList.prepend(newCard);

  // Очищаем форму
  newCardForm.reset();

  // Закрываем модальное окно
  closeModal(newCardModal);
}
