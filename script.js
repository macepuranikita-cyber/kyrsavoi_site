document.addEventListener('DOMContentLoaded', () => {
  const leadForm = document.getElementById('lead-form');

  if (leadForm) {
    leadForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('user-name').value.trim();
      const phone = document.getElementById('user-phone').value.trim();

      if (name.length < 2) {
        alert('Пожалуйста, введите корректное имя.');
        return;
      }

      alert(`Спасибо за заявку, ${name}! Наш инженер свяжется с вами по номеру ${phone} для подбора ПК.`);
      leadForm.reset();
    });
  }
});
// Логика фильтрации и сортировки в каталоге
const catalogGrid = document.getElementById('catalog-grid');

if (catalogGrid) {
  const cards = Array.from(catalogGrid.querySelectorAll('.product-card'));
  const countEl = document.getElementById('product-count');
  const sortSelect = document.getElementById('sort-select');
  const resetBtn = document.getElementById('reset-filters');
  const checkboxes = document.querySelectorAll('.filters-sidebar input[type="checkbox"]');

  function applyFilters() {
    const selectedCats = Array.from(document.querySelectorAll('input[name="cat"]:checked')).map(cb => cb.value);
    const selectedGpus = Array.from(document.querySelectorAll('input[name="gpu"]:checked')).map(cb => cb.value);
    const selectedCpus = Array.from(document.querySelectorAll('input[name="cpu"]:checked')).map(cb => cb.value);

    let visibleCount = 0;

    cards.forEach(card => {
      const cat = card.dataset.cat;
      const gpu = card.dataset.gpu;
      const cpu = card.dataset.cpu;

      const matchesCat = selectedCats.length === 0 || selectedCats.includes(cat);
      const matchesGpu = selectedGpus.length === 0 || selectedGpus.includes(gpu);
      const matchesCpu = selectedCpus.length === 0 || selectedCpus.includes(cpu);

      if (matchesCat && matchesGpu && matchesCpu) {
        card.style.display = 'flex';
        visibleCount++;
      } else {
        card.style.display = 'none';
      }
    });

    if (countEl) {
      countEl.textContent = visibleCount;
    }
  }

  // Слушатели на чекбоксы
  checkboxes.forEach(cb => cb.addEventListener('change', applyFilters));

  // Сброс фильтров
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      checkboxes.forEach(cb => cb.checked = true);
      applyFilters();
    });
  }

  // Сортировка по цене
  if (sortSelect) {
    sortSelect.addEventListener('change', () => {
      const mode = sortSelect.value;
      const sortedCards = [...cards];

      if (mode === 'price-asc') {
        sortedCards.sort((a, b) => Number(a.dataset.price) - Number(b.dataset.price));
      } else if (mode === 'price-desc') {
        sortedCards.sort((a, b) => Number(b.dataset.price) - Number(a.dataset.price));
      }

      sortedCards.forEach(card => catalogGrid.appendChild(card));
    });
  }
}
// Логика галереи в карточке товара
const mainProductImg = document.getElementById('main-product-img');
const thumbs = document.querySelectorAll('.thumb-item');

if (mainProductImg && thumbs.length > 0) {
  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
      const newSrc = thumb.dataset.src;
      if (newSrc) {
        mainProductImg.src = newSrc;
      }
    });
  });
}

// Кнопка покупки в 1 клик
const btnBuyNow = document.getElementById('btn-buy-now');
if (btnBuyNow) {
  btnBuyNow.addEventListener('click', () => {
    const phone = prompt('Введите ваш номер телефона для оформления заказа:', '+7 ');
    if (phone && phone.trim().length > 6) {
      alert('Заказ успешно оформлен! Менеджер свяжется с вами в течение 10 минут.');
    }
  });
}
// Логика интерактивного калькулятора сборки ПК
const calcCpu = document.getElementById('calc-cpu');
const calcGpu = document.getElementById('calc-gpu');
const calcRam = document.getElementById('calc-ram');
const calcSsd = document.getElementById('calc-ssd');
const calcCase = document.getElementById('calc-case');
const sumPartsEl = document.getElementById('sum-parts');
const totalPriceEl = document.getElementById('calc-total-price');
const btnOrderBuild = document.getElementById('btn-order-build');

if (calcCpu && calcGpu && calcRam && calcSsd && calcCase && totalPriceEl) {
  const BUILD_SERVICE_FEE = 3500; // Базовая стоимость услуг сборки

  function updateBuildCalculation() {
    const cpuPrice = Number(calcCpu.value);
    const gpuPrice = Number(calcGpu.value);
    const ramPrice = Number(calcRam.value);
    const ssdPrice = Number(calcSsd.value);
    const casePrice = Number(calcCase.value);

    const partsTotal = cpuPrice + gpuPrice + ramPrice + ssdPrice + casePrice;
    const finalTotal = partsTotal + BUILD_SERVICE_FEE;

    // Форматирование вывода в рублях с пробелами (напр. 124 000 ₽)
    if (sumPartsEl) {
      sumPartsEl.textContent = partsTotal.toLocaleString('ru-RU') + ' ₽';
    }
    totalPriceEl.textContent = finalTotal.toLocaleString('ru-RU') + ' ₽';
  }

  // Слушатели изменений во всех селекторах
  [calcCpu, calcGpu, calcRam, calcSsd, calcCase].forEach(select => {
    select.addEventListener('change', updateBuildCalculation);
  });

  // Первичный пересчет при открытии
  updateBuildCalculation();

  // Заказ кастомной конфигурации
  if (btnOrderBuild) {
    btnOrderBuild.addEventListener('click', () => {
      const summaryText = `Сборка:\n- ${calcCpu.options[calcCpu.selectedIndex].dataset.name}\n- ${calcGpu.options[calcGpu.selectedIndex].dataset.name}\n- ${calcRam.options[calcRam.selectedIndex].dataset.name}\nИтого: ${totalPriceEl.textContent}`;
      const userPhone = prompt(`${summaryText}\n\nВведите ваш телефон для заказа сборки:`, '+7 ');
      if (userPhone && userPhone.trim().length > 6) {
        alert('Заявка на сборку принята! Инженер свяжется с вами для согласования деталей.');
      }
    });
  }
}
// Логика аккордеона FAQ на странице О компании
const faqItems = document.querySelectorAll('.faq-item');

if (faqItems.length > 0) {
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      // Закрываем остальные вкладки (режим аккордеона)
      faqItems.forEach(i => i.classList.remove('active'));

      // Если кликнули по закрытому — открываем его
      if (!isActive) {
        item.classList.add('active');
      }
    });
  });
}
// Обработка формы на странице контактов
const contactForm = document.getElementById('contact-form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('contact-name').value.trim();
    alert(`Спасибо за обращение, ${name}! Ваше сообщение отправлено в службу поддержки. Мы ответим на указанный email.`);
    contactForm.reset();
  });
}
// Автоматический слайдер Hero-блока
const slides = document.querySelectorAll('.hero-slide');
const prevBtn = document.getElementById('slider-prev');
const nextBtn = document.getElementById('slider-next');
const dotsContainer = document.getElementById('slider-dots');

if (slides.length > 0) {
  let currentSlide = 0;
  let slideInterval = null;

  // Создание точек-индикаторов
  slides.forEach((_, idx) => {
    const dot = document.createElement('div');
    dot.className = `slider-dot ${idx === 0 ? 'active' : ''}`;
    dot.addEventListener('click', () => goToSlide(idx));
    dotsContainer.appendChild(dot);
  });

  const dots = document.querySelectorAll('.slider-dot');

  function updateSlideClasses() {
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentSlide);
    });
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentSlide);
    });
  }

  function goToSlide(idx) {
    currentSlide = (idx + slides.length) % slides.length;
    updateSlideClasses();
    resetAutoPlay();
  }

  function nextSlide() {
    goToSlide(currentSlide + 1);
  }

  function prevSlide() {
    goToSlide(currentSlide - 1);
  }

  if (nextBtn) nextBtn.addEventListener('click', nextSlide);
  if (prevBtn) prevBtn.addEventListener('click', prevSlide);

  function startAutoPlay() {
    slideInterval = setInterval(nextSlide, 4000); // Смена каждые 4 секунды
  }

  function resetAutoPlay() {
    clearInterval(slideInterval);
    startAutoPlay();
  }

  startAutoPlay();
}