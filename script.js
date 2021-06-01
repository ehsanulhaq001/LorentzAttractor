const cnv = document.querySelector("#canvas");
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;
cnv.style.backgroundColor = "black";
const ctx = cnv.getContext("2d");

window.addEventListener("resize", () => {
  cnv.width = window.innerWidth;
  cnv.height = window.innerHeight;
});

function onNchange() {
  curves = new Array(n);
  for (let i = 0; i < curves.length; i++) {
    curves[i] = new Array();
  }
  xyz = new Array(n);
}

const a = 10;
const b = 28;
const c = 8 / 3;
let scale = 5;
let limited = 0;
let limit = 1000;
let rotate = 1;
let t = 0;
let dt = 0.01;
let background = 1;
let gridSize = 10;
let n = 6;
let curves = new Array(n);
for (let i = 0; i < curves.length; i++) {
  curves[i] = new Array();
}
let hue = 0;
let prevP;
let prevQ;
let xyz = new Array(n);

document.querySelector("#limitLabel").style.display = "none";
document.querySelector("#limit").style.display = "none";
document.querySelector("#nop").addEventListener("input", () => {
  n = parseInt(document.querySelector("#nop").value);
  onNchange();
});
document
  .querySelector("#scale")
  .addEventListener(
    "input",
    () => (scale = document.querySelector("#scale").value)
  );
document
  .querySelector("#angle")
  .addEventListener(
    "input",
    () => (t = document.querySelector("#angle").value)
  );
document
  .querySelector("#rotate")
  .addEventListener("input", () => (rotate = !rotate));
document
  .querySelector("#accuracy")
  .addEventListener(
    "input",
    () => (dt = 0.025 - document.querySelector("#accuracy").value * 0.005)
  );

document.querySelector("#limited").addEventListener("input", () => {
  limited = !limited;
  document.querySelector("#limitLabel").style.display =
    document.querySelector("#limitLabel").style.display === "none"
      ? "block"
      : "none";
  document.querySelector("#limit").style.display =
    document.querySelector("#limit").style.display === "none"
      ? "block"
      : "none";
});

document
  .querySelector("#limit")
  .addEventListener(
    "input",
    () => (limit = document.querySelector("#limit").value)
  );

document.querySelector("#background").addEventListener("input", () => {
  background = !background;
  document.querySelector("#backgroundSizeLabel").style.display =
    document.querySelector("#backgroundSizeLabel").style.display === "none"
      ? "block"
      : "none";
  document.querySelector("#backgroundSize").style.display =
    document.querySelector("#backgroundSize").style.display === "none"
      ? "block"
      : "none";
});
document
  .querySelector("#backgroundSize")
  .addEventListener(
    "input",
    () => (gridSize = document.querySelector("#backgroundSize").value)
  );

function pointAt(x, y, z, t) {
  shiftX = x * Math.cos(t) - z * Math.sin(t) - x;
  shiftZ = z * Math.cos(t) + x * Math.sin(t) - z;
  hue = -3 * shiftZ;
  let p = cnv.width / 2 + scale * (x + shiftX);
  let q = cnv.height / 2 + scale * y;

  ctx.beginPath();
  ctx.moveTo(prevP, prevQ);
  ctx.lineTo(p, q);
  ctx.strokeStyle = `hsl(${hue},100%, 50%)`;
  ctx.stroke();
  prevP = p;
  prevQ = q;
  return { p, q };
}

function setBackground(n) {
  ctx.beginPath();
  for (let i = 1; i < n; i++) {
    if (i === n / 2) continue;
    ctx.moveTo(0, (cnv.height * i) / n);
    ctx.lineTo(cnv.width, (cnv.height * i) / n);
    ctx.moveTo((cnv.width * i) / n, 0);
    ctx.lineTo((cnv.width * i) / n, cnv.height);
  }
  ctx.strokeStyle = "rgb(10, 60, 60)";
  ctx.stroke();

  ctx.beginPath();

  ctx.moveTo(0, (cnv.height * 3) / 6);
  ctx.lineTo(cnv.width, (cnv.height * 3) / 6);
  ctx.moveTo((cnv.width * 3) / 6, 0);
  ctx.lineTo((cnv.width * 3) / 6, cnv.height);

  ctx.strokeStyle = "rgb(10, 90, 60)";
  ctx.stroke();
}

function animate() {
  ctx.clearRect(0, 0, cnv.width, cnv.height);
  background && setBackground(gridSize);

  for (let i = 0; i < n; i++) {
    if (curves[i].length == 0) {
      xyz[i] = {
        x: Math.random() * 5 + 0.1,
        y: Math.random() * 5 + 0.1,
        z: Math.random() * 5 + 0.1,
      };
    }
    let x = xyz[i].x;
    let y = xyz[i].y;
    let z = xyz[i].z;
    let dx = a * (y - x) * dt;
    let dy = (x * (b - z) - y) * dt;
    let dz = (x * y - c * z) * dt;
    xyz[i].x = x + dx;
    xyz[i].y = y + dy;
    xyz[i].z = z + dz;
    x = xyz[i].x;
    y = xyz[i].y;
    z = xyz[i].z;
    curves[i].push({ x, y, z });
    while (limited && curves[i].length > limit) {
      curves[i].shift();
    }
    prevP = undefined;
    prevQ = undefined;
    let u;
    curves[i].forEach((point) => {
      u = pointAt(point.x, point.y, point.z, t);
    });
    ctx.beginPath();
    ctx.arc(u.p, u.q, 2, 0, 2 * Math.PI, 1);
    ctx.fillStyle = "white";
    ctx.fill();
  }

  t = t - rotate * 0.01;
  requestAnimationFrame(animate);
}
requestAnimationFrame(animate);
