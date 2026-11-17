/**
 * Devix Creative Agency Theme — Interactive Scripts
 * Devix Kumar Multi-Page Portfolio
 */

document.addEventListener('DOMContentLoaded', () => {
  initPKTClock();
  initMobileNav();
  initWorkFilters();
  initContactForm();
  initFaqAccordion();
  initScrollAnimations();
});

/**
 * Live Karachi PKT Clock (UTC+5)
 */
function initPKTClock() {
  const clockEl = document.getElementById('live-pkt-clock');
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
 * Mobile Navigation Drawer
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.nav-mobile-btn');
  const drawer = document.querySelector('.mobile-nav-drawer');
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
 * Filter Tabs on Work Page
 */
function initWorkFilters() {
  const filterBtns = document.querySelectorAll('.work-filter-tab');
  const projectItems = document.querySelectorAll('.work-project-item');
  if (!filterBtns.length || !projectItems.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterVal = btn.getAttribute('data-filter');

      projectItems.forEach(item => {
        const cat = item.getAttribute('data-category');
        if (filterVal === 'all' || cat === filterVal || cat.includes(filterVal)) {
          item.style.display = 'block';
          item.style.opacity = '0';
          item.style.transform = 'translateY(12px)';
          setTimeout(() => {
            item.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
          }, 30);
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

/**
 * Interactive Contact Form with Service & Budget Pills
 */
function initContactForm() {
  const form = document.getElementById('devix-contact-form');
  if (!form) return;

  // Service pills
  const servicePills = document.querySelectorAll('.pill-service-select');
  const hiddenService = document.getElementById('selected-service-val');
  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      servicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (hiddenService) {
        hiddenService.value = pill.getAttribute('data-value') || pill.textContent.trim();
      }
    });
  });

  // Budget pills
  const budgetPills = document.querySelectorAll('.pill-budget-select');
  const hiddenBudget = document.getElementById('selected-budget-val');
  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (hiddenBudget) {
        hiddenBudget.value = pill.getAttribute('data-value') || pill.textContent.trim();
      }
    });
  });

  // Submit handling
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-client-name');
    const emailInput = document.getElementById('contact-client-email');
    const messageInput = document.getElementById('contact-client-msg');
    const successBanner = document.getElementById('contact-success-notice');

    let valid = true;

    // Reset errors
    document.querySelectorAll('.input-error-notice').forEach(el => el.style.display = 'none');
    [nameInput, emailInput, messageInput].forEach(inp => inp && inp.classList.remove('is-invalid'));
    if (successBanner) successBanner.style.display = 'none';

    // Name check
    if (!nameInput || !nameInput.value.trim()) {
      valid = false;
      if (nameInput) {
        nameInput.classList.add('is-invalid');
        const err = document.getElementById('err-client-name');
        if (err) err.style.display = 'block';
      }
    }

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      valid = false;
      if (emailInput) {
        emailInput.classList.add('is-invalid');
        const err = document.getElementById('err-client-email');
        if (err) err.style.display = 'block';
      }
    }

    // Message check
    if (!messageInput || !messageInput.value.trim()) {
      valid = false;
      if (messageInput) {
        messageInput.classList.add('is-invalid');
        const err = document.getElementById('err-client-msg');
        if (err) err.style.display = 'block';
      }
    }

    if (valid) {
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
  const faqItems = document.querySelectorAll('.faq-accordion-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-header-btn');
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

/**
 * Scroll Reveal Animations
 */
function initScrollAnimations() {
  const reveals = document.querySelectorAll('.reveal-fade');
  if (!reveals.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    reveals.forEach(el => observer.observe(el));
  } else {
    reveals.forEach(el => el.classList.add('is-revealed'));
  }
}
