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
  if (this.alpha <= 0) return; // ถ้า alpha หมดแล้วไม่ต้องวาด
  
  ctx.save(); // บันทึกสถานะ canvas ก่อน
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
  ctx.restore(); // คืนสถานะ canvas
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

  const scale = 10 + Math.random() * 6; // ลดขนาด
  const colors = ["#ff4d6d","#ff99cc","#cc33ff","#9933cc","#ff0000","#cc0000"];
  const step = 0.025 + Math.random() * 0.05; // เพิ่ม step = อนุภาคน้อยลง

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

  const delay = 800 + Math.random() * 2000; // เพิ่มจาก 500-2000 เป็น 800-2800
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
  // ลบ startHearts(); ออกจากตรงนี้

  document.getElementById("start").style.display = "none";
  document.getElementById("noLove").style.display = "none";
  question.style.display = "none";

  // แสดงข้อความ
  document.getElementById("moon").style.opacity = "1";
  document.getElementById("cuteImage").style.opacity = "1";

  valentineText.querySelector("h1").style.opacity = "1";
  valentineText.querySelector("p:first-of-type").style.opacity = "1";
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
  }, 13000);

  setTimeout(() => {
    loveMessage.style.animation = "comeFromLeft 2s forwards";
    setTimeout(() => {
      loveMessage.style.animation = "sway 1s infinite";
      
      // 🔹 เพิ่มตรงนี้ - หัวใจเริ่มลอยหลังข้อความกลับมาแล้ว
      setTimeout(() => {
        startHearts();
      }, 1000); // รอ 1 วิหลังข้อความโยกแล้ว
      
    }, 2000);
  }, 16000);

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
// 🔹 ฟองสบู่หัวใจ
// สร้างดาวระยิบระยับ
// สร้างดาวระยิบระยับ
// สร้างดาวระยิบระยับ
function createStars() {
  const container = document.getElementById("container");
  const starCount = 50;
  
  for (let i = 0; i < starCount; i++) {
    setTimeout(() => {
      const star = document.createElement("div");
      star.className = "star";
      
      // สุ่มขนาด
      const size = Math.random();
      if (size > 0.7) {
        star.classList.add("big");
      } else if (size > 0.4) {
        star.classList.add("medium");
      }
      
      // สุ่มตำแหน่ง
      star.style.left = Math.random() * 100 + "%";
      star.style.top = Math.random() * 100 + "%";
      
      container.appendChild(star);
      
      // เพิ่ม class show เพื่อเริ่ม animation
      setTimeout(() => {
        star.classList.add("show");
      }, 50);
      
    }, i * 20);
  }
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
  }, 13000); /* เปลี่ยนจาก 6500 เป็น 13000 (12 วินาที + buffer) */
}

function createHeart() {
  const container = document.getElementById("container");
  
  // สุ่มว่าจะเป็นรูปภาพหรือ div หัวใจ
  const isImage = Math.random() > 0.65; // 50% โอกาส
  
  if (isImage) {
    // สร้างเป็นรูปภาพ
    const images = ["couple1.jpg", "couple2.jpg", "couple3.jpg", "couple4.jpg", "couple5.jpg"]; // เพิ่มชื่อรูปที่มี
    const randomImage = images[Math.floor(Math.random() * images.length)];
    
    const heart = document.createElement("img");
    heart.src = randomImage;
    heart.className = "heart";
    container.appendChild(heart);
    launchHeart(heart);
  } else {
    // สร้างเป็น div หัวใจ
    const heart = document.createElement("div");
    heart.className = "heart";
    container.appendChild(heart);
    launchHeart(heart);
  }
}

// เริ่มทำงานเฉพาะตอนกดปุ่ม
function startHearts() {
  for (let i = 0; i < 3; i++) { // เพิ่มจาก 5 เป็น 10 ดวง
    setTimeout(() => {
      createHeart();
    }, i * 800);
  }
}