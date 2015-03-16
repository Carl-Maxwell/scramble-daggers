monkeypatch(Array.prototype, "shuffle", function() {
	var x = [].concat(this.splice(0, this.length));
	
	while (x.length > 0)
		this.push( x.splice(floor(Rng()*x.length), 1)[0] );
	
	return this;
} );