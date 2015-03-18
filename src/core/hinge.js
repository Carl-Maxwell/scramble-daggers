
// establish the units of measurement

(function() {
	// how many three.js units a block is made of
	window.block = 100;

	// player's 'normal' units/second walkspeed
	window.walk = 6*60;

	var distance = {
		block : block,
		second: walk,
		minute: walk*60,
		hour  : walk*60*60,
	};

	// add pluralizations
	for (var key in distance)
		distance[key + "s"] = distance[key];

	window.Hinge = window.h = window.Hinge || function(tokens) {
		tokens = tokens.split(" ");
		return tokens[0] * distance[tokens[1]];
	};
})();
