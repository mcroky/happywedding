/****************************************************
 * 💞 1. 결혼기념일 일수 계산 (타임존 문제 수정)
 ****************************************************/
const weddingDate = new Date(2007, 4, 10); // ⚠️ 월은 0부터 시작 → 4 = 5월
const today = new Date();

// 날짜만 비교하도록 UTC 자정 기준으로 변환
const weddingUTC = Date.UTC(weddingDate.getFullYear(), weddingDate.getMonth(), weddingDate.getDate());
const todayUTC = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

// 일수 차이 계산
const diffDays = Math.floor((todayUTC - weddingUTC) / (1000 * 60 * 60 * 24));

// 화면에 표시 (오늘이 1일째로 포함하고 싶다면 +1)
document.getElementById("days").textContent = diffDays;


/****************************************************
 * 💌 2. 메시지 저장 기능 (LocalStorage)
 ****************************************************/
const saveBtn = document.getElementById('saveBtn');
const msgInput = document.getElementById('msgInput');
const msgList = document.getElementById('msgList');

function loadMessages() {
  const messages = JSON.parse(localStorage.getItem('messages')) || [];
  msgList.innerHTML = "";
  messages.forEach(m => {
    const li = document.createElement('li');
    li.textContent = "💬 " + m;
    msgList.appendChild(li);
  });
}

if (saveBtn && msgInput) {
  saveBtn.addEventListener('click', () => {
    const msg = msgInput.value.trim();
    if (msg) {
      const messages = JSON.parse(localStorage.getItem('messages')) || [];
      messages.push(msg);
      localStorage.setItem('messages', JSON.stringify(messages));
      msgInput.value = "";
      loadMessages();
    }
  });
}
loadMessages();

/****************************************************
 * 🌸 3. 스크롤 애니메이션 (타임라인 등장)
 ****************************************************/
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.15 });
document.querySelectorAll('.event-content').forEach(el => observer.observe(el));

/****************************************************
 * 🌠 4. 별빛 파티클
 ****************************************************/
const starsCanvas = document.getElementById('stars');
const starsCtx = starsCanvas.getContext('2d');
let stars = [];

function resizeStars() {
  starsCanvas.width = window.innerWidth;
  starsCanvas.height = window.innerHeight;
}
resizeStars();
window.addEventListener('resize', resizeStars);

for (let i = 0; i < 150; i++) {
  stars.push({
    x: Math.random() * starsCanvas.width,
    y: Math.random() * starsCanvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.3 + 0.1,
    alpha: Math.random() * 0.7 + 0.3
  });
}

function drawStars() {
  starsCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
  for (let s of stars) {
    starsCtx.beginPath();
    starsCtx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    starsCtx.fillStyle = `rgba(255, 255, 255, ${s.alpha})`;
    starsCtx.fill();
    s.y += s.speed;
    if (s.y > starsCanvas.height) {
      s.y = 0;
      s.x = Math.random() * starsCanvas.width;
    }
  }
  requestAnimationFrame(drawStars);
}
drawStars();

/****************************************************
 * 💖 5. 하트 파티클 배경
 ****************************************************/
const heartsCanvas = document.getElementById('hearts');
const heartsCtx = heartsCanvas.getContext('2d');
let hearts = [];

function resizeHearts() {
  heartsCanvas.width = window.innerWidth;
  heartsCanvas.height = window.innerHeight;
}
resizeHearts();
window.addEventListener('resize', resizeHearts);

class HeartFloat {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * heartsCanvas.width;
    this.y = heartsCanvas.height + 20;
    this.size = Math.random() * 8 + 2;
    this.speed = Math.random() * 1 + 0.5;
    this.alpha = Math.random() * 0.6 + 0.4;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.scale(this.size / 10, this.size / 10);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.bezierCurveTo(2, -5, 5, -2, 0, 4);
    ctx.bezierCurveTo(-5, -2, -2, -5, 0, -3);
    ctx.fillStyle = `rgba(255, 105, 180, ${this.alpha})`;
    ctx.fill();
    ctx.restore();
  }
  update() {
    this.y -= this.speed;
    if (this.y < -10) this.reset();
  }
}

function initHearts(count = 100) {
  hearts = [];
  for (let i = 0; i < count; i++) hearts.push(new HeartFloat());
}
initHearts();

function animateHearts() {
  heartsCtx.clearRect(0, 0, heartsCanvas.width, heartsCanvas.height);
  hearts.forEach(h => { h.update(); h.draw(heartsCtx); });
  requestAnimationFrame(animateHearts);
}
animateHearts();

/****************************************************
 * 🎆 6. 하트 폭발 인터랙션 (클릭 시 터지는 효과)
 ****************************************************/
const fxCanvas = document.getElementById('fx');
const fxCtx = fxCanvas.getContext('2d', { alpha: true });
function resizeFx() {
  fxCanvas.width = window.innerWidth;
  fxCanvas.height = window.innerHeight;
}
resizeFx();

class HeartBurstParticle {
  constructor(x, y, hue, baseSpeed, size) {
    this.x = x; this.y = y;
    this.size = size;
    this.hue = hue;
    this.alpha = 1;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotateSpeed = (Math.random() - 0.5) * 0.2;
    const angle = Math.random() * Math.PI * 2;
    const speed = baseSpeed * (0.6 + Math.random() * 0.8);
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.gravity = 0.03;
    this.shrink = 0.98;
    this.fade = 0.015 + Math.random() * 0.02;
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    const scale = Math.max(0.2, this.size / 10);
    ctx.scale(scale, scale);
    ctx.beginPath();
    ctx.moveTo(0, -3);
    ctx.bezierCurveTo(2, -5, 5, -2, 0, 4);
    ctx.bezierCurveTo(-5, -2, -2, -5, 0, -3);
    ctx.fillStyle = `hsla(${this.hue}, 85%, 65%, ${this.alpha})`;
    ctx.shadowColor = `hsla(${this.hue}, 95%, 75%, ${this.alpha})`;
    ctx.shadowBlur = 18;
    ctx.fill();
    ctx.restore();
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.vy += this.gravity;
    this.rotation += this.rotateSpeed;
    this.size *= this.shrink;
    this.alpha -= this.fade;
  }
  isDead() { return this.alpha <= 0 || this.size < 0.2; }
}

class Burst {
  constructor(x, y, count) {
    this.particles = [];
    const baseHue = 330 + Math.random() * 40;
    const baseSpeed = 3.0;
    for (let i = 0; i < count; i++) {
      const hueJitter = (Math.random() - 0.5) * 30;
      const size = 6 + Math.random() * 8;
      this.particles.push(new HeartBurstParticle(x, y, baseHue + hueJitter, baseSpeed, size));
    }
  }
  updateAndDraw(ctx) {
    for (let p of this.particles) {
      p.update();
      p.draw(ctx);
    }
    this.particles = this.particles.filter(p => !p.isDead());
    return this.particles.length > 0;
  }
}

let bursts = [];
let fxAnimating = false;
let fxLastFrame = 0;

function fxLoop(timestamp) {
  if (!fxAnimating) return;
  fxCtx.clearRect(0, 0, fxCanvas.width, fxCanvas.height);
  bursts = bursts.filter(b => b.updateAndDraw(fxCtx));
  if (bursts.length === 0) {
    fxAnimating = false;
    return;
  }
  requestAnimationFrame(fxLoop);
}

function spawnBurst(clientX, clientY) {
  const x = clientX;
  const y = clientY;
  const isLowPower = window.innerWidth < 480 || navigator.hardwareConcurrency <= 4;
  const count = isLowPower ? 40 + Math.floor(Math.random() * 30) : 100;
  bursts.push(new Burst(x, y, count));
  document.body.classList.add('fx-aim');
  setTimeout(() => document.body.classList.remove('fx-aim'), 150);
  if (!fxAnimating) {
    fxAnimating = true;
    fxLastFrame = performance.now();
    requestAnimationFrame(fxLoop);
  }
}
document.addEventListener('click', e => spawnBurst(e.clientX, e.clientY), { passive: true });
document.addEventListener('touchstart', e => {
  const t = e.touches[0];
  spawnBurst(t.clientX, t.clientY);
}, { passive: true });

/****************************************************
 * 🌸 7. 벚꽃잎 파티클 (Flower Petal)
 ****************************************************/
const petalsCanvas = document.getElementById('petals');
const petalsCtx = petalsCanvas.getContext('2d');
function resizePetals() {
  petalsCanvas.width = window.innerWidth;
  petalsCanvas.height = window.innerHeight;
}
resizePetals();
window.addEventListener('resize', resizePetals);

class Petal {
  constructor() { this.reset(true); }
  reset(initial = false) {
    this.x = Math.random() * petalsCanvas.width;
    this.y = initial ? Math.random() * petalsCanvas.height : -20;
    this.size = 12 + Math.random() * 16;
    this.speedY = 0.5 + Math.random() * 1.5;
    this.swing = Math.random() * 1.5 + 0.5;
    this.angle = Math.random() * 2 * Math.PI;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
    this.alpha = 0.6 + Math.random() * 0.4;
    this.color = `hsl(${330 + Math.random() * 20}, 80%, ${70 + Math.random() * 10}%)`;
  }
  update() {
    this.angle += this.swing * 0.01;
    this.x += Math.sin(this.angle) * 0.8;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;
    if (this.y > petalsCanvas.height + 30) this.reset();
  }
  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate(this.rotation);
    const s = this.size * (0.6 + 0.4 * Math.sin(this.rotation));
    ctx.beginPath();
    ctx.moveTo(0, -s * 0.4);
    ctx.bezierCurveTo(s * 0.3, -s * 0.8, s * 0.8, -s * 0.1, 0, s * 0.9);
    ctx.bezierCurveTo(-s * 0.8, -s * 0.1, -s * 0.3, -s * 0.8, 0, -s * 0.4);
    ctx.fillStyle = this.color;
    ctx.globalAlpha = this.alpha;
    ctx.shadowColor = this.color;
    ctx.shadowBlur = 8;
    ctx.fill();
    ctx.restore();
  }
}
let petals = [];
function initPetals(count = 80) {
  petals = [];
  for (let i = 0; i < count; i++) petals.push(new Petal());
}
initPetals();
function animatePetals() {
  petalsCtx.clearRect(0, 0, petalsCanvas.width, petalsCanvas.height);
  for (let p of petals) { p.update(); p.draw(petalsCtx); }
  requestAnimationFrame(animatePetals);
}
animatePetals();
let wind = 0; let windDirection = 1;
function windUpdate() {
  wind += windDirection * 0.005;
  if (wind > 0.3 || wind < -0.3) windDirection *= -1;
  petals.forEach(p => { p.x += wind * 0.8; });
  requestAnimationFrame(windUpdate);
}
windUpdate();

/****************************************************
 * 🎵 8. 음악 컨트롤
 ****************************************************/
const bgMusic = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
let musicPlaying = false;
if (musicToggle && bgMusic) {
  musicToggle.addEventListener("click", () => {
    if (!musicPlaying) {
      bgMusic.volume = 0;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          let vol = 0;
          const fade = setInterval(() => {
            vol = Math.min(1, vol + 0.05);
            bgMusic.volume = vol;
            if (vol >= 1) clearInterval(fade);
          }, 100);
          musicPlaying = true;
        });
      }
    } else {
      bgMusic.pause();
      musicPlaying = false;
    }
  });
}



/****************************************************
 * 🎬 9. 씬 전환 및 시네마틱 포커스
 ****************************************************/
(function setupCinematicScenes() {
  const overlay = document.getElementById('scene-transition');
  const sections = Array.from(document.querySelectorAll('section[data-scene]'));
  const headerHeight = document.querySelector('header') ? document.querySelector('header').offsetHeight : 0;

  function performSceneTransition(targetSection) {
    if (!targetSection || !overlay) return;
    overlay.classList.add('active');
    setTimeout(() => {
      const top = targetSection.getBoundingClientRect().top + window.scrollY - Math.max(0, headerHeight - 10);
      window.scrollTo({ top, left: 0, behavior: 'instant' });
    }, 240);
    setTimeout(() => { overlay.classList.remove('active'); }, 480);
  }

  function interceptAnchorClicks() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const hash = a.getAttribute('href');
        const target = document.querySelector(hash);
        if (target) { e.preventDefault(); performSceneTransition(target); }
      });
    });
  }

  const sceneInObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const sec = entry.target;
      if (entry.isIntersecting) sec.classList.add('scene-in');
      else if (entry.intersectionRatio === 0) {
        sec.classList.remove('scene-in');
        sec.classList.remove('scene-focus');
      }
    });
  }, { threshold: 0.12 });

  const focusObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      const sec = entry.target;
      if (entry.isIntersecting && entry.intersectionRatio > 0.6)
        sec.classList.add('scene-focus');
      else sec.classList.remove('scene-focus');
    });
  }, { threshold: [0.0, 0.25, 0.5, 0.6, 0.75, 0.9, 1.0] });

  sections.forEach(sec => { sceneInObserver.observe(sec); focusObserver.observe(sec); });
  interceptAnchorClicks();

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    const target = document.querySelector(hash);
    if (target) performSceneTransition(target);
  });

  window.addEventListener('load', () => {
    if (window.location.hash) {
      const target = document.querySelector(window.location.hash);
      if (target) setTimeout(() => performSceneTransition(target), 200);
    }
  });
})();

/****************************************************
 * 💡 10. 헤더 스크롤 반응
 ****************************************************/
window.addEventListener('scroll', () => {
  document.querySelector('header').classList.toggle('scrolled', window.scrollY > 50);
});
/****************************************************
 * 🌙 11. 시간대별 테마 전환 (Dynamic Theme)
 ****************************************************/
(function setupDynamicTheme() {
  const body = document.body;
  const starsCanvas = document.getElementById('stars');
  const petalsCanvas = document.getElementById('petals');

  // 🌈 테마 정의
  const themes = {
    morning: {
      name: "morning",
      bgGradient: "linear-gradient(180deg, #fff2f5, #ffd6e0 80%)",
      starAlpha: 0.15,
      petalTint: "hsl(340, 80%, 80%)",
    },
    day: {
      name: "day",
      bgGradient: "linear-gradient(180deg, #ffe9f1, #ffe1e8 90%)",
      starAlpha: 0.1,
      petalTint: "hsl(345, 90%, 85%)",
    },
    evening: {
      name: "evening",
      bgGradient: "linear-gradient(180deg, #ffb7b2, #ffccd5, #f5a3b0)",
      starAlpha: 0.3,
      petalTint: "hsl(340, 80%, 75%)",
    },
    night: {
      name: "night",
      bgGradient: "radial-gradient(ellipse at bottom, #1a0921 0%, #0d0010 100%)",
      starAlpha: 0.8,
      petalTint: "hsl(330, 70%, 70%)",
    }
  };

  // 🌗 현재 테마 계산
  function getCurrentTheme() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 10) return themes.morning;
    if (hour >= 10 && hour < 17) return themes.day;
    if (hour >= 17 && hour < 21) return themes.evening;
    return themes.night;
  }

  // 🌈 적용 함수
  function applyTheme(theme) {
    body.style.transition = "background 1.5s ease, color 1.5s ease";
    body.style.background = theme.bgGradient;

    // 별 밝기 조절 (alpha값 기반)
    if (stars && stars.length) {
      for (let s of stars) s.alpha = Math.random() * theme.starAlpha + 0.05;
    }

    // 꽃잎 색상 살짝 조정
    if (petals && petals.length) {
      petals.forEach(p => {
        p.color = theme.petalTint;
      });
    }

    body.setAttribute("data-theme", theme.name);
  }

  // ⏰ 테마 초기화 + 자동 갱신
  function updateTheme() {
    const theme = getCurrentTheme();
    applyTheme(theme);
  }

  updateTheme();
  setInterval(updateTheme, 600000); // 10분마다 자동 갱신
})();
/****************************************************
 * 🎞️ 12. 인트로 시퀀스 제어 + 피아노 사운드 큐
 ****************************************************/
window.addEventListener("load", () => {
  const intro = document.getElementById("intro");
  const bgMusic = document.getElementById("bgMusic");
  const introSound = document.getElementById("introSound");

  // 1) 인트로 사운드 재생 (피아노 음)
  try {
    introSound.volume = 0.6;
    introSound.currentTime = 0;
    introSound.play().catch(() => {
      // 브라우저 자동재생 제한이 걸리면 사용자가 첫 클릭 시 재생됨
    });
  } catch (e) {
    console.warn("Intro sound could not play automatically:", e);
  }

  // 2) 인트로 4초 유지 후 페이드아웃
  setTimeout(() => {
    intro.classList.add("fade-out");
  }, 4000);

  // 3) 인트로 종료 후 배경음악 천천히 시작
  setTimeout(() => {
    try {
      bgMusic.volume = 0;
      const playPromise = bgMusic.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          let vol = 0;
          const fade = setInterval(() => {
            vol = Math.min(1, vol + 0.05);
            bgMusic.volume = vol;
            if (vol >= 1) clearInterval(fade);
          }, 150);
        });
      }
    } catch (e) {}
  }, 4500);
});

/****************************************************
 * 🌌 13. 인트로 별빛 반짝임 애니메이션
 ****************************************************/
(function setupIntroStars() {
  const canvas = document.getElementById("intro-stars");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  let stars = [];

  // 🌟 캔버스 크기 맞추기
  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  // 🌟 별 생성
  function createStars(count = 80) {
    stars = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * (canvas.height * 0.6) + canvas.height * 0.2;
      const size = Math.random() * 2 + 0.5;
      const twinkleSpeed = 0.02 + Math.random() * 0.03;
      stars.push({
        x, y, size,
        baseAlpha: Math.random() * 0.5 + 0.3,
        phase: Math.random() * Math.PI * 2,
        twinkleSpeed
      });
    }
  }
  createStars();
/****************************************************
 * 🌠 14. 인트로 타이틀 별빛 디졸브 (Star Dissolve)
 ****************************************************/
(function setupIntroDissolve() {
  const canvas = document.getElementById('intro-dissolve');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animating = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  class StarParticle {
    constructor(x, y, hue) {
      this.x = x;
      this.y = y;
      this.vx = (Math.random() - 0.5) * 6;
      this.vy = (Math.random() - 1) * 4 - 1;
      this.alpha = 1;
      this.size = Math.random() * 2 + 1;
      this.hue = hue;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      this.vx *= 0.98;
      this.vy += 0.05;
      this.alpha -= 0.02;
    }
    draw(ctx) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `hsla(${this.hue}, 90%, 80%, ${this.alpha})`;
      ctx.shadowColor = `hsla(${this.hue}, 90%, 90%, ${this.alpha})`;
      ctx.shadowBlur = 12;
      ctx.fill();
      ctx.restore();
    }
  }

  function createParticles(x, y, count = 120) {
    particles = [];
    for (let i = 0; i < count; i++) {
      const hue = 300 + Math.random() * 60;
      particles.push(new StarParticle(
        x + (Math.random() - 0.5) * 180,
        y + (Math.random() - 0.5) * 60,
        hue
      ));
    }
  }

  function animate() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.update();
      p.draw(ctx);
    });
    particles = particles.filter(p => p.alpha > 0);
    if (particles.length > 0) requestAnimationFrame(animate);
    else {
      animating = false;
      canvas.classList.remove('active');
    }
  }
/****************************************************
 * 🎞️ 15. 엔딩 시퀀스 텍스트 (가시성 개선 + 유지시간 확대)
 ****************************************************/
(function setupIntroEndingText() {
  const endingText = document.getElementById("intro-ending-text");
  if (!endingText) return;

  // 🌠 등장 (별빛 디졸브 후)
  setTimeout(() => {
    endingText.classList.add("active");
  }, 4200);

  // 💫 10초간 유지 후 부드럽게 사라짐
  setTimeout(() => {
    endingText.classList.add("fade-out");
    endingText.classList.remove("active");
  }, 14200);
})();


  // 🌟 인트로 종료 직전에 발동
  const intro = document.getElementById('intro');
  if (intro) {
    setTimeout(() => {
      const rect = intro.getBoundingClientRect();
      const centerX = rect.width / 2;
      const centerY = rect.height / 2.2;
      createParticles(centerX, centerY);
      canvas.classList.add('active');
      animating = true;
      animate();
    }, 3700); // fade-out 직전 타이밍
  }
})();

  // 🌟 반짝임 그리기
  function drawStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let s of stars) {
      const alpha = s.baseAlpha + Math.sin(s.phase) * 0.5;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255,255,255,${alpha})`;
      ctx.shadowColor = `rgba(255,200,255,${alpha})`;
      ctx.shadowBlur = 8;
      ctx.fill();
      s.phase += s.twinkleSpeed;
    }
    requestAnimationFrame(drawStars);
  }
  drawStars();

  // 🌠 인트로 끝나면 부드럽게 사라짐
  const intro = document.getElementById("intro");
  if (intro) {
    intro.addEventListener("transitionend", () => {
      if (intro.classList.contains("fade-out")) {
        stars = []; // 렌더 중지
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    });
  }
})();
/****************************************************
 * 🌠 16. 엔딩 자막 주변 별빛 오라 효과
 ****************************************************/
(function setupEndingStars() {
  const canvas = document.getElementById('ending-stars');
  const ctx = canvas.getContext('2d');
  const endingText = document.getElementById('intro-ending-text');
  if (!canvas || !ctx || !endingText) return;

  let stars = [];
  let animating = false;

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight * 0.4;
  }
  resize();
  window.addEventListener('resize', resize);

  // 🌌 별 클래스
  class AuraStar {
    constructor() {
      this.reset();
    }
    reset() {
      const textRect = endingText.getBoundingClientRect();
      const centerX = textRect.left + textRect.width / 2;
      const centerY = textRect.top + textRect.height / 2;
      this.x = centerX + (Math.random() - 0.5) * 220;
      this.y = centerY + (Math.random() - 0.5) * 80 - window.innerHeight * 0.6;
      this.size = Math.random() * 1.6 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.4;
      this.speed = 0.2 + Math.random() * 0.4;
      this.phase = Math.random() * Math.PI * 2;
      this.color = `hsla(${300 + Math.random() * 40}, 80%, ${70 + Math.random() * 10}%, ${this.alpha})`;
    }
    update() {
      this.phase += this.speed * 0.05;
      this.y -= Math.sin(this.phase) * 0.3;
      this.x += Math.sin(this.phase) * 0.2;
      this.alpha = 0.6 + Math.sin(this.phase * 1.5) * 0.3;
    }
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = this.color;
      ctx.shadowColor = this.color;
      ctx.shadowBlur = 6;
      ctx.globalAlpha = this.alpha;
      ctx.fill();
    }
  }

  function createStars(count = 50) {
    stars = [];
    for (let i = 0; i < count; i++) stars.push(new AuraStar());
  }

  function animate() {
    if (!animating) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let s of stars) {
      s.update();
      s.draw(ctx);
    }
    requestAnimationFrame(animate);
  }

  // 🌠 자막 등장과 동기화
  setTimeout(() => {
    createStars();
    animating = true;
    canvas.classList.add('active');
    animate();
  }, 4200); // 자막 등장 시점과 동일

  // 💫 자막 사라질 때 별도 fade-out
  setTimeout(() => {
    animating = false;
    canvas.classList.remove('active');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }, 10000);
})();


/****************************************************
 * 🌌 17. 엔딩 자막 글자별 별빛 디졸브 (Letter Dissolve)
 ****************************************************/
(function setupLetterDissolve() {
  const textContainer = document.getElementById("intro-ending-text");
  if (!textContainer) return;

  const letters = textContainer.querySelectorAll("span");

  // 🌟 글자 하나씩 천천히 나타남
  setTimeout(() => {
    letters.forEach((el, i) => {
      setTimeout(() => el.classList.add("show"), i * 90);
    });
  }, 4200);

  // 💫 사라짐도 느리게 (9.5초부터 시작)
  setTimeout(() => {
    letters.forEach((el, i) => {
      setTimeout(() => el.classList.add("fade"), i * 80);
    });
  }, 9500);
})();
/****************************************************
 * 🎬 유튜브 새 탭 열기 (153 오류 제거 버전)
 ****************************************************/
document.addEventListener("DOMContentLoaded", () => {
  const youtubeLink = document.querySelector(".youtube-link");
  if (youtubeLink) {
    youtubeLink.addEventListener("click", (e) => {
      e.preventDefault();
      window.open(youtubeLink.href, "_blank", "noopener,noreferrer");
    });
  }
});


