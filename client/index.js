const container = document.getElementById("container");

const question1 = document.querySelector(".question_1");
const question2 = document.querySelector(".question_2");
const question3 = document.querySelector(".question_3");
const question4 = document.querySelector(".question_4");

const waitingImage = document.querySelector(".waiting");
const wonderingImage = document.querySelector(".wondering");
const winningImage = document.querySelector(".winning");
const victoryImage = document.querySelector(".victory");
const losingImage = document.querySelector(".losing");
const defeatImage = document.querySelector(".defeat");

const ifButton = document.getElementById("if");
const yesButton = document.getElementById("yes");
const nobuttonplaceholder = document.querySelector(".nobuttonplaceholder");
const noButton = document.getElementById("no");

const music1 = document.getElementById("music_1");
const music2 = document.getElementById("music_2");

function getRandomNumber(min, max) {
  const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
}

function hideAllGifs() {
  const gifs = document.querySelectorAll(".image");
  gifs.forEach((gif) => {
    if (!gif.classList.contains("hide")) {
      gif.classList.add("hide");
    }
  });
}

function hideAllQuestions() {
  const questions = document.querySelectorAll(".question");
  questions.forEach((question) => {
    if (!question.classList.contains("hide")) {
      question.classList.add("hide");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const playMusic = () => {
    music1.play().catch((error) => {
      console.error("Error playing music:", error);
      document.addEventListener("click", playMusicOnInteraction);
    });
  };

  const playMusicOnInteraction = () => {
    music1.play().catch((error) => {
      console.error("Error playing music on interaction:", error);
    });
    document.removeEventListener("click", playMusicOnInteraction);
  };

  playMusic();
});

ifButton.addEventListener("click", (e) => {
  hideAllGifs();
  hideAllQuestions();
  ifButton.classList.add("hide");

  wonderingImage.classList.remove("hide");
  question2.classList.remove("hide");
  yesButton.classList.remove("hide");
  nobuttonplaceholder.classList.remove("hide");
});

const handleYesButtonMouseEnter = (e) => {
  hideAllGifs();
  winningImage.classList.remove("hide");
};

const handleYesButtonMouseLeave = (e) => {
  hideAllGifs();
  wonderingImage.classList.remove("hide");
};

const handleYesButtonMouseLeaveAfterDefeat = (e) => {
  console.log("called");
  hideAllGifs();
  defeatImage.classList.remove("hide");
};

const handleYesButtonAfterClick = (e) => {
  console.log("yesButton no defeat");
  fetch("https://ask-for-a-date-mhqj.onrender.com/api/yes", {
    method: "POST",
  });

  yesButton.removeEventListener("mouseenter", handleYesButtonMouseEnter);
  yesButton.removeEventListener("mouseleave", handleYesButtonMouseLeave);
  noButton.removeEventListener("mouseenter", handleNoButtonMouseEnter);
  noButton.removeEventListener("mouseleave", handleNoButtonMouseLeave);

  hideAllQuestions();
  hideAllGifs();
  victoryImage.classList.remove("hide");
  question3.classList.remove("hide");

  yesButton.classList.add("hide");
  nobuttonplaceholder.classList.add("hide");
};

const handleYesButtonAfterDefeat = (e) => {
  console.log("yesButton after defeat");

  fetch("https://ask-for-a-date-mhqj.onrender.com/api/yes", {
    method: "POST",
  });

  music2.pause();
  music2.currentTime = 0;

  music1.src = "assets/music_1.mp3";
  music1.play().catch((error) => {
    console.error("Error playing different music:", error);
  });

  yesButton.removeEventListener("mouseenter", handleYesButtonMouseEnter);
  yesButton.removeEventListener("mouseleave", handleYesButtonMouseLeave);
  noButton.removeEventListener("mouseenter", handleNoButtonMouseEnter);
  noButton.removeEventListener("mouseleave", handleNoButtonMouseLeave);
  yesButton.removeEventListener(
    "mouseleave",
    handleYesButtonMouseLeaveAfterDefeat
  );

  hideAllQuestions();
  hideAllGifs();

  console.log("Showing victoryImage and hiding defeatImage");
  defeatImage.classList.add("hide");
  victoryImage.classList.remove("hide");
  question3.classList.remove("hide");

  yesButton.classList.add("hide");
  nobuttonplaceholder.classList.add("hide");
};

yesButton.addEventListener("mouseenter", handleYesButtonMouseEnter);
yesButton.addEventListener("mouseleave", handleYesButtonMouseLeave);

const handleNoButtonMouseEnter = (e) => {
  hideAllGifs();
  losingImage.classList.remove("hide");
};

const handleNoButtonMouseLeave = (e) => {
  hideAllGifs();
  wonderingImage.classList.remove("hide");
};

noButton.addEventListener("mouseenter", handleNoButtonMouseEnter);
noButton.addEventListener("mouseleave", handleNoButtonMouseLeave);
yesButton.addEventListener("click", handleYesButtonAfterClick);

noButton.addEventListener("click", () => {
  console.log("after defeat");
  fetch("https://ask-for-a-date-mhqj.onrender.com/api/no", { method: "POST" });

  music1.pause();
  music1.currentTime = 0;

  music2.src = "assets/music_2.mp3";
  music2.play().catch((error) => {
    console.error("Error playing different music:", error);
  });

  yesButton.removeEventListener("mouseleave", handleYesButtonMouseLeave);
  yesButton.removeEventListener("click", handleYesButtonAfterClick);

  yesButton.addEventListener(
    "mouseleave",
    handleYesButtonMouseLeaveAfterDefeat
  );
  yesButton.addEventListener("click", handleYesButtonAfterDefeat);

  noButton.removeEventListener("mouseenter", handleNoButtonMouseEnter);
  noButton.removeEventListener("mouseleave", handleNoButtonMouseLeave);

  hideAllQuestions();
  hideAllGifs();
  defeatImage.classList.remove("hide");
  question4.classList.remove("hide");

  nobuttonplaceholder.classList.add("hide");
  yesButton.innerHTML = "Still want to go out?";
});

noButton.addEventListener("mouseover", (event) => {
  const containerRect = container.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();

  const containerHeight = containerRect.height;
  const containerWidth = containerRect.width;
  const buttonHeight = buttonRect.height;
  const buttonWidth = buttonRect.width;

  const minDistance = 50;
  const maxDistance = 150;
  const maxRetries = 10;
  let retries = 0;

  const initialTop = buttonRect.top - containerRect.top;
  const initialLeft = buttonRect.left - containerRect.left;

  let newTop = buttonRect.top;
  let newLeft = buttonRect.left;

  do {
    // Generate random distances to move within the limits
    const moveTop = getRandomNumber(-maxDistance, maxDistance);
    const moveLeft = getRandomNumber(-maxDistance, maxDistance);

    // Calculate the new positions
    newTop = buttonRect.top + moveTop;
    newLeft = buttonRect.left + moveLeft;

    // Ensure the button stays inside the container
    newTop = Math.max(
      containerRect.top,
      Math.min(newTop, containerRect.bottom - buttonHeight)
    );
    newLeft = Math.max(
      containerRect.left,
      Math.min(newLeft, containerRect.right - buttonWidth)
    );

    retries++;
  } while (
    (Math.abs(newTop - buttonRect.top) < minDistance ||
      Math.abs(newLeft - buttonRect.left) < minDistance) &&
    retries < maxRetries
  );

  noButton.style.position = "absolute";

  noButton.style.top = initialTop + "px";
  noButton.style.left = initialLeft + "px";

  noButton.offsetHeight;

  noButton.style.top = Math.max(0, newTop - containerRect.top) + "px";
  noButton.style.left = Math.max(0, newLeft - containerRect.left) + "px";
});
