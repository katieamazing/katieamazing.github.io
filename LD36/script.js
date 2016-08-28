var WIDTH = 640; // pixels
var HEIGHT = 360; // pixels
var TEXT_WIDTH = 382; // pixels
var PADDING = 8; // pixels to right and bottom of text
var SCROLL_SPEED = 0.01; // pixels per millisecond
var PLAYER_SPEED = 0.001; // pixels per millisecond
var PLAYER_SIZE = 3; // pixels "radius";  
var BG_COLOR = 0x555555; // rgb
var CHOICES_INDENT = 25; // pixels
var LOREM_IPSUM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras rhoncus nunc nibh, eu ultricies sem vestibulum ac. Duis venenatis tristique est, et suscipit libero. Etiam tempus felis ligula, in eleifend neque elementum vitae. Etiam sodales ligula sed nulla maximus varius in a turpis. Curabitur fringilla libero et quam facilisis, in sodales mi finibus. Vivamus accumsan metus vitae tristique pretium. Donec ultrices facilisis aliquet. Curabitur aliquam ex tellus, sed pellentesque enim pulvinar et. Proin lobortis nibh at luctus pulvinar. Cras at laoreet libero. Pellentesque facilisis, mi sit amet ornare scelerisque, mauris metus venenatis ligula, vel egestas lectus sem non diam. Nulla sed augue sem. Pellentesque velit lacus, tempor eget tincidunt nec, elementum eget lacus. Phasellus leo nisi, lobortis vitae nibh vitae, sodales facilisis lectus. Praesent et lacus a lorem pretium imperdiet. Phasellus a ligula vel enim ornare dapibus non vitae nibh.\n";


// rooms
var rooms = {};
rooms['Armory'] = {
	x: 183, y: 94, bottom: 158, right: 241, 
  name:'Armory',
  desc: 'This is the Armory. Racks of weapons and armor lean on the north and south walls. You can hear a faint noise of combat to the south.'
}; 
rooms['AudienceRoom'] = {
	x: 18, y: 160, bottom: 195, right: 99, 
  name:'Audience Room',
  desc: 'You walk into a receiving room furnished with lightly padded benches and a large table.'
};
rooms['Baths'] = {
	x: 98, y: 33, bottom: 93, right: 191,
  name:'Baths',
  desc: 'Steam obscures your vision as you step into the baths. An arcade of columns on the west side of the bathing area closes in the large outdoor pool, but a wide view of the rest of the compound is visible to the north.'
};
rooms['FrontPortico'] = {
	x: 99, y: 200, bottom: 257, right: 193, 
  name:'Front Portico',
  desc: 'You walk into a manicured garden with a beautiful fountain at its center.'
};
rooms['Library'] = {
	x: 18, y: 47, bottom: 93, right: 93, 
  name:'Library',
  desc: 'Shelves of books and scrolls line the walls of the library. There are large tables for reading and studying, and lots of candles for lighting dusty tomes.'
};
rooms['OuterPortico'] = {
  	x: 8, y: 37, bottom: 46, right: 97, 
  name:'Outer Portico',
  desc: 'You step onto a stone deck. To the north you can see the caesar\'s villa and the rest of the compound.'
};
rooms['Peristyle'] = {
	x: 18, y: 94, bottom: 158, right: 93, 
  name:'Peristyle',
  desc: 'You step out into a lushly decorated atrium with a marble impluvium for catching rainwater in the center. The fresh air and sunlight feel wonderful. To the north is the Library, to the east is the workshop, and to the south is the audience room.'
};
rooms['Salle'] = {
	x: 195, y: 160, bottom: 270, right: 240, 
  name:'Salle',
  desc: 'You step out into the salle, where soldiers are practicing their combat skills on soft sand.'
};
rooms['Solarium'] = {
	x: 100, y: 160, bottom: 198, right: 192, 
  name:'Solarium',
  desc: 'You blink as you enter the bright solarium. There are beautiful hangings on the walls and welcoming places to sit or rest.'
};
rooms['Workshop'] = {
	x: 92, y: 93, bottom: 158, right: 183, 
  name:'Workshop',
  desc: 'The scent of wood smoke and scorched flux fills this warm room. A huge fireplace sit against the east wall. There are sturdy desks with a variety of foreign tools on them.'
};

// the list of all the social verbs in the game.
// traveling doesn't count as a social verb.
var verbs = [];

// the state of the game, something like what social rank the player
// currently holds.
var state = 'one';

// the location of the player
var room = 'nowhere';

// the list of all the characters in the game.
var chars = {};

// Pour social "juice" from source character to dest character.
// For example:
// 1. if source is "nobody", flatter or amuse dest.
// 2. ask source for a favor on behalf of dest.
// 3. if dest is "nobody", annoy or insult dest.
function pour(source, dest) {
	var source_contents = Number.POSITIVE_INFINITY;
	if (source in chars) {
		source_contents = chars[source].contents;
	}
	var dest_remaining_capacity = Number.POSITIVE_INFINITY;
	if (dest in chars) {
		dest_remaining_capacity = chars[dest].capacity - chars[dest].contents;
	}
	var transferred = Math.min(source_contents, dest_remaining_capacity);
	if (isFinite(transferred)) {
		if (source in chars) {
			chars[source].contents -= transferred;
		}
		if (dest in chars) {
			chars[dest].contents += transferred;
		}
	}
}


function SimpleCharacter(name, capacity, color, description) {
	console.log(name);
	this.name = name;
	this.capacity = capacity;
	this.color = color;
	this.description = description;
	this.contents = 0;
	chars[this.name] = this;
}

SimpleCharacter.prototype.print = function () {
	addText(this.name + ': ' + this.contents + '\n');
	addText(this.description + '\n');
}

function SimplePour(state, room, source, destination) {
	this.state = state;
	this.room = room;
	this.source = source;
	this.destination = destination;
	verbs.push(this);
}

SimplePour.prototype.print = function () {
	// TODO
};

SimplePour.prototype.attempt = function () {
	if (state != this.state) {
		// console.log('wrong state');
	} else if (room != this.room) {
		// console.log('wrong room');
	} else if (this.source in chars
		&& chars[this.source].contents == 0) {
		// console.log('source has no juice to give');
	} else if (this.destination in chars
		&& chars[this.destination].contents == chars[this.destination].capacity) {
		// console.log('destination is already indebted to player');
	} else {
		pour(this.source, this.destination);
	}
}

function StateChange(source_state, destination_state, room, character, goal) {
	this.source_state = source_state;
	this.destination_state = destination_state;
	this.room = room;
	this.character = character;
	this.goal = goal;
	verbs.push(this);
}

StateChange.prototype.print = function () {
	// TODO
};

StateChange.prototype.attempt = function () {
	if (state != this.source_state) {
		//console.log('wrong state');
	} else if (room != this.room) {
		//console.log('cannot draw, ' + room + ' is not ' + this.room);
	} else if (chars[this.character].contents == this.goal) {
		state = this.destination_state;
	}
}






var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT,
	{backgroundColor : BG_COLOR});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

var room_debug = new PIXI.Graphics();
room_debug.beginFill(0x777777); // grey
for (var room_name in rooms) {
	var room = rooms[room_name];
	room_debug.drawRect(room.x, room.y, room.right - room.x, room.bottom - room.y);
}
room_debug.endFill();

stage.addChild(room_debug);

// TODO
//var bg = new PIXI.Sprite(new PIXI.Texture.fromImage('imgs/1835-27_UImockup.png', true));
//stage.addChild(bg);

function drawDiamond(graphics) {
	graphics.drawPolygon([
		0, -1 * PLAYER_SIZE, PLAYER_SIZE, 0, 0, PLAYER_SIZE, -1 * PLAYER_SIZE, 0
	])
}

var player = new PIXI.Graphics();
player.beginFill(0x00FF00); // green
drawDiamond(player);
player.endFill();
player.x = 100;
player.y = 100;
stage.addChild(player);

setTimeout(function() {
  new SimpleCharacter('Commander Appius Mallus', 5, 0xe42c34, 'A military commander with a strange sense of humor.');
  new SimpleCharacter('Incitatus', 3, 0x605ca8, 'A white horse.');
  new SimpleCharacter('Caria Tertia', 5, 0x6861e9, 'An armorer with strong, scar-flecked arms from working with hot metal.');
  new SimpleCharacter('Empress Aurelia Quintilia', 3, 0x92278f, 'Rather plain looking woman whose charisma and royal bearing makes it clear to all that she is Empress.');
  new SimpleCharacter('Senator Gnaeus Livius Balbus', 4, 0x0054a6, 'Young for a senator, Gnaeus has a nervous, greedy look about him.');
  new SimpleCharacter('Mae Catulla', 5, 0xa9d627, 'A busy-looking pretty girl with a hefty sheaf of papers under her arm.');
  new SimpleCharacter('Titus Ventor', 3, 0xf1c425, 'A handsome young man with straw colored hair.');
  new SimpleCharacter('Herius Musa', 2, 0xa0410d, 'A youngish man toting a stack of books by Socrates.');
  new SimpleCharacter('Caius Bruccius', 2, 0x74f398, 'A wise-looking older man with a long yellow-white beard.');
  new SimpleCharacter('Seia Luciana', 4, 0x00aeef, 'A shy, mousy looking maid.');
  new SimpleCharacter('Axia Durio', 2, 0xdc7e22, 'A loud woman with a ready laugh.');
  new SimpleCharacter('Marco Petronax', 3, 0x00a651, 'A burly man with dark, coiling hair.');

  var grammarWanderingChar = {
    descriptor: [
      'shy',
      'mousy',
      'busy',
      'flustered',
      'pretty',
      'cute',
      'sweet',
      'kind',
      'bored',
      'timid'
    ],
    role: [
      'page', 'servant', 'attendant', 'porter', 'servant', 'maid', 'guard'],
    origin: ['A #descriptor#, #descriptor#-looking #role#']
  };
  var grammarWanderingCharName = {
    first: [
      'Camelia', 'Valeria', 'Milonia', 'Annia', 'Hostus', 'Gallio', 'Aulus', 'Caelus'],
    last: [
      'Lentullus', 'Forianus', 'Iovinus', 'Vestina', 'Cyprias', 'Celer', 'Vonones', 'Lunaris'],
    origin: ['#first# #last#']
  };
  function generate(the_grammar) {
    var my_grammar = tracery.createGrammar(the_grammar);
    var text = my_grammar.flatten("#origin#");
    return text;
  };

  for (var i = 0; i < 3; i++) {
    var gentext = generate(grammarWanderingChar);
    var genname = generate(grammarWanderingCharName);
    new SimpleCharacter(genname, 0, 0xa67c52, gentext);
  };

  for (var char_name in chars) {
	console.log('something');
	var c = new PIXI.Graphics();
	c.beginFill(chars[char_name].color);
	drawDiamond(c);
	// TODO: put people inside the rooms
	c.x = Math.random() * (WIDTH - TEXT_WIDTH - 4 * PADDING) + 2 * PADDING
	c.y = Math.random() * (HEIGHT - 4 * PADDING) + 2 * PADDING;
	chars[char_name].x = c.x;
	chars[char_name].y = c.y;
	c.endFill();
	stage.addChild(c);
	}

}, 10);


var target = {
	x: 10,
	y: 10
};
var MAP_RECT = {
	x: 8, y: 8, right: WIDTH - TEXT_WIDTH, bottom: HEIGHT
};

function near_character(p) {
	for (var char_name in chars) {
		var c = chars[char_name];
		// TODO: CONSIDER TWEAKING THIS PLAYER SIZE *2?
		if (Math.hypot(c.x - p.x, c.y - p.y) < PLAYER_SIZE) {
			return c;
		}
	}
	return null;
}

renderer.view.addEventListener("click", function (e) {
	var canvas_bounds = renderer.view.getBoundingClientRect();
	var maybe_target = {
		x: e.clientX - canvas_bounds.left,
		y: e.clientY - canvas_bounds.top
	};
	var maybe_character_clicked = near_character(maybe_target);
	if (maybe_character_clicked) {
		// TODO: ADD CHARACTER NAME
		addText(maybe_character_clicked.description + '\n')
	} else if (point_in_rect(maybe_target, MAP_RECT)) {
		target.x = maybe_target.x;
		target.y = maybe_target.y;
	}
});

var textZone = new PIXI.Text('ANCIENT TECHNOLOGY\n\n', {
	wordWrap: true,
	wordWrapWidth: TEXT_WIDTH,
	fontFamily: '"Lucida Console", Monaco, monospace',
	fontSize: 12
});
textZone.x = WIDTH - TEXT_WIDTH - PADDING;
textZone.y = 0;
stage.addChild(textZone);

var choices = [];

function clearChoices() {
	for (var i = 0; i < choices.length; i += 1) {
		stage.removeChild(choices[i]);
	}
	choices = [];
}

function addChoice(string_to_add) {
	var text_to_add = new PIXI.Text(string_to_add, {
		wordWrap: true,
		wordWrapWidth: TEXT_WIDTH - CHOICES_INDENT,
		fontFamily:  '"Lucida Console", Monaco, monospace',
		fontSize: 12
	});
	text_to_add.x = WIDTH - TEXT_WIDTH - PADDING + CHOICES_INDENT;
	text_to_add.y = 0;
	stage.addChild(text_to_add);
	choices.push(text_to_add);
}

function addText(text_to_add) {
	textZone.text += text_to_add;
	while (true) {
		var textZoneBounds = textZone.getBounds();
		if (textZoneBounds.height < HEIGHT * 2) {
			break;
		}
		textZone.text = textZone.text.replace(/.*\n/, '');
	}	
}

// DEBUG DEBUG DEBUG
document.body.onkeypress = function (e) {
	if (e.key == "l") {
		addChoice(LOREM_IPSUM);
	} else if (e.key == "s") {
		addChoice("a short choice");
	} else if (e.key == "c") {
		clearChoices();
	} else {
		addText(LOREM_IPSUM);
	}
};
// DEBUG DEBUG DEBUG

function scrollTextZone(dt) {
	var accum = HEIGHT - PADDING;
	for (var i = choices.length - 1; i >= 0; i -= 1) {
		accum -= choices[i].getBounds().height;
		choices[i].y = accum;
	}
	var target_y = accum - textZone.getBounds().height;
	if (textZone.y < target_y) {
		textZone.y = target_y;
	}
	if (textZone.y > target_y) {
		textZone.y -= SCROLL_SPEED * dt;
	}
}

function point_in_rect(p, r) {
	return p.x >= r.x &&
		p.x <= r.right &&
		p.y >= r.y &&
		p.y <= r.bottom;
}

function tweenPlayer(dt) {
	if (player.x == target.x || player.y == target.y) {
		return;
	}
	var x_diff = target.x - player.x;
	var y_diff = target.y - player.y;
	var distance_to_target = Math.hypot(x_diff, y_diff);
	var distance_this_frame = PLAYER_SPEED * dt;
	if (distance_this_frame >= distance_to_target) {
		player.x = target.x;
		player.y = target.y;
		for (var room_key in rooms) {
			var room = rooms[room_key];
			if (point_in_rect(player, room)) {
				var text = 'You arrive in the ';
				text += room.name;
				text += '. ';
				text += room.desc;
				text += '\n';
				addText(text);
			}
		}
	} else {
		var f = distance_this_frame / distance_to_target;
		player.x += f * x_diff;
		player.y += f * y_diff;
	}
}

var previous_timestamp = null;
function animate(timestamp) {
	if (previous_timestamp == null) {
		previous_timestamp = timestamp
	}
	var dt = timestamp - previous_timestamp;
	if (dt > 1000) {
		dt = 1000; // we don't want frames to take more than 1s
	}
	if (dt > 0) {
		scrollTextZone(dt);
		tweenPlayer(dt);
	}
	renderer.render(stage);
	requestAnimationFrame(animate);
}
animate();
