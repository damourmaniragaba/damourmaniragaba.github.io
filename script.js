// ── DOT GRID CANVAS ──
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let mouse = { x: -999, y: -999 };
let dots = [];
const SPACING = 36, RADIUS = 1.2, INFLUENCE = 110;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  dots = [];
  const cols = Math.ceil(canvas.width / SPACING) + 1;
  const rows = Math.ceil(canvas.height / SPACING) + 1;
  for (let r = 0; r < rows; r++)
    for (let c = 0; c < cols; c++)
      dots.push({ x: c * SPACING, y: r * SPACING });
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const d of dots) {
    const dist = Math.hypot(d.x - mouse.x, d.y - mouse.y);
    const f = Math.max(0, 1 - dist / INFLUENCE);
    ctx.beginPath();
    ctx.arc(d.x, d.y, RADIUS + f * 1.6, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${f > 0.1 ? '91,141,239' : '122,138,173'},${0.08 + f * 0.42})`;
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('resize', resize);
resize();
draw();

// ── TICKER ──
const items = [
  'Java','Python','Go','C++','TypeScript','JavaScript','C#','SQL','R',
  'React','Next.js','Node.js','React Native','Unity 3D',
  'PostgreSQL','GraphQL','Docker','Google Cloud','AWS','Azure',
  'QGIS','Plotly','Leaflet','Prisma','Pandas','NumPy','TensorFlow',
  'Equity Bank Rwanda','Pickup Buddi','Cornell NMSP','Quonvoy','HCM','BTCs'
];
const track = document.getElementById('ticker');
const doubled = [...items, ...items];
track.innerHTML = doubled.map(i => `<span class="ticker-item">${i}</span>`).join('');

// ── NAV SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── SCROLL REVEAL ──
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: "0px 0px -20px 0px" });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));


// Trigger reveals already in viewport on page load
window.addEventListener('load', () => {
  document.querySelectorAll('.reveal').forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      el.classList.add('visible');
    }
  });
});
