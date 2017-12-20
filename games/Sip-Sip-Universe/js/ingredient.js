// depends on ctx global
// uses player.holding, player.hp, player.x, player.y
// uses makeToast
// uses sounds.place_item

class Ingredient {
  constructor (x, y, width, height, image, type, rarity, description) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.type = type;
    this.rarity = rarity;
    this.description = description;
  }

  draw() {
    ctx.drawImage(this.image, this.x-33, this.y-40);
  }

  drawLittle() {
    ctx.drawImage(this.image, 0, 0, this.image.width, this.image.height, this.x -10, this.y - 10, this.image.width*0.3, this.image.height*0.3);
  }

  action() {
    if (player.holding == null) {
      player.holding = this;
      sounds.place_item.play();
      if (player.hp <= 0) {
        makeToast("A " + this.description + " foraged fruit.\nPress [Q] to eat it and restore health.");
      } else {
        makeToast("A " + this.description + " foraged fruit.");
      }
    } else if (player.holding == this) {
      player.holding = null;
      sounds.place_item.play();
    }
  }

  move(){ //move with player
    this.x = player.x + 30;
    this.y = player.y + 40;
  }
}
