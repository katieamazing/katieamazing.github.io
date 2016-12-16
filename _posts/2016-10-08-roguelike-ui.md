---
layout: post
title: "Roguelike UI Demo"
date: 2016-10-08
---

I've been working on a [Shadowrun](https://en.wikipedia.org/wiki/Shadowrun)-inspired roguelike game, and I'm ready to show off the UI part of it. I've been reading up on the history of roguelikes (Dungeon Hacks, by David Craddock), and was further inspired by the look of the game [Cogmind](http://www.gridsagegames.com/cogmind/) and its accompanying art program, [REXPaint](http://www.gridsagegames.com/rexpaint/index.html). I thought I might continue using Love2d to do a fancy UI with the same look as Cogmind, but without actually using REXPaint. Plus, I was excited to try some more lua networking and see if I could implement some networked multiplayer stuff. 

![Game entry screen](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/Multiplayer-Mini-RL/entry.gif)

As this project grew, I used it as a way to dig into object orientation. This project pushed me to use objects in bigger, better ways. As I worked on this, I was reading The Pragmatic Programmer by Andrew Hunt and David Thomas, and was inspired by the idea of orthogonality to be brave and do a lot of refactoring and generalizing the code in this project. The result is a UI where every window is draggable, droppable, and minimizeable. 

![Gameplay gif](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/Multiplayer-Mini-RL/windows.gif)

The networking is functional at this point. I used the same technology I used for the high scores table in the [Fruit Bat game](http://katieamazing.com/blog/2016/07/29/fruit-bat-game) from a few months ago, and it is working. You can chat to other online players in the chat screen, you can see @player avatars moving around, and an inactivity disconnect is working.

![Gameplay image](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/Multiplayer-Mini-RL/873.gif)

The combat system is working, and uses a snap-to-grid functionality for the stat allocation that's straight out of Shadowrun. Just as a decker has a computer called a deck in Shadowrun, you can use your deck to find targets (the "Sniff" UI pane) and hack them, and there is a UI pane specifically for your deck information. I also have a very preliminary inventory UI working with tiling thumbnails and a 1-up detail view of a selected item in the "Stuff" UI pane.


A longer gameplay gif is available [HERE.](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/Multiplayer-Mini-RL/gameplay.gif)



I have two main things remaining on this project, one small and one large.

The small(er) item is to convert all the networking code that currently uses lua socket, a JSON parser, and webscript.io to hold the server-side data into something faster and more suitable for the kind of multiplayer networking I'd like to see. The current code is functional, but slow. The update creates a little bump in frames, and I'd like to try something else to get it seamless. Cameron McHenry has a neat-looking library called [sock.lua](https://github.com/camchenry/sock.lua) that is made for love2d specifically, and that looks really promising.

The larger item is to add actual gameplay. There's a lot to add to monsters, inventory items, etc. that I can see being fun for this project. My motivation on this is low right now, and I think building on it in the way I'm talking about would make a neat game, but I've learned what I can from this - a UI, a chat system, and lots of OOP seem like good enough results for now. I'm thinking of putting it on the back burner and breaking it back out for 7 Day Roguelike Challenge in March of next year. Building in a little crunch and the motivation of a jam will be good to get some gameplay added.

 
