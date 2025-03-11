// Токен: 7b6483ac-4b39-4efd-98b4-ea63184ee0c5
// Идентификатор группы: wff-cohort-33

// Адрес сервера проекта Mesto: https://mesto.nomoreparties.co

// При каждом запросе нужно передавать токен и
// идентификатор группы

// return fetch('https://nomoreparties.co/v1/wff-cohort-33/users/me', {
//   headers: {
//     authorization: '7b6483ac-4b39-4efd-98b4-ea63184ee0c5'
//   }
// })
//   .then(res => res.json())
//   .then((result) => {
//     console.log(result);
//   });
// Информация о пользователе должна подгружаться с сервера
// GET https://nomoreparties.co/v1/:wff-cohort-33/users/me

// Токен и ID группы
const cohortId = "wff-cohort-33"; // ID группы
const token = "7b6483ac-4b39-4efd-98b4-ea63184ee0c5"; // Токен

// Универсальная функция для запросов к API
function makeRequest(url, method, body = null) {
  return fetch(`https://nomoreparties.co/v1/${cohortId}${url}`, {
    method,
    headers: {
      authorization: token,
      'Content-Type': 'application/json'
    },
    body: body ? JSON.stringify(body) : null
  })
    .then(res => {
      if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`); // Выбрасываем ошибку, если статус не 200-299
      }
      return res.json(); // Если всё в порядке, возвращаем JSON
    })
    .catch(error => console.error('Ошибка:', error));
}

// Функция для запроса информации о пользователе
export function fetchUserProfile() {
  return makeRequest("/users/me", "GET");
}

// Функция для загрузки карточек с сервера
export function fetchCards() {
  return makeRequest("/cards", "GET");
}

// Функция для обновления профиля на сервере
export function updateProfile(data) {
  return makeRequest("/users/me", "PATCH", data);
}

// Функция для добавления карточки на сервер
export function addCardToServer(data) {
  return makeRequest("/cards", "POST", data);
}

//  Функция для удаления карточки с сервера
export function deleteCardFromServer(cardId) {
  return makeRequest(`/cards/${cardId}`, "DELETE");
}

// Функция для добавления лайка
export function likeCard(cardId) {
  return makeRequest(`/cards/likes/${cardId}`, "PUT");
}

// Функция для удаления лайка
export function unlikeCard(cardId) {
  return makeRequest(`/cards/likes/${cardId}`, "DELETE");
}

// Функция для изменения аватарки
export function updateAvatar(avatarUrl) {
  return makeRequest("/users/me/avatar", "PATCH", { avatar: avatarUrl });
}

// Функция для обновления данных на странице
export function updateUserProfile(
  data,
  profileName,
  profileDescription,
  avatarUserImg
) {
  // Обновляем имя и описание на странице
  profileName.textContent = data.name;
  profileDescription.textContent = data.about;

  // Обновляем аватар
  avatarUserImg.src = data.avatar;
  avatarUserImg.alt = `Аватар пользователя ${data.name}`;
}
