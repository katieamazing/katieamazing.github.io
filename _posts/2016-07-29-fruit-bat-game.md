---
layout: post
title: An Fruit Bat Game in LOVE2d
date: 2016-07-29
---

Like the rest of the world, I have been getting excited about procedural generation. I thought it might be fun to make a simple Pac-Man-like game to feature an infinitely generated maze. I chose to work in Lua within the LOVE2d framework to keep pushing myself to learn new languages - and I'm finding that the more GUI output I do in different languages, the easier I find it to identify and exploit the commonalities.

The Maze Part

My first step was to do a bit of research into procedurally generating a very simple maze. Wikipedia led me to depth-first seach as a good starting point for my first maze-making/pathfinding algorithm. Unfortunately, the Rosetta Code example available for Lua was really unwieldy - it had four required scripts, the output wasn't exactly what I wanted, and it used a stack method to draw the maze, which seemed really complicated. The Python script, on the other hand, was MUCH more readable and comfortable for me. I worked with another programmer to port that simple script over to Lua, and got something closely resembling the Python output. So here's my starting point, generated from Lua in about 70 LOC:

--some pic--

Next step was to convert this console text output into something graphical. Rather than fuss with skinny walls/fat walls/corners, I opted to have every character in the text represented by either a 32x32 square or a 32x32 void. The maze generation now makes a table of width rows by height columns containing all "true" values. The pathfinding algorithm then goes through using dfs and punches a trail of "false" values according to its rules. Finally, I added an "add falses" function, which randomly chose some "true" values from the resulting table and punched them out to "false", creating more geometric interest and gave the player more choice in exploring the maze.

--yellow maze--

The Art Part

As a personal challenge to myself, I did not do any drawn artwork or spriting for this project. I often find that I use my art as a crutch in game making to cover for lazy programming or a less-than-solid command of my programming tools. I knew I wanted to create a character with some prizes to pick up in the maze, and I thought that making some fruit using LOVE2d's draw functions would be fun. And what needs fruit except a fruit bat?
I made three kinds of berries from the same code, which involved implementing a class system in Lua. The code randomizes the qualities of 16 "pips", or the little circles the berries are made of. The jitter allows for slight deviations of each pip's size, location, and color, and I really like the effect:
--berries--
I made a blueberry from circles and polygons, and set the primitives to be a stencil. I then drew a square using a gradient library that got masked through the shape I defined with the stencil:
--blueberry--
