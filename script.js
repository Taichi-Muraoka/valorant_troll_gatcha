// データを格納する変数
let agents = [];
let trollConditions = [];

// DOM要素
const startGachaBtn = document.getElementById('startGacha');
const showHowToBtn = document.getElementById('showHowTo');
const closeHowToBtn = document.getElementById('closeHowTo');
const executeGachaBtn = document.getElementById('executeGacha');
const saveImageBtn = document.getElementById('saveImage');
const retryGachaBtn = document.getElementById('retryGacha');

const setupSection = document.getElementById('setupSection');
const resultSection = document.getElementById('resultSection');
const howToSection = document.getElementById('howToSection');

// 初期化
document.addEventListener('DOMContentLoaded', async function() {
    await loadData();
    setupEventListeners();
});

// データ読み込み
async function loadData() {
    try {
        // エージェントデータの読み込み
        const agentResponse = await fetch('agent.csv');
        const agentText = await agentResponse.text();
        agents = agentText.trim().split('\n').filter(agent => agent.trim() !== '');

        // トロール条件データの読み込み
        const trollResponse = await fetch('troll.csv');
        const trollText = await trollResponse.text();
        const trollLines = trollText.trim().split('\n');
        
        // ヘッダー行をスキップして、すべての条件を配列に格納
        trollConditions = [];
        for (let i = 1; i < trollLines.length; i++) {
            const line = trollLines[i];
            const conditions = line.split(',');
            // 空でない条件のみを追加
            conditions.forEach(condition => {
                if (condition.trim() !== '') {
                    trollConditions.push(condition.trim());
                }
            });
        }

        console.log('データ読み込み完了:', agents.length, 'エージェント,', trollConditions.length, 'トロール条件');
    } catch (error) {
        console.error('データ読み込みエラー:', error);
        alert('データの読み込みに失敗しました。ページを再読み込みしてください。');
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    startGachaBtn.addEventListener('click', showSetupSection);
    showHowToBtn.addEventListener('click', showHowToSection);
    closeHowToBtn.addEventListener('click', hideHowToSection);
    executeGachaBtn.addEventListener('click', executeGacha);
    saveImageBtn.addEventListener('click', saveAsImage);
    retryGachaBtn.addEventListener('click', retryGacha);
}

// セットアップセクションを表示
function showSetupSection() {
    hideAllSections();
    setupSection.style.display = 'block';
    setupSection.classList.add('fade-in');
}

// 遊び方セクションを表示
function showHowToSection() {
    hideAllSections();
    howToSection.style.display = 'block';
    howToSection.classList.add('fade-in');
}

// 遊び方セクションを非表示
function hideHowToSection() {
    hideAllSections();
    showHeroSection();
}

// すべてのセクションを非表示
function hideAllSections() {
    setupSection.style.display = 'none';
    resultSection.style.display = 'none';
    howToSection.style.display = 'none';
    setupSection.classList.remove('fade-in');
    resultSection.classList.remove('fade-in');
    howToSection.classList.remove('fade-in');
}

// ヒーローセクションを表示
function showHeroSection() {
    const hero = document.querySelector('.hero');
    hero.style.display = 'block';
}

// ガチャ実行
function executeGacha() {
    // プレイヤー名の取得
    const playerNames = [];
    for (let i = 1; i <= 5; i++) {
        const playerName = document.getElementById(`player${i}`).value.trim();
        if (playerName === '') {
            alert(`プレイヤー${i}の名前を入力してください。`);
            return;
        }
        playerNames.push(playerName);
    }

    // トロール条件の数を取得
    const trollCount = parseInt(document.getElementById('trollCount').value);

    // エージェントのランダム選択（被りなし）
    const selectedAgents = shuffleArray([...agents]).slice(0, 5);

    // トロール条件をランダムなプレイヤーに紐づける
    const selectedTrolls = [];
    const availablePlayers = [...playerNames]; // プレイヤー名の配列をコピー
    
    for (let i = 0; i < trollCount; i++) {
        const randomTrollIndex = Math.floor(Math.random() * trollConditions.length);
        const randomPlayerIndex = Math.floor(Math.random() * availablePlayers.length);
        
        const troll = trollConditions[randomTrollIndex];
        const player = availablePlayers[randomPlayerIndex];
        
        selectedTrolls.push({
            player: player,
            condition: troll
        });
        
        // 同じプレイヤーが複数回選ばれる可能性があるので、プレイヤーは削除しない
    }

    // 結果を表示
    displayResults(playerNames, selectedAgents, selectedTrolls);
}

// 配列をシャッフルする関数
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// 結果を表示
function displayResults(playerNames, selectedAgents, selectedTrolls) {
    // チームメンバーの表示
    const teamMembersContainer = document.getElementById('teamMembers');
    teamMembersContainer.innerHTML = '';
    
    playerNames.forEach((playerName, index) => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'team-member';
        memberDiv.innerHTML = `
            <span class="player-name">${playerName}</span>
            <span class="agent-name">${selectedAgents[index]}</span>
        `;
        teamMembersContainer.appendChild(memberDiv);
    });

    // トロール条件の表示
    const trollConditionsContainer = document.getElementById('trollConditions');
    trollConditionsContainer.innerHTML = '';
    
    selectedTrolls.forEach((trollData, index) => {
        const trollDiv = document.createElement('div');
        trollDiv.className = 'troll-condition';
        trollDiv.innerHTML = `
            <div class="troll-player">${trollData.player}</div>
            <div class="troll-text">${trollData.condition}</div>
        `;
        trollConditionsContainer.appendChild(trollDiv);
    });

    // 結果セクションを表示
    hideAllSections();
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');
}

// 画像として保存
function saveAsImage() {
    // html2canvasライブラリを使用して画像化
    if (typeof html2canvas === 'undefined') {
        // html2canvasが読み込まれていない場合は、ライブラリを動的に読み込み
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js';
        script.onload = () => {
            captureAndSave();
        };
        document.head.appendChild(script);
    } else {
        captureAndSave();
    }
}

// キャプチャして保存
function captureAndSave() {
    const resultSection = document.getElementById('resultSection');
    
    // ボタンを一時的に非表示
    const buttons = resultSection.querySelector('.result-buttons');
    buttons.style.display = 'none';
    
    html2canvas(resultSection, {
        backgroundColor: '#0f1419',
        scale: 2,
        useCORS: true
    }).then(canvas => {
        // ボタンを再表示
        buttons.style.display = 'flex';
        
        // 画像をダウンロード
        const link = document.createElement('a');
        link.download = 'valorant-gacha-result.png';
        link.href = canvas.toDataURL();
        link.click();
    }).catch(error => {
        console.error('画像保存エラー:', error);
        alert('画像の保存に失敗しました。');
        buttons.style.display = 'flex';
    });
}

// もう一度ガチャを実行
function retryGacha() {
    // プレイヤー名は保持したまま、セットアップセクションに戻る
    showSetupSection();
}

// エラーハンドリング
window.addEventListener('error', function(e) {
    console.error('エラーが発生しました:', e.error);
});

// ページの読み込み完了時の処理
window.addEventListener('load', function() {
    console.log('ページ読み込み完了');
}); 