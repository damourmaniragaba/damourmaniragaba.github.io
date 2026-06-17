// ── DOT GRID CANVAS ──
const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
let mouse = { x: -999, y: -999 };
let dots = [];
const DOT_SPACING = 36;
const DOT_RADIUS = 1.2;
const INFLUENCE = 120;

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  buildDots();
}

function buildDots() {
  dots = [];
  const cols = Math.ceil(canvas.width / DOT_SPACING) + 1;
  const rows = Math.ceil(canvas.height / DOT_SPACING) + 1;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push({ x: c * DOT_SPACING, y: r * DOT_SPACING });
    }
  }
}

function drawDots() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (const d of dots) {
    const dx = d.x - mouse.x;
    const dy = d.y - mouse.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const factor = Math.max(0, 1 - dist / INFLUENCE);
    const alpha = 0.08 + factor * 0.45;
    const r = DOT_RADIUS + factor * 1.8;
    const hue = factor > 0.1 ? '91, 141, 239' : '122, 138, 173';
    ctx.beginPath();
    ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(${hue}, ${alpha})`;
    ctx.fill();
  }
  requestAnimationFrame(drawDots);
}

window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
window.addEventListener('resize', resize);
resize();
drawDots();

// ── TICKER ──
const tickerItems = [
  'Java', 'Python', 'Go', 'C++', 'TypeScript', 'JavaScript', 'C#', 'SQL', 'R',
  'React', 'Next.js', 'Node.js', 'React Native', 'Unity 3D',
  'PostgreSQL', 'GraphQL', 'Docker', 'Google Cloud', 'AWS', 'Azure',
  'QGIS', 'Pix4D', 'Plotly', 'Leaflet', 'Prisma',
  'Pandas', 'NumPy', 'TensorFlow',
  'Equity Bank Rwanda', 'Pickup Buddi', 'Cornell NMSP', 'Quonvoy', 'HCM', 'BTCs'
];
const track = document.getElementById('ticker');
const items = [...tickerItems, ...tickerItems];
track.innerHTML = items.map(i =>
  `<span class="ticker-item">${i}</span>`
).join('');

// ── NAV SCROLL ──
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// ── SCROLL REVEAL ──
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach((e, i) => {
    if (e.isIntersecting) {
      setTimeout(() => e.target.classList.add('visible'), i * 80);
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });
reveals.forEach(el => observer.observe(el));