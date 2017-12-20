// This depends on global "dist", "randBetween", and "makeToast" functions, and a player object.

class Mob {
  constructor(x, y, images, behavior, speed, rarity, desc) {
    this.x = x;
    this.y = y;
    this.behavior = behavior;
    this.speed = speed;
    this.target = {x: x, y: y};
    this.width = 64;
    this.height = 64;
    this.sprites = images;
    this.image = this.sprites.front;
    this.hp = 4;
    this.rarity = rarity;
    this.type = "mob";
    this.description = desc;
    this.cd = 0;
  }

  update() {
    if (this.hp <= 0) {
      this.image = this.sprites.dead;
      return;
    }
    // TODO: turn this knob
    if (Math.random() < 0.1) {
      this.target = this.behavior.update(this)
    }
    if (this.x < this.target.x) {
      this.x += this.speed;
    }
    if (this.x > this.target.x) {
      this.x -= this.speed;
    }
    if (this.y < this.target.y) {
      this.y += this.speed;
    }
    if (this.y > this.target.y) {
      this.y -= this.speed;
    }

    if (dist(this, this.target) < 10 && this.target.x == player.x && player.hp > 0 && this.cd == 0) {
      player.hp--;
      this.cd = 60;
    }
    if (this.cd > 0) {
      this.cd--;
    }
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y);
    // for debugging
    /*
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.arc(this.target.x, this.target.y, 5, 0, 2*Math.PI);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(this.target.x, this.target.y);
    ctx.stroke();
    */
  }

  drawLittle() {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x, this.y, this.image.width*0.3, this.image.height*0.3);
  }

  action() {
    let pow = ["POW!", "BIFF!", "BOOP!", "BLAM!", "PUNCH!", "POWER MOVE!"];
    if (player.holding == null && this.hp > 0) { // player punches the mob
      sounds.place_item.play();
      this.hp--;
      let i = randBetween(Math.random, 0, pow.length);
      makeToast(pow[i]);
    } else if (player.holding !== null && this.hp > 0) { //player feeds the mob
      sounds.place_item.play();
      this.hp++;
      player.holding = null;
      // disappear the dropped item //TODO
    } else if (player.holding == null && this.hp <= 0) { //player picks up the corpse
      player.holding = this;
      if (player.hp <= 0) {
        makeToast("A defeated monster that seems " + this.description + "\nPress [Q] to eat it and restore health.");
      } else {
        makeToast("A defeated monster that seems " + this.description);
      }

    } else if (player.holding == this) { //player drops the corpse
      player.holding = null;
    }
  }

  move(){ //move with player
    this.x = player.x + 30;
    this.y = player.y + 40;
  }
}
