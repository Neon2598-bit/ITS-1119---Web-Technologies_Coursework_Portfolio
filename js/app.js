
  const btn = document.getElementById('hamburgerBtn');
  const nav = document.getElementById('navLinks');

  btn.addEventListener('click', () => {
  btn.classList.toggle('open');
  nav.classList.toggle('nav-open');
});
