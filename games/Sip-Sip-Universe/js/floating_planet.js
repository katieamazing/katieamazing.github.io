// uses Planet
// uses mySVG, which needs to have a whole battery of ids e_0,e{a,m,n,p,s,b}_{1,2}, and e_0 needs a circle
// uses a global transitionToState

// A FloatingPlanet is visible in space, and is
// responsible for getting the player from space to one particular planet.
class FloatingPlanet {
  constructor (seed_string, x, y, r, space_state) {
    this.seed_string = seed_string;
    this.rng = new Math.seedrandom(seed_string);
    this.destination_planet = new Planet(seed_string + ",terrain", space_state);
    this.svg = mySVG.cloneNode(true);
    // TODO(johnicholas): improve this
    //this.svg.querySelector("#spaceDome path").style.fill = "rgb(" + Math.floor(this.rng() * 255) + ", " + Math.floor(this.rng() * 100) + ", 0)";
    let planet_types = ["a", "m", "n", "p", "s", "b"];
    let layer_1 = this.svg.querySelector("#e" + planet_types[Math.floor(this.rng() * planet_types.length)] + "_1");
    let layer_2 = this.svg.querySelector("#e" + planet_types[Math.floor(this.rng() * planet_types.length)] + "_2");

    this.svg.querySelector("#e_0 circle").style.fill = generateColor(this.rng);

    let layer_1Paths = layer_1.querySelectorAll("path");
    let layer_1PC = generateColor(this.rng);
    for (var i = 0; i < layer_1Paths.length; i++) {
      layer_1Paths[i].style.fill = layer_1PC;
    }

    let layer_2Paths = layer_2.querySelectorAll("path");
    let layer_2PC = generateColor(this.rng);
    for (var i = 0; i < layer_2Paths.length; i++) {
      layer_2Paths[i].style.fill = layer_2PC;
    }

    this.svg.querySelector("#e_0").setAttribute("transform", "scale(" + r/67 + ")");
    layer_1.setAttribute("transform", "scale(" + r/67 + ")");
    layer_2.setAttribute("transform", "scale(" + r/67 + ")");

    this.svg.querySelector("#e_0").style.display = "inline";
    layer_1.style.display = "inline";
    layer_2.style.display = "inline";

    var wrap = document.createElement("div");
    wrap.appendChild(this.svg);
    this.image = new Image();
    this.image.src = "data:image/svg+xml;base64," + window.btoa(wrap.innerHTML);
    this.x = x;
    this.y = y;
    this.radius = r;
  }

  draw() {
    ctx.drawImage(this.image, this.x - 100 * this.radius / 67, this.y - 133 * this.radius / 67);
  }

  action() {
    console.log("going down to ", this.seed_string);
    transitionToState(this.destination_planet);
  }

}
