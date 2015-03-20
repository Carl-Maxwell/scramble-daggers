
monkeypatch(window, "clamp", function(val, low, high) {
  return min(high, max(low, val));
} );
