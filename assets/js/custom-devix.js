/**
 * Custom Devix Interactive Controller for Aryan Kumar Portfolio
 * - Live PKT Clock (UTC+5)
 * - Floating Glass Navbar Mobile Drawer
 * - Work Filter Tabs
 * - Contact Form Validation & Selection Pills
 * - FAQ Accordion
 */

document.addEventListener('DOMContentLoaded', () => {
  initPKTClock();
  initMobileNav();
  initWorkFilters();
  initContactForm();
  initFaqAccordion();
  initBackToTop();
});

/**
 * Back to Top Button Smooth Controller
 */
function initBackToTop() {
  const backTopBtn = document.getElementById('back-top');
  if (!backTopBtn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      backTopBtn.classList.add('show');
    } else {
      backTopBtn.classList.remove('show');
    }
  });

  backTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * Live Karachi PKT Clock (UTC+5)
 */
function initPKTClock() {
  const clockEl = (document.getElementById('devix-pkt-clock') || document.getElementById('Devix-pkt-clock'));
  if (!clockEl) return;

  function updateClock() {
    const now = new Date();
    try {
      const options = {
        timeZone: 'Asia/Karachi',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      };
      const formatted = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `${formatted} PKT`;
    } catch (e) {
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const pktDate = new Date(utc + (3600000 * 5));
      let h = pktDate.getHours();
      const m = String(pktDate.getMinutes()).padStart(2, '0');
      const s = String(pktDate.getSeconds()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12 || 12;
      clockEl.textContent = `${String(h).padStart(2, '0')}:${m}:${s} ${ampm} PKT`;
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

/**
 * Floating Glass Navbar Mobile Drawer Toggle
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.devix-mobile-toggle, .Devix-mobile-toggle');
  const drawer = document.querySelector('.devix-mobile-drawer, .Devix-mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  document.addEventListener('click', (e) => {
    if (!drawer.contains(e.target) && !toggleBtn.contains(e.target) && drawer.classList.contains('open')) {
      drawer.classList.remove('open');
      toggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
      toggleBtn.setAttribute('aria-expanded', 'false');
    }
  });
}

/**
 * Project Filter Tabs on Work Page
 */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.filter-tab-pill');
  const projectCards = document.querySelectorAll('.devix-case-study-item, .Devix-case-study-item');
  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal || cat.includes(filterVal)) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(12px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Contact Form Validation with Service & Budget Pills
 */
function initContactForm() {
  const form = (document.getElementById('devix-contact-form') || document.getElementById('Devix-contact-form'));
  if (!form) return;

  const servicePills = document.querySelectorAll('.service-pill-select, .pill-service-select');
  const hiddenService = document.getElementById('hidden-selected-service') || document.getElementById('selected-service-val');
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      servicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (hiddenService) {
        hiddenService.value = pill.getAttribute('data-val') || pill.getAttribute('data-value') || pill.textContent.trim();
      }
    });
  });

  const budgetPills = document.querySelectorAll('.budget-pill-select, .pill-budget-select');
  const hiddenBudget = document.getElementById('hidden-selected-budget') || document.getElementById('selected-budget-val');
  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (hiddenBudget) {
        hiddenBudget.value = pill.getAttribute('data-val') || pill.getAttribute('data-value') || pill.textContent.trim();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = (document.getElementById('devix-name') || document.getElementById('Devix-name')) || document.getElementById('contact-client-name');
    const emailInput = (document.getElementById('devix-email') || document.getElementById('Devix-email')) || document.getElementById('contact-client-email');
    const messageInput = (document.getElementById('devix-message') || document.getElementById('Devix-message')) || document.getElementById('contact-client-msg');
    const successBanner = (document.getElementById('devix-success-banner') || document.getElementById('Devix-success-banner')) || document.getElementById('contact-success-notice');

    let isValid = true;

    // Reset error states
    document.querySelectorAll('.devix-error-text, .Devix-error-text, .input-error-notice').forEach(el => el.style.display = 'none');
    [nameInput, emailInput, messageInput].forEach(inp => inp && inp.classList.remove('is-invalid'));
    if (successBanner) successBanner.style.display = 'none';

    // Validate Name
    if (!nameInput || !nameInput.value.trim()) {
      isValid = false;
      if (nameInput) {
        nameInput.classList.add('is-invalid');
        const err = (document.getElementById('err-devix-name') || document.getElementById('err-Devix-name')) || document.getElementById('err-client-name');
        if (err) err.style.display = 'block';
      }
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      isValid = false;
      if (emailInput) {
        emailInput.classList.add('is-invalid');
        const err = (document.getElementById('err-devix-email') || document.getElementById('err-Devix-email')) || document.getElementById('err-client-email');
        if (err) err.style.display = 'block';
      }
    }

    // Validate Message
    if (!messageInput || !messageInput.value.trim()) {
      isValid = false;
      if (messageInput) {
        messageInput.classList.add('is-invalid');
        const err = (document.getElementById('err-devix-message') || document.getElementById('err-Devix-message')) || document.getElementById('err-client-msg');
        if (err) err.style.display = 'block';
      }
    }

    if (isValid) {
      if (successBanner) {
        successBanner.style.display = 'block';
        successBanner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      servicePills.forEach((p, idx) => idx === 0 ? p.classList.add('active') : p.classList.remove('active'));
      budgetPills.forEach((p, idx) => idx === 1 ? p.classList.add('active') : p.classList.remove('active'));
    }
  });
}

/**
 * FAQ Accordion on Services Page
 */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.devix-faq-card, .Devix-faq-card, .faq-accordion-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.devix-faq-btn, .Devix-faq-btn, .faq-header-btn');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const wasActive = item.classList.contains('active');
      faqItems.forEach(i => i.classList.remove('active'));
      if (!wasActive) {
        item.classList.add('active');
      }
    });
  });
}
