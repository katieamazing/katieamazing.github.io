// depends on a global canvas
// depends on a global T
// depends on a global ctx
// depends on drawable space_bg_tiles
// depends on drawable splash
// uses LaunchThruster
// uses WineMaker
// depends on a global player
// depends on DOM elements with ids player_naming_box, player_naming_button, player
// uses global playerName
// uses global naming_mode

class Splash {
  constructor(){
    this.rng = new Math.seedrandom("HiThereWineLover");
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
  }

  update() {

  }

  draw() {
    for (var img = 0; img < this.bg.length; img++) {
      ctx.drawImage(space_bg_tiles, this.bg[img][0], 0, T, T, this.bg[img][1], this.bg[img][2], T, T);
    }
    ctx.drawImage(splash, canvas.width/2 - 300, canvas.height/2 - 250);
  }

  getShipStuff() {
    let launch_thruster = new LaunchThruster(-79, 22, 50, 50);
    let wine_maker = new WineMaker(40, 50, 55, 25);
    return [player, launch_thruster, wine_maker];
  }

  action() {
    if (!naming_mode) {
      naming_mode = true;
      document.querySelector("#player_naming_box").style.display = "inline";
      var that = this;
      document.querySelector("#player_naming_button").onclick = function (e) {
        let playerName = document.querySelector("#player").value;
        player = new Player(playerName);
        document.querySelector("#player_naming_box").style.display = "none";
        naming_mode = false;
        var space = new Space(playerName, 0);
        transitionToState(space);
      }
    }
  }

  nom() {
    //nothing
  }
}
