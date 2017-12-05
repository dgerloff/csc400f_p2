function Radians(angle){return angle*(Math.PI/180)}

var viewmode = {
    normals:false,
    outlines:true,
    wireframe:false
};

var controlDiv = document.createElement('div');
controlDiv.innerHTML = 'Space to Shoot<br>R to Reset Wall/Projectiles<br>C to reset Camera<br>Up/Down to Raise/Lower Camera<br>W to Toggle Wireframe<br>O to Toggle Outlines<br>N to Toggle Normals';
controlDiv.setAttribute('style','font-family:Arial,sans-serif;font-size:12px;position:fixed;right:16px;bottom:16px;');
document.body.appendChild(controlDiv);

document.addEventListener('keydown',function(e){
    switch(e.keyCode){
        case 82:
            reset_wall();
            reset_projectiles();
            break;
        case 32:
            launchProjectile();
            break;
        case 78:
            viewmode.normals=!viewmode.normals;
            break;
        case 79:
            viewmode.outlines=!viewmode.outlines;
            break;
        case 87:
            viewmode.wireframe=!viewmode.wireframe;
            break;
        default:
            break;
    }
});

/**
* Demultiplex a vecN, pushing each component onto the specified array.
* @param {number array}	an array of floats representing vertex locations.
* @param {vecN} the vertex whose component values will be pushed.
* @return {none}
*/
function PushVertex(e,s){switch(s.length){case 2:e.push(s[0],s[1]);break;case 3:e.push(s[0],s[1],s[2]);break;case 4:e.push(s[0],s[1],s[2],s[3])}}