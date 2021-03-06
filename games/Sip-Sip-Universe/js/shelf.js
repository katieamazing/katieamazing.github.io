// uses global player
// uses global currentState
// uses global function displayInfoText

class Shelf {
  constructor(x, y, w, h, i) {
    this.x = x;
    this.y = y;
    this.width = w;
    this.height = h;
    this.i = i;
    this.data = [];
    this.viewWine(i);
  }

  viewWine(shelf_number){
    var that = this;

    fetch("https://wt-74f3734c47ba2551d6aa1c792a4e1c45-0.run.webtask.io/sendwines" +
      "?shelfnum=" + encodeURIComponent(shelf_number),
      {cache: "no-store"})
    .then(function(response) {
      return response.json();
    }).then(function(data) {
      if (data) {
        that.data = data;
      }
    });
  }
  sendWine(player, wine, shelf_number, desc){
    var that = this;

    fetch("https://wt-74f3734c47ba2551d6aa1c792a4e1c45-0.run.webtask.io/sendwines" +
      "?player=" + encodeURIComponent(player) +
      "&wine=" + encodeURIComponent(wine) +
      "&shelfnum=" + encodeURIComponent(shelf_number) +
      "&desc=" + encodeURIComponent(desc),
    { method: "POST", cache: "no-store" })

    this.data.push({player: player, wine: wine, description: desc});
  }

  draw() {
  }

  action() {
    console.log(this.data);
    if (player.holding !== null && player.holding.name) {
      // sending
      this.sendWine(player.name, player.holding.name, this.i, player.holding.description);
      var index = currentState.stuff.indexOf(player.holding);
      if (index > -1) {
        currentState.stuff.splice(index, 1);
      }
      player.holding = null;
    } else if (player.holding === null && this.data.length > 0) {
      // viewing
      this.viewWine(this.i);
      var tnode = document.createElement("table");
      var header = tnode.createTHead();
      var header_row = header.insertRow();
      header_row.insertCell(0).innerHTML = "<b>Player</b>"
      header_row.insertCell(1).innerHTML = "<b>Wine</b>"
      header_row.insertCell(2).innerHTML = "<b>Description</b>"
      for (var i = 0; i < this.data.length; i++) {
        if ( this.data[i] === null ) {
          continue;
        }
        var row = tnode.insertRow(i+1);
        row.insertCell(0).innerHTML = this.data[i].player;
        row.insertCell(1).innerHTML = this.data[i].wine;
        row.insertCell(2).innerHTML = this.data[i].description;
      }
      displayInfoText(tnode);
    }
  }
}
