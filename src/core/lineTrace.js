

window.lineTrace = function() {
	var start, line, end;

	switch (arguments.length) {
		case 2: start = arguments[0]; line = arguments[1]; break;
		case 1:
	}

	if (!(start instanceof Vector3) || !(line instanceof Vector3)) {
		throw "lineTrace expected Vector3 arguments. Got: " + start.debugify() + " and " + line.debugify();
	}

	end = (start.clone()).add(line);

	if (end.y <= map.getHeight(end.x, end.z) || start.y <= map.getHeight(start.x, start.z)) {
		return true;
	}

	return false;
};

// TODO should check whether it hits an entity
// TODO this should return a reference to the thing it hit
// TODO also it should return a whole object of information, hit normal, etc
