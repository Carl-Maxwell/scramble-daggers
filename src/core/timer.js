
window.gameStart = ((new Date()).getTime())/1000;

window.Timer = function(duration) {
	this.start     = new Timestamp();
	this.duration  = duration || 1;
	this.direction = -1;

	return this;
};

window.Timer.prototype.restart = function() {
	this.start.set();
};

window.Timer.prototype.get = function() {
	return abs(clamp(
		this.start.distance() / this.duration,
		this.direction == -1 ? 0 : -1,
		this.direction == -1 ? 1 : 0
	));
};

window.Timer.prototype.reverse = function() {
	var progress = this.get();

	this.direction *= -1;

	this.start = new Timestamp();

	this.start.value += this.direction * (this.duration * progress);

	return this;
};

window.Timer.prototype.setDuration = function(newDuration) {
	var oldDuration = this.duration;
	var progress    = this.get();
	var oldDistance = this.start.distance();

	this.start = new Timestamp();

	this.start.value -= oldDistance/(oldDuration/newDuration);
	this.duration = newDuration;

	return this;
};

window.Timestamp = function() {
	this.set();

	return this;
};

window.Timestamp.prototype.set = function() {
	this.value = (new Date()).getTime()/1000 - window.gameStart;
};

window.Timestamp.prototype.distance = function(then) {
	if (typeof then == "undefined") then = new Timestamp();

	return then.value - this.value;
};

// TODO need some unit tests to make sure this is actually working right
