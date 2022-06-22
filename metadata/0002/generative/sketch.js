// License: CC BY-SA 3.0; Created by Ara. Original code is by Vamoss.
// Original code: https://www.openprocessing.org/sketch/863090

const title = '019BDF';
let font, song, imgSmile, amplitude, fft, fft2, peak, centerWitdh, centerHeight, totalPunch, intervalCount = 0;
let prevFlashed = false;
let flashCount = 0;
let flashNum = 2;
let musicStarted = false;
const rotateSpeed = 0.4;

const messagesArray = [
  {
    count: 2,
    pattern: [
      'Blockchain',
      '',
      'Fuckin',
      '',
      'One',
      '',
      'Three',
      'GO!',
    ],
  },
  {
    count: 2,
    pattern: [
      'Blockchain',
      'Building',
      'Fuckin',
      'Blockchain',
      'One',
      'Two',
      'Three',
      'GO!',
    ],
  },
  {
    count: 1,
    pattern: [
      '',
      '',
      '',
      '',
      '',
      'Two',
      'Three',
      'GO!',
    ],
  },
  {
    count: 1,
    pattern: [
      '',
      'Building',
      '',
      'Blockchain',
      '',
      'Two',
      'Three',
      'GO!',
    ],
  },
  {
    count: 1,
    pattern: [
      '',
      '',
      '',
      '',
      '',
      'Two',
      'Three',
      'GO!',
    ],
  },
  {
    count: 1,
    pattern: [
      '',
      'Building',
      '',
      'Blockchain',
      '',
      'Two',
      'Three',
      'GO!',
    ],
  },
  {
    count: 8,
    pattern: [
      'Blockchain',
      'Building',
      'Fuckin',
      'Blockchain',
      'Building',
      'Blockchain',
      'Fuckin',
      'Building',
      'Building',
      'Building',
      'Fuckin',
      'Blockchain',
      'Building',
      'Blockchain',
      'Fuckin',
      'GO!',
    ],
  },
  {
    count: 2,
    pattern: [
      'Blockchain',
      '',
      'Fuckin',
      '',
      'One',
      '',
      'Three',
      'GO!',
    ],
  },
  {
    count: 2,
    pattern: [
      'Blockchain',
      '',
      'Fuckin',
      '',
      'One',
      'Two',
      'Three',
      'GO!',
    ],
  },
  {
    count: 12,
    pattern: [
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
      'GO!',
    ],
  },
  // addition
  {
    count: 2,
    pattern: [
      'Blockchain',
      '',
      'Fuckin',
      '',
      'One',
      'Two',
      'Three',
      'GO!',
    ],
  },
];
let messages;

function preload() {
  font = loadFont("PressStart2P-Regular.ttf");
  imgSmile = loadImage('smile.png');
  song = loadSound("8bit-0002.mp3");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  angleMode(DEGREES);
  imageMode(CENTER);
  rectMode(CENTER);

  fft = new p5.FFT();
  fft2 = new p5.FFT(0, 8192);
  amplitude = new p5.Amplitude();
  peak = song.getPeaks(1);

  textAlign(CENTER, CENTER);
  textFont(font);
  centerWidth = width / 2;
  centerHeight = height / 2;

  messages = [''].concat(messagesArray.map(messages => {
    let result = [];
    for (let i = 0; i < messages.count; i++) {
      result = result.concat(messages.pattern);
    }
    return result;
  })).flat();
}

function draw() {
  background(0);

  if (!song.isPlaying() && !musicStarted) {
    fill(255);
    textSize(20);
    text("touch to start", centerWidth, centerHeight);
    return;
  }

  push();
  translate(centerWidth, centerHeight);
  rotate(frameCount * rotateSpeed);

  fft.analyze();
  amp = fft.getEnergy(20, 200);
  push();
  if (amp > 230) {
    rotate(random(-0.5, 0.5));
  }
  pop();

  strokeWeight(3);
  const wave = fft.waveform();
  for (let t = -1; t <= 1; t += 2) {
    beginShape();
    for (let i = 0; i <= 180; i += 0.5) {
      const index = floor(map(i, 0, 180, 0, wave.length - 1));
      const r = map(wave[index], -1, 1, 110, 130);
      const x = r * sin(i) * t;
      const y = r * cos(i);
      vertex(x * 2.3, y * 2.3);
    }
    endShape();
  }

  strokeWeight(1);
  blendMode(BLEND);
  angleMode(RADIANS);

  // spectrum spikes
  let sum = new Array(14);
  sum.fill(0);
  totalPunch = 0;
  let spectrum = fft2.analyze();
  for (let i = 0; i < spectrum.length / 4; i += 7) {
    let a = i / (spectrum.length / 4) * TWO_PI + HALF_PI;
    let x = cos(a) * 250;
    let y = sin(a) * 250;
    let n = spectrum[i] / 255;

    push();
    translate(x, y);
    rotate(a);
    rect(-1, 0, pow(n, 2) * 50, 2);
    pop();

    sum[floor(i / (spectrum.length / 4) * 14)] += n;
    totalPunch += n;
  }

  // canter black circle
  fill(0);
  ellipse(0, 0, 495, 495);
  stroke(64);
  ellipse(0, 0, 40, 40);
  ellipse(0, 0, 15, 15);
  noFill();
  ellipse(0, 0, 160, 160);

  // border text
  textSize(11);
  noStroke();
  fill(255);
  for (let i = 0; i < 133; i++) {
    let a = i / 133 * TWO_PI;
    let x = cos(a - HALF_PI) * 230;
    let y = sin(a - HALF_PI) * 230;

    push();
    translate(x, y);
    rotate(a);
    text(title.charAt(i % title.length), 0, 0);
    pop();
  }

  pop();

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
    push();
    translate(centerWidth, centerHeight);
    rotate(radians(frameCount * rotateSpeed));
    arc(0, 0, 483, 483, a - m / 2, a + m / 2);
    pop();
  }
  strokeWeight(1);

  const smileInsertion = frameCount % (60 * 4) < 2;
  if (smileInsertion) {
    push();
    translate(centerWidth, centerHeight);
    image(imgSmile, 0, 20, 640, 640);
    pop();
  } else {

    // words
    const bpm = 130;
    const intervalMilliSec = 60 / bpm;
    if (song.currentTime() > (intervalCount * intervalMilliSec)) {
      intervalCount++;
    } else {
      push();
      noStroke();
      translate(centerWidth, centerHeight);
      // rotate(radians(frameCount * rotateSpeed));
      if (song.currentTime() > (3 * 60 + 20)) {
        fill(255);
        textSize(38);
        text('Happy', 5, -50);
        text('Encryption', 5, 0);
      } else {
        fill(255);
        textSize(38);
        text(messages[intervalCount % messages.length], 0, 0);
      }
      pop();
    }

    // mouth
    textSize(12);
    const textStr = 'happy encryption 8 bit sound';
    const radius = 170;
    for (let angle = -65, i = 0; angle <= 70; angle += (135 / textStr.length), i++) {
      push();
      translate(centerWidth, centerHeight);
      rotate(radians(frameCount * rotateSpeed));

      let x = sin(radians(angle)) * radius;
      let y = cos(radians(angle)) * radius;

      translate(x, y);
      rotate(- radians(angle));
      fill(255);
      centerText(textStr[i] || ' ', 0, 0);

      pop();
    }
  }

  const level = amplitude.getLevel();
  if (level > peak - 0.05) {
    if (!prevFlashed) {
      flashCount++;
    }
    prevFlashed = true;

    if (flashCount % flashNum == 0) {
      flashNum = random([2, 3, 4, 5, 6]);
      background(255, 64);
    }
  } else {
    prevFlashed = false;
  }

  angleMode(DEGREES);
}

function mouseClicked() {
  if (song.isPlaying()) {
    song.pause();
    noLoop();
  } else {
    song.play();
    musicStarted = true;
    loop();
  }
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
