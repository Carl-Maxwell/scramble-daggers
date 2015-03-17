
(function() {
	var tests = [];
	
	window.test = function(name, test) {
		tests.push({name: name, test: test});
	};
	
	window.onload = function() {
		// TODO will this actually wait until all the scripts have loaded?
		
		var successes = 0;
		
		for (var i in tests) {
			var result = tests[i].test();
			if (!result)
				console.log(tests[i].name + " test FAILED. Result: " + result);
			else
				successes++;
		}
		
		if (successes == tests.length)
			console.log("All " + tests.length + " tests passed.");
	};
	
})();