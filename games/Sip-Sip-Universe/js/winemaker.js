// uses a global sound
// uses a global randBetween
// uses a global player
// uses four dom elements, with ids wine_description, wine_naming_box, wine_button, and wine_name

class WineMaker {
  constructor (x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.rng = Math.random;
    this.ingredients = [];
    this.wine = null;
    this.sfx = new sound("audio/winemaking.wav");
    this.sfxi = new sound("audio/drop_ingredient_in_winemaker.wav");
  }
  capacity() {
    if (this.wine === null) {
      return 3 - this.ingredients.length;
    } else {
      return 0;
    }
  }
  draw() {
    // TODO: draw ingredients OR
    // draw finished wine
    for (var i = 0; i < this.ingredients.length; i += 1) {
      this.ingredients[i].x = this.x + i * 20 + 5;
      this.ingredients[i].y = this.y + 10;
      this.ingredients[i].drawLittle();
    }
    if (this.wine !== null) {
      this.wine.x = this.x + 20;
      this.wine.y = this.y - 45;
      this.wine.draw()
    }
  }
  combine_ingredients(a, b, c) {
    let averageRarity = (a.rarity + b.rarity + c.rarity) / 3;

    // determine color
    let color = null,
      possibleColors = null;
    if (a.type == b.type
      && b.type == c.type) {
      // all equal
      possibleColors = ["scarlet", "ruby", "crimson", "blood-colored", "rusty", "garnet", "red", "rose", "vermillion"];
      averageRarity += 2;
    } else if (a.type != b.type
      && b.type != c.type
      && a.type != c.type) {
      // all different
      possibleColors = ["violet", "blue", "aquamarine", "sapphire", "opalescent", "cobalt", "indigo", "inky"];
      averageRarity += 3;
    } else {
      // two and one
      possibleColors = ["apple green", "green", "verdant", "teal", "turquoise", "emerald", "jade", "chartreuse"]
    }
    color = possibleColors[randBetween(this.rng, 0, possibleColors.length)];

    //determine rarity text
    let rarity = null;
    if (averageRarity < 3) {
      rarity = "pedestrian";
    } else if (averageRarity < 8) {
      rarity = "common";
    } else if (averageRarity < 12) {
      rarity = "unusual";
    } else if (averageRarity < 14) {
      rarity = "rare";
    } else if (averageRarity < 16) {
      rarity = "quite rare";
    } else if (averageRarity < 18) {
      rarity = "prized";
    } else {
      rarity = "extremely rare";
    }

    //build description
    let possibleDescriptions =
      [ "A # & wine with # characteristics and a # nose. $."
      , "The color is &, and the wine is # and #, very # on the palate. A $ wine, indeed."
      , "Balanced #, #, with a touch of # qualities on the palate. A rich & hue; $."
      , "Sweetly #, with an unusual # and ripe # notes. The & indicated a good aging wine; $."
      , "Pure &, tastes # and #. The heady # notes improve this $ wine."
      , "This $ wine is full of # and # body, with a long, #-filled finish. A striking & color."
      , "Concentrated # taste and a bright & color in the glass. The # and # qualities enhance this $ wine."
      , "A classic & wine, bursting with #, #, and # flavor. A $ wine."
      , "A strong # wine, with a soft & color. Flavors of # and # notes in this $ wine."
      , "A hint of springtime # tastes in this sprightly, & wine. Delicious # and # aromas; $."
      ],
      descs = [a.description, b.description, c.description];
    let description = possibleDescriptions[randBetween(this.rng, 0, possibleDescriptions.length)];
    for (var i = 0; i < 3; i++) {
      description = description.replace("#", descs.pop());
    }
    description = description.replace("&", color);
    description = description.replace("$", rarity);
    console.log(description);
    return new Wine(-100, -100, 10, 10, "wine", averageRarity, description);
  }

  action() {
    if (player.holding === null && this.wine !== null) {
      console.log("Picking up wine!");
      this.sfx.play();
      naming_mode = true;
      document.querySelector("#wine_description").innerHTML = this.wine.description;
      document.querySelector("#wine_naming_box").style.display = "inline";
      var that = this;
      document.querySelector("#wine_button").onclick = function (e) {
        that.wine.name = document.querySelector("#wine_name").value;
        document.querySelector("#wine_name").value = "";
        currentState.stuff.push(that.wine);
        player.holding = that.wine;
        that.wine = null;
        document.querySelector("#wine_naming_box").style.display = "none";
        naming_mode = false;
      }
    } else if (player.holding === null && this.ingredients.length > 0) {
      console.log("Taking an ingredient out!");
      this.sfxi.play();
      player.holding = this.ingredients.pop();
      currentState.stuff.push(player.holding);
    } else if (player.holding !== null && this.capacity() > 0) {
      console.log("Putting an ingredient in!");
      this.sfxi.play();
      var index = currentState.stuff.indexOf(player.holding);
      if (index > -1) {
        currentState.stuff.splice(index, 1);
      }
      this.ingredients.push(player.holding);
      player.holding = null;
      if (this.capacity() == 0) {
        this.wine = this.combine_ingredients(
          this.ingredients[0],
          this.ingredients[1],
          this.ingredients[2]
        );
        this.ingredients = [];
      }
    }
  }
}
