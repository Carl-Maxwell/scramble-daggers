/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 * @author Carl Maxwell
*/

THREE.FirstPersonControls = function ( object, domElement ) {
	this.camera = object;
	this.lookTarget = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.enabled = true;

	this.movementSpeed = 0.001;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward  = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef  = 1.0;
	this.heightMin   = 0.0;
	this.heightMax   = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.autoSpeedFactor = 0.0;

	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseSensitivity = 0.5;

	this.lat   = 0;
	this.lon   = 0;
	this.phi   = 0;
	this.theta = 0;

	// keypress booleans:
	this.moveForward  = false;
	this.moveBackward = false;
	this.moveLeft     = false;
	this.moveRight    = false;
	this.freeze       = false;
	this.jump         = false;

	// keypress-related player state
	this.canJump  = true;
	this.velocity = new Vector3();
	this.move = {
		magnitude   : new Timer(3),
		accelerating: false       ,
		direction   : new Vector3()
	};
	this.move.magnitude.reverse();
	this.moveMinor = {
		magnitude   : new Timer(3),
		accelerating: false       ,
		direction   : new Vector3()
	};
	this.moveMinor.magnitude.reverse();

	this.mouseDragOn = false;

	this.viewHalfX = 0;
	this.viewHalfY = 0;

	if ( this.domElement !== document ) {
		this.domElement.setAttribute( 'tabindex', -1 );
	}

	//

	this.handleResize = function () {
		if ( this.domElement === document ) {
			this.viewHalfX = window.innerWidth / 2;
			this.viewHalfY = window.innerHeight / 2;
		} else {
			this.viewHalfX = this.domElement.offsetWidth / 2;
			this.viewHalfY = this.domElement.offsetHeight / 2;
		}
	};

	this.onMouseMove = function ( e ) {
		var movementX = e.movementX       ||
		                e.mozMovementX    ||
		                e.webkitMovementX,

		movementY = e.movementY       ||
		            e.mozMovementY    ||
		            e.webkitMovementY;

		this.mouseX += movementX * this.mouseSensitivity;
		this.mouseY += movementY * this.mouseSensitivity;
	};

	this.onKeyDown = function ( event ) {
		//event.preventDefault();

		switch ( event.keyCode ) {
			case 38: /*up*/    case 87: /*W*/ this.moveForward  = true; break;

			case 37: /*left*/  case 65: /*A*/ this.moveLeft     = true; break;

			case 40: /*down*/  case 83: /*S*/ this.moveBackward = true; break;

			case 39: /*right*/ case 68: /*D*/ this.moveRight    = true; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;

			case 32: /*space*/ this.jump = this.canJump; break;
		}
	};

	this.onKeyUp = function ( event ) {
		switch( event.keyCode ) {
			case 38: /*up*/    case 87: /*W*/ this.moveForward  = false; break;

			case 37: /*left*/  case 65: /*A*/ this.moveLeft     = false; break;

			case 40: /*down*/  case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/ case 68: /*D*/ this.moveRight    = false; break;

			case 32: /*space*/ this.jump = false; break;
		}
	};

	this.update = function( delta ) {
		if ( this.enabled === false ) return;
		if ( this.freeze ) return;

		var position = this.camera.position;

		this.move.direction
			.set(0, 0, 0)
			.add(this.moveForward  ? new Vector3(  0, 0, -1) : 0)
			.add(this.moveBackward ? new Vector3(  0, 0,  1) : 0)
			.add(this.moveRight    ? new Vector3(  1, 0,  0) : 0)
			.add(this.moveLeft     ? new Vector3( -1, 0,  0) : 0);

		if (this.move.direction.length() && !this.move.accelerating) {
			this.move.accelerating = true;
			this.move.magnitude.reverse();
			this.move.magnitude.setDuration(0.4);

			this.moveMinor.accelerating = true;
			this.moveMinor.magnitude.reverse();
			this.moveMinor.magnitude.setDuration(3);
		} else if (!this.move.direction.length() && this.move.accelerating) {
			this.move.accelerating = false;
			this.move.magnitude.reverse();
			this.move.magnitude.setDuration(0.4);

			this.moveMinor.accelerating = false;
			this.moveMinor.magnitude.reverse();
			this.moveMinor.magnitude.setDuration(0.4);
		}

		var moveSpeed = function(timestamp) {
			if (timestamp === false) return 0;

			return Ease(timestamp.get(), "outSine") * h("1 seconds walk");
		};

		var decelerateSpeed = function(speed) {
			return Ease(abs(speed)/h("1 seconds walk"), "inSine") * speed;
		};

		var speed = (
		             Ease(this.move.magnitude.get()     , "outSine") +
		             Ease(this.moveMinor.magnitude.get(), "outSine")
		            ) / 2.0;

		this.velocity.x = speed * h("1 seconds walk") * this.move.direction.x;
		this.velocity.z = speed * h("1 seconds walk") * (this.move.direction.z || sign(this.velocity.z));

		//
		// check for collisions
		//

		// TODO I'd feel better if this used this.camera.rotation.x or the like instead of mouse position
		var theta = THREE.Math.degToRad(this.mouseX);
		var radius = sqrt( pow(2, this.velocity.x) + pow(2, this.velocity.z) );
		var right_angle = THREE.Math.degToRad(90);

		var impulse = new Vector3(
			(cos(theta)*-this.velocity.z + cos(theta+right_angle)*this.velocity.x)*delta,
			0,
			(sin(theta)*-this.velocity.z + sin(theta+right_angle)*this.velocity.x)*delta
		);

		var forward = impulse.clone().normalize().multiply(0.07*h("1 block"));

		var check = function(dir) {
			return lineTrace(
				position.clone().sub(new Vector3(0, character_height - 0.5*h("1 block"), 0)),
				dir
			);
		};

		// TODO allow sliding collisions

		if (check(forward)) {
			impulse = new Vector3(0, 0, 0);
		}

		position.add(impulse);

		//
		// orient the camera
		//

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) actualLookSpeed = 0;

		var verticalLookRatio = 1;

		if ( this.constrainVertical )
			verticalLookRatio = PI / ( this.verticalMax - this.verticalMin );

		this.lon = this.mouseX;
		if( this.lookVertical ) this.lat = -this.mouseY;

		this.lat = max( - 85, min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical )
			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		var targetPosition = this.lookTarget;

		this.lookTarget.x = position.x + h("1 block") * sin( this.phi ) * cos( this.theta );
		this.lookTarget.y = position.y + h("1 block") * cos( this.phi );
		this.lookTarget.z = position.z + h("1 block") * sin( this.phi ) * sin( this.theta );

		this.camera.lookAt( this.lookTarget );

		//
		// deal with vertical motion
		//

		var breath = 0.007 * sin((new Date()).getTime() * PI / 1000 / 4);

		var verticalPosition = (map.getHeight(position.x, position.z) + character_height + breath);

		if (this.velocity.y > 0) {
			this.camera.position.y += this.velocity.y * delta;

			this.velocity.y -= gravity * delta;
		} else if (!lineTrace(camera.position, new Vector3(0, -(character_height + 0.01), 0))) {
			this.velocity.y -= gravity * delta;

			this.camera.position.y += this.velocity.y * delta;
		} else {
			this.camera.position.y = verticalPosition;

			if (this.jump) {
				this.velocity.y += h("3 blocks") + gravity * 0.2;
				this.jump = false;
				this.canJump = false;
			} else {
				this.velocity.y = 0;
				this.canJump = true;
			}
		}
	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	//this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	//this.domElement.addEventListener( 'mouseup'  , bind( this, this.onMouseUp   ), false );
	this.domElement.addEventListener( 'keydown'  , bind( this, this.onKeyDown   ), false );
	this.domElement.addEventListener( 'keyup'    , bind( this, this.onKeyUp     ), false );

	// TODO why are we defining our own bind function?

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	}

	this.handleResize();
};
