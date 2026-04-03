const btn = document.getElementById('hamburgerBtn');
const navUl = document.querySelector('.HeroSectionNAVBar ul');

btn.addEventListener('click', () => {
  btn.classList.toggle('open');
  navUl.classList.toggle('nav-open');
});

navUl.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    btn.classList.remove('open');
    navUl.classList.remove('nav-open');
  });
});

(function () {

  const FULL_NAME = 'Thushal Eranda Madushan';

  const navBox     = document.querySelector('.HeroSectionBoxNav');
  const plainEl    = document.getElementById('heroPlain');
  const nameEl     = document.getElementById('heroName');
  const heading2   = document.querySelector('.HeroSectionHeading2');
  const heading3   = document.querySelector('.HeroSectionHeading3');
  const socialIcons = document.querySelectorAll('.HeroSectionSocialLinksGroup a');
  const cta        = document.querySelector('.HeroSectionMidContentButton');

  navBox.style.cssText    = 'opacity:0; top:-6rem;';
  plainEl.style.cssText   = 'opacity:0; transform:translateY(24px);';
  nameEl.style.cssText    = 'opacity:0;';
  heading2.style.cssText  = 'opacity:0; transform:translateY(24px);';
  heading3.style.cssText  = 'opacity:0; transform:translateY(24px);';
  cta.style.cssText       = 'opacity:0; transform:scale(0.8);';

  socialIcons.forEach(icon => {
    icon.style.cssText = 'opacity:0; transform:scale(0.3) translateY(12px);';
  });

  function reveal(el, delay, extraCSS = '') {
    setTimeout(() => {
      el.style.cssText = `transition: opacity 0.65s cubic-bezier(0.22,1,0.36,1), transform 0.65s cubic-bezier(0.22,1,0.36,1); opacity:1; transform:translateY(0) scale(1); ${extraCSS}`;
    }, delay);
  }

  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`;
  document.head.appendChild(cursorStyle);

  function typewrite(el, text, onDone) {
    el.style.opacity = '1';
    let i = 0;

    const cursor = document.createElement('span');
    cursor.textContent = '|';
    cursor.style.cssText = 'display:inline-block; margin-left:1px; -webkit-text-fill-color:rgba(255,255,255,0.75); animation:cursorBlink 0.55s step-end infinite;';
    el.appendChild(cursor);

    function tick() {
      if (i < text.length) {
        cursor.insertAdjacentText('beforebegin', text[i++]);
        setTimeout(tick, 60);
      } else {
        if (onDone) onDone();
        setTimeout(() => {
          cursor.style.transition = 'opacity 0.4s ease';
          cursor.style.opacity = '0';
          setTimeout(() => cursor.remove(), 400);
        }, 500);
      }
    }
    tick();
  }

  window.addEventListener('load', () => {

    setTimeout(() => {
      navBox.style.cssText = `
        position: fixed;
        top: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        transition: opacity 0.7s cubic-bezier(0.22,1,0.36,1), top 0.7s cubic-bezier(0.22,1,0.36,1);
        opacity: 1;
      `;
    }, 150);

    setTimeout(() => reveal(plainEl, 0), 500);

    setTimeout(() => typewrite(nameEl, FULL_NAME), 800);

    reveal(heading2, 2050);

    reveal(heading3, 2250);

    socialIcons.forEach((icon, i) => {
      setTimeout(() => {
        icon.style.cssText = `
          transition: opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1);
          opacity: 1;
          transform: scale(1) translateY(0);
        `;
      }, 2450 + i * 140);
    });

    setTimeout(() => {
      cta.style.cssText = `
        transition: opacity 0.55s cubic-bezier(0.34,1.56,0.64,1), transform 0.55s cubic-bezier(0.34,1.56,0.64,1);
        opacity: 1;
        transform: scale(1);
      `;
    }, 2850);
  });
})();

(function () {

  const canvas = document.getElementById('heroCanvas');
  const ctx = canvas.getContext('2d');
  const hero = document.querySelector('.HeroSection');
  const midWrapper = document.querySelector('.HeroSectionMidWrapper');

  const COLORS = [
    'rgba(177,151,252,',
    'rgba(0,212,255,',
    'rgba(255,111,216,'
  ];

  let W, H, particles;
  let mouseX = 0, mouseY = 0;
  let parallaxX = 0, parallaxY = 0;
  let currentPX = 0, currentPY = 0;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function makeParticles() {
    particles = [];
    const count = Math.floor((W * H) / 14000);
    for (let i = 0; i < count; i++) {
      particles.push({
        x:     Math.random() * W,
        y:     Math.random() * H,
        r:     Math.random() * 1.6 + 0.5,
        dx:    (Math.random() - 0.5) * 0.4,
        dy:    (Math.random() - 0.5) * 0.4,
        alpha: Math.random() * 0.45 + 0.15,
        color: COLORS[Math.floor(Math.random() * COLORS.length)]
      });
    }
  }

  resize();
  makeParticles();
  window.addEventListener('resize', () => { resize(); makeParticles(); });

  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    mouseX = e.clientX - r.left;
    mouseY = e.clientY - r.top;
    parallaxX = (mouseX - W / 2) / W * 18;
    parallaxY = (mouseY - H / 2) / H * 18;
  });

  hero.addEventListener('mouseleave', () => {
    parallaxX = 0;
    parallaxY = 0;
  });

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Smooth parallax lerp
    currentPX += (parallaxX - currentPX) * 0.05;
    currentPY += (parallaxY - currentPY) * 0.05;
    midWrapper.style.transform = `translate(${currentPX}px, ${currentPY}px)`;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // Drift
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0) p.x = W;
      if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H;
      if (p.y > H) p.y = 0;

      const dist = Math.hypot(p.x - mouseX, p.y - mouseY);
      const proximity = dist < 100 ? (1 - dist / 100) : 0;
      const alpha = Math.min(1, p.alpha + proximity * 0.55);
      const radius = p.r + proximity * 2.5;

      ctx.beginPath();
      ctx.arc(p.x, p.y, radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color + alpha + ')';
      ctx.fill();

      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(177,151,252,${(1 - d / 90) * 0.13})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

(function () {

  var cards = document.querySelectorAll('.projectCard');

  if (!cards.length) return;

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('card-visible');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15
  });
  cards.forEach(function (card, i) {
    card.style.transitionDelay = (i % 2) * 0.12 + 's';
    observer.observe(card);
  });

})();
