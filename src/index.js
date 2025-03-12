import "./pages/index.css"; //подключаем файл стилей

import { makeCard } from "./components/card.js";
import {
  initializeModalOpen,
  closeModal,
  openModal,
  initializeModalClose,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  fetchUserProfile,
  fetchCards,
  updateProfile,
  addCardToServer,
  likeCard,
  unlikeCard,
  updateAvatar,
  deleteCardFromServer,
} from "./components/api.js";


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

const profileData = {
  nameElement: document.querySelector(".profile__title"), // Элемент имени
  descriptionElement: document.querySelector(".profile__description"), // Элемент описания
  nameInput: profileEditModal.querySelector(".popup__input_type_name"), // Поле ввода имени в инпуте
  descriptionInput: profileEditModal.querySelector(
    ".popup__input_type_description"
  ), // Поле ввода описания в инпуте
  avatarElement: document.querySelector(".profile__image"), // Аватарка
};
// // Связь между формой редактирования профиля и его отображением в документе
// const profileAssignmentRout = {
//   formInput: {
//     // поля для ввода и редактирования в форме
//     name: profileEditModal.querySelector(".popup__input_type_name"),
//     description: profileEditModal.querySelector(
//       ".popup__input_type_description"
//     ),
//   },
//   documentText: {
//     // элементы для вывода текста в документе
//     name: document.querySelector(".profile__title"),
//     description: document.querySelector(".profile__description"),
//   },
// };
// // Объявление переменных для работы с api
// const profileName = document.querySelector(".profile__title");
// const profileDescription = document.querySelector(".profile__description");

const newCardAddButton = document.querySelector(".profile__add-button");
const newCardAddModal = document.querySelector(".popup_type_new-card");
const newCardFormElement = newCardAddModal.querySelector(".popup__form");

// Находим инпуты
const placeNameInput = newCardFormElement.querySelector(
  ".popup__input_type_card-name"
);
const placeLinkInput = newCardFormElement.querySelector(
  ".popup__input_type_url"
);

// Объявляем переменные для элементов попапа с просмотром изображения
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupElementImg = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Объявляем переменные для попапа с изменением и добавлением аватара
const avatarUserImg = document.querySelector(".profile__image");
const avatarUserBlock = document.querySelector(".profile__image_block");
const popupEditAvatar = document.querySelector(".popup__edit_avatar");
const popupFormAvatar = popupEditAvatar.querySelector(".popup__form");
const popupAvatarInputUrl = popupFormAvatar.querySelector(
  ".popup__input_avatar-url"
);
const closeAvatarModalButton = popupEditAvatar.querySelector(".popup__close");
// Кнопки отправки форм
const profileSubmitButton = profileForm.querySelector(".popup__button");
const newCardSubmitButton = newCardFormElement.querySelector(".popup__button");
const avatarSubmitButton = popupFormAvatar.querySelector(".popup__button");
// Попап удаления карточки
const deleteCardPopup = document.querySelector(".popup__delete-card");
const closeDeleteCardPopup = deleteCardPopup.querySelector(".popup__close");
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_active",
  errorSpanSelectorPatern: ".popup__error_",
};
let userId; // Объявляем в глобальной области видимости


// ========== ФУНКЦИИ ========= //

// Функция открытия попапа с картинкой
function openModalImage(imageTitle, imageLink) {
  imagePopupElementImg.src = imageLink;
  imagePopupElementImg.alt = imageTitle;
  imagePopupCaption.textContent = imageTitle;
  openModal(imagePopup);
}
//отвечает за обработку отправки формы добавления новой карточки
function handleNewCardSubmit(
  event,
  newCardModal,
  newCardForm,
  placeNameInput,
  placeLinkInput,
  cardTemplate,
  placesList,
  validationConfig,
  userId // Добавляем userId как параметр
) {
  event.preventDefault(); // Отменяем стандартное поведение формы, постоянно забываю что это

  // Меняем текст кнопки на "Создание"
  newCardSubmitButton.textContent = "Создание...";

  // Создаём объект новой карточки
  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  // Отправляем данные на сервер
  addCardToServer(newCardData)
    .then((data) => {
      // Создаём карточку и добавляем в начало списка
      const newCard = makeCard(
        data,
        cardTemplate,
        openModalImage,
        userId,
        likeCard,
        unlikeCard,
        openDeleteCardPopup
      ); // Передаём userId
      placesList.prepend(newCard);

      // Очищаем форму
      newCardForm.reset();

      // // Сбрасываем валидацию
      // clearValidation(newCardForm, validationConfig);

      // Закрываем модальное окно
      closeModal(newCardModal);
    })
    .catch((error) => {
      console.error("Ошибка при добавлении карточки:", error);
    })
    .finally(() => {
      // Возвращаем текст кнопки на "сохранить"
      newCardSubmitButton.textContent = "Сохранить";
    });
}

// Функция для заполнения модального окна редактирования профиля
function populateProfileEditForm() {
  profileData.nameInput.value = profileData.nameElement.textContent;
  profileData.descriptionInput.value =
    profileData.descriptionElement.textContent;
}

// Функция для обновления данных на странице
// function updateUserProfile(
//   data,
//   profileName,
//   profileDescription,
//   avatarUserImg
// ) {
//   profileName.textContent = data.name;
//   profileDescription.textContent = data.about;
//   avatarUserImg.src = data.avatar;
//   avatarUserImg.alt = `Аватар пользователя ${data.name}`;
// }
function updateUserProfile(data) {
  // Обновляем имя и описание на странице
  profileData.nameElement.textContent = data.name;
  profileData.descriptionElement.textContent = data.about;
  // Обновляем аватар
  profileData.avatarElement.src = data.avatar;
  profileData.avatarElement.alt = `Аватар пользователя ${data.name}`;
}

// функция открытия модалки с вопросом удаления карточки
function openDeleteCardPopup(cardId, cardElement) {
  // Открываем попап с подтверждением удаления
  openModal(deleteCardPopup);

  // Обработчик для кнопки "Да"
  const confirmButton = deleteCardPopup.querySelector(".popup__button");
  confirmButton.onclick = (event) => {
    event.preventDefault(); // Отменяем стандартное поведение кнопки

    // Отправляем запрос на удаление карточки с сервера
    deleteCardFromServer(cardId)
      .then(() => {
        // Если удаление прошло успешно, удаляем карточку из DOM
        cardElement.remove();
        closeModal(deleteCardPopup); // Закрываем попап
      })
      .catch((error) => {
        console.error("Ошибка при удалении карточки:", error);
      });
  };
}


// ========== ИНИЦИАЛИЗАЦИЯ ========= //

// Инициализация модальных окон
initializeModalOpen(profileEditButton, profileEditModal);
initializeModalOpen(newCardAddButton, newCardAddModal);
initializeModalClose(imagePopup);
initializeModalOpen(avatarUserBlock, popupEditAvatar);
initializeModalClose(deleteCardPopup); // Инициализация попапа удаления


// ========== ОБРАБОТЧИКИ СОБЫТИЙ ========= //

// Открытие модального окна редактирования профиля
profileEditButton.addEventListener("click", () => {
  populateProfileEditForm();
  clearValidation(profileForm, validationConfig);
});

// Обработчик отправки формы редактирования профиля через "submit"
profileForm.addEventListener("submit", (event) => {
  event.preventDefault(); // Отменяем стандартное поведение формы

  profileSubmitButton.textContent = "Сохранение...";

  const newName = profileData.nameInput.value;
  const newDescription = profileData.descriptionInput.value;

  // Отправляем запрос на сервер для обновления профиля
  updateProfile({ name: newName, about: newDescription })
    .then((data) => {
      // Обновляем данные на странице
      profileData.nameElement.textContent = data.name;
      profileData.descriptionElement.textContent = data.about;
      // Закрываем попап
      closeModal(profileEditModal);
    })
    .catch((error) => {
      console.error("Ошибка при обновлении профиля:", error);
    })
    .finally(() => {
      profileSubmitButton.textContent = "Сохранить"; // Возвращаем исходный текст кнопки
    });
});

// Добавляем обработчик на форму новых карточек
newCardFormElement.addEventListener("submit", (event) =>
  handleNewCardSubmit(
    event,
    newCardAddModal,
    newCardFormElement,
    placeNameInput,
    placeLinkInput,
    cardTemplate,
    placesList,
    validationConfig,
    userId
  )
);

// Обработчик для формы аватара
popupFormAvatar.addEventListener("submit", (event) => {
  event.preventDefault(); // Отменяем стандартное поведение формы

  // Меняем текст кнопки на "Сохранение"
  avatarSubmitButton.textContent = "Сохранение...";

  const avatarUrl = popupAvatarInputUrl.value; // Получаем URL аватара из input

  // Отправляем запрос на обновление аватара
  updateAvatar(avatarUrl)
    .then((data) => {
      // Обновляем аватар на странице
      avatarUserImg.src = data.avatar;
      avatarUserImg.alt = `Аватар пользователя ${data.name}`;

      // Закрываем модальное окно
      closeModal(popupEditAvatar);

      // Очищаем форму
      popupFormAvatar.reset();
    })
    .catch((error) => {
      console.error("Ошибка при обновлении аватара:", error);
    })
    .finally(() => {
      // Возвращаем текст кнопки на "сохранить"
      avatarSubmitButton.textContent = "Сохранить";
    });
});

// Обработчик для закрытия модального окна аватара
closeAvatarModalButton.addEventListener("click", () =>
  closeModal(popupEditAvatar)
);
// Обработчик для закрытия модального окна удаления карточки
closeDeleteCardPopup.addEventListener("click", () =>
  closeModal(deleteCardPopup)
);

//форма с аватаркой
avatarUserBlock.addEventListener("click", () => {
  popupFormAvatar.reset();
  clearValidation(popupFormAvatar, validationConfig);
});

closeAvatarModalButton.addEventListener("click", () =>
  closeModal(popupEditAvatar)
);

// Добавляем очистку формы и сброс валидации при открытии попапа
newCardAddButton.addEventListener("click", () => {
  newCardFormElement.reset(); // Очищаем форму
  clearValidation(newCardFormElement, validationConfig); // Сбрасываем валидацию
});


// ========== ОТРИСОВКА ИСХОДНЫХ КАРТОЧЕК ========= //
// ========== PROMISE (АСИНХРОННОСТЬ) ========= //

// Загружаем пользователя и карточки
Promise.all([fetchUserProfile(), fetchCards()])
  .then(([userData, cards]) => {
    // Обновляем профиль
    updateUserProfile(userData);

    // изменяем userId
    userId = userData._id; // Сохраняем userId в глобальную переменную

    // Создаём карточки и добавляем их на страницу
    cards.forEach((cardData) => {
      const cardElement = makeCard(
        cardData,
        cardTemplate,
        openModalImage,
        userId,
        likeCard,
        unlikeCard,
        openDeleteCardPopup
      );

      placesList.appendChild(cardElement);
    });
  })
  .catch((error) => console.error("Ошибка загрузки данных:", error));

  
// ========== ВАЛИДАЦИЯ ========= //

// включение валидации для всех форм
// все настройки передаются при вызове
enableValidation(validationConfig);
