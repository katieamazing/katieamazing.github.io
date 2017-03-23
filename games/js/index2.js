// external js: packery.pkgd.js, draggabilly.pkgd.js

var pckry = new Packery( '.grid', {
  itemSelector: '.grid-item',
  columnWidth: 100,
  //originTop: false //TODO has some issue with draggabilly
});

pckry.getItemElements().forEach( function( itemElem ) {
  var draggie = new Draggabilly( itemElem );
  pckry.bindDraggabillyEvents( draggie );
});

  // show item order after layout
  function orderItems() {
    pckry.getItemElements().forEach( function( itemElem, i ) {
      itemElem.textContent = i+1;
    });
  }

  pckry.on( 'layoutComplete', orderItems );
  pckry.on( 'dragItemPositioned', orderItems );

// GAME GRID LOGIC //

  (function () {
      var requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
      window.requestAnimationFrame = requestAnimationFrame;
  })();

  // GAME RENDERING //
  const SIZE = 21,
    bee = {spriteR:'#mob_beesR', spriteL:'#mob_beesL', owdir:'t', windir:'b',
           desc: 'An earth bee brought to make sweet, sweet honey on the moon! Watch out for the pointy end.'},
    snail = {spriteR:'#mob_snailR', spriteL:'#mob_snailL', owdir:'l' || 'r', windir:'b',
             desc: 'A sugar snail with a tough shell.'},
    button = {sprite:'#it_button', actdir: 'b',
              desc: 'Toggle the PROGRESS DISPLAY 8K on or off.'},
    sfx = {ow: new sound('audio/ow.wav'), points: new sound('audio/points.wav'),
           doorL: new sound('audio/tele_tonedown.wav'), doorR: new sound('audio/tele_toneup.wav'),
           land: new sound('audio/land.wav')
          };

  var grid =
  [ {canvasid:'#bigsq', bgsprite:'#work', vis:true,
      plats:[ {x:100, y:150, width:3, height:1, sprite:'#flr'}
            , {x:20, y:90, width:4, height:1, sprite:'#ctw'}],
      doors:[ {x:0, y:30, width: 0.5, height:1, sprite:'#doorR'}
            , {x:0, y:130, width: 0.5, height:1, sprite:'#doorR'}],
      monst:[ {x:0, y:200-18, width: 1, height:.75, id:snail, there:60, velX:.2, velY:0}],
      items:[ {x:40, y:90-21+6, width:1, height:1, id:button, state:0, target:'#info'}]
    }
  , {canvasid:'#minisq', bgsprite:'#little', vis:true,
      plats:[ {x:50, y:50, width:1, height:1, sprite:'#flr'}],
      doors:[ {x:100-13, y:30, width: 0.5, height:1, sprite:'#doorL'}],
      monst:[],
      items:[]
    }
  , {canvasid:'#tallrect', bgsprite:'#tall', vis:true,
      plats:[ {x:20, y:90, width:2, height:1, sprite:'#ctw'}],
      doors:[ {x:100-13, y:130, width: 0.5, height:1, sprite:'#doorL'}],
      monst:[],
      items:[]
    }
  , {canvasid:'#fatrect', bgsprite:'#fat', vis:true,
      plats:[],
      doors:[ {x:200-13, y:30, width: 0.5, height:1, sprite:'#doorL'}
            , {x:0, y:30, width: 0.5, height:1, sprite:'#doorR'}],
      monst:[ {x:0, y:21, width: 1, height:1, id:bee, there:1, velX:.5, velY:0}
            , {x:75, y:34, width: 1, height:1, id:bee, there: 1, velX:-.4, velY:.2}],
      items:[]
     }
   , {canvasid:'#info', bgsprite:'#work', vis:false,
       plats:[],
       doors:[ {x:0, y:130, width: 0.5, height:1, sprite:'#doorR'},
               {x:200-13, y:130, width: 0.5, height:1, sprite:'#doorL'}],
       monst:[],
       items:[]
      }
  ]

  var canvas = document.querySelector('#bigsq'),
    ctx = canvas.getContext("2d"),
    width = ctx.canvas.clientWidth,
    height = ctx.canvas.clientWidth,
    player = {
      x: width/2,
      y: height - 150,
      width: 1,
      height: 1,
      speed: 3,
      velX: 0,
      velY: 0,
      grounded: false,
      justlanded: 20,
      sprite: document.querySelector('#player'),
      active: '#bigsq'
    },
    keys = [],
    friction = 0.8,
    gravity = 0.3,
    animationStart = performance.now(),
    frame = 0;



  window.addEventListener('keydown', (e) => {
    keys[e.keyCode] = true;
  });

  window.addEventListener('keyup', (e) => {
    keys[e.keyCode] = false;
  });

  for (var i = 0; i < grid.length; i++) {
    target = document.querySelector(grid[i].canvasid);
    target.addEventListener('click', clickHandler(grid[i].canvasid));
  }

  function clickHandler(id) { //factory function, manufactures event handlers specific to that id
    return (e) => {
      var rect = (document.querySelector(id)).getBoundingClientRect(),
        x = e.clientX - rect.left,
        y = e.clientY - rect.top,
        index = grid.map((o) => o.canvasid).indexOf(id);
      for (var i = 0; i < grid[index].monst.length; i++) {
        if (pointCheck(x, y, grid[index].monst[i])){
          console.log(grid[index].monst[i].id.desc);
        }
      }
      for (var i = 0; i < grid[index].items.length; i++) {
        if (pointCheck(x, y, grid[index].items[i])){
          console.log(grid[index].items[i].id.desc);
        }
      }
    };
  }

  function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    this.sound.volume = 0.6;
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
  }

  function drawSprite(ctx, sprite, x, y){
    ctx.drawImage(sprite, x, y);
  }

  function drawPlayerSprite(ctx, sprite, xloc, x, y){
    ctx.drawImage(sprite, xloc, 0, SIZE, SIZE, x, y, SIZE, SIZE);
  }

  function playerColHandler(dir, audio) {
    if (dir === null) {return;}
    if (dir === "l" || dir === "r") {
      player.velX = 0;
    } else if (dir === "b") {
      if (player.grounded === false) {
        if (audio) {sfx.land.play();};
        player.justlanded = 10;}
      player.velY = 0;
      player.grounded = true;
    } else if (dir === "t") {
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
                colDir = "t";
                //shapeA.y += oY;
            } else {
                colDir = "b";
                shapeA.y -= oY;
            }
        } else {
            if (vX > 0) {
                colDir = "l";
                shapeA.x += oX;
            } else {
                colDir = "r";
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
        }
    else {
      return false;
    }
  }

  function testDoors(canvasL, doorL, canvasR, doorR){
    var Lx = parseInt(document.querySelector(canvasL).style.getPropertyValue("left")) + doorL.x
    var Rx = parseInt(document.querySelector(canvasR).style.getPropertyValue("left")) + doorR.x + 13//doorR.x should be zero in true cases

    var Ly = parseInt(document.querySelector(canvasL).style.getPropertyValue("top")) + doorL.y;
    var Ry = parseInt(document.querySelector(canvasR).style.getPropertyValue("top")) + doorR.y

    if (Lx === Rx && Ly === Ry) {
      return true;
    } else {
      return false;
    }
  }

  function loopDoors(dir, door){
    if (dir === 'r') {
      for (var i = 0; i < grid.length; i++) {
        if (grid[i].canvasid !== player.active) {
          for (var j = 0; j < grid[i].doors.length; j++){
            if (testDoors(grid[i].canvasid, grid[i].doors[j], player.active, door)) {
              transferPlayer(dir, grid[i].doors[j].x, grid[i].doors[j].y, player.active, grid[i].canvasid);
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
              transferPlayer(dir, grid[i].doors[j].x, grid[i].doors[j].y, player.active, grid[i].canvasid);
              return
            }
          }
        }
      }
    }
  }

  function transferPlayer(dir, x, y, originCanvas, destCanvas){
    player.active = destCanvas;
    player.y = y;
    if (dir === "l") {
      player.x = x - SIZE;
      sfx.doorL.play();
    } else {
      player.x = 13;
      sfx.doorR.play();
    }
  }

  function updatePlayer() {
    //update with physics constants
    player.velX *= friction;
    player.velY += gravity;
    player.x += player.velX;
    player.y += player.velY;

    if (player.justlanded > 0) {
      player.justlanded--;
    }

    //limit movement to current canvas
    var canvas = document.querySelector(player.active),
      ctx = canvas.getContext("2d"),
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
    var index = grid.map((o) => o.canvasid).indexOf(player.active);
    for (var i = 0; i < grid[index].plats.length; i++) {
      var dir = colCheck(player, grid[index].plats[i]);
      playerColHandler(dir, true);
    }

    //door collisions
    for (var j = 0; j < grid[index].doors.length; j++) {
      var dir = colCheck(player, grid[index].doors[j]);
      if (dir === "l") {
        player.velX = 0;
        loopDoors(dir, grid[index].doors[j]);
      } else if (dir === "r") {
        player.velX = 0;
        loopDoors(dir, grid[index].doors[j]);
      } else {
        playerColHandler(dir, true);
      }
    }

    //mob collisions
    for (var k = 0; k < grid[index].monst.length; k++) {
      if (grid[index].monst[k].there) {
        var dir = colCheck(player, grid[index].monst[k]);
        if (dir === grid[index].monst[k].id.owdir) {
          console.warn("OW");
          sfx.ow.play();
        } else if (dir ===  grid[index].monst[k].id.windir) {
          //call/callback to bee dying?
          grid[index].monst[k].there -= 1;
          if (grid[index].monst[k].there === 0){
            console.log("points for you");
            sfx.points.play();
          }
        }
        playerColHandler(dir, false);
      }
    }
    //item collisions
    for (var l = 0; l < grid[index].items.length; l++) {

      var dir = colCheck(player, grid[index].items[l]),
        targetIndex = grid.map((o) => o.canvasid).indexOf(grid[index].items[l].target)
      if (dir === grid[index].items[l].id.actdir) {
        console.warn("button press");
        grid[index].items[l].state = 1;
        document.querySelector('#info').style.display = 'block';
        grid[targetIndex].vis = true;

        //sfx.ow.play();
      } else if (dir === null) {
        grid[index].items[l].state = 0;
        document.querySelector('#info').style.display = 'none';
        grid[targetIndex].vis = false;
      }
      playerColHandler(dir, false);
    }

    //check keys
    if (keys[39] || keys[68]) { //right
      if (player.velX < player.speed) {
        player.velX++;
        player.justlanded = 0;
      }
    }
    if (keys[37] || keys[65]) { //left
      if (player.velX > -player.speed) {
        player.velX--;
        player.justlanded = 0;
      }
    }
    if (keys[38] || keys[32] || keys[87]) { //up
      if (player.grounded === true) {
        player.grounded = false;
        player.velY = -player.speed * 2;
        player.justlanded = 0;
      }
    }
  }

  function drawPlayer() {
    //figure out which sprite to draw
    const SMALL = 0.01;
    var origX = 0;
    if (player.grounded === true) {
      if (player.justlanded > 0) {
        player.sprite = document.querySelector('#player_statics3f');
        if (player.velX > SMALL) {
          origX = 2*SIZE;
        } else {
          origX = 3*SIZE;
        }
      } else if (player.velX > SMALL) { //facing right
        player.sprite = document.querySelector('#player_walk2fR');
        origX = frame*SIZE;
      } else if (player.velX < -SMALL) { //facing left
        player.sprite = document.querySelector('#player_walk2fL');
        origX = frame*SIZE;
      } else {
        player.sprite = document.querySelector('#player_stand');
      }
    } else if (player.velY < -SMALL) { //rising
      player.sprite = document.querySelector('#player_statics3f');
      if (player.velX > SMALL) { //jumping up to the right
        origX = 1*SIZE;
      } else if (player.velX < -SMALL) { //jumping up to the left
        origX = 4*SIZE;
      }
    } else { //falling
      player.sprite = document.querySelector('#player_statics3f');
      if (player.velX > SMALL) { //falling to the right
        origX = 0;
      } else if (player.velX < -SMALL) { //falling to the left
        origX = 5*SIZE;
      }
    }

    //figure out which canvas to draw to
    var gridcanvas = document.querySelector(player.active),
        ctx = gridcanvas.getContext("2d");
    //draw
    drawPlayerSprite(ctx, player.sprite, origX, player.x, player.y);
  }

  function updateMobs(canvasid, mob) {
    //update with physics constants
    //mob.velX *= friction;
    //mob.velY += gravity;
    mob.x += mob.velX;
    mob.y += mob.velY;

    //limit movement to current canvas
    var canvas = document.querySelector(canvasid),
      ctx = canvas.getContext("2d"),
      width = ctx.canvas.clientWidth,
      height = ctx.canvas.clientHeight;

    if (mob.x <= 0) {
      mob.x = 0;
      mob.velX *= -1;
    } else if (mob.x >= width-SIZE) {
      mob.x = width-SIZE;
      mob.velX *= -1;
    }

    if (mob.y <= 0) {
      mob.y = 0;
      mob.velY *= -1;
    } else if (mob.y >= height-SIZE) {
      mob.y = height-SIZE;
      mob.velY *= -1;
    }
  }

  function drawMobs(canvasid, mob) {
    var canvas = document.querySelector(canvasid),
      ctx = canvas.getContext("2d");
      if (mob.velX >= 0) {
        sprite = document.querySelector(mob.id.spriteR);
      } else {
        sprite = document.querySelector(mob.id.spriteL);
      }

    drawPlayerSprite(ctx, sprite, frame*SIZE, mob.x, mob.y);
  }

  function drawItems(canvasid, item) {
    var canvas = document.querySelector(canvasid),
      ctx = canvas.getContext("2d"),
      sprite = document.querySelector(item.id.sprite);
    drawPlayerSprite(ctx, sprite, item.state*SIZE, item.x, item.y);
  }

  function drawEnv(griditem) {
    //set canvas context?
    var gridcanvas = document.querySelector(griditem.canvasid),
        ctx = gridcanvas.getContext("2d");
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
  }

  function update() {
    ctx.clearRect(0, 0, width, height);

    updatePlayer();

    ctx.save();

    for (var i = 0; i < grid.length; i++) {
      if (grid[i].vis) {
        drawEnv(grid[i])
        for (var j =0; j < grid[i].monst.length; j++) {
          if (grid[i].monst[j].there){
            updateMobs(grid[i].canvasid, grid[i].monst[j]);
            drawMobs(grid[i].canvasid, grid[i].monst[j]);
          }
        }
        for (var k =0; k < grid[i].items.length; k++) {
            drawItems(grid[i].canvasid, grid[i].items[k]);
        }
      }
    }

    //draw player sprite
    drawPlayer();

    var duration = performance.now() - animationStart;
    duration = duration % (500);
    frame = Math.floor(duration / 250);

    requestAnimationFrame(update);
    ctx.restore();

  }

  window.addEventListener("load", function () {
    update();
  });
