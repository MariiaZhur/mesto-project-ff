import "./pages/index.css"; //подключаем файл стилей

// import { initialCards } from "./components/cards.js";
import { makeCard } from "./components/card.js";
import {
  initModalGlobal,
  closeModal,
  openModal,
  initModal,
} from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import {
  fetchUserProfile,
  updateUserProfile,
  fetchCards,
  updateProfile, addCardToServer,
  likeCard,
  unlikeCard,
  updateAvatar, deleteCardFromServer
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

// Связь между формой редактирования профиля и его отображением в документе
const profileAssignmentRout = {
  formInput: {
    // поля для ввода и редактирования в форме
    name: profileEditModal.querySelector(".popup__input_type_name"),
    description: profileEditModal.querySelector(
      ".popup__input_type_description"),
  },
  documentText: {
    // элементы для вывода текста в документе
    name: document.querySelector(".profile__title"),
    description: document.querySelector(".profile__description"),
  },
};

const newCardAddButton = document.querySelector(".profile__add-button");
const newCardAddModal = document.querySelector(".popup_type_new-card");

const newCardFormElement = newCardAddModal.querySelector(".popup__form");

// Объявление переменных для работы с api
const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

// Находим инпуты
const placeNameInput = newCardFormElement.querySelector(".popup__input_type_card-name");
const placeLinkInput = newCardFormElement.querySelector(".popup__input_type_url");

// Объявляем переменные для элементов попапа с просмотром изображения
const imagePopup = document.querySelector(".popup_type_image");
const imagePopupElementImg = imagePopup.querySelector(".popup__image");
const imagePopupCaption = imagePopup.querySelector(".popup__caption");

// Объявляем переменные для попапа с изменением и добавлением аватара
const avatarUserImg = document.querySelector(".profile__image");
const avatarUserBlock = document.querySelector(".profile__image_block");
const popupEditAvatar = document.querySelector(".popup__edit_avatar");
const popupFormAvatar = popupEditAvatar.querySelector(".popup__form");
const popupAvatarInputUrl = popupFormAvatar.querySelector(".popup__input_avatar-url");
const closeAvatarModalButton = popupEditAvatar.querySelector(".popup__close");

// Кнопки отправки форм
const profileSubmitButton = profileForm.querySelector(".popup__button");
const newCardSubmitButton = newCardFormElement.querySelector(".popup__button");
const avatarSubmitButton = popupFormAvatar.querySelector(".popup__button");
// Попап удаления карточки
const deleteCardPopup = document.querySelector(".popup__delete-card");
const closeDeleteCardPopup = deleteCardPopup.querySelector(".popup__close");

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_active',
  errorSpanSelectorPatern: '.popup__error_'
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
    .then(data => {
      // Создаём карточку и добавляем в начало списка
      const newCard = makeCard(
        data,
         cardTemplate,
          openModalImage,
           userId,
            likeCard, 
            unlikeCard,
             openDeleteCardPopup); // Передаём userId
      placesList.prepend(newCard);

      // Очищаем форму
      newCardForm.reset();
      // Сбрасываем валидацию
      clearValidation(newCardForm, validationConfig);
      // Закрываем модальное окно
      closeModal(newCardModal);
    })
    .catch(error => {
      console.error('Ошибка при добавлении карточки:', error);
    })
    .finally(() => {
      // Возвращаем текст кнопки на "сохранить"
      newCardSubmitButton.textContent = "Сохранить";
    });
}

// Функция для заполнения модального окна редактирования профиля
function populateProfileEditForm(profileAssignmentRout) {
  profileAssignmentRout.formInput.name.value =
    profileAssignmentRout.documentText.name.textContent;
  profileAssignmentRout.formInput.description.value =
    profileAssignmentRout.documentText.description.textContent;
    
}

// Обработчик «отправки» формы обновления информации, ура, уже отправляет)
function handleProfileEditFormSubmit(event, profileEditModal, profileAssignmentRout) {
  event.preventDefault(); // Отменяем стандартное поведение формы

 // Меняем текст кнопки на "Сохранение..."
 profileSubmitButton.textContent = "Сохранение...";

  // Получаем новые данные из формы
  const newName = profileAssignmentRout.formInput.name.value;
  const newDescription = profileAssignmentRout.formInput.description.value;

  // Отправляем данные на сервер
  updateProfile({
    name: newName,
    about: newDescription
  })
    .then(data => {
      // Обновляем данные на странице
      profileAssignmentRout.documentText.name.textContent = data.name;
      profileAssignmentRout.documentText.description.textContent = data.about;

      // Закрываем попап
      closeModal(profileEditModal);
    })
    .catch(error => {
      console.error('Ошибка при обновлении профиля:', error);
    })
    .finally(() => {
      // Возвращаем текст кнопки на "Сохранить"
      profileSubmitButton.textContent = "Сохранить";
    });
}

// функция открытия модалки с вопросом удаления карточки
function openDeleteCardPopup(cardId, cardElement) {
  console.log("openDeleteCardPopup with cardId="+cardId); // Логируем ID карточки

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
      .catch(error => {
        console.error("Ошибка при удалении карточки:", error);
      });
  };
}
// ========== ИНИЦИАЛИЗАЦИЯ ========= //

// Инициализация модальных окон
initModalGlobal(profileEditButton, profileEditModal);
initModalGlobal(newCardAddButton, newCardAddModal);
initModal(imagePopup);
initModalGlobal(avatarUserBlock, popupEditAvatar);
initModal(deleteCardPopup); // Инициализация попапа удаления

// ========== ОБРАБОТЧИКИ СОБЫТИЙ ========= //

// Открытие модального окна редактирования профиля
profileEditButton.addEventListener("click", () =>{
  populateProfileEditForm(profileAssignmentRout);
  clearValidation(profileForm, validationConfig);  
}
);

// Обработчик отправки формы редактирования профиля через "submit"
profileForm.addEventListener("submit", (event) =>
  handleProfileEditFormSubmit(event, profileEditModal, profileAssignmentRout)
);

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
closeAvatarModalButton.addEventListener("click", () => closeModal(popupEditAvatar));
// Обработчик для закрытия модального окна удаления карточки
closeDeleteCardPopup.addEventListener("click", () => closeModal(deleteCardPopup));

//форма с аватаркой
avatarUserBlock.addEventListener("click", () => {
  popupFormAvatar.reset();
  clearValidation(popupFormAvatar, validationConfig);
});

closeAvatarModalButton.addEventListener("click", () => closeModal(popupEditAvatar));

// ========== ОТРИСОВКА ИСХОДНЫХ КАРТОЧЕК ========= //
// ========== PROMISE (АСИНХРОННОСТЬ) ========= //

// Загружаем пользователя и карточки
Promise.all([fetchUserProfile(), fetchCards()])
  .then(([userData, cards]) => {
    // Обновляем профиль
    updateUserProfile(userData, profileName, profileDescription, avatarUserImg);

    // изменяем userId
    userId = userData._id; // Сохраняем userId в глобальную переменную

    // Создаём карточки и добавляем их на страницу
    cards.forEach(cardData => {
      console.log(openDeleteCardPopup);
      const cardElement = makeCard(cardData, 
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
  .catch(error => console.error("Ошибка загрузки данных:", error));

// ========== ВАЛИДАЦИЯ ========= //

// включение валидации для всех форм
// все настройки передаются при вызове
enableValidation(validationConfig);

fetchUserProfile().then(data => {
  updateUserProfile(data, profileName, profileDescription, avatarUserImg);
});
// Загружаем данные о пользователе при загрузке страницы
