## Overview
Recognize drawn shapes based on their point clouds.

**Demos:**
 - [Point Cloud](http://francoislaberge.com/outlines/point-cloud/).
 - [Unistroke](http://francoislaberge.com/outlines/unistroke/).

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

## Coming Soon
Support for more recognizers will be added soonish. Here's a sneak peak:
  - Work in progress: [Unistroke Recognizer](http://francoislaberge.com/outlines/examples/unistroke.html).
  - Want to add the GRAIL system to this as well
    - https://jackschaedler.github.io/handwriting-recognition/
    - See [Video](https://www.youtube.com/watch?v=p2LZLYcu_JY&feature=youtu.be&t=24m30s) for motivation
  - Talk to Ken Perlin and ask what he's using for Chalktalk
  - Some notes related to the history of hand writing recognition
    - http://www.osnews.com/story/26838/Palm_I_m_ready_to_wallow_now/page2/

Experiments I'd like to make:
  - Try reusing icon sets such as [FontAwesome](http://fontawesome.io/icons/), as starting points.
    - Related: Allow SVG and fonts as potential sources?
        - For SVG: Try: http://helpfulsheep.com/2015-03-25-converting-svg-fonts-to-svg/
