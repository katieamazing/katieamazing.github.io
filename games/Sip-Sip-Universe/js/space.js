// uses canvas, T
// uses Wormhole
// uses WineCellar
// uses randBetween
// uses FloatingPlanet
// uses a global player
// uses space_bg_tiles
// uses circleColCheck and dist
// uses colCheck and pointInEllipse

class Space {
  constructor(username, systems_seen) {
    this.seed_string = username + "," + systems_seen;
    this.rng = new Math.seedrandom(this.seed_string);
    this.bg = [];
    for (var row = 0; row < canvas.height/T; row++) {
      let y = row * 64;
      for (var col = 0; col < canvas.width/T; col++) {
        let x = col * 64;
        let argx = 0;
        if (this.rng() < 0.8) {
          argx = Math.floor(this.rng() * 12) * 64;
        }
        this.bg.push([argx, x, y]);
      }
    }
    this.ship = {x: canvas.width * 0.8, y: canvas.height * 0.8, radius: 200};
    // stuff that is native to space, like the sun, planets, and wormholes.
    // This stuff is never gonna go from space to the wine cellar or a planet.
    this.native_space_stuff = [
      new Wormhole(canvas.width * 0.8, canvas.height * 0.8,
        function () {
          return new WineCellar(username, systems_seen+1);
        })
    ];
    // Use the seed to create several planets
    var planet_count = randBetween(this.rng, 1, 6);
    for (var planet_index = 0; planet_index < planet_count; planet_index++) {
      var f = (planet_index+1)/(planet_count+1);
      let x = f*0 + (1-f)*canvas.width*0.7 + randBetween(this.rng, -50, 50);
      let y = f*canvas.height + (1-f) * 0 + randBetween(this.rng, -50, 50);
      let min_r = 50;
      let max_r = 200;
      let r = f*max_r + (1-f)*min_r;
      this.native_space_stuff.push(new FloatingPlanet(this.seed_string + "," + planet_index, x, y, r, this));
    }
    this.stuff = [];
  }

  update() {
    // check keys
    let dx = 0
    let dy = 0
    if (keys[39] || keys[68]) {
      dx += 4;
    }
    if (keys[37] || keys[65]) {
      dx -= 4;
    }
    if (keys[38] || keys[87]) {
      dy -= 4;
    }
    if (keys[40] || keys[83]) {
      dy += 4;
    }
    this.ship.x += dx;
    this.ship.y += dy;
    for (var i = 0; i < this.stuff.length; i++) {
      this.stuff[i].x += dx;
      this.stuff[i].y += dy;
    }
    player.x = this.ship.x - 30;
    player.y = this.ship.y - 30;
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

    // draw native space stuff
    for (var i = 0; i < this.native_space_stuff.length; i++) {
      this.native_space_stuff[i].draw();
    }

    ctx.drawImage(sun, canvas.width-148, 20);
    ctx.drawImage(shipimage, this.ship.x - 150, this.ship.y - 200);
    // draw stuff
    for (var i = 0; i < this.stuff.length; i++) {
      this.stuff[i].draw();
    }

    // plane of the ecliptic
    //ctx.beginPath();
    //ctx.moveTo(0, canvas.height);
    //ctx.lineTo(canvas.width*0.7, 0);
    //ctx.strokeStyle = "white";
    //ctx.stroke();
  }

  action() {
    var best_so_far = Number.POSITIVE_INFINITY;
    var found = null;
    for (var i = 0; i < this.native_space_stuff.length; i++) {
      if (circleColCheck(this.ship, this.native_space_stuff[i])
        && dist(this.ship, this.native_space_stuff[i]) < best_so_far) {
        best_so_far = dist(this.ship, this.native_space_stuff[i]);
        found = i;
      }
    }
    if (found !== null) {
      this.native_space_stuff[found].action();
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
      if (colCheck(this.stuff[i], {x: this.ship.x - 68, y: this.ship.y, width: 136, height: 52}) || pointInEllipse(this.stuff[i], this.ship)) {
        // we need to convert to ship-relative coordinates
        this.stuff[i].x -= this.ship.x;
        this.stuff[i].y -= this.ship.y;
        accumulator.push(this.stuff[i]);
      }
    }
    // Clear space's stuff
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
