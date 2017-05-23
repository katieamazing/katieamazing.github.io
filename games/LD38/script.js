//TODO
// POSTPONE change Target names to soemthing else
// OK build and implement list of words
// OK add cute fire svg path thinger
// NO sound??
// 70% rewrite text ticker thing to fit better
// 70% make some kind of balance/progress readout thing UI
// win/lose, instructions stuff UI
// make the ability to spawn a bool in class?


// CONSTANTS
const NEAR_ENOUGH = 25;
let DISWORLD = new Object();
DISWORLD.x = 300;
DISWORLD.y = 300;
DISWORLD.r = 200;

function distance(a, b) {
  let dx = a.x - b.x;
  let dy = a.y - b.y
  return Math.sqrt(dx * dx + dy * dy);
}

function pointInCircle(circle, p) {
  return distance(circle, p) < circle.r;
}

function pointNearNeighbors(neighbors, p) {
  if (neighbors.length == 0) {
    return true;
  }
  let near_enough_to_someone = false;
  let far_enough_from_everybody = true;
  for (var i = 0; i < neighbors.length; i += 1) {
    let n = neighbors[i];
    if (distance(n, p) < NEAR_ENOUGH) {
      near_enough_to_someone = true;
    }
  }
  for (var i = 0; i < all_blobs.length; i += 1) {
    let n = all_blobs[i];
    if (distance(n, p) < n.r) {
      far_enough_from_everybody = false;
    }
  }
  return near_enough_to_someone && far_enough_from_everybody;
}

function Shannonize(a, b, c) {
  a++;
  b++;
  c++;
  //smooth losing conditions without NaN tantrums
  let pa = a/(a+b+c), pb = b/(a+b+c), pc = c/(a+b+c);
  return -1*pa * Math.log(pa) + -1*pb * Math.log(pb) + -1*pc * Math.log(pc);
}

// WARNING: naming a class Blob will collide with something internal,
// which will fuck everything up.
class MyBlob {
  constructor (p, href) {
    this.x = p.x;
    this.y = p.y;
    this.θ = Math.atan2(p.y - 300, p.x - 300) / (Math.PI / 180) - 270;

    // TODO: Get scale jitter working
    this.r = Math.random() * 15 + 5;
    this.svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'use');
    this.svgElement.setAttribute('transform', 'translate(' + this.x + ', ' + this.y + ') rotate(' + this.θ + ')' );
    this.svgElement.setAttribute('href', href);
    document.querySelector('#world').appendChild(this.svgElement);
  }
}

class BlobType {
  constructor (href, increase_word) {
    this.blobs = [];
    this.href = href;
    this.increase_word = increase_word;
  }
  update() {
    if (this.blobs.length == 0 && performance.now() - animationStart > 30000 ){ return; }
    this.growToTarget();
    this.dieToTarget();
  }

  growToTarget(){
    if (Math.random() < 0.1) {
      this.grow();
    }
  }

  forceGrow() {
    let done = false, x = 0, y = 0, p = new Object();
    for (var i = 0; i < 100 && !done; i++) {
      p.x = Math.random() * 600;
      p.y = Math.random() * 600;
      done = pointInCircle(DISWORLD, p) &&
        pointNearNeighbors(this.blobs, p);
    }
    if (done){
      let to_be_added = new MyBlob(p, this.href)
      this.blobs.push(to_be_added);
      all_blobs.push(to_be_added);
    }
  }

  grow(){
    if (this.blobs.length == 0){ return; }
    this.forceGrow();
  }

  growLots(){
    for (var i=0; i< Math.random()*10 + 7; i++){
      this.grow();
    }
  }

  dieToTarget(){
    if (Math.random() < (all_blobs.length/500)*(all_blobs.length/500) * 0.25) {
      this.die();
    }
  }

  dieAll() {
    while (this.blobs.length > 0) {
      this.die();
    }
  }

  die(){
    //TODO: perhaps factor out the to_be_removed as an arg which differs in the calling context
    let to_be_removed = this.blobs.pop();
    if (!to_be_removed) { return; }
    document.querySelector('#world').removeChild(to_be_removed.svgElement);
    let index_of_to_be_removed_in_all_blobs = all_blobs.indexOf(to_be_removed);
    if (index_of_to_be_removed_in_all_blobs > -1) {
      all_blobs.splice(index_of_to_be_removed_in_all_blobs, 1);
    }
  }

  dieLots(){
    for (var i=0; i< Math.random()*10 + 5; i++){
      this.die();
    }
  }

}

function unbalanceBlobs(){
  if (performance.now() - animationStart < 30000 ){ return }
  if (Math.random() < 0.05){
    let max_target = Math.max(water.blobs.length, fire.blobs.length, trees.blobs.length);
    //if (max_target > 300) { return; }
    if (water.blobs.length == max_target) {
      water.grow();
      fire.die();
      trees.die();
    }
    if (fire.blobs.length == max_target) {
      fire.grow();
      trees.die();
      water.die();
    }
    if (trees.blobs.length == max_target) {
      trees.grow();
      fire.die();
      water.die();
    }
  }
}

// GLOBALS
let all_blobs = [];
let fire = null, water = null, trees = null, animationStart = null;
let velocity = null, angle = null;

function reset(){
  all_blobs = [];
  fire = new BlobType('#fireSprite', 'fire');
  water = new BlobType('#waterSprite', 'water');
  trees = new BlobType('#tree', 'tree');
  fire.forceGrow();
  water.forceGrow();
  trees.forceGrow();
  velocity = 0, angle = 0;
  animationStart = null;
  requestAnimationFrame(update);
}


function winCheck(){
  let current_shannon = Shannonize(fire.blobs.length, water.blobs.length, trees.blobs.length);
  let max_shannon = Shannonize(1, 1, 1);
  let current_percent = Math.round(100 * (current_shannon / max_shannon));
  document.querySelector('#winning').innerHTML = 'Your world is ' + current_percent + '% balanced.';

  //if (current_percent > 90 and performance.now() - animationStart) > 30000 {
    //console.warn('winning??');
  //}
}

function speechRecog(){
  const moreFire = ['fire', 'inferno', 'red', 'orange', 'yellow', 'burn', 'burning', 'flames', 'forest fire', 'hot', 'hotter', 'disco', 'lit']
  const lessFire = ['firefighters', 'firefighter', 'hunky', 'out', 'extinguish', 'hose']
  const moreWater = ['rain', 'blue', 'drown', 'lake', 'water', 'waves', 'deluge', 'storm', 'gush', 'waterfall', 'torrent', 'ocean']
  const lessWater = ['desert', 'dry', 'dried', 'wind', 'parched', 'suck', 'slurp', 'arid']
  const moreTrees = ['trees', 'tree', 'green', 'shrubbery', 'grow', 'fertilizer', 'green']
  const lessTrees = ['die', 'kill', 'beetle', 'beetles', 'lumberjacks', 'plaid', 'chainsaw', 'cut', 'chop']

  window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  const recognition = new SpeechRecognition();
  recognition.interimResults = true;

  let p = document.querySelector('#textticker');
  const words = document.querySelector('.words');
  words.appendChild(p);

  recognition.addEventListener('result', e => {
    const transcript = Array.from(e.results)
      .map(result => result[0])
      .map(result => result.transcript)
      .join('');

      var transcribed = '';
      if (e.results[0].isFinal) {
        let keywords = transcript.split(' ');
        for (var i = 0; i < keywords.length; i++){
          let w = keywords[i];
          let done = false;
          for (var j = 0; j < moreFire.length && !done; j++){
            if (w == moreFire[j]){
              fire.growLots();
              spin();
              transcribed += '<span class="more_fire">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < lessFire.length && !done; j++){
            if (w == lessFire[j]){
              fire.dieLots();
              spin();
              transcribed += '<span class="less_fire">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < moreWater.length && !done; j++){
            if (w == moreWater[j]){
              water.growLots();
              spin();
              transcribed += '<span class="more_water">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < lessWater.length && !done; j++){
            if (w == lessWater[j]){
              water.dieLots();
              spin();
              transcribed += '<span class="less_water">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < moreTrees.length && !done; j++){
            if (w == moreTrees[j]){
              trees.growLots();
              spin();
              transcribed += '<span class="more_trees">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < lessTrees.length && !done; j++){
            if (w == lessTrees[j]){
              trees.dieLots();
              spin();
              transcribed += '<span class="less_trees">' + w + '</span> ';
              done = true;
            }
          }
          if (w == 'spin') {
            spin();
            transcribed += '<span class="less_trees">' + w + '</span> ';
            done = true;
          }
          if (!done) {
              transcribed += w + ' ';
          }
        }
      } else {
        let keywords = transcript.split(' ');
        for (var i = 0; i < keywords.length; i++){
          let w = keywords[i];
          let done = false;
          for (var j = 0; j < moreFire.length && !done; j++){
            if (w == moreFire[j]){
              fire.growLots();
              transcribed += '<span class="more_fire">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < lessFire.length && !done; j++){
            if (w == lessFire[j]){
              fire.dieLots();
              transcribed += '<span class="less_fire">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < moreWater.length && !done; j++){
            if (w == moreWater[j]){
              water.growLots();
              transcribed += '<span class="more_water">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < lessWater.length && !done; j++){
            if (w == lessWater[j]){
              water.dieLots();
              transcribed += '<span class="less_water">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < moreTrees.length && !done; j++){
            if (w == moreTrees[j]){
              trees.growLots();
              transcribed += '<span class="more_trees">' + w + '</span> ';
              done = true;
            }
          }
          for (var j = 0; j < lessTrees.length && !done; j++){
            if (w == lessTrees[j]){
              trees.dieLots();
              transcribed += '<span class="less_trees">' + w + '</span> ';
              done = true;
            }
          }
          if (!done) {
              transcribed += w + ' ';
          }
        }

        //p = document.createElement('p');
        p.innerHTML = transcribed;
        words.appendChild(document.querySelector('#textticker'));
      }

  });

  recognition.addEventListener('end', recognition.start);
  recognition.start();
};

function spin() {
  velocity += 1;
}

function update(t) {
  if (!animationStart) { animationStart = t; }
  water.update();
  fire.update();
  trees.update();
  velocity = velocity * 0.99;
  angle = angle + velocity;
  document.querySelector('#world').setAttribute('transform', 'translate(300, 300) rotate(' + angle + ') translate(-300, -300)');
  winCheck();
  unbalanceBlobs();
  if (performance.now() - animationStart < 1.5 * 60 * 1000) { 
    requestAnimationFrame(update);
  } else {
    let current_shannon = Shannonize(fire.blobs.length, water.blobs.length, trees.blobs.length);
    let max_shannon = Shannonize(1, 1, 1);
    let current_percent = Math.round(100 * (current_shannon / max_shannon));

    if (Math.max(fire.blobs.length, water.blobs.length, trees.blobs.length) == fire.blobs.length &&
        current_percent < 10) {
      document.querySelector('#modal_heading').innerHTML = 'World of Fire Win!'
      document.querySelector('#modal_para').innerHTML = 'YOU WIN! You\'ve nurtured a world of flames. Congrats, crispy.'
    } else if (Math.max(fire.blobs.length, water.blobs.length, trees.blobs.length) == water.blobs.length &&
        current_percent < 10) {
      document.querySelector('#modal_heading').innerHTML = 'World of Water Win!'
      document.querySelector('#modal_para').innerHTML = 'YOU WIN! You\'ve drowned a whole world in watery bliss. Gurgle burble.'
    } else if (Math.max(fire.blobs.length, water.blobs.length, trees.blobs.length) == trees.blobs.length &&
        current_percent < 10) {
      document.querySelector('#modal_heading').innerHTML = 'World of Trees Win!'
      document.querySelector('#modal_para').innerHTML = 'YOU WIN! You\'ve grown a world of trees. Welcome to the jungle.'
    } else if (current_percent > 87) {
      document.querySelector('#modal_heading').innerHTML = 'Balanced World Win!'
      document.querySelector('#modal_para').innerHTML = 'YOU WIN! Congratulations, you have kept all three elements balanced and nurtured an ideal world.'
    } else {
      document.querySelector('#modal_heading').innerHTML = 'This World Isn\'t Very Nice'
      document.querySelector('#modal_para').innerHTML = 'Oops, this world is not balanced among the three elements. Or maybe commit to just one element next time? Try again!'
    }
    // mutate the contents of the modalDialog
    document.querySelector('.modalDialog').classList.add('modalDialogTarget');
  }
};

function closeDialog() {
  if (fire) { fire.dieAll(); }
  if (water) { water.dieAll(); }
  if (trees) { trees.dieAll(); }
  reset();
  document.querySelector('.modalDialog').classList.remove('modalDialogTarget');
}

window.addEventListener('load', function () { speechRecog(); });
document.querySelector('.close').addEventListener('click', closeDialog);
