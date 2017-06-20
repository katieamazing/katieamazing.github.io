---
layout: post
title: "I Coded in Python for a Year Without Knowing These Ten Things"
date: 2017-05-13
---

Forgive me for my clickbait title.

It's been a little over a year since I first started learning Python! In the last few months, I have deepened my knowledge of the language considerably, and I've discovered some startling gaps. This is the blog post I wish I had read earlier in my Python education, and I hope you find it useful (or maybe just amusing? :flushed:)

<body>
<hr>
</body>

**1. ```in```**

Now, I was familiar with ```in``` from ```for``` loops! But using ```in``` alone as a test for membership had not occurred to me in my first year of Python programming. If we have a collection (like a list or a string) and we'd like to see if that collection contains a value or not, we can use:

{% highlight python %}
classes = ['English', 'Math', 'Science']
if 'Math' in classes:
    print('Yay, Math!')
if 'History' not in classes:
    print('Doomed to repeat our mistakes.')
{% endhighlight %}


**2. sets**

Somewhat related to ```in```, we have sets. I had done many practice problems that could have gone better with the [set](https://docs.python.org/3/library/stdtypes.html#set) structure before I learned about it. Sets are non-sequence data structures that contain unordered unique values. They are also super fast at checking for membership. I'll come back to that in a moment after we take a look at a simple set example:

{% highlight python %}
greet = "hello world"
set_of_chars = set()
for char in greet:
    set_of_chars.add(char)
print('There are ' + str(len(set_of_chars)) + ' unique characters in ' + greet)
{% endhighlight %}

We can make a set by calling ```set()```, which can take one iterable argument (see below), or by directly listing values in what looks like a list, but with curly braces: ```my_set = {2, 4, 5, 8}```

So, why are sets faster at checking for membership than the strategy we used above with the list of course subjects? Because under the hood, a set is a dictionary, which means it is really a hash table. And hash tables are fast. But if you're thinking that all that heavyweight stuff under the hood of sets makes them bigger than lists, you'd be right. Sets trade space in memory for fast membership tests (*O*(1)). Lists are smaller space-wise, but are more like *O*(n) to look through each element and test for membership.

Another flavor of set that Python supports as a built-in data structure is a ```frozenset()```. This is the same kind of thing as a set, but it is immutable. We might find this useful if we are using constants that can be structured in a set, or if we would like to use a set as a dictionary key.

One other cool thing is that we can spread iterable objects directly into a set. So:

{% highlight python %}
string = 'buttercup'
buttercup_set = set(string)
{% endhighlight %}

Evaluates to a set like this: {% highlight python %}buttercup_set = {'b', 'u', 't', 'e', 'r', 'c', 'p'}{% endhighlight %}

*Bonus:* Python somewhat obfuscates another set-related data structure, which is more generally referred to as [a bag or multiset](https://en.wikipedia.org/wiki/Multiset) in Computer Science. Python has these stuffed down in the collections module under the name [```Counter```](https://docs.python.org/3/library/collections.html#collections.Counter). If you're looking for this data structure, it already exists in the language! No need to implement your own bag data structure unless that sounds fun.


**3. ```enumerate()```**

Oftentimes, we want to loop through a list and have the item along with its index both available in the body of the loop. We can use [```enumerate(iterable)```](https://docs.python.org/3/library/functions.html#enumerate) to accomplish this:

{% highlight python %}
fruits = ['apple', 'orange', 'banoonoo']
for index, fruit in enumerate(fruits):
    print(index, fruit)
{% endhighlight %}

Under the hood, ```enumerate()``` returns a tuple for each iteration containing the index integer and the item data, which is then unpacked into the index and item variables for use in the loop body.

One neat thing is that ```enumerate()``` will take iterable objects, such as [sequences](https://docs.python.org/3.1/library/stdtypes.html#typesseq) (like strings, lists, tuples, and ranges) and [iterators](https://docs.python.org/3/tutorial/classes.html#iterators) (streams of data).

I never knew how much I needed an operation like ```enumerate()``` until I studied Lua. In Lua, key-value unpacking of tables (THE Lua data structure) is just a given! It was only when I came back to Python after a few months off that I realized I was looking for this operation.

*Bonus:* You might be wondering how ```enumerate()``` works on dictionaries, which might not guarantee positional data order the way sequences do. In Python 3, we can unpack key and value with:

{% highlight python %}
veggies = {2: 'carrot', 1: 'onion', 5: 'broccoli'}
for number, veggie in veggies.items():
    print(number, veggie)
{% endhighlight %}

Note that we still can't guarantee the order that the dictionary is looped over, but this syntax will give us both sides of each dict entry.


**4. ```.join()``` instead of ```+```**

I had seen [```str.join()```](https://docs.python.org/3/library/stdtypes.html#str.join) in some Stack Overflow answers, but I didn't realize it was the recommended method for string concatenation until much more recently. I had been using the ```+``` operator all this time! ```str.join()``` gives us two opportunities to modify the output: we can specify a character that will be inserted in between each item joined by the operation (for instance, spaces, hyphens, or other punctuation that you might want between items), and also the items to be joined. We can use join to unite string fragments into one string, or to join string elements of an iterable into one string:

{% highlight python %}
letters = ('h', 'e', 'l', 'l', 'o')
greeting = ''.join(letters)
dash = '-'
print(dash.join([greeting, 'world']))
{% endhighlight %}

This produces ```>> hello-world```. First we ```join``` the characters in the "letters" tuple without spaces (''). Then we do another ```join``` using a list containing a string and our previously joined string, using dash as a separator.

The ```str.join()``` operation is preferable to the ```+``` operator for string concatenation because a string is immutable. That means every time we add something to a string with +, Python builds a new string. This can get super inefficient if we do it a lot, like when accumulating string output from a loop. It's better to use another strategy to accumulate (like ```list.append()```), and then use ```join``` at the end to stick it all together as a string outside the loop.

The ```str.join()``` operation is useful. It has been hard to retrain myself to use it for simple operations where I am tempted to use ```+```, but I find I am more likely to use ```join()``` correctly as I get more familiar with it.


**5. list comprehensions**

For some reason, I really struggled to get my mind around [list comprehensions](https://docs.python.org/3/tutorial/datastructures.html?highlight=comprehension#list-comprehensions). Blame bad tutorials, blame being tutored by a C++ programmer, blame a self-diagnosed allergy to comprehension syntax. But more than a year after beginning to study Python, I finally have this one in my toolkit, and what a powerful addition it is!

Here's the usual example, mapping sections of the logic to their location in a standard loop versus a list comprehension:

{% highlight python %}
# A normal accumulator pattern
accumulator = []
for item in list:
    if conditional:
        accumulator.append(item)

# List comprehension
accumulator = [item for item in list if conditional]
{% endhighlight %}

I've shown an accumulator pattern here, because that was the most useful for me. But list comprehensions do all kinds of cool things, like math, nested loops, and nested comprehensions (comprehensions *in* comprehensions: \*inception horn\*). But the biggest thing for me was learning that it is okay to sometimes *not* use list comprehensions. Sometimes they won't work as elegantly as you might want, and sometimes it's best to leave the old style for better readability.

*Bonus:* List comprehensions come in two more flavors. You can use the same syntax with sets and dictionaries. Comprehend all the things!


**6. ```for ... else```**

What!? Did you know ```for``` loops can have elses? This blew my mind when I found out. Basically, if we go around all the loops of a ```for``` loop without a ```break``` or ```return``` statement, the code in the else clause is executed. That also means the ```else``` clause runs if the loop is executed zero times. This is useful when using a ```for``` loop to check for some condition — it is useful to prove the value, but it is also useful to get some control flow when the condition was not true for any loop, and therefore false.

{% highlight python %}
for c in "abc123":
    if c.isupper():
      break
else:
    return False
{% endhighlight %}

Nice!


**7. ```iter()```**

Python gets some of its power from iterable objects, and we iterate through strings by character and lists by item all the time. But I didn't know that you could explicitly use the built-in function ```iter()``` to take an iterable object and return an iterator. So what's an iterator, and why would we want to do that?

We might want to send an iterator to a function as an argument, and delay the processing of that iterator until we're inside the function. Like:

{% highlight python %}
def foo(iterable):
    return iter(iterable)

def bar(iterator):
    return list(iterator)

print(bar(foo("hello world")))
>>['h', 'e', 'l', 'l', 'o', ' ', 'w', 'o', 'r', 'l', 'd']
{% endhighlight %}

This assigns the string ```"hello world"``` to an iterable, but we don't unpack it until we're inside the bar function, unpacking the iterable into a list. We'll see this again in ```zip()```, but it's a nice way of passing around an iterable chunk of data without having it processed by each function.

Another thing ```iter()``` is useful for is custom behavior. We might want to write a custom class that can be looped through. We can do this in a Pythonic way by mimicking what Python does — implement an ```__iter__``` method, and the ```__next__``` method that supports incrementation and concludes the iteration appropriately.

The ```iter()``` function is pretty simple, but our next two examples depend on it.


**8. ```zip()```**

The [```zip()```](https://docs.python.org/3/library/functions.html#zip) function returns an iterator that loops over tuples built from two other iterable objects. Whoah, that's a lot of Python-y buzzwords. Basically, you can construct a new object which combines data from two other objects. For me personally, this has been most understandable and usable when I want to take two lists and make them into a dictionary:

{% highlight python %}
numbers = [1, 2, 3, 4]
cookies = ['samoa', 'trefoil', 'thin mint', 'tagalong']
print(zip(numbers, cookies))
{% endhighlight %}

Now, this will result in the totally useless-looking output
{% highlight python %}
>> <zip object at 0x01FB7609>
{% endhighlight %}
or something. That's the iterator object. We'll need to unpack it into another structure to use it. So:

{% highlight python %}
print(dict(zip(numbers, cookies)))
>>{1: 'samoa', 2: 'trefoil', 3: 'thin mint', 4: 'tagalong'}

print(list(zip(numbers, cookies)))
>>[(1, 'samoa'), (2, 'trefoil'), (3, 'thin mint'), (4, 'tagalong')]

{% endhighlight %}

To me, casting the output of the zip iterator to a dict is typically most useful, but I also printed out the example using a list. Casting zipped tuples into a list lets you see that ```zip()``` really is building two-part tuples with each index of your iterable inputs.


**9. generators**

A generator is a kind of iterator. I learned to recognize them early by their dead giveaway: the ```yield``` keyword. It took me longer to understand some of the things I can do with generators.

Generators produce a sequence of results, one result per yield statement-execution, instead of the single object returned by ```iter()```.

Generators are useful for lazy evaluation, where the evaluation is delayed until its value is needed, so as to avoid repeat evaluations. When you call generators, you specify how much of the sequence you would like to compute. This is really nice if you have an infinite sequence and only want the first hundred return values:

{% highlight python %}
def fizzbuzz():
    i = 1
    x = None
    while i >=0:
        if i % 15 == 0:
            x = "fizzbuzz"
        elif i % 3 == 0:
            x = "fizz"
        elif i % 5 == 0:
            x = "buzz"
        else:
            x = str(i)
        yield x
        i = i + 1

def first_hundred(iterator):
    for x in range(100):
        print(next(iterator))
{% endhighlight %}

This produces a string output for FizzBuzz for the range (0,100]. Other common applications of generators are processing number-theory sequences like the Fibonacci sequence, or sequences of squares, or Pythagorean triples.

That's mostly what I have used generators for. They can also be used for more advanced concepts. I encourage you to do more research about generators if you're interested!

*Bonus:* We can also make generator expressions, which are similar to list comprehensions but result in a generator with the given parameters instead of a list.


**10. ```repr``` vs. ```str```**

```__repr__``` and ```___str___``` are methods of Python classes. Both are used to represent instances of the class as printed output.

The ```__repr__``` method is the "canonical" string representation of the specific instance. It should contain enough detail that the programmer can reproduce the instance exactly. The printed detail provided by calling ```__repr__``` should be optimized for a programmer working on the code.

The ```__str__``` method is a somewhat more general representation of the instance. It builds and returns a string when called. It might contain information about the attributes of that specific instance. The ```__str__``` method should produce text which the end-user of the program might find useful, or at the very least, not alarming.

These methods are called automatically when you have a print(object) line in your code. print() looks for the ```__str__``` method first, and if it does not find it, falls back to ```__repr__```. If neither exist, you get that weird memory address output. If you have both, and want ```__repr__```, you can call it directly by using the ```repr()``` function.

<body>
<br>
<hr>
<br>
</body>

Hopefully you found some value in that things it took me a year to learn in Python! If you found it useful or helpful, I'd appreciate a [retweet](https://twitter.com/ka_amazing/status/871819043837272064). Thanks to my editors, [@eliasdorneles](https://github.com/eliasdorneles/) and [@DataBranner](https://github.com/DataBranner).
