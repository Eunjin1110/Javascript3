// HTML 요소를 선택
const scoreElement = document.getElementById('score');
const increaseButton = document.getElementById('my-button');
const scoreImage = document.getElementById('score-image');
const startButton = document.getElementById('start-button');
const usernameInput = document.getElementById('username');
const leaderboardElement = document.getElementById('leaderboard');
const timerElement = document.getElementById('timer');
const recordButton = document.getElementById('record-button');
const restartButton = document.getElementById('restart-button'); // 게임 다시 시작하기 버튼

let score = 0;
let gameActive = false;
let timer;
let timeLeft = 10; // 10초 제한 시간

// 점수 업데이트 함수
function updateScore() {
    scoreElement.textContent = '점수 : ' + score;
}

// 타이머 업데이트 함수
function updateTimer() {
    timerElement.textContent = `남은 시간: ${timeLeft}초`;
}

// 점수 올리기 함수
function increaseScore() {
    if (gameActive) {
        score += 1;
        updateScore();

        // 점수 올리기 후 이미지 변경
        scoreImage.src = 'https://pbs.twimg.com/media/FVeXlSZagAAcD-2.jpg';
    }
}

// 게임 시작 함수
function startGame() {
    if (usernameInput.value === '') {
        alert('사용자 이름을 입력해주세요.');
        return;
    }

    score = 0;
    updateScore();
    gameActive = true;

    // 버튼 활성화
    increaseButton.disabled = false;
    startButton.disabled = true;
    recordButton.disabled = true; // 기록하기 버튼 비활성화
    restartButton.disabled = false; // 게임 다시 시작 버튼 활성화

    // 타이머 초기화
    timeLeft = 10;
    updateTimer();

    // 1초마다 타이머 업데이트
    timer = setInterval(() => {
        timeLeft -= 1;
        updateTimer();

        // 타이머가 0이 되면 게임 종료
        if (timeLeft <= 0) {
            clearInterval(timer);
            endGame();
        }
    }, 1000);
}

// 게임 종료 함수
function endGame() {
    gameActive = false;

    // 기록하기 버튼 활성화
    recordButton.disabled = false;

    // 점수 올리기 버튼 비활성화
    increaseButton.disabled = true;
}

// 리더보드 업데이트 함수
function updateLeaderboard() {
    leaderboardElement.innerHTML = '';

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    leaderboard.forEach((entry) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${entry.username}: ${entry.score}점`;
        leaderboardElement.appendChild(listItem);
    });
}

// 기록하기 함수
function recordScore() {
    const username = usernameInput.value;

    // 로컬 스토리지에 점수와 사용자 이름 저장
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

    leaderboard.push({ username, score });
    leaderboard.sort((a, b) => b.score - a.score); // 점수 내림차순 정렬

    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // 리더보드 업데이트
    updateLeaderboard();
}

// 게임 다시 시작 함수
function restartGame() {
    // 게임 상태 초기화
    score = 0;
    updateScore();
    timeLeft = 10;
    updateTimer();

    // 타이머 시작
    startGame();

    // 버튼 상태 초기화
    increaseButton.disabled = false;
    recordButton.disabled = true;
    restartButton.disabled = true; // 게임 다시 시작 버튼 비활성화
}

// 버튼 클릭 이벤트 처리
increaseButton.addEventListener('click', increaseScore);
startButton.addEventListener('click', startGame);
recordButton.addEventListener('click', recordScore);
restartButton.addEventListener('click', restartGame);

// 페이지 로드 시 리더보드 업데이트
window.addEventListener('load', updateLeaderboard);
