// uses a global canvas, and T
// uses class Shelf
// uses a global player
// uses a global ctx
// uses space_bg_tiles, wine_room, and ship_image, drawables

class WineCellar {
  constructor(username, systems_seen) {
    this.ship = {x: 866, y: 378};
    this.x = 200;
    this.y = 200;
    this.native_hyperspace_stuff = [
      new Wormhole(canvas.width * 0.6, canvas.height * 0.5,
        function () {
          return new Space(username, systems_seen);
        }),
    ];
    this.bg = [];
    for (var row = 0; row < canvas.height/T; row++) {
      let y = row * 64;
      for (var col = 0; col < canvas.width/T; col++) {
        let x = col * 64;
        let argx = 0;
        if (Math.random() < 0.8) {
          argx = Math.floor(Math.random() * 12) * 64;
        }
        this.bg.push([argx, x, y]);
      }
    }

    this.native_hyperspace_stuff.push(new Shelf(26+this.x, 123+this.y, 59, 112, 0));
    this.native_hyperspace_stuff.push(new Shelf(103+this.x, 165+this.y, 187-103, 234-165, 1));
    this.native_hyperspace_stuff.push(new Shelf(206+this.x, 123+this.y, 59, 112, 2));
    this.native_hyperspace_stuff.push(new Shelf(378+this.x, 123+this.y, 59, 112, 3));
    this.native_hyperspace_stuff.push(new Shelf(468+this.x, 123+this.y, 59, 112, 4));

    this.stuff = [];
  }
  update() {
    if (keys[39] || keys[68]) {
      if (player.velX < player.speed) {
        player.velX++;
      }
    }
    if (keys[37] || keys[65]) {
      if (player.velX > -player.speed) {
        player.velX--;
      }
    }
    if (keys[38] || keys[87]) {
      if (player.velY > -player.speed) {
        player.velY--;
      }
    }
    if (keys[40] || keys[83]) {
      if (player.velY < player.speed) {
        player.velY++;
      }
    }
    if (player.holding !== null) {
      player.holding.move();
    }
    player.velX *= 0.8; //friction
    player.velY *= 0.8; //friction

    player.x += player.velX;
    player.y += player.velY;
  }
  draw() {
    // draw background
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fill();

    // draw sparkly space bits
    for (var img = 0; img < this.bg.length; img++) {
      ctx.drawImage(space_bg_tiles, this.bg[img][0], 0, T, T, this.bg[img][1], this.bg[img][2], T, T);
    }

    // draw wine room
    ctx.drawImage(wine_room, this.x, this.y);

    // draw ship
    ctx.drawImage(shipimage, this.ship.x - 150, this.ship.y - 200);

    // draw stuff
    for (var i = 0; i < this.native_hyperspace_stuff.length; i++) {
      this.native_hyperspace_stuff[i].draw();
    }
    // draw stuff
    for (var i = 0; i < this.stuff.length; i++) {
      this.stuff[i].draw();
    }
    // make sure to draw the thing the player is holding after the player,
    // so that it overlaps
    if (player.holding) {
      player.holding.draw();
    }
  }
  action() {
    for (var i = 0; i < this.native_hyperspace_stuff.length; i++) {
      if (colCheck(player, this.native_hyperspace_stuff[i])) {
        this.native_hyperspace_stuff[i].action();
        return;
      }
    }
    var found = [];
    for (var i = 0; i < this.stuff.length; i++) {
      if (this.stuff[i] === player) {
        // player can't action itself, silly!
      } else if (this.stuff[i] === player.holding) {
        // de-prioritize this, so we can load things
      } else if (colCheck(player, this.stuff[i])) {
        found.push(i);
      }
    }
    if (found.length == 1) {
      this.stuff[found[0]].action();
    } else if (found.length > 0) {
      this.stuff[found[found.length - 1]].action();
    } else if (player.holding) {
      // only if there is no other thing to do
      player.holding.action();
    }
  }

  nom() {
    if (player.hp < 4) {
      player.hp++;
    }
    this.removeIngredient(player.holding);
    player.holding = null;
  }

  removeIngredient(ingredient) {
    var index = this.stuff.indexOf(ingredient);
    if (index > -1) {
      this.stuff.splice(index, 1)
    }
  }

  getShipStuff() {
    var accumulator = [];
    for (var i = 0; i < this.stuff.length; i++) {
      // TODO(johnicholas): move the ship radius up and out
      if (colCheck(this.stuff[i], {x: this.ship.x - 68, y: this.ship.y, width: 136, height: 52}) || pointInEllipse(this.stuff[i], this.ship) || this.stuff[i] == player) {
        // we need to convert to ship-relative coordinates
        this.stuff[i].x -= this.ship.x;
        this.stuff[i].y -= this.ship.y;
        accumulator.push(this.stuff[i]);
      }
    }
    // Clear hyperspace's stuff,
    // you can't leave stuff lying around in hyperspace
    this.stuff = [];
    return accumulator;
  }

  addShipStuff(stuff_to_add) {
    for (var i = 0; i < stuff_to_add.length; i++) {
      // we need to convert from ship-relative coordinates
      stuff_to_add[i].x += this.ship.x;
      stuff_to_add[i].y += this.ship.y;
      this.stuff.push(stuff_to_add[i]);
    }
  }

}
