
var shapes = [];
function attachOimoObjectToShape(shape_id,oimo_object,original_location){
    for(i in shapes){
        if(shapes[i].id == shape_id){
            shapes[i]["oimo"] = oimo_object;
            shapes[i]["spawn_pos"] = original_location;
        }
    }
}

function registerShape(shape_id,color = null,visible = true){
    var found = false;
    if(null===color || "object"!=typeof color || 3!==color.length){
        color = [Math.random()-0.2,Math.random(),Math.random()];
    }
    for(i in shapes){
        if(shapes[i].id == shape_id){
            shapes[i]["material"] = [color,color,color];
            found = true;
            break;
        }
    }
    if(!found){
        shapes.push({id:shape_id,material:[color,color,color],draw:visible});
    }
}

function setMaterialColorForShape(shape_id,color = null){
    if(color === null){
        color = [Math.random(),Math.random(),Math.random()];
    }
    if(color.length === 3){
        for(i in shapes){
            if(shapes[i].id == shape_id){
                shapes[i]["material"] = [
                    color,color,color
                ];
            }
        }
    } else {
        console.error('OIMO_GRAPHICS_HELPER:: `color.length` !== 3',color);
    }
}