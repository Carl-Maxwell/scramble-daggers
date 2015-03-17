
// establish the units of measurement

(function() {
	// how many three.js units a block is made of
	window.block = 100;
	
	// player's 'normal' blocks/second walkspeed
	window.walk = 1;
	
	var distance = {
		block: block,
		second: 6*60, // 360, so, 3.6*block
		minute: 6*60*60,
		hour: 6*60*60*60,
	};
	
	// add pluralizations
	for (var key in distance)
		distance[key + "s"] = distance[key];
	
	window.Hinge = window.h = window.Hinge || function(tokens) {
		tokens = tokens.split(" ");
		return tokens[0] * distance[tokens[1]];
	};
})();
