


window.lineTrace = function() {
  var start, line;

  switch (arguments.length) {
    case 2: start = arguments[0]; line = arguments[1]; break;
    case 1:
  };

  start = start.divide(h("1 block")).round();
  line  = line .divide(h("1 block")).round();

  if (start.add(line).y < map.getHeight(start.add(line).x, start.add(line).z)) {

  }


};

// TODO should check whether it hits the ground
// TODO should check whether it hits a wall
// TODO should check whether it hits an entity
// TODO this should return a reference to the thing it hit
