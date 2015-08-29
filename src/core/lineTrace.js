

window.lineTrace = function() {
	var start, line, end, debug;

	switch (arguments.length) {
		case 3:
			debug = true;
			// fall through to next case
		case 2:
			start = arguments[0];
			line = arguments[1];
			break;
		case 1:
	}

	if (!(start instanceof Vector3) || !(line instanceof Vector3)) {
		throw "lineTrace expected Vector3 arguments. Got: " + start.debugify() + " and " + line.debugify();
	}

	end = (start.clone()).add(line);

	if (end.y <= map.getHeight(end.x, end.z) || start.y <= map.getHeight(start.x, start.z)) {
		var blockCenter = end
			.clone()
			.divide(h('1 block'))
			.floor()
			.add(new Vector3(0.5, 0, 0.5))
			.multiply(h('1 block'));
		var lineMidPoint = line.clone().divide(2.0).add(start);

		if (debug) console.log(lineMidPoint.debugify(), blockCenter.debugify(), lineMidPoint.clone().subtract(blockCenter));

		var wallNormal = lineMidPoint.clone().subtract(blockCenter).multiply(new Vector3(1, 0, 1)).normalize();

		// if (debug) console.log(wallNormal.debugify(), line.clone().normalize().debugify());

		return wallNormal;//.add(line.clone().normalize());
	}

	return false;
};

// TODO should check whether it hits an entity
// TODO this should return a reference to the thing it hit
// TODO also it should return a whole object of information, hit normal, etc
	// maybe like: {entityNormal: wallNormal, hitNormal: ..., entity: ...}
