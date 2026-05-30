const wheel = document.getElementById('wheel');
const spinBtn = document.getElementById('spinBtn');
const pop = document.getElementById('resultPop');
const resultTitle = document.getElementById('resultTitle');
const resultText = document.getElementById('resultText');
const closePop = document.getElementById('closePop');
const popPrizeImg = document.getElementById('popPrizeImg');
const popImgWrap = document.getElementById('popImgWrap');
const canvas = document.getElementById('confetti');
const ctx = canvas.getContext('2d');

let currentRotation = 0;
let spinning = false;

// 12 casillas: premio, blanco, premio, blanco...
// No mostramos nombres de premios para evitar confusión: solo imagen + mensaje general.
const sectors = [
  // Este orden coincide exactamente con las imágenes colocadas en la ruleta.
  // Índices pares = imagen/premio. Índices impares = casilla vacía.
  { prize: true, img: 'assets/maracas.png' },
  { prize: false },
  { prize: true, img: 'assets/sombrero.png' },
  { prize: false },
  { prize: true, img: 'assets/taco.png' },
  { prize: false },
  { prize: true, img: 'assets/cactus.png' },
  { prize: false },
  { prize: true, img: 'assets/pinata.png' },
  { prize: false },
  { prize: true, img: 'assets/guitarra.png' },
  { prize: false }
];

function spinWheel() {
  if (spinning) return;
  spinning = true;
  spinBtn.disabled = true;
  pop.classList.remove('show');
  popImgWrap.style.display = 'none';
  spinBtn.textContent = 'Girando...';

  const winningIndex = Math.floor(Math.random() * sectors.length);
  const sectorSize = 360 / sectors.length;
  const centerAngle = winningIndex * sectorSize + sectorSize / 2;

  // Ajuste importante:
  // calculamos el giro desde la posición ACTUAL de la ruleta para que
  // la casilla que queda bajo la flecha sea exactamente la misma del popup.
  const normalizedRotation = ((currentRotation % 360) + 360) % 360;
  const targetRotation = (360 - centerAngle) % 360;
  const correction = (targetRotation - normalizedRotation + 360) % 360;
  const extraSpins = (6 + Math.floor(Math.random() * 2)) * 360;
  const finalRotation = extraSpins + correction;

  currentRotation += finalRotation;
  wheel.style.transform = `rotate(${currentRotation}deg)`;

  setTimeout(() => {
    const result = sectors[winningIndex];
    if (result.prize) {
      resultTitle.textContent = '🎉 ¡Felicidades!';
      resultText.textContent = 'Ganó un premio sorpresa.';
      popPrizeImg.src = result.img;
      popImgWrap.style.display = 'grid';
      launchConfetti();
    } else {
      resultTitle.textContent = '😅 Sin premio';
      resultText.textContent = 'Esta vez cayó en blanco. ¡Intente de nuevo!';
      popImgWrap.style.display = 'none';
    }
    pop.classList.add('show');
    spinning = false;
    spinBtn.disabled = false;
    spinBtn.textContent = 'Girar';
  }, 5100);
}

spinBtn.addEventListener('click', spinWheel);
wheel.addEventListener('click', spinWheel);
closePop.addEventListener('click', () => pop.classList.remove('show'));

function resizeCanvas(){ canvas.width = window.innerWidth; canvas.height = window.innerHeight; }
window.addEventListener('resize', resizeCanvas); resizeCanvas();

function launchConfetti(){
  resizeCanvas();
  const pieces = Array.from({length: 160}, () => ({
    x: Math.random() * canvas.width,
    y: -20 - Math.random() * canvas.height * .5,
    w: 6 + Math.random() * 8,
    h: 8 + Math.random() * 10,
    vy: 3 + Math.random() * 5,
    vx: -2 + Math.random() * 4,
    r: Math.random() * Math.PI,
    vr: -0.2 + Math.random() * 0.4,
    color: ['#f44336','#ffc107','#4caf50','#2196f3','#e91e63','#ff9800'][Math.floor(Math.random()*6)]
  }));
  const start = performance.now();
  function animate(t){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pieces.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.r); ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2,-p.h/2,p.w,p.h); ctx.restore();
    });
    if(t - start < 3200) requestAnimationFrame(animate); else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  requestAnimationFrame(animate);
}

// Interactividad del menú
const tabButtons = document.querySelectorAll('.tab-btn');
const menuCards = document.querySelectorAll('.menu-card');
const menuItems = document.querySelectorAll('.menu-item');
const menuModal = document.getElementById('menuModal');
const modalClose = document.getElementById('modalClose');
const modalIcon = document.getElementById('modalIcon');
const modalName = document.getElementById('modalName');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');

tabButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    tabButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    menuCards.forEach(card => {
      card.classList.toggle('hidden', filter !== 'all' && card.dataset.category !== filter);
    });
  });
});

menuItems.forEach(item => {
  item.addEventListener('click', () => {
    
    if (item.dataset.img) {
      modalIcon.innerHTML = `<img src="${item.dataset.img}" alt="Producto">`;
    } else {
      modalIcon.textContent = item.dataset.icon || '🌮';
    }
    modalName.textContent = item.dataset.name || 'Producto';
    modalPrice.textContent = item.dataset.price || '';
    modalDesc.textContent = item.dataset.desc || '';
    menuModal.classList.add('show');
    menuModal.setAttribute('aria-hidden', 'false');
  });
});

function closeMenuModal(){
  menuModal.classList.remove('show');
  menuModal.setAttribute('aria-hidden', 'true');
}
modalClose.addEventListener('click', closeMenuModal);
menuModal.addEventListener('click', (e) => { if(e.target === menuModal) closeMenuModal(); });
document.addEventListener('keydown', (e) => { if(e.key === 'Escape') closeMenuModal(); });
