let girl;
let girlBlink;
let song;
let font;
let peak;
let amplitude;
let levelHistory = [];
let intervalCount = 0;
let lyricsCount = -1;
let lyricsLength;
let angle = 0;
let girlIndex = 0;
let hanabi = [];
const bpm = 1000;
const intervalMilliSec = 60 / bpm;
const fastGirlIndexes = [4, 6, 8, 10, 12, 14, 16, 18, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 0, 2];
const lyrics = [
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "Magic space boots on those",
  "magic space hooves",
  "A jetpack horse with no remorse",
  "Let’s kick it!",
  "Poneh Shalom,",
  "the pony princess",
  "Most magical pony,",
  "aren’t you impressed?",
  "Tail hairs― oh so smooth",
  "Galloping like she’s got groove",
  "Sunny valley, Keef Malley",
  "what’d she say― oh I \nsaid “neigh!”",
  "Why don’t we go play and",
  "after eat some hay? Then",
  "do a little weed? VIP",
  "No need to pay! Yo",
  "deluxe rainbow just keep \non truckin’",
  "Wads of cash just keep \non stackin’",
  "Don’t you wish you were…",
  "a magical pony princess?",
  "Poneh Shalom,",
  "the pony princess",
  "Most magical pony,",
  "aren’t you impressed?",
  "Tail hairs― oh so smooth",
  "Galloping like she got groove",
  "Sunny valley, Keef Malley",
  "what’d she say― noh I \nsaid “neigh!”",
  "When I’m all alone",
  "I get my pony comb,",
  "and brush my shiny hair",
  "until the cows come home",
  "Pony beats are really rockin’",
  "Pony chicks are good at fuckin’",
  "Don’t you wish you were a…",
  "magical pony princess?",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "…",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "You are …",
  "…",
  "…",
  "…",
];

function preload() {
  girl = [
    loadImage('./poneh002.png'), // loadImage('./poneh001.png'),
    loadImage('./poneh002.png'),
    loadImage('./poneh003.png'),
    loadImage('./poneh004.png'),
    loadImage('./poneh005.png'),
    loadImage('./poneh006.png'),
    loadImage('./poneh007.png'),
    loadImage('./poneh008.png'),
    loadImage('./poneh009.png'),
    loadImage('./poneh010.png'),
  ].reduce((result, img) => result.concat([img, img]), []);
  girlBlink = [
    loadImage('./blink001.png'),
    loadImage('./blink002.png'),
    loadImage('./blink003.png'),
    loadImage('./blink004.png'),
    loadImage('./blink005.png'),
    loadImage('./blink006.png'),
    loadImage('./blink007.png'),
    loadImage('./blink008.png'),
    loadImage('./blink009.png'),
    loadImage('./blink010.png'),
  ].reduce((result, img) => result.concat([img, img, img, img, img, img]), []);
  song = loadSound('./music.mp3');
  font = loadFont('./PressStart2P-Regular.ttf');
  lyricsLength = lyrics.length;
}

function setup() {
  createCanvas(400, 400);
  textFont(font);
  textSize(10);
  peak = song.getPeaks(1);
  amplitude = new p5.Amplitude();
  song.play();
}

function draw() {
  background(34, 32, 52);

  const G = 0.04;
  for (let i = 0; i < hanabi.length; i++) {
    let fire = hanabi[i];
    fire.vx += 0;
    fire.vy += G;
    fire.x += fire.vx;
    fire.y += fire.vy;

    if (fire.lifetime - 50 > 0) {
      noStroke();
      fill(fire.col, fire.lifetime - 50);
      rect(fire.x, fire.y, 3, 3);
      fire.lifetime -= 0.5;
    }
  }

  fill(0);
  stroke(255);
  strokeWeight(4);
  rect(20, 30, 360, 60);
  rect(20, 110, 60, 40);
  strokeWeight(0);
  rect(30, 28, 80, 20);

  fill(0);
  strokeWeight(0);
  rect(30, 108, 40, 20);

  fill(255);
  text("Lyrics", 40, 35);
  text("Lv", 40, 115);

  if (song.currentTime() > (intervalCount * intervalMilliSec)) {
    intervalCount++;
  }

  lyricsCount = floor(intervalCount / 20);
  text(lyricsCount, 40, 135);
  text(lyrics[lyricsCount % lyricsLength], 40, 60);

  const level = amplitude.getLevel();
  levelHistory.push(level);
  fill('#3F3F74');
  for (let x = 0; x < levelHistory.length; x++) {
    stroke('#3F3F74');
    const y = map(floor(map(levelHistory[x], 0, 1, 50, 0)), 50, 0, height, 0);
    rect(x, width, 5, -height + y);

    const hanabiFreq = lyricsCount > 60 ? 150 : 240;
    if (lyricsCount > 33 && frameCount % hanabiFreq === 0) {
      hanabi = [];
      const x = random(20, 380);
      const y = random(40, 280);
      const c = color(random(50, 255), random(50, 255), random(50, 255));
      for (let i = 0; i < 500; i++) {
        const r = random(0, 2 * PI);
        const R = random(0, 2);
        hanabi.push(new Fire(x, y, R * sin(r), R * cos(r), c));
      }
    }
  }
  if (levelHistory.length > width) {
    levelHistory.splice(0, 1);
  }

  girlIndex = (intervalCount + 6) % 20;
  if (lyricsCount > 57) {
    girlIndex = fastGirlIndexes[girlIndex];
  }
  if (lyricsCount < 5) {
    girlIndex = 0;
  }

  if (lyricsCount < 4 || lyricsCount > 99) {
    image(girlBlink[frameCount % 60], 120, height - 240, 153, 225);
  } else {
    image(girl[girlIndex], 120, height - 240, 153, 225);
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

class Fire {
  constructor(x, y, vx, vy, col) {
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;
    this.col = col;
    this.lifetime = 150;
  }
}
