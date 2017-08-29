// constants
var W = 10*64
var H = 13653+16
var SCREEN_HEIGHT = 600
var SCREEN_WIDTH = 400
var DIVER_WIDTH = 60
var DIVER_HEIGHT = 60
var TILE_WIDTH = 64
var TILE_HEIGHT = 64
var DIVER_SPEED = 1/8
var DIVER_SPEED_UP = 1/16
var GEAR_RATIO = 1
var MESSAGE_SPEED = 1/20
var WALLPROB = 0.15
var CAMERA_SPEED = 0.05
var SHELL_SPEED = 0.5
var KELP_SPEED = 0.75
var BUBBLE_SPEED = 0.1
var BUBBLE_MOVE_SPEED = 1
var MAX_BUBBLES = 5
var DIVER_PREFERRED_POSITION = 200
var DIVER_PREFERRED_X = 200
var SECTION_HEIGHT = 256
var MAX_AIR = 12000 // twelve seconds
var AIR_FROM_BUBBLES = 5000 // five seconds

// map enum constants
var WALL = 0
var CLEAR = 1
var SHELL = 2

// globals
var my_rng = new Math.seedrandom('yay.')
var stage = new PIXI.Stage(0x000000, false)
var startscreen = new PIXI.DisplayObjectContainer()

var splash = new PIXI.Sprite(new PIXI.Texture.fromImage('splash.png'))
splash.x = SCREEN_WIDTH / 2
splash.y = SCREEN_HEIGHT / 2
splash.anchor = {x:0.5, y:0.5}
startscreen.addChild(splash)
var startscreentext = new PIXI.Text('Literary Diver', {font: 'bold 20px Arial', fill: 'white', align:'center' })
startscreentext.x = SCREEN_WIDTH / 2
startscreentext.y = SCREEN_HEIGHT / 2 - 32
startscreentext.anchor = {x:0.5, y:0.5}
startscreen.addChild(startscreentext)
var info = new PIXI.Text('Gather shells to bust through knots of kelp\nand seek meaning below the surface.\n\nGet to the bottom and collect all the treasures\nbefore your air runs out!\n\nclick to start', {font: '12px Arial', fill: 'white', align:'center' })
info.x = SCREEN_WIDTH / 2
info.y = SCREEN_HEIGHT / 2 + 32
info.anchor = {x:0.5, y:0.5}
startscreen.addChild(info)
stage.addChild(startscreen)
var gameover = new PIXI.DisplayObjectContainer()
var gameoverrect = new PIXI.Graphics()
gameoverrect.beginFill(0x0000ff)
gameoverrect.drawRect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
gameoverrect.endFill()
gameoverrect.alpha = 0.5
gameover.addChild(gameoverrect)
var gameovertext = new PIXI.Text('you ran out of air\nrefresh to try again', {font: '20px Arial', fill: 'white', align:'center'})
gameovertext.alpha = 0.5
gameovertext.x = SCREEN_WIDTH / 2
gameovertext.y = SCREEN_HEIGHT / 2
gameovertext.anchor = {x:0.5, y:0.5}
gameover.addChild(gameovertext)
var youwin = new PIXI.DisplayObjectContainer()
var youwintext = new PIXI.Text('you get an A\nrefresh to play again', {font: '20px Arial', fill: 'white', align:'center'})
youwintext.x = SCREEN_WIDTH / 2
youwintext.y = SCREEN_HEIGHT / 2
youwintext.anchor = {x:0.5, y:0.5}
youwin.addChild(youwintext)
var playing = new PIXI.DisplayObjectContainer()
// stage.addChild(playing)
var renderer = PIXI.autoDetectRenderer(SCREEN_WIDTH, SCREEN_HEIGHT)
document.getElementById('view').appendChild(renderer.view)

var background_texture = new PIXI.Texture.fromImage('background.png')
var bg_sections = []
bg_sections.push(new PIXI.Texture(background_texture, new PIXI.Rectangle(0, 0*256, 400, 256)))
bg_sections.push(new PIXI.Texture(background_texture, new PIXI.Rectangle(0, 1*256, 400, 256)))
bg_sections.push(new PIXI.Texture(background_texture, new PIXI.Rectangle(0, 2*256, 400, 256)))
bg_sections.push(new PIXI.Texture(background_texture, new PIXI.Rectangle(0, 3*256, 400, 256)))
bg_sections.push(new PIXI.Texture(background_texture, new PIXI.Rectangle(0, 4*256, 400, 256)))
bg_sections.push(new PIXI.Texture(background_texture, new PIXI.Rectangle(0, 5*256, 400, 256)))
bg_sections.push(new PIXI.Texture(background_texture, new PIXI.Rectangle(0, 6*256, 400, 256)))
var bglayer = new PIXI.SpriteBatch()
var surface = new PIXI.Sprite(bg_sections[0])
var section = 0
function spawn_background_section(which) {
  var sprite = new PIXI.Sprite(bg_sections[which])
  sprite.y = section * SECTION_HEIGHT
  bglayer.addChild(sprite)
  section += 1
}

function spawn_background_run(count, which) {
  for (var i = 0; i < count; i += 1) {
    spawn_background_section(which)
  }
}

spawn_background_run(1, 0)
spawn_background_run(10, 1)
spawn_background_run(1, 2)
spawn_background_run(10, 3)
spawn_background_run(1, 4)
spawn_background_run(10, 5)
spawn_background_run(1, 6)
playing.addChild(bglayer)

var world = new PIXI.DisplayObjectContainer()
playing.addChild(world)

var displacement_texture = PIXI.Texture.fromImage('displacement_map.jpg')
var displacement_filter = new PIXI.DisplacementFilter(displacement_texture)
displacement_filter.scale.x = 20
displacement_filter.scale.y = 20

var uitext = new PIXI.Text('air', {font: '12px Arial', fill: 'white'})
uitext.alpha = 0.5
uitext.x = 14
uitext.y = SCREEN_HEIGHT - 44
playing.addChild(uitext)
var shellstext = new PIXI.Text('0 shells', {font: '12px Arial', fill: 'white', align: 'right'})
shellstext.anchor = {x:1, y:1}
shellstext.alpha = 0.5
shellstext.x = SCREEN_WIDTH - 14
shellstext.y = SCREEN_HEIGHT - 10
playing.addChild(shellstext)
function update_shellstext() {
  shellstext.setText(shellkeys + ' shells')
}
var ui = new PIXI.Graphics()
function update_ui(f) {
  var rhs = SCREEN_WIDTH * 0.85
  var lhs = 0
  ui.clear()
  ui.lineStyle(1, 0xffffff, 0.5)
  ui.moveTo(lhs + 10, SCREEN_HEIGHT - 28)
  ui.lineTo(lhs + 10, SCREEN_HEIGHT - 10)
  ui.lineTo(rhs - 10, SCREEN_HEIGHT - 10)
  ui.lineTo(rhs - 10, SCREEN_HEIGHT - 28)
  ui.lineTo(lhs + 10, SCREEN_HEIGHT - 28)
  ui.beginFill(0xffffff, 0.5)
  ui.drawRect(lhs + 14, SCREEN_HEIGHT - 24, (rhs - 28 - lhs) * f, 10)
  ui.endFill()
}
update_ui(1)
playing.addChild(ui)


function wallprob(row) {
  if (row < 40) {
    return WALLPROB
  } else if (row < 2 * 40) {
    var f = (row - 40) / 40
    return 2 * WALLPROB * f + WALLPROB * (1 - f)
  } else {
    return 2 * WALLPROB
  }
}
var spritesheet = new PIXI.Texture.fromImage('spritesheet.png')

var kelp_bottom_textures = []
kelp_bottom_textures.push(new PIXI.Texture(spritesheet, {x:0*64, y:2*64, width:64, height:64}))
kelp_bottom_textures.push(new PIXI.Texture(spritesheet, {x:2*64, y:0, width:64, height:64})) // small star
kelp_bottom_textures.push(new PIXI.Texture(spritesheet, {x:1*64, y:0, width:64, height:64})) // med star
kelp_bottom_textures.push(new PIXI.Texture(spritesheet, {x:0*64, y:0, width:64, height:64})) // biggest star
kelp_bottom_textures.push(new PIXI.Texture(spritesheet, {x:1*64, y:2*64, width:64, height:64}))

function spawn_kelp(x, y) {
  var kelp_leaves = new PIXI.Sprite.fromImage('kelp_leaves.png')
  kelp_leaves.x = x
  kelp_leaves.y = y-DIVER_HEIGHT/2
  kelp_leaves.filters = [displacement_filter]
  kelp_leaves.anchor = {x:0.5, y:1}
  world.addChild(kelp_leaves)
  var kelp_bottom = new PIXI.MovieClip(kelp_bottom_textures)
  var row = Math.floor(y / TILE_HEIGHT)
  var col = Math.floor(x / TILE_WIDTH)
  kelp_bottom.loop = false
  kelp_bottom.x = x
  kelp_bottom.y = y
  kelp_bottom.animationSpeed = KELP_SPEED
  map[row][col] = {
    touch: function () { if (shellkeys > 0) { shellkeys -= 1; update_shellstext(); kelp_bottom.play(); map[row][col] = CLEAR; } }
  }
  kelp_bottom.anchor = {x:0.5, y:0.5}
  world.addChild(kelp_bottom)
}

var shell_textures = []
shell_textures.push(new PIXI.Texture(spritesheet, {x:0*64, y:64, width:64, height:64}))
shell_textures.push(new PIXI.Texture(spritesheet, {x:1*64, y:64, width:64, height:64}))
shell_textures.push(new PIXI.Texture(spritesheet, {x:2*64, y:64, width:64, height:64}))
shell_textures.push(new PIXI.Texture(spritesheet, {x:3*64, y:64, width:64, height:64}))
shell_textures.push(new PIXI.Texture(spritesheet, {x:0*64, y:0, width:64, height:64})) // biggest star
shell_textures.push(new PIXI.Texture(spritesheet, {x:1*64, y:0, width:64, height:64})) // med star
shell_textures.push(new PIXI.Texture(spritesheet, {x:2*64, y:0, width:64, height:64})) // small star
shell_textures.push(new PIXI.Texture(spritesheet, {x:3*64, y:0, width:64, height:64})) // small bubble
shell_textures.push(new PIXI.Texture(spritesheet, {x:4*64, y:0, width:64, height:64})) // medium bubble
shell_textures.push(new PIXI.Texture(spritesheet, {x:5*64, y:0, width:64, height:64})) // big bubble
shell_textures.push(new PIXI.Texture(spritesheet, {x:5*64, y:0, width:64, height:64})) // .. repeat
shell_textures.push(new PIXI.Texture(spritesheet, {x:5*64, y:0, width:64, height:64})) // .. repeat
shell_textures.push(new PIXI.Texture(spritesheet, {x:6*64, y:0, width:64, height:64}))

var bubble_textures = []
bubble_textures.push(new PIXI.Texture(spritesheet, new PIXI.Rectangle(7*64, 0, 64, 64)))
bubble_textures.push(new PIXI.Texture(spritesheet, new PIXI.Rectangle(8*64, 0, 64, 64)))

function spawn_shell(x, y) {
  var shell = new PIXI.MovieClip(shell_textures)
  var row = Math.floor(y / TILE_HEIGHT)
  var col = Math.floor(x / TILE_WIDTH)
  shell.loop = false
  shell.x = x
  shell.y = y
  shell.animationSpeed = SHELL_SPEED
  shell.onComplete = function () {
    shell.visible = false
    map[row][col] = CLEAR
    spawn_bubble(shell.x, shell.y)
    shellkeys += 1
    update_shellstext()
  }
  map[row][col] = {
    touch: function () { air += AIR_FROM_BUBBLES; air = Math.min(air, MAX_AIR); shell.play() }
  }
  shell.anchor = {x:0.5, y:0.5}
  world.addChild(shell)
}

function sparkle(x, y) {
  var sprite = new PIXI.Sprite(shell_textures[4])
  sprite.x = x
  sprite.y = y
  world.addChild(sprite)
}

var bubbles = []
for (var i = 0; i < MAX_BUBBLES; i += 1) {
  var bubble = new PIXI.MovieClip(bubble_textures)
  bubble.x = -1000
  bubble.y = -1000
  bubble.animationSpeed = BUBBLE_SPEED
  bubble.anchor = {x:0.5, y:0.5}
  bubble.play()
  bubbles.push(bubble)
  world.addChild(bubble)
}
var next_bubble = 0

function spawn_bubble(x, y) {
  bubbles[next_bubble].x = x
  bubbles[next_bubble].y = y
  next_bubble += 1
  if (next_bubble >= bubbles.length) {
    next_bubble = 0
  }
}


function spawn_meaning_text(content, x, y) {
  meaning_text.setText(content)
  meaning_text.x = x
  meaning_text.y = y
}

function win() {
  won = true
  won_at = performance.now()
}


var pseudorow = 0
var map = []
for (var row = 0; row < H / TILE_HEIGHT; row += 1) {
  var special_col = Math.abs((pseudorow) % (2*W/TILE_WIDTH-3) - (W/TILE_WIDTH-2))
  map.push([])
  for (var col = 0; col < W / TILE_WIDTH; col += 1) {
    if (row + 1 >= H / TILE_HEIGHT) {
      map[row].push(WALL) // the bottom of the ocean
    } else if (col == special_col || col == special_col + 1) {
      // sparkle(col * TILE_WIDTH, row * TILE_HEIGHT)
      map[row].push(CLEAR)
    } else if (my_rng() < wallprob(row)) {
      map[row].push(WALL)
    } else {
      map[row].push(CLEAR)
    }
  }
  if (my_rng() < 0.5) {
    pseudorow += 1
  }
}

function spawn_prize(x, y, which, meaning) {
  var frames = []
  frames.push(new PIXI.Texture(spritesheet, {x:(which+2)*64, y:2*64, width:64, height:64}))
  frames.push(new PIXI.Texture(spritesheet, {x:0*64, y:0, width:64, height:64})) // biggest star
  frames.push(new PIXI.Texture(spritesheet, {x:1*64, y:0, width:64, height:64})) // med star
  frames.push(new PIXI.Texture(spritesheet, {x:2*64, y:0, width:64, height:64})) // small star
  var prize = new PIXI.MovieClip(frames)
  var row = Math.floor(y / TILE_HEIGHT)
  var col = Math.floor(x / TILE_WIDTH)
  prize.loop = false
  prize.x = x
  prize.y = y
  prize.animationSpeed = SHELL_SPEED
  prize.onComplete = function () {
    map[row][col] = CLEAR
    prize.visible = false
    spawn_meaning_text(meaning, x, y)
    air = MAX_AIR
    if (which == 3) {
      win()
    }
  }
  map[row][col] = {
    touch: function () { prize.play() }
  }
  prize.anchor = {x:0.5, y:0.5}
  world.addChild(prize)
}

spawn_prize(352, 2528, 0, 'The Conch:\nCivilization')
spawn_prize(544, 5152, 1, 'The Scarlet Letter:\nAdultery')
spawn_prize(480, 6752, 2, 'Yorick\'s Skull:\nthe finality of death')
spawn_prize(352, 9824, 4, 'The Marlin:\npride and worthy opponents')
spawn_prize(480, 13600, 3, 'The White Whale:\nobsession and hubris')

var shells = [
  {x: 288, y: 224},
  {x: 608, y: 480},
  {x: 96, y: 1056},
  {x: 352, y: 1184},
  {x: 96, y: 2080},
  {x: 288, y: 2912},
  {x: 608, y: 3232},
  {x: 352, y: 3744},
  {x: 32, y: 4384},
  {x: 352, y: 4768},
  {x: 608, y: 5472},
  {x: 96, y: 5856},
  {x: 160, y: 6176},
  {x: 480, y: 6560},
  {x: 544, y: 6560},
  {x: 288, y: 7200},
  {x: 608, y: 7328},
  {x: 608, y: 7776},
  {x: 352, y: 8224},
  {x: 96, y: 8800},
  {x: 352, y: 9376},
  {x: 608, y: 9760},
  {x: 608, y: 9888},
  {x: 352, y: 10144},
  {x: 224, y: 10336},
  {x: 32, y: 10592},
  {x: 480, y: 11296},
  {x: 608, y: 11680},
  {x: 288, y: 12192},
  {x: 96, y: 12768},
  {x: 416, y: 13216},
]
var kelps = [
  {x: 352, y: 608},
  {x: 480, y: 608},
  {x: 416, y: 608},
  {x: 160, y: 1632},
  {x: 224, y: 2208},
  {x: 288, y: 2848},
  {x: 480, y: 3296},
  {x: 544, y: 3360},
  {x: 352, y: 4128},
  {x: 288, y: 4064},
  {x: 480, y: 5600},
  {x: 416, y: 5664},
  {x: 224, y: 5984},
  {x: 288, y: 6048},
  {x: 160, y: 5984},
  {x: 416, y: 6560},
  {x: 480, y: 6816},
  {x: 416, y: 7328},
  {x: 544, y: 7520},
  {x: 224, y: 8032},
  {x: 160, y: 8480},
  {x: 224, y: 8608},
  {x: 96, y: 8544},
  {x: 352, y: 8992},
  {x: 544, y: 9504},
  {x: 480, y: 9568},
  {x: 416, y: 9824},
  {x: 96, y: 10208},
  {x: 160, y: 10400},
  {x: 480, y: 10976},
  {x: 480, y: 11488},
  {x: 352, y: 11936},
  {x: 352, y: 12000},
  {x: 96, y: 12384},
  {x: 160, y: 12448},
  {x: 224, y: 12512},
  {x: 352, y: 13088},
  {x: 416, y: 13024},
  {x: 608, y: 13408},
  {x: 544, y: 13408},
  {x: 480, y: 13408},
  {x: 416, y: 13344},
  {x: 352, y: 13344},
]

var terrain_texture = new PIXI.Texture.fromImage('terrain.png')
var terrain = []
terrain.push(new PIXI.Texture(terrain_texture, {x: 0*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 1*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 2*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 3*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 4*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 5*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 6*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 7*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 8*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x: 9*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x:10*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x:11*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x:12*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x:13*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x:14*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))
terrain.push(new PIXI.Texture(terrain_texture, {x:15*TILE_WIDTH, y:0*TILE_HEIGHT, width:TILE_WIDTH, height:TILE_HEIGHT}))

function wall_at(row, col) {
  if (row < 0) {
    return false;
  } else if (col < 0 || col >= W / TILE_WIDTH) {
    return true;
  } else if (row >= H / TILE_HEIGHT) {
    return true;
  } else {
    return map[row][col] === WALL
  }
}

function terrain_at(row, col) {
  var accum = 0
  if (wall_at(row-1, col)) { accum += 1 }
  if (wall_at(row, col+1)) { accum += 2 }
  if (wall_at(row+1, col)) { accum += 4 }
  if (wall_at(row, col-1)) { accum += 8 }
  return accum
}

var tiles = new PIXI.SpriteBatch()
for (var row = 0; row < H / TILE_HEIGHT; row += 1) {
  for (var col = 0; col < W / TILE_WIDTH; col += 1) {
    if (map[row][col] === WALL) {
      var sprite = new PIXI.Sprite(terrain[terrain_at(row, col)])
      sprite.x = col * TILE_WIDTH
      sprite.y = row * TILE_HEIGHT
      tiles.addChild(sprite)
    }
  }
}
world.addChild(tiles)

for (var i = 0; i < shells.length; i += 1) {
  spawn_shell(shells[i].x, shells[i].y)
}
for (var i = 0; i < kelps.length; i += 1) {
  spawn_kelp(kelps[i].x, kelps[i].y)
}

function find_clear_near(obj) {
  var x = obj.x
  var y = obj.y
  var crow = Math.floor(y / TILE_HEIGHT) - 1
  crow = Math.max(crow, 0)
  crow = Math.min(crow, map.length-3)
  var ccol = Math.floor(x / TILE_WIDTH) - 1
  ccol = Math.max(ccol, 0)
  ccol = Math.min(ccol, map[crow].length-3)
  for (var row = crow; row < crow + 1; row += 1) {
    for (var col = ccol; col < ccol + 1; col += 1) {
      if (map[row][col] == CLEAR) {
        obj.x = TILE_HEIGHT * row
        obj.y = TILE_WIDTH * col
      }
    }
  }
}

var bubbles = []
for (var i = 0; i < MAX_BUBBLES; i += 1) {
  var bubble = new PIXI.MovieClip(bubble_textures)
  bubble.animationSpeed = BUBBLE_SPEED
  bubble.anchor = {x:0.5, y:0.5}
  bubble.play()
  bubbles.push(bubble)
  world.addChild(bubble)
}

var dive_textures = []
dive_textures.push(new PIXI.Texture(spritesheet, {x:4*64, y:64, width:64, height:64}))
dive_textures.push(new PIXI.Texture(spritesheet, {x:5*64, y:64, width:64, height:64}))
var diver = new PIXI.MovieClip(dive_textures)
diver.x = 128
diver.y = 128
find_clear_near(diver)
diver.anchor = {x:0.5, y:0.5}
diver.animationSpeed = 0.025
diver.play(0)
world.addChild(diver)

var meaning_text = new PIXI.Text('something something', {font: '20px Arial', fill: 'white', align: 'center'})
meaning_text.x = -1000
meaning_text.y = -1000
meaning_text.anchor = {x: 0.5, y: 0.5}
world.addChild(meaning_text)


function PossiblyUnlock(x, y) {
  var row = Math.floor(y / TILE_HEIGHT)
  var col = Math.floor(x / TILE_WIDTH)
  if (isNaN(row) || isNaN(col)) {
    return true
  } else if (row < 0 || map.length <= row) {
    return true
  } else if (col < 0 || map[row].length <= col) {
    return true
  }
  var tile = map[row][col]
  if (tile === WALL) {
    return true
  } else if (tile === CLEAR) {
    return false
  } else {
    tile.touch()
    return true
  }
}

var keys = {
  'left': false,
  'up': false,
  'right': false,
  'down': false,
  start: 0
}

function set_moving() {
  if (keys.left || keys.up || keys.right || keys.down) {
    if (!keys.moving) {
      keys.start = performance.now()
      diver.animationSpeed = GEAR_RATIO * DIVER_SPEED
      keys.moving = true
    }
  } else if (keys.moving) {
    keys.start = performance.now()
    keys.moving = false
    diver.animationSpeed = 0.025
  }
}

function print_objects() {
  var accum = 'var shells = [\n'
  for (var i = 0; i < shells.length; i += 1) {
    accum += '  {x: ' + shells[i].x + ', y: ' + shells[i].y + '},\n'
  }
  accum += ']\n'
  accum += 'var kelps = [\n'
  for (var i = 0; i < kelps.length; i += 1) {
    accum += '  {x: ' + kelps[i].x + ', y: ' + kelps[i].y + '},\n'
  }
  accum += ']'
  console.log(accum)
}

document.onkeydown = function document_onkeydown(event) {
  switch (event.keyCode) {
    case 65: // a
    case 37:
      keys.left = true
      event.preventDefault()
      break
    case 87:  // w
    case 38:
      keys.up = true
      event.preventDefault()
      break
    case 68:
    case 39:
      keys.right = true
      event.preventDefault()
      break
    case 83:
    case 40:
      keys.down = true
      event.preventDefault()
      break;
    /*
    case 83: // DEBUG - press S to spawn a shell
      shells.push({ x: Math.floor(diver.x/TILE_WIDTH)*TILE_WIDTH+TILE_WIDTH/2, y: Math.floor(diver.y/TILE_HEIGHT)*TILE_HEIGHT+TILE_HEIGHT/2 });
      spawn_shell(Math.floor(diver.x/TILE_WIDTH)*TILE_WIDTH+TILE_WIDTH/2, Math.floor(diver.y/TILE_HEIGHT)*TILE_HEIGHT+TILE_WIDTH/2);
      air += AIR_FROM_BUBBLES
      air = Math.min(air, MAX_AIR)
      shellkeys += 1
      update_shellstext()
      break;
    case 66: // DEBUG - press B to spawn a bubble
      spawn_bubble(diver.x, diver.y);
      break;
    case 77: // DEBUG - press M to spawn a meaningful text
      spawn_meaning_text('something something', diver.x, diver.y);
      break;
    case 75: // DEBUG - press K to spawn a kelp
      kelps.push({ x: Math.floor(diver.x/TILE_WIDTH)*TILE_WIDTH+TILE_WIDTH/2, y: Math.floor(diver.y/TILE_HEIGHT)*TILE_HEIGHT+TILE_HEIGHT/2 });
      spawn_kelp(Math.floor(diver.x/TILE_WIDTH)*TILE_WIDTH+TILE_WIDTH/2, Math.floor(diver.y/TILE_HEIGHT)*TILE_HEIGHT+TILE_WIDTH/2);
      shellkeys -= 1
      update_shellstext()
      break;
  */
  }
  set_moving()
}

document.onkeyup = function document_onkeyup(event) {
  switch (event.keyCode) {
    case 65: // a
    case 37:
      keys.left = false
      break
    case 87:  // w
    case 38:
      keys.up = false
      break
    case 68:
    case 39:
      keys.right = false
      break
    case 83:
    case 40:
      keys.down = false
      break
  }
  set_moving()
}

var air = MAX_AIR
var shellkeys = 0
var won = false

function update(duration) {
  if (won == true) {
    if (performance.now() - won_at > 5000) { // five seconds after we technically won
      stage.removeChild(playing)
      stage.addChild(youwin)
      update = function (duration) { /* do nothing */ }
      return
    }
  } else {
    if (air > 0) {
      air -= duration
    } else {
      // stage.removeChild(playing)
      stage.addChild(gameover)
      update = function (duration) { /* do nothing */ }
      return
    }
  }

  var new_x = diver.x
  var new_y = diver.y
  var ok = true

  if (keys.left) {
    new_x -= duration * DIVER_SPEED
  } else if (keys.right) {
    new_x += duration * DIVER_SPEED
  }
  if (keys.up) {
    new_y -= duration * DIVER_SPEED_UP
  } else if (keys.down) {
    new_y += duration * DIVER_SPEED
  }
  // adapted from Chris DeLeon's DungeonKey
  if (PossiblyUnlock(new_x, new_y - DIVER_HEIGHT / 2)) {
    if (new_y < DIVER_HEIGHT / 2) {
      new_y = DIVER_HEIGHT / 2
    } else {
      new_y = Math.ceil((new_y - DIVER_HEIGHT/2)/TILE_HEIGHT)*TILE_HEIGHT + DIVER_HEIGHT / 2
    }
  }
  if (PossiblyUnlock(new_x - DIVER_WIDTH / 2, new_y)) {
    if (new_x < DIVER_WIDTH / 2) {
      new_x = DIVER_WIDTH / 2
    } else {
      new_x = Math.ceil((new_x - DIVER_WIDTH/2)/TILE_WIDTH)*TILE_WIDTH + DIVER_WIDTH / 2
    }
  }
  if (PossiblyUnlock(new_x, new_y + DIVER_HEIGHT / 2)) {
    new_y = Math.floor((new_y + DIVER_HEIGHT/2)/TILE_HEIGHT)*TILE_HEIGHT - DIVER_HEIGHT/2
  }
  if (PossiblyUnlock(new_x + DIVER_WIDTH / 2, new_y)) {
    new_x = Math.floor((new_x + DIVER_WIDTH/2)/TILE_WIDTH)*TILE_WIDTH - DIVER_WIDTH/2
  }
  if (ok) {
    diver.x = new_x
    diver.y = new_y
  }

  var first_world_dy = (DIVER_PREFERRED_POSITION - (diver.y + world.y)) * CAMERA_SPEED
  var new_world_y = world.y + first_world_dy
  new_world_y = Math.min(new_world_y, 0)
  new_world_y = Math.max(new_world_y, -1 * Math.abs(H - SCREEN_HEIGHT))
  new_world_y = Math.floor(new_world_y)
  var world_dy = new_world_y - world.y
  // displacement_filter.offset.y -= world.dy
  world.y += world_dy

  var first_world_dx = (DIVER_PREFERRED_X - (diver.x + world.x)) * CAMERA_SPEED
  var new_world_x = world.x + first_world_dx
  new_world_x = Math.min(new_world_x, 0)
  new_world_x = Math.max(new_world_x, -1 * Math.abs(W - SCREEN_WIDTH))
  new_world_x = Math.floor(new_world_x)
  var world_dx = new_world_x - world.x
  // displacement_filter.offset.x -= world.dx
  world.x += world_dx

  bglayer.y = world.y * 0.625

  update_ui(air / MAX_AIR)
  for (var i = 0; i < bubbles.length; i += 1) {
    bubbles[i].y -= BUBBLE_MOVE_SPEED
  }
  meaning_text.y -= BUBBLE_MOVE_SPEED
  displacement_filter.offset.x += duration / 40;
  displacement_filter.offset.y += duration / 40;
}

var previous_timestamp = null
document.getElementById('view').onclick = function () {
  stage.removeChild(startscreen)
  stage.addChild(playing)
  step = function (timestamp) {
    if (previous_timestamp == null) {
      previous_timestamp = timestamp
    }
    var duration = timestamp - previous_timestamp
    previous_timestamp = timestamp
    update(duration)
    renderer.render(stage)
    requestAnimFrame(step)
  }
  document.getElementById('view').onclick = function () { /* do nothing */ }
}
function step(timestamp) {
  renderer.render(stage)
  requestAnimFrame(step)
}
requestAnimFrame(step)
