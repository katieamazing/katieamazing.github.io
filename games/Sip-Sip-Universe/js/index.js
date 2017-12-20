(function () {
    var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
    window.requestAnimationFrame = requestAnimationFrame;
})();

class Player {
  constructor(playerName) {
    this.x = -300;
    this.y = -300;
    this.width = 468/6;
    this.height = 100;
    this.speed = 3.0;
    this.velX = 0;
    this.velY = 0;
    this.holding = null;
    this.sprite = player_static;
    this.hp = 3;
    this.name = playerName;
    this.frame = 0;
    console.log("made a player object")
  }
  transitionToState(destination) {
    // TODO
  }

  draw() {
    console.log("hitting player draw call")
    var argx = 0;
    const SMALL = 0.01;
    if (this.velX > SMALL) { //facing right, walking
      this.sprite = document.querySelector("#player_walk_R");
      argx = player_frame*this.width;
    } else if (this.velX < -SMALL) { //facing left, walking
      this.sprite = document.querySelector("#player_walk_L");
      argx = player_frame*this.width;
    } else { //standing
      this.sprite = document.querySelector("#player_static");
      argx = 5*this.width;
    }

    ctx.drawImage(this.sprite, argx, 0, this.width, this.height, this.x, this.y, this.width, this.height);
    // debug visualization
    //ctx.beginPath();
    //ctx.rect(this.x, this.y, this.width, this.height);
    //if (colCheck(this, {x: currentState.ship.x - 68*1.5, y: currentState.ship.y, width: 68*1.5*2, height: 55*1.5}) || pointInEllipse(this, currentState.ship)) {
    //  ctx.fillStyle = "red";
    //} else {
    //ctx.strokeStyle = "red";
    //ctx.stroke();
  }
}

class Ship {
  constructor() {
    // TODO
  }
  transitionToState(destination) {
    // TODO
  }
}

function displayInfoText(s) {
  let n = document.querySelector("#text_display");
  while (n.hasChildNodes()) {
    n.removeChild(n.lastChild);
  }
  document.querySelector("#text_display_box").style.display = "inline";
  n.appendChild(s);
  document.querySelector("#text_box_button").onclick = function (e) {
    n.innerHTML = "";
    document.querySelector("#text_display_box").style.display = "none";
  }
}

// GLOBALS GLOBALS GLOBALS
var playerName = "";
var player = null;
var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
const T = 64; //tile size
canvas.width = 18*T;
canvas.height = 12*T;
let currentState = new Splash(); //DEBUG new Planet("xkcd2", null);
let keys = [];
let player_frame = 0;

let naming_mode = false;
let help_mode = false;
let shipimage = null;
(function () {
  let shipsvg = mySVG.cloneNode(true);
  shipsvg.querySelector("#spaceDome").style.display = "inline";
  shipsvg.querySelector("#spaceDome").setAttribute("transform", "scale(1.5)");
  let shipwrap = document.createElement("div");
  shipwrap.appendChild(shipsvg);
  shipimage = new Image();
  shipimage.src = "data:image/svg+xml;base64," + window.btoa(shipwrap.innerHTML);
}());
let message = null;
let message_display_frames_remaining = 0;
let sounds = {
  place_item: new sound("audio/place_item.wav"),
};
function play_random_music() {
  switch (randBetween(Math.random, 1, 5)) {
    case 1: document.getElementById("SSU-1").play(); break;
    case 2: document.getElementById("SSU-2").play(); break;
    case 3: document.getElementById("SSU-3").play(); break;
    case 4: document.getElementById("SSU-4").play(); break;
  }
}
document.getElementById("SSU-1").addEventListener("ended", play_random_music);
document.getElementById("SSU-2").addEventListener("ended", play_random_music);
document.getElementById("SSU-3").addEventListener("ended", play_random_music);
document.getElementById("SSU-4").addEventListener("ended", play_random_music);
play_random_music();
// END GLOBALS GLOBALS GLOBALS

function makeToast(newToast) { // AM I HAVING A STROKE!?
  message = newToast;
  message_display_frames_remaining = 150;
}

function wordWrap( text, width ) {
    var lines = [];
    var words = text.split(' ');
    var current_line = '';
    for (var i = 0; i < words.length; i += 1) {
      var word = words[i];
      if (ctx.measureText(current_line + ' ' + word).width > width) {
        lines.push(current_line);
        current_line = word;
      } else {
        current_line = current_line + ' ' + word;
      }
    }
    lines.push(current_line);
    return lines;
}

function drawToast() {
  ctx.font = "12px sans-serif";
  if (message_display_frames_remaining > 0) {
    let toast_x = canvas.width * 0.8, toast_y = canvas.height * 0.9, toast_w = 203, toast_h = 60;
    if (message_display_frames_remaining > 50) {
      ctx.fillStyle = "black";
      ctx.fillRect(toast_x, toast_y, toast_w, toast_h);
      ctx.fillStyle = "white";
    } else {
      var f = message_display_frames_remaining / 50;
      ctx.fillStyle = "rgba(0, 0, 0, " + f + ")";
      ctx.fillRect(toast_x, toast_y, toast_w, toast_h);
      ctx.fillStyle = "rgba(255, 255, 255, " + f + ")";
    }
    var lines = wordWrap(message, toast_w - 20);
    var lineHeight = ctx.measureText("M").width * 1.2;
    for (var i = 0; i < lines.length; i += 1) {
      ctx.fillText(lines[i], toast_x + 10, toast_y + lineHeight * (i+2));
    }
    message_display_frames_remaining--;
  }
}

function transitionToState(destinationState) {
  destinationState.addShipStuff(currentState.getShipStuff())
  currentState = destinationState;
}

function frame() {
  if (help_mode) {
    // ctx.fillStyle="010009";
    currentState.draw();
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(help, canvas.width/2-768/2, canvas.height/2-300);
  } else {
    currentState.update()
    currentState.draw();
  }
  ctx.drawImage(help_icon, canvas.width-20, 0);
  drawToast();
  requestAnimationFrame(frame);
}

document.body.addEventListener("keydown", function (e) {
  if (naming_mode) {
    // just do the default
    return;
  }
  if (e.keyCode == 39
    || e.keyCode == 68
    || e.keyCode == 37
    || e.keyCode == 65
    || e.keyCode == 38
    || e.keyCode == 87
    || e.keyCode == 40
    || e.keyCode == 83
    || e.keyCode == 32
    || e.keyCode == 81) {
    e.preventDefault();
    keys[e.keyCode] = true;
    if (e.keyCode == 32) {
      currentState.action();
    } else if (e.keyCode == 81) {
      console.log("pressed q")
      currentState.nom();
    }
  }
});

document.body.addEventListener("keyup", function (e) {
    keys[e.keyCode] = false;
});

canvas.addEventListener("click", function (e) {
  var x;
  var y;
  if (e.pageX || e.pageY) {
    x = e.pageX;
    y = e.pageY;
  }
  else {
    x = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  x -= canvas.offsetLeft;
  y -= canvas.offsetTop;
  if (x > canvas.width - 20 && x < canvas.width && y > 0 && y < 20) {
    help_mode = !help_mode;
  }
});

window.addEventListener("load", function () {
  frame();
});
