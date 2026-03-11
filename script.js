// 音声管理クラス
class SoundManager {
    constructor() {
        this.sounds = {};
        this.audioContext = null;
        this.enabled = true;
        this.initAudioContext();
    }

    initAudioContext() {
        try {
            window.AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = new AudioContext();
        } catch (e) {
            console.warn('Web Audio API not supported');
            this.enabled = false;
        }
    }

    // シンプルなクリック音を生成
    playClick() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = 800;
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0.3, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (e) {
            console.warn('Error playing click sound:', e);
        }
    }

    // 成功音を生成
    playSuccess() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const notes = [523, 659, 784]; // C, E, G
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.2);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.2);
                }, index * 100);
            });
        } catch (e) {
            console.warn('Error playing success sound:', e);
        }
    }

    // レベルアップ音を生成
    playLevelUp() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const notes = [523, 659, 784, 1047]; // C, E, G, C (high)
            notes.forEach((freq, index) => {
                setTimeout(() => {
                    const oscillator = this.audioContext.createOscillator();
                    const gainNode = this.audioContext.createGain();
                    
                    oscillator.connect(gainNode);
                    gainNode.connect(this.audioContext.destination);
                    
                    oscillator.frequency.value = freq;
                    oscillator.type = 'sine';
                    
                    gainNode.gain.setValueAtTime(0.25, this.audioContext.currentTime);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.3);
                    
                    oscillator.start(this.audioContext.currentTime);
                    oscillator.stop(this.audioContext.currentTime + 0.3);
                }, index * 150);
            });
        } catch (e) {
            console.warn('Error playing level up sound:', e);
        }
    }

    // 削除音を生成
    playDelete() {
        if (!this.enabled || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.value = 200;
            oscillator.type = 'sawtooth';
            
            gainNode.gain.setValueAtTime(0.2, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.15);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.15);
        } catch (e) {
            console.warn('Error playing delete sound:', e);
        }
    }

    toggle() {
        this.enabled = !this.enabled;
        return this.enabled;
    }
}

// デフォルトタスクタイプ
const DEFAULT_TASK_TYPES = {
    study: { name: '勉強', icon: '📚' },
    work: { name: '仕事', icon: '💼' },
    exercise: { name: '運動', icon: '🏃' },
    creative: { name: '創作', icon: '🎨' },
    social: { name: '社交', icon: '👥' },
    daily: { name: '生活', icon: '🏠' }
};

// デフォルト経験値設定
const DEFAULT_EXP_GAINS = {
    study: { playerExp: 15, parameters: { 知力: 35, 魅力: 5 } },
    work: { playerExp: 20, parameters: { 財力: 25, 知力: 15, 社交力: 10 } },
    exercise: { playerExp: 18, parameters: { 体力: 40, 魅力: 10 } },
    creative: { playerExp: 16, parameters: { 創造力: 35, 魅力: 15 } },
    social: { playerExp: 14, parameters: { 社交力: 35, 魅力: 20 } },
    daily: { playerExp: 10, parameters: { 体力: 10, 財力: 10 } }
};

// ゲームデータ管理
class GameData {
    constructor() {
        this.loadData();
    }

    loadData() {
        const savedData = localStorage.getItem('rpgTaskData');
        if (savedData) {
            const data = JSON.parse(savedData);
            this.playerLevel = data.playerLevel || 1;
            this.playerExp = data.playerExp || 0;
            this.parameters = data.parameters || {}; // 空に設定
            this.tasks = data.tasks || [];
            this.taskTypes = data.taskTypes || {}; // 空に設定
            this.expGains = data.expGains || { ...DEFAULT_EXP_GAINS };
        } else {
            this.resetData();
        }
    }

    resetData() {
        this.playerLevel = 1;
        this.playerExp = 0;
        this.parameters = {}; // 初期状態は空
        this.tasks = [];
        this.taskTypes = {}; // 初期状態は空
        this.expGains = { ...DEFAULT_EXP_GAINS };
    }

    saveData() {
        const data = {
            playerLevel: this.playerLevel,
            playerExp: this.playerExp,
            parameters: this.parameters,
            tasks: this.tasks,
            taskTypes: this.taskTypes,
            expGains: this.expGains
        };
        localStorage.setItem('rpgTaskData', JSON.stringify(data));
    }

    addTask(task) {
        const newTask = {
            id: Date.now(),
            name: task.name,
            type: task.type,
            completed: false,
            createdAt: new Date().toISOString()
        };
        this.tasks.push(newTask);
        this.saveData();
        return newTask;
    }

    completeTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task && !task.completed) {
            task.completed = true;
            task.completedAt = new Date().toISOString();
            
            // タスクタイプに応じた経験値付与
            const expGains = this.getExpGains(task.type);
            console.log('タスクタイプ:', task.type);
            console.log('獲得経験値:', expGains);
            
            const levelUps = [];
            
            // プレイヤー経験値
            const playerLeveledUp = this.addPlayerExp(expGains.playerExp);
            if (playerLeveledUp) {
                levelUps.push({ name: 'プレイヤーレベル', newLevel: this.playerLevel });
            }
            
            // 各パラメーターの経験値
            for (const [paramName, expGain] of Object.entries(expGains.parameters)) {
                console.log(`${paramName}に${expGain}経験値追加`);
                const levelUp = this.addParameterExp(paramName, expGain);
                if (levelUp) {
                    levelUps.push({ name: paramName, newLevel: levelUp });
                }
            }
            
            this.saveData();
            return { task, levelUps };
        }
        return null;
    }

    getExpGains(taskType) {
        return this.expGains[taskType] || { 
            playerExp: 10, 
            parameters: {} 
        };
    }

    addTaskType(typeId, name, icon) {
        if (this.taskTypes[typeId]) {
            return false; // 既に存在
        }
        
        this.taskTypes[typeId] = { name, icon };
        
        // 新しいタスクタイプの経験値設定を自動生成
        this.expGains[typeId] = {
            playerExp: 12,
            parameters: this.generateDefaultExpGains()
        };
        
        this.saveData();
        return true;
    }

    generateDefaultExpGains() {
        const gains = {};
        const paramNames = Object.keys(this.parameters);
        
        // ランダムに3つのパラメーターを選んで経験値を設定
        const selectedParams = paramNames.sort(() => Math.random() - 0.5).slice(0, 3);
        
        selectedParams.forEach((paramName, index) => {
            gains[paramName] = index === 0 ? 25 : index === 1 ? 15 : 10;
        });
        
        return gains;
    }

    addPlayerExp(exp) {
        this.playerExp += exp;
        const expToNext = this.playerLevel * 100;
        
        if (this.playerExp >= expToNext) {
            this.playerExp -= expToNext;
            this.playerLevel++;
            return true;
        }
        return false;
    }

    addParameterExp(paramName, exp) {
        const param = this.parameters[paramName];
        if (!param) return null;
        
        param.exp += exp;
        
        if (param.exp >= param.expToNext) {
            param.exp -= param.expToNext;
            param.level++;
            param.expToNext = param.level * 100;
            return param.level;
        }
        return null;
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(t => t.id !== taskId);
        this.saveData();
    }

    addParameter(name, icon, image = null) {
        if (this.parameters[name]) {
            return false; // 既に存在
        }
        
        this.parameters[name] = {
            level: 1,
            exp: 0,
            expToNext: 100,
            icon: icon,
            image: image
        };
        
        this.saveData();
        return true;
    }

    removeParameter(name) {
        if (this.parameters[name]) {
            delete this.parameters[name];
            this.saveData();
            return true;
        }
        return false;
    }
}

// UI管理
class UIManager {
    constructor(gameData) {
        this.gameData = gameData;
        this.soundManager = new SoundManager();
        this.initElements();
        this.bindEvents();
        this.updateUI();
    }

    initElements() {
        this.taskForm = document.getElementById('taskForm');
        this.taskInput = document.getElementById('taskInput');
        this.taskType = document.getElementById('taskType');
        this.taskList = document.getElementById('taskList');
        this.emptyState = document.getElementById('emptyState');
        
        // パラメーター追加用
        this.addParameterCard = document.getElementById('addParameterCard');
        this.addParameterModal = document.getElementById('addParameterModal');
        this.addParameterForm = document.getElementById('addParameterForm');
        this.newParamName = document.getElementById('newParamName');
        this.newParamIcon = document.getElementById('newParamIcon');
        this.newParamImage = document.getElementById('newParamImage');
        
        // パラメーター編集用
        this.editParameterModal = document.getElementById('editParameterModal');
        this.editParameterForm = document.getElementById('editParameterForm');
        this.editParamOriginalName = document.getElementById('editParamOriginalName');
        this.editParamName = document.getElementById('editParamName');
        this.editParamIcon = document.getElementById('editParamIcon');
        this.editParamImage = document.getElementById('editParamImage');
        
        // パラメーター要素
        this.playerLevel = document.getElementById('playerLevel');
        this.expFill = document.getElementById('expFill');
        this.expText = document.getElementById('expText');
        this.parametersGrid = document.querySelector('.parameters-grid');
        
        this.levelUpModal = document.getElementById('levelUpModal');
        this.levelUpMessage = document.getElementById('levelUpMessage');
        this.levelUpStats = document.getElementById('levelUpStats');
    }

    bindEvents() {
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTask();
        });
        
        // パラメーター追加イベント
        this.addParameterCard.addEventListener('click', () => {
            this.showAddParameterModal();
        });
        
        this.addParameterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addNewParameter();
        });
        
        // パラメーター追加モーダルボタン
        document.getElementById('cancelAddParameter').addEventListener('click', () => {
            this.closeAddParameterModal();
        });
        
        document.getElementById('confirmAddParameter').addEventListener('click', () => {
            this.addNewParameter();
        });
    }

    addTask() {
        const taskName = this.taskInput.value.trim();
        const taskType = this.taskType.value;
        
        if (!taskName) return;
        
        this.soundManager.playClick();
        const task = this.gameData.addTask({
            name: taskName,
            type: taskType
        });
        
        this.taskInput.value = '';
        this.updateUI();
        this.showTaskAdded(task);
    }

    completeTask(taskId) {
        const result = this.gameData.completeTask(taskId);
        if (result) {
            this.soundManager.playSuccess();
            this.updateUI();
            this.showCompletionEffect(result.task);
            
            if (result.levelUps.length > 0) {
                this.soundManager.playLevelUp();
                this.showLevelUpModal(result.levelUps);
            }
        }
    }

    deleteTask(taskId) {
        this.soundManager.playDelete();
        this.gameData.deleteTask(taskId);
        this.updateUI();
    }

    updateUI() {
        this.updateParameters();
        this.updateTaskList();
        this.updateTaskTypes();
    }

    updateTaskTypes() {
        this.taskType.innerHTML = '';
        
        if (Object.keys(this.gameData.taskTypes).length === 0) {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'まずパラメーターを追加してね';
            option.disabled = true;
            this.taskType.appendChild(option);
            return;
        }
        
        for (const [typeId, typeInfo] of Object.entries(this.gameData.taskTypes)) {
            const option = document.createElement('option');
            option.value = typeId;
            option.textContent = `${typeInfo.icon} ${typeInfo.name}`;
            this.taskType.appendChild(option);
        }
    }

    updateParameters() {
        // プレイヤーレベルと経験値
        this.playerLevel.textContent = this.gameData.playerLevel;
        const expToNext = this.gameData.playerLevel * 100;
        const expPercentage = (this.gameData.playerExp / expToNext) * 100;
        this.expFill.style.width = `${expPercentage}%`;
        this.expText.textContent = `${this.gameData.playerExp} / ${expToNext}`;
        
        // パラメーターカードを動的に生成
        this.renderParameterCards();
    }

    renderParameterCards() {
        // 追加ボタン以外のカードをクリア
        const existingCards = this.parametersGrid.querySelectorAll('.parameter-card:not(.add-parameter-card)');
        existingCards.forEach(card => card.remove());
        
        // 各パラメーターカードを生成
        for (const [paramName, param] of Object.entries(this.gameData.parameters)) {
            const card = this.createParameterCard(paramName, param);
            this.parametersGrid.insertBefore(card, this.addParameterCard);
        }
        
        // 追加ボタンを最後に移動
        this.parametersGrid.appendChild(this.addParameterCard);
    }

    createParameterCard(paramName, param) {
        const card = document.createElement('div');
        card.className = 'parameter-card';
        card.dataset.paramName = paramName;
        
        let iconContent;
        if (param.image) {
            iconContent = `<img src="${param.image}" alt="${paramName}" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                         <span style="display:none;">${param.icon || this.getDefaultIcon(paramName)}</span>`;
        } else {
            iconContent = param.icon || this.getDefaultIcon(paramName);
        }
        
        // パラメーター名をエンコードして一意のIDを生成（日本語対応）
        const safeId = 'menu-' + btoa(encodeURIComponent(paramName)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        
        card.innerHTML = `
            <div class="parameter-menu">
                <button class="menu-button" onclick="event.stopPropagation(); uiManager.toggleParameterMenu('${paramName}')">
                    ⋮
                </button>
                <div class="menu-dropdown" id="${safeId}">
                    <button class="menu-item" onclick="event.stopPropagation(); uiManager.editParameter('${paramName}')">
                        ✏️ 編集
                    </button>
                    <button class="menu-item delete" onclick="event.stopPropagation(); uiManager.deleteParameter('${paramName}')">
                        🗑️ 削除
                    </button>
                </div>
            </div>
            <div class="parameter-icon">${iconContent}</div>
            <div class="parameter-info">
                <h3 class="parameter-name">${paramName}</h3>
                <div class="parameter-level">
                    <span class="param-level" id="${safeId}Level">${param.level}</span>
                    <div class="param-exp-bar">
                        <div class="param-exp-fill" id="${safeId}ExpFill"></div>
                    </div>
                </div>
            </div>
        `;
        
        // 経験値バーを更新
        const expPercentage = (param.exp / param.expToNext) * 100;
        const expFill = card.querySelector(`#${safeId}ExpFill`);
        if (expFill) {
            expFill.style.width = `${expPercentage}%`;
        }
        
        // カードクリックイベントを追加
        card.addEventListener('click', (event) => {
            if (!event.target.closest('.parameter-menu')) {
                this.showParameterQuests(paramName);
            }
        });
        
        return card;
    }

    getDefaultIcon(paramName) {
        const iconMap = {
            '知力': '🧠',
            '魅力': '✨',
            '財力': '💰',
            '体力': '💪',
            '創造力': '🎨',
            '社交力': '🤝'
        };
        return iconMap[paramName] || '⭐';
    }

    updateTaskList() {
        const activeTasks = this.gameData.tasks.filter(t => !t.completed);
        
        if (activeTasks.length === 0) {
            this.taskList.style.display = 'none';
            this.emptyState.style.display = 'block';
        } else {
            this.taskList.style.display = 'grid';
            this.emptyState.style.display = 'none';
            
            this.taskList.innerHTML = activeTasks.map(task => this.createTaskHTML(task)).join('');
            
            // イベントリスナーを再設定
            this.taskList.querySelectorAll('.complete-button').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.completeTask(parseInt(btn.dataset.taskId));
                });
            });
            
            this.taskList.querySelectorAll('.delete-button').forEach(btn => {
                btn.addEventListener('click', () => {
                    this.deleteTask(parseInt(btn.dataset.taskId));
                });
            });
        }
    }

    createTaskHTML(task) {
        const taskTypeInfo = this.gameData.taskTypes[task.type] || { name: 'その他', icon: '📋' };
        
        return `
            <div class="task-item" data-task-id="${task.id}">
                <div class="task-icon">${taskTypeInfo.icon}</div>
                <div class="task-content">
                    <div class="task-name">${task.name}</div>
                    <span class="task-type">${taskTypeInfo.name}</span>
                </div>
                <div class="task-actions">
                    <button class="complete-button" data-task-id="${task.id}">
                        完了！
                    </button>
                    <button class="delete-button" data-task-id="${task.id}">
                        削除
                    </button>
                </div>
            </div>
        `;
    }

    showTaskAdded(task) {
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (taskElement) {
            taskElement.classList.add('level-up-animation');
            setTimeout(() => {
                taskElement.classList.remove('level-up-animation');
            }, 600);
        }
    }

    showCompletionEffect(task) {
        const taskElement = document.querySelector(`[data-task-id="${task.id}"]`);
        if (taskElement) {
            taskElement.style.background = 'linear-gradient(135deg, #55efc4 0%, #00b894 100%)';
            taskElement.style.transform = 'scale(1.05)';
            
            setTimeout(() => {
                taskElement.style.opacity = '0';
                taskElement.style.transform = 'scale(0.9)';
            }, 500);
            
            setTimeout(() => {
                this.updateUI();
            }, 800);
        }
    }

    showLevelUpModal(levelUps) {
        const playerLevelUp = levelUps.find(l => l.name === 'プレイヤーレベル');
        const paramLevelUps = levelUps.filter(l => l.name !== 'プレイヤーレベル');
        
        let levelUpText = '';
        if (playerLevelUp && paramLevelUps.length > 0) {
            levelUpText = `レベル${playerLevelUp.newLevel}に上がった！${paramLevelUps.length}つのパラメーターもレベルアップ！`;
        } else if (playerLevelUp) {
            levelUpText = `レベル${playerLevelUp.newLevel}に上がった！`;
        } else if (paramLevelUps.length === 1) {
            levelUpText = `${paramLevelUps[0].name}がレベル${paramLevelUps[0].newLevel}に上がった！`;
        } else {
            levelUpText = `${paramLevelUps.length}つのパラメーターがレベルアップした！`;
        }
        
        this.levelUpMessage.textContent = `🎉 おめでとう！${levelUpText}`;
        
        const statsHTML = levelUps.map(levelUp => 
            `<div style="margin: 0.5rem 0;">
                <strong>${levelUp.name}</strong>: レベル ${levelUp.newLevel - 1} → ${levelUp.newLevel}
            </div>`
        ).join('');
        
        this.levelUpStats.innerHTML = statsHTML;
        this.levelUpModal.classList.add('show');
        
        // パラメーターカードにアニメーション（プレイヤーレベルアップは除外）
        paramLevelUps.forEach(levelUp => {
            const paramCard = document.querySelector(`[data-param-name="${levelUp.name}"]`);
            if (paramCard) {
                paramCard.classList.add('level-up-animation');
            }
        });
    }

    showAddParameterModal() {
        this.soundManager.playClick();
        this.addParameterModal.classList.add('show');
        this.newParamName.value = '';
        this.newParamIcon.value = '';
        this.newParamImage.value = '';
        this.newParamName.focus();
    }

    addNewParameter() {
        console.log('addNewParameterが呼ばれました');
        const name = this.newParamName.value.trim();
        const icon = this.newParamIcon.value.trim();
        const image = this.newParamImage.value.trim();
        
        console.log('入力値:', { name, icon, image });
        
        if (!name) {
            alert('パラメーター名を入力してください。');
            return;
        }
        
        // 絵文字か画像URLのどちらかがあればOK
        if (!icon && !image) {
            alert('絵文字または画像URLを入力してください。');
            return;
        }
        
        if (this.gameData.addParameter(name, icon, image)) {
            // 新しいパラメーター名からタスクタイプIDを生成
            const typeId = name.toLowerCase().replace(/[^a-z0-9]/g, '');
            const taskIcon = image ? '' : (icon || '📋');
            
            // 新しいタスクタイプを追加
            this.gameData.addTaskType(typeId, name, taskIcon);
            
            this.soundManager.playSuccess();
            this.updateUI();
            this.closeAddParameterModal();
        } else {
            alert('そのパラメーター名は既に存在します。');
        }
    }

    closeAddParameterModal() {
        this.addParameterModal.classList.remove('show');
    }

    toggleParameterMenu(paramName) {
        // パラメーター名をエンコードして一意のIDを生成（日本語対応）
        const safeId = 'menu-' + btoa(encodeURIComponent(paramName)).replace(/[^a-zA-Z0-9]/g, '').substring(0, 10);
        const menu = document.getElementById(safeId);
        
        // 他のすべてのメニューを閉じる
        document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
            if (dropdown !== menu) {
                dropdown.classList.remove('show');
            }
        });
        
        // 現在のメニューをトグル
        const isShowing = menu.classList.contains('show');
        menu.classList.toggle('show');
        
        // 外側クリックでメニューを閉じる（メニューを開いた場合のみ）
        if (!isShowing) {
            setTimeout(() => {
                document.addEventListener('click', this.closeMenuHandler);
            }, 100);
        } else {
            // メニューを閉じる場合、リスナーを削除
            document.removeEventListener('click', this.closeMenuHandler);
        }
    }

    closeMenuHandler = (event) => {
        if (!event.target.closest('.parameter-menu')) {
            document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
                dropdown.classList.remove('show');
            });
            document.removeEventListener('click', this.closeMenuHandler);
        }
    }

    editParameter(paramName) {
        const param = this.gameData.parameters[paramName];
        if (!param) return;
        
        this.soundManager.playClick();
        
        // 編集モーダルに現在の値を設定
        this.editParamOriginalName.value = paramName;
        this.editParamName.value = paramName;
        this.editParamIcon.value = param.icon || '';
        this.editParamImage.value = param.image || '';
        
        this.editParameterModal.classList.add('show');
        this.editParamName.focus();
        
        // メニューを閉じる
        document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    deleteParameter(paramName) {
        if (!confirm(`「${paramName}」を削除してもよろしいですか？\n関連するタスクタイプも削除されます。`)) {
            return;
        }
        
        this.soundManager.playDelete();
        
        // 関連するタスクタイプを削除
        const typeId = paramName.toLowerCase().replace(/[^a-z0-9]/g, '');
        delete this.gameData.taskTypes[typeId];
        delete this.gameData.expGains[typeId];
        
        // パラメーターを削除
        this.gameData.removeParameter(paramName);
        
        this.updateUI();
        
        // メニューを閉じる
        document.querySelectorAll('.menu-dropdown').forEach(dropdown => {
            dropdown.classList.remove('show');
        });
    }

    updateParameter() {
        const originalName = this.editParamOriginalName.value;
        const newName = this.editParamName.value.trim();
        const newIcon = this.editParamIcon.value.trim();
        const newImage = this.editParamImage.value.trim();
        
        if (!newName) {
            alert('パラメーター名を入力してください。');
            return;
        }
        
        if (!newIcon && !newImage) {
            alert('絵文字または画像URLを入力してください。');
            return;
        }
        
        // 名前が変更された場合の処理
        if (originalName !== newName) {
            if (this.gameData.parameters[newName]) {
                alert('そのパラメーター名は既に存在します。');
                return;
            }
            
            // 古いパラメーターを削除して新しいパラメーターを追加
            const oldParam = this.gameData.parameters[originalName];
            delete this.gameData.parameters[originalName];
            this.gameData.parameters[newName] = {
                ...oldParam,
                icon: newIcon,
                image: newImage
            };
            
            // 関連するタスクタイプを更新
            const oldTypeId = originalName.toLowerCase().replace(/[^a-z0-9]/g, '');
            const newTypeId = newName.toLowerCase().replace(/[^a-z0-9]/g, '');
            
            if (this.gameData.taskTypes[oldTypeId]) {
                this.gameData.taskTypes[newTypeId] = this.gameData.taskTypes[oldTypeId];
                delete this.gameData.taskTypes[oldTypeId];
            }
            
            if (this.gameData.expGains[oldTypeId]) {
                this.gameData.expGains[newTypeId] = this.gameData.expGains[oldTypeId];
                delete this.gameData.expGains[oldTypeId];
            }
        } else {
            // 名前が変更されていない場合、アイコンと画像のみ更新
            this.gameData.parameters[originalName].icon = newIcon;
            this.gameData.parameters[originalName].image = newImage;
        }
        
        this.gameData.saveData();
        this.soundManager.playSuccess();
        this.updateUI();
        this.closeEditParameterModal();
    }

    closeEditParameterModal() {
        this.editParameterModal.classList.remove('show');
    }

    showParameterQuests(paramName) {
        // 関連するタスクタイプを検索
        const typeId = paramName.toLowerCase().replace(/[^a-z0-9]/g, '');
        const taskTypeInfo = this.gameData.taskTypes[typeId];
        
        if (taskTypeInfo) {
            // 該当するタスクタイプを選択
            this.taskType.value = typeId;
            
            // タスク入力フィールドにフォーカス
            this.taskInput.focus();
            
            // タスク入力セクションまでスクロール
            this.taskForm.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            // 効果音を再生
            this.soundManager.playClick();
        } else {
            // 該当するタスクタイプがない場合、新しいタスクタイプを作成
            const icon = this.gameData.parameters[paramName].icon || this.getDefaultIcon(paramName);
            if (this.gameData.addTaskType(typeId, paramName, icon)) {
                this.updateUI();
                this.showParameterQuests(paramName); // 再度呼び出して選択
            }
        }
    }
}

// レベルアップモーダルを閉じる
function closeLevelUpModal() {
    const modal = document.getElementById('levelUpModal');
    modal.classList.remove('show');
    
    // アニメーションを削除
    document.querySelectorAll('.level-up-animation').forEach(element => {
        element.classList.remove('level-up-animation');
    });
}

// アプリケーション初期化
document.addEventListener('DOMContentLoaded', () => {
    const gameData = new GameData();
    const uiManager = new UIManager(gameData);
    
    // グローバル関数として設定
    window.closeLevelUpModal = closeLevelUpModal;
    window.updateParameter = function() { uiManager.updateParameter(); };
    window.closeEditParameterModal = () => uiManager.closeEditParameterModal();
    window.gameData = gameData;
    window.uiManager = uiManager;
});

// デバッグ用関数
function resetGameData() {
    if (confirm('本当にすべてのデータをリセットしますか？\nパラメーターがすべて削除され、ゼロから始まります。')) {
        localStorage.removeItem('rpgTaskData');
        location.reload();
    }
}

// 経験値設定を更新する関数
function updateExpGains() {
    const gameData = window.gameData;
    if (gameData && confirm('経験値設定を最新に更新しますか？')) {
        gameData.expGains = { ...DEFAULT_EXP_GAINS };
        gameData.saveData();
        alert('経験値設定を更新しました！');
    }
}

// デバッグモード（開発時のみ使用）
if (window.location.hash === '#debug') {
    window.resetGameData = resetGameData;
    window.updateExpGains = updateExpGains;
    console.log('デバッグモードが有効です。resetGameData()でデータをリセット、updateExpGains()で経験値設定を更新できます。');
}
