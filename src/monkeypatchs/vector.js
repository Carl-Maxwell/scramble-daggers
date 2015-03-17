
// not sure if it would be appropriate to use monkeypatch() on this

Vector3.prototype.round = Vector3.prototype.round || function() {
  this.x = round(this.x);
  this.z = round(this.z);
  this.y = round(this.y);

  return this;
};
