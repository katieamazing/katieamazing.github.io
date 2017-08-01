let rules = {
  floor: [],
  hole: [
    { tileIndex:  0, map: { n: "!hole", e: "!hole", s: "!hole", w: "!hole"} },
    { tileIndex:  1, map: { n:  "hole", e: "!hole", s: "!hole", w: "!hole"} },
    { tileIndex:  2, map: { n: "!hole", e:  "hole", s: "!hole", w: "!hole"} },
    { tileIndex:  3, map: { n:  "hole", e:  "hole", s: "!hole", w: "!hole"} },
    { tileIndex:  4, map: { n: "!hole", e: "!hole", s:  "hole", w: "!hole"} },
    { tileIndex:  5, map: { n:  "hole", e: "!hole", s:  "hole", w: "!hole"} },
    { tileIndex:  6, map: { n: "!hole", e:  "hole", s:  "hole", w: "!hole"} },
    { tileIndex:  7, map: { n:  "hole", e:  "hole", s:  "hole", w: "!hole"} },
    { tileIndex:  8, map: { n: "!hole", e: "!hole", s: "!hole", w:  "hole"} },
    { tileIndex:  9, map: { n:  "hole", e: "!hole", s: "!hole", w:  "hole"} },
    { tileIndex: 10, map: { n: "!hole", e:  "hole", s: "!hole", w:  "hole"} },
    { tileIndex: 11, map: { n:  "hole", e:  "hole", s: "!hole", w:  "hole"} },
    { tileIndex: 12, map: { n: "!hole", e: "!hole", s:  "hole", w:  "hole"} },
    { tileIndex: 13, map: { n:  "hole", e: "!hole", s:  "hole", w:  "hole"} },
    { tileIndex: 14, map: { n: "!hole", e:  "hole", s:  "hole", w:  "hole"} },
    { tileIndex: 15, map: { n:  "hole", e:  "hole", s:  "hole", w:  "hole"} },
  ],
  ceiling: [
    // Put this rule up top to make clearing screen faster.
    { tileIndex: {row:4, col:1}, map: { nw:"ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"ceiling" } },

    // --- Row 1 ---
    { tileIndex: {row:1, col:0}, map: { n:"!ceiling", w:"!ceiling", e:"!ceiling", s:"ceiling"} },
    { tileIndex: {row:1, col:1}, map: { n:"!ceiling", w:"!ceiling", e:"ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:0, col:4}, map: { n:"!ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:5, col:6}, map: { n:"!ceiling", w:"ceiling", e:"!ceiling", sw:"ceiling", s:"ceiling" } },
    { tileIndex: {row:4, col:3}, map: { n:"!ceiling", w:"!ceiling", e:"ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:0, col:2}, map: { n:"!ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:0, col:6}, map: { n:"!ceiling", w:"ceiling", e:"!ceiling", sw:"!ceiling", s:"ceiling" } },
    { tileIndex: {row:2, col:5}, map: { nw:"ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"!ceiling"} },
    { tileIndex: {row:3, col:4}, map: { nw:"ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"!ceiling"} },
    { tileIndex: {row:5, col:1}, map: { nw:"ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"ceiling"} },

    // --- Row 2 ---
    { tileIndex: {row:4, col:5}, map: { n:"ceiling", w:"!ceiling", e:"!ceiling", s:"ceiling" } },
    { tileIndex: {row:4, col:0}, map: { n:"ceiling", ne:"ceiling", w:"!ceiling", e:"ceiling", s:"ceiling", se:"ceiling" } },
    //{ tileIndex: {row:4, col:1}, map: { nw:"ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:4, col:2}, map: { nw:"ceiling", n:"ceiling", w:"ceiling", e:"!ceiling", sw:"ceiling", s:"ceiling" } },
    { tileIndex: {row:2, col:0}, map: { n:"ceiling", ne:"!ceiling", w:"!ceiling", e:"ceiling", s:"ceiling", se:"!ceiling" } },
    //{ tileIndex: ??, map: { nw:"!ceiling", n:"!ceiling", ne:"!ceiling", w:"!ceiling", e:"!ceiling", sw:"!ceiling", s:"!ceiling", se:"!ceiling" } },
    { tileIndex: {row:3, col:6}, map: { nw:"!ceiling", n:"ceiling", w:"ceiling", e:"!ceiling", sw:"!ceiling", s:"ceiling" } },
    { tileIndex: {row:5, col:2}, map: { nw:"ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:5, col:3}, map: { nw:"!ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:1, col:3}, map: { nw:"!ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"ceiling" } },

    // --- Row 3 ---
    { tileIndex: {row:4, col:6}, map: { n:"ceiling", w:"!ceiling", e:"!ceiling", s:"!ceiling" } },
    { tileIndex: {row:6, col:5}, map: { n:"ceiling", ne:"ceiling", w:"!ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:3, col:3}, map: { nw:"ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:6, col:6}, map: { nw:"ceiling", n:"ceiling", w:"ceiling", e:"!ceiling", s:"!ceiling" } },
    { tileIndex: {row:6, col:0}, map: { n:"ceiling", ne:"!ceiling", w:"!ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:6, col:3}, map: { nw:"!ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:4, col:4}, map: { nw:"!ceiling", n:"ceiling", w:"ceiling", e:"!ceiling", s:"!ceiling" } },
    { tileIndex: {row:1, col:5}, map: { nw:"ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:3, col:1}, map: { nw:"!ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:2, col:3}, map: { nw:"!ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"ceiling" } },

    // --- Row 4 ---
    { tileIndex: {row:0, col:1}, map: { n:"!ceiling", w:"!ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:5, col:4}, map: { n:"!ceiling", w:"ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:6, col:4}, map: { n:"!ceiling", w:"ceiling", e:"!ceiling", s:"!ceiling" } },
    { tileIndex: {row:0, col:5}, map: { n:"!ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:2, col:6}, map: { nw:"ceiling", n:"ceiling", w:"ceiling", e:"!ceiling", sw:"!ceiling", s:"ceiling" } },
    { tileIndex: {row:5, col:0}, map: { n:"ceiling", ne:"ceiling", w:"!ceiling", e:"ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:0, col:3}, map: { n:"!ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:3, col:5}, map: { nw:"ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:2, col:1}, map: { nw:"!ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"!ceiling" } },

    // --- Row 5 ---
    { tileIndex: {row:2, col:2}, map: { nw:"ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:3, col:2}, map: { nw:"!ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:3, col:0}, map: { n:"ceiling", ne:"!ceiling", w:"!ceiling", e:"ceiling", s:"ceiling", se:"ceiling" } },
    { tileIndex: {row:6, col:1}, map: { nw:"!ceiling", n:"ceiling", ne:"ceiling", w:"ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:6, col:2}, map: { nw:"ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", s:"!ceiling" } },
    { tileIndex: {row:1, col:6}, map: { nw:"!ceiling", n:"ceiling", w:"ceiling", e:"!ceiling", sw:"ceiling", s:"ceiling" } },
    { tileIndex: {row:1, col:2}, map: { nw:"!ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"ceiling", s:"ceiling", se:"!ceiling" } },
    { tileIndex: {row:5, col:5}, map: { nw:"!ceiling", n:"ceiling", ne:"!ceiling", w:"ceiling", e:"ceiling", sw:"!ceiling", s:"ceiling", se:"ceiling" } },

    // a lonely pillar
    { tileIndex: {row:0, col:0}, map: { n:"!ceiling", w:"!ceiling", e:"!ceiling", s:"!ceiling", } },
  ],
  wall: []
};

function makeTypeMap(world, rng) {
  var typeMap = [];
  for (var row = 0; row < world.height/T; row++) {
    typeMap[row] = [];
    for (var col = 0; col < world.width/T; col++) {
      let type = null;
      switch (Math.floor(rng() * 10)) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
          type = 'ceiling';
          break;
        case 7:
        case 8:
          type = 'floor';
          break;
        case 9:
          type = 'hole';
          break;
      }
      typeMap[row][col] = type;
    }
  }
  return typeMap;
}

function checkType(row, col, ruleTypeStr, baseType, typeMap) {
  var type = null;
  if (typeMap[row] == undefined || typeMap[row][col] == undefined) {
    // if we look beyond the edge of the map, we find a copy of the center cell
    type = baseType;
  } else {
    type = typeMap[row][col];
  }
  if (ruleTypeStr == undefined) {
    return true;
  }
  if (ruleTypeStr.charAt(0) == "!") {
    return type != ruleTypeStr.slice(1);
  } else {
    return type == ruleTypeStr;
  }
}

function checkRule(rule, row, col, typeMap) {
  var base = typeMap[row][col];

  if( !checkType( row-1, col-1, rule.map.nw, base, typeMap ) ) return false;
  if( !checkType( row-1, col,   rule.map.n,  base, typeMap ) ) return false;
  if( !checkType( row-1, col+1, rule.map.ne, base, typeMap ) ) return false;
  if( !checkType( row,   col-1, rule.map.w,  base, typeMap ) ) return false;
  if( !checkType( row,   col+1, rule.map.e,  base, typeMap ) ) return false;
  if( !checkType( row+1, col-1, rule.map.sw, base, typeMap ) ) return false;
  if( !checkType( row+1, col,   rule.map.s,  base, typeMap ) ) return false;
  if( !checkType( row+1, col+1, rule.map.se, base, typeMap ) ) return false;

  return true;
}

function updateViewFromType(row, col, typeMap) {
  var type = typeMap[row][col];
  for (var i = 0; i < rules[type].length; i++) {
    var rule = rules[type][i];
    if (checkRule(rule, row, col, typeMap)) {
      return rule.tileIndex;
    }
  }
  return typeMap[row][col];
}

function makeViewMap(world, typeMap) {
  var viewMap = [];
  for (var row = 0; row < world.height/T; row++) {
    viewMap[row] = [];
    for (var col = 0; col < world.width/T; col++) {
      viewMap[row][col] = updateViewFromType(row, col, typeMap);
    }
  }
  return viewMap;
}
