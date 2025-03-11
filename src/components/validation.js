// для включения валидации
export function enableValidation(validationConfig) {
  const formElements = Array.from(document.querySelectorAll(validationConfig.formSelector));
  formElements.forEach(function (formElement) {
    formElement.addEventListener('submit', function (evt) {
      // Дублирует код в основном скрипте, можно в основном скрипте попробовать удалить
      evt.preventDefault();
    });
    setEventListeners(formElement, validationConfig);
  });
}

//функция добавления EventListener
function setEventListeners(formElement, validationConfig) {
  // Селекторы из validationConfig
  const inputElements = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
  const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);

  inputElements.forEach(function (inputElement) {
    inputElement.addEventListener('input', function () {
      checkInputValidity(inputElement, validationConfig);
      // Чтобы проверять состояние кнопки при изменении любого из полей
      toggleButtonState(inputElements, buttonElement, validationConfig);
    });
  });
}

//функция очищения валидации
export function clearValidation(formElement, validationConfig) {
// Берем все селекторы из validationConfig
const inputList = Array.from(formElement.querySelectorAll(validationConfig.inputSelector));
inputList.forEach((inputElement) => {
 hideInputError(inputElement, validationConfig);
});
const buttonElement = formElement.querySelector(validationConfig.submitButtonSelector);
  buttonElement.disabled = true;
  buttonElement.classList.add(validationConfig.inactiveButtonClass);
}

// Функция для блокировки/разблокировки кнопки отправки
function toggleButtonState(inputList, buttonElement, validationConfig) {
  // селекторы из validationConfig
  if (hasInvalidInput(inputList)) {
    buttonElement.disabled = true; // Блокируем кнопку
    buttonElement.classList.add(validationConfig.inactiveButtonClass); // Добавляем стиль для неактивной кнопки
  } else {
    buttonElement.disabled = false; // Разблокируем кнопку
    buttonElement.classList.remove(validationConfig.inactiveButtonClass); // Убираем стиль для неактивной кнопки
  }
}

// Функция для проверки всех полей формы и блокировки кнопки
function hasInvalidInput(inputList) {
  return inputList.some(function (input) {
    return !input.validity.valid;
  });
}

// Функция проверки валидности одного инпута
export function checkInputValidity(inputElement, validationConfig) {
  if (inputElement.validity.patternMismatch) {
    inputElement.setCustomValidity(inputElement.dataset.errorMessage);
  } else {
    inputElement.setCustomValidity("");
  }

  if (!inputElement.validity.valid) {
    showInputError(inputElement, validationConfig);
  } else {
    hideInputError(inputElement, validationConfig);
  }
}

// Функция для отображения ошибки
function showInputError(inputElement, validationConfig) {
  // Селекторы берем из validationConfig
  const errorElement = inputElement.form.querySelector(validationConfig.errorSpanSelectorPatern + inputElement.name);
  errorElement.textContent = inputElement.validationMessage;
  inputElement.classList.add(validationConfig.inputErrorClass);
  errorElement.classList.add(validationConfig.errorClass);
}

// Функция для скрытия ошибки
function hideInputError(inputElement, validationConfig) {
  // Селекторы берем из validationConfig
  const errorElement = inputElement.form.querySelector(validationConfig.errorSpanSelectorPatern + inputElement.name);
  errorElement.textContent = "";
  inputElement.classList.remove(validationConfig.inputErrorClass);
  errorElement.classList.remove(validationConfig.errorClass);
}
