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


export function initModal(modalForm) {
  modalForm.addEventListener("click",  (event) => {
    handleOverlayClick(event.target);
  });

  const closeButton = modalForm.querySelector(".popup__close");
  closeButton.addEventListener("click", () => {
    closeModal(modalForm);
  });
}

// Добавляет обработку клика на оверлей и открытие по кликабельному элементу
export function initModalGlobal(clickableOpenningElement, modalForm) {
  initModal(modalForm);
  clickableOpenningElement.addEventListener("click",  () => {
    openModal(modalForm);
  });
}

// Функция для заполнения модального окна редактирования профиля
export function populateProfileEditForm(profileAssignmentRout) {
  profileAssignmentRout.formInput.name.value = profileAssignmentRout.documentText.name.textContent;
  profileAssignmentRout.formInput.description.value = profileAssignmentRout.documentText.description.textContent;
}

// Обработчик «отправки» формы, хотя пока
// она никуда отправляться не будет
export function handleProfileEditFormSubmit(event, profileEditModal, profileAssignmentRout) {
  event.preventDefault(); // Эта строчка отменяет стандартную отправку формы
 profileAssignmentRout.documentText.name.textContent =  profileAssignmentRout.formInput.name.value;
 profileAssignmentRout.documentText.description.textContent =  profileAssignmentRout.formInput.description.value;
  // Закрываем попап
  closeModal(profileEditModal);
}
