// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

nav.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

// Phone input mask: formats as +7 (XXX) XXX-XX-XX
const phoneInput = document.getElementById('phone');

phoneInput.addEventListener('input', (e) => {
  let digits = e.target.value.replace(/\D/g, '');

  if (digits.startsWith('8')) digits = '7' + digits.slice(1);
  if (!digits.startsWith('7')) digits = '7' + digits;
  digits = digits.slice(0, 11);

  const rest = digits.slice(1);
  let formatted = '+7';
  if (rest.length > 0) formatted += ' (' + rest.slice(0, 3);
  if (rest.length >= 3) formatted += ')';
  if (rest.length > 3) formatted += ' ' + rest.slice(3, 6);
  if (rest.length > 6) formatted += '-' + rest.slice(6, 8);
  if (rest.length > 8) formatted += '-' + rest.slice(8, 10);

  e.target.value = formatted;
});

// Testimonials carousel
const track = document.getElementById('carouselTrack');
const slides = Array.from(track.children);
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('carouselDots');
const pauseBtn = document.getElementById('pauseBtn');
const AUTOPLAY_DELAY = 5000;
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

let currentIndex = 0;
let autoplayTimer = null;
let isPaused = prefersReducedMotion;

// Build one dot per slide, wiring each to jump straight to that slide
slides.forEach((_, index) => {
  const dot = document.createElement('button');
  dot.classList.add('carousel-dot');
  dot.setAttribute('aria-label', `Отзыв ${index + 1}`);
  dot.addEventListener('click', () => {
    goToSlide(index);
    restartAutoplay();
  });
  dotsContainer.appendChild(dot);
});

const dots = Array.from(dotsContainer.children);

function goToSlide(index) {
  // Wrap around in both directions so prev/next never runs out of slides
  currentIndex = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${currentIndex * 100}%)`;
  dots.forEach((dot, i) => dot.classList.toggle('active', i === currentIndex));
}

function startAutoplay() {
  if (isPaused) return;
  autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), AUTOPLAY_DELAY);
}

function stopAutoplay() {
  clearInterval(autoplayTimer);
}

function restartAutoplay() {
  stopAutoplay();
  startAutoplay();
}

prevBtn.addEventListener('click', () => {
  goToSlide(currentIndex - 1);
  restartAutoplay();
});

nextBtn.addEventListener('click', () => {
  goToSlide(currentIndex + 1);
  restartAutoplay();
});

// Explicit pause/play control, reachable by keyboard and touch (not just hover)
pauseBtn.addEventListener('click', () => {
  isPaused = !isPaused;
  pauseBtn.setAttribute('aria-pressed', String(isPaused));
  pauseBtn.textContent = isPaused ? 'Продолжить' : 'Пауза';
  if (isPaused) {
    stopAutoplay();
  } else {
    startAutoplay();
  }
});

// Pause autoplay while the cursor or keyboard focus is on the carousel
const carouselEl = document.querySelector('.testimonial-carousel');
carouselEl.addEventListener('mouseenter', stopAutoplay);
carouselEl.addEventListener('mouseleave', () => { if (!isPaused) startAutoplay(); });
carouselEl.addEventListener('focusin', stopAutoplay);
carouselEl.addEventListener('focusout', () => { if (!isPaused) startAutoplay(); });

if (prefersReducedMotion) {
  pauseBtn.setAttribute('aria-pressed', 'true');
  pauseBtn.textContent = 'Продолжить';
}

goToSlide(0);
startAutoplay();

// Shoot cost calculator
const calcType = document.getElementById('calcType');
const calcDuration = document.getElementById('calcDuration');
const calcLocation = document.getElementById('calcLocation');
const calcPhotos = document.getElementById('calcPhotos');
const calcVideo = document.getElementById('calcVideo');
const calcSecondPhotographer = document.getElementById('calcSecondPhotographer');
const calcRush = document.getElementById('calcRush');
const calculatorTotal = document.getElementById('calculatorTotal');

const EXTRA_HOUR_PRICE = 2500;

function calculateTotal() {
  const basePrice = Number(calcType.value);
  const extraHours = Number(calcDuration.value) - 1;
  const durationPrice = extraHours * EXTRA_HOUR_PRICE;
  const locationPrice = Number(calcLocation.value);
  const photosPrice = Number(calcPhotos.value);

  const extrasPrice = [calcVideo, calcSecondPhotographer, calcRush]
    .filter((checkbox) => checkbox.checked)
    .reduce((sum, checkbox) => sum + Number(checkbox.value), 0);

  const total = basePrice + durationPrice + locationPrice + photosPrice + extrasPrice;
  calculatorTotal.textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

[calcType, calcDuration, calcLocation, calcPhotos, calcVideo, calcSecondPhotographer, calcRush]
  .forEach((field) => field.addEventListener('change', calculateTotal));

calculateTotal();

// Booking form validation
const form = document.getElementById('bookingForm');
const nameInput = document.getElementById('name');
const dateInput = document.getElementById('date');
const successMessage = document.getElementById('formSuccess');

const nameError = document.getElementById('nameError');
const phoneError = document.getElementById('phoneError');
const dateError = document.getElementById('dateError');

function setError(input, errorEl, message) {
  errorEl.textContent = message;
  input.classList.toggle('invalid', Boolean(message));
  input.setAttribute('aria-invalid', String(Boolean(message)));
}

function validateName() {
  const value = nameInput.value.trim();
  if (!value) {
    setError(nameInput, nameError, 'Пожалуйста, укажите ваше имя');
    return false;
  }
  if (value.length < 2) {
    setError(nameInput, nameError, 'Имя слишком короткое');
    return false;
  }
  if (!/^[а-яА-ЯёЁa-zA-Z\s-]+$/.test(value)) {
    setError(nameInput, nameError, 'Имя может содержать только буквы');
    return false;
  }
  setError(nameInput, nameError, '');
  return true;
}

function validatePhone() {
  const digits = phoneInput.value.replace(/\D/g, '');
  if (!digits) {
    setError(phoneInput, phoneError, 'Пожалуйста, укажите номер телефона');
    return false;
  }
  if (digits.length !== 11) {
    setError(phoneInput, phoneError, 'Введите корректный номер телефона');
    return false;
  }
  setError(phoneInput, phoneError, '');
  return true;
}

function validateDate() {
  const value = dateInput.value;
  if (!value) {
    setError(dateInput, dateError, 'Пожалуйста, выберите дату съёмки');
    return false;
  }
  const selected = new Date(value + 'T00:00:00');
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  if (selected < today) {
    setError(dateInput, dateError, 'Дата не может быть в прошлом');
    return false;
  }
  setError(dateInput, dateError, '');
  return true;
}

nameInput.addEventListener('blur', validateName);
phoneInput.addEventListener('blur', validatePhone);
dateInput.addEventListener('blur', validateDate);

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const isNameValid = validateName();
  const isPhoneValid = validatePhone();
  const isDateValid = validateDate();

  if (isNameValid && isPhoneValid && isDateValid) {
    successMessage.classList.add('visible');
    form.reset();
    setError(nameInput, nameError, '');
    setError(phoneInput, phoneError, '');
    setError(dateInput, dateError, '');

    setTimeout(() => {
      successMessage.classList.remove('visible');
    }, 6000);
  } else {
    successMessage.classList.remove('visible');
  }
});
