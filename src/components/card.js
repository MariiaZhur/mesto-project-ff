
// Функция создания карточки
export function makeCard(
  cardData,
  cardTemplate,
  onOpenModal,
  userId,
  likeCard,
  unlikeCard,
  openDeleteCardPopup 
) {
  const cardElement = cardTemplate.cloneNode(true);

  // Находим элементы внутри карточки
  const cardTitle = cardElement.querySelector(".card__title");
  const cardImage = cardElement.querySelector(".card__image");
  const deleteButton = cardElement.querySelector(".card__delete-button");
  const likeButton = cardElement.querySelector(".card__like-button"); // Находим кнопку лайка
  const likeCounter = cardElement.querySelector(".card__like-counter"); // кол-во лайков

  // Заполняем карточку
  cardTitle.textContent = cardData.name;

  // Отображаем количество лайков
  likeCounter.textContent = cardData.likes.length; // Используем длину массива likes

  // Проверяем, лайкнул ли текущий пользователь карточку
  if (cardData.likes.some((like) => like._id === userId)) {
    likeButton.classList.add("card__like-button_is-active");
  }
  // Устанавливаем изображение
  const placeholder = "https://placehold.co/400x300?text=No+Image";

  cardImage.src = cardData.link || placeholder;
  cardImage.alt = cardData.name || "Изображение недоступно";

  // Добавляем обработчик ошибки загрузки изображения (чтобы не зацикливалось)
  cardImage.onerror = () => {
    if (cardImage.src !== placeholder) {
      cardImage.src = placeholder;
      cardImage.alt = "Изображение недоступно";
    }
  };

  // Добавление обработчика клика по картинке
  // Используем переданный колбэк
  cardImage.addEventListener("click", () =>
    onOpenModal(cardData.name, cardData.link)
  );

  // скрываем кнопку удаления, если карточка чужая
  if (cardData.owner._id !== userId) {
    deleteButton.style.display = "none";
  }

  // Добавляем обработчик удаления (теперь для подтверждения)
  console.log("deleteButton.addEventListener cardDataId="+cardData._id);
  deleteButton.addEventListener("click", () => {
    console.log("deleteButton click event listener");
    openDeleteCardPopup(cardData._id, cardElement);});
  // Обработчик лайка
  likeButton.addEventListener("click", (event) => {
    event.stopPropagation(); // Останавливаем всплытие другого события
    toggleCardLike(cardElement, cardData._id, userId, likeCard, unlikeCard);
  });

  return cardElement; // Возвращаем созданную карточку
}

// // Функция удаления карточки
// function deleteCardPlace(cardElement, cardId, deleteCardFromServer) {
//   if (confirm("Вы уверены, что хотите удалить эту карточку?")) {
//     deleteCardFromServer(cardId)
//       .then(() => {
//         cardElement.remove(); // Удаляем карточку из интерфейса
//       })
//       .catch((error) => {
//         console.error("Ошибка при удалении карточки:", error);
//         alert("Не удалось удалить карточку. Попробуйте ещё раз.");
//       });
//   }
// }

//функция для обновления счётчика лайков
function updateLikeCounter(cardElement, likes) {
  const likeCounter = cardElement.querySelector(".card__like-counter");
  likeCounter.textContent = likes.length;
}
// Функция для переключения лайка
function toggleCardLike(cardElement, cardId, userId, likeCard, unlikeCard) {
  const likeButton = cardElement.querySelector(".card__like-button");
  const isLiked = likeButton.classList.contains("card__like-button_is-active");

  // Выбираем действие: like или unlike
  const likeAction = isLiked ? unlikeCard(cardId) : likeCard(cardId);

  // Обновляем состояние лайка и счетчика
  likeAction.then((data) => {
    updateLikeCounter(cardElement, data.likes);
    likeButton.classList.toggle("card__like-button_is-active");
  });
}
