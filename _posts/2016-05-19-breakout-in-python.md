---
layout: post
title: "Breakout in Python"
date: 2016-05-19
---

![Bubble Bricks](https://raw.githubusercontent.com/katieamazing/breakout/master/writeup/bb_1467260308.55.jpg)

I made a little game in Python! I have gone through the Coursera course offered by Rice University called "Introduction to Interactive Programming in Python" at least twice now, so this time through I was pretty bored. Instead of dutifully completing the "Pong" assignment, I decided to make Breakout instead.

Using games to learn programming concepts has been working for me. Since I intend to continue making small, "game-jam" style interactive programs, I'll introduce a plus/delta system here. A plus (+) would be something that went well on a project. A delta (Δ) is a nicer way of labeling something that did not go well, and could be improved on in the future. I'll try to think-out-loud and consider some options for addressing my deltas in my post-mortum blog posts.

**Δ Not Interesting:** It's a little cute, but it is not an interesting or innovative game. That might be a bit of a theme for me, as I lack a lot of game design know-how, but I will strive to be more original.

**Δ Lazy Blogging:** I am finishing this write-up weeks after completing the game, and I feel like I've forgotten a lot of what was really challenging for me when I made it. For example, I remember having some very frustrated moments over some of the larger moving parts of this little program (implementing a Class for the first time as part of the particle system, getting the list of lists for the bricks working), but time has dissipated what exactly made them so hard and how I overcame the issue. It's uncomfortable to be transparent about how hard some things are for me, but I need to do better at documenting closer to completion so I can share that, rather than postponing the write-up so long that all I talk about are things I'm pleased with.

![Bubble Bricks Sprites](https://raw.githubusercontent.com/katieamazing/breakout/master/writeup/breakout_sprites.png)

**+ Motivation Hacking:** I discovered a useful hack for motivation along the way, which is something that I have struggled with since my move to NYC. I made art! And interspersing making art with the more cerebral project of coding made me feel less frustrated. And having pretty assets that I was excited to use and see working really got me inspired to finish this project. I also did pretty well at setting small incremental goals that were fairly easy to accomplish. With just a few minutes a day to reach a tiny goal (like drawing a ball, or drawing one brick), I never felt chained to a bunch of broken code or frustrated by a lack of progress. 

**+ Math Brush-up:** Implementing some very basic math concepts in this game helped me connect the remnants of my math education with game design. Using the pythagorean theorem and using coordinates to draw on a plane are building blocks that it was great to see working so usefully in my game.

**+ Juicy Inspiration:** This was also a first try at getting my game a little "juicy," as discussed in this outstanding talk [here](https://www.youtube.com/watch?v=Fy0aCDmgnxg) and in [this repo](https://github.com/grapefrukt/juicy-breakout) on GitHub. This also added to the fun, and though I have a lot more ideas for cute thematic juices for this, I think it's time to wrap it up. I have liked the training wheels of CodeSkulptor, but I'm concerned I've become a little dependent. I am going to try and make some interactive stuff with other engines and languages for awhile, lest I go full Pythonic!



Anyway, here's a gameplay gif which I apologize for the size of:

[Bubble Bricks Gameplay](https://github.com/katieamazing/breakout/blob/master/writeup/gameplay.gif)

And here's the link to read the code and play it if you would like: [http://www.codeskulptor.org/#user41_6ihwWziNcT_58.py](http://www.codeskulptor.org/#user41_6ihwWziNcT_58.py)
