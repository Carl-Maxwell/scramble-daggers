monkeypatch(Array.prototype, "shuffle", function() {
	var x = [].concat(this.splice(0, this.length));

	while (x.length > 0)
		this.push( x.splice(floor(Rng()*x.length), 1)[0] );

	return this;
} );

/*
 * seems like I might want to support these as well:

Int8Array();
Uint8Array();
Uint8ClampedArray();
Int16Array();
Uint16Array();
Int32Array();
Uint32Array();
Float32Array();
Float64Array();

 */
