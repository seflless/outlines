(function(){

var cvs = document.getElementById("cvs"),
    ctx = cvs.getContext('2d');

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
    mouseIsDown = false;
document.addEventListener("mousedown", function(event){
    lastX = event.clientX;
    lastY = event.clientY;

    mouseIsDown = true;
}, false);

document.addEventListener("mousemove", function(){
    if(!mouseIsDown){
        return;
    }
    line(lastX, lastY, event.clientX, event.clientY);

    lastX = event.clientX;
    lastY = event.clientY;
}, false);

document.addEventListener("mouseup", function(){
    mouseIsDown = false;
}, false);

})();
