# Todo
  - Make a cool chalktalk like system
  - Make a cool demo with the following shapes an accompanying Category Theory / Basic Vectors system
    - Points (circular outline with mostly filled in inside, makes for an interesting mixed style matching system)
    - Circles
    - Lines
      - With Arrow Head Modifier
    - Scratch out
    - Transform? (Arrow head could be this sorta)
    - Subgroups (via encircling existing shapes)
      - Squares/rects have one semantics
      - Arbitrary paths another
    - Is there a different between a transform and a state change? (Not really, or Category morphism)
    - Note (corner cut off rect)
    - Text (speech bubble? or just a T)
    - Ruler (line with two small parallel lines at the end)
  - Narrowing system where you draw the basic gist of the icon, which auto suggests possible refinements
    - User can then refine it further with more strokes, think happy face versus sad face (circle stroke then upside down or right side up frown)
  - Add support for more recognizers
    - [UnistrokeRecognizer](http://depts.washington.edu/aimgroup/proj/dollar/)
    - [MultiStrokeRecognizer](http://depts.washington.edu/aimgroup/proj/dollar/ndollar.html)
    - [Grail's](https://jackschaedler.github.io/handwriting-recognition/)
    - Rename existing Recognizer to PointCloudRecognizer
    - Add other historical ones?
      - [Palm Graffiti](https://en.wikipedia.org/wiki/Graffiti_(Palm_OS))
    - Make sure to credit everyone and everything with well thought out traces
    - Read through the papers too
   - Use reverse projection plus something like Office Lens or Dropbox's scanner to convert any piece of paper and pen into a gesture converter
     - Like this, but more useful:
       - https://www.youtube.com/watch?v=RApLjEDXDcA



# Old Todo
  - More rese
  - [ ] Figure out if we can support scale (already working?, well x/y aren't independent) and rotation invariance
  - [x] Make a demo that shows top guesses as you are drawing
  - [ ] Document the API
  - [ ] Create demos and explanation
    - [ ] Article: Understanding the algorithm, it's limits, extending it (See Rotation Invariance), and work arounds
    - [ ] Demo: Basic flow chart tool with modeless gesture based object and connection interface
      - [ ] Support squares, rectangles,
    - [ ] Demo: Rotation invariance and auto complete on the screen (some of this will be figured out from flowchart tool)
    - [ ] Demo: Dynamic Drawing (Bret Victor) style sequencer?
    - [ ] Demo: Extendible system like Chalk Talk (Ken Perlin)?
    - Auto draw that is extendible would be cool, see: http://www.wired.com/2015/10/microsofts-badass-new-tool-is-like-autocomplete-for-drawing/
