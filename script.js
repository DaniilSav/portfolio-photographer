// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
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
const AUTOPLAY_DELAY = 5000;

let currentIndex = 0;
let autoplayTimer = null;

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
  autoplayTimer = setInterval(() => goToSlide(currentIndex + 1), AUTOPLAY_DELAY);
}

function restartAutoplay() {
  clearInterval(autoplayTimer);
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

// Pause autoplay while the cursor is over the carousel, resume on leave
const carouselEl = document.querySelector('.testimonial-carousel');
carouselEl.addEventListener('mouseenter', () => clearInterval(autoplayTimer));
carouselEl.addEventListener('mouseleave', startAutoplay);

goToSlide(0);
startAutoplay();

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
