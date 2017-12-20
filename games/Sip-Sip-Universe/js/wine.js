// Wine depends on a global player, and a global "bottle", which should be drawable.

// Wine acts just like any other ingredient?
// Except maybe it is drawn differently?
class Wine {
  constructor(x, y, width, height, type, rarity, description) {
    this.x = x;
    this.y = y;
    this.width = 20;
    this.height = 50;
    this.type = 4;
    this.rarity = rarity;
    this.description = description
  }

  draw() {
    ctx.drawImage(bottle, this.x, this.y);
  }

  drawLittle() {
    ctx.drawImage(bottle, 0, 0, bottle.width, bottle.height, this.x+3, this.y-5, bottle.width*0.3, bottle.height*0.3);
  }

  action() {
    if (player.holding == null) {
      player.holding = this;
      sounds.place_item.play();
      if (player.hp <= 0) {
        makeToast(this.name + ": " + this.description + "\nPress [Q] to drink it and restore health.");
      } else {
        makeToast(this.name + ": " + this.description);
      }
    } else if (player.holding == this) {
      player.holding = null;
      sounds.place_item.play();
    }
  }

  move(){ //move with player
    this.x = player.x;
    this.y = player.y;
  }
}
