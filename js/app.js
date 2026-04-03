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
  const nameEl = document.getElementById('heroName');

  const cursorStyle = document.createElement('style');
  cursorStyle.textContent = `@keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }`;
  document.head.appendChild(cursorStyle);

  function typewrite(el, text) {
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
    setTimeout(() => typewrite(nameEl, FULL_NAME), 400);
  });

})();

// ===========================
//   P5.JS BACKGROUND SKETCH
// ===========================

new p5(function (p) {

  const CELL_SIZE = 40;
  const COLOR_RED = 118;
  const COLOR_GREEN = 53;
  const COLOR_BLUE = 243;
  const STARTING_ALPHA = 255;
  const BACKGROUND_COLOR = 13;
  const PROB_OF_NEIGHBOR = 0.5;
  const AMT_FADE_PER_FRAME = 5;
  const STROKE_WEIGHT = 1;

  let colorWithAlpha;
  let numRows;
  let numCols;
  let currentRow = -1;
  let currentCol = -1;
  let allNeighbors = [];

  p.setup = function () {
    let cnv = p.createCanvas(p.windowWidth, p.windowHeight);
    cnv.style('position', 'fixed');
    cnv.style('inset', '0');
    cnv.style('z-index', '-1');
    cnv.style('pointer-events', 'none');
    colorWithAlpha = p.color(COLOR_RED, COLOR_GREEN, COLOR_BLUE, STARTING_ALPHA);
    p.noFill();
    p.stroke(colorWithAlpha);
    p.strokeWeight(STROKE_WEIGHT);
    numRows = Math.ceil(p.windowHeight / CELL_SIZE);
    numCols = Math.ceil(p.windowWidth / CELL_SIZE);
  };

  p.draw = function () {
    // p.background(BACKGROUND_COLOR);
    p.clear();

    let row = p.floor(p.mouseY / CELL_SIZE);
    let col = p.floor(p.mouseX / CELL_SIZE);

    if (row !== currentRow || col !== currentCol) {
      currentRow = row;
      currentCol = col;
      allNeighbors.push(...getRandomNeighbors(row, col));
    }

    let x = col * CELL_SIZE;
    let y = row * CELL_SIZE;

    p.stroke(colorWithAlpha);
    p.rect(x, y, CELL_SIZE, CELL_SIZE);

    for (let neighbor of allNeighbors) {
      let nx = neighbor.col * CELL_SIZE;
      let ny = neighbor.row * CELL_SIZE;
      neighbor.opacity = Math.max(0, neighbor.opacity - AMT_FADE_PER_FRAME);
      p.stroke(COLOR_RED, COLOR_GREEN, COLOR_BLUE, neighbor.opacity);
      p.rect(nx, ny, CELL_SIZE, CELL_SIZE);
    }

    allNeighbors = allNeighbors.filter(n => n.opacity > 0);
  };

  function getRandomNeighbors(row, col) {
    let neighbors = [];
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        let neighborRow = row + dRow;
        let neighborCol = col + dCol;
        let isCurrentCell = dRow === 0 && dCol === 0;
        let isInbounds =
          neighborRow >= 0 && neighborRow < numRows &&
          neighborCol >= 0 && neighborCol < numCols;
        if (!isCurrentCell && isInbounds && Math.random() < PROB_OF_NEIGHBOR) {
          neighbors.push({ row: neighborRow, col: neighborCol, opacity: STARTING_ALPHA });
        }
      }
    }
    return neighbors;
  }

  p.windowResized = function () {
    p.resizeCanvas(p.windowWidth, p.windowHeight);
    numRows = Math.ceil(p.windowHeight / CELL_SIZE);
    numCols = Math.ceil(p.windowWidth / CELL_SIZE);
  };

});

(function () {

  let cards = document.querySelectorAll('.projectCard');

  if (!cards.length) return;

  let observer = new IntersectionObserver(function (entries) {
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

(function () {

  // Get all the slides
  let allSlides = document.querySelectorAll('.academicSlide');
  let dotsContainer = document.getElementById('slideDots');
  let counterEl = document.getElementById('slideCounter');
  let prevBtn = document.getElementById('slidePrev');
  let nextBtn = document.getElementById('slideNext');
  let tabs = document.querySelectorAll('.academicTab');

  let activeAssignment = 1;
  let currentIndex = 0;
  let visibleSlides = [];

  function buildDots(count) {
    dotsContainer.innerHTML = '';
    for (let i = 0; i < count; i++) {
      let dot = document.createElement('button');
      dot.className = 'slideDot';
      dot.setAttribute('data-index', i);
      dotsContainer.appendChild(dot);

      // When a dot is clicked, go to that slide
      dot.addEventListener('click', function () {
        let idx = parseInt(this.getAttribute('data-index'));
        goToSlide(idx);
      });
    }
  }
  function updateDots() {
    let dots = dotsContainer.querySelectorAll('.slideDot');
    dots.forEach(function (dot, i) {
      if (i === currentIndex) {
        dot.classList.add('dot-active');
      } else {
        dot.classList.remove('dot-active');
      }
    });
  }
  function goToSlide(index) {
    allSlides.forEach(function (slide) {
      slide.classList.remove('slide-active');
    });
    currentIndex = index;
    if (visibleSlides[currentIndex]) {
      visibleSlides[currentIndex].classList.add('slide-active');
    }
    updateDots();
    counterEl.textContent = (currentIndex + 1) + ' / ' + visibleSlides.length;
  }

  function showAssignment(num) {
    activeAssignment = num;
    currentIndex = 0;
    visibleSlides = [];
    allSlides.forEach(function (slide) {
      if (parseInt(slide.getAttribute('data-assignment')) === num) {
        visibleSlides.push(slide);
      }
    });
    buildDots(visibleSlides.length);
    goToSlide(0);
  }

  prevBtn.addEventListener('click', function () {
    let newIndex = currentIndex - 1;
    if (newIndex < 0) {
      newIndex = visibleSlides.length - 1;
    }
    goToSlide(newIndex);
  });

  nextBtn.addEventListener('click', function () {
    let newIndex = currentIndex + 1;
    if (newIndex >= visibleSlides.length) {
      newIndex = 0;
    }
    goToSlide(newIndex);
  });

  tabs.forEach(function (tab) {
    tab.addEventListener('click', function () {
      tabs.forEach(function (t) { t.classList.remove('active'); });
      this.classList.add('active');
      let assignNum = parseInt(this.getAttribute('data-assignment'));
      showAssignment(assignNum);
    });
  });
  showAssignment(1);
})();
