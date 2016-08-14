## Overview
Recognize drawn shapes based on their point clouds.

See [Point Cloud Demo](http://francoislaberge.com/outlines/examples/point-cloud.html).

## Installation

    npm install outlines

## Usage

```js
var outlines = require('outlines'),
    recognizer = outlines.Recognizer(),
    Point = outlines.Point,
    gesture = [];

// Create an array of the points making up a gesture you want to find
// a match for.
// new Point(x, y, strokeId)
// strokeId should be incremented for each new stroke. Ie. If a user lifts and
// touches/mouses down again each subsequent stream of points is a separate stroke
gesture.push(new Point(0, 0, 0))
gesture.push(new Point(10, 10, 0))
gesture.push(new Point(20, 20, 0));

gesture.push(new Point(40, 40, 1));
gesture.push(new Point(50, 50, 1));
gesture.push(new Point(60, 60, 1));

// Get a list in ranked (closest to furthest match)
// Note: For now there is a built in set of symbols. You could replace a recognizers
// set of symbols though, see the implementation to figure out how:
// https://github.com/francoislaberge/outlines/blob/master/src/outlines.js#L107-L152
var matches = recognizer.Rank(gesture);
console.log(matches);
```

## References
  - Based on the **$P Point-Cloud Recognizer** research paper
    - [$P project page](http://depts.washington.edu/aimgroup/proj/dollar/pdollar.html)
    - [PDF of paper](http://faculty.washington.edu/wobbrock/pubs/icmi-12.pdf)
    - [Pseudo Code](http://depts.washington.edu/aimgroup/proj/dollar/pdollar.pdf)
