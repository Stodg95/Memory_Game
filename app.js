const moves = document.getElementById("moves-count");
  const timeValue = document.getElementById("time");
  const startButton = document.getElementById("start");
  const restartButton = document.getElementById("restart");
  const gameContainer = document.querySelector(".game-container");
  const result = document.getElementById("result");
  const controls = document.querySelector(".controls-container");
  let cards,
      interval;
  let firstCard = false;
  let secondCard = false;

  const logos = [
    { name: "Flask", image: "Language_logos/flask_logo.webp" },
    { name: "javaScript", image: "Language_logos/JS_logo.png" },
    { name: "NodeJs", image: "Language_logos/NodeJS_logo.png" },
    { name: "Python", image: "Language_logos/Python_logo2.webp" },
    { name: "React", image: "Language_logos/React_Logo.png" },
    { name: "Sql", image: "Language_logos/sql_logo.png" },
    { name: "Ruby", image: "Language_logos/Ruby_logo.png" },
    { name: "C++", image: "Language_logos/c++_logo.png" },
  ];

  let seconds = 0,
      minutes = 0;
  let movesCount = 0,
      winCount = 0;

  const timeGenerator = () => {
    seconds += 1;
    if (seconds >= 60) {
      minutes += 1;
      seconds = 0;
    }

    let secondsValue = seconds < 10 ? `0${seconds}` : seconds;
    let minutesValue = minutes < 10 ? `0${minutes}` : minutes;
    timeValue.innerHTML = `<span>Time:</span>${minutesValue}:${secondsValue}`;
  };

  const generateRandom = (size = 4) => {
    let tempArray = [...logos];
    let cardValues = [];

    size = (size * size) / 2;
    for (let i = 0; i < size; i++) {
      const randomIndex = Math.floor(Math.random() * tempArray.length);
      cardValues.push(tempArray[randomIndex]);
      tempArray.splice(randomIndex, 1);
    }
    return cardValues;
  };

  const matrixGenerator = (cardValues, size = 4) => {
    gameContainer.innerHTML = "";
    cardValues = [...cardValues, ...cardValues];

    cardValues.sort(() => Math.random() - 0.5);
    for (let i = 0; i < size * size; i++) {
      gameContainer.innerHTML += `
       <div class="card-container" data-card-value="${cardValues[i].name}">
          <div class="card-before">?</div>
          <div class="card-after">
          <img src="${cardValues[i].image}" class="image"/></div>
       </div>
       `;
    }

gameContainer.style.gridTemplateColumns = `repeat(${size},auto)`;
cards = document.querySelectorAll(".card-container");
let lockBoard = false;
let movesCount = 0; 
let bestScore = localStorage.getItem("lowestMoves") || Infinity;

const movesCounter = () => {
  movesCount += 1;
  moves.innerHTML = `<span>Moves:</span>${movesCount}`;
};

cards.forEach((card) => {
  card.addEventListener("click", () => {
    if (!card.classList.contains("matched") && !lockBoard) {
      card.classList.add("flipped");
      if (!firstCard) {
        firstCard = card;
        firstCardValue = card.getAttribute("data-card-value");
      } else {
        
        movesCounter();

        secondCard = card;
        let secondCardValue = card.getAttribute("data-card-value");

        if (firstCardValue == secondCardValue) {
          firstCard.classList.add("matched");
          secondCard.classList.add("matched");

          firstCard = false;
          winCount += 1;
         

          if (winCount == Math.floor(cardValues.length / 2)) {
            let lowestMoves = movesCount;
            localStorage.setItem("lowestMoves", lowestMoves);

          if (movesCount < bestScore) {
            localStorage.setItem("lowestMoves", lowestMoves);
          }

            result.innerHTML = `<h2>You Won!</h2>
          <h4>Your Score: ${movesCount}</h4>
          <h3>Best Score: ${bestScore}</h3>`;
          
            restartGame();
          }
        } else {
          let [tempFirst, tempSecond] = [firstCard, secondCard];
          firstCard = false;
          secondCard = false;
          lockBoard = true;
            setTimeout(() => {
            tempFirst.classList.remove("flipped");
            tempSecond.classList.remove("flipped");
            lockBoard = false;
          }, 1000);
        }
      }
    }
  });
});
};

  startButton.addEventListener("click", () => {
    movesCount = 0;
    seconds = 0;
    minutes = 0;
    controls.classList.add("hide");
    restartButton.classList.remove("hide");
    startButton.classList.add("hide");

    interval = setInterval(timeGenerator, 1000);
    moves.innerHTML = `<span>Moves:</span> ${movesCount}`;
    initializer();
  });

  restartButton.addEventListener("click",
    (restartGame = () => {
      controls.classList.remove("hide");
      restartButton.classList.add("hide");
      startButton.classList.remove("hide");
      clearInterval(interval);
    })
  );

  const initializer = () => {
    result.innerText = "";
    winCount = 0;
    let cardValues = generateRandom();
    matrixGenerator(cardValues);
  };