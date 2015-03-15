

function generateHeight( width, height ) {

	/*
	
	var data = [], perlin = new ImprovedNoise(),
	size = width * height, quality = 2, z = Math.random() * 100;

	for ( var j = 0; j < 4; j ++ ) {

		if ( j == 0 ) for ( var i = 0; i < size; i ++ ) data[ i ] = 0;

		for ( var i = 0; i < size; i ++ ) {
			var x = i % width, y = ( i / width ) | 0;
			data[ i ] += perlin.noise( x / quality, y / quality, z ) * quality;
		}

		quality *= 4

	}
	*/
	
	var Agent = function() {

		var BLOCK_SIZE = 1,
		    WIDTH      = worldWidth,
		    HEIGHT     = worldDepth;
		
		this.map = [];
		
		for (var i = 0; i < WIDTH * HEIGHT; i++) this.map[i] = 0;

		this.chances = [500, 500, 500, 500];
		this.mode    = -1;

		this.position = {
			x: Math.round(WIDTH  / 2 / BLOCK_SIZE) * BLOCK_SIZE,
			y: Math.round(HEIGHT / 2 / BLOCK_SIZE) * BLOCK_SIZE
		};

		this.tick = function() {
			var x = 0, y = 0;

			var chanceSum = this.chances.reduce(function(a, b) { return a + b; } ),
				valueSum  = 0,
				that      = this,
				direction = Math.random() * chanceSum;

			if (this.mode == -1 && chanceSum == 4) {
				this.mode = 1;
				//console.log('switched into corridor mode');
			} else if (this.mode == 1 && chanceSum == 10) {
				this.mode = -1;
				//console.log('switched back to room mode');
			}

			this.chances.forEach(function(value, key) {

				if (typeof direction == "number" && direction < (value + valueSum)) {
					direction = false;
					this.chances[ key ] = Math.max(1, this.chances[ key ] + this.mode);
					switch(key) {
						case 0: y -= BLOCK_SIZE; break;
						case 1: x += BLOCK_SIZE; break;
						case 2: y += BLOCK_SIZE; break;
						case 3: x -= BLOCK_SIZE; break;
					} 
				}
				valueSum += value;
			}, this );

			this.position.x = Math.max(0, Math.min(WIDTH  - BLOCK_SIZE, this.position.x + x));
			this.position.y = Math.max(0, Math.min(HEIGHT - BLOCK_SIZE, this.position.y + y));

			var entity_key = Math.round( (WIDTH / BLOCK_SIZE * Math.floor(this.position.y/BLOCK_SIZE)) + Math.floor(this.position.x/BLOCK_SIZE) );

			if (typeof this.map[ entity_key ] == 'undefined') {
				console.log( 'entity not found!', this.position.x, this.position.y, entity_key );
			}

			var round  = Math.round ,
			    random = Math.random;

			this.map[ entity_key ] = 60 || round( (248 - this.map[ entity_key ]) * 0.01 );

//						entities[ entity_key ].sprite.color[0] += round( (248 - rgb[0]) * 0.2 );
//						entities[ entity_key ].sprite.color[1] += round( (187 - rgb[1]) * 0.2 );
//						entities[ entity_key ].sprite.color[2] += round( (198 - rgb[2]) * 0.2 );

		}
		
		this.destroy = function() {
			var round  = Math.round,
			    random = Math.random,
			    min    = Math.min,
			    max    = Math.max,
			    square = function(a) { return a*a; },
			    abs    = Math.abs,
			    PI     = Math.PI,
			    sin    = Math.sin;
		
			for (var i = 0; i < WIDTH * HEIGHT; i++) {
			
				var x = i % WIDTH,
				    y = (i-x)/WIDTH;
				
				square(x - WIDTH / 2) + square(y - HEIGHT/2);
				
				this.map[i] =  this.map[i] || 65; //max(min(random() * 255 + random() * 255, random() * 255 + random() * 255) / 2, 100);
				//round( sin( abs((x - WIDTH/2) / (WIDTH/2) ) * abs((y - HEIGHT/2) / (HEIGHT/2)) * (PI/2) ) * 60 );
				
			}
		};
		
	};
	
	var agent = new Agent();

	var iterations = 6000 + (Math.random() * 2000);

	for (var i = 0; i < iterations; i++)
		agent.tick(); 

	agent.destroy();

	return agent.map;

}


