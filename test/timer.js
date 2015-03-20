
window.currentTime = 0;

//function Date() {
//  this.getTime = function() { return window.currentTime; };
//};

//
// tests
//

(function() {
  window.currentTime += 1000*10;

  var x = new Timer(8);

  window.currentTime += 1000*2;

  x.reverse();
  x.setDuration(8);

})();

//
