
// not sure if it would be appropriate to use monkeypatch() on these

Vector3.prototype.round = Vector3.prototype.round || function() {
	this.x = round(this.x);
	this.y = round(this.y);
	this.z = round(this.z);

	return this;
};

//
// modify all the vector3 math functions to accept vector3s or scalars as arguments
//

Vector3.prototype.add = function ( v, w ) {
	if ( w !== undefined ) {
		console.warn( 'DEPRECATED: Vector3\'s .add() now only accepts one argument. Use .addVectors( a, b ) instead.' );
		return this.addVectors( v, w );
	}

	this.x += typeof v.x != "undefined" ? v.x : v;
	this.y += typeof v.y != "undefined" ? v.y : v;
	this.z += typeof v.z != "undefined" ? v.z : v;

	return this;
};

Vector3.prototype.divide = function(v) {
		this.x /= v.x || v;
		this.y /= v.y || v;
		this.z /= v.z || v;

		return this;
};

Vector3.prototype.multiply = function(v, w) {
	if ( w !== undefined ) {
		console.warn( 'DEPRECATED: Vector3\'s .multiply() now only accepts one argument. Use .multiplyVectors( a, b ) instead.' );
		return this.multiplyVectors( v, w );
	}

	this.x *= typeof v.x != "undefined" ? v.x : v;
	this.y *= typeof v.y != "undefined" ? v.y : v;
	this.z *= typeof v.z != "undefined" ? v.z : v;

	return this;
};

Vector3.prototype.subtract = function ( v, w ) {
	if ( w !== undefined ) {
		console.warn( 'DEPRECATED: Vector3\'s .sub() now only accepts one argument. Use .subVectors( a, b ) instead.' );
		return this.subVectors( v, w );
	}

	this.x -= typeof v.x != "undefined" ? v.x : v;
	this.y -= typeof v.y != "undefined" ? v.y : v;
	this.z -= typeof v.z != "undefined" ? v.z : v;

	return this;
};

//
// Helper function for translating from spherical to euclidian coordinates
//

Vector3.prototype.setFromTheta = function(theta, xFactor, zFactor) {
	var right_angle = THREE.Math.degToRad(90);

	if (typeof xFactor == "undefined") xFactor = 1.0;
	if (typeof zFactor == "undefined") zFactor = 1.0;

	return this.set(0, 0, 0).add(new Vector3(
		cos(theta)*-zFactor + cos(theta+right_angle)*xFactor,
		0,
		sin(theta)*-zFactor + sin(theta+right_angle)*xFactor
	));
};

//
// pitch, yaw, roll
//

// Vector3.prototype.pitch = function(val) {
// 	if (typeof val != "undefined") return this.x = val;
//
// 	return this.x;
// };
//
// Vector3.prototype.yaw = function(val) {
// 	if (typeof val != "undefined") return this.y = val;
//
// 	return this.y;
// };
//
// Vector3.prototype.roll = function(val) {
// 	if (typeof val != "undefined") return this.z = val;
//
// 	return this.z;
// };
