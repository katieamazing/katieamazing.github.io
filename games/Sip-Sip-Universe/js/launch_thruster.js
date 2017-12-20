// depends on a global "fuel";
// depends on a global player, and uses player.holding.
// depends on a global currentState and whether it has a field space_state. Uses currentstate.stuff.
// depends on a global transitionToState
// depends on globals message, message_display_frames_remaining

// The launch thruster is responsible for tracking fuel and launching the
// player into space.
class LaunchThruster {
  constructor (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = 52;
    this.height = 17*3;
    this.fuel = 3;
  }

  draw() {
    for (var i = 0; i < this.fuel; i++) {
      ctx.drawImage(fuel, this.x, this.y + this.height - (i+1) * this.height/3, this.width, this.height / 3);
    }
  }

  action() {
    if (player.holding === null && this.fuel > 0 && currentState.space_state) {
      console.log("Launch!");
      this.fuel -= 1;
      transitionToState(currentState.space_state);
    } else if (player.holding !== null && this.fuel < 3) {
      console.log("Refuel!");
      this.fuel += 1;
      var index = currentState.stuff.indexOf(player.holding);
      if (index > -1) {
        currentState.stuff.splice(index, 1);
      }
      player.holding = null;
    } else if (player.holding === null && this.fuel == 0) {
      message = "Going to have to refuel to get there. Go stuff a fruit in the fuel tanks.";
      message_display_frames_remaining = 150;
    }
  }
}
