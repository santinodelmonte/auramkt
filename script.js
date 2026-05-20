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
const hamburger   = document.getElementById('hamburger');
const mobileNav   = document.getElementById('mobileNav');
const mobileClose = document.getElementById('mobileNavClose');

// Crear overlay dinámicamente si no existe en el HTML
let navOverlay = document.getElementById('navOverlay');
if (!navOverlay) {
  navOverlay = document.createElement('div');
  navOverlay.className = 'nav-overlay';
  navOverlay.id = 'navOverlay';
  document.body.appendChild(navOverlay);
}

function openMobileNav() {
  mobileNav?.classList.add('open');
  navOverlay.classList.add('active');
  hamburger?.classList.add('active');
  document.body.style.overflow = 'hidden';
  mobileNav?.setAttribute('aria-hidden', 'false');
}

function closeMobileNav() {
  mobileNav?.classList.remove('open');
  navOverlay.classList.remove('active');
  hamburger?.classList.remove('active');
  document.body.style.overflow = '';
  mobileNav?.setAttribute('aria-hidden', 'true');
}

function toggleMobileNav() {
  if (mobileNav?.classList.contains('open')) {
    closeMobileNav();
  } else {
    openMobileNav();
  }
}

hamburger?.addEventListener('click', toggleMobileNav);
mobileClose?.addEventListener('click', closeMobileNav);
navOverlay.addEventListener('click', closeMobileNav);

// Cerrar al hacer click en cualquier link
mobileNav?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', closeMobileNav);
});

// Cerrar con Escape
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileNav?.classList.contains('open')) {
    closeMobileNav();
  }
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
// EmailJS Configuration
// IMPORTANTE: Reemplazá estos valores con tus credenciales de EmailJS
const EMAILJS_CONFIG = {
  serviceID: 'TU_SERVICE_ID',      // Obtener de https://dashboard.emailjs.com/admin
  templateID: 'TU_TEMPLATE_ID',    // Obtener de https://dashboard.emailjs.com/admin/templates
  publicKey: 'TU_PUBLIC_KEY'       // Obtener de https://dashboard.emailjs.com/admin/account
};

// Inicializar EmailJS
if (typeof emailjs !== 'undefined') {
  emailjs.init(EMAILJS_CONFIG.publicKey);
}

const contactForm = document.getElementById('contactForm');
contactForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const btn = contactForm.querySelector('button[type="submit"]');
  const btnOriginalText = btn.innerHTML;
  
  // Validación básica
  const nombre = document.getElementById('nombre').value.trim();
  const email = document.getElementById('email').value.trim();
  const servicio = document.getElementById('servicio').value;
  const mensaje = document.getElementById('mensaje').value.trim();
  
  if (!nombre || !email || !servicio || !mensaje) {
    alert('Por favor completá todos los campos obligatorios.');
    return;
  }
  
  // Validar email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert('Por favor ingresá un email válido.');
    return;
  }
  
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
  btn.disabled = true;
  
  try {
    // Verificar que EmailJS esté cargado
    if (typeof emailjs === 'undefined') {
      throw new Error('EmailJS no está cargado correctamente');
    }
    
    // Preparar los parámetros del template
    const templateParams = {
      from_name: nombre,
      from_email: email,
      phone: document.getElementById('telefono').value || 'No proporcionado',
      service: servicio,
      message: mensaje,
      to_email: 'auramkt.uy@gmail.com' // Email de destino (AuraMKT)
    };
    
    // Enviar email usando EmailJS
    const response = await emailjs.send(
      EMAILJS_CONFIG.serviceID,
      EMAILJS_CONFIG.templateID,
      templateParams
    );
    
    console.log('Email enviado exitosamente:', response);
    
    // Mostrar mensaje de éxito
    const successMsg = document.getElementById('formSuccess');
    if (successMsg) {
      contactForm.style.display = 'none';
      successMsg.style.display = 'block';
    } else {
      btn.innerHTML = '<i class="fas fa-check"></i> ¡Mensaje enviado!';
      btn.style.background = '#10B981';
      setTimeout(() => {
        btn.innerHTML = btnOriginalText;
        btn.disabled = false;
        btn.style.background = '';
        contactForm.reset();
      }, 3000);
    }
    
  } catch (error) {
    console.error('Error al enviar el email:', error);
    
    // Mostrar error al usuario
    btn.innerHTML = btnOriginalText;
    btn.disabled = false;
    
    alert('Hubo un error al enviar el mensaje. Por favor intentá nuevamente o contactanos por WhatsApp.');
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

/* ===========================
   COMMUNITY MANAGER MODALS
   =========================== */

function openCMModal(id) {
  const modal = document.getElementById(id);

  if (!modal) return;

  modal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeCMModal(event, id) {

  if (event && event.target !== document.getElementById(id)) {
    return;
  }

  const modal = document.getElementById(id);

  if (!modal) return;

  modal.style.display = 'none';
  document.body.style.overflow = '';
}

// Flip mobile
if (window.innerWidth < 992) {

  document.querySelectorAll('.cm-card').forEach(card => {

    card.addEventListener('touchstart', function() {
      this.classList.toggle('active');
    });

  });

}

// Escape
document.addEventListener('keydown', function(e) {

  if (e.key === 'Escape') {

    ['cmModal1', 'cmModal2', 'cmModal3'].forEach(function(id) {

      const modal = document.getElementById(id);

      if (modal && modal.style.display === 'flex') {
        modal.style.display = 'none';
        document.body.style.overflow = '';
      }

    });

  }

});
/* ===========================
   CLIENTS LOGO CAROUSEL
   Duplica los items con JS para
   que el loop sea continuo y solo
   cargue cada imagen una vez.
   =========================== */

(function () {
  const track = document.getElementById('clientsTrack');
  if (!track) return;

  const wrapper = track.parentElement;
  const SPEED = 0.6; // px por frame — ajustar para más rápido/lento

  // 1. Esperar a que todas las imágenes carguen para medir correctamente
  const images = Array.from(track.querySelectorAll('img'));
  let loaded = 0;

  function init() {
    // 2. Clonar el set original las veces necesarias para cubrir al menos
    //    el doble del ancho del wrapper (garantiza que siempre haya logos visibles)
    const originalItems = Array.from(track.children);
    const originalWidth = track.scrollWidth;
    const wrapperWidth = wrapper.offsetWidth;

    const clonesNeeded = Math.ceil((wrapperWidth * 2) / originalWidth) + 1;

    for (let i = 0; i < clonesNeeded; i++) {
      originalItems.forEach(function (item) {
        const clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        track.appendChild(clone);
      });
    }

    // 3. Guardar el ancho del set original (punto de reset)
    const loopWidth = originalWidth;

    let currentX = 0;
    let paused = false;
    let rafId = null;

    wrapper.addEventListener('mouseenter', function () { paused = true; });
    wrapper.addEventListener('mouseleave', function () { paused = false; });

    // Respetar preferencia de movimiento reducido
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    function tick() {
      if (!paused) {
        currentX -= SPEED;
        // Cuando el desplazamiento supera el ancho del set original → reset instantáneo
        if (Math.abs(currentX) >= loopWidth) {
          currentX = 0;
        }
        track.style.transform = 'translateX(' + currentX + 'px)';
      }
      rafId = requestAnimationFrame(tick);
    }

    rafId = requestAnimationFrame(tick);

    // Pausar cuando la pestaña no está visible para ahorrar recursos
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) {
        cancelAnimationFrame(rafId);
      } else {
        rafId = requestAnimationFrame(tick);
      }
    });
  }

  // Esperar a que carguen las imágenes antes de medir anchos
  if (images.length === 0) {
    init();
  } else {
    images.forEach(function (img) {
      if (img.complete) {
        loaded++;
        if (loaded === images.length) init();
      } else {
        img.addEventListener('load', function () {
          loaded++;
          if (loaded === images.length) init();
        });
        img.addEventListener('error', function () {
          loaded++;
          if (loaded === images.length) init();
        });
      }
    });
  }
})();