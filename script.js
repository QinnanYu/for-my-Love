const pet = document.getElementById('pet');
const menu = document.getElementById('right-menu');
const clockToast = document.getElementById('clock-toast');

let happiness = 100;
let energy = 100;
let statsVisible = true;
let petVisible = true;
let isDead = false;
let isAction = false;

let drag = false, offX, offY;

// 拖拽
pet.addEventListener('mousedown', e => {
    drag = true;
    offX = e.clientX - pet.offsetLeft;
    offY = e.clientY - pet.offsetTop;
    pet.style.cursor = 'grabbing';
});

document.addEventListener('mousemove', e => {
    if (!drag) return;
    pet.style.left = e.clientX - offX + 'px';
    pet.style.top = e.clientY - offY + 'px';
});

document.addEventListener('mouseup', () => {
    drag = false;
    pet.style.cursor = 'grab';
});

// 右键菜单
pet.addEventListener('contextmenu', e => {
    e.preventDefault();
    menu.style.display = 'block';
    menu.style.left = e.clientX + 'px';
    menu.style.top = e.clientY + 'px';
});

document.addEventListener('click', () => {
    menu.style.display = 'none';
});

// 更新数值UI
function updateBarsOnly() {
    document.getElementById('happiness-bar').style.width = happiness + '%';
    document.getElementById('energy-bar').style.width = energy + '%';
    document.getElementById('happiness-text').innerText = happiness;
    document.getElementById('energy-text').innerText = energy;
}

// 更新整体UI
function updateUI() {
    updateBarsOnly();
    updateState();
}

// 状态动画
function updateState() {
    // 正在执行动作时，不要覆盖动作GIF
    if (isAction) return;

    if (isDead) {
        pet.className = 'pet dead';
        return;
    }

    if (happiness === 0 && energy === 0) {
        petDie();
        return;
    }

    if (happiness < 20 && energy < 20) {
        pet.className = 'pet angry';
        return;
    }

    if (happiness < 20) {
        pet.className = 'pet crying2';
        return;
    }

    if (energy < 20) {
        pet.className = 'pet crying';
        return;
    }

    if (energy < 40) {
        pet.className = 'pet hungry';
        return;
    }

    const hour = new Date().getHours();
    const weekday = new Date().getDay();
    const isWorkTime = weekday >= 1 && weekday <= 5 && hour >= 10 && hour < 18;

    if (isWorkTime) {
        pet.className = 'pet working2';
    } else {
        pet.className = Math.random() > 0.5 ? 'pet normal' : 'pet normal2';
    }
}

// 自动掉属性
setInterval(() => {
    if (isDead || isAction) return;

    happiness = Math.max(0, happiness - 1);
    energy = Math.max(0, energy - 1);
    updateUI();
}, 10000);

// 整点报时
setInterval(() => {
    const now = new Date();
    if (now.getMinutes() === 0 && now.getSeconds() === 0) {
        const h = now.getHours();
        showClock(h);
    }
}, 1000);

function showClock(h) {
    if (isDead || isAction) return;

    isAction = true;
    pet.className = 'pet clock';

    clockToast.innerText = `现在是北京时间 ${h} 点整噢！`;
    clockToast.style.display = 'block';
    clockToast.style.left = pet.offsetLeft + 80 + 'px';
    clockToast.style.top = pet.offsetTop - 40 + 'px';

    setTimeout(() => {
        clockToast.style.display = 'none';
        isAction = false;
        updateUI();
    }, 9500);
}

// 死亡
function petDie() {
    isDead = true;
    pet.className = 'pet dead';

    setTimeout(() => {
        isDead = false;
        happiness = 30;
        energy = 30;
        updateUI();
    }, 30000);
}

// 随机位置
function randomPos() {
    const w = window.innerWidth - 200;
    const h = window.innerHeight - 200;
    pet.style.left = Math.random() * w + 'px';
    pet.style.top = Math.random() * h + 'px';
}

// 通用动作函数
function act(gif, hp, en, ms) {
    if (isDead || isAction) return;

    isAction = true;
    pet.className = 'pet ' + gif;

    happiness = Math.min(100, Math.max(0, happiness + hp));
    energy = Math.min(100, Math.max(0, energy + en));

    // 只更新数值，不立刻触发状态覆盖
    updateBarsOnly();

    setTimeout(() => {
        isAction = false;
        updateUI();
    }, ms);
}

// 所有互动功能
function stick() {
    act('stick', 15, -5, 60000);
}

function call() {
    act('call', 0, 0, 2000);
}

function exercise() {
    act('exercise', 5, -15, 60000);
}

function charge() {
    act('charge', 30, 30, 60000);
}

function cake() {
    if (energy >= 80) {
        act('full', 0, 0, 5000);
    } else {
        act('cake', 10, 5, 30000);
    }
}

function baji() {
    act('baji', 10, 0, 30000);
}

function baji2() {
    act('baji2', 15, -10, 30000);
}

function appear() {
    if (isDead || isAction) return;

    isAction = true;
    pet.className = 'pet appear';
    randomPos();
    updateBarsOnly();

    setTimeout(() => {
        isAction = false;
        updateUI();
    }, 3500);
}

function walkDog() {
    act('walkdog', 15, -10, 60000);
}

function toggleStats() {
    statsVisible = !statsVisible;
    document.getElementById('status-panel').style.display = statsVisible ? 'block' : 'none';
}

function toggleHide() {
    petVisible = !petVisible;
    pet.style.opacity = petVisible ? '1' : '0';
}

// 初始化
updateUI();
