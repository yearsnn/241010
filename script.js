const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentBrush = 'normal';
let brushColor = '#0412dc';
let isMirrored = false;
let useRainbowBrush = false;
let mirroredCanvasContainer = null;

document.getElementById('saveBtn').style.display = 'none';
document.getElementById('finish').style.display = 'none';

const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (e) => {
    brushColor = e.target.value;
    useRainbowBrush = false;
});

let randomColorBtn = document.getElementById('randomColorBtn');
if (!randomColorBtn) {
    randomColorBtn = document.createElement('button');
    randomColorBtn.id = 'randomColorBtn';
    randomColorBtn.textContent = 'Rainbow Brush';
    randomColorBtn.style.margin = '10px 10px';
    randomColorBtn.style.padding = '5px ';
    randomColorBtn.style.width = '80px';
    randomColorBtn.style.height = '70px';
    randomColorBtn.style.border = 'none';
    randomColorBtn.style.cursor = 'pointer';
    randomColorBtn.style.borderRadius = '5px';
    colorPicker.parentElement.appendChild(randomColorBtn);
}

randomColorBtn.addEventListener('click', () => {
    useRainbowBrush = true;
});

document.querySelectorAll('.brushBtn').forEach(button => {
    button.addEventListener('click', (e) => {
        currentBrush = e.target.dataset.brush;
        useRainbowBrush = false;
    });
});

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath();
}

function draw(e) {
    if (!drawing) return;

    ctx.lineWidth = currentBrush === 'thick' ? 10 : (currentBrush === 'dotted' ? 5 : 5);
    ctx.lineCap = 'round';

    if (useRainbowBrush) {
        brushColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
    }

    ctx.strokeStyle = brushColor;

    if (currentBrush === 'dotted') {
        const dashLength = 5;
        const gapLength = 20;
        ctx.setLineDash([dashLength, gapLength]);
    } else {
        ctx.setLineDash([]);
    }

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

document.getElementById('mirrorBtn').addEventListener('click', () => {
    const mirrorBtn = document.getElementById('mirrorBtn');

    if (!isMirrored) {
        const mirroredCanvas = document.createElement('canvas');
        const mirroredCtx = mirroredCanvas.getContext('2d');
        const sound = document.getElementById('decal-sound');
        sound.play();

        mirroredCanvas.width = canvas.width;
        mirroredCanvas.height = canvas.height;

        mirroredCtx.translate(mirroredCanvas.width, 0);
        mirroredCtx.scale(-1, 1);
        mirroredCtx.drawImage(canvas, 0, 0);

        mirroredCanvasContainer = document.createElement('div');
        mirroredCanvasContainer.style.position = 'absolute';
        mirroredCanvasContainer.style.left = `calc(15%)`;
        mirroredCanvasContainer.style.top = '20%';
        mirroredCanvas.classList.add('mirrored-canvas');
        mirroredCanvasContainer.appendChild(mirroredCanvas);
        document.body.appendChild(mirroredCanvasContainer);

        canvas.style.pointerEvents = 'none';
        isMirrored = true;

        mirrorBtn.innerText = 'reset';

        const speechBubble = document.getElementById('speechBubble');
        const ds = document.getElementById('ds');

        document.getElementById('brushContainer').style.display = 'none';
        document.getElementById('colorPicker').style.display = 'none';
        randomColorBtn.style.display = 'none';
        speechBubble.style.display = 'none';
        ds.style.display = 'none';

        document.getElementById('saveBtn').style.display = 'block';
        document.getElementById('finish').style.display = 'block';
    } else {
        if (mirroredCanvasContainer) {
            document.body.removeChild(mirroredCanvasContainer);
            mirroredCanvasContainer = null;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.pointerEvents = 'auto';
        isMirrored = false;
        mirrorBtn.innerText = 'décalcomanie!';

        document.getElementById('brushContainer').style.display = 'block';
        document.getElementById('colorPicker').style.display = 'block';
        randomColorBtn.style.display = 'block';
        speechBubble.style.display = 'block';
        ds.style.display = 'block';

        document.getElementById('saveBtn').style.display = 'none';
        document.getElementById('finish').style.display = 'none';
    }
});

document.getElementById('saveBtn').addEventListener('click', () => {
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    combinedCanvas.width = canvas.width * 2;
    combinedCanvas.height = canvas.height;

    if (mirroredCanvasContainer) {
        const mirroredCanvas = mirroredCanvasContainer.firstChild;
        combinedCtx.drawImage(mirroredCanvas, 0, 0);
    }
    combinedCtx.drawImage(canvas, canvas.width, 0);

    const link = document.createElement('a');
    link.href = combinedCanvas.toDataURL('image/png');
    link.download = 'decalcomanie_combined.png';
    link.click();
});
