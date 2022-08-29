let starNum;
let starX = [];
let starY = [];
let starSize = [];
let t = 0.0;

let shootingStars = [];
let shootingStarColors;

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
const bpm = 790;
const intervalMilliSec = 60 / bpm;
const fastGirlIndexes = [4, 6, 8, 10, 12, 14, 16, 18, 0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 0, 2];
const lyrics = [
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "You are a pony",
  "run like a pony",
  "You are a pony",
  "run like a pony",
  "Magic space boots on those",
  "magic space hooves",
  "A jetpack horse with no \nremorse",
  "Let’s kick it!",
  "Poneh Shalom,",
  "the pony princess",
  "Most magical pony,",
  "aren’t you impressed?",
  "Tail hairs― oh so smooth",
  "Galloping like she’s got \ngroove",
  "Sunny valley, Keef Malley",
  "what’d she say― oh I \nsaid “neigh!”",
  "Why don’t we go play and",
  "after eat some hay? Then",
  "do a little weed? VIP",
  "No need to pay! Yo",
  "deluxe rainbow just keep \non truckin’",
  "Wads of cash just keep \non stackin’",
  "Don’t you wish \n          you were…",
  "a magical pony princess?",
  "Poneh Shalom,",
  "the pony princess",
  "Most magical pony,",
  "aren’t you impressed?",
  "Tail hairs― oh so smooth",
  "Galloping like she got \ngroove",
  "Sunny valley, Keef Malley",
  "what’d she say― noh I \nsaid “neigh!”",
  "When I’m all alone",
  "I get my pony comb,",
  "and brush my shiny hair",
  "until the cows come home",
  "Pony beats are really rockin’",
  "Pony chicks are good at …",
  "Don’t you wish you were a…",
  "magical pony princess?",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
  "",
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

  starNum = random(400, 800);
  for (let i = 0; i < starNum; i++) {
    starX[i] = random(0, width);
    starY[i] = random(0, height);
    starSize[i] = random(0, 2.5);
  }

  shootingStarColors = [
    color(255, 255, 210),
    color(210, 255, 255),
    color(255, 253, 253),
    color(255, 210, 255),
    color(255, 210, 202),
  ];
}

function draw() {
  background(34, 32, 52);

  if (frameCount % 10 == 0) {
    t += 0.005;
  }
  for (let i = 0; i < starNum; i++) {
    let noisy = floor(100 * noise(t * i));
    let alpha = 100 + floor(map(noisy, 0, 100, -100, 100));
    fill(255, alpha);
    rect(starX[i], starY[i], starSize[i], starSize[i]);
  }

  if (lyricsCount > 49) {
    if (frameCount % 100 === 0 || frameCount % 362 === 0) {
      shootingStars.push(new ShootingStar());
    }
  } else if (lyricsCount > 29) {
    if (frameCount % 200 === 0) {
      shootingStars.push(new ShootingStar());
    }
  }
  for (let i = 0; i < shootingStars.length; i++) {
    shootingStars[i].update();
  }
  removeDeadStars();

  if (song.currentTime() > (intervalCount * intervalMilliSec)) {
    intervalCount++;
  }

  lyricsCount = floor(intervalCount / 20);
  // text(lyricsCount, 40, 135);

  let lyricsX = 70;
  let lyricsY = 160;
  if (lyricsCount % 2 == 1) {
    lyricsX = 90;
    lyricsY = 180;
  }
  text(lyrics[lyricsCount % lyricsLength], lyricsX, lyricsY);

  levelHistory.push(amplitude.getLevel());
  fill('#3F3F74');
  for (let x = 0; x < levelHistory.length; x++) {
    stroke('#3F3F74');
    const y = map(floor(map(levelHistory[x], 0, 1, 50, 0)), 50, 0, height, 0);
    rect(x, width, 5, -height + y);
  }
  if (levelHistory.length > width) {
    levelHistory.splice(0, 1);
  }

  girlIndex = (intervalCount + 6) % 20;
  if (lyricsCount < 4 || lyricsCount > 71) {
    image(girlBlink[frameCount % 60], 120, 140, 153, 225);
  } else {
    image(girl[girlIndex], 120, 140, 153, 225);
  }
}

function mousePressed() {
  if (song.isPlaying()) {
    song.pause();
  } else {
    song.play();
  }
}

function removeDeadStars() {
  for (let i = 0; i < shootingStars.length; i++) {
    if (shootingStars[i].isDead) {
      shootingStars.splice(i, 1);
      break;
    }
  }
}

class ShootingStar {
  constructor() {
    this.isDead = false;
    this.fading = true;
    this.x = random(20, width - 20);
    this.y = random(20, height - 250);
    this.size = random(3, 6);
    this.growth = random(0, 0.1) - 0.05;
    this.color = shootingStarColors[floor(random(0, 5))];
    this.angle = map(random(0, 1), 0, 1, 0, PI);
    this.vel = random(0.5, 8);
    this.lifetime = random(400, 1500);
    this.starLength = random(20, 30);
    this.alpha = random(100, 255);
  }

  updateLifeStatus() {
    this.lifetime--;
    if (this.alpha < 20 || this.x < 0 || this.x > width || this.y < 0 || this.y > height) {
      this.isDead = true;
    }
    if (this.lifetime === 0) {
      this.fading = true;
    }
  }

  drawShootingStar() {
    for (let i = 0; i < this.starLength; i++) {
      fill(this.color, this.alpha - 20 * i);
      ellipse(
        this.x - i * this.size / 2 * cos(this.angle),
        this.y - i * this.size / 2 * sin(this.angle),
        this.size / i,
        this.size / i
      );
    }
  }

  updatePosition() {
    this.x += this.vel * cos(this.angle);
    this.y += this.vel * sin(this.angle);
    this.size += this.growth;
    if (this.fading) {
      this.alpha -= 10;
    }
  }

  update() {
    this.updateLifeStatus();
    this.updatePosition();
    this.drawShootingStar();
  }
}
