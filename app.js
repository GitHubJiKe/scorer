// 全局变量
let currentSport = '';
let currentSet = 1;
let scores = [0, 0]; // [player1, player2]
let setScores = [0, 0]; // [player1, player2]
let currentTheme = 'black-white';
let autoMatchPoint = true;
let segmentSettings = [11, 21, 31]; // 默认分段设置
let playerNames = ['运动员1', '运动员2']; // 默认运动员姓名

// 触摸相关变量
let touchStartY = 0;
let touchStartX = 0;
let touchStartTime = 0;
let isTouchActive = false;

// 运动规则配置
const sportRules = {
    pingpong: {
        name: '乒乓球',
        winningScore: 11,
        minLead: 2,
        maxSets: 5
    },
    badminton: {
        name: '羽毛球',
        winningScore: 21,
        minLead: 2,
        maxSets: 3
    }
};

// DOM元素变量声明
let sportSelection, scorerPage, sportCards, backBtn, sportTitle, themeToggle;
let settingsBtn, settingsModal, closeSettings, themeOptions, autoMatchPointCheckbox;
let nextSetBtn, resetBtn, player1NameInput, player2NameInput;
let player1Display, player2Display, score1Display, score2Display;
let sets1Display, sets2Display, currentSetDisplay;
let segment1Input, segment2Input, segment3Input;
let player1Area, player2Area;
let player1MatchPoint, player2MatchPoint;
let fullscreenToggle, fullscreenExitBtn;

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM加载完成，开始初始化...');
    initializeApp();
});

function initializeApp() {
    // 获取DOM元素
    getDOMElements();
    
    // 检查必要元素是否存在
    if (!validateElements()) {
        console.error('关键DOM元素未找到，初始化失败');
        return;
    }
    
    // 绑定事件监听器
    bindEventListeners();
    
    // 加载保存的设置
    loadSettings();
    
    // 应用当前主题
    applyTheme(currentTheme);
    
    // 初始化分段设置
    initializeSegmentSettings();
    
    // 初始化运动员姓名
    initializePlayerNames();
    
    console.log('应用初始化完成');
}

function getDOMElements() {
    // 获取所有必要的DOM元素
    sportSelection = document.getElementById('sportSelection');
    scorerPage = document.getElementById('scorerPage');
    sportCards = document.querySelectorAll('.sport-card');
    backBtn = document.getElementById('backBtn');
    sportTitle = document.getElementById('sportTitle');
    themeToggle = document.getElementById('themeToggle');
    fullscreenToggle = document.getElementById('fullscreenToggle');
    fullscreenExitBtn = document.getElementById('fullscreenExitBtn');
    settingsBtn = document.getElementById('settingsBtn');
    settingsModal = document.getElementById('settingsModal');
    closeSettings = document.getElementById('closeSettings');
    themeOptions = document.querySelectorAll('.theme-option');
    autoMatchPointCheckbox = document.getElementById('autoMatchPoint');
    nextSetBtn = document.getElementById('nextSetBtn');
    resetBtn = document.getElementById('resetBtn');
    player1NameInput = document.getElementById('player1Name');
    player2NameInput = document.getElementById('player2Name');
    player1Display = document.getElementById('player1Display');
    player2Display = document.getElementById('player2Display');
    score1Display = document.getElementById('score1');
    score2Display = document.getElementById('score2');
    sets1Display = document.getElementById('sets1');
    sets2Display = document.getElementById('sets2');
    currentSetDisplay = document.getElementById('currentSet');
    segment1Input = document.getElementById('segment1');
    segment2Input = document.getElementById('segment2');
    segment3Input = document.getElementById('segment3');
    player1Area = document.querySelector('.player.player1');
    player2Area = document.querySelector('.player.player2');
    player1MatchPoint = document.getElementById('player1MatchPoint');
    player2MatchPoint = document.getElementById('player2MatchPoint');
    
    console.log('DOM元素获取完成');
    console.log('运动卡片数量:', sportCards.length);
    console.log('运动选择页面:', sportSelection);
    console.log('计分器页面:', scorerPage);
}

function validateElements() {
    const requiredElements = [
        sportSelection, scorerPage, sportCards.length > 0, backBtn, sportTitle
    ];
    
    return requiredElements.every(element => element !== null && element !== undefined);
}

function bindEventListeners() {
    console.log('开始绑定事件监听器...');
    
    // 运动选择
    if (sportCards && sportCards.length > 0) {
        sportCards.forEach((card, index) => {
            console.log(`绑定运动卡片 ${index}:`, card.dataset.sport);
            card.addEventListener('click', function() {
                console.log('点击了运动卡片:', this.dataset.sport);
                selectSport(this.dataset.sport);
            });
        });
    }
    
    // 返回按钮
    if (backBtn) {
        backBtn.addEventListener('click', goBackToSelection);
    }
    
    // 主题切换
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // 全屏切换
    if (fullscreenToggle) {
        fullscreenToggle.addEventListener('click', toggleFullscreen);
    }
    
    // 全屏退出按钮
    if (fullscreenExitBtn) {
        fullscreenExitBtn.addEventListener('click', exitFullscreen);
    }
    
    // 监听全屏状态变化
    document.addEventListener('fullscreenchange', updateFullscreenUI);
    document.addEventListener('webkitfullscreenchange', updateFullscreenUI);
    document.addEventListener('msfullscreenchange', updateFullscreenUI);
    
    // 设置按钮
    if (settingsBtn) {
        settingsBtn.addEventListener('click', openSettings);
    }
    
    if (closeSettings) {
        closeSettings.addEventListener('click', closeSettingsModal);
    }
    
    // 主题选项
    if (themeOptions && themeOptions.length > 0) {
        themeOptions.forEach(option => {
            option.addEventListener('click', () => selectTheme(option.dataset.theme));
        });
    }
    
    // 自动赛点提示
    if (autoMatchPointCheckbox) {
        autoMatchPointCheckbox.addEventListener('change', (e) => {
            autoMatchPoint = e.target.checked;
            saveSettings();
        });
    }
    
    // 运动员姓名输入
    if (player1NameInput) {
        player1NameInput.addEventListener('input', updatePlayerNames);
    }
    if (player2NameInput) {
        player2NameInput.addEventListener('input', updatePlayerNames);
    }
    
    // 分段设置输入
    if (segment1Input) {
        segment1Input.addEventListener('change', updateSegmentSettings);
    }
    if (segment2Input) {
        segment2Input.addEventListener('change', updateSegmentSettings);
    }
    if (segment3Input) {
        segment3Input.addEventListener('change', updateSegmentSettings);
    }
    
    // 局数控制
    if (nextSetBtn) {
        nextSetBtn.addEventListener('click', nextSet);
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', resetMatch);
    }
    
    // 点击模态框外部关闭
    window.addEventListener('click', (e) => {
        if (settingsModal && e.target === settingsModal) {
            closeSettingsModal();
        }
    });
    
    // 触摸事件支持
    setupTouchEvents();
    
    console.log('事件监听器绑定完成');
}

function setupTouchEvents() {
    // 触摸开始
    document.addEventListener('touchstart', function(e) {
        // 防止双击缩放和页面滚动
        if (e.touches.length > 1) {
            e.preventDefault();
            return;
        }
        
        touchStartY = e.touches[0].clientY;
        touchStartX = e.touches[0].clientX;
        touchStartTime = Date.now();
        isTouchActive = true;
    }, { passive: false });
    
    // 触摸移动
    document.addEventListener('touchmove', function(e) {
        // 防止双指缩放和页面滚动
        if (e.touches.length > 1) {
            e.preventDefault();
            return;
        }
        
        // 防止Y轴滚动
        e.preventDefault();
    }, { passive: false });
    
    // 触摸结束
    document.addEventListener('touchend', function(e) {
        if (!isTouchActive || currentSport === '') return;
        
        const touchEndY = e.changedTouches[0].clientY;
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndTime = Date.now();
        const deltaY = touchStartY - touchEndY;
        const deltaX = touchStartX - touchEndX;
        const touchDuration = touchEndTime - touchStartTime;
        
        // 检查触摸时长，避免误触
        if (touchDuration < 100 || touchDuration > 1000) return;
        
        // 垂直滑动计分 - 两个运动员都使用上划手势
        if (Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 50) {
            if (deltaY > 0) {
                // 向上滑动，根据触摸的得分板区域判断是哪个运动员
                const touchElement = document.elementFromPoint(touchStartX, touchStartY);
                const playerArea = touchElement ? touchElement.closest('.player') : null;
                
                if (playerArea) {
                    if (playerArea.classList.contains('player1')) {
                        // 在运动员1得分板上划，运动员1得分
                        addScore(1, 1);
                    } else if (playerArea.classList.contains('player2')) {
                        // 在运动员2得分板上划，运动员2得分
                        addScore(2, 1);
                    }
                }
            }
        }
        
        // 水平滑动切换局数
        if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 100) {
            if (deltaX > 0) {
                // 向左滑动，下一局
                nextSet();
            } else {
                // 向右滑动，重置
                resetMatch();
            }
        }
        
        isTouchActive = false;
    });
    
    // 触摸取消
    document.addEventListener('touchcancel', function() {
        isTouchActive = false;
    });
    
    // 防止双击缩放
    document.addEventListener('dblclick', function(e) {
        e.preventDefault();
    });
    
    // 防止手势缩放
    document.addEventListener('gesturestart', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gesturechange', function(e) {
        e.preventDefault();
    });
    
    document.addEventListener('gestureend', function(e) {
        e.preventDefault();
    });
    
    // 鼠标事件支持（桌面端）
    if (player1Area) {
        player1Area.addEventListener('click', function() {
            if (currentSport !== '') {
                addScore(1, 1);
            }
        });
    }
    
    if (player2Area) {
        player2Area.addEventListener('click', function() {
            if (currentSport !== '') {
                addScore(2, 1);
            }
        });
    }
}

function initializeSegmentSettings() {
    if (segment1Input && segment2Input && segment3Input) {
        segment1Input.value = segmentSettings[0];
        segment2Input.value = segmentSettings[1];
        segment3Input.value = segmentSettings[2];
    }
}

function initializePlayerNames() {
    if (player1NameInput && player2NameInput) {
        player1NameInput.value = playerNames[0];
        player2NameInput.value = playerNames[1];
    }
    updatePlayerDisplay();
}

function updateSegmentSettings() {
    if (segment1Input && segment2Input && segment3Input) {
        segmentSettings[0] = parseInt(segment1Input.value) || 11;
        segmentSettings[1] = parseInt(segment2Input.value) || 21;
        segmentSettings[2] = parseInt(segment3Input.value) || 31;
        saveSettings();
        console.log('分段设置已更新:', segmentSettings);
    }
}

function updatePlayerNames() {
    if (player1NameInput && player2NameInput) {
        playerNames[0] = player1NameInput.value.trim() || '运动员1';
        playerNames[1] = player2NameInput.value.trim() || '运动员2';
        updatePlayerDisplay();
        saveSettings();
        console.log('运动员姓名已更新:', playerNames);
    }
}

function updatePlayerDisplay() {
    if (player1Display) player1Display.textContent = playerNames[0];
    if (player2Display) player2Display.textContent = playerNames[1];
}

function selectSport(sport) {
    currentSport = sport;
    const sportInfo = sportRules[sport];
    
    // 更新标题
    if (sportTitle) {
        sportTitle.textContent = `${sportInfo.name}计分器`;
    }
    
    // 根据运动类型设置默认分段
    if (sport === 'pingpong') {
        segmentSettings = [11, 21, 31];
    } else if (sport === 'badminton') {
        segmentSettings = [21, 42, 63];
    }
    
    // 更新分段设置输入框
    if (segment1Input && segment2Input && segment3Input) {
        segment1Input.value = segmentSettings[0];
        segment2Input.value = segmentSettings[1];
        segment3Input.value = segmentSettings[2];
    }
    
    // 页面切换动画：运动选择页面向左滑出，计分器页面从右侧滑入
    if (sportSelection) {
        sportSelection.classList.add('slide-out');
        setTimeout(() => {
            sportSelection.classList.remove('active', 'slide-out');
        }, 300);
    }
    
    if (scorerPage) {
        setTimeout(() => {
            scorerPage.classList.add('active');
        }, 300);
    }
    
    // 重置比赛
    resetMatch();
}

function goBackToSelection() {
    // 页面切换动画：计分器页面向右滑出，运动选择页面从左侧滑入
    if (scorerPage) {
        scorerPage.classList.remove('active');
    }
    
    if (sportSelection) {
        setTimeout(() => {
            sportSelection.classList.add('active');
        }, 100);
    }
    
    currentSport = '';
}

function addScore(playerIndex, points) {
    if (currentSport === '') return;
    
    // 添加分数
    scores[playerIndex - 1] += points;
    
    // 更新显示
    updateScoreDisplay();
    
    // 检查是否获胜
    checkWinCondition(playerIndex - 1);
    
    // 检查赛点
    if (autoMatchPoint) {
        checkMatchPoint();
    }
}

function updateScoreDisplay() {
    if (score1Display) score1Display.textContent = scores[0];
    if (score2Display) score2Display.textContent = scores[1];
}

function checkWinCondition(playerIndex) {
    const opponentIndex = playerIndex === 0 ? 1 : 0;
    const sportInfo = sportRules[currentSport];
    
    // 检查是否达到获胜分数
    if (scores[playerIndex] >= sportInfo.winningScore) {
        // 检查是否领先足够分数
        if (scores[playerIndex] - scores[opponentIndex] >= sportInfo.minLead) {
            // 获胜，增加局数
            setScores[playerIndex]++;
            updateSetDisplay();
            
            // 检查是否赢得比赛
            if (setScores[playerIndex] > Math.floor(sportInfo.maxSets / 2)) {
                showWinner(playerIndex);
                return;
            }
            
            // 进入下一局
            nextSet();
        }
    }
}

function checkMatchPoint() {
    const sportInfo = sportRules[currentSport];
    const player1Score = scores[0];
    const player2Score = scores[1];
    
    // 检查赛点条件
    if (player1Score >= sportInfo.winningScore - 1 && 
        player1Score - player2Score >= sportInfo.minLead - 1) {
        showMatchPoint(1);
    } else if (player2Score >= sportInfo.winningScore - 1 && 
               player2Score - player1Score >= sportInfo.minLead - 1) {
        showMatchPoint(2);
    } else {
        hideMatchPoint();
    }
}

function showMatchPoint(playerNumber) {
    const matchPointElement = playerNumber === 1 ? player1MatchPoint : player2MatchPoint;
    if (matchPointElement) {
        matchPointElement.style.display = 'flex';
        // 保持原有的HTML结构，只显示"赛点"和烟花emoji
        const textSpan = matchPointElement.querySelector('.match-point-text');
        if (textSpan) {
            textSpan.textContent = '赛点';
        }
    }
}

function hideMatchPoint() {
    if (player1MatchPoint) player1MatchPoint.style.display = 'none';
    if (player2MatchPoint) player2MatchPoint.style.display = 'none';
}

function nextSet() {
    currentSet++;
    scores = [0, 0];
    updateScoreDisplay();
    updateCurrentSetDisplay();
    hideMatchPoint();
}

function resetMatch() {
    currentSet = 1;
    scores = [0, 0];
    setScores = [0, 0];
    updateScoreDisplay();
    updateSetDisplay();
    updateCurrentSetDisplay();
    hideMatchPoint();
}

function updateSetDisplay() {
    if (sets1Display) sets1Display.textContent = setScores[0];
    if (sets2Display) sets2Display.textContent = setScores[1];
}

function updateCurrentSetDisplay() {
    if (currentSetDisplay) {
        currentSetDisplay.textContent = `第${currentSet}局`;
    }
}

function showWinner(playerIndex) {
    const playerName = playerIndex === 0 ? player1Display.textContent : player2Display.textContent;
    setTimeout(() => {
        alert(`恭喜！${playerName}获得比赛胜利！`);
        resetMatch();
    }, 100);
}

function toggleTheme() {
    const newTheme = currentTheme === 'black-white' ? 'red-blue' : 'black-white';
    selectTheme(newTheme);
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        // 进入全屏
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen();
        } else if (document.documentElement.webkitRequestFullscreen) {
            document.documentElement.webkitRequestFullscreen();
        } else if (document.documentElement.msRequestFullscreen) {
            document.documentElement.msRequestFullscreen();
        }
    } else {
        // 退出全屏
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
        }
    }
}

function exitFullscreen() {
    if (document.exitFullscreen) {
        document.exitFullscreen();
    } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
    }
}

function updateFullscreenUI() {
    const isFullscreen = document.fullscreenElement || 
                       document.webkitFullscreenElement || 
                       document.msFullscreenElement;
    
    // 更新全屏按钮状态
    if (fullscreenToggle) {
        if (isFullscreen) {
            fullscreenToggle.textContent = '⛶';
            fullscreenToggle.title = '退出全屏';
        } else {
            fullscreenToggle.textContent = '⛶';
            fullscreenToggle.title = '进入全屏';
        }
    }
    
    // 控制全屏退出按钮显示
    if (fullscreenExitBtn) {
        fullscreenExitBtn.style.display = isFullscreen ? 'flex' : 'none';
    }
    
    // 切换页面布局模式
    if (scorerPage) {
        if (isFullscreen) {
            scorerPage.classList.add('fullscreen-mode');
        } else {
            scorerPage.classList.remove('fullscreen-mode');
        }
    }
}

function selectTheme(theme) {
    currentTheme = theme;
    
    // 更新主题选项状态
    if (themeOptions) {
        themeOptions.forEach(option => {
            option.classList.toggle('active', option.dataset.theme === theme);
        });
    }
    
    // 应用主题
    applyTheme(theme);
    
    // 保存设置
    saveSettings();
}

function applyTheme(theme) {
    if (document.body) {
        document.body.className = theme === 'red-blue' ? 'theme-red-blue' : '';
    }
}

function openSettings() {
    if (settingsModal) {
        settingsModal.style.display = 'block';
    }
}

function closeSettingsModal() {
    if (settingsModal) {
        settingsModal.style.display = 'none';
    }
}

function saveSettings() {
    const settings = {
        theme: currentTheme,
        autoMatchPoint: autoMatchPoint,
        segmentSettings: segmentSettings,
        playerNames: playerNames
    };
    localStorage.setItem('scorerSettings', JSON.stringify(settings));
}

function loadSettings() {
    const savedSettings = localStorage.getItem('scorerSettings');
    if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        currentTheme = settings.theme || 'black-white';
        autoMatchPoint = settings.autoMatchPoint !== undefined ? settings.autoMatchPoint : true;
        segmentSettings = settings.segmentSettings || [11, 21, 31]; // 加载分段设置
        playerNames = settings.playerNames || ['运动员1', '运动员2']; // 加载运动员姓名
        
        // 应用设置
        applyTheme(currentTheme);
        if (autoMatchPointCheckbox) {
            autoMatchPointCheckbox.checked = autoMatchPoint;
        }
        
        // 更新主题选项状态
        if (themeOptions) {
            themeOptions.forEach(option => {
                option.classList.toggle('active', option.dataset.theme === currentTheme);
            });
        }

        // 更新分段设置输入框
        if (segment1Input && segment2Input && segment3Input) {
            segment1Input.value = segmentSettings[0];
            segment2Input.value = segmentSettings[1];
            segment3Input.value = segmentSettings[2];
        }

        // 更新运动员姓名输入框
        if (player1NameInput && player2NameInput) {
            player1NameInput.value = playerNames[0];
            player2NameInput.value = playerNames[1];
        }
        updatePlayerDisplay(); // 确保显示也更新
    }
}

// 键盘快捷键支持
document.addEventListener('keydown', function(e) {
    if (currentSport === '') return;
    
    switch(e.key) {
        case 'n':
            nextSet();
            break;
        case 'r':
            resetMatch();
            break;
        case 'Escape':
            if (settingsModal && settingsModal.style.display === 'block') {
                closeSettingsModal();
            }
            break;
    }
});
