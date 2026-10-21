// ─── Scroll Reveal ───
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 100);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.15 });
revealEls.forEach(el => observer.observe(el));

// ─── Skill Bars animate on scroll ───
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.width + '%';
      });
      barObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });
document.querySelectorAll('.skill-group').forEach(g => barObserver.observe(g));

// ─── Nav shrink on scroll ───
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  nav.style.padding = window.scrollY > 50 ? '10px 40px' : '18px 40px';
});

// ─── Hamburger Menu ───
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

// ─── Live demo signup (Brevo double opt-in) ───
const demoDialog = document.getElementById('demo-dialog');
const demoForm = document.getElementById('demo-form');
const demoStatus = demoForm.querySelector('.demo-status');
const demoSubmit = demoForm.querySelector('[type=submit]');
document.querySelectorAll('.demo-open').forEach(btn => {
  btn.addEventListener('click', () => {
    demoForm.DEMO.value = btn.dataset.demo;
    demoStatus.textContent = '';
    demoDialog.showModal();
  });
});
demoDialog.querySelector('.demo-close').addEventListener('click', () => demoDialog.close());
demoDialog.addEventListener('click', e => { if (e.target === demoDialog) demoDialog.close(); });
const demoToast = document.getElementById('demo-toast');
let demoToastTimer;
function showDemoToast(msg) {
  demoToast.textContent = msg;
  demoToast.classList.add('show');
  clearTimeout(demoToastTimer);
  demoToastTimer = setTimeout(() => demoToast.classList.remove('show'), 5000);
}
// Brevo's double opt-in link redirects here with ?confirmed=1
if (new URLSearchParams(location.search).has('confirmed')) {
  showDemoToast('Email confirmed! Your demo link and login are on their way.');
  history.replaceState(null, '', location.pathname + location.hash);
}
demoForm.addEventListener('submit', async e => {
  e.preventDefault();
  demoSubmit.disabled = true;
  demoStatus.textContent = 'Sending...';
  try {
    const res = await fetch(demoForm.action, { method: 'POST', body: new FormData(demoForm) });
    const data = await res.json();
    if (!data.success) throw new Error('Brevo rejected the signup');
    demoForm.reset();
    demoDialog.close();
    showDemoToast(data.returning
      ? 'Welcome back! Your demo link and login are on their way to your inbox.'
      : 'Almost done! Check your inbox and confirm your email to get the demo link and login.');
  } catch {
    demoStatus.textContent = 'Something went wrong. Please try again, or email me directly.';
  } finally {
    demoSubmit.disabled = false;
  }
});
