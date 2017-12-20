function wordWrap( text, width ) {
    var lines = [];
    var words = text.split(' ');
    var current_line = '';
    for (var i = 0; i < words.length; i += 1) {
      var word = words[i];
      if (ctx.measureText(current_line + ' ' + word).width > width) {
        lines.push(current_line);
        current_line = word;
      } else {
        current_line = current_line + ' ' + word;
      }
    }
    lines.push(current_line);
    return lines;
}
