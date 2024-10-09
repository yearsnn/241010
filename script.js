const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let drawing = false;
let currentBrush = 'normal';
let brushColor = '#0412dc'; // 초기 색상
let isMirrored = false;
let useRainbowBrush = false; // 무지개 브러쉬 활성화 여부
let mirroredCanvasContainer = null; // 미러 캔버스 컨테이너

document.getElementById('saveBtn').style.display = 'none'; // 초기 상태에서 saveBtn 숨김
document.getElementById('finish').style.display = 'none'; // 초기 상태에서 문구 숨김

// 슬라이더에서 색상 선택
const colorPicker = document.getElementById('colorPicker');
colorPicker.addEventListener('input', (e) => {
    brushColor = e.target.value; // 브러쉬 색상 업데이트
    useRainbowBrush = false; // 무지개 브러쉬 해제
});

// 랜덤 컬러 버튼 생성 (중복 생성 방지)
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

    // 컬러픽커 옆에 랜덤 컬러 버튼 추가
    colorPicker.parentElement.appendChild(randomColorBtn);
}

// 랜덤 컬러 버튼 클릭 시 무지개 브러쉬 활성화
randomColorBtn.addEventListener('click', () => {
    useRainbowBrush = true; // 무지개 브러쉬 활성화
});

// 브러쉬 버튼 클릭 시 브러쉬 변경
document.querySelectorAll('.brushBtn').forEach(button => {
    button.addEventListener('click', (e) => {
        currentBrush = e.target.dataset.brush;
        useRainbowBrush = false; // 무지개 브러쉬 해제
    });
});

// 그림 그리기 시작
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mousemove', draw);

function startDrawing(e) {
    drawing = true;
    draw(e);
}

function stopDrawing() {
    drawing = false;
    ctx.beginPath(); // 새로 그리기 경로 초기화
}

function draw(e) {
    if (!drawing) return;

    // 브러쉬 스타일 및 색상 적용
    ctx.lineWidth = currentBrush === 'thick' ? 10 : (currentBrush === 'dotted' ? 5 : 5); // 점선 두께를 5px로 설정
    ctx.lineCap = 'round';

    if (useRainbowBrush) {
        brushColor = `hsl(${Math.random() * 360}, 100%, 50%)`; // 무지개 색상 적용
    }

    ctx.strokeStyle = brushColor; // 선택한 색상 적용

    if (currentBrush === 'dotted') {
        const dashLength = 5; // 점의 길이 조정
        const gapLength = 20;   // 점 사이의 간격 조정
        ctx.setLineDash([dashLength, gapLength]); // 점선 설정
    } else {
        ctx.setLineDash([]); // 점선 해제
    }

    ctx.lineTo(e.offsetX, e.offsetY);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(e.offsetX, e.offsetY);
}

// 데칼코마니 버튼 클릭 시
document.getElementById('mirrorBtn').addEventListener('click', () => {
    const mirrorBtn = document.getElementById('mirrorBtn');

    if (!isMirrored) {
        // 새로운 캔버스 생성 및 반전 처리
        const mirroredCanvas = document.createElement('canvas');
        const mirroredCtx = mirroredCanvas.getContext('2d');
        const sound = document.getElementById('decal-sound');
        sound.play();

        mirroredCanvas.width = canvas.width;
        mirroredCanvas.height = canvas.height;

        mirroredCtx.translate(mirroredCanvas.width, 0);
        mirroredCtx.scale(-1, 1);
        mirroredCtx.drawImage(canvas, 0, 0);

        // 새 캔버스 추가
        mirroredCanvasContainer = document.createElement('div');
        mirroredCanvasContainer.style.position = 'absolute';
        mirroredCanvasContainer.style.left = `calc(15%)`;
        mirroredCanvasContainer.style.top = '20%';
        mirroredCanvas.classList.add('mirrored-canvas');
        mirroredCanvasContainer.appendChild(mirroredCanvas);
        document.body.appendChild(mirroredCanvasContainer);

        // 기존 캔버스에 그림 그리기 방지
        canvas.style.pointerEvents = 'none';
        isMirrored = true;

        mirrorBtn.innerText = 'reset';

        const speechBubble = document.getElementById('speechBubble');
        const ds = document.getElementById('ds');


        // 슬라이더, 컬러픽커 및 랜덤 컬러 버튼 숨기기
        document.getElementById('brushContainer').style.display = 'none';
        document.getElementById('colorPicker').style.display = 'none';
        randomColorBtn.style.display = 'none';
        speechBubble.style.display = 'none';
        ds.style.display = 'none';

        // saveBtn 보이기
        document.getElementById('saveBtn').style.display = 'block';
        
        // 완료 메시지 보이기
        document.getElementById('finish').style.display = 'block'; 
        // finish p 나타나기
    } else {
        // 초기 상태로 돌아가기
        if (mirroredCanvasContainer) {
            document.body.removeChild(mirroredCanvasContainer);
            mirroredCanvasContainer = null;
        }

        // 기존 캔버스 초기화
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.style.pointerEvents = 'auto';
        isMirrored = false;
        mirrorBtn.innerText = 'décalcomanie!';

        // 슬라이더, 컬러픽커 및 랜덤 컬러 버튼 다시 표시
        document.getElementById('brushContainer').style.display = 'block';
        document.getElementById('colorPicker').style.display = 'block';
        randomColorBtn.style.display = 'block';
        speechBubble.style.display = 'block';
        ds.style.display = 'block';

        // saveBtn 숨기기
        document.getElementById('saveBtn').style.display = 'none';
        
        // 완료 메시지 숨기기
        document.getElementById('finish').style.display = 'none'; // finish p 숨기기
    }
});

// 저장 버튼 클릭 이벤트 리스너
document.getElementById('saveBtn').addEventListener('click', () => {
    // 새로운 캔버스 생성
    const combinedCanvas = document.createElement('canvas');
    const combinedCtx = combinedCanvas.getContext('2d');

    // 캔버스 크기 설정 (두 개의 캔버스를 가로로 붙여서 크기 설정)
    combinedCanvas.width = canvas.width * 2; // 두 배 넓이
    combinedCanvas.height = canvas.height; // 동일한 높이

    // 기존 캔버스와 미러 캔버스의 이미지를 합침
    if (mirroredCanvasContainer) {
        const mirroredCanvas = mirroredCanvasContainer.firstChild; // 미러 캔버스 가져오기
        combinedCtx.drawImage(mirroredCanvas, 0, 0); // 미러 캔버스를 왼쪽에 그리기
    }
    combinedCtx.drawImage(canvas, canvas.width, 0); // 원본 캔버스를 오른쪽에 그리기

    // 다운로드 링크 생성 및 이미지 저장
    const link = document.createElement('a'); // 앵커 요소 생성
    link.href = combinedCanvas.toDataURL('image/png'); // 결합된 캔버스의 내용을 PNG 형식으로 변환
    link.download = 'decalcomanie_combined.png'; // 저장할 파일 이름 설정
    link.click(); // 링크 클릭하여 다운로드 시작
});
