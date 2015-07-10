(function(){

var width = 320,
    height = 480,
    laneWidth = width/8,
    cvs = document.getElementById("canvas"),
    ctx = cvs.getContext('2d'),
    recognizer = new outlines.Recognizer();

cvs.width = width;
cvs.height = height;

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

var last = {
      x: 0,
      y: 0
    },
    lastY = 0,
    mouseIsDown = false,
    points = [],
    strokeId = 0;

function onMouseDown(event){
    event.preventDefault();
    event.stopPropagation();

    last = getLocalCoordinates(event);

    mouseIsDown = true;

    strokeId++;

    points.push( new outlines.Point(last.x, last.y, strokeId) );
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

    points.push( new outlines.Point(mouse.x, mouse.y, strokeId) );

    var matches = recognizer.Rank(points);
    displayMatches(matches);
}

function onMouseUp(event){
    event.preventDefault();
    event.stopPropagation();

    mouseIsDown = false;
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

cvs.addEventListener("mousedown", onMouseDown, false);
cvs.addEventListener("mousemove", onMouseMove, false);
cvs.addEventListener("mouseup", onMouseUp, false);

cvs.addEventListener("touchstart", onTouchStart, false);
cvs.addEventListener("touchmove", onTouchMove, false);
cvs.addEventListener("touchend", onTouchEnd, false);

var cancelButton = document.getElementById('cancel');
cancelButton.addEventListener("touchstart", reset, false);
cancelButton.addEventListener("mousedown", reset, true);

function reset(event){
    event.preventDefault();
    event.stopPropagation();

    var result = recognizer.Recognize(points);
    points = [];
    strokeId = 0;

    // Clear our matched display info
    initializeCanvas();
    document.getElementById('matches').innerHTML = "";
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
    for(i = 0; i<recognizer.PointClouds.length; i++ ){
        drawPointCloud(recognizer.PointClouds[i].Points, (i%8)*laneWidth, 380+Math.floor(i/8)*laneWidth, laneWidth*0.9, "#9f9fff");
    }
}

function displayMatches(matches){
  var adjustedWidth = Math.floor(laneWidth * 1.2);
  // Clear background of shapes
  ctx.clearRect(cvs.width-adjustedWidth,0,adjustedWidth, 370);

  if(matches.length){
    drawPointCloud(outlines.Normalize(points), cvs.width-laneWidth, 300, laneWidth, "red");
  }

  var matchesElem = document.getElementById('matches'),
      output = "<div>",
      i,
      rank;

  for(i = 0; i<matches.length; i++) {

      rank = matches[i].Score.toFixed(2)*100;

      if(rank>1){
          // Render Canvas Shape Feedback
          drawPointCloud(
              getPointCloud(matches[i].Name),
              cvs.width-laneWidth,
              10+ i * laneWidth * 1.2,
              laneWidth,
              getShade(matches[i].Score) );

          // Render DOM UI
          output += "<span>'" + matches[i].Name + "' : " + (rank.toFixed(1)) + "</span></br>";
      }
  }
  output += "</div>";
  matchesElem.innerHTML = output;

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
        // Draw from the previous point to this point so long as they have the same
        // stroke id
        if( points[i-1].ID === points[i].ID ) {
            line(
              points[i-1].X * scale + x + scale/2,
              points[i-1].Y * scale + y + scale/2,
              points[i].X * scale + x + scale/2,
              points[i].Y * scale + y + scale/2,
              color
            );
        }
    }
}

})();
