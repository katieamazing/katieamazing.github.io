---
layout: post
title: "Python-NLP Twitter Bots"
date: 2017-08-25
---

I recently launched two new Twitter bots! I guess, when Twitter bums me out for not meeting my quota of procedurally-generated silliness, I fill my feed with my own wacky creations.

So, I'm glad to introduce **[@tsrewrite](https://twitter.com/tsrewrite)** and **[@pussy_bot](https://twitter.com/pussy_bot)**!

[![tsrewrite](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/img/tsrewrite.png)](https://twitter.com/tsrewrite) [![pussy_bot](https://raw.githubusercontent.com/katieamazing/katieamazing.github.io/master/img/pussy_bot.png)](https://twitter.com/pussy_bot)

These bots were both written with Python, use the Twython library to interact with Twitter's API, and are running as cron jobs on PythonAnywhere's cloud.

**Pussy Bot** uses BeautifulSoup to parse an html document containing the text of the 1895 book *Pussy and Her Language*, by Marvin R. Clark. The program filters each sentence in the book by a tweetable length, and by some keywords that have to do with cats. This cuts down on the possible tweets quite a lot, as it is a verbose example of writing. I anticipate at one daily tweet that the bot will start to repeat itself obviously in about six months, at which point I will have to expand my filtering parameters, or add new Victorian literature about cats. Each sentence is accompanied by mid-to-late 19th century and early 20th century fine artworks featuring cats, mostly pulled from Wikimedia Commons. The src is [here](https://github.com/katieamazing/pussybot), if you are interested.
<html><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">My greatest desire is to interest the world in this worthy subject and induce investigations by others. <a href="https://t.co/zPUSi3NMvb">pic.twitter.com/zPUSi3NMvb</a></p>&mdash; Victorian Cat Notes (@pussy_bot) <a href="https://twitter.com/pussy_bot/status/896464020903014400">August 12, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></html>

**Taylor Swift Rewrite** rewrites the earwormiest Taylor Swift lyrics with NLTK. The scipt generating the tweets has three functions which plug in generated words in a mad-libs fashion. The script chooses words randomly by their part of speech from the Wordnet corpus. Some words are filtered by their common-ness by comparing them to the Webtext corpus; this cuts down on jargon words and proper nouns. At one point in the development of the script, it squashed all weird words, but I found I liked some of them. So it is not fully applied to every generated word.

Another feature of the bot's word picking is the ability to take a selected word and find a related word, ideally creating a pair. These pairs can be related by rhyme, using [Allison Parrish's excellent pronouncing library](https://github.com/aparrish/pronouncingpy) to find rhyming words. The pair can instead be related by meaning. I experimented with training my own models and using Word2Vec to use word vectors to find related words by meaning, but didn't find the results accurate enough. So I have implemented the script with a pre-trained model from Google.

The Google model's results are much more accurate. Its thoroughness created a deployment issue, as my cloud solution will not tolerate a 1.5GB model running on it. For now, I run a local script once a month that generates the next month's tweets, scan them with my human eyes :eyes: for anything potentially offensive, and upload the pickled file to the cloud. A script then accesses that file to tweet it through the month. The scripts powering the bot are [here](https://github.com/katieamazing/tsrewritebot).

<html><blockquote class="twitter-tweet" data-lang="en"><p lang="en" dir="ltr">She watches economic geography,<br>I background crate,<br>She&#39;s topography,<br>I have all this weight.</p>&mdash; Taylor Swift Rewrite (@tsrewrite) <a href="https://twitter.com/tsrewrite/status/900056032927510528">August 22, 2017</a></blockquote>
<script async src="//platform.twitter.com/widgets.js" charset="utf-8"></script></html>

I'd like to experiment with other NLP stuff on this bot, and hopefully move it to a less-manual process. Training a model on Taylor Swift lyrics and implementing a Markov Chain sounds fun, and might do some of the work my script is doing implicitly - like filtering for "normal human song lyric"-quality words.

![taylor swift is a robot](http://static.spin.com/files/tumblr_naiv0tkX2t1qh0wmfo1_400.gif)

I have [previously made a Twitter bot](http://katieamazing.com/blog/2016/01/20/tracery) using JSON and [Kate Compton's Tracery](https://github.com/galaxykate/tracery), and while it felt creative, it did not feel much like writing code or like a technical challenge. Tracery and Cheap Bots Done Quick are such excellent tools that they take care of a lot of the pain for you. I enjoyed digging a little deeper into the process, even though Twython also makes things fairly painless.

It was terrific using my Python skills to get these bots working, and I'm looking forward to enjoying them in my feed. I hope you'll follow and enjoy them, too!
