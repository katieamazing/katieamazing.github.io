// depends on a global T, and a global currentState

// Stuff that have action and draw methods, but that the player may not pick up.
// Assumes sprite sheets 1*T high, constructor expects an x value to start clip.
class StaticInteractable {
  constructor(x, y, width, height, image, slice, type, description) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.image = image;
    this.slice = slice;
    this.type = type;
    this.description = description;
    this.type = type;
  }

  draw() {
    ctx.drawImage(this.image, this.slice, 0, T, T, this.x, this.y, T, T);
  }

  action() {
    if (this.type == "stair") {
      currentState.transferUp();
    }
  }
}
