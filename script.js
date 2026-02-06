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
function createStars() {
  const container = document.getElementById("container");
  const starCount = 50;
  
  for (let i = 0; i < starCount; i++) {
    setTimeout(() => {
      const star = document.createElement("div");
      star.className = "star";
      
      const size = Math.random();
      if (size > 0.7) {
        star.classList.add("big");
      } else if (size > 0.4) {
        star.classList.add("medium");
      }
      
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      
      container.appendChild(star);
      
      setTimeout(() => {
        star.classList.add("show");
      }, 50);
      
    }, i * 20);
  }
}

// ฟังก์ชัน Random
function R(min, max) {
  return min + Math.random() * (max - min);
}

// สร้างกลีบดอกกุหลาบแบบ GSAP (ใช้รูปภาพ rose.png)
function createPetal() {
  const container = document.getElementById("container");
  const petal = document.createElement("div");
  petal.className = "falling-petal";
  
  const img = document.createElement("img");
  img.src = "rose.png";
  img.alt = "petal";
  petal.appendChild(img);
  
  const startX = R(0, window.innerWidth);
  const startY = R(-200, -150);
  
  petal.style.left = startX + "px";
  petal.style.top = startY + "px";
  
  container.appendChild(petal);
  
  // Animation แบบ GSAP
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
  rose.className = "falling-rose";
  
  const img = document.createElement("img");
  
  // สุ่มเลือกรูปภาพดอกไม้ 1 จาก 2 รูป
  const roseImages = ["rose1.png", "rose2.png"]; // เปลี่ยนเป็นชื่อไฟล์รูปของคุณ
  const randomRose = roseImages[Math.floor(Math.random() * roseImages.length)];
  
  img.src = randomRose;
  img.alt = "rose";
  rose.appendChild(img);
  
  const startX = R(0, window.innerWidth);
  const startY = R(-200, -150);
  
  rose.style.left = startX + "px";
  rose.style.top = startY + "px";
  
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


// สร้างใบไม้ลอย (ใช้รูปภาพ leaf.png)
function createLeaf() {
  const container = document.getElementById("container");
  const leaf = document.createElement("div");
  leaf.className = "falling-leaf";
  
  const img = document.createElement("img");
  img.src = "leaf.png"; // ใช้รูปภาพใบไม้ที่คุณอัพโหลด
  img.alt = "leaf";
  leaf.appendChild(img);
  
  const startX = R(0, window.innerWidth);
  const startY = R(-200, -150);
  
  leaf.style.left = startX + "px";
  leaf.style.top = startY + "px";
  
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

function createHeart() {
  const container = document.getElementById("container");
  
  const isImage = Math.random() > 0.65;
  
  if (isImage) {
    // ใช้ div หุ้มรูปคน
    const heartWrapper = document.createElement("div");
    heartWrapper.className = "heart heart-photo";
    
    const images = ["couple1.jpg", "couple2.jpg", "couple3.jpg", "couple4.jpg", "couple5.jpg"];
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    heartWrapper.style.backgroundImage = `url('${randomImage}')`;
    heartWrapper.style.backgroundSize = 'cover';
    heartWrapper.style.backgroundPosition = 'center';
    
    container.appendChild(heartWrapper);
    launchHeart(heartWrapper);
  } else {
    // สุ่มสีหัวใจ
    const heart = document.createElement("div");
    heart.className = "heart heart-svg";
    
    const colors = ["#ff4d6d", "#ff99cc", "#cc33ff", "#ff0000", "#ff69b4"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    heart.innerHTML = `
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <path d="M50,90 C50,90 10,60 10,35 C10,20 20,10 30,10 C40,10 45,15 50,25 C55,15 60,10 70,10 C80,10 90,20 90,35 C90,60 50,90 50,90 Z" fill="${randomColor}"/>
      </svg>
    `;
    container.appendChild(heart);
    launchHeart(heart);
  }
}

function startHearts() {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      createHeart();
    }, i * 800);
  }
}
// สร้างดาวเคราะห์ลอยผ่าน
// เพิ่มตัวแปรเก็บประวัติดาว
let planetHistory = [];

function createPlanet() {
  const container = document.getElementById("container");
  const planet = document.createElement("div");
  planet.className = "planet";
  
  // สุ่มดาวเคราะห์
  const planets = [
    { color: "linear-gradient(135deg, #f39c12, #e67e22)", class: "", name: "jupiter" },
    { color: "linear-gradient(135deg, #3498db, #2980b9)", class: "", name: "neptune" },
    { color: "linear-gradient(135deg, #e74c3c, #c0392b)", class: "", name: "mars" },
    { color: "linear-gradient(135deg, #f1c40f, #f39c12)", class: "saturn", name: "saturn" },
    { color: "linear-gradient(135deg, #9b59b6, #8e44ad)", class: "", name: "pluto" },
  ];
  
  // กรองดาวที่ไม่อยู่ใน history
  let availablePlanets = planets.filter(p => !planetHistory.includes(p.name));
  
  // ถ้าไม่มีดาวให้เลือก (ทุกดาวถูกใช้ไปแล้ว) ให้ reset history
  if (availablePlanets.length === 0) {
    planetHistory = [];
    availablePlanets = planets;
  }
  
  // สุ่มจากดาวที่ยังไม่ได้ใช้
  const randomPlanet = availablePlanets[Math.floor(Math.random() * availablePlanets.length)];
  
  // เพิ่มดาวที่เลือกเข้า history
  planetHistory.push(randomPlanet.name);
  
  // เก็บแค่ 2 รอบล่าสุด
  if (planetHistory.length > 2) {
    planetHistory.shift(); // ลบตัวแรกออก
  }
  
  planet.style.background = randomPlanet.color;
  
  if (randomPlanet.class) {
    planet.classList.add(randomPlanet.class);
  }
  
  // สุ่มขนาด
  const size = 80 + Math.random() * 60;
  planet.style.width = size + "px";
  planet.style.height = size + "px";
  
  // สุ่มมุมเริ่มต้น (4 มุม)
  const corners = [
    { // ซ้ายบน -> ขวาล่าง
      startLeft: "-200px",
      startTop: "-200px",
      endLeft: "calc(100% + 200px)",
      endTop: "calc(100% + 200px)"
    },
    { // ขวาบน -> ซ้ายล่าง
      startLeft: "calc(100% + 200px)",
      startTop: "-200px",
      endLeft: "-200px",
      endTop: "calc(100% + 200px)"
    },
    { // ซ้ายล่าง -> ขวาบน
      startLeft: "-200px",
      startTop: "calc(100% + 200px)",
      endLeft: "calc(100% + 200px)",
      endTop: "-200px"
    },
    { // ขวาล่าง -> ซ้ายบน
      startLeft: "calc(100% + 200px)",
      startTop: "calc(100% + 200px)",
      endLeft: "-200px",
      endTop: "-200px"
    }
  ];
  
  const corner = corners[Math.floor(Math.random() * corners.length)];
  
  // สุ่มความเร็ว (ช้าลง)
  const duration = 20 + Math.random() * 15; // 20-35 วินาที
  
  // ตั้งค่าตำแหน่งเริ่มต้น
  planet.style.left = corner.startLeft;
  planet.style.top = corner.startTop;
  
  container.appendChild(planet);
  
  // ใช้ Web Animations API
  planet.animate([
    {
      left: corner.startLeft,
      top: corner.startTop,
      opacity: 0,
      transform: "scale(0.3)"
    },
    {
      opacity: 0.3,
      transform: "scale(0.5)",
      offset: 0.15
    },
    {
      opacity: 1,
      transform: "scale(1)",
      offset: 0.4
    },
    {
      opacity: 1,
      transform: "scale(1)",
      offset: 0.6
    },
    {
      opacity: 0.3,
      transform: "scale(0.5)",
      offset: 0.85
    },
    {
      left: corner.endLeft,
      top: corner.endTop,
      opacity: 0,
      transform: "scale(0.3)"
    }
  ], {
    duration: duration * 1000,
    easing: "ease-in-out",
    fill: "forwards"
  });
  
  // ลบหลังจบ
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
function startPlanets() {
  createPlanet(); // สร้างดวงแรกทันที
  
  setInterval(() => {
    createPlanet();
  }, 30000 + Math.random() * 20000); // ทุกๆ 30-50 วินาที
}