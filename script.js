// 定義兩組主題資料 (每組8張卡片)
const themes = {
    theme1: [
        { front: 'a9.png', back: 'a1.png' },
        { front: 'a9.png', back: 'a2.png' },
        { front: 'a9.png', back: 'a3.png' },
        { front: 'a9.png', back: 'a4.png' },
        { front: 'a9.png', back: 'a5.png' },
        { front: 'a9.png', back: 'a6.png' },
        { front: 'a9.png', back: 'a7.png' },
        { front: 'a9.png', back: 'a8.png' }
    ],
    theme2: [
        { front: 'b9.png', back: 'b1.png' },
        { front: 'b9.png', back: 'b2.png' },
        { front: 'b9.png', back: 'b3.png' },
        { front: 'b9.png', back: 'b4.png' },
        { front: 'b9.png', back: 'b5.png' },
        { front: 'b9.png', back: 'b6.png' },
        { front: 'b9.png', back: 'b7.png' },
        { front: 'b9.png', back: 'b8.png' }
    ]
};

// 當前主題，默認為 theme1
let currentTheme = 'theme1';
let flippedCards = []; // 存放當前翻轉的兩張卡片
let matchedPairs = 0; // 計算匹配的對數
let gameStarted = false; // 遊戲是否已開始
let startTime; // 遊戲開始時間
let timerInterval; // 計時器
// 重複生成兩次，產生16張卡片
function getRepeatedCards(theme) {
    return [...themes[theme], ...themes[theme]];
}

// 隨機打亂陣列的順序 (Fisher-Yates 洗牌演算法)
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// 動態生成卡片的函數
function createCard(frontImage, backImage) {
    const card = document.createElement('div');
    card.classList.add('card');
    card.dataset.matched = 'false'; // 標記卡片是否匹配成功

    const front = document.createElement('div');
    front.classList.add('card-front');
    const frontImg = document.createElement('img');
    frontImg.src = frontImage;
    frontImg.alt = `Front of card`;
    front.appendChild(frontImg);

    const back = document.createElement('div');
    back.classList.add('card-back');
    const backImg = document.createElement('img');
    backImg.src = backImage;
    backImg.alt = `Back of card`;
    back.appendChild(backImg);

    card.appendChild(front);
    card.appendChild(back);

    // 添加翻轉事件
    card.addEventListener('click', function () {
        if (!gameStarted || flippedCards.length >= 2 || card.classList.contains('flipped') || card.dataset.matched === 'true') return;

        card.classList.add('flipped');
        flippedCards.push(card);

        if (flippedCards.length === 2) {
            checkMatch();
        }
    });

    return card;
}

// 檢查是否匹配
function checkMatch() {
    const [firstCard, secondCard] = flippedCards;

    if (firstCard.innerHTML === secondCard.innerHTML) {
        // 匹配成功
        firstCard.dataset.matched = 'true';
        secondCard.dataset.matched = 'true';
        flippedCards = [];
        matchedPairs++;

        // 檢查是否所有對已經配對完成
        if (matchedPairs === 8) {
            endGame(); // 完成所有匹配後結束遊戲
        }
    } else {
        // 匹配失敗
        setTimeout(() => {
            firstCard.classList.remove('flipped');
            secondCard.classList.remove('flipped');
            flippedCards = [];
        }, 1000);
    }
}
// 開始遊戲按鈕邏輯
function startGame() {
    gameStarted = false;
    flippedCards = [];
    matchedPairs = 0;
    clearInterval(timerInterval); // 清除計時器
    renderCards(); // 重新生成卡片
    const allCards = document.querySelectorAll('.card');
    
    // 開始遊戲時先翻轉所有卡片到背面
    allCards.forEach(card => card.classList.add('flipped'));

    // 10秒後翻回正面並開始計時
    setTimeout(() => {
        allCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.remove('flipped');
            }, index * 100); // 依序翻轉
        });

        // 記錄開始時間
        startTime = new Date();
        startTimer();
        gameStarted = true;
    }, 10000);
}

// 開始計時器
function startTimer() {
    const timerElement = document.getElementById('timer');
    timerInterval = setInterval(() => {
        const elapsedTime = Math.floor((new Date() - startTime) / 1000);
        timerElement.textContent = `Elapsed Time: ${elapsedTime} seconds`;
    }, 1000);
}
// 開始計時
function startTimer() {
    startTime = new Date(); // 記錄開始時間
    timerInterval = setInterval(updateTimer, 1000); // 每秒更新一次
}
// 更新計時顯示
function updateTimer() {
    const currentTime = new Date();
    const elapsedTime = Math.floor((currentTime - startTime) / 1000); // 計算經過的秒數
    document.getElementById('timer').innerText = `Time: ${elapsedTime}s`; // 顯示計時
}
// 結束遊戲，顯示時間
function endGame() {
    clearInterval(timerInterval); // 停止計時
    const elapsedTime = Math.floor((new Date() - startTime) / 1000); // 計算遊戲耗時
    alert(`所用時間: ${elapsedTime} 秒`);
    
    // 遊戲結束後禁用卡片點擊
    document.querySelectorAll('.card').forEach(card => {
        card.removeEventListener('click', handleCardClick); // 移除點擊事件
    });
    gameStarted = false; // 禁止繼續翻牌
}
// 處理卡片點擊
function handleCardClick() {
    if (!gameStarted || flippedCards.length === 2 || this.classList.contains('flipped')) return;
    
    this.classList.add('flipped');
    flippedCards.push(this);

    if (flippedCards.length === 2) {
        checkMatch(); // 檢查是否匹配
    }
}
// 渲染卡片的函數，根據當前主題生成卡片
function renderCards() {
    container.innerHTML = ''; // 清空現有的卡片
    const shuffledCards = shuffle(getRepeatedCards(currentTheme)); // 打亂當前主題的卡片

    shuffledCards.forEach(card => {
        const newCard = createCard(card.front, card.back);
        container.appendChild(newCard);
    });
}
// 顯示所有卡片正面
function showAllFront() {
    flippingAllCards = true; // 設定為翻轉所有卡片狀態
    document.querySelectorAll('.card').forEach((card) => {
        card.classList.remove('flipped'); // 顯示正面
    });
    flippingAllCards = false; // 完成後取消翻轉狀態
}

// 顯示所有卡片背面
function showAllBack() {
    flippingAllCards = true; // 設定為翻轉所有卡片狀態
    document.querySelectorAll('.card').forEach((card, index) => {
        setTimeout(() => {
            card.classList.add('flipped'); // 依次顯示背面
        }, index * 300); // 每張卡片延遲翻轉，依次效果
    });
    flippingAllCards = false; // 完成後取消翻轉狀態
}
// 顯示正面按鈕
const showFrontButton = document.getElementById('show-front');
showFrontButton.addEventListener('click', showAllFront);

// 顯示背面按鈕
const showBackButton = document.getElementById('show-back');
showBackButton.addEventListener('click', showAllBack);
// 取得卡片容器
const container = document.querySelector('.cards-container');

// 取得按鈕
const startGameButton = document.getElementById('start-game');
const switchThemeButton = document.getElementById('switch-theme');

// 開始遊戲按鈕
startGameButton.addEventListener('click', startGame);

// 切換主題按鈕
switchThemeButton.addEventListener('click', () => {
    currentTheme = currentTheme === 'theme1' ? 'theme2' : 'theme1'; // 切換主題
    renderCards(); // 切換主題後重新渲染卡片
});
