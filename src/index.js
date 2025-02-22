import "./pages/index.css"; //подключаем файл стилей

import { initialCards } from "./components/cards.js";
import { makeCard } from "./components/card.js";
import {
  initModalGlobal,
  populateProfileEditForm,
  closeModal,
  openModal,
  initModal,
  handleProfileEditFormSubmit
} from "./components/modal.js";

// ======= ОБЪЯВЛЕНИЕ ПЕРЕМЕННЫХ ======== //
// Темплейт карточки (вытаскиваем содержимое шаблона)
const cardTemplate = document
.querySelector("#card-template")
.content.querySelector(".places__item");

// Список карточек
const placesList = document.querySelector(".places__list");

// Находим форму в DOM
const profileForm = document.querySelector(".popup__form[name='edit-profile']");

const profileEditButton = document.querySelector(".profile__edit-button");
const profileEditModal = document.querySelector(".popup_type_edit");
// Связь между формой редактирования профиля и его отображением в документе
const profileAssignmentRout = {
  formInput: {
    // Тут поля для ввода и редактирования в форме
    name : profileEditModal.querySelector(".popup__input_type_name"),
    description: profileEditModal.querySelector(".popup__input_type_description")
  },
  documentText: {
    // Тут элементы для вывода текста в документе
    name: document.querySelector(".profile__title"),
    description: document.querySelector(".profile__description")
  }
}

const newCardAddButton = document.querySelector(".profile__add-button");
const newCardAddModal = document.querySelector(".popup_type_new-card");

const newCardFormElement = newCardAddModal.querySelector(".popup__form");

// Объявляем переменные для элементов попапа с просмотром изображения
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupElementImg = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// ========== ФУНКЦИИ ========= //

// Функция открытия попапа с картинкой
//модальное окно с картинкой
function openModalImage(imageTitle, imageLink) {
  imagePopupElementImg.src = imageLink;
  imagePopupElementImg.alt = imageTitle;
  imagePopupCaption.textContent = imageTitle;

  openModal(imagePopup);
}
//обработка и отправка новой карточки
function handleNewCardSubmit(
  event,
  newCardModal,
  newCardForm,
  cardTemplate,
  placesList
) {
  event.preventDefault(); // Отменяем стандартное поведение формы

  // Находим инпуты
  const placeNameInput = newCardForm.querySelector(".popup__input_type_card-name");
  const placeLinkInput = newCardForm.querySelector(".popup__input_type_url");

  // Создаём объект новой карточки
  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  // Создаём карточку и добавляем в начало списка
  const newCard = makeCard(newCardData, cardTemplate, openModalImage);
  placesList.prepend(newCard);

  // Очищаем форму
  newCardForm.reset();

  // Закрываем модальное окно
  closeModal(newCardModal);
}

// ========== ИНИЦИАЛИЗАЦИЯ ========= //

// Инициализация модальных окон
initModalGlobal(profileEditButton, profileEditModal);
initModalGlobal(newCardAddButton, newCardAddModal);
initModal(imagePopup);

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ========= //

// Открытие модального окна редактирования профиля
profileEditButton.addEventListener("click", () => populateProfileEditForm(profileAssignmentRout));

// Обработчик отправки формы редактирования профиля через "submit"
profileForm.addEventListener("submit", (event) =>
  handleProfileEditFormSubmit(event, profileEditModal, profileAssignmentRout)
);

// Добавляем обработчик на форму
newCardFormElement.addEventListener("submit", (event) =>
  handleNewCardSubmit(
    event,
    newCardAddModal,
    newCardFormElement,
    cardTemplate,
    placesList
  )
);

// ========== ОТРИСОВКА ИСХОДНЫХ КАРТОЧЕК ========= //

// Вывести карточки на страницу, вставляем карточки в DOM при итерации forEach
initialCards.forEach((cardData) => {
  const cardElement = makeCard(cardData, cardTemplate, openModalImage);
  placesList.append(cardElement);
});