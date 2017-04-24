(function(){

var cvs = document.getElementById("canvas");
var svg = document.getElementById("shapes");
var dot = document.getElementById("dot");

var graph = {
    nodes: [
        /*{
            id: "circle",
            shape: "circle",
            text: "Circle"
        },
        {
            id: "rectangle",
            shape: "rectangle",
            text: "Rectangle"
        }*/
    ],
    edges: [
        /*["circle", "rectangle"],
        ["rectangle", "circle"]*/
    ]
}

var ctx = cvs.getContext('2d'),
    recognizer = new DollarRecognizer(),
    last,
    mouseIsDown = false,
    points = [];

cvs.width = window.innerWidth;
cvs.height = window.innerHeight;
svg.style.width = window.innerWidth+'px';
svg.style.height = window.innerHeight+'px';

var laneWidth = cvs.width/8;

initializeCanvas();

function line(x0, y0, x1, y1, color, thickness){
    thickness = thickness || 3;
    ctx.strokeStyle = color ? color: "blue";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = thickness;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

function rect(x, y, width, height, color){
    ctx.fillStyle = ctx.strokeStyle = color ? color: "blue";
    ctx.fillRect(x, y, width, height);
}

function circle(x0, y0, radius, color){
    ctx.fillStyle = ctx.strokeStyle = color ? color: "blue";
    ctx.beginPath();
    ctx.arc(x0, y0, radius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
}

let startNode = null;
function onMouseDown(event){
    event.preventDefault();
    event.stopPropagation();

    startNode = eventToNodeId(event);

    last = getLocalCoordinates(event);

    mouseIsDown = true;

    points.push( new Point(last.x, last.y) );
}

function eventToNodeId(event){
    if(graph.nodes.length <= 1){
        return null;
    }
    console.log(event.target.tagName, event.target.id);
    if(event.target.tagName === "text"){
        return event.target.parentNode.id;
    } else if(event.target.tagName === "polygon"){
        return event.target.nextElementSibling.id;
    }

    return null;
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

    drawFeedback();
    //var matches = recognizer.Rank(points);
    //displayMatches(matches);
}

function getColor(){
    //return "rgb(" + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ", " + Math.floor(Math.random()*255) + ")";
    return "#9f9fff";
}

function onMouseUp(event){
    event.preventDefault();
    event.stopPropagation();

    mouseIsDown = false;

    var match = recognizer.Recognize(points);
    var ranks = recognizer.Rank(points);

    /*console.log('--------------');
    ranks.forEach( (result) => {
        console.log(result.Name + ": " + result.Score.toFixed(3));
    });
    */
    //console.log(JSON.stringify(ranks, null, '  ') );

    if ( match.Score > 0.70 ) {
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

        switch( match.Name ) {
            case "rectangle":
            case "square":
                var rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
                rect.setAttribute('x', left);
                rect.setAttribute('y', top);
                rect.setAttribute('width', (right-left));
                rect.setAttribute('height', (bottom-top));
                rect.setAttribute('stroke', getColor() );
                rect.setAttribute('stroke-width', 2);
                document.getElementById('shapes').appendChild(rect);
                break;
            case "circle":
                var circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                var maxDim = Math.max( right - left, bottom - top );

                circle.setAttribute('cx', (left+right)/2 );
                circle.setAttribute('cy', (top+bottom)/2 );
                circle.setAttribute('r', (maxDim/2));
                circle.setAttribute('stroke', getColor() );
                circle.setAttribute('stroke-width', 2);
                document.getElementById('shapes').appendChild(circle);
                break;
            case "line":
                var line = document.createElementNS("http://www.w3.org/2000/svg", "line");
                line.setAttribute('x1', points[0].X);
                line.setAttribute('y1', points[0].Y);
                line.setAttribute('x2', points[ points.length - 1 ].X);
                line.setAttribute('y2', points[ points.length - 1 ].Y);
                line.setAttribute('stroke', getColor() );
                line.setAttribute('stroke-width', 2);
                document.getElementById('shapes').appendChild(line);
                break;
        }
    }

    console.log(match.Name + ": " + match.Score.toFixed(2) );


    //console.log(JSON.stringify(points));

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

var bubble = true;
targetElement.addEventListener("mousedown", onMouseDown, bubble);
targetElement.addEventListener("mousemove", onMouseMove, bubble);
targetElement.addEventListener("mouseup", onMouseUp, bubble);
targetElement.addEventListener("touchstart", onTouchStart, bubble);
targetElement.addEventListener("touchmove", onTouchMove, bubble);
targetElement.addEventListener("touchend", onTouchEnd, bubble);

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
    // var i;
    // for(i = 0; i<recognizer.Unistrokes.length; i++ ){
    //     drawPointCloud(recognizer.Unistrokes[i].Points, 100+(i%8)*laneWidth, 380+Math.floor(i/8)*laneWidth, laneWidth*0.001, "#9f9fff");
    // }
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

function clonePoints(points){
    var cloned = [];

    points.forEach( (point) => {
        cloned.push( new Point(point.X, point.Y) );
    });
    return cloned;
}

function drawFeedback(){
    return;
    if ( points.length <= 1 ) {
        return;
    }

    ctx.clearRect(0, 0, laneWidth*1.2, laneWidth*1.2 );

    var unistroke = new Unistroke("", clonePoints(points) );
    drawPointCloud(unistroke.Points, 100, 100, laneWidth*0.001, "#9f9fff");
}

function drawPointCloud(points, x, y, scale, color){
    var i;

    for( i = 1; i< points.length; i++){
        var x0 = points[i-1].X * scale + x + scale/2;
        var y0 = points[i-1].Y * scale + y + scale/2;
        var x1 = points[i].X * scale + x + scale/2;
        var y1 = points[i].Y * scale + y + scale/2;
        line( x0, y0, x1, y1, color, 1 );

        // Draw arrow
        if( i === 1 || !(i%4) || i === (points.length-1) ) {
            var diffX = x1 - x0;
            var diffY = y1 - y0;
            var len = Math.sqrt( diffX*diffX + diffY*diffY );
            if(!len) {
                len = 0.00001;
            }
            diffX /= len;
            diffY /= len;

            var arrowHeadSize = 5;
            // Left Orthogonal
            line( x1, y1, x1 - diffY * arrowHeadSize - diffX*arrowHeadSize , y1 + diffX * arrowHeadSize - diffY*arrowHeadSize, color, 1 );
            line( x1, y1, x1 + diffY * arrowHeadSize - diffX*arrowHeadSize, y1 - diffX * arrowHeadSize - diffY*arrowHeadSize, color, 1 );
        }

    }

    circle(
        points[0].X * scale + x + scale/2,
        points[0].Y * scale + y + scale/2,
        3, color);
}


let idCounter = 0;
function id(){
    return 'node'+(idCounter++).toString();
}

})();
