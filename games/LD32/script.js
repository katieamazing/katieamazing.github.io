WebFontConfig = {
  google: { families: [ 'Francois+One::latin' ] },
  active: function () {
    init();
  }
};
(function() {
  var wf = document.createElement('script');
  wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
    '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
  wf.type = 'text/javascript';
  wf.async = 'true';
  var s = document.getElementsByTagName('script')[0];
  s.parentNode.insertBefore(wf, s);
})();

// when the turret fires a dinosaur
var fire = new buzz.sound("fire.wav");
// when a dinosaur hits an alien
var hit = new buzz.sound("hit.wav");
// when an alien hits the turret
var lose = new buzz.sound("lose.wav");

var last_frame;
var aliens = [];
var bullets = [];
var alienTints = [
  0x00f36d,
  0x00f3ce,
  0x008ef2,
];
var bulletFrames = [
  "liz1.png",
  // "liz1 copy.png",
  "necky2.png",
  // "necky2 copy.png",
  "stego3.png",
  // "stego3 copy.png",
  "trex4.png",
  // "trex4 copy.png",
];

// create an new instance of a pixi stage
var stage = new PIXI.Stage(0x353535);

var W = 800; // width of the screen, in pixels
var H = 600; // height of the screen, in pixels 

// create a renderer instance
var renderer = PIXI.autoDetectRenderer(W, H);
// add the renderer view element to the DOM
document.body.appendChild(renderer.view);
// create some empty containers
var bulletContainer = new PIXI.DisplayObjectContainer();
var playerContainer = new PIXI.DisplayObjectContainer();
playerContainer.position.x = W / 2;
playerContainer.position.y = H;
var alienContainer = new PIXI.DisplayObjectContainer();
var alienStrategy = {
  act: function alienStrategyAct(delta) {
    var x = alienContainer.position.x;
    // drop down, speed up    
    if (this.min_x !== undefined && x + this.min_x < 0) {
      alienContainer.position.y += this.DROP;
      this.v = Math.abs(this.v) + this.ACCEL;
    } else if (this.max_x !== undefined && x + this.max_x >= W) {
      alienContainer.position.y += this.DROP;
      this.v = -1 * (Math.abs(this.v) + this.ACCEL);
    }
    alienContainer.position.x += this.v * delta;
    console.log(alienContainer.position.x);
  },
  add: function alienStrategyAdd(tint, x, y) {
    var alien = PIXI.Sprite.fromFrame("aliens.png");
    alien.tint = tint;
    alien.position.x = x;
    if (this.max_x === undefined || x > this.max_x) {
      this.max_x = x;
    }
    if (this.min_x === undefined || x < this.min_x) {
      this.min_x = x;
    }
    alien.position.y = y;
    alien.anchor.x = 0.5;
    alien.anchor.y = 0.5;
    aliens.push(alien);
    alienContainer.addChild(alien);
  },
  remove: function alienStrategyRemove(i) {
    alienContainer.removeChild(aliens[i]);
    aliens.splice(i, 1);
    this.max_x = undefined;
    this.min_x = undefined;
    for (j in aliens) {
      var x = aliens[j].position.x;
      if (this.max_x === undefined || x > this.max_x) {
        this.max_x = x;
      }
      if (this.min_x === undefined || x < this.min_x) {
        this.min_x = x;
      }
    }
  }
};

var playerStrategy = {
  act: function playerStrategyAct(delta) {
    if (this.pressing_left && !this.pressing_right) {
      playerContainer.position.x -= this.v * delta;
    } else if (this.pressing_right && !this.pressing_left) {
      playerContainer.position.x += this.v * delta;
    }
    if (playerContainer.position.x < 0) {
      playerContainer.position.x = 0;
    } else if (playerContainer.position.x > W) {
      playerContainer.position.x = W;
    }
    var i = aliens.length;
    while (i--) {
      var dx = alienContainer.position.x + aliens[i].position.x - playerContainer.position.x;
      var dy = alienContainer.position.y + aliens[i].position.y - playerContainer.position.y;
      if (dx * dx + dy * dy < 1000) {
        lose.stop().play();
        return true;
      }
    }
    return false;
  },
  start: function playerStrategyStart() {
    if (!this.player) {
      var playerTexture =
        PIXI.Texture.fromFrame("turret.png");
      this.player = new PIXI.Sprite(playerTexture);
      this.player.anchor.x = 0.5;
      this.player.anchor.y = 1.0;
    }
    playerContainer.addChild(this.player);
  },
  stop: function playerStrategyStop() {
    playerContainer.removeChild(this.player);
  },
  v: 0.4, // pixels per millisecond
  pressing_left: false,
  pressing_right: false,
  pressing_fire: false,
};

window.addEventListener("keydown",
  function onKeyDown(event) {
    if (event.keyCode == 65 /* a */
        || event.keyCode == 37 /* left */
        || event.keyCode === 83 /* s */) {
      playerStrategy.pressing_left = true;
      event.preventDefault();
    } else if (event.keyCode == 39 /* right */
               || event.keyCode === 68 /* d */) {
      playerStrategy.pressing_right = true;
      event.preventDefault();
    } else if (event.keyCode === 32 /* space */) {
      playerStrategy.pressing_fire = true;
      event.preventDefault();
    }
  },
  false
);

window.addEventListener("keyup",
  function onKeyUp(event) {
    if (event.keyCode == 65 /* a */
        || event.keyCode == 37 /* left */
        || event.keyCode === 83 /* s */) {
      playerStrategy.pressing_left = false;
      event.preventDefault();
    } else if (event.keyCode == 39 /* right */
               || event.keyCode === 68 /* d */) {
      playerStrategy.pressing_right = false;
      event.preventDefault();
    } else if (event.keyCode === 32 /* space */) {
      playerStrategy.pressing_fire = false;
      event.preventDefault();
    }
  },
  false
);

var bulletStrategy = {
  ready: function bulletStrategyReady(now) {
    return this.added &&
      (!this.last_fired || now > this.last_fired + this.COOLDOWN);
  },
  act: function bulletStrategyAct(delta, now) {
    if (playerStrategy.pressing_fire && this.ready(now)) {
      var which = bulletFrames[Math.floor(Math.random() * bulletFrames.length)];
      var bullet = PIXI.Sprite.fromFrame(which);
      bullet.position.x = playerContainer.position.x;
      bullet.position.y = playerContainer.position.y - 45;
      bullet.anchor.x = 0.5;
      bullet.anchor.y = 0.5;
      bullet.rotation = Math.random() * 360;
      bullets.push(bullet);
      bulletContainer.addChild(bullet);
      this.last_fired = now;
      fire.stop().play();
    }
    for (i in bullets) {
      bullets[i].rotation += 0.005 * delta;
      bullets[i].position.y -= 0.5 * delta;
    }
    var i = aliens.length;
    while (i--) {
      var j = bullets.length;
      while (j--) {
        var dx = alienContainer.position.x + aliens[i].position.x - bullets[j].position.x;
        var dy = alienContainer.position.y + aliens[i].position.y - bullets[j].position.y;
        if (dx * dx + dy * dy < 1000) {
          bulletStrategy.remove(j);
          alienStrategy.remove(i);
          hit.stop().play();
          break;
        }
      }
    }
  },
  start: function bulletStrategyStart() {
    this.added = true;
  },
  stop: function bulletStrategyStop() {
    this.added = false;
  },
  remove: function bulletStrategyRemove(j) {
    bulletContainer.removeChild(bullets[j]);
    bullets.splice(j, 1);
  }
};

function wave(args) {
  return {
    setup: function () {
      playerStrategy.stop();
      bulletStrategy.stop();
      playerContainer.removeChildren();
      alienContainer.removeChildren();
      stage.removeChildren();

      bulletStrategy.COOLDOWN = args.cooldown; 
      alienStrategy.v = args.initial_speed;
      alienStrategy.DROP = args.drop;
      alienStrategy.ACCEL = args.accel;
      this.bg = PIXI.Sprite.fromFrame(args.bg);
      stage.addChild(this.bg);
      stage.addChild(bulletContainer);
      stage.addChild(playerContainer);
      stage.addChild(alienContainer);
      for (var row = 0; row < args.rows; row++) {
        for (var col = 0; col < args.cols; col++) {
          alienStrategy.add(
            alienTints[row % 3],
            H * col / args.cols,
            (W * 0.35) * row / args.rows
         );
        }
      }
      alienContainer.position.x = (W - (alienStrategy.max_x - alienStrategy.min_x))/2;
      alienContainer.position.y = 0;
      playerStrategy.start();
      bulletStrategy.start();
    },
    animate: function (delta, now) {
      console.log('wave ' + args.name + ' animating');
      alienStrategy.act(delta);
      bulletStrategy.act(delta, now);
      var died = playerStrategy.act(delta);
      return died ? 'lose' : (aliens.length == 0 ? args.next : args.name);
    },
  }
}

function message(args) {
  return {
    setup: function () {
      this.text = new PIXI.Text(args.what_to_say, args.style);
      this.text.anchor.x = 0.5;
      this.text.anchor.y = 0.5;
      this.text.position.x = W / 2;
      this.text.position.y = H / 2;
      stage.addChild(this.text);
    },
    animate: function loseAnimate(delta, now) {
      if (!this.begin) {
        this.begin = now;
      }
      bulletStrategy.act(delta, now);
      return (now > this.begin + 3000) ? args.next : args.name;
    },
    teardown: function loseTeardown() {
      this.begin = undefined;
    }
  }
}


var game = {
  current: 'loading',
  stage: {
    loading: {
      count: 0,
      animate: function loadingAnimate(delta, now) {
        if (!this.text) {
          this.text = new PIXI.Text(
            "Loading...",
            {font:"50px Arial", fill:"white"}
          );
          stage.addChild(this.text);
        }
        return 'loading';
      },
      loaded: function loadingLoaded() {
        console.log('loadingLoaded count is ' + this.count);
        this.count += 1;
        return this.count > 1 ? 'splash': 'loading';
      },
      teardown: function loadingTeardown() {
        stage.removeChild(this.text);
      }
    },
    splash: {
      setup: function splashSetup() {
        this.bg = this.bg || PIXI.Sprite.fromFrame("bg1.png");
        stage.addChild(this.bg);
        this.text = this.text ||
          new PIXI.Text("Extinction Explosion!!!", 
          {font:"50px Francois One", fill:"white"}
        );
        this.text.anchor.x = 0.5;
        this.text.anchor.y = 1.0;
        this.text.position.x = W / 2;
        this.text.position.y = H / 2;
        stage.addChild(this.text);
      },
      animate: function splashAnimate(delta, now) {
        return playerStrategy.pressing_fire ? 'first' : 'splash';
      },
      teardown: function splashTeardown() {
        stage.removeChild(this.text);
        stage.removeChild(this.bg);
      }
    },
    lose: message({name: 'lose',
      next: 'splash',
      what_to_say: 'YOU LOSE',
      style: {font:"50px Fracois One", fill:"red"},
    }),
    first: wave({name: 'first',
      next: 'tween12',
      rows: 5, // of aliens
      cols: 11, // of aliens
      cooldown: 150, // ms between bullets at max rate
      initial_speed: 0.1, // pixels per m
      drop: 10, // pixels per drop
      accel: 0.01, // increase in pixels per ms per drop
      bg: "bg1.png",
    }),
    tween12: message({name: 'tween12',
      next: 'second',
      what_to_say: 'ONE DOWN TWO TO GO',
      style: {font:"50px Fracois One", fill:"white"},
    }),
    second: wave({name: 'second',
      next: 'tween23',
      rows: 5, // of aliens
      cols: 11, // of aliens
      cooldown: 150, // ms between bullets at max rate
      initial_speed: 0.1, // pixels per m
      drop: 10, // pixels per drop
      accel: 0.01, // increase in pixels per ms per drop
      bg: "bg2.png",
    }),
    tween23: message({name: 'tween23',
      next: 'third',
      what_to_say: 'TWO DOWN ONE TO GO',
      style: {font:"50px Fracois One", fill:"white"},
    }),
    third: wave({name: 'third',
      next: 'win',
      rows: 5, // of aliens
      cols: 11, // of aliens
      cooldown: 150, // ms between bullets at max rate
      initial_speed: 0.1, // pixels per m
      drop: 10, // pixels per drop
      accel: 0.01, // increase in pixels per ms per drop
      bg: "bg3.png",
    }),
    win: message({name: 'win',
      next: 'splash',
      what_to_say: 'YOU WIN',
      style: {font:"50px Fracois One", fill:"white"},
    }),
  },
  animate: function gameAnimate(delta, now) {
    var next = this.stage[this.current].animate(delta, now);
    this.transition(next);
  },
  loaded: function gameLoaded() {
    if (this.stage[this.current].loaded) {
      this.transition(this.stage[this.current].loaded());
    }
  },
  transition: function gameTransition(next) {
    if (this.current != next) {
      console.log("switching scene from " + this.current + " to " + next);
      if (this.stage[this.current].teardown) {
        this.stage[this.current].teardown();
      }
      if (this.stage[next].setup) {
        this.stage[next].setup();
      }
      this.current = next;
    }
  }
}

loader = new PIXI.AssetLoader(["sprites2pm.json"]);
loader.onComplete = game.loaded.bind(game);
loader.load();
function init() {
  game.loaded();
}

function animate(now) {
  if (!last_frame) {
    last_frame = now;
  }
  var delta = now - last_frame;
  game.animate(delta, now);
  renderer.render(stage);
  requestAnimFrame(animate);
  last_frame = now;
};
requestAnimFrame(animate);
