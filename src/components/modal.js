// закрытие модального окна по "Escape"
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

// Функция настраивает модальное окно для закрытия по клику на оверлей и по кнопке закрытия
export function initModal(modalForm) {
  modalForm.addEventListener("click", (event) => {
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
  clickableOpenningElement.addEventListener("click", () => {
    openModal(modalForm);
  });
}
