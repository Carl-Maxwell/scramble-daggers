
window.gameStart = ((new Date).getTime())/1000;

window.Timer = function(duration) {
  this.start     = new timestamp;
  this.duration  = duration || 1;
  this.direction = -1;

  this.get = function() {
    return abs(clamp(this.start.distance() / this.duration, this.direction == -1 ? 0 : -1, this.direction == -1 ? 1 : 0));
  };

  this.reverse = function() {
    var progress = this.get();

    this.direction *= -1;

    this.start = new timestamp;

    this.start.value += this.direction * (this.duration * progress);

    return this;
  };

  this.setDuration = function(newDuration) {
    var oldDuration = this.duration;
    var progress    = this.get();
    var oldDistance = this.start.distance();

    this.start = new timestamp;

    this.start.value -= oldDistance/(oldDuration/newDuration);
    this.duration = newDuration;

    return this;
  };

  return this;
};

function timestamp() {
  this.value = (new Date).getTime()/1000 - window.gameStart;

  this.distance = function(then) {
    if (typeof then == "undefined") then = new timestamp;

    return then.value - this.value;
  }

  return this;
}

// TODO need some unit tests to make sure this is actually working right
