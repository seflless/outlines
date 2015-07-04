(function(){

var cvs = document.getElementById("cvs"),
    ctx = cvs.getContext('2d'),
    recognizer = new outlines.Recognizer();

cvs.width = 800;
cvs.height = 800;

ctx.fillStyle = "black";
ctx.fillRect(0,0,cvs.width, cvs.height);

function line(x0, y0, x1, y1, color){
    ctx.strokeStyle = color ? color: "white";
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
}

var lastX = 0,
    lastY = 0,
    mouseIsDown = false,
    points = [],
    strokeId = 0;

document.addEventListener("mousedown", function(event){
    lastX = event.clientX;
    lastY = event.clientY;

    mouseIsDown = true;

    strokeId++;

    points.push( new outlines.Point(lastX, lastY, strokeId) );
}, false);

document.addEventListener("mousemove", function(){
    if(!mouseIsDown){
        return;
    }
    line(lastX, lastY, event.clientX, event.clientY);

    lastX = event.clientX;
    lastY = event.clientY;

    points.push( new outlines.Point(lastX, lastY, strokeId) );

    var matches = recognizer.Rank(points);
    displayMatches(matches);
}, false);

document.addEventListener("mouseup", function(){
    mouseIsDown = false;
}, false);

document.addEventListener("keydown", function(event){
    if( event.keyCode === 32 ) {
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,cvs.width, cvs.height);

        var result = recognizer.Recognize(points);
        console.log( "Result: " + result.Name + " (" + result.Score.toFixed(2) + ")." );
        points = [];
        strokeId = 0;

        displayMatches([]);

        event.preventDefault();
    }
}, false);

function displayMatches(matches){
  var laneWidth = 100,
      adjustedWidth = Math.floor(laneWidth * 1.2);
  // Clear background of shapes
  ctx.fillRect(cvs.width-adjustedWidth,0,adjustedWidth, cvs.height);

  var matchesElem = document.getElementById('matches'),
      output = "<div>",
      i,
      rank;

  for(i = 0; i<matches.length; i++) {

      rank = matches[i].Score.toFixed(2)*100;

      if(rank>1){
          // Render Canvas Shape Feedback
          drawPointCloud(matches[i].Name, cvs.width-laneWidth, 10+ i * laneWidth * 1.2, laneWidth, getShade(matches[i].Score) );

          // Render DOM UI
          output += "<span>'" + matches[i].Name + "' : " + (rank.toFixed(1)) + "</span></br>";
      }
  }
  output += "</div>";
  matchesElem.innerHTML = output;

}

function getShade(score){
  return "rgb("+ Math.floor(score*255) +", "+ Math.floor(score*255) +", "+ Math.floor(score*255) +")";
}

function drawPointCloud(name, x, y, scale, color){
    var i, points;
    // Find the point cloud based on the supplied name
    for( i = 0; i<recognizer.PointClouds.length; i++){
        if(recognizer.PointClouds[i].Name === name){
            points = recognizer.PointClouds[i].Points;
            break;
        }
    }
    if( !points ){
        return;
    }

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
