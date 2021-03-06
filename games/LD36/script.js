
var WIDTH = 640; // pixels
var HEIGHT = 360; // pixels
var TEXT_WIDTH = 360; // pixels
var PADDING = 16; // pixels to right and bottom of text
var SCROLL_SPEED = 0.1; // pixels per millisecond
var PLAYER_SPEED = 0.05; // pixels per millisecond
var PLAYER_SIZE = 3; // pixels "radius";
var BG_COLOR = 0x555555; // rgb
var CHOICES_INDENT = 25; // pixels
var MAP_RECT = { // the active region for click-to-move
	x: 20, y: 26,
	width: WIDTH - TEXT_WIDTH - 8,
	height: HEIGHT - 8,
	right: WIDTH - TEXT_WIDTH, bottom: HEIGHT
};
var MAX_TWEENS = 100; // if people start stopping in doorways, increase this
// var WALK_PROB = 0.0; // DEBUG DEBUG DEBUG
var WALK_PROB = 0.008; // probability (between 0.0 and 1.0) of someone starting to walk to a new location, per frame.
var won = false;
var rooms = {};
//--------------- START STUFF------------------------------
  //choose a civ
  //enter a player name
  //story = generate(grammarStartingStory)
  //addText(story)
//---------------------------------------------------------

//TODO these two are probably global variables we should pull from somewhere else.
var alphaNPC = 0.0;
var civ = 'Lemuria';
var playerName = 'Steve';
//
if (civ == 'Lemuria'){
  var nationality = 'Lemurian';
} else {
  var nationality = 'Atlantean';
}
var playerJuice = 0;
var focus_npc = null; // who are we thinking about verbing?
var npcSprite = null;
var npcs = {};
var choices = [];
var choice_verbs = [];

//--------------------WIN STUFF---------------------------
//TODO put this in an appropriate place
var collected_techs = [];
function maybe_win(){
	if (collected_techs.length >= 3 && !won) {
	  var techlist = '';
	  for (var i = 0; i < collected_techs.length; i++){
	    techlist += collected_techs[i]+'\n';
	  };
	  addText('\n\nCongratulations! You have collected three technologies:\n'+techlist+'.\n', mode.textZone);
	  addText('You return to '+civ+' and are hailed as a hero!\n '+collected_techs[1]+' ends up being critically useful in building '+nationality+' culture to its greatest heights yet.\n\n', mode.textZone);
	  var credits = [
		'Johnicholas Hines\n@Johnicholas  |  johnicholas.com\n',
		'Katie Allen\n@ka_amazing  |  katieamazing.com\n\n',
		'With thanks to:\n',
		'pixi.js,\n',
		'user tigersound on freesound.org for the footstep sound effect,\n',
		'Kate Compton\'s (@galaxykate) amazingly amusing tracery tool,\n',
		'and Marcelle Duchesne-Guillemin\'s ancient audio .midi'
		];
	  for (i=0; i<credits.length;i++){
	  	addText(credits[i], mode.textZone);
	  }
	  clearChoices(mode.mid);
	  won = true;
	};
}
//--------------------------------------------------------

//--------------- LOSE STUFF------------------------------
//if (introduced to all chars && playerJuice < 6){
  //addText('You are unsucessful in your attempts to gain friends and influence in Rome. You grow to be so hated that you are driven in your angst to put your eyes out with a toga pin. You wander, friendless, through the Roman countryside until you die.');
  //wait.
  //restart?
//}
//--------------------------------------------------------

function Room(t) {
	this.x = t.x;
	this.y = t.y;
	this.bottom = t.bottom;
	this.right = t.right;
	this.description = t.desc;
	this.width = this.right - this.x;
	this.height = this.bottom - this.y;
	this.center = {
		x: (this.x + this.right) / 2,
		y: (this.y + this.bottom) / 2
	};
}

rooms['Armory'] = new Room({
	x: 195, y: 84, bottom: 150, right: 253,
  name:'Armory',
  desc: 'This is the Armory. Racks of weapons and armor lean on the north and south walls. You can hear a faint noise of combat to the south.'
});
rooms['Salle'] = new Room({
	x: 207, y: 150, bottom: 270, right: 253,
  name:'Salle',
  desc: 'You step out into the salle, where soldiers are practicing their combat skills on soft sand.'
});
rooms['AudienceRoom'] = new Room({
	x: 30, y: 150, bottom: 195, right: 112,
  name:'Audience Room',
  desc: 'You walk into a receiving room furnished with lightly padded benches and a large table.'
});
rooms['Baths'] = new Room({
	x: 112, y: 23, bottom: 84, right: 207,
  name:'Baths',
  desc: 'Steam obscures your vision as you step into the baths. An arcade of columns on the west side of the bathing area closes in the large outdoor pool, but a wide view of the rest of the compound is visible to the north.'
});
rooms['FrontPortico'] = new Room({
	x: 112, y: 195, bottom: 257, right: 207,
  name:'Front Portico',
  desc: 'You walk into a manicured garden with a beautiful fountain at its center.'
});
rooms['Library'] = new Room({
	x: 30, y: 37, bottom: 84, right: 112,
  name:'Library',
  desc: 'Shelves of books and scrolls line the walls of the library. There are large tables for reading and studying, and lots of candles for lighting dusty tomes.'
});
rooms['OuterPortico'] = new Room({
  	x: 20, y: 25, bottom: 37, right: 112,
  name:'Outer Portico',
  desc: 'You step onto a stone deck. To the north you can see the caesar\'s villa and the rest of the compound.'
});
rooms['Peristyle'] = new Room({
	x: 30, y: 84, bottom: 150, right: 105,
  name:'Peristyle',
  desc: 'You step out into a lushly decorated atrium with a marble impluvium for catching rainwater in the center. The fresh air and sunlight feel wonderful. To the north is the Library, to the east is the workshop, and to the south is the audience room.'
});
rooms['Solarium'] = new Room({
	x: 112, y: 150, bottom: 207, right: 195,
  name:'Solarium',
  desc: 'You blink as you enter the bright solarium. There are beautiful hangings on the walls and welcoming places to sit or rest. A duo of musicians plays in the corner.'
});
rooms['Workshop'] = new Room({
	x: 105, y: 84, bottom: 150, right: 195,
  name:'Workshop',
  desc: 'The scent of wood smoke and scorched flux fills this warm room. A huge fireplace sit against the east wall. There are sturdy desks with a variety of foreign tools on them.'
});
// destinations are points inside of rooms
// sources are points inside of rooms
// in order to go from source to dest,
// we need a sequence of doors,
// and we will tween from door to door
// if you are in room X,
// and your destination is point P in room Y,
// what should you do??
// 1. if room X equals room Y, tween to point P
// 2. else tween through to(X, Y)
var OuterPorticoLibraryDoor = { x: 82, y: 37 };
var LibraryPeristyleDoor = { x: 75, y: 84 };
var PeristyleAudienceRoomDoor = { x: 75, y: 150 };
var PeristyleWorkshopDoor = { x: 105, y: 115 };
var AudienceRoomSolariumDoor = { x: 112, y: 175 };
var SolariumFrontPorticoDoor = { x: 158, y: 195 };
var BathsWorkshopDoor = { x: 159, y: 84 };
var WorkshopArmoryDoor = { x: 195, y: 100 };
var ArmorySalleDoor = { x: 229, y: 150 };
var map = {};
map['OuterPortico'] = {
	Default: OuterPorticoLibraryDoor
};
map['Library'] = {
	OuterPortico: OuterPorticoLibraryDoor,
	Default: LibraryPeristyleDoor
};
map['Peristyle'] = {
	OuterPortico: LibraryPeristyleDoor,
	Library: LibraryPeristyleDoor,
	AudienceRoom: PeristyleAudienceRoomDoor,
	Solarium: PeristyleAudienceRoomDoor,
	FrontPortico: PeristyleAudienceRoomDoor,
	Default: PeristyleWorkshopDoor,
};
map['AudienceRoom'] = {
	Solarium: AudienceRoomSolariumDoor,
	FrontPortico: AudienceRoomSolariumDoor,
	Default: PeristyleAudienceRoomDoor
};
map['Baths'] = {
	Default: BathsWorkshopDoor
};
map['Workshop'] = {
	Baths: BathsWorkshopDoor,
	Armory: WorkshopArmoryDoor,
	Salle: WorkshopArmoryDoor,
	Default: PeristyleWorkshopDoor,
};
map['Solarium'] = {
	FrontPortico: SolariumFrontPorticoDoor,
	Default: AudienceRoomSolariumDoor
};
map['Armory'] = {
	Salle: ArmorySalleDoor,
	Default: WorkshopArmoryDoor
};
map['Salle'] = {
	Default: ArmorySalleDoor
};
map['FrontPortico'] = {
	Default: SolariumFrontPorticoDoor
};

// This function returns the first intermediate point to go to.
function to(current_room_name, dest_room_name) {
	if (current_room_name in map) {
		if (dest_room_name in map[current_room_name]) {
			return map[current_room_name][dest_room_name];
		} else {
			return map[current_room_name]["Default"];
		}
	} else {
		console.log('using fallback');
		return PeristyleWorkshopDoor; // fallback
	}
}

function generate(the_grammar) {
  var my_grammar = tracery.createGrammar(the_grammar);
  var text = my_grammar.flatten("#origin#");
  return text;
};


// --------------------- VERBS ---------------------------
var verbs = [];

var Introduce = {
	print: function (focus_npc) {
		if (!npcs[focus_npc].introduced) {
			addChoice("Introduce yourself to "+focus_npc, this, mode.mid);
		}
	},
	attempt: function (focus_npc) {
    if (focus_npc == 'Incitatus') {
      addText('Incitatus is a horse.\n'); // TODO FIX LATER
      return;
    }
		console.log('you attempt to introduce to ' + focus_npc);
    var grammarIntroduction = {
      one: [
        'Welcome to our fair city!',
        'Be welcome.',
        'Oh, hello... '+playerName+' was it? What a strange name. I mean, beautiful, but strange.',
        'A visitor from '+civ+'? How exotic!',
        'Wow, you must be from far away, your clothes are so different from mine!',
        'I\'m sorry, do I know you? Are you a new ambassador?',
        'An ambassador from '+civ+'?',
        'Greetings and welcome, '+playerName+'!',
        'Welcome!'
      ],
      two: [
        'Hope you survive the night! Ha, ha, just kidding.',
        'I hope your visit here is pleasant.',
        'Goodness, look at you. You should visit our wonderful baths straight away, traveller!',
        'Was your trip very long?',
        'I hope your journey here wasn\'t too bad',
        'Not another petitioner to the Caesar, I hope?',
        'We should find you a toga. There\'s nothing like living in Rome as the Romans do, foreigner.',
        'It is nice to meet you.',
        'I am glad to make your acquaintance.',
        'Have a good stay here in Rome.',
        'I hope you get a chance to visit the villa\'s restful gardens.'
      ],
      origin: [
        '#one# #two#'
      ]
    };
    var introText = generate(grammarIntroduction);
		addText(npcs[focus_npc].name+': '+introText + '\n', mode.textZone);
		npcs[focus_npc].introduced = true;
		npcs[focus_npc].juice += 1;
		playerJuice += 1;
	}
};
verbs.push(Introduce);

var IntroduceRepeat = {
	print: function (focus_npc) {
		if (npcs[focus_npc].introduced) {
			addChoice("Introduce yourself to "+focus_npc, this, mode.mid);
		}
	},
	attempt: function (focus_npc) {
		console.log('you attempt to introduce to ' + focus_npc+'.');
		addText('You introduce yourself to ' + focus_npc + ', who looks familiar.\n', mode.textZone);
		var grammarBrushOff = {
			excuse: [
			  'walk my snorlax',
			  'finish this manuscript',
			  'admire my togas',
			  'take my afternoon bath... alone',
			  'take a walk and clear my head',
			  'go... plot, I mean plan.. some stuff',
			  'deliver this letter',
			  'see a man about a bet',
			  'finish writing this gladiator fan fiction I started writing last night',
			  'buy some olives',
			  'shopping in the market'
			],
			origin: [
			  'I\'m sorry, '+playerName+', I need to #excuse#.',
			  'I don\'t have time for you today, '+nationality+'.',
			  'Excuse me, I am needed elsewhere.',
			  'Sorry, I can\'t help you with that.',
			  'I have to #excuse#.',
			  'I need to #excuse# now, but maybe later?',
			  'I\'m too busy, I have to #excuse# now, and after that I have to #excuse#.',
			  'Can\'t you see that I\'m busy?'
			]
		};
		var text = generate(grammarBrushOff);
		addText(npcs[focus_npc].name+': '+text + '\n', mode.textZone);
		npcs[focus_npc].juice -= 1;
		playerJuice -= 1;
	}
};
verbs.push(IntroduceRepeat);

var SmallTalk = {
	print: function (focus_npc) {
		if (!npcs[focus_npc].introduced || playerJuice < npcs[focus_npc].req-3) {
			return;
		}
		addChoice("Small talk with "+focus_npc, this, mode.mid);
	},
	attempt: function (focus_npc) {
		console.log('you attempt to smalltalk');
    if (playerJuice >= npcs[focus_npc].req-2){
        var grammarSmallTalk = {
	    weather: ['rain', 'snow', 'wind', 'heat', 'sunshine', 'pleasant breeze', 'humidity', 'torrential flooding'],
	    task: [
	      'wash my togas',
	      'air out my togas',
	      'check in on my aging father and his mistress',
	      'bathe',
	      'hire a slave to fan me',
	      'water my garden',
	      'sweep my floors',
	      'buy wood for my fireplace'
	    ],
	    activity: [
	      'chopping some olives',
	      'grinding spices',
	      'folding my togas',
	      'marinating cheese',
	      'doing my hair',
	      'anointing myself with oils',
	      'pretenting to be a gladiator',
	      'betting on chariot races',
	      'writing pleas to the Caesar',
	      'practicing wrestling',
	    ],
	    place: ['library', 'baths', 'kitchen', 'bathroom', 'dressing room', 'market'],
	    origin: [
	      'I don\'t mind the #weather# we have had lately, but I am worried about getting #weather# tomorrow. I wouldn\'t want to have to #task#.',
	      'It\'s a nice day, isn\'t it? I won\'t have to #task# all week if this #weather# keeps up.',
	      'My little garden is loving this #weather#.',
	      'I hurt my finger while #activity# in the #place# last week, but it is feeling much better.',
	      'I\'ve been so busy #activity# in the evenings that I haven\'t had a chance to #task# all week!',
	      'I can\'t stand this #weather#, but at least I can stay inside #activity# during the day.'
	    ]
	  };
      var text = generate(grammarSmallTalk);
      //TODO not working - need to call function inna function??
		addText(npcs[focus_npc].name+': '+text + '\n', mode.textZone);
		npcs[focus_npc].juice += 1;
		playerJuice += 1;
    } else {
      addText(npcs[focus_npc].name+' doesn\'t seem interested in talking to you.\n', mode.textZone);
    }
	}
};
verbs.push(SmallTalk);

var Flattery = {
	print: function (focus_npc) {
		if (!npcs[focus_npc].introduced || playerJuice < npcs[focus_npc].req-1) {
			return;
		}
		addChoice("Flatter " + focus_npc, this, mode.mid);
	},
	attempt: function (focus_npc) {
		console.log('you attempt flattery');
		if (playerJuice >= npcs[focus_npc].req){
			console.log('suceeded at flattery')
		    var grammarFlattery = {
			    attribute: [
			      'eye color',
			      'sense of adventure',
			      'sense of humor',
			      'work ethic',
			      'pretty hair',
			      'arms',
			      'fashion sense',
			      'toga',
			      'outfit',
			      'gladiator fan fiction'
			    ],
			    origin: [
			      'Oh... t-thank you, you too.',
			      'Wow, thank you! I like your #attribute# too.',
			      'You really think my #attribute# is good?',
			      'You are going to make me blush, being so nice about my #attribute#.',
			      'Such kind words! Thank you.',
			      'What generous praise! Gratitude, '+playerName+'.',
			      'Thank you! Flattery will get you everywhere with me.'
			    ]
			  };
		  var text = generate(grammarFlattery);
			addText(npcs[focus_npc].name+': '+text + '\n', mode.textZone);
			  npcs[focus_npc].juice += 1;
			  playerJuice += 1;
		} else {
		  addText(npcs[focus_npc].name+' doesn\'t seem interested in listening to you.\n', mode.textZone);
		}
	}
};
verbs.push(Flattery);

var AskAboutWork = {
	print: function (focus_npc) {
		if (!npcs[focus_npc].introduced || playerJuice < npcs[focus_npc].req+1 ) {
			return;
		}
		if (playerJuice >= npcs[focus_npc].req+2 && npcs[focus_npc].juice >= 2) {
			addChoice("Ask About Work", this, mode.mid);
		}
	},
	attempt: function (focus_npc) {
		console.log('you attempt to ask about work');
		if (playerJuice >= npcs[focus_npc].req+3) {
			addText(npcs[focus_npc].name+': '+npcs[focus_npc].work + '\n', mode.textZone);
		} else {
			    var grammarBrushOffFriend = {
			    desc: ['trade', 'guild\'s', 'family', 'heirloom'],
			    origin: [
			      'I\'m sorry, '+playerName+', I can\'t share my #desc# secrets.',
			      'It\'s not that I don\'t trust you, but you are '+nationality+'. I can\'t tell you about that.'
			    ]
			  };
			var text = generate(grammarBrushOffFriend);
			addText(npcs[focus_npc].name+': '+text + '\n', mode.textZone);
			npcs[focus_npc].juice -= 1;
		}
	}
};
verbs.push(AskAboutWork);

var AskForTech = {
	print: function (focus_npc) {
		if (!npcs[focus_npc].introduced) {
			return;
		}
		if (playerJuice >= npcs[focus_npc].req*2 && npcs[focus_npc].juice >= 3) {
			addChoice("Ask For Tech", this, mode.mid);
		}
	},
	attempt: function (focus_npc) {
		console.log('you attempt to ask for tech');
		if (playerJuice >= npcs[focus_npc].req*2+2 && npcs[focus_npc].juice >= 4){
			addText(npcs[focus_npc].name+': '+npcs[focus_npc].techdesc + '\n', mode.textZone);
      collected_techs.push(npcs[focus_npc].tech);
      maybe_win();
		} else {

		          var grammarBrushOffFriend = {
			    desc: ['trade', 'guild\'s', 'family', 'heirloom'],
			    origin: [
			      'I\'m sorry, '+playerName+', I can\'t share my #desc# secrets.',
			      'It\'s not that I don\'t trust you, but you are '+nationality+'. I can\'t tell you about that.'
			    ]
			  };
			  var nopetext = generate(grammarBrushOffFriend);
			  addText(npcs[focus_npc].name+': '+nopetext + '\n', mode.textZone);
		}
	}
};
verbs.push(AskForTech);


// var AskToPutInAGoodWord = {};
// verbs.push(AskToPutInAGoodWord);

var renderer = PIXI.autoDetectRenderer(WIDTH, HEIGHT,
	{backgroundColor : BG_COLOR});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

// --------------------- ROOM DEBUG -----------------------
//var room_debug = new PIXI.Graphics();
//room_debug.beginFill(0x777777); // grey
//for (var room_name in rooms) {
//	var room = rooms[room_name];
//	room_debug.drawRect(
//		room.x + 10, room.y + 10,
//		room.right - room.x - 10, room.bottom - room.y - 10
//	);
//}
//room_debug.endFill();
//mid.addChild(room_debug);

function goToMode(new_mode) {
  mode.cleanup();
  mode = new_mode;
  mode.start();
}

var audWalking = new sound("walking.mp3");
var audMusic = new sound("music.mp3");

var gameplay = {};
gameplay.start = function () {
	this.container = new PIXI.Container();
	stage.addChild(this.container);
	var bg = new PIXI.Sprite(new PIXI.Texture.fromImage('imgs/UIbg.png'));
	this.container.addChild(bg);
	this.mid = new PIXI.Container();
	this.container.addChild(this.mid);
	var fg = new PIXI.Sprite(new PIXI.Texture.fromImage('imgs/UI_frame.png'));
	this.container.addChild(fg);

  // ------------------------ TEXT ZONE --------------------
  this.textZone = new PIXI.Text('When In Rome\n', {
    wordWrap: true,
    wordWrapWidth: TEXT_WIDTH,
    fontFamily: '"Microsoft Sans Serif", Monaco, monospace',
    fontSize: 12,
    fill: 0x211303
  });
  this.textZone.x = WIDTH - TEXT_WIDTH - PADDING;
  this.textZone.y = 0;
  this.mid.addChild(this.textZone);

  this.textNPC = new PIXI.Text('\n', {
    wordWrap: true,
    wordWrapWidth: 260-140,
    fontFamily: '"Microsoft Sans Serif", Monaco, monospace',
    fontSize: 10,
    fill: 0x211303,
    alpha: alphaNPC
  });
  this.textNPC.x = 140;
  this.textNPC.y = 270;
  this.mid.addChild(this.textNPC);

  this.player = new GraphicalCharacter(
    115, // x
    265, // y
    0x211303, // color,
    [], // locations,
	this.mid
  );
  player = this.player; // TODO TODO MAKE THIS NOT GLOBAL AFTER GAME
  this.youarehere = new PIXI.Text('YOU ARE HERE', {
    fontFamily: '"Microsoft Sans Serif", Monaco, monospace',
    fontSize: 10,
    fill: 0x211303,
  });
  this.youarehere.x = 120;
  this.youarehere.y = 260;
  this.mid.addChild(this.youarehere);


  //audMusic.play();

	new NPC('Commander Appius Mallus', 12, 0xe42c34, 'imgs/appius.png', ['Armory', 'Salle', 'FrontPortico'], 'A military commander with a strange sense of humor.', 'My work? I oversee the army in this part of the country, and command a company when we are sent into battle. I have to get my siege engines working in time for the next campaign!', 'Of course, if it will help your people as it has helped all of Rome. Here are the plans for the siege engines I have developed.', 'Siege Engines', this.mid);

	new NPC('Incitatus', 1000, 0x605ca8, 'imgs/incitatus.png', ['Salle'], 'A white horse.', '', '', '', this.mid);

	new NPC('Caria Tertia', 14, 0x6861e9, 'imgs/caria.png', ['Workshop', 'Armory'], 'An armorer with strong, scar-flecked arms from working with hot metal.', 'My work is making endless sets of armor for the military. It sounds like drudgery, I know, but I enjoy my work and feel great when I devise better way of protecting my brave countrymen.', 'I suppose, if it will prevent deaths in combat in your land. Here are my notes on making the lorica segmentata and lorica hamata of Roman armies.', 'Roman Armor', this.mid);

	new NPC('Empress Aurelia Quintilia', 25, 0x92278f, 'imgs/aurelia.png', ['Baths', 'Peristyle', 'AudienceRoom', 'Solarium', 'FrontPortico'], 'Plain looking woman whose royal bearing makes it clear to all that she is Empress.', 'My work is being wife to the Caesar. It is a full time job.', 'Technologies? I am not the steward of any one particular technology. Perhaps I will put in a good word for you with some of our brilliant Roman artisans. You seem earnest and have proved to be a gracious guest of our country.', '', this.mid);

	new NPC('Senator Gnaeus Livius Balbus', 12, 0x0054a6, 'imgs/gnaeus.png', ['AudienceRoom', 'Peristyle', 'Baths'], 'Young for a senator, Gnaeus has a nervous, greedy look about him.', 'I am but a junior Senator, seeking to climb the ranks of political power. I know I seem young, I do get that a lot, but you see, my family is wealthy by way of mining, and sought to grow the Balbus name by my meager influence in the Senate.', 'Of course my friend, I am glad to share the Balbus mining techniques. Here is a letter from my father, who seems to think dry descriptions of mining equipment suitable content for missives from home.', 'Mining', this.mid);

	new NPC('Mae Catulla', 7, 0xa9d627, 'imgs/mae.png', ['AudienceRoom', 'Solarium', 'Library', 'Peristyle'], 'A busy-looking pretty girl with a hefty sheaf of papers under her arm.', 'Oh gosh, I really am so busy... alright. I\'m a consul\'s assistant. He has me here to research and network on his behalf to get his entertainment projects going - he\'s seeking greater popularity by throwing events. And he can\'t pick just one! Naval battle displays, chariot races, gladiator games, I am so overworked!', 'Sure! I guess it will depend on what your people consider fun, but here are my notes on throwing a grand spectacle to please the people, Roman-style. Here, take these posters I made up for the upcoming public execution, too!', 'Public Spectacles', this.mid);

	new NPC('Titus Ventor', 15, 0xf1c425, 'imgs/titus.png', ['Workshop', 'Baths', 'OuterPortico'], 'A handsome young man with straw colored hair.', 'Oh darling, my work is really quite dull. Instead of talking about dusty roads and concrete pouring, let\'s talk about US.', 'Well, I suppose, if that\'s all you want from me. Take this scroll, it has my sketches and recipes for road construction, and the finest concrete ever made.', 'Concrete and Road Construction', this.mid);

	new NPC('Herius Musa', 6, 0xa0410d, 'imgs/herius.png', ['Library', 'Peristyle', 'OuterPortico'], 'A youngish man toting a stack of scrolls by Socrates.', 'My work is studying the great scholar Socrates. Would you like to engage in a Socratic discussion with me? Wait, you are unfamiliar with the Father of Philosophy? Here, read this book. It\'s much more compact and efficient than a scroll.', 'Oh, absolutely. I\'ll just show you, here. You need thread and fine paper or parchment, and you bind them together to make a book, like this.', 'Books', this.mid);

	new NPC('Caius Bruccius', 10, 0x74f398, 'imgs/caius.png', ['Library', 'Workshop', 'Baths'], 'A wise-looking older man with a yellow-white beard.', 'Huh? Speak up, child. Oh, my work? It\'s not very interesting to the youth of today. I design plumbing and irrigation systems so that you ingrates can enjoy baths and fresh food from your gardens.', 'Hrmph, I don\'t know about sharing my legacy with a child from a foreign land. But as long as you tell all who benefit that it was the wise and kind Caius Bruccius who brought these wonders, I suppose I can let you in on the secrets of plumbing.', 'Plumbing, Irrigation, and Aqueducts', this.mid);

	new NPC('Seia Luciana', 12, 0x00aeef, 'imgs/seia.png', ['Library', 'Peristyle'], 'A shy, mousy looking maid.', 'W-what? You wouldn\'t care to know about my work, sir. I just clean the Library. Are you t-teasing me?', 'I am no scholar, just a humble servant. B-but... I have picked up a few things spending so much of my time here in the Library. I can show you what I know of mathematics.', 'Mathematics and the Abacus', this.mid);

	new NPC('Axia Durio', 18, 0xdc7e22, 'imgs/axia.png', ['Workshop', 'FrontPortico'], 'A loud woman with a ready laugh.', 'I blow glass, and make the most beautiful things for any Roman household. The Empress herself has recently commissioned me to create a suite of cosmetic jars for her private quarters, and I\'ll be sure to impress her with the most wildly gorgeous glass anyone has ever seen!', 'Only if you promise to share my name far and wide, so that I might become famous in your land. Here are my recipes for the sand mixtures to make nearly clear glass and a number of colors.', 'Glass Blowing', this.mid);

	new NPC('Marco Petronax', 8, 0x00a651, 'imgs/marco.png', ['Workshop', 'Peristyle', 'Library'], 'A burly man with dark, coiling hair.', 'My work is working, not talking about my work. Can\'t you see I\'m busy tending the fire to keep my forge hot?', 'Of course, there are places where barbarians don\'t know how to smelt and work with brass and pewter? I pity '+nationality+'. Here are my schema for the metallurgical arts that I know.', 'Metallurgy', this.mid);

	var grammarWanderingChar = {
	descriptor: [
	  'shy', 'mousy', 'busy', 'flustered', 'pretty', 'cute', 'sweet', 'kind', 'bored', 'timid'],
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

	/*var allrooms = [];
	for (var roomname in rooms){
		allrooms.push(roomname);
	}
	for (var i = 0; i < 3; i++) {
		var gentext = generate(grammarWanderingChar);
		var genname = generate(grammarWanderingCharName);
		new NPC(genname, 1000, 0xa67c52, null, allrooms, gentext, '', '', '', this.mid);
	};*/

}
gameplay.click = function (x, y) {
	var maybe_target = { x: x, y: y };
	if (point_in_rect(maybe_target, MAP_RECT)) {
		var maybe_character_clicked = near_character(maybe_target);
		if (maybe_character_clicked) {
			if (maybe_character_clicked.graphical_character.room() == this.player.room()) {
				focus_npc = maybe_character_clicked.name;
				//TODO: draw the sprite
				if (npcSprite) {
					this.mid.removeChild(npcSprite);
				}
				npcSprite = new PIXI.Sprite(new PIXI.Texture.fromImage(maybe_character_clicked.sprite));
				npcSprite.anchor.x = 0;
				npcSprite.anchor.y = 1;
				npcSprite.position.x = 0;
				npcSprite.position.y = HEIGHT;
				alphaNPC = 5.0;
				npcSprite.alpha = Math.min(alphaNPC, 1.0);
				this.textNPC.alpha = npcSprite.alpha;
				this.mid.addChild(npcSprite);

				//maybe use a loader, so we can get the Imageheight/width better?
				//var loader = new PIXI.AssetLoader([  "images/imageOne.png",  "images/imageTwo.png",  "images/imageThree.png"]);loader.onComplete = setup;loader.load();function setup() {   //Create the sprite from the loaded image texture  var texture = PIXI.TextureCache["images/imageOne.png"];  var anySprite = new PIXI.Sprite(texture);}

				//TODO: and then fade the sprite
			} else {
				focus_npc = null;
				this.mid.removeChild(npcSprite);
			}

			if (maybe_character_clicked.introduced == true){
				this.textNPC.text = '\n'+maybe_character_clicked.name+'\n'+maybe_character_clicked.description;
			} else {
				this.textNPC.text = '\n'+maybe_character_clicked.description;
			}
			this.textNPC.alpha = 1.0;
			alphaNPC = 2.0;
		} else {
			focus_npc = null;
			var roomName = point_to_room(maybe_target);
			audWalking.play();
			if (roomName == this.player.room()) {
				this.player.walkTo(maybe_target,
				"",
				function () { audWalking.stop(); });
			} else {
				this.player.walkTo(maybe_target,
					rooms[roomName].description + '\n',
					function () { audWalking.stop(); });
			}
			this.mid.removeChild(this.youarehere);
		}
		updateChoices(this.mid);
	} else {
		// console.log('clicked outside of map rect');
		for (var i = choices.length - 1; i >= 0; i -= 1) {
			if (point_in_rect(maybe_target, choices[i].getBounds())) {
				// addText('chose choice ' + i + '\n');
				choice_verbs[i].attempt(focus_npc);
				updateChoices(this.mid);
				break;
			}
		}
	}
}
gameplay.animate = function (dt) {
  animate_tweens(dt);
  scroll(dt, this.textZone);
  alphaDecay(dt);
  near_music(this.player.graphics);
  if (Math.random() < WALK_PROB) {
    var npc = chooseDict(npcs);
    npc.graphical_character.walkRandom(npc.name);
  }
}

function generateStartingStory() {
  var grammarStartingStory = {
    intro: [
      'As you may know,', 'We have kept it a secret until now, but'],
    bad_thing: [
      'rising water levels',
      'hordes of invaders',
      'uprisings',
      'thieves of our trade secrets',
      'murders of many important guildsmen and artisans'
      ],
    scope: [
      'castle', 'kindgom', 'land', 'city', 'country'],
    tech: [
      'armor',
      'siege engines',
      'mining',
      'metallurgy',
      'mining',
      'plumbing',
      'aqueducts',
      'concrete',
      'roads',
      'bridges',
      'mathematics',
      'the abacus',
      'glass blowing',
      'arena spectacles and gladiator games'],
    origin: [
      "#intro# #bad_thing# have troubled the #scope# for some time now. Additionally, we are concerned about #bad_thing# becoming an issue in the near future. We believe that the Roman Civilization holds secrets that will rescue us from our predicament. Perhaps #tech#, or #tech#? We are sending you to Rome, to seek out technologies. Use your skills as an ambassador and your cunning as a spy to wrench, coax, and steal whatever technological secrets you can from the Romans.\n\n"
    ],
  };
  return generate(grammarStartingStory);
}

var splash = {};
splash.start = function () {
  this.container = new PIXI.Container();
  stage.addChild(this.container);

  this.container.addChild(new PIXI.Sprite(new PIXI.Texture.fromImage('imgs/bgSplash.png'))); // TODO: KT WILL FIX

  // ------------------------ TEXT ZONE --------------------
  this.textZone = new PIXI.Text('Choose your nationality:\n', { // TODO: KT WILL FIX
    wordWrap: true,
    wordWrapWidth: TEXT_WIDTH,
    fontFamily: '"Microsoft Sans Serif", Monaco, monospace',
    fontSize: 12,
    fill: 0x211303
  });
  this.textZone.x = WIDTH - TEXT_WIDTH - PADDING;
  this.textZone.y = 0;
  this.container.addChild(this.textZone);

  var that = this;
  addChoice('Lemuria', {}, this.container);
  addChoice('Atlantis', {}, this.container);
}
splash.cleanup = function () {
  stage.removeChild(this.container);
  clearChoices(this.container);
}
splash.click = function (x, y) {
  var maybe_target = {
    x: x,
    y: y
  };
  for (var i = choices.length - 1; i >= 0; i -= 1) {
    if (point_in_rect(maybe_target, choices[i].getBounds())) {
      if (choices[i].text == 'Lemuria') {
        civ = 'Lemuria';
        this.textZone.text = generateStartingStory();
        clearChoices(this.container);
        addChoice('go to Rome!', {}, this.container);
        break;
      } else if (choices[i].text == 'Atlantis') {
        civ = 'Atlantis';
        this.textZone.text = generateStartingStory();
        clearChoices(this.container);
        addChoice('go to Rome!', {}, this.container);
      } else {
        clearChoices(this.container);
        goToMode(gameplay);
      }
    }
  }
}
splash.animate = function (dt) {
  scroll(dt, this.textZone);
}
var mode = splash;
mode.start();


// A graphical character is a diamond that can walk around the
// map, including the player character and the non-player characters.
function GraphicalCharacter(x, y, color, locations, container) {
	this.graphics = new PIXI.Graphics()
	this.graphics.beginFill(color);
	// draw a diamond
	this.graphics.drawPolygon([
		0, -1 * PLAYER_SIZE, PLAYER_SIZE, 0, 0, PLAYER_SIZE, -1 * PLAYER_SIZE, 0
	])
	this.graphics.endFill();
	this.graphics.x = x;
	this.graphics.y = y;
	this.locations = locations;
	container.addChild(this.graphics);
};

function doNothing() {
	// does nothing, intentionally
}
function point_in_rect(p, r) {
	return p.x >= r.x &&
		p.x <= r.x + r.width &&
		p.y >= r.y &&
		p.y <= r.y + r.height;
}


// figures out a reasonable room for this player to behave like
// they are in. That is, the room that they are in, or,
// if they are not in a room, the room that they are closest to.
GraphicalCharacter.prototype.room = function () {
	return point_to_room(this.graphics);
}

GraphicalCharacter.prototype.arriveMessage = function () {
	if (mode.player.room() == this.room()) {
		// TODO: comment this out if it gets annoying.
		addText(this.message, mode.textZone);
		this.arrive_callback();
		updateChoices(mode.mid);
	}
}

GraphicalCharacter.prototype.keepWalking = function () {
	var dest_room_name = point_to_room(this.destination);
	var start_room_name = this.room();
	if (dest_room_name == start_room_name) {
		var that = this;
		this.tween = new Walk(
			this.graphics,
			this.destination,
			function () {
				that.arriveMessage();
			}
		);
	} else {
		var that = this;
		this.tween = WalkOneRoom(
			this.graphics,
			rooms[start_room_name],
			to(start_room_name, dest_room_name),
			function () {
				that.keepWalking();
			}
		);
	}
	startTween(this.tween);
}

GraphicalCharacter.prototype.walkTo = function (point, message, arrive_callback) {
	if (this.destination) {
		// cancel previous trip
		this.tween.finished = true;
		this.destination = null;
	}
	this.destination = point;
	this.message = message;
  this.arrive_callback = arrive_callback;
	this.keepWalking();
};

GraphicalCharacter.prototype.walkRandom = function (name) {
	if (name == focus_npc) {
		// they walk off
		focus_npc = null;
		updateChoices(mode.mid);
	}
	var roomIndex = Math.floor(this.locations.length* Math.random());
	var roomName = this.locations[roomIndex];
	var room = rooms[roomName];
	var message = "" //name + ' arrives in the ' + roomName + '\n';
	if (roomName == this.room()) {
		// we want them to moving about inside the same room SOME
		// but we don't want arrive messages.
		message = '';
	}
	this.walkTo(
    {
      x: (Math.random() * (room.right - room.x)) + room.x,
      y: (Math.random() * (room.bottom - room.y)) + room.y,
    },
    message,
    doNothing
  );
}


function NPC(
	name,
	req,
	color,
  sprite,
	locations,
	description,
  work,
  techdesc,
  tech,
  container
) {
	if (!container) {
		console.log('container missing');
	}
	this.name = name;
	this.req = req;
	this.color = color;
  this.sprite = sprite;
	this.locations = locations;
	this.description = description;
  this.work = work;
  this.techdesc = techdesc;
  this.tech = tech;
	this.introduced = false;
  this.juice = 0;
	var roomIndex = Math.floor(this.locations.length* Math.random());
	var roomName = this.locations[roomIndex];
	var room = rooms[roomName];
  if (room) {
    this.graphical_character = new GraphicalCharacter(
      (Math.random() * (room.right - room.x)) + room.x,
      (Math.random() * (room.bottom - room.y)) + room.y,
      this.color,
      this.locations,
	  container
    );
    npcs[this.name] = this;
  } else {
    console.log('could not find room: ', roomName);
  }
};

function calculatePlayerJuice() {
  playerJuice = 0;
  for (var char_name in npcs) {
		var c = npcs[char_name];
    playerJuice += c.juice;
  }
  return playerJuice;
};

function near_character(p) {
	for (var char_name in npcs) {
		var c = npcs[char_name];
		//CONSIDER TWEAKING THIS PLAYER SIZE * 3?
		if (Math.hypot(
			c.graphical_character.graphics.x - p.x,
			c.graphical_character.graphics.y - p.y) < PLAYER_SIZE * 3
		) {
			return c;
		}
	}
	return null;
}

function addText(text_to_add, textZone) {
	textZone.text += text_to_add;
	while (true) {
		var textZoneBounds = textZone.getBounds();
		if (textZoneBounds.height < HEIGHT * 2) {
			break;
		}
		textZone.text = textZone.text.replace(/.*\n/, '');
	}
}

function alphaDecay(dt){
  if (alphaNPC > 0.0) {
    alphaNPC -= 0.01;
    if (npcSprite) {
    	npcSprite.alpha = Math.min(alphaNPC, 1.0);
    }
    mode.textNPC.alpha = npcSprite.alpha;
  }
}

function Walk(who, where, arrive_callback) {
	this.who = who;
	this.target_x = where.x;
	this.target_y = where.y;
	this.arrive_callback = arrive_callback;
	this.finished = false;
}

Walk.prototype.animate = function (dt) {
	if (this.finished) {
		console.log('already killed');
		return;
	}
	if (this.who.x == this.target_x && this.who.y == this.target_y) {
		this.arrive_callback();
		this.finished = true;
		return;
	}
	var x_diff = this.target_x - this.who.x;
	var y_diff = this.target_y - this.who.y;
	var distance_to_target = Math.hypot(x_diff, y_diff);
	var distance_this_frame = PLAYER_SPEED * dt;
	if (distance_this_frame >= distance_to_target) {
		this.who.x = this.target_x;
		this.who.y = this.target_y;
		this.arrive_callback();
		this.finished = true;
	} else {
		var f = distance_this_frame / distance_to_target;
		this.who.x += f * x_diff;
		this.who.y += f * y_diff;
	}
}

function WalkOneRoom(who, room, door, arrive_callback) {
	var target = {
		x: door.x,
		y: door.y
	};
	// we nudge the target point a little bit into the next room
	target.x += Math.sign(door.x - room.center.x) * (Math.random() + 3);
	target.y += Math.sign(door.y - room.center.y) * (Math.random() + 3);
	return new Walk(who, target, arrive_callback);
}

var tweens = [];
function startTween(tween) {
	if (tweens.length < MAX_TWEENS) {
		tweens.push(tween);
	} else {
		console.log('cannot start tween, too many tweens');
	}
}

function animate_tweens(dt) {
	var accum = [];
	for (var i = 0; i < tweens.length; i += 1) {
		if (!tweens[i]) {
			console.log('what happen?');
		} else if (!tweens[i].finished) {
			tweens[i].animate(dt);
		} else if (tweens[i].finished) {
			accum.push(i);
		}
	}
	for (var i = accum.length - 1; i >= 0; i -= 1) {
		tweens.splice(accum[i], 1);
	}
}

function scroll(dt, textZone) {
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


renderer.view.addEventListener("click", function (e) {
	var canvas_bounds = renderer.view.getBoundingClientRect();
	var x = e.clientX - canvas_bounds.left;
  var y = e.clientY - canvas_bounds.top;
  mode.click(x, y);
});

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
    mode.animate(dt);
	}
	renderer.render(stage);
	previous_timestamp = timestamp;
	requestAnimationFrame(animate);
}
animate();

// Figures out a reasonable room name for this point.
function point_to_room(point) {
	for (var room_name in rooms) {
		if (point_in_rect(point, rooms[room_name])) {
			return room_name;
		}
	}
	var best_so_far = 'nowhere';
	var best_distance = Number.POSITIVE_INFINITY;
	for (var room_name in rooms) {
		var room = rooms[room_name];
		var distance = Math.hypot(point.x - room.center.x,
			point.y - room.center.y);
		if (distance < best_distance) {
			best_so_far = room_name;
			best_distance = distance;
		}
	}
	return best_so_far;
};

setTimeout(function() {

}, 10);

//---------------SOUNDS-----------------------------
function near_music(p) { //TODO call this somewhere
  //a value between 0 and 1.0 (at 160,168, 1.0)
  var dist_from_source = Math.hypot(160 - p.x, 168 - p.y);
  audMusic.sound.volume = Math.max(0.1, (100 - dist_from_source) / 100);
  if (audMusic.duration > 0 && !audMusic.paused ){
  }else{
    	audMusic.play();
  }
}


function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.volume = 1; //TODO register this correctly per sound
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  this.sound.loop = true;
  document.body.appendChild(this.sound);
  this.play = function(){
      this.sound.play();
  }
  this.stop = function(){
      this.sound.pause();
  }
}

//--------------------------------------------------

function chooseDict(dict) {
	var key;
	var length = 0;
	var random_index;
	var index = 0;

	for (key in dict) {
		length += 1;
	}
	random_index = Math.floor(Math.random() * length);
	for (key in dict) {
		if (random_index == index) {
			return dict[key];
		}
		index += 1;
	}
}


function clearChoices(container) {
	for (var i = 0; i < choices.length; i += 1) {
		container.removeChild(choices[i]);
	}
	choices = [];
	choice_verbs = [];
}

function addChoice(string_to_add, verb, container) {
	if (won){
		return;
	}
	var text_to_add = new PIXI.Text(string_to_add, {
		wordWrap: true,
		wordWrapWidth: TEXT_WIDTH - CHOICES_INDENT,
		fontFamily:  '"Microsoft Sans Serif", Monaco, monospace',
		fontSize: 12,
    fill: 0x211303
	});
	text_to_add.x = WIDTH - TEXT_WIDTH - PADDING + CHOICES_INDENT;
	text_to_add.y = 0;
	container.addChild(text_to_add);
	choices.push(text_to_add);
	choice_verbs.push(verb);
}

function updateChoices(container) {
	clearChoices(container);
	if (focus_npc) {
		for (var i = 0; i < verbs.length; i += 1) {
			verbs[i].print(focus_npc);
		}
	}
}
