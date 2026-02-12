import {
  HandLandmarker,
  FilesetResolver
} from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest";

const video = document.getElementById("video");
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

let handLandmarker;

// 1. استارت وبکم
async function startCam(){
  const stream = await navigator.mediaDevices.getUserMedia({video:true});
  video.srcObject = stream;
  await video.play();   // ← این خط حیاتیه
}

// 2. لود مدل AI
async function loadAI(){
  const vision = await FilesetResolver.forVisionTasks(
    "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
  );

  handLandmarker = await HandLandmarker.createFromOptions(vision,{
    baseOptions:{
      modelAssetPath:
        "https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task"
    },
    numHands:1
  });
}

// 3. رسم کره
function drawSphere(points){
  ctx.clearRect(0,0,canvas.width,canvas.height);

  const cx = canvas.width/2;
  const cy = canvas.height/2;

  for(let p of points){
    const x = cx + (p.x-.5)*500;
    const y = cy + (p.y-.5)*500;

    ctx.beginPath();
    ctx.fillStyle = "#60a5fa";
    ctx.arc(x,y,8,0,Math.PI*2);
    ctx.fill();
  }
}

// 4. لوپ اصلی
async function loop(){
  const res = await handLandmarker.detectForVideo(video, performance.now());
  if(res.landmarks.length){
    drawSphere(res.landmarks[0]);
  }
  requestAnimationFrame(loop);
}

// ترتیب درست اجرا
async function init(){
  await startCam();
  await loadAI();
  loop();
}

init();
