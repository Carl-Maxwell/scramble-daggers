

function generateHeight( width, height ) {

	/*
	
	var data = [], perlin = new ImprovedNoise(),
	size = width * height, quality = 2, z = Rng() * 100;

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
			x: round(WIDTH  / 2 / BLOCK_SIZE) * BLOCK_SIZE,
			y: round(HEIGHT / 2 / BLOCK_SIZE) * BLOCK_SIZE
		};

		this.tick = function() {
			var x = 0, y = 0;

			var chanceSum = this.chances.reduce(function(a, b) { return a + b; } ),
			    valueSum  = 0,
			    that      = this,
			    direction = Rng() * chanceSum;

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
					this.chances[ key ] = max(1, this.chances[ key ] + this.mode);
					switch(key) {
						case 0: y -= BLOCK_SIZE; break;
						case 1: x += BLOCK_SIZE; break;
						case 2: y += BLOCK_SIZE; break;
						case 3: x -= BLOCK_SIZE; break;
					} 
				}
				valueSum += value;
			}, this );

			this.position.x = max(0, min(WIDTH  - BLOCK_SIZE, this.position.x + x));
			this.position.y = max(0, min(HEIGHT - BLOCK_SIZE, this.position.y + y));

			var entity_key = round( (WIDTH / BLOCK_SIZE * floor(this.position.y/BLOCK_SIZE)) + floor(this.position.x/BLOCK_SIZE) );

			if (typeof this.map[ entity_key ] == 'undefined') {
				console.log( 'entity not found!', this.position.x, this.position.y, entity_key );
			}

			this.map[ entity_key ] = 60; //|| round( (248 - this.map[ entity_key ]) * 0.01 );

//						entities[ entity_key ].sprite.color[0] += round( (248 - rgb[0]) * 0.2 );
//						entities[ entity_key ].sprite.color[1] += round( (187 - rgb[1]) * 0.2 );
//						entities[ entity_key ].sprite.color[2] += round( (198 - rgb[2]) * 0.2 );

		}
		
		this.destroy = function() {
			for (var i = 0; i < WIDTH * HEIGHT; i++) {
			
				var x = i % WIDTH,
				    y = (i-x)/WIDTH;
				
				// var dist = pow(2, x - WIDTH / 2) + pow(2, y - HEIGHT/2);
				
				if (this.map[i] == 0) {
					var any = false;
					for (var q=-1; q<2; q++)
						for (var w=-1; w<2; w++)
							any = any || this.map[i + (q + w*WIDTH)] == 60;
					this.map[i] = any ? 65 : 70;
				}
				
				// this.map[i] = this.map[i] || max(min(random() * 255 + random() * 255, random() * 255 + random() * 255) / 2, 100);
				//round( sin( abs((x - WIDTH/2) / (WIDTH/2) ) * abs((y - HEIGHT/2) / (HEIGHT/2)) * (PI/2) ) * 60 );
				
			}
		};
		
	};
	
	var agent = new Agent();

	var iterations = 6000 + (Rng() * 2000);

	for (var i = 0; i < iterations; i++)
		agent.tick();

	agent.destroy();

	return agent.map;

}


