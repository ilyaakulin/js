(function () {
  const cardsArray = [];
  let cardsArrayLength = null;
  let hasFlippedCard = false;
  let firstCard = null;
  let secondCard = null;
  let thirdCard = null;
  let lockBoard = false;
  let interval = null;
  let cardsNumber = null;
  let wrapperWidth = null;

  function createGameForm() {
    const form = document.createElement("form");
    const startBtn = document.createElement("button");
    const title = document.createElement("h1");
    const label = document.createElement("label");
    const input = document.createElement("input");

    form.classList.add("game-form");
    startBtn.classList.add("start-btn");
    startBtn.textContent = "Начать игру";
    title.textContent = "Игра в пары";

    form.append(title);

    label.textContent = "Число карточек по вертикали/горизонтали";
    input.classList.add("input");
    label.append(input);
    form.append(label);
    form.append(startBtn);
    document.body.append(form);

    const getStartBtn = document.querySelector(".start-btn");
    const getInput = document.querySelector(".input");

    getStartBtn.disabled = true;

    getInput.addEventListener("input", () => {
      getInput.value
        ? (getStartBtn.disabled = false)
        : (getStartBtn.disabled = true);
    });

    document.querySelector(".start-btn").addEventListener("click", (el) => {
      el.preventDefault();

      cardsNumber = getInputContent(".input");
      wrapperWidth = getInputContent(".input");

      generateCardsArray();

      document.querySelector(".game-form").remove();

      createGameField();

      cardsArrayLength = cardsArray.length;
    });
  }

  function generateCardsArray() {
    cardsNumber *= cardsNumber;
    cardsNumber /= 2;

    for (let i = 1; i <= cardsNumber; i++) {
      for (let j = i; j <= i; j++) {
        cardsArray.push(i);
        cardsArray.push(j);
      }
    }
  }

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function getInputContent(className) {
    let input = document.querySelector(className).value;
    input % 2 == 0 && input <= 10 && input > 0 ? input : (input = 4);
    return input;
  }

  function createGameField() {
    const wrapper = document.createElement("div");
    const btn = document.createElement("button");
    const timer = document.createElement("div");
    const minutes = document.createElement("span");
    const seconds = document.createElement("span");
    const separator = document.createElement("span");

    minutes.textContent = "01";
    separator.textContent = ":";
    seconds.textContent = "00";
    timer.classList.add("timer");
    minutes.classList.add("minutes", "timer__content");
    seconds.classList.add("seconds", "timer__content");
    separator.classList.add("separator", "timer__content");
    timer.append(minutes, separator, seconds);
    document.body.append(timer);

    wrapper.classList.add("wrapper");
    wrapper.style.width = wrapperWidth * 120 + 30 + "px";

    shuffle(cardsArray);

    for (const item of cardsArray) {
      const cardWrapper = document.createElement("div");
      const card = document.createElement("div");
      const content = document.createElement("span");
      const img = document.createElement("img");

      cardWrapper.classList.add("card-wrap");
      card.classList.add("card");
      content.classList.add("content");
      content.textContent = item;
      img.src = "./images/pig.jpg";

      card.append(content);
      card.append(img);
      cardWrapper.append(card);
      wrapper.append(cardWrapper);
    }
    btn.classList.add("btn");
    btn.textContent = "Сыграть еще раз";
    wrapper.append(btn);
    document.body.append(wrapper);

    const cards = document.querySelectorAll(".card");
    cards.forEach((card) => card.addEventListener("click", flipCard));
    cards.forEach((card) => card.addEventListener("click", onClick));
  }

  function flipCard() {
    if (lockBoard) return;
    this.classList.add("flip");
    restartGame();
    if (this === firstCard) return;
    if (!hasFlippedCard) {
      if (thirdCard) {
        firstCard = thirdCard;
      } else {
        hasFlippedCard = true;
        firstCard = this;
        return;
      }
    }
    if (firstCard && secondCard) {
      checkForMatch();
      thirdCard = this;
      return;
    }
    secondCard = this;
  }

  function checkForMatch() {
    const isMatch =
      firstCard.firstChild.textContent === secondCard.firstChild.textContent;
    if (isMatch) {
      disableCards();
    } else {
      unflipCards();
    }
  }

  function disableCards() {
    firstCard.removeEventListener("click", flipCard);
    secondCard.removeEventListener("click", flipCard);
    resetBoard();
  }

  function unflipCards() {
    lockBoard = true;
    setTimeout(() => {
      firstCard.classList.remove("flip");
      secondCard.classList.remove("flip");
      resetBoard();
    }, 500);
  }

  function resetBoard() {
    [hasFlippedCard, lockBoard] = [false, false];
    [firstCard, secondCard] = [null, null];
  }

  function restartGame() {
    const flipCards = document.querySelectorAll(".flip");
    if (flipCards.length == cardsArrayLength) {
      const btn = document.querySelector(".btn");
      btn.classList.add("btn--active");
      clearInterval(interval);
      btn.addEventListener("click", () => {
        document.body.innerHTML = "";
        createGameField();
      });
    }
  }

  function goTimer() {
    const seconds = document.querySelector(".seconds");

    if (seconds.textContent <= 0) {
      interval = clearInterval(interval);
      alert("Время вышло");
      window.location.reload();
    } else {
      --seconds.textContent;
      if (seconds.textContent < 10) {
        seconds.textContent = "0" + seconds.textContent;
      }
    }
  }

  function onClick() {
    document.querySelector(".minutes").textContent = "00";
    document.querySelector(".seconds").textContent = "59";
    interval = setInterval(goTimer, 1000);

    document
      .querySelectorAll(".card")
      .forEach((card) => card.removeEventListener("click", onClick));
  }

  createGameForm();
})();
