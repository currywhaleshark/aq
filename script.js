const STARTING_MONEY = 500;
const STARTING_SLOTS = 4;

const tankCatalog = {
  small: { type: '소형 수조', price: 100, className: 'small' },
  large: { type: '대형 수조', price: 180, className: 'large' },
};

const state = {
  player: {
    money: STARTING_MONEY,
  },
  currentTime: 0,
  slots: Array.from({ length: STARTING_SLOTS }, (_, i) => ({
    id: i,
    tank: null,
  })),
  pendingTankKey: null,
};

const moneyEl = document.querySelector('#money');
const timeEl = document.querySelector('#time');
const floorEl = document.querySelector('#floor');
const openInstallBtn = document.querySelector('#openInstallBtn');
const installDialog = document.querySelector('#installDialog');
const tankOptionsEl = document.querySelector('#tankOptions');
const hintEl = document.querySelector('#hint');

function renderStats() {
  moneyEl.textContent = String(state.player.money);
  timeEl.textContent = String(state.currentTime);
}

function renderSlots() {
  floorEl.innerHTML = '';

  for (const slot of state.slots) {
    const slotEl = document.createElement('button');
    slotEl.className = 'slot';
    slotEl.type = 'button';
    slotEl.dataset.slotId = String(slot.id);

    if (state.pendingTankKey && !slot.tank) {
      slotEl.classList.add('ready');
    }

    if (slot.tank) {
      slotEl.classList.add('occupied');
      slotEl.disabled = true;

      const tankEl = document.createElement('div');
      tankEl.className = `tank ${slot.tank.className}`;
      tankEl.innerHTML = `<strong>${slot.tank.type}</strong><br/><small>설치 완료</small>`;
      slotEl.appendChild(tankEl);
    } else {
      slotEl.textContent = `빈 슬롯 #${slot.id + 1}`;
    }

    slotEl.addEventListener('click', () => placeTank(slot.id));
    floorEl.appendChild(slotEl);
  }
}

function renderInstallOptions() {
  tankOptionsEl.innerHTML = '';

  for (const [key, tank] of Object.entries(tankCatalog)) {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = `${tank.type} (💰 ${tank.price})`;

    button.addEventListener('click', () => {
      state.pendingTankKey = key;
      hintEl.textContent = `${tank.type}를 선택했습니다. 빈 슬롯을 클릭해 설치하세요.`;
      installDialog.close();
      renderSlots();
    });

    tankOptionsEl.appendChild(button);
  }
}

function placeTank(slotId) {
  const slot = state.slots.find((s) => s.id === slotId);
  if (!slot || slot.tank || !state.pendingTankKey) return;

  const selectedTank = tankCatalog[state.pendingTankKey];
  if (state.player.money < selectedTank.price) {
    hintEl.textContent = `돈이 부족합니다. (필요: ${selectedTank.price})`;
    return;
  }

  state.player.money -= selectedTank.price;
  slot.tank = {
    type: selectedTank.type,
    className: selectedTank.className,
  };
  state.pendingTankKey = null;
  hintEl.textContent = `${selectedTank.type} 설치 완료!`;

  renderStats();
  renderSlots();
}

openInstallBtn.addEventListener('click', () => {
  state.pendingTankKey = null;
  hintEl.textContent = '설치할 수조를 먼저 선택해주세요.';
  installDialog.showModal();
  renderSlots();
});

setInterval(() => {
  state.currentTime += 1;
  renderStats();
}, 1000);

renderInstallOptions();
renderStats();
renderSlots();
