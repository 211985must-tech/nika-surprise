const scenes = [...document.querySelectorAll(".scene")];
const nextButtons = document.querySelectorAll("[data-next]");
const progress = document.querySelector(".progress-fill");
const song = document.querySelector("#song");
const musicToggle = document.querySelector("#musicToggle");
const musicStatus = document.querySelector("#musicStatus");
const replay = document.querySelector("#replay");
const toast = document.querySelector("#toast");
const reasonText = document.querySelector("#reasonText");

let currentScene = 0;
let toastTimer;
let effectTimer;

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("toast-visible");
  toastTimer = window.setTimeout(() => {
    toast.classList.remove("toast-visible");
  }, 2400);
}

function setScene(index) {
  currentScene = Math.max(0, Math.min(index, scenes.length - 1));
  scenes.forEach((scene, sceneIndex) => {
    scene.classList.toggle("scene-active", sceneIndex === currentScene);
  });
  progress.style.width = `${(currentScene / (scenes.length - 1)) * 100}%`;
  startSceneEffects(scenes[currentScene]);
}

function randomBetween(min, max) {
  return min + Math.random() * (max - min);
}

function randomAroundText() {
  const zones = [
    { x: [8, 28], y: [10, 36] },
    { x: [72, 92], y: [10, 36] },
    { x: [8, 28], y: [62, 90] },
    { x: [72, 92], y: [62, 90] },
    { x: [34, 66], y: [4, 20] },
    { x: [34, 66], y: [78, 94] },
  ];
  const zone = zones[Math.floor(Math.random() * zones.length)];

  return {
    left: `${randomBetween(zone.x[0], zone.x[1])}%`,
    top: `${randomBetween(zone.y[0], zone.y[1])}%`,
  };
}

function effectKind(container) {
  if (container.classList.contains("firework-burst")) return "firework";
  if (container.classList.contains("tea-steam")) return "steam";
  if (container.classList.contains("promise-line")) return "pulse";
  return "spark";
}

function makeEffectCluster(kind) {
  const cluster = document.createElement("div");
  cluster.className = `fx-cluster fx-${kind}`;
  const position = randomAroundText();
  cluster.style.left = position.left;
  cluster.style.top = position.top;

  const count = kind === "firework" ? 13 : kind === "pulse" ? 2 : 3;
  for (let index = 0; index < count; index += 1) {
    const item = document.createElement("i");
    if (kind === "firework") {
      const angle = (Math.PI * 2 * index) / count + randomBetween(-0.18, 0.18);
      const distance = randomBetween(105, 190);
      item.style.setProperty("--x", `${Math.cos(angle) * distance}px`);
      item.style.setProperty("--y", `${Math.sin(angle) * distance}px`);
      item.style.setProperty("--size", `${randomBetween(6, 13)}px`);
    }
    item.style.animationDelay = `${index * 55}ms`;
    cluster.append(item);
  }

  return cluster;
}

function spawnSceneEffects(container) {
  const kind = effectKind(container);
  const clusterCount = Math.random() > 0.45 ? 3 : 2;

  for (let index = 0; index < clusterCount; index += 1) {
    const cluster = makeEffectCluster(kind);
    container.append(cluster);
    window.setTimeout(() => {
      cluster.remove();
    }, 2600);
  }
}

function startSceneEffects(scene) {
  window.clearInterval(effectTimer);
  document.querySelectorAll(".fx-cluster").forEach((cluster) => cluster.remove());

  const container = scene.querySelector(".once-effect");
  if (!container) return;

  container.replaceChildren();
  spawnSceneEffects(container);
  effectTimer = window.setInterval(() => {
    spawnSceneEffects(container);
  }, 2200);
}

function tryStartMusic() {
  if (!song.getAttribute("src")) return;

  song.volume = 0.56;
  song.play()
    .then(() => {
      musicStatus.textContent = "звучит";
      musicToggle.textContent = "Ⅱ";
    })
    .catch(() => {
      musicStatus.textContent = "нажми ♪";
      showToast("Музыка включится после нажатия, если рядом лежит файл assets/photograph.mp3.");
    });
}

nextButtons.forEach((button) => {
  button.addEventListener("click", () => {
    if (currentScene === 0) tryStartMusic();
    setScene(currentScene + 1);
  });
});

document.querySelectorAll("[data-reason]").forEach((button) => {
  button.addEventListener("click", () => {
    reasonText.textContent = button.dataset.reason;
  });
});

musicToggle.addEventListener("click", () => {
  if (song.paused) {
    tryStartMusic();
  } else {
    song.pause();
    musicStatus.textContent = "пауза";
    musicToggle.textContent = "♪";
  }
});

song.addEventListener("error", () => {
  musicStatus.textContent = "добавь mp3";
});

replay.addEventListener("click", () => {
  setScene(0);
});

setScene(0);
tryStartMusic();
