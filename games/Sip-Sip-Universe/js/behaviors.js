

class PursuePlayerBehavior {
  constructor() {

  }
  update(critter) {
    if (dist(critter, player) < 250) {
      return { x: player.x, y: player.y }
    } else {
      return { x: critter.x, y: critter.y }
    }
  }
}

class SimpleFleeBehavior {
  constructor() {

  }
  update(critter) {
    if (dist(critter, player) < 250) {
      return { x: critter.x - (player.x - critter.x), y: critter.y - (player.y - critter.y) }
    } else {
      return { x: critter.x, y: critter.y }
    }
  }
}

class FleeBehavior {
  constructor() {

  }
  update(critter) {
    var target = { x: critter.x, y: critter.y }
    if (dist(critter, player) < 250) {
      for (var i = 0; i < 10; i++) {
        target.x = randBetween(Math.random, critter.x - 250, critter.x + 250);
        target.y = randBetween(Math.random, critter.y - 250, critter.y + 250);
        if (dist(critter, target) < 250 && dist(player, target) > 250) {
          // keep it
          break
        }
      }
      return target
    } else {
      return { x: critter.x, y: critter.y }
    }
  }
}
