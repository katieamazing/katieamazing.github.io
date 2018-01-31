// uses a global randBetween
// uses a global function makeTypeMapHoles
// uses a global makeViewMap
// uses a class Underworld
// uses a class Ingredient
// uses mySVG, which needs to have nodes with id f1_b, f1_0, f1_1, f1_2, f2_b, f2_0, f2_1, f2_2, f2_3, f2_4, and all of the _b nodes need a path in them
// uses a global player
// uses a global canvas and T
// uses a global dist
// uses a global ctx
// uses a global currentState
// uses terrain_sheet1, terrain_sheet2, terrain_sheet3
// uses a global descs

class Planet {
  constructor(seed_string, space_state) {
    this.seed_string = seed_string;
    this.space_state = space_state;
    this.rng = new Math.seedrandom(this.seed_string);
    let terrains = [terrain_sheet1, terrain_sheet2, terrain_sheet3];
    this.terrain = terrains[randBetween(this.rng, 0, terrains.length)];
    let grounds = this.generateGrounds();
    this.ground = grounds.planet_ground;
    this.world =
      { width: 3 * canvas.width
      , height: 3 * canvas.height
      }
    this.typeMap = makeTypeMapHoles(this.world, this.rng);
    this.viewMap = makeViewMap(this.world, this.typeMap);
    this.viewport =
      { x: canvas.width
      , y: canvas.height
      };
    this.ship = {
      x: canvas.width * 1.5,
      y: canvas.height * 1.5
    }
    this.underworld = new Underworld(this, this.rng, grounds.underworld_ground);
    // we scatter random ingredients over the world
    this.common_ingredient_image = this.fruitImage(this.rng);
    this.common_ingredient_type = randBetween(this.rng, 2, 4);

    let descs = [
      ['incandescent', 'firey', 'psychogenic', 'levitating', 'liquid-metal'],
      ['warm', 'fuzzy', 'tart', 'tough', 'bright'],
      ['soft', 'curved', 'supple', 'sinuous', 'slimy'],
      ['fibrous', 'organic', 'woody', 'starchy', 'crystalline'],
      ['sweet', 'pungent', 'sour', 'tangy', 'strong'],
    ];

    this.common_ingredient_desc =
      descs[this.common_ingredient_type][randBetween(this.rng, 0, descs[this.common_ingredient_type].length)];

    this.rare_ingredient_image = this.fruitImage(this.rng);
    this.rare_ingredient_type = randBetween(this.rng, 0, 5);
    this.rare_ingredient_desc =
      descs[this.rare_ingredient_type][randBetween(this.rng, 0, descs[this.rare_ingredient_type].length)];

    this.stuff = [];
    for (var i = 0; i < randBetween(this.rng, 16, 20); i += 1) {
      this.stuff.push(new Ingredient(
        randBetween(this.rng, 0, this.world.width),
        randBetween(this.rng, 0, this.world.height),
        10,
        10,
        this.common_ingredient_image,
        this.common_ingredient_type,
        this.common_ingredient_type,
        this.common_ingredient_desc
      ));
    }
    for (var i = 0; i < randBetween(this.rng, 2, 8); i += 1) {
      this.stuff.push(new Ingredient(
        randBetween(this.rng, 0, this.world.width),
        randBetween(this.rng, 0, this.world.height),
        10,
        10,
        this.rare_ingredient_image,
        this.rare_ingredient_type,
        randBetween(this.rng, 2, 8),
        this.rare_ingredient_desc
      ));
    }
  }

  // generates the ground colors for the planet and the underworld
  generateGrounds() {
    let output = {};
    let r = randBetween(this.rng, 20, 220);
    let g = randBetween(this.rng, 20, 220);
    let b = randBetween(this.rng, 20, 220);
    output.planet_ground = "rgb(" + r + ", " + g + ", " + b + ")";
    r = Math.floor(r/3);
    g = Math.floor(g/3);
    b = Math.floor(b/3);
    output.underworld_ground = "rgb(" + r + ", " + g + ", " + b + ")";
    return output;
  }

  fruitImage(rng) {
    let fruitsvg = mySVG.cloneNode(true);
    let layer_1 = null;
    let layer_2 = null;
    if (rng() < 0.5) {
      layer_1 = fruitsvg.querySelector("#f1_b");
      layer_2 = fruitsvg.querySelector("#f1_" + randBetween(rng, 0, 3));
    } else {
      layer_1 = fruitsvg.querySelector("#f2_b");
      layer_2 = fruitsvg.querySelector("#f2_" + randBetween(rng, 0, 5));
    }

    layer_1.querySelector("path").style.fill = generateColor(this.rng);

    let layer_2Paths = layer_2.querySelectorAll("path");
    let layer_2PC = generateColor(this.rng);
    for (var i = 0; i < layer_2Paths.length; i++) {
      layer_2Paths[i].style.fill = layer_2PC;
    }

    layer_1.style.display = "inline";
    layer_2.style.display = "inline";


    var wrap = document.createElement("div");
    wrap.appendChild(fruitsvg);
    var image = new Image();
    image.src = "data:image/svg+xml;base64," + window.btoa(wrap.innerHTML);
    return image;
  }

  collideWithMap(to_test) {
    let collision_type = "flat";
    let collision_area = 0;
    let collision_row = null;
    let collision_col = null;
    for (var row = 0; row < this.world.height/T; row++) {
      for (var col = 0; col < this.world.width/T; col++) {
        if (this.typeMap[row][col] == "flat") {
          // no collision
        } else {
          let area = colArea(to_test, {x: col*T, y: row*T, width: T, height: T});
          if (area > collision_area) {
            collision_type = this.typeMap[row][col];
            area = collision_area;
            collision_row = row;
            collision_col = col;
          }
        }
      }
    }
    return collision_type;
  }

  update() {
    if (player.hp <= 0) {
      player.speed = 1.5;
    } else {
      player.speed = 3;
    }
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

    if (!isFinite(player.x)) {
      console.log("player.x is not finite:", player.x);
    }
    if (!isFinite(player.y)) {
      console.log("player.y is not finite:", player.y);
    }
    if (!isFinite(this.viewport.x)) {
      console.log("this.viewport.x is not finite:", this.viewport.x);
    }
    if (!isFinite(this.viewport.y)) {
      console.log("this.viewport.y is not finite:", this.viewport.y);
    }
    var new_viewport_x = this.viewport.x;
    var new_viewport_y = this.viewport.y;
    if (player.x < this.viewport.x + canvas.width / 3.0) {
      new_viewport_x = player.x - canvas.width / 3.0;
    }
    if (player.x > this.viewport.x + canvas.width * 2.0 / 3.0) {
      new_viewport_x = player.x - canvas.width * 2.0 / 3.0;
    }
    if (player.y < this.viewport.y + canvas.height / 3.0) {
      new_viewport_y = player.y - canvas.height / 3.0;
    }
    if (player.y > this.viewport.y + canvas.height * 2.0 / 3.0) {
      new_viewport_y = player.y - canvas.height * 2.0 / 3.0
    }

    this.viewport.x = Math.max(Math.min(new_viewport_x, this.world.width - canvas.width), 0);
    this.viewport.y = Math.max(Math.min(new_viewport_y, this.world.height - canvas.height), 0);

    // terrain collisions
    let collision_type = this.collideWithMap(player);
    if (collision_type == "hole") {
      console.warn("FALLING THROUGH")
      this.transferDown();
      return
    } else if (collision_type != "flat") {
      // player's in a rock, let's scoot the player =P
      let xs = [
        Math.floor(player.x / T) * T, player.x, Math.ceil(player.x / T) * T,
        Math.floor((player.x + player.width) / T) * T - player.width, Math.ceil((player.x + player.width) / T) * T - player.width
      ];
      let ys = [
        Math.floor(player.y / T) * T, player.y, Math.ceil(player.y / T) * T,
        Math.floor((player.y + player.height) / T) * T - player.height, Math.ceil((player.y + player.height) / T) * T - player.height
      ];
      let bestDist = Infinity;
      let best = null;
      for (var i = 0; i < xs.length; i++) {
        let candidate_x = xs[i];
        for (var j = 0; j < ys.length; j++) {
          let candidate_y = ys[j];
          let candidate = {x: candidate_x, y: candidate_y, width: 468/6, height: 100};
          if (this.collideWithMap(candidate) == "flat") {
            let d = dist(player, candidate);
            if (d < bestDist) {
              best = candidate;
              bestDist = d;
            }
          }
        }
      }
      if (best) {
        player.x = best.x;
        player.y = best.y;
      }
    }
  }

  draw() {
    // draw background
    ctx.beginPath();
    ctx.rect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = this.ground;
    ctx.fill();

    ctx.save();
    ctx.translate(-1 * this.viewport.x, -1 * this.viewport.y);


    // draw terrain
    for (var row = 0; row < this.world.height/T; row++) {
      for (var col = 0; col < this.world.width/T; col++) {
        if (this.viewMap[row][col] == 'hole') {
          ctx.drawImage(terrain_hole, col*T, row*T)
        } else if (this.viewMap[row][col] == 'flat') {
          // debug visualize the flat squares
          // ctx.beginPath();
          // ctx.rect(col*T + 2, row*T + 2, T - 4, T - 4);
          // ctx.strokeStyle = "blue";
          // ctx.stroke();
        } else if (typeof this.viewMap[row][col] == 'number') {
          // viewMap[row][col] is a number, pointing to a location in terrain_sheet1.
          let spritesheet_index = this.viewMap[row][col];
          ctx.drawImage(terrain_holes, spritesheet_index*T, 0, T, T, col*T, row*T, T, T);
        } else {
          // viewMap[row][col] is a pair of numbers, pointing to a location in terrain_sheet2.
          let row_in_sheet = this.viewMap[row][col].row;
          let col_in_sheet = this.viewMap[row][col].col;
          // ctx.drawImage(template_terrain_sheet, col_in_sheet*32, row_in_sheet*32, 32, 32, col*T, row*T, T, T);
          ctx.drawImage(this.terrain, col_in_sheet*T, row_in_sheet*T, T, T, col*T, row*T, T, T);
        }
      }
    }
    ctx.drawImage(shipimage, this.ship.x - 150, this.ship.y - 200);
    // draw stuff
    for (var i = 0; i < this.stuff.length; i++) {
      var stuff = this.stuff[i];
      if (this.viewport.x - T < stuff.x && stuff.x < this.viewport.x + canvas.width &&
        this.viewport.y - T < stuff.y && stuff.y < this.viewport.y + canvas.width) {
          this.stuff[i].draw();
      }
    }
    // make sure to draw the thing the player is holding after the player,
    // so that it overlaps
    if (player.holding) {
      player.holding.draw();
    }
    ctx.restore();

    for (var p = 0; p < 3; p++) {
      if (p < player.hp) {
        ctx.drawImage(heart_filled, 30*p+10, 10)
      } else {
        ctx.drawImage(heart_outline, 30*p+10, 10)
      }
    }
  }

  action() {
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
      this.stuff[found[found.length -1]].action();
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

  getShipStuff() {
    var accumulator = [];
    for (var i = 0; i < this.stuff.length; i++) {
      // TODO(johnicholas): move the ship radius up and out
      if (colCheck(this.stuff[i], {x: this.ship.x - 68, y: this.ship.y, width: 136, height: 52}) || pointInEllipse(this.stuff[i], this.ship)) {
        // we need to convert to ship-relative coordinates
        this.stuff[i].x -= this.ship.x;
        this.stuff[i].y -= this.ship.y;
        accumulator.push(this.stuff[i]);
      }
    }
    // remove all and only the things that are leaving
    for (var j = 0; j < accumulator.length; j++) {
      var index = this.stuff.indexOf(accumulator[j]);
      if (index > -1) {
        this.stuff.splice(index, 1);
      }
    }
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

  addPlayer(player) {
    this.stuff.push(player);
  }

  addIngredient(ingredient) {
    this.stuff.push(ingredient);
  }

  removeIngredient(ingredient) {
    var index = this.stuff.indexOf(ingredient);
    if (index > -1) {
      this.stuff.splice(index, 1)
    }
  }

  transferDown() {
    this.underworld.addPlayer(player);
    var index = this.stuff.indexOf(player);
    if (index > -1) {
      this.stuff.splice(index, 1);
    }
    if (player.holding !== null) {
      this.removeIngredient(player.holding);
      this.underworld.addIngredient(player.holding);
    }
    currentState = this.underworld;
  }

}
