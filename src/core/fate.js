(function() {
	var internal_fraction = function(code) {
		var tmp = code.split(" in ");
		
		var x = tmp[0],
		    y = tmp[1];
		
		var arr = [];
		
		for (var i = 0; i < tmp[0]; i++)
			arr.push(true);
		
		for (var i = 0; i < tmp[1] - tmp[0]; i++)
			arr.push(false);
		
		return arr.shuffle();
	};
	
	window.Fate = function() {
		this.tables = {};
		
		this.fraction = function(table) {
			return this.tables[table] = internal_fraction(table);
		};
		
		var that = this;
		
		return function(table) {
			return (
				that.tables[table] && that.tables[table].length ?
				that.tables[table]
					:
				that.fraction(table)
			).pop();
		};
	}
})();