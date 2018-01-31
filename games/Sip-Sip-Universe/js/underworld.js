// depends on terrain_sheet1
// depends on canvas
// depends on makeTypeMap
// depends on makeViewMap
// depends on randBetween
// depends on StaticInteractable
// depends on behaviors such as PursuePlayerBehavior, SimpleFleeBehavior, FleeBehavior
// depends on Mob
// depends on generateColor
// depends on mySVG, which needs to have slime_front0, slime_front1, slime_dead0, slime_dead1 in it, with slime_front0 containing a path, and slime_dead0 containing a circle
// depends on a global player
// depends on terrain_holes
// depends on T, canvas, ctx
// depends on heart_filled, heart_outline
// depends on global currentState
// depends on a drawable stairs

class Underworld {

  constructor(overworld, rng, ground) {
    this.overworld = overworld;
    this.rng = rng;
    this.ground = ground;
    this.terrain = terrain_sheet1;
    this.stuff = [];
    this.world =
      { width: 3 * canvas.width
      , height: 3 * canvas.height
      }
    this.viewport =
      { x: canvas.width
      , y: canvas.height
      };
    this.typeMap = makeTypeMap(this.world, this.rng);
    this.viewMap = makeViewMap(this.world, this.typeMap);
    for (var i = 0; i < randBetween(this.rng, 2, 8); i += 1) {
      this.stuff.push(new StaticInteractable
        ( randBetween(this.rng, 0, this.world.width)
        , randBetween(this.rng, 0, this.world.height)
        , 64
        , 64
        , stairs
        , 0 // randBetween(this.rng, 0, 4) * 64 (for use with 4x64 sheet)
        , "stair"
        , "A way up!"
        )
      )
    }
    var behavior_list = [
      new PursuePlayerBehavior(),
      new SimpleFleeBehavior(),
      new FleeBehavior()
    ];
    var mob_descs = ["meaty", "gelatinous", "gooey", "stringy", "firm", "bouncy", "umami", "smoky", "granular", "fresh"];
    this.mob_behavior = behavior_list[randBetween(this.rng, 0, behavior_list.length)];
    this.mob_images = this.mobImage(this.rng);
    this.mob_speed = randBetween(this.rng, 1, 3);
    this.mob_rarity = randBetween(this.rng, 2, 8);
    this.mob_desc = mob_descs[randBetween(this.rng, 0, mob_descs.length)];

    for (var i = 0; i < randBetween(this.rng, 4, 10); i += 1) {
      this.stuff.push(new Mob(
        randBetween(this.rng, 0, this.world.width),
        randBetween(this.rng, 0, this.world.height),
        this.mob_images,
        this.mob_behavior,
        this.mob_speed,
        this.mob_rarity,
        this.mob_desc
      ));
    }
  }

  mobImage(rng){
    let output = {};
    let color = generateColor(this.rng);
    let mobsvg = mySVG.cloneNode(true);
    let layer_1 = mobsvg.querySelector("#slime_front0");
    let layer_2 = mobsvg.querySelector("#slime_front1");

    layer_1.querySelector("path").style.fill = color;

    layer_1.setAttribute("transform", "scale(" + 2 + ")");
    layer_2.setAttribute("transform", "scale(" + 2 + ")");

    layer_1.style.display = "inline";
    layer_2.style.display = "inline";

    var wrap = document.createElement("div");
    wrap.appendChild(mobsvg);
    var front_image = new Image();
    front_image.src = "data:image/svg+xml;base64," + window.btoa(wrap.innerHTML);
    output.front = front_image;

    let deadsvg = mySVG.cloneNode(true);
    let layer_3 = deadsvg.querySelector("#slime_dead0");
    let layer_4 = deadsvg.querySelector("#slime_dead1");

    layer_3.querySelector("circle").style.fill = color;

    layer_3.setAttribute("transform", "scale(" + 2 + ")");
    layer_4.setAttribute("transform", "scale(" + 2 + ")");

    layer_3.style.display = "inline";
    layer_4.style.display = "inline";

    var deadwrap = document.createElement("div");
    deadwrap.appendChild(deadsvg);
    var dead_image = new Image();
    dead_image.src = "data:image/svg+xml;base64," + window.btoa(deadwrap.innerHTML);
    output.dead = dead_image;

    return output;
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

    for (var i = 0; i < this.stairs; i++) {
      if (colCheck(player, i)) {
        console.warn("GOING UP")
      }
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

    var new_viewport_x;
    var new_viewport_y;
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
    if (new_viewport_x > 0 && new_viewport_x < this.world.width - canvas.width) {
      this.viewport.x = new_viewport_x;
    }
    if (new_viewport_y > 0 && new_viewport_y < this.world.height - canvas.height) {
      this.viewport.y = new_viewport_y;
    }
    for (var i = 0; i < this.stuff.length; i++) {
      if (this.stuff[i].update) {
        this.stuff[i].update();
      }
    }

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
        if (this.viewMap[row][col] == 'flat') {
          // ctx.drawImage(terrain_floor, col*T, row*T);
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
    // draw stuff
    for (var i = 0; i < this.stuff.length; i++) {
      var stuff = this.stuff[i];
      if (this.viewport.x - T < stuff.x && stuff.x < this.viewport.x + canvas.width &&
        this.viewport.y - T < stuff.y && stuff.y < this.viewport.y + canvas.width) {
          stuff.draw();
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

  transferUp() {
    this.overworld.addPlayer(player);
    var index = this.stuff.indexOf(player);
    if (index > -1) {
      this.stuff.splice(index, 1);
    }
    if (player.holding !== null) {
      this.removeIngredient(player.holding);
      this.overworld.addIngredient(player.holding);
    }
    currentState = this.overworld;

  }
}
