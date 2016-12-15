---
layout: post
title: "Neural Net Style Transfer Game Art"
date: 2016-12-15
---

Though I've done some [fancy handpainted digital art](http://ludumdare.com/compo/wp-content/compo2//511439/34276-shot0-1450136954.jpg-eq-900-500.jpg) for previous Ludum Dare game jams, the 72 hour time limit frequently pushes me to [simplify my vision](http://ludumdare.com/compo/wp-content/compo2/570486/34276-shot0-1472521617.png). Sometimes that means losing out on an aesthetic that I think is important to the game's cuteness and indie appeal. For LD37, the "one room" theme had us going with a simple match-three game design with a couple tweaks, and I thought a watercolor theme would jazz up a pretty overdone type of game. A watercolor style also tied into our play on the KonMari method, as our game got a pun name early in the process - KonMatch3. 

In any case, consider this a loose walkthrough on how I achieved an artistic style for game art in substantially less time than by handcreating it using a neural network set up as an art style transfer tool.

I started out drawing up some rudimentary sprites. This was a single brush tool at a medium opacity with tablet input. Just roughing out color, silhouette, and giving a few gradations/shading/opacity edges for the neural net to work with. This process was super fast at just a few minutes a sprite. I went ahead and did these on a white background, as I knew fussing with transparency on a png might create a headache for me with the style transfer process, and I was alright with having white tiles.

![my original sprites, hand drawn](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/LD37/my_sprites.png)

Next, I used some stock art that I had to mimic the spritesheet layout above. I wanted to process the whole sheet in one go, sacrificing possible quality and improved style interpretation for speed. So I wanted the style image to match the white space of the content image I had just made. Here's what that looked like:

![stock art "spritesheet" for style transfer](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/LD37/stock_sprites.png)

Next, I restarted my computer in linux mode, and got my locally running neural network ([covered in more detail here](http://katieamazing.com/blog/2016/06/25/a-neural-network-art-forger-of-my-very-own)) transferring the stock art style to my sprites. Here's what I came up with:

![generated watercolor texture applied to my sprites](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/LD37/web2.jpg)

I was pretty happy with this, but ended up using the [deepart.io](http://deepart.io) style transfer bot for all other style transfers in this project. The way my computer has a dual boot for linux rather than a virtual machine means that the local neural net was too slow a process, and though the deepart.io version sometimes has a wait, it was easier without having to restart my computer every time I needed Photoshop on my Windows install versus the neural net on my Linux install.

To clean up the edges of my newly watercolorified sprites, I used the selection tool on the original spritesheet to get a selection area, and then eliminated stray marks on the watercolor layer. I also set the watercolor version to a medium opacity on top of the old sprites, to take the best of both. So, I got pretty readable shapes, moderately true colors, and the watercolor texture I really wanted but didn't have time to hand paint.

![generated watercolor texture applied to my sprites](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/LD37/finalish_sprites.png)

I used the same process to generate the background and the text effect sprites (hand drawn, network generated, final version):

![text sprites, original hand drawn, network generated, final](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/LD37/text_sprites.jpg)

I do really love the way this online network handles the watercolor style transfer. I'm hoping to use it again in a project where I can embrace more of the ragged edges and painterly interpretation!

And just to show off how everything looks together in the end:

![gameplay screenshot](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/games/LD37/screenshots.jpg)

The game itself is here, in case you'd like to see the sprites in action and play!

If you have LÖVE 0.10.1, click [HERE](https://github.com/katieamazing/katieamazing.github.io/raw/master/games/LD37/KonMatch3.love) to download.

If you don’t have LÖVE, click [HERE](https://github.com/katieamazing/katieamazing.github.io/raw/master/games/LD37/KonMatch3.zip) to download a .zip file with the game.exe inside.
