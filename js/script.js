document.addEventListener('DOMContentLoaded', () => {

  /* ---- Mobile nav toggle ---- */
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');
  const siteHeader = document.getElementById('siteHeader');

  menuToggle.addEventListener('click', () => {
    const isOpen = mainNav.classList.toggle('is-open');
    menuToggle.classList.toggle('is-open', isOpen);
    menuToggle.setAttribute('aria-expanded', isOpen);
    updateHeaderState();
  });

  mainNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('is-open');
      menuToggle.classList.remove('is-open');
      menuToggle.setAttribute('aria-expanded', 'false');
      updateHeaderState();
    });
  });

  /* ---- Transparent-over-hero header that solidifies on scroll ---- */
  function updateHeaderState() {
    const shouldBeSolid = window.scrollY > 40 || mainNav.classList.contains('is-open');
    siteHeader.classList.toggle('scrolled', shouldBeSolid);
  }
  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  /* ---- Active nav link on scroll ---- */
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = mainNav.querySelectorAll('a');

  const setActiveLink = () => {
    let current = sections[0]?.id;
    sections.forEach(section => {
      const top = section.offsetTop - 120;
      if (window.scrollY >= top) current = section.id;
    });

    const scrolledToBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
    if (scrolledToBottom) {
      current = sections[sections.length - 1]?.id;
    }

    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
    });
  };
  window.addEventListener('scroll', setActiveLink, { passive: true });

  /* ---- Hero slideshow ---- */
  const heroSlides = document.querySelectorAll('.hero-slide');
  const heroDots = document.getElementById('heroDots');

  if (heroSlides.length > 1 && heroDots) {
    let currentSlide = 0;
    let slideTimer;

    heroSlides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.setAttribute('aria-label', `Show hero image ${i + 1}`);
      if (i === 0) dot.classList.add('active');
      dot.addEventListener('click', () => { goToSlide(i); restartTimer(); });
      heroDots.appendChild(dot);
    });

    const heroDotButtons = heroDots.querySelectorAll('button');

    function goToSlide(index) {
      heroSlides[currentSlide].classList.remove('active');
      heroDotButtons[currentSlide].classList.remove('active');
      currentSlide = index;
      heroSlides[currentSlide].classList.add('active');
      heroDotButtons[currentSlide].classList.add('active');
    }

    function startTimer() {
      slideTimer = setInterval(() => goToSlide((currentSlide + 1) % heroSlides.length), 5000);
    }
    function restartTimer() {
      clearInterval(slideTimer);
      startTimer();
    }

    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) startTimer();
  }

  /* ---- Experience carousel (sliding, looping, auto-play) ---- */
  const carousel = document.getElementById('carousel');
  const prevBtn = document.getElementById('prevSlide');
  const nextBtn = document.getElementById('nextSlide');

  const scrollAmount = () => {
    const card = carousel.querySelector('.exp-card');
    return card ? card.offsetWidth + 24 : 300;
  };

  const atEnd = () => carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5;
  const atStart = () => carousel.scrollLeft <= 5;

  const slideNext = () => {
    if (atEnd()) {
      carousel.scrollTo({ left: 0, behavior: 'smooth' });      // loop back to the first card
    } else {
      carousel.scrollBy({ left: scrollAmount(), behavior: 'smooth' });
    }
  };

  const slidePrev = () => {
    if (atStart()) {
      carousel.scrollTo({ left: carousel.scrollWidth, behavior: 'smooth' });  // jump to the last card
    } else {
      carousel.scrollBy({ left: -scrollAmount(), behavior: 'smooth' });
    }
  };

  let carouselTimer;
  const startCarousel = () => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    clearInterval(carouselTimer);
    carouselTimer = setInterval(slideNext, 4000);
  };
  const stopCarousel = () => clearInterval(carouselTimer);

  nextBtn.addEventListener('click', () => { slideNext(); startCarousel(); });
  prevBtn.addEventListener('click', () => { slidePrev(); startCarousel(); });

  // pause while the visitor is hovering or touching the carousel
  carousel.addEventListener('mouseenter', stopCarousel);
  carousel.addEventListener('mouseleave', startCarousel);
  carousel.addEventListener('touchstart', stopCarousel, { passive: true });
  carousel.addEventListener('touchend', startCarousel, { passive: true });

  startCarousel();

  /* ---- FAQ accordion ---- */
  const accordionItems = document.querySelectorAll('.accordion-item');

  accordionItems.forEach(item => {
    const trigger = item.querySelector('.accordion-trigger');
    const chev = item.querySelector('.chev');

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('is-open');

      accordionItems.forEach(other => {
        other.classList.remove('is-open');
        other.querySelector('.chev').textContent = '⌄';
      });

      if (!isOpen) {
        item.classList.add('is-open');
        chev.textContent = '⌃';
      }
    });
  });
});
