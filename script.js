const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const opening = document.getElementById("opening");
const music = document.getElementById("bgMusic");
const musicToggle = document.getElementById("musicToggle");
const musicLabel = document.getElementById("musicLabel");

const playlist = [
  { src: "assets/lux_song_1.mp3", name: "SONG 1" },
  { src: "assets/lux_song_2.mp3", name: "SONG 2" }
];
let currentTrack = 0;
music.src = playlist[currentTrack].src;
music.addEventListener("ended", () => {
  currentTrack = (currentTrack + 1) % playlist.length;
  music.src = playlist[currentTrack].src;
  music.play().catch(() => {});
  musicLabel.textContent = playlist[currentTrack].name;
});
let resumeMusicAfterVideo = false;
async function toggleMusic() {
  // Keep the birthday playlist silent while the CapCut video is playing.
  if (!video.paused && !video.ended) {
    showToast("Video audio is playing ♡");
    return;
  }
  if (music.paused) {
    try {
      await music.play();
      musicToggle.classList.add("playing");
      musicLabel.textContent = playlist[currentTrack].name;
      musicToggle.setAttribute("aria-label", "Pause background music");
    } catch (error) {
      musicLabel.textContent = "TAP TO PLAY";
      showToast("Tap the music button to start your songs ♡");
    }
  } else {
    music.pause();
    musicToggle.classList.remove("playing");
    musicLabel.textContent = "MUSIC OFF";
    musicToggle.setAttribute("aria-label", "Play background music");
  }
}
musicToggle.addEventListener("click", toggleMusic);
document.getElementById("enterSite").addEventListener("click", async () => {
  opening.classList.add("hide");
  await toggleMusic();
});

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, {threshold: 0.12});
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const petals = document.getElementById("petals");
function makePetal() {
  const petal = document.createElement("span");
  petal.className = "petal";
  petal.style.left = Math.random() * 100 + "vw";
  petal.style.setProperty("--drift", (Math.random() * 180 - 90) + "px");
  petal.style.animationDuration = (8 + Math.random() * 8) + "s";
  petals.appendChild(petal);
  setTimeout(() => petal.remove(), 17000);
}
if (!reduceMotion) {
  for (let i = 0; i < 12; i++) setTimeout(makePetal, i * 450);
  setInterval(makePetal, 1150);
}

const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightboxImage");
document.querySelectorAll(".photo-card").forEach(card => {
  card.addEventListener("click", () => {
    lightboxImage.src = card.dataset.full;
    lightbox.classList.add("open");
    lightbox.setAttribute("aria-hidden", "false");
  });
});
function closeLightbox() {
  lightbox.classList.remove("open");
  lightbox.setAttribute("aria-hidden", "true");
  lightboxImage.src = "";
}
document.getElementById("closeLightbox").addEventListener("click", closeLightbox);
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => { if (e.key === "Escape") closeLightbox(); });

const video = document.getElementById("birthdayVideo");
const videoPlaceholder = document.getElementById("videoPlaceholder");
video.addEventListener("error", () => { video.hidden = true; videoPlaceholder.hidden = false; });
video.addEventListener("loadedmetadata", () => { video.hidden = false; videoPlaceholder.hidden = true; });

// The CapCut video's own sound takes priority over the background playlist.
video.addEventListener("play", () => {
  resumeMusicAfterVideo = !music.paused;
  if (!music.paused) music.pause();
  musicToggle.classList.remove("playing");
  musicLabel.textContent = "VIDEO AUDIO";
  musicToggle.setAttribute("aria-label", "Background music paused while video plays");
});
function resumeBackgroundMusic() {
  if (!resumeMusicAfterVideo) return;
  resumeMusicAfterVideo = false;
  music.play().then(() => {
    musicToggle.classList.add("playing");
    musicLabel.textContent = playlist[currentTrack].name;
    musicToggle.setAttribute("aria-label", "Pause background music");
  }).catch(() => {
    musicLabel.textContent = "TAP TO PLAY";
    musicToggle.setAttribute("aria-label", "Play background music");
  });
}
video.addEventListener("pause", resumeBackgroundMusic);
video.addEventListener("ended", resumeBackgroundMusic);

function showToast(message) {
  const toast = document.getElementById("toast");
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2600);
}
function burstConfetti() {
  const colors = ["#741d3a", "#c58b83", "#e8c5c5", "#c9a66b", "#fff1df"];
  for (let i = 0; i < 110; i++) {
    const bit = document.createElement("i");
    bit.className = "confetti";
    bit.style.left = Math.random() * 100 + "vw";
    bit.style.background = colors[Math.floor(Math.random() * colors.length)];
    bit.style.setProperty("--x", (Math.random() * 240 - 120) + "px");
    bit.style.animationDuration = (1.8 + Math.random() * 1.6) + "s";
    document.body.appendChild(bit);
    setTimeout(() => bit.remove(), 4000);
  }
}
document.getElementById("celebrate").addEventListener("click", () => {
  burstConfetti();
  showToast("For all the happiness you deserve, Lux! ♡");
});
