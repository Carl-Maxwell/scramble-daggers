


window.range = function(x, y) {
	var max = y || x;
	var min = typeof y == "undefined" ? 0 : x;
	
	var arr = [];
	
	for (var i=min; i < max; i++)
		arr.push(i);
	
	return arr;
};
