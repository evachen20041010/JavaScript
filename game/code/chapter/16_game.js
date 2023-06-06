var simpleLevelPlan = `
......................
..#................#..
.
..#................#..
..#.........o.o....#..
..#.@......#####...#..
..#####............#..
......#............#..
......##############..
......................`;
// 定義關卡的平面圖形
// "." 代表空白區域，"#" 代表牆壁
// "@" 代表玩家角色，"o" 代表硬幣

// 定義角色圖片路徑
const actorImages = {
  player: [
    'image/player/alex.png',
    'image/player/steve.png'
  ],
  coin: [
    'image/coin/apple.png',
    'image/coin/bread.png',
    'image/coin/cookie.png',
    'image/coin/SweetBerries.png'
  ]
};

var Level = class Level {
  constructor(plan) {
    // 移除空白字元，以換行符號拆分字串為陣列，並將每一行轉為字元陣列
    let rows = plan.trim().split("\n").map(l => [...l]);
    this.height = rows.length;  // 關卡高度（行數）
    this.width = rows[0].length;  // 關卡寬度（列數）
    this.startActors = [];  // 開始時的角色陣列

    // 將平面圖形轉換為關卡資料結構
    this.rows = rows.map((row, y) => {
      return row.map((ch, x) => {
        let type = levelChars[ch];
        if (typeof type == "string") return type;

        // 創建角色並加入開始時的角色陣列
        this.startActors.push(
          type.create(new Vec(x, y), ch));
        return "empty";
      });
    });
  }
}

// 關卡狀態類別
var State = class State {
  constructor(level, actors, status) {
    this.level = level;
    this.actors = actors;
    this.status = status;
  }

  // 開始一個新的關卡狀態
  static start(level) {
    return new State(level, level.startActors, "playing");
  }

  // 取得玩家角色
  get player() {
    return this.actors.find(a => a.type == "player");
  }
}

// 二維向量類別
var Vec = class Vec {
  constructor(x, y) {
    this.x = x; this.y = y;
  }

  // 向量加法
  plus(other) {
    return new Vec(this.x + other.x, this.y + other.y);
  }

  // 向量乘法
  times(factor) {
    return new Vec(this.x * factor, this.y * factor);
  }
}

// 玩家角色類別
var Player = class Player {
  constructor(pos, speed) {
    this.pos = pos;
    this.speed = speed;
  }

  // 角色類型
  get type() { return "player"; }

  // 創建玩家角色
  static create(pos) {
    return new Player(pos.plus(new Vec(0, -0.5)),
      new Vec(0, 0));
  }
}

Player.prototype.size = new Vec(0.8, 0.8);

// 硬幣角色類別
var Coin = class Coin {
  constructor(pos, basePos, wobble) {
    this.pos = pos;
    this.basePos = basePos;
    this.wobble = wobble;
  }

  // 角色類型
  get type() { return "coin"; }

  // 創建硬幣角色
  static create(pos) {
    let basePos = pos.plus(new Vec(0.2, 0.1));
    return new Coin(basePos, basePos,
      Math.random() * Math.PI * 2);
  }
}

Coin.prototype.size = new Vec(1.2, 1.2);

// 定義關卡角色的對應關係
var levelChars = {
  ".": "empty", "#": "wall",
  "@": Player, "o": Coin,
};

var simpleLevel = new Level(simpleLevelPlan);

// 創建 DOM 元素
function elt(name, attrs, ...children) {
  let dom = document.createElement(name);
  for (let attr of Object.keys(attrs)) {
    dom.setAttribute(attr, attrs[attr]);
  }
  for (let child of children) {
    dom.appendChild(child);
  }
  return dom;
}

// DOM 顯示類別
var DOMDisplay = class DOMDisplay {
  constructor(parent, level) {
    // 創建 DOM 元素
    this.dom = elt("div", { class: "game" }, drawGrid(level));
    this.actorLayer = null;
    parent.appendChild(this.dom);
  }

  // 清除 DOM 元素
  clear() { this.dom.remove(); }
}

// 每個方格的像素大小
var scale = 20;

// 繪製關卡的背景方格
function drawGrid(level) {
  return elt("table", {
    class: "background",
    style: `width: ${level.width * scale}px`
  }, ...level.rows.map(row =>
    elt("tr", { style: `height: ${scale}px` },
      ...row.map(type => elt("td", { class: type })))
  ));
}

//角色圖片
//Player.prototype.sprite = "image/steve.png";
Player.prototype.sprite = actorImages.player[0];
Coin.prototype.sprite = actorImages.coin[Math.floor(Math.random() * (actorImages.coin.length - 1))];

// 繪製角色
function drawActors(actors) {
  return elt("div", {}, ...actors.map(actor => {
    let rect = elt("div", { class: `actor ${actor.type}` });

    if (actor.type === "player") {
      rect.style.backgroundImage = `url(${actor.sprite})`;
      rect.style.backgroundSize = "cover";
    } else if (actor.type === "coin") {
      rect.style.backgroundImage = `url(${actor.sprite})`;
      rect.style.backgroundSize = "cover";
    }

    rect.style.width = `${actor.size.x * scale}px`;
    rect.style.height = `${actor.size.y * scale}px`;
    rect.style.left = `${actor.pos.x * scale}px`;
    rect.style.top = `${actor.pos.y * scale}px`;
    return rect;
  }));
}

// 同步顯示的狀態
DOMDisplay.prototype.syncState = function (state) {
  if (this.actorLayer) this.actorLayer.remove();
  this.actorLayer = drawActors(state.actors);
  this.dom.appendChild(this.actorLayer);
  this.dom.className = `game ${state.status}`;
  this.scrollPlayerIntoView(state);
};

// 捲動畫面以使玩家角色可見
DOMDisplay.prototype.scrollPlayerIntoView = function (state) {
  let width = this.dom.clientWidth;
  let height = this.dom.clientHeight;
  let margin = width / 3;

  // 視窗的左右邊界
  let left = this.dom.scrollLeft, right = left + width;

  // 視窗的上下邊界
  let top = this.dom.scrollTop, bottom = top + height;

  let player = state.player;
  let center = player.pos.plus(player.size.times(0.5)).times(scale);

  // 檢查玩家角色是否在視窗範圍內，若不在則捲動畫面
  if (center.x < left + margin) {
    this.dom.scrollLeft = center.x - margin;
  } else if (center.x > right - margin) {
    this.dom.scrollLeft = center.x + margin - width;
  }
  if (center.y < top + margin) {
    this.dom.scrollTop = center.y - margin;
  } else if (center.y > bottom - margin) {
    this.dom.scrollTop = center.y + margin - height;
  }
};

// 判斷角色是否接觸到特定類型的方塊
Level.prototype.touches = function (pos, size, type) {
  let xStart = Math.floor(pos.x);
  let xEnd = Math.ceil(pos.x + size.x);
  let yStart = Math.floor(pos.y);
  let yEnd = Math.ceil(pos.y + size.y);

  for (let y = yStart; y < yEnd; y++) {
    for (let x = xStart; x < xEnd; x++) {
      let isOutside = x < 0 || x >= this.width ||
        y < 0 || y >= this.height;
      let here = isOutside ? "wall" : this.rows[y][x];
      if (here == type) return true;
    }
  }
  return false;
};

// 更新遊戲狀態
State.prototype.update = function (time, keys) {
  let actors = this.actors
    .map(actor => actor.update(time, this, keys));
  let newState = new State(this.level, actors, this.status);

  if (newState.status != "playing") return newState;

  let player = newState.player;

  viewScore(newState.actors.filter(a => a != this));

  for (let actor of actors) {
    if (actor != player && overlap(actor, player)) {
      newState = actor.collide(newState);
    }
  }
  return newState;
};

// 檢查兩個角色是否重疊
function overlap(actor1, actor2) {
  return actor1.pos.x + actor1.size.x > actor2.pos.x &&
    actor1.pos.x < actor2.pos.x + actor2.size.x &&
    actor1.pos.y + actor1.size.y > actor2.pos.y &&
    actor1.pos.y < actor2.pos.y + actor2.size.y;
}

// 硬幣角色的碰撞處理
Coin.prototype.collide = function (state) {
  let filtered = state.actors.filter(a => a != this);
  let status = state.status;
  if (!filtered.some(a => a.type == "coin")) status = "won";
  return new State(state.level, filtered, status);
};

var sumzt = true;
var scoresum = 0;
var scorenow = 0;

function viewScore(arr) {
  scorenow = 0;

  if (sumzt == true) {
    scoresum = 0;
  }

  arr.forEach(once => {
    if (once.type == "coin") {
      scorenow++;
    }
  });

  if (sumzt == true) {
    scoresum = scorenow;
  }

  sumzt = false;

  document.querySelector(".viewScore").innerHTML = `${scoresum - scorenow}/${scoresum}`;
}

var wobbleSpeed = 8, wobbleDist = 0.07;

// 更新硬幣角色的位置
Coin.prototype.update = function (time) {
  let wobble = this.wobble + time * wobbleSpeed;
  let wobblePos = Math.sin(wobble) * wobbleDist;
  return new Coin(this.basePos.plus(new Vec(0, wobblePos)),
    this.basePos, wobble);
};

var playerXSpeed = 7;

Player.prototype.update = function (time, state, keys) {
  let xSpeed = 0;
  let ySpeed = 0;

  if (keys.ArrowLeft) xSpeed -= playerXSpeed;
  if (keys.ArrowRight) xSpeed += playerXSpeed;
  if (keys.ArrowUp) ySpeed -= playerXSpeed;
  if (keys.ArrowDown) ySpeed += playerXSpeed;


  let pos = this.pos;
  let movedX = pos.plus(new Vec(xSpeed * time, 0));
  if (!state.level.touches(movedX, this.size, "wall")) {
    pos = movedX;
  }

  let movedY = pos.plus(new Vec(0, ySpeed * time));
  if (!state.level.touches(movedY, this.size, "wall")) {
    pos = movedY;
  }

  return new Player(pos, new Vec(xSpeed, ySpeed));
};

// 鍵盤事件處理
function trackKeys(keys) {
  let down = Object.create(null);
  function track(event) {
    if (keys.includes(event.key)) {
      down[event.key] = event.type == "keydown";
      event.preventDefault();
    }
  }
  window.addEventListener("keydown", track);
  window.addEventListener("keyup", track);
  return down;
}

var arrowKeys = trackKeys(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

//運行動畫
function runAnimation(frameFunc) {
  let lastTime = null;
  function frame(time) {
    if (lastTime != null) {
      let timeStep = Math.min(time - lastTime, 100) / 1000;
      if (frameFunc(timeStep) === false) return;
    }
    lastTime = time;
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}

//運行關卡
function runLevel(level, Display) {
  let display = new Display(document.querySelector(".scream"), level);
  let state = State.start(level);
  let ending = 1;
  return new Promise(resolve => {
    runAnimation(time => {
      state = state.update(time, arrowKeys);
      display.syncState(state);
      if (state.status == "playing") {
        return true;
      } else if (ending > 0) {
        ending -= time;
        return true;
      } else {
        display.clear();
        resolve(state.status);
        return false;
      }
    });
  });
}


//運行遊戲
async function runGame(plans, Display) {
  end = plans.length;
  for (let level = 0; level < plans.length;) {
    let status = await runLevel(new Level(plans[level]), Display);
    if (status == "won") {
      document.querySelector(".viewScore").innerHTML = "";
      level++;
      sumzt = true;
    }
    if (level == plans.length - 1) {
      const button = document.createElement("button");

      button.innerHTML = "Button";
      document.body.appendChild(button);
    }
  }
  //runLevel(new Level(plans[plans.length-1]), Display);  //轉移到結束關卡
  console.log("You've won!");
}

