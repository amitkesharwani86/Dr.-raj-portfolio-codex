const track = document.querySelector(".carousel__track");
const slides = Array.from(document.querySelectorAll(".carousel__slide"));
const prevButton = document.querySelector(".carousel__control--prev");
const nextButton = document.querySelector(".carousel__control--next");
const indicators = document.querySelector(".carousel__indicators");
const tiltCards = document.querySelectorAll(".tilt-card");
const orbit = document.querySelector(".doctor-orbit");

let currentIndex = 0;
let autoPlay;

function renderDots() {
  if (!indicators || slides.length === 0) {
    return;
  }

  slides.forEach((_, index) => {
    const dot = document.createElement("button");
    dot.className = `carousel__dot${index === 0 ? " active" : ""}`;
    dot.type = "button";
    dot.setAttribute("aria-label", `Go to slide ${index + 1}`);
    dot.addEventListener("click", () => {
      currentIndex = index;
      updateCarousel();
      restartAutoplay();
    });
    indicators.appendChild(dot);
  });
}

function updateCarousel() {
  if (!track || slides.length === 0) {
    return;
  }

  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  slides.forEach((slide, index) => {
    slide.classList.toggle("active", index === currentIndex);
  });

  document.querySelectorAll(".carousel__dot").forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex);
  });
}

function goToSlide(direction) {
  if (slides.length === 0) {
    return;
  }

  currentIndex = (currentIndex + direction + slides.length) % slides.length;
  updateCarousel();
  restartAutoplay();
}

function startAutoplay() {
  if (slides.length === 0) {
    return;
  }

  autoPlay = window.setInterval(() => {
    currentIndex = (currentIndex + 1) % slides.length;
    updateCarousel();
  }, 3500);
}

function restartAutoplay() {
  window.clearInterval(autoPlay);
  startAutoplay();
}

function attachTilt(card) {
  card.addEventListener("mousemove", (event) => {
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 12;
    const rotateX = (0.5 - (y / rect.height)) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
  });

  card.addEventListener("mouseleave", () => {
    card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)";
  });
}

function attachHeroMotion() {
  if (!orbit) {
    return;
  }

  window.addEventListener("mousemove", (event) => {
    const xRatio = (event.clientX / window.innerWidth) - 0.5;
    const yRatio = (event.clientY / window.innerHeight) - 0.5;
    orbit.style.transform = `rotateX(${8 - yRatio * 12}deg) rotateY(${xRatio * 18}deg)`;
  });

  window.addEventListener("mouseleave", () => {
    orbit.style.transform = "";
  });
}

renderDots();
updateCarousel();
startAutoplay();

if (prevButton) {
  prevButton.addEventListener("click", () => goToSlide(-1));
}

if (nextButton) {
  nextButton.addEventListener("click", () => goToSlide(1));
}

tiltCards.forEach(attachTilt);
attachHeroMotion();
