const ctx = document.getElementsByTagName('canvas')[0].getContext('2d');
const reloadElementButton = document.getElementById('reload');
const COLOURS = ['#fff', '#fff', '#fff', '#fff'];
const INTERVAL = 60;
const H = 10;
const CY = H / 2;
const PROGRESS_MAX = 100;
const MAX_WIDTH = 400;
const WIDTH_OFFSET = 40;

let W;
let CX;
let gradient;
let then = Date.now();
let progress = 0;
let _requestID;

function loaded() {
  progress -= 1;

  const progress_pixels = progress * W / 100;
  const inversed_progress_pixels = W - progress_pixels;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.beginPath();
  ctx.moveTo(0, CY);
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = '#fff';
  ctx.lineTo(W - inversed_progress_pixels, CY);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.strokeStyle = gradient;
  ctx.moveTo(W - inversed_progress_pixels, CY);
  ctx.lineTo(inversed_progress_pixels, CY);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.globalAlpha = 0.07;
  ctx.strokeStyle = '#fff';
  ctx.moveTo(progress_pixels, CY);
  ctx.lineTo(W, CY);
  ctx.stroke();
  ctx.closePath();

  _requestID = requestAnimationFrame(loaded);

  if (progress <= 50) {
    cancelAnimationFrame(_requestID);
    reloadElementButton.classList.add('active');
  }
}

function loading() {
  const progress_pixels = progress * W / 100;
  const half_progress_pixels = progress_pixels / 2;

  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.beginPath();
  ctx.globalAlpha = 0.5;
  ctx.strokeStyle = gradient;
  ctx.moveTo(0, CY);
  ctx.lineTo(CX - half_progress_pixels, CY);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.globalAlpha = 1;
  ctx.moveTo(CX - half_progress_pixels, CY);
  ctx.strokeStyle = gradient;
  for (var i = 0; i < progress_pixels / 2; i++) {
    const x = CX - half_progress_pixels + i * 2;
    const r = Math.floor(Math.random() * H) + 1;
    ctx.quadraticCurveTo(x, r, x, r);
  }
  ctx.quadraticCurveTo(CX + half_progress_pixels, CY, CX + half_progress_pixels, CY);
  ctx.stroke();
  ctx.closePath();

  ctx.beginPath();
  ctx.globalAlpha = 0.5;
  ctx.moveTo(CX + half_progress_pixels, CY);
  ctx.strokeStyle = gradient;
  ctx.lineTo(W, CY);
  ctx.stroke();
  ctx.closePath();

  _requestID = requestAnimationFrame(handleLoading);
}

function handleLoading() {
  if (_requestID % 2) progress += 0.5;
  if (progress >= PROGRESS_MAX) return loaded();

  const now = Date.now();
  const delta = now - then;
  if (delta > INTERVAL) {
    then = now - delta % INTERVAL;
    return loading();
  }

  _requestID = requestAnimationFrame(handleLoading);
}

function startLoading() {
  progress = 0;
  reloadElementButton.classList.remove('active');
  _requestID = requestAnimationFrame(handleLoading);
}

function rescale() {
  const w = window.innerWidth;
  const ratio = window.devicePixelRatio;

  if (w > MAX_WIDTH + WIDTH_OFFSET) {
    W = MAX_WIDTH;
  } else {
    W = w - WIDTH_OFFSET;
  }

  if (ratio) {
    ctx.canvas.width = W * ratio;
    ctx.canvas.height = H * ratio;
    ctx.canvas.style.width = `${W}px`;
    ctx.canvas.style.height = `${H}px`;
    ctx.scale(ratio, ratio);
  } else {
    ctx.canvas.width = W;
    ctx.canvas.height = H;
  }

  CX = W / 2;
  gradient = ctx.createLinearGradient(0, 0, W, 0);
  gradient.addColorStop(0.2, COLOURS[0]);
  gradient.addColorStop(0.4, COLOURS[1]);
  gradient.addColorStop(0.6, COLOURS[2]);
  gradient.addColorStop(0.8, COLOURS[3]);
}

function setup() {
  startLoading();
  reloadElementButton.addEventListener('click', startLoading);
  window.addEventListener('resize', rescale);
  rescale();
}

window.onload = setup();
$('.notify').click( function() {
  $(this).fadeOut();
});
