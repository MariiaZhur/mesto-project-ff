import "./pages/index.css"; // Главный файл стилей

import { initialCards } from "./components/cards.js";
import { makeCard, handleNewCardSubmit } from "./components/card.js";
import {
  handleOverlayClick,
  initModal,
  populateEditModal,
  handleFormSubmit,
} from "./components/modal.js";

// DOM-элементы
const cardTemplate = document
  .querySelector("#card-template")
  .content.querySelector(".places__item");

// DOM
const placesList = document.querySelector(".places__list");
const imgPopup = document.querySelector(".popup_type_image");
// Находим форму в DOM
const profileForm = document.querySelector(".popup__form[name='edit-profile']");
// Находим поля формы в DOM
//const nameInput = profileForm.querySelector(".popup__input_type_name");
//const jobInput = profileForm.querySelector(".popup__input_type_description");

const editButton = document.querySelector(".profile__edit-button");
const editModal = document.querySelector(".popup_type_edit");
initModal(editButton, editModal);

editButton.addEventListener("click", () => populateEditModal(editModal));
const submitButton = editModal.querySelector(".popup__button");
submitButton.addEventListener("click", (event) =>
  handleFormSubmit(event, editModal)
);

const newCardButton = document.querySelector(".profile__add-button");
const newCardModal = document.querySelector(".popup_type_new-card");
initModal(newCardButton, newCardModal);

imgPopup.addEventListener("click", (event) => handleOverlayClick(event.target));

const newCardForm = newCardModal.querySelector(".popup__form");
// Добавляем обработчик на форму
newCardForm.addEventListener("submit", (event) =>
  handleNewCardSubmit(
    event,
    newCardModal,
    newCardForm,
    cardTemplate,
    placesList
  )
);

// Вывести карточки на страницу, вставляем карточки в DOM при итерации forEach
initialCards.forEach((cardData) => {
  const cardElement = makeCard(cardData, cardTemplate);
  placesList.append(cardElement);
});
