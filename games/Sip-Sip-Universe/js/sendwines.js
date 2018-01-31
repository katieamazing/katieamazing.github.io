// backend code running on webtask.io

var empty_shelves = [[], [], [], [], []]
var writeJSON = function( res, obj ) {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.write(JSON.stringify(obj));
  res.end();
}

module.exports =
  function (ctx, req, res) {
    switch(req.method){
      case 'GET':
        ctx.storage.get(function (error, data) {
          if (error) return req(error);
          if (ctx.data && ctx.data.shelfnum && ctx.data.shelfnum >= 0 && ctx.data.shelfnum < 5) {
            writeJSON(res, data[ctx.data.shelfnum]);
          } else {
            writeJSON(res, []);
          }
        });
      break;
      case 'POST':
        ctx.storage.get(function (error, data) {
          if (error) return req(error);
          // data = empty_shelves;
          console.log("line 29 " + JSON.stringify(ctx.data))
          if (ctx.data && ctx.data.shelfnum) {
             data[ctx.data.shelfnum].push(
              {"player": ctx.data.player,
               "wine": ctx.data.wine,
               "description": ctx.data.desc}
            );
          }
          ctx.storage.set(data, function (error) {
              if (error) return req(error);
          });
          writeJSON(res, []);
        });
      break;
    }

  }
