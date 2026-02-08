const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});

// โหลดเสียงพลุ
const fireworkSound = new Audio("firework.mp3");
fireworkSound.volume = 0.5;

// เพลง background
const bgMusic = document.getElementById("bgMusic");
const volumeControl = document.getElementById("volume");
bgMusic.volume = 0.2;
// ปรับเสียงด้วย slider
volumeControl.addEventListener("input", () => {
  bgMusic.volume = volumeControl.value;
});

// อนุภาคหัวใจ (พลุ)
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.alpha = 1;
    this.color = color;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.alpha -= 0.015;
  }
  draw() {
    if (this.alpha <= 0) return;
    
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    const size = 6;
    ctx.moveTo(this.x, this.y);
    ctx.bezierCurveTo(this.x - size, this.y - size,
                      this.x - size*2, this.y + size/2,
                      this.x, this.y + size);
    ctx.bezierCurveTo(this.x + size*2, this.y + size/2,
                      this.x + size, this.y - size,
                      this.x, this.y);
    ctx.fill();
    ctx.restore();
  }
}

// จรวดพลุ
class Rocket {
  constructor(targetX, targetY) {
    this.x = targetX;
    this.y = canvas.height;
    this.targetY = targetY;
    this.speed = 6;
    this.exploded = false;
  }
  update() {
    if (this.y > this.targetY) {
      this.y -= this.speed;
    } else if (!this.exploded) {
      this.explode();
      this.exploded = true;
    }
  }
  draw() {
    if (!this.exploded) {
      ctx.fillStyle = "white";
      ctx.beginPath();
      ctx.arc(this.x, this.y, 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  explode() {
    fireworkSound.currentTime = 0;
    fireworkSound.play().catch(err => console.log("Audio play blocked:", err));

    const scale = 10 + Math.random() * 6;
    const colors = ["#ff4d6d","#ff99cc","#cc33ff","#9933cc","#ff0000","#cc0000"];
    const step = 0.025 + Math.random() * 0.05;

    for (let t = 0; t < Math.PI * 2; t += step) {
      const x = this.x + scale * (16 * Math.pow(Math.sin(t), 3));
      const y = this.y - scale * (
        13 * Math.cos(t) -
        5 * Math.cos(2 * t) -
        2 * Math.cos(3 * t) -
        Math.cos(4 * t)
      );
      const color = colors[Math.floor(Math.random() * colors.length)];
      particles.push(new Particle(x, y, color));
    }
  }
}

let particles = [];
let rockets = [];

function launchRocket() {
  const targetX = Math.random() * canvas.width;
  const targetY = Math.random() * (canvas.height / 2);
  rockets.push(new Rocket(targetX, targetY));

  const delay = 800 + Math.random() * 2000;
  setTimeout(launchRocket, delay);
}


const loveMessage = document.getElementById("loveMessage");
const question = document.getElementById("question");
const valentineText = document.getElementById("valentineText");

document.getElementById("start").addEventListener("click", () => {
  bgMusic.play().catch(err => console.log("Music play blocked:", err));
  fireworkSound.play().catch(err => console.log("Audio unlock error:", err));
  fireworkSound.pause();
  fireworkSound.currentTime = 0;
  launchRocket();
  createStars();
  startPetalsAndLeaves();
  startPlanets();
  startShootingStars();
  startUFOs();
  startAliens();
  initLoveScore();
  initStarScore();
  initPlanetScore();
initAlienScore();
initFlowerScore();

  document.getElementById("start").style.display = "none";
  document.getElementById("noLove").style.display = "none";
  question.style.display = "none";

  // แสดงข้อความ
  document.getElementById("moon").style.opacity = "1";
  document.getElementById("cuteImage").style.opacity = "1";

  valentineText.querySelector("h1").style.opacity = "1";
  valentineText.querySelector("p:first-of-type").style.opacity = "1";
  setTimeout(() => {
    valentineText.querySelector("h1").classList.add("glowing");
    valentineText.querySelector("p:first-of-type").classList.add("glowing");
  }, 17000);
  valentineText.style.animation = "bounceImage 5s infinite";
  cuteImage.style.animation = "bounceImage 1s infinite";
  moon.style.animation = "bounceImage 6s infinite";
  loveMessage.style.opacity = "1";
  loveMessage.style.bottom = "50%";
  loveMessage.style.animation = "sway 1s infinite";

  setTimeout(() => {
    loveMessage.style.animation = "shrinkRotate 2s forwards";
  }, 10000);

  setTimeout(() => {
    loveMessage.style.animation = "driveAcross 4s linear forwards";
    loveMessage.style.opacity = "1";
  }, 12000);

  setTimeout(() => {
    loveMessage.style.animation = "comeFromLeft 2s forwards";
    setTimeout(() => {
      loveMessage.style.animation = "sway 1s infinite";
      
      setTimeout(() => {
        startHearts();
      }, 1000);
      
    }, 2000);
  }, 15000);

}, { once: true });

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  rockets.forEach(r => {
    r.update();
    r.draw();
  });

  particles = particles.filter(p => p.alpha > 0);
  particles.forEach(p => {
    p.update();
    p.draw();
  });

  requestAnimationFrame(animate);
}
animate();

// ปุ่ม "ไม่รัก" หนีเมาส์
let vx = 0, vy = 0;
const noLoveBtn = document.getElementById("noLove");
const messageBox = document.getElementById("message");

noLoveBtn.addEventListener("click", () => {
  messageBox.textContent = "ทำไมเธอไม่รักเค้า ไปกดรักเค้าเดี๋ยวนี้";
  messageBox.style.opacity = "1";
  setTimeout(() => {
    messageBox.style.opacity = "0";
  }, 3000);
});

function animateNoLove() {
  const rect = noLoveBtn.getBoundingClientRect();
  const btnX = rect.left + rect.width / 2;
  const btnY = rect.top + rect.height / 2;

  const dx = btnX - mouseX;
  const dy = btnY - mouseY;
  const distance = Math.hypot(dx, dy);

  if (distance < 150) {
    const force = (150 - distance) / 3;
    const angle = Math.atan2(dy, dx);
    vx += Math.cos(angle) * force;
    vy += Math.sin(angle) * force;
  }

  vx *= 0.9;
  vy *= 0.9;

  let newX = btnX + vx;
  let newY = btnY + vy;

  newX = Math.max(rect.width / 2, Math.min(window.innerWidth - rect.width / 2, newX));
  newY = Math.max(rect.height / 2, Math.min(window.innerHeight - rect.height / 2, newY));

  noLoveBtn.style.left = `${newX}px`;
  noLoveBtn.style.top = `${newY}px`;

  requestAnimationFrame(animateNoLove);
}

let mouseX = 0, mouseY = 0;
document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});
animateNoLove();

// สร้างดาวระยิบระยับ
// สร้างดาวระยิบระยับ - คลิกได้
// สร้างดาวระยิบระยับ - คลิกได้ และสร้างใหม่
function createStars() {
  const container = document.getElementById("container");
  const starCount = 50;
  
  for (let i = 0; i < starCount; i++) {
    setTimeout(() => {
      createSingleStar(container);
    }, i * 20);
  }
}

// สร้างดาวเดี่ยว (ใช้ซ้ำได้)
function createSingleStar(container) {
  const star = document.createElement("div");
  star.className = "star clickable";
  
  const size = Math.random();
  if (size > 0.7) {
    star.classList.add("big");
  } else if (size > 0.4) {
    star.classList.add("medium");
  }
  
  star.style.left = Math.random() * 100 + "%";
  star.style.top = Math.random() * 100 + "%";
  
  // เพิ่ม event listener คลิก
  star.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // เพิ่มคะแนนดาว
    updateStarScore(1);
    
    // สร้างเอฟเฟกต์แตก
    const rect = star.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    createStarExplosion(centerX, centerY);
    
    // ลบดาวทันที
    star.remove();
    
    // สร้างดาวใหม่ทันที
    setTimeout(() => {
      createSingleStar(container);
    }, 100); // รอ 0.1 วินาทีแล้วสร้างใหม่
  });
  
  container.appendChild(star);
  
  setTimeout(() => {
    star.classList.add("show");
  }, 50);
}


// ฟังก์ชัน Random
function R(min, max) {
  return min + Math.random() * (max - min);
}

// สร้างกลีบดอกกุหลาบแบบ GSAP (ใช้รูปภาพ rose.png)
function createPetal() {
  const container = document.getElementById("container");
  const petal = document.createElement("div");
  petal.className = "falling-petal clickable";
  
  const img = document.createElement("img");
  img.src = "rose.png";
  img.alt = "petal";
  petal.appendChild(img);
  
  const startX = R(0, window.innerWidth);
  const startY = R(-200, -150);
  
  petal.style.left = startX + "px";
  petal.style.top = startY + "px";
  
  // เพิ่มการคลิก
  petal.addEventListener("click", (e) => {
    e.stopPropagation();
    
    updateFlowerScore(1);
    
    const rect = petal.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createFlowerExplosion(centerX, centerY, "#ffb6c1");
    
    petal.remove();
  });
  
  container.appendChild(petal);
  
  const duration = R(6, 15);
  const endY = window.innerHeight + 100;
  const swayAmount = R(-100, 100);
  const rotateX = R(0, 360);
  const rotateY = R(0, 360);
  const rotateZ = R(0, 180);
  
  petal.style.setProperty('--fall-duration', duration + 's');
  petal.style.setProperty('--end-y', endY + 'px');
  petal.style.setProperty('--sway-x', swayAmount + 'px');
  petal.style.setProperty('--rotate-x', rotateX + 'deg');
  petal.style.setProperty('--rotate-y', rotateY + 'deg');
  petal.style.setProperty('--rotate-z', rotateZ + 'deg');
  
  petal.classList.add('animated');
  
  setTimeout(() => {
    petal.remove();
  }, duration * 1000 + 1000);
}

// สร้างดอกกุหลาบจากรูปภาพ
// สร้างดอกกุหลาบจากรูปภาพ (สุ่ม 2 รูป)
function createRose() {
  const container = document.getElementById("container");
  const rose = document.createElement("div");
  rose.className = "falling-rose clickable";
  
  const img = document.createElement("img");
  const roseImages = ["rose1.png", "rose2.png"];
  const randomRose = roseImages[Math.floor(Math.random() * roseImages.length)];
  
  img.src = randomRose;
  img.alt = "rose";
  rose.appendChild(img);
  
  const startX = R(0, window.innerWidth);
  const startY = R(-200, -150);
  
  rose.style.left = startX + "px";
  rose.style.top = startY + "px";
  
  // เพิ่มการคลิก
  rose.addEventListener("click", (e) => {
    e.stopPropagation();
    
    updateFlowerScore(1);
    
    const rect = rose.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createFlowerExplosion(centerX, centerY, "#ff69b4");
    
    rose.remove();
  });
  
  container.appendChild(rose);
  
  const duration = R(7, 12);
  const endY = window.innerHeight + 100;
  const swayAmount = R(-100, 100);
  const rotateZ = R(0, 360);
  
  rose.style.setProperty('--fall-duration', duration + 's');
  rose.style.setProperty('--end-y', endY + 'px');
  rose.style.setProperty('--sway-x', swayAmount + 'px');
  rose.style.setProperty('--rotate-z', rotateZ + 'deg');
  
  rose.classList.add('animated');
  
  setTimeout(() => rose.remove(), duration * 1000 + 1000);
}

function createLeaf() {
  const container = document.getElementById("container");
  const leaf = document.createElement("div");
  leaf.className = "falling-leaf clickable";
  
  const img = document.createElement("img");
  img.src = "leaf.png";
  img.alt = "leaf";
  leaf.appendChild(img);
  
  const startX = R(0, window.innerWidth);
  const startY = R(-200, -150);
  
  leaf.style.left = startX + "px";
  leaf.style.top = startY + "px";
  
  // เพิ่มการคลิก
  leaf.addEventListener("click", (e) => {
    e.stopPropagation();
    
    updateFlowerScore(1);
    
    const rect = leaf.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createFlowerExplosion(centerX, centerY, "#90EE90");
    
    leaf.remove();
  });
  
  container.appendChild(leaf);
  
  const duration = R(6, 15);
  const endY = window.innerHeight + 100;
  const swayAmount = R(-100, 100);
  const rotateX = R(0, 360);
  const rotateY = R(0, 360);
  const rotateZ = R(0, 360);
  
  leaf.style.setProperty('--fall-duration', duration + 's');
  leaf.style.setProperty('--end-y', endY + 'px');
  leaf.style.setProperty('--sway-x', swayAmount + 'px');
  leaf.style.setProperty('--rotate-x', rotateX + 'deg');
  leaf.style.setProperty('--rotate-y', rotateY + 'deg');
  leaf.style.setProperty('--rotate-z', rotateZ + 'deg');
  
  leaf.classList.add('animated');
  
  setTimeout(() => {
    leaf.remove();
  }, duration * 1000 + 1000);
}

// ฟังก์ชันเริ่มกลีบและดอกไม้ลอย
function startPetalsAndLeaves() {
  const interval = setInterval(() => {
    const rand = Math.random();
    if (rand > 0.5) {
      createPetal(); 
    } else if (rand > 0.25) {
      createRose(); 
    } else if (rand > 0.2) {
      createLeaf(); 
    }
  }, 4200);
  
  /*setTimeout(() => {
    clearInterval(interval);
  }, 30000);*/
}

function launchHeart(element) {
  const startX = Math.random() * (window.innerWidth - 120);
  const startY = window.innerHeight + 100;

  element.style.left = startX + "px";
  element.style.top = startY + "px";

  setTimeout(() => {
    const targetX = Math.random() * (window.innerWidth - 120);
    const targetY = -150;
    element.style.left = targetX + "px";
    element.style.top = targetY + "px";
  }, 50);

  setTimeout(() => {
    element.remove();
    createHeart();
  }, 13000);
}

// ตัวแปรเก็บคะแนนแยก
let loveScore = 0;
let starScore = 0;


// ⭐ เพิ่มตัวแปรเช็คว่าเคยคลิกหรือยัง
let hasClickedLove = false;
let hasClickedStar = false;
let hasClickedPlanet = false;
let hasClickedAlien = false;
let hasClickedFlower = false;

// สร้างหรือหาตัวแสดงคะแนนหัวใจ
function initLoveScore() {
  let scoreElement = document.getElementById("loveScore");
  if (!scoreElement) {
    scoreElement = document.createElement("div");
    scoreElement.id = "loveScore";
    scoreElement.innerHTML = "❤️ 0";
    document.body.appendChild(scoreElement);
  }
  scoreElement.style.display = "none"; // ⭐ เปลี่ยนจาก "block" เป็น "none"
  scoreElement.style.opacity = "0"; // ⭐ เพิ่มบรรทัดนี้
  return scoreElement;
}

function initStarScore() {
  let scoreElement = document.getElementById("starScore");
  if (!scoreElement) {
    scoreElement = document.createElement("div");
    scoreElement.id = "starScore";
    scoreElement.innerHTML = "⭐ 0";
    document.body.appendChild(scoreElement);
  }
  scoreElement.style.display = "none"; // ⭐ เปลี่ยนจาก "block" เป็น "none"
  scoreElement.style.opacity = "0"; // ⭐ เพิ่มบรรทัดนี้
  return scoreElement;
}

// อัพเดทคะแนนหัวใจ
// อัพเดทคะแนนหัวใจ
function updateLoveScore(points = 1) {
  loveScore += points;
  const scoreElement = document.getElementById("loveScore") || initLoveScore();
  scoreElement.innerHTML = `❤️ ${loveScore}`;
  
  // ⭐ เพิ่มส่วนนี้ - เช็คว่าเป็นครั้งแรกหรือไม่
  if (!hasClickedLove) {
    hasClickedLove = true;
    scoreElement.style.display = "block";
    scoreElement.style.transition = "opacity 0.8s ease";
    setTimeout(() => {
      scoreElement.style.opacity = "1";
    }, 50);
  }
  // ⭐ จบส่วนที่เพิ่ม
  
  // Animation เด้ง
  scoreElement.style.transform = "scale(1.3)";
  setTimeout(() => {
    scoreElement.style.transform = "scale(1)";
  }, 200);
}

// อัพเดทคะแนนดาว
function updateStarScore(points = 1) {
  starScore += points;
  const scoreElement = document.getElementById("starScore") || initStarScore();
  scoreElement.innerHTML = `⭐ ${starScore}`;
  
  // ⭐ เช็คว่าเป็นครั้งแรกหรือไม่
  if (!hasClickedStar) {
    hasClickedStar = true;
    scoreElement.style.display = "block";
    scoreElement.style.transition = "opacity 0.8s ease";
    setTimeout(() => {
      scoreElement.style.opacity = "1";
    }, 50);
  }
  
  // Animation เด้ง
  scoreElement.style.transform = "scale(1.3)";
  setTimeout(() => {
    scoreElement.style.transform = "scale(1)";
  }, 200);
}

// สร้างอนุภาคหัวใจแตก
function createHeartExplosion(x, y, color) {
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "heart-particle";
    
    particle.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,90 C50,90 10,60 10,35 C10,20 20,10 30,10 C40,10 45,15 50,25 C55,15 60,10 70,10 C80,10 90,20 90,35 C90,60 50,90 50,90 Z" fill="${color}"/>
      </svg>
    `;
    
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    
    document.body.appendChild(particle);
    
    // สุ่มทิศทางและความเร็ว
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 3 + Math.random() * 4;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    // Animation
    particle.animate([
      {
        left: x + "px",
        top: y + "px",
        opacity: 1,
        transform: "scale(1)"
      },
      {
        left: (x + vx * 30) + "px",
        top: (y + vy * 30) + "px",
        opacity: 0,
        transform: "scale(0.3)"
      }
    ], {
      duration: 800,
      easing: "ease-out"
    });
    
    // ลบอนุภาค
    setTimeout(() => {
      particle.remove();
    }, 850);
  }
}

// สร้างอนุภาคดาวแตก
function createStarExplosion(x, y) {
  const particleCount = 12;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "star-particle";
    
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    
    document.body.appendChild(particle);
    
    // สุ่มทิศทางและความเร็ว
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 4 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    // Animation
    particle.animate([
      {
        left: x + "px",
        top: y + "px",
        opacity: 1,
        transform: "scale(1)"
      },
      {
        left: (x + vx * 35) + "px",
        top: (y + vy * 35) + "px",
        opacity: 0,
        transform: "scale(0.2)"
      }
    ], {
      duration: 700,
      easing: "ease-out"
    });
    
    // ลบอนุภาค
    setTimeout(() => {
      particle.remove();
    }, 750);
  }
}

function createHeart() {
  const container = document.getElementById("container");
  
  const isImage = Math.random() > 0.65;
  let heartElement;
  let heartColor;
  
  if (isImage) {
    heartElement = document.createElement("div");
    heartElement.className = "heart heart-photo clickable";  // ⭐ ใส่ clickable กลับมา
    
    const images = ["couple1.jpg", "couple2.jpg", "couple3.jpg", "couple4.jpg", "couple5.jpg"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    heartElement.style.backgroundImage = `url('${randomImage}')`;
    heartElement.style.backgroundSize = 'cover';
    heartElement.style.backgroundPosition = 'center';
    
    heartColor = "#ff69b4";
  } else {
    heartElement = document.createElement("div");
    heartElement.className = "heart heart-svg clickable";
    
    const colors = ["#ff4d6d", "#ff99cc", "#cc33ff", "#ff0000", "#ff69b4"];
    heartColor = colors[Math.floor(Math.random() * colors.length)];
    
    heartElement.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,90 C50,90 10,60 10,35 C10,20 20,10 30,10 C40,10 45,15 50,25 C55,15 60,10 70,10 C80,10 90,20 90,35 C90,60 50,90 50,90 Z" fill="${heartColor}"/>
      </svg>
    `;
  }
  
  // ⭐ Event listener แยกตามประเภท
  // ⭐ Event listener แยกตามประเภท
// ⭐ Event listener แยกตามประเภท
heartElement.addEventListener("click", (e) => {
  e.stopPropagation();
  
  if (isImage) {
    // ⭐ รูปคน - ให้ค่อยๆ วาปขึ้นบนนุ่มนวล
    const currentLeft = parseFloat(heartElement.style.left) || 0;
    
    // สุ่มตำแหน่งใหม่ที่ด้านบน
    let newLeft = Math.random() * (window.innerWidth - 120);
    let newTop = -200; // ขึ้นไปด้านบน
    
    // ค่อยๆ วาปขึ้นไป (ใช้เวลา 1 วินาที)
    heartElement.style.left = newLeft + "px";
    heartElement.style.top = newTop + "px";
    heartElement.style.transition = "left 1s ease-out, top 1s ease-out"; // ⭐ ช้าลง 1 วินาที
    
    // ลบและสร้างใหม่หลังวาปเสร็จ
    setTimeout(() => {
      heartElement.remove();
      createHeart();
    }, 1200); // ⭐ รอให้วาปเสร็จก่อน
    
  } else {
    // ⭐ หัวใจ SVG - ให้แตกปกติ
    updateLoveScore(1);
    
    const rect = heartElement.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    createHeartExplosion(centerX, centerY, heartColor);
    
    heartElement.remove();
  }
});
  
  container.appendChild(heartElement);
  launchHeart(heartElement);
}

function startHearts() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      createHeart();
    }, i * 800);
  }
}

// ตัวแปรเก็บคะแนนเพิ่มเติม
let planetScore = 0;
let alienScore = 0;
let flowerScore = 0;

// สร้างหรือหาตัวแสดงคะแนนดาวเคราะห์
function initPlanetScore() {
  let scoreElement = document.getElementById("planetScore");
  if (!scoreElement) {
    scoreElement = document.createElement("div");
    scoreElement.id = "planetScore";
    scoreElement.innerHTML = "🪐 0";
    document.body.appendChild(scoreElement);
  }
  scoreElement.style.display = "none"; // ⭐ เปลี่ยนจาก "block" เป็น "none"
  scoreElement.style.opacity = "0"; // ⭐ เพิ่มบรรทัดนี้
  return scoreElement;
}


// สร้างหรือหาตัวแสดงคะแนนเอเลี่ยน
function initAlienScore() {
  let scoreElement = document.getElementById("alienScore");
  if (!scoreElement) {
    scoreElement = document.createElement("div");
    scoreElement.id = "alienScore";
    scoreElement.innerHTML = "👽 0";
    document.body.appendChild(scoreElement);
  }
  scoreElement.style.display = "none"; // ⭐ เปลี่ยนจาก "block" เป็น "none"
  scoreElement.style.opacity = "0"; // ⭐ เพิ่มบรรทัดนี้
  return scoreElement;
}

// สร้างหรือหาตัวแสดงคะแนนดอกไม้
function initFlowerScore() {
  let scoreElement = document.getElementById("flowerScore");
  if (!scoreElement) {
    scoreElement = document.createElement("div");
    scoreElement.id = "flowerScore";
    scoreElement.innerHTML = "🌸 0";
    document.body.appendChild(scoreElement);
  }
  scoreElement.style.display = "none"; // ⭐ เปลี่ยนจาก "block" เป็น "none"
  scoreElement.style.opacity = "0"; // ⭐ เพิ่มบรรทัดนี้
  return scoreElement;
}

// อัพเดทคะแนนดาวเคราะห์
function updatePlanetScore(points = 1) {
  planetScore += points;
  const scoreElement = document.getElementById("planetScore") || initPlanetScore();
  scoreElement.innerHTML = `🪐 ${planetScore}`;
  
  // ⭐ เช็คว่าเป็นครั้งแรกหรือไม่
  if (!hasClickedPlanet) {
    hasClickedPlanet = true;
    scoreElement.style.display = "block";
    scoreElement.style.transition = "opacity 0.8s ease";
    setTimeout(() => {
      scoreElement.style.opacity = "1";
    }, 50);
  }
  
  scoreElement.style.transform = "scale(1.3)";
  setTimeout(() => {
    scoreElement.style.transform = "scale(1)";
  }, 200);
}

// อัพเดทคะแนนเอเลี่ยน
function updateAlienScore(points = 1) {
  alienScore += points;
  const scoreElement = document.getElementById("alienScore") || initAlienScore();
  scoreElement.innerHTML = `👽 ${alienScore}`;
  
  // ⭐ เช็คว่าเป็นครั้งแรกหรือไม่
  if (!hasClickedAlien) {
    hasClickedAlien = true;
    scoreElement.style.display = "block";
    scoreElement.style.transition = "opacity 0.8s ease";
    setTimeout(() => {
      scoreElement.style.opacity = "1";
    }, 50);
  }
  
  scoreElement.style.transform = "scale(1.3)";
  setTimeout(() => {
    scoreElement.style.transform = "scale(1)";
  }, 200);
}

// อัพเดทคะแนนดอกไม้
function updateFlowerScore(points = 1) {
  flowerScore += points;
  const scoreElement = document.getElementById("flowerScore") || initFlowerScore();
  scoreElement.innerHTML = `🌸 ${flowerScore}`;
  
  // ⭐ เช็คว่าเป็นครั้งแรกหรือไม่
  if (!hasClickedFlower) {
    hasClickedFlower = true;
    scoreElement.style.display = "block";
    scoreElement.style.transition = "opacity 0.8s ease";
    setTimeout(() => {
      scoreElement.style.opacity = "1";
    }, 50);
  }
  
  scoreElement.style.transform = "scale(1.3)";
  setTimeout(() => {
    scoreElement.style.transform = "scale(1)";
  }, 200);
}
// สร้างอนุภาคดาวเคราะห์แตก
function createPlanetExplosion(x, y, color) {
  const particleCount = 20;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "planet-particle";
    particle.style.background = color;
    
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 5 + Math.random() * 6;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    particle.animate([
      {
        left: x + "px",
        top: y + "px",
        opacity: 1,
        transform: "scale(1)"
      },
      {
        left: (x + vx * 40) + "px",
        top: (y + vy * 40) + "px",
        opacity: 0,
        transform: "scale(0.3)"
      }
    ], {
      duration: 900,
      easing: "ease-out"
    });
    
    setTimeout(() => {
      particle.remove();
    }, 950);
  }
}

// สร้างอนุภาคเอเลี่ยนแตก
function createAlienExplosion(x, y) {
  const particleCount = 18;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "alien-particle";
    
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 4 + Math.random() * 5;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    particle.animate([
      {
        left: x + "px",
        top: y + "px",
        opacity: 1,
        transform: "scale(1)"
      },
      {
        left: (x + vx * 35) + "px",
        top: (y + vy * 35) + "px",
        opacity: 0,
        transform: "scale(0.2)"
      }
    ], {
      duration: 800,
      easing: "ease-out"
    });
    
    setTimeout(() => {
      particle.remove();
    }, 850);
  }
}

// สร้างอนุภาคดอกไม้แตก
function createFlowerExplosion(x, y, color) {
  const particleCount = 15;
  
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "flower-particle";
    particle.style.background = color;
    
    particle.style.left = x + "px";
    particle.style.top = y + "px";
    
    document.body.appendChild(particle);
    
    const angle = (Math.PI * 2 * i) / particleCount;
    const velocity = 3 + Math.random() * 4;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    
    particle.animate([
      {
        left: x + "px",
        top: y + "px",
        opacity: 1,
        transform: "scale(1)"
      },
      {
        left: (x + vx * 30) + "px",
        top: (y + vy * 30) + "px",
        opacity: 0,
        transform: "scale(0.2)"
      }
    ], {
      duration: 700,
      easing: "ease-out"
    });
    
    setTimeout(() => {
      particle.remove();
    }, 750);
  }
}
// สร้างดาวเคราะห์ลอยผ่าน
// เพิ่มตัวแปรเก็บประวัติดาว
let planetHistory = [];

function createPlanet() {
  const container = document.getElementById("container");
  const planet = document.createElement("div");
  planet.className = "planet clickable";
  
  const planets = [
    { color: "linear-gradient(135deg, #f39c12, #e67e22)", class: "", name: "jupiter" },
    { color: "linear-gradient(135deg, #3498db, #2980b9)", class: "", name: "neptune" },
    { color: "linear-gradient(135deg, #e74c3c, #c0392b)", class: "", name: "mars" },
    { color: "linear-gradient(135deg, #f1c40f, #f39c12)", class: "saturn", name: "saturn" },
    { color: "linear-gradient(135deg, #9b59b6, #8e44ad)", class: "", name: "pluto" },
  ];
  
  let availablePlanets = planets.filter(p => !planetHistory.includes(p.name));
  
  if (availablePlanets.length === 0) {
    planetHistory = [];
    availablePlanets = planets;
  }
  
  const randomPlanet = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
  
  planetHistory.push(randomPlanet.name);
  
  if (planetHistory.length > 2) {
    planetHistory.shift();
  }
  
  planet.style.background = randomPlanet.color;
  
  if (randomPlanet.class) {
    planet.classList.add(randomPlanet.class);
  }
  
  const size = 80 + Math.random() * 60;
  planet.style.width = size + "px";
  planet.style.height = size + "px";
  
  const corners = [
    { startLeft: "-200px", startTop: "-200px", endLeft: "calc(100% + 200px)", endTop: "calc(100% + 200px)" },
    { startLeft: "calc(100% + 200px)", startTop: "-200px", endLeft: "-200px", endTop: "calc(100% + 200px)" },
    { startLeft: "-200px", startTop: "calc(100% + 200px)", endLeft: "calc(100% + 200px)", endTop: "-200px" },
    { startLeft: "calc(100% + 200px)", startTop: "calc(100% + 200px)", endLeft: "-200px", endTop: "-200px" }
  ];
  
  const corner = corners[Math.floor(Math.random() * corners.length)];
  const duration = 20 + Math.random() * 15;
  
  planet.style.left = corner.startLeft;
  planet.style.top = corner.startTop;
  
  // เพิ่ม event listener คลิก
  let planetAnimation;
  planet.addEventListener("click", (e) => {
    e.stopPropagation();
    
    updatePlanetScore(1);
    
    const rect = planet.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // หาสีหลักจาก gradient
    const mainColor = randomPlanet.color.match(/#[0-9a-f]{6}/i)[0];
    createPlanetExplosion(centerX, centerY, mainColor);
    
    if (planetAnimation) {
      planetAnimation.cancel();
    }
    
    planet.remove();
  });
  
  container.appendChild(planet);
  
  planetAnimation = planet.animate([
    { left: corner.startLeft, top: corner.startTop, opacity: 0, transform: "scale(0.3)" },
    { opacity: 0.3, transform: "scale(0.5)", offset: 0.15 },
    { opacity: 1, transform: "scale(1)", offset: 0.4 },
    { opacity: 1, transform: "scale(1)", offset: 0.6 },
    { opacity: 0.3, transform: "scale(0.5)", offset: 0.85 },
    { left: corner.endLeft, top: corner.endTop, opacity: 0, transform: "scale(0.3)" }
  ], {
    duration: duration * 1000,
    easing: "ease-in-out",
    fill: "forwards"
  });
  
  setTimeout(() => {
    planet.remove();
  }, duration * 1000 + 1000);
}
// สร้างดาวตก/ดาวหาง - แบบเส้นลากยาว (เล็กลง)
// สร้างดาวตก/ดาวหาง - แบบเส้นลากยาว (สุ่มทั้ง 2 ฝั่ง)
// สร้างดาวตก/ดาวหาง - แบบเส้นลากยาว (มีแสงวิบตอนหาย)
// สร้างดาวตก/ดาวหาง - แบบเส้นลากยาว (แสงวิบที่หัวดาว)
function createShootingStar() {
  const container = document.getElementById("container");
  const star = document.createElement("div");
  star.className = "shooting-star";
  
  const colors = ["pastel-pink", "pastel-blue", "pastel-purple", "gold", "", "pastel-pink", "pastel-purple"];
  const randomColor = colors[Math.floor(Math.random() * colors.length)];
  if (randomColor) {
    star.classList.add(randomColor);
  }
  
  const direction = Math.random() > 0.5;
  let startX, startY, angle;
  
  if (direction) {
    startX = -5 + Math.random() * 40;
    startY = -10 + Math.random() * 30;
    angle = 30 + Math.random() * 35;
  } else {
    startX = 65 + Math.random() * 40;
    startY = -10 + Math.random() * 30;
    angle = 115 + Math.random() * 35;
  }
  
  star.style.left = startX + "%";
  star.style.top = startY + "%";
  
  const lineLength = 60 + Math.random() * 80;
  star.style.width = lineLength + "px";
  
  container.appendChild(star);
  
  const distance = 250 + Math.random() * 350;
  const duration = 0.7 + Math.random() * 0.6;
  
  // คำนวณปลายทางก่อน
  const endX = startX + (distance * Math.cos(angle * Math.PI / 180)) / window.innerWidth * 100;
  const endY = startY + (distance * Math.sin(angle * Math.PI / 180)) / window.innerHeight * 100;
  
  // คำนวณหัวดาว (บวก offset ของความยาวเส้น)
  const headOffsetX = (lineLength * Math.cos(angle * Math.PI / 180)) / window.innerWidth * 100;
  const headOffsetY = (lineLength * Math.sin(angle * Math.PI / 180)) / window.innerHeight * 100;
  const headX = endX + headOffsetX;
  const headY = endY + headOffsetY;
  
  star.animate([
    {
      left: startX + "%",
      top: startY + "%",
      opacity: 0,
      transform: `rotate(${angle}deg) scaleX(0.3)`
    },
    {
      opacity: 1,
      transform: `rotate(${angle}deg) scaleX(1)`,
      offset: 0.05
    },
    {
      opacity: 1,
      offset: 0.7
    },
    {
      left: endX + "%",
      top: endY + "%",
      opacity: 0,
      transform: `rotate(${angle}deg) scaleX(0.8)`
    }
  ], {
    duration: duration * 1000,
    easing: "ease-out",
    fill: "forwards"
  });
  
  setTimeout(() => {
    createStarFlash(headX, headY, randomColor);
  }, duration * 1000);
  
  setTimeout(() => {
    star.remove();
  }, duration * 1000 + 100);
}

// ฟังก์ชันสร้างแสงวิบ - เล็กลง
function createStarFlash(x, y, colorClass) {
  const container = document.getElementById("container");
  const flash = document.createElement("div");
  flash.className = "star-flash";
  
  // เพิ่มสีตามดาวตก
  const flashColors = {
    "pastel-pink": "flash-pink",
    "pastel-blue": "flash-blue",
    "pastel-purple": "flash-purple",
    "gold": "flash-gold"
  };
  
  if (colorClass && flashColors[colorClass]) {
    flash.classList.add(flashColors[colorClass]);
  }
  
  flash.style.left = x + "%";
  flash.style.top = y + "%";
  
  container.appendChild(flash);
  
  // Animation แสงวิบ - เร็วและเล็กกว่าเดิม
  flash.animate([
    {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(0.2)"
    },
    {
      opacity: 1,
      transform: "translate(-50%, -50%) scale(1)",
      offset: 0.4
    },
    {
      opacity: 0,
      transform: "translate(-50%, -50%) scale(1.5)"
    }
  ], {
    duration: 300, // 0.3 วินาที (เร็วขึ้น)
    easing: "ease-out",
    fill: "forwards"
  });
  
  // ลบแสงวิบ
  setTimeout(() => {
    flash.remove();
  }, 400);
}

// เริ่มระบบดาวตก
function startShootingStars() {
  // สร้างดาวตกครั้งแรก
  setTimeout(() => {
    createShootingStar();
  }, 5000); // รอ 5 วินาที
  
  // สุ่มสร้างดาวตกทุกๆ 8-25 วินาที
  setInterval(() => {
    if (Math.random() > 0.3) { // 70% โอกาสเกิด
      createShootingStar();
      
      // บางครั้งอาจมี 2-3 ดวงติดกัน (20% โอกาส)
      if (Math.random() > 0.8) {
        setTimeout(() => createShootingStar(), 300 + Math.random() * 500);
      }
    }
  }, 8000 + Math.random() * 17000);
}

// ตัวแปรเก็บประวัติยาน
let ufoHistory = [];

// สร้างยานอวกาศ UFO
function createUFO() {
  const container = document.getElementById("container");
  const ufo = document.createElement("div");
  ufo.className = "ufo clickable";  // เพิ่ม clickable
  
  const img = document.createElement("img");
  img.src = "ufo.png";
  img.alt = "UFO";
  ufo.appendChild(img);
  
  const size = 60 + Math.random() * 40;
  ufo.style.width = size + "px";
  
  const directions = [
    {
      startLeft: "-120px",
      startTop: (30 + Math.random() * 40) + "%",
      endLeft: "calc(100% + 120px)",
      endTop: (25 + Math.random() * 50) + "%"
    },
    {
      startLeft: "calc(100% + 120px)",
      startTop: (30 + Math.random() * 40) + "%",
      endLeft: "-120px",
      endTop: (25 + Math.random() * 50) + "%"
    },
    {
      startLeft: (20 + Math.random() * 60) + "%",
      startTop: "-120px",
      endLeft: (15 + Math.random() * 70) + "%",
      endTop: "calc(100% + 120px)"
    },
    {
      startLeft: (20 + Math.random() * 60) + "%",
      startTop: "calc(100% + 120px)",
      endLeft: (15 + Math.random() * 70) + "%",
      endTop: "-120px"
    }
  ];
  
  let availableDirections = directions.filter((_, index) => !ufoHistory.includes(index));
  
  if (availableDirections.length === 0) {
    ufoHistory = [];
    availableDirections = directions;
  }
  
  const dirIndex = Math.floor(Math.random() * availableDirections.length);
  const actualIndex = directions.indexOf(availableDirections[dirIndex]);
  const direction = directions[actualIndex];
  
  ufoHistory.push(actualIndex);
  if (ufoHistory.length > 2) {
    ufoHistory.shift();
  }
  
  ufo.style.left = direction.startLeft;
  ufo.style.top = direction.startTop;
  
  // ⭐ เพิ่มโค้ดนี้ - Event Listener คลิก UFO
  let ufoAnimation;
  ufo.addEventListener("click", (e) => {
    e.stopPropagation();
    
    // นับคะแนนรวมกับเอเลี่ยน
    updateAlienScore(1);
    
    // สร้างเอฟเฟกต์แตก
    const rect = ufo.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createAlienExplosion(centerX, centerY);
    
    // หยุด animation และลบ UFO
    if (ufoAnimation) {
      ufoAnimation.cancel();
    }
    ufo.remove();
  });
  // ⭐ จบโค้ดที่เพิ่ม
  
  container.appendChild(ufo);
  
  const duration = 15 + Math.random() * 10;
  
  ufoAnimation = ufo.animate([
    {
      left: direction.startLeft,
      top: direction.startTop,
      opacity: 0,
      transform: "scale(0.5)"
    },
    {
      opacity: 0.3,
      transform: "scale(0.7)",
      offset: 0.1
    },
    {
      opacity: 1,
      transform: "scale(1)",
      offset: 0.3
    },
    {
      opacity: 1,
      transform: "scale(1)",
      offset: 0.7
    },
    {
      opacity: 0.3,
      transform: "scale(0.7)",
      offset: 0.9
    },
    {
      left: direction.endLeft,
      top: direction.endTop,
      opacity: 0,
      transform: "scale(0.5)"
    }
  ], {
    duration: duration * 1000,
    easing: "ease-in-out",
    fill: "forwards"
  });
  
  ufo.style.animation = `ufoFloat 2s ease-in-out infinite`;
  
  setTimeout(() => {
    ufo.remove();
  }, duration * 1000 + 1000);
}

// เริ่มระบบยาน UFO
function startUFOs() {
  // สร้างยานแรก
  setTimeout(() => {
    createUFO();
  }, 10000); // รอ 10 วินาที
  
  // สุ่มสร้างยานทุกๆ 40-70 วินาที
  setInterval(() => {
    if (Math.random() > 0.2) { // 60% โอกาสเกิด
      createUFO();
    }
  }, 25000 + Math.random() * 15000);
}

// สร้างเอเลี่ยนโผล่ทุกจุดรอบขอบ - หัวออกตรงข้าม
// สร้างเอเลี่ยนโผล่ทุกจุดรอบขอบ - หัวออกตรงข้าม
function createAlien() {
  const alien = document.createElement("div");
  alien.className = "alien clickable";
  
  const img = document.createElement("img");
  img.src = "alien.png";
  img.alt = "Alien";
  alien.appendChild(img);
  
  const positions = [
    { left: "0", bottom: "5%", rotate: 90, hideAmount: 30, axis: "X", direction: -1 },
    { left: "0", bottom: "15%", rotate: 90, hideAmount: 30, axis: "X", direction: -1 },
    { right: "0", bottom: "5%", rotate: -90, hideAmount: 30, axis: "X", direction: 1 },
    { right: "0", bottom: "15%", rotate: -90, hideAmount: 30, axis: "X", direction: 1 },
    { left: "0", top: "5%", rotate: 90, hideAmount: 30, axis: "X", direction: -1 },
    { left: "0", top: "15%", rotate: 90, hideAmount: 30, axis: "X", direction: -1 },
    { right: "0", top: "5%", rotate: -90, hideAmount: 30, axis: "X", direction: 1 },
    { right: "0", top: "15%", rotate: -90, hideAmount: 30, axis: "X", direction: 1 },
    { left: "0", top: "30%", rotate: 90, hideAmount: 30, axis: "X", direction: -1 },
    { left: "0", top: "45%", rotate: 90, hideAmount: 30, axis: "X", direction: -1 },
    { left: "0", top: "60%", rotate: 90, hideAmount: 30, axis: "X", direction: -1 },
    { right: "0", top: "30%", rotate: -90, hideAmount: 30, axis: "X", direction: 1 },
    { right: "0", top: "45%", rotate: -90, hideAmount: 30, axis: "X", direction: 1 },
    { right: "0", top: "60%", rotate: -90, hideAmount: 30, axis: "X", direction: 1 },
  ];
  
  const pos = positions[Math.floor(Math.random() * positions.length)];
  
  if (pos.left !== undefined) alien.style.left = pos.left;
  if (pos.right !== undefined) alien.style.right = pos.right;
  if (pos.top !== undefined) alien.style.top = pos.top;
  if (pos.bottom !== undefined) alien.style.bottom = pos.bottom;
  
  img.style.transform = `rotate(${pos.rotate}deg)`;
  
  const startTransform = `translateX(${pos.direction * 100}%)`;
  const peekTransform = `translateX(${pos.direction * pos.hideAmount}%)`;
  
  alien.style.transform = startTransform;
  
  // ประกาศ waveInterval ก่อน
  let waveInterval;
  
  // event listener click
  alien.addEventListener("click", (e) => {
    e.stopPropagation();
    updateAlienScore(1);
    
    const rect = alien.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    createAlienExplosion(centerX, centerY);
    
    if (waveInterval) {
      clearInterval(waveInterval);
    }
    alien.remove();
  });
  
  document.body.appendChild(alien);
  
  alien.animate([
    { transform: startTransform, opacity: 0 },
    { transform: peekTransform, opacity: 1, offset: 0.15 },
    { transform: peekTransform, opacity: 1, offset: 0.85 },
    { transform: startTransform, opacity: 0 }
  ], {
    duration: 8000,
    easing: "ease-in-out",
    fill: "forwards"
  });
  
  // Animation โบกมือ
  let waveAngle = 0;
  waveInterval = setInterval(() => {
    waveAngle += 0.15;
    const waveRotation = Math.sin(waveAngle) * 8;
    alien.style.transform = `${peekTransform} rotate(${waveRotation}deg)`;
    img.style.transform = `rotate(${pos.rotate}deg)`;
  }, 50);
  
  setTimeout(() => {
    clearInterval(waveInterval);
  }, 6800);
  
  setTimeout(() => {
    clearInterval(waveInterval);
    alien.remove();
  }, 9000);
}


// เริ่มระบบเอเลี่ยน
function startAliens() {
  // โผล่ครั้งแรก
  setTimeout(() => {
    createAlien();
  }, 25000); // หลังกดปุ่ม 20 วินาที
  
  // สุ่มโผล่ทุกๆ 45-75 วินาที
  setInterval(() => {
    if (Math.random() > 0.2) { // 70% โอกาส
      createAlien();
    }
  }, 20000 + Math.random() * 15000);
}


function startPlanets() {
  createPlanet(); // สร้างดวงแรกทันที
  
  setInterval(() => {
    createPlanet();
  }, 30000 + Math.random() * 20000); // ทุกๆ 30-50 วินาที
}

