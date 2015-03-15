/**
 * @author mrdoob / http://mrdoob.com/
 * @author alteredq / http://alteredqualia.com/
 * @author paulirish / http://paulirish.com/
 */

THREE.FirstPersonControls = function ( object, domElement ) {

	var min   = Math.min,
	    max   = Math.max,
	    round = Math.round,
	    PI    = Math.PI,
	    sin   = Math.sin,
	    cos   = Math.cos,
	    abs   = Math.abs;

	this.object = object;
	this.target = new THREE.Vector3( 0, 0, 0 );

	this.domElement = ( domElement !== undefined ) ? domElement : document;

	this.movementSpeed = 0.001;
	this.lookSpeed = 0.005;

	this.lookVertical = true;
	this.autoForward  = false;
	// this.invertVertical = false;

	this.activeLook = true;

	this.heightSpeed = false;
	this.heightCoef  = 1.0;
	this.heightMin   = 0.0;
	this.heightMax   = 1.0;

	this.constrainVertical = false;
	this.verticalMin = 0;
	this.verticalMax = Math.PI;

	this.mouseX = 0;
	this.mouseY = 0;
	this.mouseSensitivity = 0.5;

	this.lat   = 0;
	this.lon   = 0;
	this.phi   = 0;
	this.theta = 0;

	this.moveForward  = false;
	this.moveBackward = false;
	this.moveLeft     = false;
	this.moveRight    = false;
	this.freeze       = false;

	this.velocity = {x: 0, y: 0, z: 0};

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

		var t = (new Date()).getTime();

		switch ( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = this.moveForward || t; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = this.moveLeft || t; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = this.moveBackward || t; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = this.moveRight || t; break;

			case 82: /*R*/ this.moveUp = this.moveRight || t; break;
			case 70: /*F*/ this.moveDown = this.moveDown || t; break;

			case 81: /*Q*/ this.freeze = !this.freeze; break;

		}

	};

	this.onKeyUp = function ( event ) {

		switch( event.keyCode ) {

			case 38: /*up*/
			case 87: /*W*/ this.moveForward = false; break;

			case 37: /*left*/
			case 65: /*A*/ this.moveLeft = false; break;

			case 40: /*down*/
			case 83: /*S*/ this.moveBackward = false; break;

			case 39: /*right*/
			case 68: /*D*/ this.moveRight = false; break;

			case 82: /*R*/ this.moveUp = false; break;
			case 70: /*F*/ this.moveDown = false; break;

		}

	};

	this.update = function( delta ) {

		if ( this.freeze ) return;

		var position = this.object.position;

		var moveSpeed = function(timestamp) {
			if (timestamp == false) return 0;
		
			return sin(min(3000, (new Date()).getTime() - timestamp)/3000 * (PI/2))*6 * 60;
		};
		
		var decelerateSpeed = function(speed) {
			if (abs(speed) < 0.01) return 0;
		
			//speed = max(-6, min(6, speed));
		
			return speed * 0.9;//sin(0.6 * (speed/6) * (PI/2))*6 * 60;
		};
		
		//console.log(this.object.rotation);
		
		var isValid = function(xChange, yChange, zChange) {
			var round = Math.round,
			    abs   = Math.abs;
			//typeof xChange == "undefined" ? xChange = 0 : '';
			//typeof yChange == "undefined" ? yChange = 0 : '';
			//typeof zChange == "undefined" ? zChange = 0 : '';

			return true;

			var x = position.x + 100 * Math.sin( this.object.rotation.z ) * Math.cos( this.object.rotation.x ),
			    z = position.z + 100 * Math.sin( this.object.rotation.z ) * Math.sin( this.object.rotation.x );

			return round(
				getY(
					round(x / 100 + worldHalfWidth) ,
					round(z / 100 + worldHalfDepth)
				)
			) < round(position.y/100)+1;
		};

		//console.log(this.velocity);

		this.velocity.x = decelerateSpeed(this.velocity.x);
		this.velocity.y = decelerateSpeed(this.velocity.y);
		this.velocity.z = decelerateSpeed(this.velocity.z);

		//console.log(this.velocity);

		if ( this.moveForward  && !this.moveBackward ) this.velocity.z  = -moveSpeed(this.moveForward );
		if ( this.moveBackward && !this.moveForward  ) this.velocity.z  =  moveSpeed(this.moveBackward);

		if ( this.moveLeft    && !this.moveRight     )  this.velocity.x = -moveSpeed(this.moveLeft    );
		if ( this.moveRight   && !this.moveLeft      )  this.velocity.x =  moveSpeed(this.moveRight   );

		//if ( this.moveUp      && !this.moveDown      )  this.velocity.y =  moveSpeed(this.moveUp      );
		//if ( this.moveDown    && !this.moveUp        )  this.velocity.y = -moveSpeed(this.moveDown    );

		if (isValid.apply(this, [this.velocity.x, this.velocity.y, this.velocity.z])) {
			this.object.translateZ( this.velocity.z * delta );
			this.object.translateX( this.velocity.x * delta );
			//this.object.translateY( this.velocity.y * delta);//this is redundant

			var yaw = this.object.rotation.x, pitch = this.object.rotation.z;

			//this.object.position.x += 1 * Math.sin( pitch ) * Math.cos( yaw );
			//this.object.position.z += 1 * Math.sin( pitch ) * Math.sin( yaw );

		}

		//console.log( { x: this.velocity.x * delta, z: this.velocity.z * delta } )

		var actualLookSpeed = delta * this.lookSpeed;

		if ( !this.activeLook ) actualLookSpeed = 0;

		var verticalLookRatio = 1;

		if ( this.constrainVertical )
			verticalLookRatio = Math.PI / ( this.verticalMax - this.verticalMin );

		//while (abs(this.mouseX) > 180)
		//	this.mouseX -= (this.mouseX > 0 ? 180 : -180);

		this.lon = this.mouseX; //+= this.mouseX * actualLookSpeed;
		if( this.lookVertical ) this.lat = -this.mouseY; //-= this.mouseY * actualLookSpeed * verticalLookRatio;

		this.lat = Math.max( - 85, Math.min( 85, this.lat ) );
		this.phi = THREE.Math.degToRad( 90 - this.lat );

		this.theta = THREE.Math.degToRad( this.lon );

		if ( this.constrainVertical )
			this.phi = THREE.Math.mapLinear( this.phi, 0, Math.PI, this.verticalMin, this.verticalMax );

		var targetPosition = this.target;

		//while (this.theta > Math.PI) this.theta -= Math.PI; 

		//position.x += -sin( -this.theta );
		//position.z +=  cos( -this.theta );

		targetPosition.x = position.x + 100 * Math.sin( this.phi ) * Math.cos( this.theta );
		targetPosition.y = position.y + 100 * Math.cos( this.phi );
		targetPosition.z = position.z + 100 * Math.sin( this.phi ) * Math.sin( this.theta );

		this.object.lookAt( targetPosition );
		
		var round = Math.round;
	
		var height = (getY(round(position.x/100 + worldHalfWidth), round(position.z/100 + worldHalfDepth)) + 1) * 100;

		//TODO just don't move it on Y to begin with instead of clamping it after moving it
		this.object.position.y = THREE.Math.clamp( this.object.position.y, height, height );

	};

	this.domElement.addEventListener( 'contextmenu', function ( event ) { event.preventDefault(); }, false );

	this.domElement.addEventListener( 'mousemove', bind( this, this.onMouseMove ), false );
	//this.domElement.addEventListener( 'mousedown', bind( this, this.onMouseDown ), false );
	//this.domElement.addEventListener( 'mouseup'  , bind( this, this.onMouseUp   ), false );
	this.domElement.addEventListener( 'keydown'  , bind( this, this.onKeyDown   ), false );
	this.domElement.addEventListener( 'keyup'    , bind( this, this.onKeyUp     ), false );

	function bind( scope, fn ) {
		return function () {
			fn.apply( scope, arguments );
		};
	};

	this.handleResize();

};
