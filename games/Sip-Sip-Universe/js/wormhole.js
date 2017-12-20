// This depends on a global canvas, a global sound, a global ctx, a global drawable "wormhole", and a global function transitionToState.

// The wormhole acts like a one-way door between space and the hyperspatial
// wine cellar between the stars.
// It takes a destination function instead of a destination, so that we can
// avoid creating the destination state object until it is actually necessary.
class Wormhole {
  constructor (x, y, destination_fn) {
    this.x = canvas.width-366;
    this.y = canvas.height-248;
    this.width = 346;
    this.height = 228;
    this.radius = 10;
    this.destination_fn = destination_fn;
    this.sfx = new sound("audio/spaceship.wav");
  }

  draw() {
    ctx.drawImage(wormhole, this.x, this.y);
  }

  action() {
    transitionToState(this.destination_fn())
    this.sfx.play();
  }
}
