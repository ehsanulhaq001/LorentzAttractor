const cnv = document.querySelector("#canvas");
cnv.width = window.innerWidth;
cnv.height = window.innerHeight;
cnv.style.backgroundColor = "black";
const ctx = cnv.getContext("2d");

window.addEventListener('resize', () => {
    cnv.width = window.innerWidth;
    cnv.height = window.innerHeight;
});

let x = 0.1;
let y = 0;
let z = 0;
const a = 10;
const b = 28;
const c = 8 / 3;
let scale = 5;
let limited = 0;
let limit = 1000;
let rotate = 1;
let t = 0;
let dt = 0.01
let background = 1;
let gridSize = 10;
let points = [];
let hue = 0;

document.querySelector("#limitLabel").style.display = 'none';
document.querySelector("#limit").style.display = 'none';
document.querySelector("#scale").addEventListener('input', () => scale = document.querySelector("#scale").value)
document.querySelector("#angle").addEventListener('input', () => t = document.querySelector("#angle").value)
document.querySelector("#rotate").addEventListener('input', () => rotate = !rotate)
document.querySelector("#accuracy").addEventListener('input', () =>
    dt = 0.025 - document.querySelector("#accuracy").value * 0.005)

document.querySelector("#limited").addEventListener('input', () => {
    limited = !limited;
    document.querySelector("#limitLabel").style.display = (document.querySelector("#limitLabel").style.display === "none") ? "block" : "none";
    document.querySelector("#limit").style.display = (document.querySelector("#limit").style.display === "none") ? "block" : "none";
})

document.querySelector("#limit").addEventListener('input', () =>
    limit = document.querySelector("#limit").value)

document.querySelector("#background").addEventListener('input', () => {
    background = !background;
    document.querySelector("#backgroundSizeLabel").style.display = (document.querySelector("#backgroundSizeLabel").style.display === "none") ? "block" : "none";
    document.querySelector("#backgroundSize").style.display = (document.querySelector("#backgroundSize").style.display === "none") ? "block" : "none";
})
document.querySelector("#backgroundSize").addEventListener('input', () =>
    gridSize = document.querySelector("#backgroundSize").value)



function pointAt(x, y, z, t) {
    shiftX = x * Math.cos(t) - z * Math.sin(t) - x;
    shiftZ = z * Math.cos(t) + x * Math.sin(t) - z;
    hue = 3 * shiftZ;
    ctx.beginPath();
    ctx.arc(cnv.width / 2 + scale * (x + shiftX), cnv.height / 2 + scale * y, 0.5, 0, 2 * Math.PI, 1);
    ctx.strokeStyle = `hsl(${hue},100%, 50%)`;
    ctx.stroke();

}

function setBackground(n) {
    ctx.beginPath();
    for (let i = 1; i < n; i++) {
        if (i === n / 2) continue;
        ctx.moveTo(0, cnv.height * i / n);
        ctx.lineTo(cnv.width, cnv.height * i / n);
        ctx.moveTo(cnv.width * i / n, 0);
        ctx.lineTo(cnv.width * i / n, cnv.height);
    }
    ctx.strokeStyle = "rgb(10, 60, 60)";
    ctx.stroke();

    ctx.beginPath();

    ctx.moveTo(0, cnv.height * 3 / 6);
    ctx.lineTo(cnv.width, cnv.height * 3 / 6);
    ctx.moveTo(cnv.width * 3 / 6, 0);
    ctx.lineTo(cnv.width * 3 / 6, cnv.height);

    ctx.strokeStyle = "rgb(10, 90, 60)";
    ctx.stroke();

}

function animate() {
    requestAnimationFrame(animate);
    ctx.clearRect(0, 0, cnv.width, cnv.height);
    points.push({ x: x, y: y, z: z });
    let dx = a * (y - x) * dt;
    let dy = (x * (b - z) - y) * dt;
    let dz = (x * y - c * z) * dt;
    x = x + dx;
    y = y + dy;
    z = z + dz;
    points.push({ x, y, z });
    while (limited && points.length > limit) {
        points.shift();
    }
    points.forEach(point => { pointAt(point.x, point.y, point.z, t) })
    t = t - rotate * 0.01;
    background && setBackground(gridSize);
}

requestAnimationFrame(animate);
// setInterval(animate, 1000 / 500)