(function(){

var cvs = document.getElementById("cvs"),
    ctx = cvs.getContext('2d'),
    recognizer = new outlines.Recognizer();

cvs.width = 800;
cvs.height = 800;

ctx.fillStyle = "black";
ctx.fillRect(0,0,cvs.width, cvs.height);

function line(x0, y0, x1, y1){
    ctx.strokeStyle = "white";
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

        event.preventDefault();
    }
}, false);

})();
