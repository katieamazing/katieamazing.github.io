// external js: packery.pkgd.js, draggabilly.pkgd.js
  //'use strict'; TODO
var pckry = new Packery( '.grid', {
  itemSelector: '.grid-item',
  columnWidth: 100,
  //originTop: false //TODO has some issue with draggabilly
});

pckry.getItemElements().forEach( function( itemElem ) {
  var draggie = new Draggabilly( itemElem );
  pckry.bindDraggabillyEvents( draggie );
});

// GAME GRID LOGIC //

  (function () {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
  })();


// CLASSY CLASSES //

  class Monst {

    constructor (spriteR, spriteL, deadsprite, desc) {
      this.spriteR = spriteR;
      this.spriteL = spriteL;
      this.deadsprite = deadsprite;
      this.desc = desc;
    }

    click(x, y) {
      if (pointCheck(x, y, this)){
        document.getElementById('message').textContent=this.desc;
        updateCSS();
      }
    }

    update(canvasid) {
      this.x += this.velX;
      this.y += this.velY;

      //limit movement to current canvas
      var canvas = document.querySelector(canvasid),
        ctx = canvas.getContext('2d'),
        width = ctx.canvas.clientWidth,
        height = ctx.canvas.clientHeight;

      if (this.x <= 0) {
        this.x = 0;
        this.velX *= -1;
      } else if (this.x >= width-SIZE) {
        this.x = width-SIZE;
        this.velX *= -1;
      }

      if (this.y <= 0) {
        this.y = 0;
        this.velY *= -1;
      } else if (this.y >= height-SIZE) {
        this.y = height-SIZE;
        this.velY *= -1;
      }
    }

    draw(canvasid) {
      let canvas = document.querySelector(canvasid),
        ctx = canvas.getContext('2d'),
        sprite = '';
        if (this.velX >= 0) {
          sprite = document.querySelector(this.spriteR);
        } else {
          sprite = document.querySelector(this.spriteL);
        }
      drawPlayerSprite(ctx, sprite, frame*SIZE, this.x, this.y);
    }

    collide(dir) {
      if (this.owdir(dir)) {
        sfx.ow.play();
      } else if (this.windir(dir)) {
        this.there -= 1;
        if (this.there === 0){
          sfx.points.play();
          var num_loots = loot[this.deadsprite];
          if (num_loots < 3) {
            loot[this.deadsprite] += 1;
            checkWin();
          }
        }
      }
    }
  }

  class Bee extends Monst {
    constructor (x, y, velX, velY) {
      super('#mob_beesR', '#mob_beesL', '#mob_deadbee',
        'An earth bee brought to make sweet, sweet honey on the moon! Watch out for the pointy end.');
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
      this.width = 1;
      this.height = 1;
      this.there = 1;
    }

    owdir(dir){
      return (dir === 't');
    }

    windir(dir){
      return (dir === 'b');
    }
  }

  class Snail extends Monst {
    constructor (x, y, velX, velY) {
      super('#mob_snailR', '#mob_snailL', '#mob_deadsnail',
        'A sugar snail with a tough shell.');
      this.x = x;
      this.y = y;
      this.velX = velX;
      this.velY = velY;
      this.width = 1;
      this.height = 1;
      this.there = 60;
    }

    owdir(dir){
      return (dir === 'l' || dir === 'r');
    }

    windir(dir){
      return (dir === 'b');
    }

  }

  class Berry extends Monst {
    constructor (x, y) {
      super('#it_strawb', '#it_strawb', '#it_deadstrawb',
        'A strawberry bush, ready to be tended and harvested.');
      this.x = x;
      this.y = y;
      this.velX = 0;
      this.velY = 0;
      this.width = 1;
      this.height = 1;
      this.there = 60;
    }

    owdir(dir){
      return false;
    }

    windir(dir){
      return (dir === 'l' || dir === 'r');
    }

    draw(canvasid) {
      let canvas = document.querySelector(canvasid),
        ctx = canvas.getContext('2d'),
        sprite = document.querySelector(this.spriteR);
      if (this.there < 25) {
        drawPlayerSprite(ctx, sprite, 0*SIZE, this.x, this.y);
      } else {
        drawPlayerSprite(ctx, sprite, 1*SIZE, this.x, this.y);
      }
    }

    collide(dir){
      if (this.windir(dir)) {
        this.there -= 1;
        if (this.there === 0){
          sfx.points.play();
          loot[this.deadsprite] += 1;
          this.there = 60;
          checkWin();
        }
      }
    }
  }

  // GAME RENDERING //
  const SIZE = 21,
    button = {sprite:'#it_button', actdir: 'b',
              desc: 'Toggle the PROGRESS DISPLAY 8K on or off.'},
    sfx = {ow: new sound('audio/ow.wav'), points: new sound('audio/points.wav'),
           doorL: new sound('audio/tele_tonedown.wav'), doorR: new sound('audio/tele_toneup.wav'),
           land: new sound('audio/land.wav')
          };

  var grid =
  [ {canvasid:'#threesq', bgsprite:'#three', vis:true, friction: 0.8, gravity: 0.1,
      plats:[ {x:200, y:150, width:1, height:1, sprite:'#terL'}
            , {x:200+21, y:150, width:1, height:1, sprite:'#ter'}
            , {x:60, y:240, width:1, height:1, sprite:'#terL'}
            , {x:60+21, y:240, width:4, height:1, sprite:'#ter'}
            , {x:30, y:130, width:1, height:1, sprite:'#terS'}],
      doors:[ {x:300-13, y:30, width: 0.5, height:1, sprite:'#doorL'}
            , {x:0, y:230, width: 0.5, height:1, sprite:'#doorR'}],
      monst:[ new Snail(0, 300-18, .2, 0)
            , new Snail(220, 300-16, -.2, 0)
            , new Berry(200+10, 150-21)],
      items:[ ]
    }
  , {canvasid:'#bigsq', bgsprite:'#work', vis:true, friction: 0.8, gravity: 0.3,
      plats:[ {x:100, y:150, width:3, height:1, sprite:'#flr'}
            , {x:20, y:90, width:4, height:1, sprite:'#ctw'}],
      doors:[ {x:0, y:30, width: 0.5, height:1, sprite:'#doorR'}
            , {x:0, y:130, width: 0.5, height:1, sprite:'#doorR'}],
      monst:[ new Snail(0, 200-18, .2, 0)],
      items:[ {x:40, y:90-21+6, width:1, height:1, id:button, state:0, target:'#info'}]
    }
  , {canvasid:'#minisq', bgsprite:'#little', vis:true, friction: 0.8, gravity: 0.3,
      plats:[ {x:50, y:50, width:1, height:1, sprite:'#flr'}],
      doors:[ {x:100-13, y:30, width: 0.5, height:1, sprite:'#doorL'}],
      monst:[],
      items:[]
    }
  , {canvasid:'#tallrect', bgsprite:'#tall', vis:true, friction: 0.8, gravity: 0.3,
      plats:[ {x:20, y:90, width:2, height:1, sprite:'#ctw'}],
      doors:[ {x:100-13, y:130, width: 0.5, height:1, sprite:'#doorL'}],
      monst:[],
      items:[]
    }
  , {canvasid:'#fatrect', bgsprite:'#fat', vis:true, friction: 0.8, gravity: 0.3,
      plats:[],
      doors:[ {x:200-13, y:30, width: 0.5, height:1, sprite:'#doorL'}
            , {x:0, y:30, width: 0.5, height:1, sprite:'#doorR'}],
      monst:[ new Bee(0, 21, .5, 0)
            , new Bee(75, 34, -.4, .2)
            , new Bee(50, 10, .4, -.2) ],
      items:[]
     }
   , {canvasid:'#info', bgsprite:'#one', vis:false, friction: 0.8, gravity: 0.3,
       plats:[ {x:50, y:50, width: 1, height:1, sprite:'#lootreadout'},
               {x:50, y:50, width: 5, height:1, sprite:'#none'},
               {x:16, y:176, width: 8, height:1, sprite:'#flr'}],
       doors:[ {x:0, y:130, width: 0.5, height:1, sprite:'#doorR'},
               {x:200-13, y:130, width: 0.5, height:1, sprite:'#doorL'}],
       monst:[],
       items:[]
      }
  ]

  var canvas = document.querySelector('#bigsq'),
    ctx = canvas.getContext('2d'),
    width = ctx.canvas.clientWidth,
    height = ctx.canvas.clientWidth,
    players = [{
      x: width/2,
      y: 60,
      width: 1,
      height: 1,
      speed: 3.25,
      velX: 0,
      velY: 0,
      grounded: false,
      justlanded: 20,
      id: 1,
      sprite: document.querySelector('#player'),
      active: '#bigsq',
      desc: 'Player 1 is light and fast, making him quick to get around the map. Control him with WASD keys.'},
      {x: 30,
      y: 60,
      width: 1,
      height: 1,
      speed: 2.5,
      velX: 0,
      velY: 0,
      grounded: false,
      justlanded: 20,
      id: 2,
      sprite: document.querySelector('#player2'),
      active: '#tallrect',
      desc: 'Player 2 is heavier and a little slower, making her great at pressing buttons. Control her with the arrow keys.'
    }],
    keys = [],
    loot = {'#mob_deadbee': 0, '#mob_deadsnail': 0, '#it_deadstrawb': 0},
    animationStart = performance.now(),
    frame = 0;


  window.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
  });

  for (var i = 0; i < grid.length; i++) {
    var target = document.querySelector(grid[i].canvasid);
    target.addEventListener('click', clickHandler(grid[i].canvasid));
  }

  function clickHandler(id) { //factory function, manufactures event handlers specific to that id
    return (e) => {
      var rect = (document.querySelector(id)).getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        index = grid.map((o) => o.canvasid).indexOf(id);
      for (var i = 0; i < grid[index].monst.length; i++) {
          grid[index].monst[i].click(x, y);
      }
      for (var i = 0; i < grid[index].items.length; i++) {
        if (pointCheck(x, y, grid[index].items[i])){
          document.getElementById('message').textContent=grid[index].items[i].id.desc;
          updateCSS();
        }
      }
      for (var i = 0; i < players.length; i++) {
        if (pointCheck(x, y, players[i])){
          document.getElementById('message').textContent=players[i].desc;
          updateCSS();
        }
      }
    };
  }

  function updateCSS() {
    var message = document.getElementById('message');
    if (message.classList.contains('is-paused')){
      message.classList.remove('is-paused');
    }
    message.classList.remove('fade-Out');
    setTimeout(function() {
      message.classList.add('fade-Out')
    }, 0);
  }

  function sound(src) {
    this.sound = document.createElement('audio');
    this.sound.src = src;
    this.sound.setAttribute('preload', 'auto');
    this.sound.setAttribute('controls', 'none');
    this.sound.style.display = 'none';
    this.sound.volume = 0.6;
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
  }

  function checkWin() {
    let win = 0;
    for(var key in loot) {
      if (loot[key] === 3) {
        win++;
      }
    }
    if (win === 3) {
      let message = document.getElementById('message')
      message.textContent='You got all the Sugar on the Moon! What a winner :)';
      message.classList.add('is-paused');
      message.classList.remove('fade-Out');
      return true;
    } else {
      return false
    }
  }

  function drawSprite(ctx, sprite, x, y){
    ctx.drawImage(sprite, x, y);
  }

  function drawPlayerSprite(ctx, sprite, xloc, x, y){
    ctx.drawImage(sprite, xloc, 0, SIZE, SIZE, x, y, SIZE, SIZE);
  }

  function keypresses(player) {
    if (player.id == 1) {
      if (keys[68]) { //right
        if (player.velX < player.speed) {
          player.velX++;
          player.justlanded = 0;
        }
      }
      if (keys[65]) { //left
        if (player.velX > -player.speed) {
          player.velX--;
          player.justlanded = 0;
        }
      }
      if (keys[87]) { //up
        if (player.grounded === true) {
          player.grounded = false;
          player.velY = -player.speed * 2;
          player.justlanded = 0;
        }
      }
    } else {
      if (keys[39]) { //right
        if (player.velX < player.speed) {
          player.velX++;
          player.justlanded = 0;
        }
      }
      if (keys[37]) { //left
        if (player.velX > -player.speed) {
          player.velX--;
          player.justlanded = 0;
        }
      }
      if (keys[38]) { //up
        if (player.grounded === true) {
          player.grounded = false;
          player.velY = -player.speed * 2;
          player.justlanded = 0;
        }
      }
    }
  }

  function playerColHandler(dir, audio, player) {
    if (dir === null) {return;}
    if (dir === 'l' || dir === 'r') {
      player.velX = 0;
    } else if (dir === 'b') {
      if (player.grounded === false) {
        if (audio) {sfx.land.play();};
        player.justlanded = 10;}
      player.velY = 0;
      player.grounded = true;
    } else if (dir === 't') {
      player.velY *= -1;
    }
  }

  function colCheck(shapeA, shapeB) {
    // get the vectors to check against
    var vX = (shapeA.x + ((shapeA.width*SIZE) / 2)) - (shapeB.x + ((shapeB.width*SIZE) / 2)),
        vY = (shapeA.y + ((shapeA.height*SIZE) / 2)) - (shapeB.y + ((shapeB.height*SIZE) / 2)),
        // add the half widths and half heights of the objects
        hWidths = ((shapeA.width*SIZE) / 2) + ((shapeB.width*SIZE) / 2),
        hHeights = ((shapeA.height*SIZE) / 2) + ((shapeB.height*SIZE) / 2),
        colDir = null;
    // if the x and y vector are less than the half width or half height, then we must be inside the object, causing a collision
    if (Math.abs(vX) <= hWidths && Math.abs(vY) <= hHeights) {
        // figures out on which side we are colliding (top, bottom, left, or right)
        var oX = hWidths - Math.abs(vX),
            oY = hHeights - Math.abs(vY);
        if (oX >= oY) {
            if (vY > 0) {
                colDir = 't';
                //shapeA.y += oY;
            } else {
                colDir = 'b';
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = 'l';
                shapeA.x += oX;
            } else {
                colDir = 'r';
                shapeA.x -= oX;
            }
        }
    }
    return colDir;
  }

  function pointCheck(x, y, shape) {
    if (x > shape.x && x < (shape.x + shape.width*SIZE)
        && y > shape.y && y < (shape.y + shape.height*SIZE)) {
          return true;
    } else {
      return false;
    }
  }

  function testDoors(canvasL, doorL, canvasR, doorR){
    var Lx = parseInt(document.querySelector(canvasL).style.getPropertyValue('left')) + doorL.x
    var Rx = parseInt(document.querySelector(canvasR).style.getPropertyValue('left')) + doorR.x + 13//doorR.x should be zero in true cases

    var Ly = parseInt(document.querySelector(canvasL).style.getPropertyValue('top')) + doorL.y;
    var Ry = parseInt(document.querySelector(canvasR).style.getPropertyValue('top')) + doorR.y

    if (Lx === Rx && Ly === Ry) {
      return true;
    } else {
      return false;
    }
  }

  function loopDoors(dir, door, player){
    if (dir === 'r') {
      for (var i = 0; i < grid.length; i++) {
        if (grid[i].canvasid !== player.active) {
          for (var j = 0; j < grid[i].doors.length; j++){
            if (testDoors(grid[i].canvasid, grid[i].doors[j], player.active, door)) {
              transferPlayer(dir, grid[i].doors[j].x, grid[i].doors[j].y, player.active, grid[i].canvasid, player);
              return
            }
          }
        }
      }
    }

    if (dir === 'l') {
      for (var i = 0; i < grid.length; i++) {
        if (grid[i].canvasid !== player.active) {
          for (var j = 0; j < grid[i].doors.length; j++){
            if (testDoors(player.active, door, grid[i].canvasid, grid[i].doors[j])){
              transferPlayer(dir, grid[i].doors[j].x, grid[i].doors[j].y, player.active, grid[i].canvasid, player);
              return
            }
          }
        }
      }
    }
  }

  function transferPlayer(dir, x, y, originCanvas, destCanvas, player){
    player.active = destCanvas;
    player.y = y;
    if (dir === 'l') {
      player.x = x - SIZE;
      sfx.doorL.play();
    } else {
      player.x = 13;
      sfx.doorR.play();
    }
  }

  function updatePlayer(player) {
    var index = grid.map((o) => o.canvasid).indexOf(player.active);
    //update with physics constants
    player.velX *= grid[index].friction;
    player.velY += grid[index].gravity;
    player.x += player.velX;
    player.y += player.velY;

    if (player.justlanded > 0) {
      player.justlanded--;
    }

    //limit movement to current canvas
    var canvas = document.querySelector(player.active),
      ctx = canvas.getContext('2d'),
      width = ctx.canvas.clientWidth,
      height = ctx.canvas.clientHeight;

    if (player.x <= 0) {
      player.x = 0;
    } else if (player.x >= width-SIZE) {
      player.x = width-SIZE;
    }

    if (player.y <= 0) {
      player.y = 0;
    } else if (player.y >= height-SIZE) {
      if (player.grounded === false) {
        player.justlanded = 10;}
      player.y = height-SIZE;
      player.grounded = true;
    }

    //plat collisions
    for (var i = 0; i < grid[index].plats.length; i++) {
      var dir = colCheck(player, grid[index].plats[i]);
      playerColHandler(dir, true, player);
    }

    //door collisions
    for (var j = 0; j < grid[index].doors.length; j++) {
      var dir = colCheck(player, grid[index].doors[j]);
      if (dir === 'l') {
        player.velX = 0;
        loopDoors(dir, grid[index].doors[j], player);
      } else if (dir === 'r') {
        player.velX = 0;
        loopDoors(dir, grid[index].doors[j], player);
      } else {
        playerColHandler(dir, true, player);
      }
    }

    //mob collisions
    for (var k = 0; k < grid[index].monst.length; k++) {
      if (grid[index].monst[k].there) {
        var dir = colCheck(player, grid[index].monst[k]);
        grid[index].monst[k].collide(dir);
        playerColHandler(dir, false, player);
      }
    }
    //item collisions
    for (var l = 0; l < grid[index].items.length; l++) {

      var dir = colCheck(player, grid[index].items[l]);
        if (grid[index].items[l].id == button) {
          if (player.id === 1) { continue; }
          let targetIndex = grid.map((o) => o.canvasid).indexOf(grid[index].items[l].target);
          if (dir === grid[index].items[l].id.actdir && grid[index].items[l].state === 0) {
            console.warn('button press');
            grid[index].items[l].state = 1;
            grid[targetIndex].vis = true;
            document.querySelector(grid[targetIndex].canvasid).style.display = 'block';
            for (var m = 0; m < pckry.items.length; m++){
              if (pckry.items[m].element === document.querySelector(grid[targetIndex].canvasid)) {
                pckry.layoutItems([pckry.items[m]], false);
              }
            }



            //sfx.ow.play();
          } else if (dir === null && grid[index].items[l].state === 1) {
            console.warn('button released');
            grid[index].items[l].state = 0;
            grid[targetIndex].vis = false;
            document.querySelector(grid[targetIndex].canvasid).style.display = 'none';

          }
        }
      playerColHandler(dir, false, player);
    }


    //check keys
    keypresses(player);
  }

  function drawPlayer(player, i) {
    //figure out which sprite to draw
    const SMALL = 0.01;
    var origX = 0;
    if (player.grounded === true) {
      if (player.justlanded > 0) {
        if (i == 0) {
          player.sprite = document.querySelector('#player_statics3f');
        } else {
          player.sprite = document.querySelector('#player2_statics3f');
        }
        if (player.velX > SMALL) {
          origX = 2*SIZE;
        } else {
          origX = 3*SIZE;
        }
      } else if (player.velX > SMALL) { //facing right
        if (i == 0) {
          player.sprite = document.querySelector('#player_walk2fR');
        } else {
          player.sprite = document.querySelector('#player2_walk2fR');
        }
        origX = frame*SIZE;
      } else if (player.velX < -SMALL) { //facing left
        if (i == 0) {
          player.sprite = document.querySelector('#player_walk2fL');
        } else {
          player.sprite = document.querySelector('#player2_walk2fL');
        }
        origX = frame*SIZE;
      } else {
        if (i == 0) {
          player.sprite = document.querySelector('#player_stand');
        } else {
          player.sprite = document.querySelector('#player2_stand');
        }
      }
    } else if (player.velY < -SMALL) { //rising
      if (i == 0) {
        player.sprite = document.querySelector('#player_statics3f');
      } else {
        player.sprite = document.querySelector('#player2_statics3f');
      }
      if (player.velX > SMALL) { //jumping up to the right
        origX = 1*SIZE;
      } else if (player.velX < -SMALL) { //jumping up to the left
        origX = 4*SIZE;
      }
    } else { //falling
      if (i == 0) {
        player.sprite = document.querySelector('#player_statics3f');
      } else {
        player.sprite = document.querySelector('#player2_statics3f');
      }
      if (player.velX > SMALL) { //falling to the right
        origX = 0;
      } else if (player.velX < -SMALL) { //falling to the left
        origX = 5*SIZE;
      }
    }

    //figure out which canvas to draw to
    var gridcanvas = document.querySelector(player.active),
        ctx = gridcanvas.getContext('2d');
    //draw
    drawPlayerSprite(ctx, player.sprite, origX, player.x, player.y);
  }

  function drawItems(canvasid, item) {
    var canvas = document.querySelector(canvasid),
      ctx = canvas.getContext('2d'),
      sprite = document.querySelector(item.id.sprite);
    drawPlayerSprite(ctx, sprite, item.state*SIZE, item.x, item.y);
  }

  function drawLoot(ctx) {
    let start_y = 71, start_x = 71, row = 0;
    for (var k in loot) {
      let number = loot[k],
          spriteImage = document.querySelector(k);
      if (number > 3) {number = 3};
      for (var i = 0; i < number; i++) {
        drawSprite(ctx, spriteImage, start_x+(i*SIZE), start_y+(row*SIZE));
      }
      row += 1;
    }
  }

  function drawEnv(griditem) {
    //set canvas context?
    var gridcanvas = document.querySelector(griditem.canvasid),
        ctx = gridcanvas.getContext('2d');
    //draw background
    ctx.drawImage(document.querySelector(griditem.bgsprite), 0, 0);
    //draw foreground
    for (var i = 0; i < griditem.plats.length; i++) {
      var spriteImage = document.querySelector(griditem.plats[i].sprite);
      for (var j = 0; j < griditem.plats[i].width; j++) {
        drawSprite(ctx, spriteImage, griditem.plats[i].x+(j*SIZE), griditem.plats[i].y);
      }
    }
    for (var i = 0; i < griditem.doors.length; i++) {
      drawSprite(ctx, document.querySelector(griditem.doors[i].sprite), griditem.doors[i].x, griditem.doors[i].y);
    }
    if (griditem.canvasid === '#info'){
      drawLoot(ctx);
    }
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    updatePlayer(players[0]);
    updatePlayer(players[1]);

    ctx.save();

    for (var i = 0; i < grid.length; i++) {
      if (grid[i].vis) {
        drawEnv(grid[i])
        for (var j =0; j < grid[i].monst.length; j++) {
          if (grid[i].monst[j].there){
            grid[i].monst[j].update(grid[i].canvasid);
            grid[i].monst[j].draw(grid[i].canvasid);
          }
        }
        for (var k =0; k < grid[i].items.length; k++) {
            drawItems(grid[i].canvasid, grid[i].items[k]);
        }
      }
    }

    //draw player sprite
    drawPlayer(players[0], 0);
    drawPlayer(players[1], 1);

    var duration = performance.now() - animationStart;
    duration = duration % (500);
    frame = Math.floor(duration / 250);

    requestAnimationFrame(update);
    ctx.restore();

  }

  window.addEventListener('load', function () {
    update();
  });
