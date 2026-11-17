/**
 * Devix Kumar Portfolio Core Interactive Script
 * - Live PKT Clock
 * - Mobile Menu Drawer
 * - Filter Tabs for Work/Projects
 * - Validated Contact Form with Selection Pills
 * - Scroll Reveal Animations (IntersectionObserver + GSAP fallback)
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Live PKT Clock (Karachi, Pakistan: UTC+5)
  initPKTClock();

  // 2. Mobile Drawer Navigation
  initMobileNav();

  // 3. Project Filter Tabs
  initProjectFilters();

  // 4. Contact Form Validation & Pills
  initContactForm();

  // 5. Scroll Reveals
  initScrollAnimations();
});

/**
 * Live Karachi PKT Clock
 */
function initPKTClock() {
  const clockEl = document.getElementById('live-pkt-clock');
  if (!clockEl) return;

  function updateTime() {
    const now = new Date();
    // Format to PKT (Asia/Karachi)
    const options = {
      timeZone: 'Asia/Karachi',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    };
    try {
      const timeStr = new Intl.DateTimeFormat('en-US', options).format(now);
      clockEl.textContent = `${timeStr} PKT`;
    } catch (e) {
      // Fallback calculation for UTC+5
      const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
      const pktDate = new Date(utc + (3600000 * 5));
      let h = pktDate.getHours();
      const m = String(pktDate.getMinutes()).padStart(2, '0');
      const s = String(pktDate.getSeconds()).padStart(2, '0');
      const ampm = h >= 12 ? 'PM' : 'AM';
      h = h % 12;
      h = h ? h : 12;
      clockEl.textContent = `${String(h).padStart(2, '0')}:${m}:${s} ${ampm} PKT`;
    }
  }

  updateTime();
  setInterval(updateTime, 1000);
}

/**
 * Mobile Drawer Menu
 */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-nav-toggle');
  const drawer = document.querySelector('.mobile-drawer');
  if (!toggleBtn || !drawer) return;

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = drawer.classList.toggle('open');
    toggleBtn.innerHTML = isOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    toggleBtn.setAttribute('aria-expanded', isOpen);
  });

  // Close when clicking outside
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
function initProjectFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card-item');

  if (!filterBtns.length || !projectCards.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      projectCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue || (filterValue === 'react' && category.includes('react')) || (filterValue === 'php' && category.includes('php'))) {
          card.style.display = 'block';
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
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
 * Validated Interactive Contact Form
 */
function initContactForm() {
  const form = document.getElementById('portfolio-contact-form');
  if (!form) return;

  // Clickable service pills
  const servicePills = document.querySelectorAll('.service-pill');
  const selectedServiceInput = document.getElementById('selected-service');

  servicePills.forEach(pill => {
    pill.addEventListener('click', () => {
      servicePills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (selectedServiceInput) {
        selectedServiceInput.value = pill.getAttribute('data-val') || pill.textContent.trim();
      }
    });
  });

  // Clickable budget pills
  const budgetPills = document.querySelectorAll('.budget-pill');
  const selectedBudgetInput = document.getElementById('selected-budget');

  budgetPills.forEach(pill => {
    pill.addEventListener('click', () => {
      budgetPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (selectedBudgetInput) {
        selectedBudgetInput.value = pill.getAttribute('data-val') || pill.textContent.trim();
      }
    });
  });

  // Form submission with validation
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const nameInput = document.getElementById('contact-name');
    const emailInput = document.getElementById('contact-email');
    const messageInput = document.getElementById('contact-message');
    const banner = document.getElementById('form-success-banner');

    let isValid = true;

    // Reset error states
    document.querySelectorAll('.field-error-msg').forEach(el => el.classList.remove('show'));
    [nameInput, emailInput, messageInput].forEach(inp => inp && inp.classList.remove('is-invalid'));
    if (banner) banner.classList.remove('show');

    // Validate Name
    if (!nameInput || !nameInput.value.trim()) {
      isValid = false;
      if (nameInput) {
        nameInput.classList.add('is-invalid');
        const err = document.getElementById('error-name');
        if (err) err.classList.add('show');
      }
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailInput || !emailInput.value.trim() || !emailRegex.test(emailInput.value.trim())) {
      isValid = false;
      if (emailInput) {
        emailInput.classList.add('is-invalid');
        const err = document.getElementById('error-email');
        if (err) err.classList.add('show');
      }
    }

    // Validate Message
    if (!messageInput || !messageInput.value.trim()) {
      isValid = false;
      if (messageInput) {
        messageInput.classList.add('is-invalid');
        const err = document.getElementById('error-message');
        if (err) err.classList.add('show');
      }
    }

    if (isValid) {
      if (banner) {
        banner.classList.add('show');
        banner.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      form.reset();
      // Keep defaults
      servicePills.forEach((p, idx) => idx === 0 ? p.classList.add('active') : p.classList.remove('active'));
      budgetPills.forEach((p, idx) => idx === 1 ? p.classList.add('active') : p.classList.remove('active'));
    }
  });
}

/**
 * Smooth Scroll Reveal Animations
 */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.12,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback: reveal immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}
