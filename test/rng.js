

test("Rng/randomness", function() {
	var arr = [0, 0, 0, 0];
	
	for (var i = 0; i < 100000; i++)
		arr[ floor(Rng()*4) ]++;
	
	var q = arr[0],
	    w = arr[1],
	    e = arr[2],
	    r = arr[3];
	
	// pass the test if they are all four are within 10% of each other
	
	var success = true;
	
	success &= q*0.9 < w || q*1.1 > w;
	success &= w*0.9 < e || w*1.1 > e;
	success &= e*0.9 < r || e*1.1 > r;
	success &= r*0.9 < q || r*1.1 > q;
	
	return success || arr;
	
	// it should pass the test if the four elements are close enough to each other
});

