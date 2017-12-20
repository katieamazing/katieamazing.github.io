// A generic euclidean distance function, between two objects which have
// x and y properties.
function dist(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
}

function pointInEllipse(p, ellipse) {
  let dx = p.x - ellipse.x;
  let dy = p.y - ellipse.y;
  return (dx * dx / (102*102) + dy * dy / (82.5*82.5)) < 1;
}

// A generic rectangle against rectangle collision check, between any two
// objects which have x, y, width, and height properties.
function colCheck(a, b){
  return !(b.x > a.x + a.width) && !(a.x > b.x + b.width) && !(b.y > a.y + a.height) && !(a.y > b.y + b.height);
}

function colArea(a, b){
  if (!colCheck(a, b)) {
    return 0;
  } else {
    return (Math.min(a.x + a.width, b.x + b.width) - Math.max(a.x, b.x)) *
      (Math.min(a.y + a.height, b.y + b.height) - Math.max(a.y, b.y));
  }
}

// A generic circle against circle collision check, between any two objects
// which have x, y, and radius properties.
function circleColCheck(a, b) {
  return dist(a, b) < (a.radius + b.radius);
}

function randBetween(rng, floor, ceil) {
  return Math.floor(rng() * (ceil - floor)) + floor;
}

function generateColor(rng) {
  return "rgb(" + randBetween(rng, 20, 220) + ", " + randBetween(rng, 20, 220) + ", " + randBetween(rng, 20, 220) + ")";
}
