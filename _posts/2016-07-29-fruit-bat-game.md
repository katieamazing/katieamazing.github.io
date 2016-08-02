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

![Procedural berries](/img/berries.jpg) | I made three kinds of berries from the same code, which involved implementing a class system in Lua. The code randomizes the qualities of 16 "pips", or the little circles the berries are made of. The jitter allows for slight deviations of each pip's size, location, and color, and I really like the effect.



I made a blueberry from circles and polygons, and set the primitives to be a stencil. I then drew a square using a gradient library that got masked through the shape I defined with the stencil:

![Blueberry](/img/blueberry.jpg)

To add something really special and rare, I added an apple made of primitives and used a fun color shift shader:

![Magical Colorshifting Apple](/img/magic_apple.gif)

And finally, I made an adorable little bat to walk around the maze. His only animation is the highlights on his eyes, which shift around depending on what direction he's moving:

![Batty](/img/batty.jpg)

One of the neatest things to me about this art is that because it is being drawn in real time by the program using math, it would be easy to scale this and have it still look nice and crisp at 2x or even 10x the size.

The Moving and Collision Part

This was without a doubt the most painful part of this project for me. I initially had a sliding movement that just added or subtracted to the player's coordinates depending on the button pressed. This worked alright, but had an annoying quality around the edges or openings of the maze. The collision detection was making it annoying to line the batty up accurately so that you could slip through an opening. I tried many things to address this irritating quality:
+ Making the movement steps larger/allowing one step per keypress: Increasing the movement from two pixels per key handler to 32 pixels per key handler solved the issue by forcing the player to always be snapped to the grid, but made movement way too fast. Locking the keypress and only allowing another keypress after the key was released solved the velocity issue, but made gameplay carpal-tunnel-inducing and not very fun.
+ Tweaking where the collision was being tested: Many tweaking and tinkering operations didn't seem to address the problem sufficiently either. Most of what I tried allowed the batty character to overlap with the maze, which was not the aesthetic look I wanted.
+ Moving on rails: Force-snapping the batty to the grid seemed like a decent option, but implementing it was very challenging. I gave up on trying this after realizing that even if the batty snapped to the grid on every keyup event, the player would still have the same issues if they held keys down while sliding around the map (as I was doing while playtesting). I thought the feel might be really rigid and unfun with this solution, as well as being unsure how to implement it.
+ Circle-Rect collision:

My actual solution
