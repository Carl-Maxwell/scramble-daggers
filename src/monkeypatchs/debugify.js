
monkeypatch(Object.prototype, "debugify", function() {
  // TODO can Object.getPrototypeOf be used to get the name of what this is a prototype of?
  return JSON.stringify(this); // this + Object.getOwnPropertyNames(this);
} );

