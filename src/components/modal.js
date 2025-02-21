function handleEscKeyUp(e) {
  if (e.key === "Escape") {
    const popup = document.querySelector(".popup_is-opened"); // находим открытый попап
    closeModal(popup);
  }
}
//открытие модального окна
export function openModal(modal) {
  // добавили класс открытия попапа
  modal.classList.add("popup_is-opened");

  const closeButton = modal.querySelector(".popup__close");
  closeButton.addEventListener("click", function () {
    closeModal(modal);
  });
  // добавили слушатель на кнопку Escape
  document.addEventListener("keyup", handleEscKeyUp);
}
//закрытие модального окна
export function closeModal(modal) {
  // удалить класс открытия попапа
  modal.classList.remove("popup_is-opened");

  // удалить слушатель на кнопку Escape
  document.removeEventListener("keyup", handleEscKeyUp);
}

// закрытие при нажатии на оверлей
export function handleOverlayClick(eventTarget) {
  if (eventTarget.classList.contains("popup")) {
    closeModal(eventTarget);
  }
}

// Добавляет обработку клика на оверлей и открытие по кликабельному элементу
export function initModal(clickableOpenningElement, modalForm) {
  modalForm.addEventListener("click", function (event) {
    handleOverlayClick(event.target);
  });

  clickableOpenningElement.addEventListener("click", function () {
    openModal(modalForm);
  });
}

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
export function handleFormSubmit(evt, modalForm) {
  evt.preventDefault(); // Эта строчка отменяет стандартную отправку формы
  // Находим поля формы в DOM
  const nameInput = modalForm.querySelector(".popup__input_type_name");
  const jobInput = modalForm.querySelector(".popup__input_type_description");

  // Выбираем элементы, куда должны быть вставлены значения полей
  const profileName = document.querySelector(".profile__title");
  const profileJob = document.querySelector(".profile__description");

  // Вставляем новые значения с помощью textContent
  profileName.textContent = nameInput.value;
  profileJob.textContent = jobInput.value;

  // Закрываем попап
  closeModal(document.querySelector(".popup_type_edit"));
}

//модальное окно с картинкой
export function openModalImage(name, link) {
  const popup = document.querySelector(".popup_type_image");
  const popupImage = popup.querySelector(".popup__image");
  const popupCaption = popup.querySelector(".popup__caption");

  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;

  openModal(popup);
}

// Функция для заполнения модального окна редактирования профиля
export function populateEditModal(editModal) {
  const nameInput = editModal.querySelector(".popup__input_type_name");
  const jobInput = editModal.querySelector(".popup__input_type_description");

  nameInput.value = document.querySelector(".profile__title").textContent;
  jobInput.value = document.querySelector(".profile__description").textContent;
}
