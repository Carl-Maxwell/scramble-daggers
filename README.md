Scrambledaggers
=============

A minecraft-style javascript WebGL game, built out of one of the *three.js*
examples.

[Live example](carlmaxwell.ninja/scramble-daggers/)

## Running it locally

`testserver/` provides a server to use for testing the game locally, it requires
nodejs (and a slew of nodejs modules)

to use it do:

```bash
cd testserver/
nodejs bin-http-server.js ./../
```

then you can access the game on http://localhost:8080

The code for the server comes from https://github.com/nodeapps/http-server

## Collision Detection Subsystems

## Core Libraries

### Rng

Seedrandom.js with a slightly modified API. Seedrandom provides an alternative
to Math.random. Because Math.random does not take a seed it isn't useful for
games of this sort.

Function            | Description
--------------------|---------------------
`window.Rng()`      | much the same as Math.random(), gives a number from 0 to 1
`window.Rng.seed()` | sets the seed for window.Rng()

### Fate

Provides a library for achieving random results with predictable qualities.

So, for example, if you want 1 out of 100 treasure chests to contain a magic
sword, you could do something like:

```javascript
var loot = ['a pretty penny'];

var fate = new Fate('1 in 100');
if (fate()) {
  loot.push('a magic sword');
}
```

I've also written up an explanation of why [Fate is useful](docs/random_chance_syntax_for_games.md)

### Ease

The [Human Readable Easing](http://canvasquery.com/playground-ease#0140)
function from CanvasQuery. Provided as `window.Ease`.

### Hinge

A utility library that converts real-world units into in-game units.

```javascript
var sphere = new Three.Sphere();
sphere.position = new Vector3(Hinge('1 block'), Hinge('2 blocks'), Hinge('1 block'));
```

Also provides the convenient alias `window.h()`. Prefer the use of the alias
when writing code.

### Timer

`Timer` is a poorly named library that provides a convenient countdown timer.

Method                                     | Description
-------------------------------------------|---------------------
`window.Timer(duration)`                   | constructor function
`Timer.prototype.get()`                    | get current time as percentage (as a number between 0 and 1)
`Timer.prototype.reverse()`                | reverse direction of timer
`Timer.prototype.setDuration(newDuration)` | change timer's duration

```javascript
if (isForwardKeyDown && !accelerating) {
  accelerating = true;
  timeSinceKeyhit.reverse();
  timeSinceKeyhit.setDuration(4);
} else if (!isForwardKeyDown && accelerating) {
  accelerating = false;
  timeSinceKeyhit.reverse();
  timeSinceKeyhit.setDuration(0.4);
}

var speed = Ease(timeSinceKeyhit.get(), "outSine");

this.velocity.x = speed * h("1 seconds walk") * direction.x;
```

#### window.Timestamp()

A simple timestamp utility. Presently only used by Timer internally.

Method                           | Description
---------------------------------|---------
`window.Timestamp()`             | constructor function
`Timestamp.prototype.value`      | member that records how many seconds since the game started this timestamp was created at
`Timestamp.prototype.distance()` | difference between two timestamps

## Attribution

This codebase was started from the minecraft AO demo for three js, and also
makes use of many js libraries (such as CanvasQuery and Seedrandom).
