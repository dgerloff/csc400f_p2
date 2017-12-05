// Mouse handling from: http://learningwebgl.com/blog/?p=1253
// NOTE - NOTE - NOTE:  this link uses an older version of glmatrix and
// as such, will not run properly. This code has been modified to work
// with the library version we're using.

//document.onmousedown = handleMouseDown;
//document.onmouseup = handleMouseUp;
//document.onmousemove = handleMouseMove;

function InitializeMouseOverElement(element_name)
{
	document.getElementById(element_name).onmousedown = handleMouseDown;
	document.getElementById(element_name).onmouseout = handleMouseUp;
	document.getElementById(element_name).onmouseup = handleMouseUp;
	document.getElementById(element_name).onmousemove = handleMouseMove;
        console.log("mouse initialized");
}

var mouseDown = false;
var lastMouseX = null;
var lastMouseY = null;

var camera = {
	current:{
		x:0,
		y:0,
		z:0
	},
	start:{
		x:-120,
		y:32,
		z:-0
	},
	rotation: null
}
function ResetCameraPosition(){
	camera["current"] = JSON.parse(JSON.stringify(camera['start']));
	camera["rotation"] = mat4.create();
}
ResetCameraPosition();

document.addEventListener('keydown',function(e){
    switch(e.keyCode){
        case 67:
			ResetCameraPosition();
			break;
		case 38:
			camera["current"]["y"] += 1;
			if(camera["current"]["y"] > 40){
				camera["current"]["y"] = 40;
			}
			break;
		case 40:
			camera["current"]["y"] -= 1;
			if(camera["current"]["y"] < 5){
				camera["current"]["y"] = 5;
			}
			break;
        default:
            break;
    }
});


/**
* When the left mouse button is depressed, capture the current mouse
* coordinates and indicate that the mouse is now down. With each mouse
* move, the last position of the mouse pointer is used to compute the
* relative change in mouse coordinstes.
* @param {event} an event structure describing mouse parameters.
* @return {none}
*/
function handleMouseDown(event)
{
	mouseDown = true;
	lastMouseX = event.clientX;
	lastMouseY = event.clientY;
	//console.log(event.clientX, event.clientY);
}

/**
* When the left mouse button is released, mark the mouse as not being
* "down" any longer. This short circuits handleMouseMove() which is
* called constantly.
* @param {event} an event structure describing mouse parameters.
* @return {none}
*/
function handleMouseUp(event)
{
	mouseDown = false;
}

/**
* If the mouse is recorded as being "down", the relative movement
* of the mouse is interpreted so as to modify "RotationMatrix".
* This isn't a perfect arcball but it works pretty well. 
*
* The calculation is straight forward. The amount of change in x
* since the last update is modulated to taste to create a rotation
* about y. Similarly, the change is y is also used to create a 
* matrix composition that is that applied to the RotationMatrix that
* governs the display of the main model.
* @param {event} an event structure describing mouse parameters.
* @return {none}
*/
function handleMouseMove(event)
{
	var speed_factor = 3;
	//console.log("mouse move");
	if (!mouseDown)
	{
		return;
	}

	var newX = event.clientX;
	var newY = event.clientY;

	var deltaX = newX - lastMouseX;
	var newRotationMatrix = mat4.create();
	mat4.rotate(newRotationMatrix, newRotationMatrix, Radians(deltaX / speed_factor), [0,1,0]);

	// Disabled, so we can't tilt the camera up/down
	// var deltaY = newY - lastMouseY;
	// mat4.rotate(newRotationMatrix, newRotationMatrix, Radians(deltaY / speed_factor), [0,0,1]);

	mat4.multiply(camera["rotation"], newRotationMatrix, camera["rotation"]);

	lastMouseX = newX
	lastMouseY = newY;
}