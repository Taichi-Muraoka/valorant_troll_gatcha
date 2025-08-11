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
const showTrollListBtn = document.getElementById('showTrollList');
const closeTrollListModalBtn = document.getElementById('closeTrollListModal');
const trollListModal = document.getElementById('trollListModal');

const setupSection = document.getElementById('setupSection');
const resultSection = document.getElementById('resultSection');
const howToSection = document.getElementById('howToSection');

// 初期化
document.addEventListener('DOMContentLoaded', async function() {
    console.log('DOM読み込み完了');
    await loadData();
    setupEventListeners();
});

// データ読み込み
async function loadData() {
    try {
        console.log('データ読み込み開始');
        
        // エージェントデータの読み込み
        const agentResponse = await fetch('agent.csv');
        const agentText = await agentResponse.text();
        const agentLines = agentText.trim().split('\n');
        
        console.log('エージェントCSV行数:', agentLines.length);
        
        // エージェント名と画像パスを分けて格納
        agents = [];
        agentLines.forEach((line, index) => {
            const parts = line.split(',');
            if (parts.length >= 2) {
                agents.push({
                    name: parts[0].trim(),
                    image: parts[1].trim()
                });
            } else {
                console.warn(`エージェント行${index + 1}の形式が不正:`, line);
            }
        });

        console.log('読み込まれたエージェント数:', agents.length);

        // トロール条件データの読み込み
        await loadTrollData();

        console.log('データ読み込み完了:', agents.length, 'エージェント,', trollConditions.length, 'トロール条件');
    } catch (error) {
        console.error('データ読み込みエラー:', error);
        alert('データの読み込みに失敗しました。ページを再読み込みしてください。');
    }
}

// トロールデータ読み込み（分離）
async function loadTrollData() {
    try {
        const trollResponse = await fetch('troll.csv');
        const trollText = await trollResponse.text();
        const trollLines = trollText.trim().split('\n');
        
        console.log('トロールCSV行数:', trollLines.length);
        
        // ヘッダー行からレアリティを取得
        const rarities = trollLines[0].split(',');
        console.log('レアリティ:', rarities);
        
        // データ行から条件を読み込み、レアリティと紐づける
        trollConditions = [];
        for (let i = 1; i < trollLines.length; i++) {
            const line = trollLines[i];
            const conditions = line.split(',');
            
            // 各列（レアリティ）の条件を処理
            for (let j = 0; j < conditions.length && j < rarities.length; j++) {
                const condition = conditions[j].trim();
                if (condition !== '') {
                    trollConditions.push({
                        condition: condition,
                        rarity: rarities[j]
                    });
                }
            }
        }
        
        console.log('トロール条件読み込み完了:', trollConditions.length, '件');
    } catch (error) {
        console.error('トロールデータ読み込みエラー:', error);
        throw error;
    }
}

// イベントリスナーの設定
function setupEventListeners() {
    console.log('イベントリスナー設定開始');
    
    if (startGachaBtn) {
        startGachaBtn.addEventListener('click', showSetupSection);
        console.log('startGachaBtn リスナー設定完了');
    } else {
        console.error('startGachaBtn が見つかりません');
    }
    
    if (showHowToBtn) {
        showHowToBtn.addEventListener('click', showHowToSection);
        console.log('showHowToBtn リスナー設定完了');
    } else {
        console.error('showHowToBtn が見つかりません');
    }
    
    if (closeHowToBtn) {
        closeHowToBtn.addEventListener('click', hideHowToSection);
        console.log('closeHowToBtn リスナー設定完了');
    } else {
        console.error('closeHowToBtn が見つかりません');
    }
    
    if (executeGachaBtn) {
        executeGachaBtn.addEventListener('click', executeGacha);
        console.log('executeGachaBtn リスナー設定完了');
    } else {
        console.error('executeGachaBtn が見つかりません');
    }
    
    if (saveImageBtn) {
        saveImageBtn.addEventListener('click', saveAsImage);
        console.log('saveImageBtn リスナー設定完了');
    } else {
        console.error('saveImageBtn が見つかりません');
    }
    
    if (retryGachaBtn) {
        retryGachaBtn.addEventListener('click', retryGacha);
        console.log('retryGachaBtn リスナー設定完了');
    } else {
        console.error('retryGachaBtn が見つかりません');
    }
    
    // トロール一覧モーダルのイベントリスナー
    if (showTrollListBtn) {
        showTrollListBtn.addEventListener('click', showTrollListModal);
        console.log('showTrollListBtn リスナー設定完了');
    } else {
        console.error('showTrollListBtn が見つかりません');
    }
    
    if (closeTrollListModalBtn) {
        closeTrollListModalBtn.addEventListener('click', hideTrollListModal);
        console.log('closeTrollListModalBtn リスナー設定完了');
    } else {
        console.error('closeTrollListModalBtn が見つかりません');
    }
    
    // モーダル外クリックで閉じる
    if (trollListModal) {
        trollListModal.addEventListener('click', function(e) {
            if (e.target === trollListModal) {
                hideTrollListModal();
            }
        });
    }
    
    console.log('イベントリスナー設定完了');
}

// セットアップセクションを表示
function showSetupSection() {
    console.log('セットアップセクション表示');
    hideAllSections();
    setupSection.style.display = 'block';
    setupSection.classList.add('fade-in');
}

// 遊び方セクションを表示
function showHowToSection() {
    console.log('遊び方セクション表示');
    hideAllSections();
    howToSection.style.display = 'block';
    howToSection.classList.add('fade-in');
}

// 遊び方セクションを非表示
function hideHowToSection() {
    console.log('遊び方セクション非表示');
    hideAllSections();
    showHeroSection();
}

// すべてのセクションを非表示
function hideAllSections() {
    console.log('全セクション非表示');
    setupSection.style.display = 'none';
    resultSection.style.display = 'none';
    howToSection.style.display = 'none';
    setupSection.classList.remove('fade-in');
    resultSection.classList.remove('fade-in');
    howToSection.classList.remove('fade-in');
}

// ヒーローセクションを表示
function showHeroSection() {
    console.log('ヒーローセクション表示');
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.style.display = 'block';
    }
}

// トロール一覧モーダルを表示
async function showTrollListModal() {
    console.log('トロール一覧モーダル表示');
    const modal = document.getElementById('trollListModal');
    const container = document.getElementById('trollListContainer');
    
    if (modal && container) {
        try {
            // ローディング表示
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #a0aec0;">読み込み中...</div>';
            
            // モーダルを表示
            modal.style.display = 'flex';
            setTimeout(() => {
                modal.classList.add('show');
            }, 10);
            
            // トロールデータを再読み込み
            console.log('トロールデータを再読み込み中...');
            await loadTrollData();
            
            // トロール一覧を生成
            generateTrollList(container);
            
            console.log('トロール一覧更新完了');
        } catch (error) {
            console.error('トロール一覧更新エラー:', error);
            container.innerHTML = '<div style="text-align: center; padding: 40px; color: #ff4655;">データの読み込みに失敗しました。</div>';
        }
    }
}

// トロール一覧モーダルを非表示
function hideTrollListModal() {
    console.log('トロール一覧モーダル非表示');
    const modal = document.getElementById('trollListModal');
    
    if (modal) {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
        }, 300);
    }
}

// トロール一覧を生成
function generateTrollList(container) {
    // レアリティごとにトロール条件をグループ化
    const rarityGroups = {};
    
    trollConditions.forEach(troll => {
        if (!rarityGroups[troll.rarity]) {
            rarityGroups[troll.rarity] = [];
        }
        rarityGroups[troll.rarity].push(troll.condition);
    });
    
    // HTMLを生成
    container.innerHTML = '';
    
    Object.keys(rarityGroups).forEach(rarity => {
        const conditions = rarityGroups[rarity];
        const rarityClass = getRarityClassForModal(rarity);
        
        console.log(`レアリティ: ${rarity}, クラス: ${rarityClass}`);
        
        const sectionDiv = document.createElement('div');
        sectionDiv.className = `rarity-section ${rarityClass}`;
        
        const titleDiv = document.createElement('div');
        titleDiv.className = 'rarity-section-title';
        titleDiv.textContent = rarity;
        
        const listDiv = document.createElement('div');
        listDiv.className = 'troll-list';
        
        conditions.forEach(condition => {
            const itemDiv = document.createElement('div');
            itemDiv.className = `troll-item ${rarityClass}`;
            itemDiv.innerHTML = `<div class="troll-item-text">${condition}</div>`;
            listDiv.appendChild(itemDiv);
        });
        
        sectionDiv.appendChild(titleDiv);
        sectionDiv.appendChild(listDiv);
        container.appendChild(sectionDiv);
        
        // レジェンドの場合、特別なログを出力
        if (rarity === 'レジェンド') {
            console.log('レジェンドセクション作成:', sectionDiv.className);
            console.log('レジェンドタイトル作成:', titleDiv.className);
            console.log('レジェンドアイテム数:', conditions.length);
        }
    });
    
    console.log('トロール一覧生成完了:', Object.keys(rarityGroups).length, 'レアリティ');
}

// モーダル用のレアリティクラス名を取得
function getRarityClassForModal(rarity) {
    switch (rarity) {
        case 'ノーマル':
            return 'normal';
        case 'レア':
            return 'rare';
        case 'スーパーレア':
            return 'super-rare';
        case 'ウルトラレア':
            return 'ultra-rare';
        case 'レジェンド':
            return 'legend';
        default:
            return 'normal';
    }
}

// ガチャ実行
function executeGacha() {
    console.log('ガチャ実行開始');
    
    // プレイヤー名の取得
    const playerNames = [];
    for (let i = 1; i <= 5; i++) {
        const playerInput = document.getElementById(`player${i}`);
        if (playerInput) {
            const playerName = playerInput.value.trim();
            if (playerName === '') {
                alert(`プレイヤー${i}の名前を入力してください。`);
                return;
            }
            playerNames.push(playerName);
        } else {
            console.error(`player${i} の要素が見つかりません`);
            return;
        }
    }

    console.log('プレイヤー名:', playerNames);

    // トロール条件の数を取得
    const trollCountSelect = document.getElementById('trollCount');
    if (!trollCountSelect) {
        console.error('trollCount の要素が見つかりません');
        return;
    }
    const trollCount = parseInt(trollCountSelect.value);
    console.log('トロール条件数:', trollCount);

    // エージェントのランダム選択（被りなし）
    const selectedAgents = shuffleArray([...agents]).slice(0, 5);
    console.log('選択されたエージェント:', selectedAgents);

    // トロール条件をランダムなプレイヤーに紐づける
    const selectedTrolls = [];
    const availablePlayers = [...playerNames]; // プレイヤー名の配列をコピー
    
    for (let i = 0; i < trollCount; i++) {
        const randomTrollIndex = Math.floor(Math.random() * trollConditions.length);
        const randomPlayerIndex = Math.floor(Math.random() * availablePlayers.length);
        
        const trollData = trollConditions[randomTrollIndex];
        const player = availablePlayers[randomPlayerIndex];
        
        selectedTrolls.push({
            player: player,
            condition: trollData.condition,
            rarity: trollData.rarity
        });
        
        // 同じプレイヤーが複数回選ばれる可能性があるので、プレイヤーは削除しない
    }

    console.log('選択されたトロール条件:', selectedTrolls);

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

// レアリティに応じたクラス名を取得
function getRarityClass(rarity) {
    switch (rarity) {
        case 'ノーマル':
            return 'rarity-normal';
        case 'レア':
            return 'rarity-rare';
        case 'スーパーレア':
            return 'rarity-super-rare';
        case 'ウルトラレア':
            return 'rarity-ultra-rare';
        case 'レジェンド':
            return 'rarity-legend';
        default:
            return 'rarity-normal';
    }
}

// 結果を表示
function displayResults(playerNames, selectedAgents, selectedTrolls) {
    console.log('結果表示開始');
    
    // チームメンバーの表示
    const teamMembersContainer = document.getElementById('teamMembers');
    if (!teamMembersContainer) {
        console.error('teamMembers の要素が見つかりません');
        return;
    }
    
    teamMembersContainer.innerHTML = '';
    
    playerNames.forEach((playerName, index) => {
        const memberDiv = document.createElement('div');
        memberDiv.className = 'team-member';
        memberDiv.innerHTML = `
            <div class="player-info">
                <span class="player-name">${playerName}</span>
            </div>
            <div class="agent-info">
                <img src="${selectedAgents[index].image}" alt="${selectedAgents[index].name}" class="agent-image" onerror="this.style.display='none'">
                <span class="agent-name">${selectedAgents[index].name}</span>
            </div>
        `;
        teamMembersContainer.appendChild(memberDiv);
    });

    // トロール条件の表示
    const trollConditionsContainer = document.getElementById('trollConditions');
    if (!trollConditionsContainer) {
        console.error('trollConditions の要素が見つかりません');
        return;
    }
    
    trollConditionsContainer.innerHTML = '';
    
    selectedTrolls.forEach((trollData, index) => {
        const trollDiv = document.createElement('div');
        trollDiv.className = `troll-condition ${getRarityClass(trollData.rarity)}`;
        trollDiv.innerHTML = `
            <div class="troll-header">
                <div class="troll-player">${trollData.player}</div>
                <div class="troll-rarity">${trollData.rarity}</div>
            </div>
            <div class="troll-text">${trollData.condition}</div>
        `;
        trollConditionsContainer.appendChild(trollDiv);
    });

    // 結果セクションを表示
    hideAllSections();
    resultSection.style.display = 'block';
    resultSection.classList.add('fade-in');
    
    console.log('結果表示完了');
}

// 画像として保存
function saveAsImage() {
    console.log('画像保存開始');
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
    console.log('ガチャ再実行');
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