// License: CC BY-SA 3.0; Created by Ara. Original code is by Vamoss.
// Original code: https://www.openprocessing.org/sketch/863090

let song, img, fft, center, totalPunch, font, overlay, circlesPos = [];
let title = "019BDF";

function preload() {
  song = loadSound("8bit-0001.mp3");
  img = loadImage("smile.png");
  font = loadFont("HelveticaNeue-Bold.otf");
}

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  textFont(font);

  overlay = createGraphics(width, height);
  overlay.noStroke();

  fft = new p5.FFT(0, 8192);

  center = width / 2;

  for (let i = 0; i < 100; i++) {
    circlesPos.push(createVector(0, 0));
  }
}

function draw() {
  background("#000000");

  if (!song.isPlaying()) {
    fill(255);
    textSize(40);
    text("touch to start", center, center);
    return;
  }

  const smileInsertion = frameCount % (60 * 4) < 2;
  if (smileInsertion) {
    push();
    translate(center, center);
    image(img, -320, -300, 640, 640);
    pop();
  }

  // border text
  textSize(11);
  noStroke();
  fill(255);
  for (let i = 0; i < 133; i++) {
    let a = i / 133 * TWO_PI;
    let x = cos(a - HALF_PI) * 230 + center;
    let y = sin(a - HALF_PI) * 230 + center;
    push();
    translate(x, y);
    rotate(a);
    text(title.charAt(i % title.length), 0, 0);
    pop();
  }

  // spectrum spikes
  let sum = new Array(14);
  sum.fill(0);
  totalPunch = 0;
  let spectrum = fft.analyze();
  for (let i = 0; i < spectrum.length / 4; i += 7) {
    let a = i / (spectrum.length / 4) * TWO_PI + HALF_PI;
    let x = cos(a) * 250 + center;
    let y = sin(a) * 250 + center;
    let n = spectrum[i] / 255;
    push();
    translate(x, y);
    rotate(a);
    rect(-1, 0, pow(n, 2) * 50, 2);
    pop();

    sum[floor(i / (spectrum.length / 4) * 14)] += n;
    totalPunch += n;
  }

  if (!smileInsertion) {
    // spectrum sum of areas
    noFill();
    strokeWeight(3);
    stroke(255);
    for (let i = 0; i < 14; i++) {
      if (sum[i] < 1) {
        continue;
      }
      let a = (i + 0.4) / 14 * TWO_PI + HALF_PI;
      let m = pow(sum[i] / 16, 2);
      arc(center, center, 483, 483, a - m / 2, a + m / 2);
    }

    // circular pulse
    noFill();
    strokeWeight(3);
    stroke(255);
    let at = song.currentTime() * TWO_PI - HALF_PI;
    arc(center, center, 438, 438, at - totalPunch / 60, at);
    noStroke();
    fill(255);

    // middle text
    textSize(30);
    centerText("Hi Everyone", center, center - 75);
    textSize(50);
    centerText("I'm Crypto Toy", center, center - 25);
    textSize(20);
    centerText("___________________________________", center, center + 15);

    textSize(16);

    // mouth
    const textStr = "happy encryption 8 bit sound"
    const r = 140;
    for (let angle = -75, i = 0; angle <= 80; angle += (155 / textStr.length), i++) {
      push();
      translate(width / 2, height / 2 + 20);
      fill(127);

      x = sin(radians(angle)) * r;
      y = cos(radians(angle)) * r;

      push();
      translate(x, y);
      rotate(- radians(angle));
      fill("#ffffff");
      centerText(textStr[i] || " ", 0, 0);
      pop();

      pop();
    }
  }

  blendMode(BLEND);
}

function centerText(t, x, y) {
  x -= textWidth(t) / 2;
  for (let i = 0; i < t.length; i++) {
    let c = t.charAt(i);
    x += textWidth(c) / 2;
    text(randomText(c, i), x, y);
    x += textWidth(c) / 2;
  }
}

function randomText(c, i) {
  if (totalPunch > 100) {
    return char(floor(random(20, 100)));
  } else if (noise(millis() / 300 + i / 10, unchar(c) / 100) < 0.25) {
    return char(unchar(c) + floor(random(-20, 20)));
  } else {
    return c;
  }
}

function mousePressed() {
  if (!song.isPlaying()) {
    song.play();
    fft.setInput(song);
  }
  noCursor();
}
