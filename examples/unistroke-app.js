(function(){

var cvs = document.getElementById("canvas");
var svg = document.getElementById("shapes");

var ctx = cvs.getContext('2d'),
    recognizer = new DollarRecognizer(),
    last,
    mouseIsDown = false,
    points = [];

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
console.log(svg);
svg.style.width = window.innerWidth+'px';
svg.style.height = window.innerHeight+'px';

var laneWidth = cvs.width/8;

initializeCanvas();

function line(x0, y0, x1, y1, color){
    ctx.strokeStyle = color ? color: "blue";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}



function onMouseDown(event){
    event.preventDefault();
    event.stopPropagation();

    last = getLocalCoordinates(event);

    mouseIsDown = true;

    points.push( new Point(last.x, last.y) );
}

function onMouseMove(event){
    event.preventDefault();
    event.stopPropagation();

    if(!mouseIsDown){
        return;
    }

    var mouse = getLocalCoordinates(event);

    line(last.x, last.y, mouse.x, mouse.y);
    last = mouse;

    points.push( new Point(mouse.x, mouse.y) );

    //var matches = recognizer.Rank(points);
    //displayMatches(matches);
}

function onMouseUp(event){
    event.preventDefault();
    event.stopPropagation();

    mouseIsDown = false;

    var match = recognizer.Recognize(points);

    if ( match.Name === "rectangle" || match.Name === "circle" ) {
        var left = Number.MAX_VALUE;
        var top = Number.MAX_VALUE;
        var right = -Number.MAX_VALUE;
        var bottom = -Number.MAX_VALUE;

        for(var i = 0; i<points.length;i++){
            left = Math.min(points[i].X, left);
            right = Math.max(points[i].X, right);
            top = Math.min(points[i].Y, top);
            bottom = Math.max(points[i].Y, bottom);
        }


        if( match.Name === "rectangle" ) {
            var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
            rect.setAttribute('x', left);
            rect.setAttribute('y', top);
            rect.setAttribute('width', (right-left));
            rect.setAttribute('height', (bottom-top));
            document.getElementById('shapes').appendChild(rect);
        } else {
            var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            var maxDim = Math.max( right - left, bottom - top );

            circle.setAttribute('cx', (left+right)/2 );
            circle.setAttribute('cy', (top+bottom)/2 );
            circle.setAttribute('r', (maxDim/2));
            document.getElementById('shapes').appendChild(circle);
        }
    }

    console.log(match);

    // Draw final normalized unistroke
    var strokes = new Unistroke("triangle", points);
    drawPointCloud(strokes.Points, 0, 0, 1.0, "red");


    // Clear canvas, points, etc
    reset(event);
}

function onTouchStart(event){
    event.clientX = event.changedTouches[0].clientX;
    event.clientY = event.changedTouches[0].clientY;
    onMouseDown(event);
}

function onTouchMove(event){
  event.clientX = event.changedTouches[0].clientX;
  event.clientY = event.changedTouches[0].clientY;
  onMouseMove(event);
}

function onTouchEnd(event){
  onMouseUp(event);
}

var targetElement = document;//cvs;

targetElement.addEventListener("mousedown", onMouseDown, false);
targetElement.addEventListener("mousemove", onMouseMove, false);
targetElement.addEventListener("mouseup", onMouseUp, false);
targetElement.addEventListener("touchstart", onTouchStart, false);
targetElement.addEventListener("touchmove", onTouchMove, false);
targetElement.addEventListener("touchend", onTouchEnd, false);

function reset(event){
    event.preventDefault();
    event.stopPropagation();

    points = [];

    // Clear our matched display info
    initializeCanvas();
}

document.addEventListener("keydown", function(event){
    if( event.keyCode === 32 ) {
        reset(event);
    }
}, false);

function initializeCanvas(){
    ctx.clearRect(0,0,cvs.width, cvs.height);

    // Draw all the set of shapes
    var i;
    for(i = 0; i<recognizer.Unistrokes.length; i++ ){
        drawPointCloud(recognizer.Unistrokes[i].Points, 100+(i%8)*laneWidth, 380+Math.floor(i/8)*laneWidth, laneWidth*0.001, "#9f9fff");
    }
}

function getLocalCoordinates(event){
    return {
      x: event.clientX - cvs.offsetLeft + window.scrollX,
      y: event.clientY - cvs.offsetTop + window.scrollY,
    };
}

function getShade(score){
  return "rgb("+ Math.floor((1.0-score)*255) +", "+ Math.floor((1.0-score)*255) +", "+ Math.floor((1.0-score)*255) +")";
}

function getPointCloud(name){
  var i, points;

  // Find the point cloud based on the supplied name
  for( i = 0; i<recognizer.PointClouds.length; i++){
      if(recognizer.PointClouds[i].Name === name){
          points = recognizer.PointClouds[i].Points;
          break;
      }
  }
  return points;
}

function drawPointCloud(points, x, y, scale, color){
    var i;

    for( i = 1; i< points.length; i++){
        line(
          points[i-1].X * scale + x + scale/2,
          points[i-1].Y * scale + y + scale/2,
          points[i].X * scale + x + scale/2,
          points[i].Y * scale + y + scale/2,
          color
        );
    }
}

})();
