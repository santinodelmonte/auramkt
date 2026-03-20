/* ===========================
   AURAMKT - MAIN SCRIPT
   =========================== */

// ---- Navbar scroll ----
const navbar = document.querySelector('.navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar?.classList.add('scrolled');
  else navbar?.classList.remove('scrolled');
});

// ---- Mobile nav ----
const hamburger = document.getElementById('hamburger');
const mobileNav = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileNavClose');

hamburger?.addEventListener('click', () => mobileNav?.classList.add('open'));
mobileClose?.addEventListener('click', () => mobileNav?.classList.remove('open'));
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileNav?.classList.remove('open'));
});

// ---- Active nav link ----
const currentPath = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.nav-links a, .nav-mobile a').forEach(a => {
  const href = a.getAttribute('href');
  if (href === currentPath || (currentPath === '' && href === 'index.html')) {
    a.classList.add('active');
  }
});

// ---- AOS Init ----
document.addEventListener('DOMContentLoaded', () => {
  if (typeof AOS !== 'undefined') {
    AOS.init({ duration: 700, easing: 'ease-out-cubic', once: true, offset: 60 });
  }
});

// ---- Counter animation ----
function animateCounter(el, target, duration = 2000) {
  let start = 0;
  const step = target / (duration / 16);
  const timer = setInterval(() => {
    start += step;
    if (start >= target) { el.textContent = target + (el.dataset.suffix || ''); clearInterval(timer); }
    else el.textContent = Math.floor(start) + (el.dataset.suffix || '');
  }, 16);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const target = parseInt(e.target.dataset.target);
      animateCounter(e.target, target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('[data-target]').forEach(el => counterObserver.observe(el));

// ---- Portfolio Swiper ----
if (document.querySelector('.swiper-portfolio')) {
  new Swiper('.swiper-portfolio', {
    slidesPerView: 1,
    spaceBetween: 24,
    pagination: { el: '.swiper-pagination', clickable: true },
    breakpoints: {
      640: { slidesPerView: 2 },
      1024: { slidesPerView: 3 }
    },
    loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false }
  });
}

// ---- Portfolio filter ----
const filterTabs = document.querySelectorAll('.filter-tab');
const portfolioItems = document.querySelectorAll('.portfolio-item');

filterTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    filterTabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    const filter = tab.dataset.filter;
    portfolioItems.forEach(item => {
      if (filter === 'all' || item.dataset.category === filter) {
        item.style.display = 'block';
        item.style.animation = 'fadeIn 0.3s ease forwards';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// ---- Portfolio modal ----
const modalOverlay = document.getElementById('portfolioModal');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.portfolio-item[data-modal]').forEach(item => {
  item.addEventListener('click', () => {
    const data = JSON.parse(item.dataset.modal);
    document.getElementById('modalTitle').textContent = data.title;
    document.getElementById('modalCategory').textContent = data.category;
    document.getElementById('modalDesc').textContent = data.desc;
    document.getElementById('modalStat1').innerHTML = `<strong>${data.stat1v}</strong><span>${data.stat1l}</span>`;
    document.getElementById('modalStat2').innerHTML = `<strong>${data.stat2v}</strong><span>${data.stat2l}</span>`;
    document.getElementById('modalStat3').innerHTML = `<strong>${data.stat3v}</strong><span>${data.stat3l}</span>`;
    modalOverlay?.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

modalClose?.addEventListener('click', closeModal);
modalOverlay?.addEventListener('click', (e) => { if (e.target === modalOverlay) closeModal(); });

function closeModal() {
  modalOverlay?.classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

// ---- Contact form ----
const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = contactForm.querySelector('button[type="submit"]');
  btn.textContent = 'Enviando...';
  btn.disabled = true;

  // Simulate send (replace with EmailJS)
  await new Promise(r => setTimeout(r, 1500));

  const successMsg = document.getElementById('formSuccess');
  if (successMsg) {
    contactForm.style.display = 'none';
    successMsg.style.display = 'block';
  } else {
    btn.textContent = '¡Mensaje enviado!';
    btn.style.background = '#10B981';
    setTimeout(() => {
      btn.textContent = 'Enviar mensaje';
      btn.disabled = false;
      btn.style.background = '';
      contactForm.reset();
    }, 3000);
  }
});

// ---- Smooth scroll for anchors ----
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- Fade in animation helper ----
const style = document.createElement('style');
style.textContent = `@keyframes fadeIn { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:none; } }`;
document.head.appendChild(style);
