---
layout: post
title: "A Retrospective Rewrite of Breakout in Python"
date: 2017-07-27
---

Over a year ago, I wrote a version of [Breakout in Python/CodeSkulptor](http://katieamazing.com/blog/2016/05/19/breakout-in-python). Since then, I've made versions of Breakout in different languages, and I thought it was time to revisit my old Python project.

Gee, that code is ugly.

![cringe](https://media.giphy.com/media/d40ImzxOmRC0M/giphy.gif)

It's time to rewrite this project, and show off how much I've grown in a year+ of programming. I spent some time experimenting with Python game frameworks, hoping to move my Python Breakout to a less-student-y game engine. I found PySDL2 really frustrating (SDL-related headaches are [becoming a theme around here](http://katieamazing.com/blog/2017/07/03/C%C3%A9u-Game)), so I rewrote the game in Pygame. Pygame was originally developed to replace PySDL(1), so I didn't get that far away from SDL, but enough to make it an easier framework to deal with.

So how's my game look, a year later?

In my original game, I made heavy use of global variables. Over 30 of them! It felt natural to do so as a newbie Pythonista, and my code is littered with imports from global space into my functions. Breakout 2.0 refactors everything into objects, so the global space is less crowded. You can see that I did use object orientation lightly early on, to handle the bubble particle effects. My improvement was to add a wrapping class, which functions as a container for individual particles. This divides the logic up between the wrapping class, which maintains a correct particle list and delegates control flow to each particle, and the particle class, which handles particle-level details like location, movement, and size of that particular particle.

So I went from this tangle:

{% highlight python %}
particles = []                    # A global container
class Particle:
    def __init__(self, x, y):
        self.pos_x = x
        self.pos_y = y
        self.vel_y = random.randint(1, 4)*-1
        self.vel_x = random.randint(-3,3)+.5
        self.scale = random.randint(7,15)
        self.alive = True
    def update(self):
        if self.vel_x < 0:
            self.vel_x += 0.1
        elif self.vel_x > 0:
            self.vel_x -= 0.1
        if self.vel_y > 1:
            self.vel_y -= 0.1
        self.pos_x += self.vel_x
        self.pos_y += self.vel_y
        if self.pos_y > HEIGHT +2 or self.pos_y < -1 or self.pos_x < -1 or self.pos_x > WIDTH +2:
            self.alive = False
    def draw(self, canvas):
        canvas.draw_image(img_bubble, (7,7), (15,15),(self.pos_x, self.pos_y), (self.scale, self.scale))

def make_particles(x, y):
    numparticles = random.randint(1,5)
    for things in range (0, numparticles):
        particles.append(Particle(x + 25, y + 13))

def draw(canvas):
  for particle in particles:
      particle.update()
      particle.draw(canvas)
  for i in range(len(particles)-1, 0, -1):
      particle = particles[i]
      if particle.alive == False:
          particles.pop(i)    # Kill offscreen particles as a small optimization
{% endhighlight %}

To this:

{% highlight python %}
class Particles(object):
    def __init__(self):
        self.particles = []

    def create(self, x, y):
        for bubble in range(0, random.randint(1, 5)):
            self.particles.append(Particle(x + 25, y + 13))

    def update(self):
        live_particles = []
        for bubble in self.particles:
            if bubble.alive:
                live_particles.append(bubble)
                bubble.update()
        self.particles = live_particles

    def draw(self):
        for bubble in self.particles:
            bubble.draw()


class Particle(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y
        self.velx = (random.randint(-3, 3) + 0.5) / 2
        self.vely = (random.randint(1, 4) * -1) / 5
        self.scale = random.randint(7, 15)
        self.sprite = pygame.image.load("bubble15.png")
        self.alive = True

    def update(self):
        if self.velx < 0:
            self.velx += 0.1
        elif self.velx > 0:
            self.velx -= 0.1

        if self.vely > 1:
            self.vely -= 0.1

        self.x += self.velx
        self.y += self.vely

        if self.y < - 1 or self.x < -1 or self.x > width + 2:
            self.alive = False

    def draw(self):
        screen.blit(self.sprite, pygame.Rect(self.x, self.y, self.scale, self.scale))
{% endhighlight %}

We'll see how Breakout 2.0's bubbles get control flow to be drawn in a moment. I remember being so proud of 1.0's Particle class; it was one of the first times I had used a class in Python, and getting particles working was satisfying. I'm even prouder of how much my use of classes has improved in the last year.

One of the things I've gotten out of studying programming with experienced practitioners of the craft is a reluctance toward using inheritance. I am still prone to thinking in a UML-pattern that pushes my conception of objects as parents and children, but I have tried to resist the siren song (and the much-warned-of pitfalls) of inheritance. Breakout 2.0 uses polymorphism as a strategy to connect objects while avoiding classical inheritance.

As we can see with the above code snippet of the Partical class, every drawable has a ```draw()``` and an ```update()``` method. Wrapping classes delegate down to individual objects (the particles and the bricks use the same strategy of a wrapping class around individual elements). The "hinge" of my polymorphism is an object that carries references to all the other objects, wiring them together. That way, the hinge object can iterate through every component it knows about, calling each component's draw and update calls in turn.

{% highlight python %}
class Level(object):
    def __init__(self, rows, cols, bricksprite):
        self.rows = rows
        self.cols = cols
        self.bricksprite = bricksprite
        self.components = []

    def add(self, component):
        self.components.append(component)

    def update(self):
        for component in self.components:
            component.update()

    def draw(self):
        for component in self.components:
            component.draw()

    def play(self):
        ball = Ball(width/2, height-6)
        collision_handler = Collision(ball)
        bubbles = Particles()
        bricks = Bricks(self.rows, self.cols, self.bricksprite, collision_handler, bubbles)
        paddle = Paddle(width/2, 0)
        collision_handler.add(paddle)

        self.add(collision_handler)
        self.add(bricks)
        self.add(paddle)
        self.add(ball)
        self.add(bubbles)

        while not bricks.done():
            # ...
            screen.blit(bg, (0,0))
            self.update()
            self.draw()
            pygame.display.flip()
{% endhighlight %}

The ```Level``` object also includes another bit of wiring to show off, which is the collision handler. This is an object which carries references to everything that might collide during the gameplay. As you can see, that is the ball, the paddle, and the bricks (the brick constructor handles adding each brick individually to the referenced collision handler). The collision handler prevents the ickiness of one object reaching out into another object's data to check if they are colliding; the collision handler has the minimum amount of information required to determine a collision, delegates control flow to the concerned objects in the event of a collision, and also gets called on every loop as a component itself of the ```Level``` object.

Speaking of the ickiness of [inappropriate intimacy](http://wiki.c2.com/?InappropriateIntimacy), one line in my new code really bothered me when I wrote it:

{% highlight python %}
class Brick(object):
    def __init__(self, x, y, sprite, collision_handler, bubbles):
        # ...
        self.bubbles = bubbles

    def on_collide(self):
        self.bubbles.create(self.x, self.y) # TODO feels weird
        # ...
{% endhighlight %}

The collision handler I described above delegates control flow to objects that have collided by calling the objects' ```on_collide()``` methods (another small example of fanning). When a brick is collided, some brick stuff changes, and some bubble particles burst into existence. Having bricks know enough about enough to call the particle constructor feels really weird! For awhile during development, the ```bubbles``` object was global, so this ```Brick on_collide()``` method was reaching into *global space*! Argh. I went down a long and windy path of overengineering and implemented a publishing/subscription design, which is another wiring method where objects who will have messages (*"I've been hit!"*) can publish those messages to subscribed functions (*"I, a bubble constructor, would like to know about bricks which have been hit,"*). But it seemed like outrageous overkill for this small game. I eventually moved the bubbles wrapping class out of global space, and ended up passing the bubbles object into Brick as a constructor argument, which seems like a decent compromise.

There are a couple other improvements that I can appreciate: my Python style is much better [#hobgoblin](https://www.python.org/dev/peps/pep-0008/#a-foolish-consistency-is-the-hobgoblin-of-little-minds), I have integrated the Pygame loop into my functions better, and overall I think this shows off my growth in using objects and designing a simple game.

My first stab at this game in 2016 was highly practical. The heavy use of global variables made it fast to develop, but the largely monolithic design made it tough to update and it felt very fragile to work with. The new version swings way over to the other side, and is overengineered for such a small program - the LOC has grown, despite my omission of sounds and scoring in 2.0! But the code is much more extensible and the objects feel comfortable and natural to work with. You can find the full source code to Breakout 2.0 [here](https://github.com/katieamazing/breakout/blob/master/Snake-Flavored-pygame.py).

*BONUS ROUND:* check out the same project I've written in [Lua](https://github.com/katieamazing/breakout/blob/master/Moon-Flavored.lua) and [Elm](https://github.com/katieamazing/breakout/blob/master/Tree-Flavored.elm).
