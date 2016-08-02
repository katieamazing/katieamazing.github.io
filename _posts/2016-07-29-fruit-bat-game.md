---
layout: post
title: A Fruit Bat Game made with Love
date: 2016-07-29
---

Like the rest of the world, I have been getting excited about procedural generation. I thought it might be fun to make a simple Pac-Man-like game to feature an infinitely generated maze. I chose to work in Lua within the LOVE2d framework to keep pushing myself to learn new languages - and I'm finding that the more GUI output I do in different languages, the easier I find it to identify and exploit the commonalities.

The Maze Part

My first step was to do a bit of research into procedurally generating a very simple maze. Wikipedia led me to depth-first seach as a good starting point for my first maze-making/pathfinding algorithm. Unfortunately, the Rosetta Code example available for Lua was really unwieldy - it had four required scripts, the output wasn't exactly what I wanted, and it used a stack method to draw the maze, which seemed really complicated. The Python script, on the other hand, was MUCH more readable and comfortable for me. I worked with another programmer to port that simple script over to Lua, and got something closely resembling the Python output. So here's my starting point, generated from Lua in about 70 LOC:

![Starting Point - a console text output maze](/img/starting_maze_output.jpg) 

Next step was to convert this console text output into something graphical. Rather than fuss with skinny walls/fat walls/corners, I opted to have every character in the text represented by either a 32x32 square or a 32x32 void. The maze generation now makes a table of width rows by height columns containing all "true" values. The pathfinding algorithm then goes through using dfs and punches a trail of "false" values according to its rules. Finally, I added an "add falses" function, which randomly chose some "true" values from the resulting table and punched them out to "false", creating more geometric interest and gave the player more choice in exploring the maze.

![Graphical maze output](/img/yellow_graphical_maze_output.jpg) 

The Art Part

As a personal challenge to myself, I did not do any drawn artwork or spriting for this project. I often find that I use my art as a crutch in game making to cover for lazy programming or a less-than-solid command of my programming tools. I knew I wanted to create a character with some prizes to pick up in the maze, and I thought that making some fruit using LOVE2d's draw functions would be fun. And what needs fruit except a fruit bat?

![Procedural berries](/img/berries.jpg)   I made three kinds of berries from the same code, which involved implementing a class system in Lua. The code randomizes the qualities of 16 "pips", or the little circles the berries are made of. The jitter allows for slight deviations of each pip's size, location, and color, and I really like the effect.

![Blueberry](/img/blueberry.jpg)    I made a blueberry from circles and polygons, and set the primitives to be a stencil. I then drew a square using a gradient library that got masked through the shape I defined with the stencil.

![Magical Colorshifting Apple](/img/magic_apple.gif)   To add something really special and rare, I added an apple made of primitives and used a fun color shift shader.

![Batty](/img/batty.jpg)    And finally, I made an adorable little bat to walk around the maze. His only animation is the highlights on his eyes, which shift around depending on what direction he's moving.

One of the neatest things to me about this art is that because it is being drawn in real time by the program using math, it would be easy to scale this and have it still look nice and crisp at 2x or even 10x the size.

The Moving and Collision Part

This was without a doubt the most painful part of this project for me. I initially had a sliding movement that just added or subtracted to the player's coordinates depending on the button pressed. This worked alright, but had an annoying quality around the edges or openings of the maze. The collision detection was making it annoying to line the batty up accurately so that you could slip through an opening. I tried many things to address this irritating quality:
- Making the movement steps larger/allowing one step per keypress: Increasing the movement from two pixels per key handler to 32 pixels per key handler solved the issue by forcing the player to always be snapped to the grid, but made movement way too fast. Locking the keypress and only allowing another keypress after the key was released solved the velocity issue, but made gameplay carpal-tunnel-inducing and not very fun.
- Tweaking Collision Tests: Many tweaking and tinkering operations didn't seem to address the problem sufficiently either. Most of what I tried allowed the batty character to overlap with the maze, which was not the aesthetic look I wanted.
- Moving on Rails: Force-snapping the batty to the grid seemed like a decent option, but implementing it was very challenging. I gave up on trying this after realizing that even if the batty snapped to the grid on every keyup event, the player would still have the same issues if they held keys down while sliding around the map (as I was doing while playtesting). I thought the feel might be really rigid and unfun with this solution, as well as being unsure how to implement it.
- If Collide, then Slide: When a collision occurs, slide the player in an appropriate-based-on-last-movement direction. So, you can't move to the left anymore, but you'll instead slide up or down until you can move left. This seemed confusing to me, and imprecise as far as how I imagine it might feel.
- Circle-Rect collision: Instead of checking collision against sharp corners, check collision between the center point of the batty and set of circles which pad the sharp edges of the maze blocks with curves. This seemed like a good way to let the player slide smoothly around the corners, but I was hesitant to implement something that was this many LOC. In retrospect, my eventual solution was more verbose than this option, and my concerns about running another for loop to iterate over each maze block and draw circles and test for collision likely wouldn not have been an issue.

My actual solution ended up being a step of 32 pixels (taking part of my first attempted solution), and adding a tweening library to smooth the movement and address to "too fast" issue. Getting the tweening library working was agonizing - I found a promising library on the LOVE2d forums, but the most recent version from GitHub ended up not working for me (not sure why, possibly a version issue or a critical bug). I eventually got it working when I unzipped an older demo .love and found a different version of the tween.lua library. After that headache came the getting the tweening to work correctly with the batty, keypresses, and collision. The upshot is that after all that, I had a tweening library ready to go for the next step of my project.

Infinite Levels, Infinite Score



