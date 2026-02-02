import { pipeline, env } from '@huggingface/transformers';

// Configuration
env.allowLocalModels = false;
const MODEL_NAME = 'Xenova/detr-resnet-50';
const SCORE_THRESHOLD = 0.1; // Lowered for debugging

// DOM Elements
const video = document.getElementById('webcam');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.getElementById('start-btn');
const loader = document.getElementById('loader');
const statusText = document.getElementById('status');
const fpsDisplay = document.getElementById('fps');
const countDisplay = document.getElementById('detection-count');

let detector = null;
let isDetecting = false;
let lastTime = 0;
let frameCount = 0;

// Color palette for different object classes
const colors = [
    '#6366f1', '#a855f7', '#f43f5e', '#10b981', '#f59e0b',
    '#3b82f6', '#ec4899', '#8b5cf6', '#06b6d4', '#14b8a6'
];

const classColors = {};

function getColor(label) {
    if (!classColors[label]) {
        classColors[label] = colors[Object.keys(classColors).length % colors.length];
    }
    return classColors[label];
}

async function initModel() {
    try {
        statusText.textContent = 'Downloading/Loading DETR-ResNet-50 model (~160MB)... This may take a moment.';
        detector = await pipeline('object-detection', MODEL_NAME);
        statusText.textContent = 'Model loaded successfully!';
        loader.classList.add('hidden');
        startBtn.disabled = false;
    } catch (err) {
        statusText.textContent = `Error loading model: ${err.message}`;
        console.error(err);
    }
}

async function startCamera() {
    try {
        const stream = await navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: 'user',
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        });
        video.srcObject = stream;

        video.onloadedmetadata = () => {
            // Set canvas size to match video intrinsic size
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            isDetecting = true;
            startBtn.textContent = 'Camera Active';
            startBtn.disabled = true;
            detect();
        };
    } catch (err) {
        alert('Could not access webcam: ' + err.message);
    }
}

const offscreenCanvas = document.createElement('canvas');
const offscreenCtx = offscreenCanvas.getContext('2d', { willReadFrequently: true });

async function detect() {
    if (!isDetecting) return;

    try {
        if (video.readyState < 2 || video.videoWidth === 0) {
            requestAnimationFrame(detect);
            return;
        }

        // Set offscreen canvas size once
        if (offscreenCanvas.width !== video.videoWidth) {
            offscreenCanvas.width = video.videoWidth;
            offscreenCanvas.height = video.videoHeight;
        }

        // Capture the current frame
        offscreenCtx.drawImage(video, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

        // Pass the offscreen canvas to the detector
        const results = await detector(offscreenCanvas, {
            threshold: SCORE_THRESHOLD,
            percentage: true,
        });

        if (results.length > 0) {
            console.log('Detected:', results.map(r => r.label).join(', '));
        }

        drawDetections(results);

        frameCount++;
        const now = performance.now();
        if (now - lastTime >= 1000) {
            const fps = Math.round((frameCount * 1000) / (now - lastTime));
            fpsDisplay.textContent = `FPS: ${fps}`;
            frameCount = 0;
            lastTime = now;
        }

        countDisplay.textContent = `Objects: ${results.length}`;
    } catch (err) {
        console.error('Detection error:', err);
    }

    // Add a slight delay to prevent overwhelming the main thread if needed,
    // but for now stick to requestAnimationFrame.
    requestAnimationFrame(detect);
}

function drawDetections(detections) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    detections.forEach(detection => {
        const { label, score, box } = detection;
        const { xmin, ymin, xmax, ymax } = box;

        const color = getColor(label);

        // Convert percentage to pixels
        const x = xmin * canvas.width;
        const y = ymin * canvas.height;
        const width = (xmax - xmin) * canvas.width;
        const height = (ymax - ymin) * canvas.height;

        // Draw bounding box
        ctx.strokeStyle = color;
        ctx.lineWidth = 4;
        ctx.lineJoin = 'round';
        ctx.strokeRect(x, y, width, height);

        // Draw label background
        ctx.fillStyle = color;
        const labelText = `${label} ${(score * 100).toFixed(1)}%`;
        ctx.font = 'bold 16px Outfit, sans-serif';
        const textWidth = ctx.measureText(labelText).width;

        ctx.fillRect(x, y - 30, textWidth + 20, 30);

        // Draw label text
        ctx.fillStyle = 'white';
        ctx.fillText(labelText, x + 10, y - 10);
    });
}

startBtn.addEventListener('click', startCamera);
startBtn.disabled = true;

// Initialize
initModel();
