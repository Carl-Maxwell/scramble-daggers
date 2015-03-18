
// this isn't really a monkeypatch,
//   it's a utility that *enables* monkeypatching

window.monkeypatch = function(obj, key, patch) {
	// snatched this code from MDN. Like a ninja.

	function withValue(value) {
		var d = withValue.d || (
			withValue.d = {
				enumerable: false,
				writable: false,
				configurable: false,
				value: value
			}
		);
		d.value = value;
		return d;
	}

	Object.defineProperty(obj, key, withValue(patch));
};

