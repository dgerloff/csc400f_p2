var shape_groups = {
    bricks:{
        start: -1,
        end: -1
    },
    projectiles:{
        start:-1,
        end:-1,
        next_index:-1
    }
}


var world = new OIMO.World({
    timestep: 1 / 60,//simulation time per step. Smaller #'s are "finer", e.g 1/1000
    iterations: 8,//Solvers for joints
    broadphase: 2,//2 means "sweep and prune", see docs
    worldscale: 1,//Min 0.1, Max 10; Basic "units" of distance
    random: true,
    info: false,
    gravity: [0, -9.8, 0]//Setup the forces of gravity on XYZ; -9.8 on Y simulates Earth's Gravity (when `worldscale` is 1.0)
});

(function (){
    var o_ground = world.add({
        type: 'box', // type of shape : sphere, box, cylinder 
        size: [70, 2, 70], // size of shape
        pos: [0, 0, 0], // start position in degree
        move: false, // dynamic or static
        density: 1,
        friction: 1,
        restitution: 0.9,
        belongsTo:1 << 0
    });
    attachOimoObjectToShape('ground',o_ground);
})();

(function (){
    var pos = [-10,15,0];
    var src = world.add({
        type: 'box', // type of shape : sphere, box, cylinder 
        size: [0.5,0.5,0.5], // size of shape
        pos: pos, // start position in degree
        move: false, // dynamic or static
        density: 1,
        friction: 1,
        restitution: 0.9,
        belongsTo:1 << 1
    });
    attachOimoObjectToShape('launcher_source',src,pos);
})();

//Call for the first frame & repeat
function OimoMain(now) {
    world.step();
    requestAnimationFrame(OimoMain);
}
requestAnimationFrame(OimoMain);
//Setup projectiles
setup_projectiles(100,1.5);
function setup_projectiles(projectile_count,projectile_size){
    shape_groups["projectiles"]["start"] = shapes.length;
    shape_groups["projectiles"]["next_index"] = shapes.length;
    for(var i=0;i<projectile_count;i++){
        var proj_id = 'proj_'+i;

        registerShape(proj_id,[1,0,0]);
        var proj_oimo = world.add({
            type: 'box',
            size: [projectile_size,projectile_size,projectile_size],
            pos: [0, -100, 0],
            rot:[45,0,0],
            move: true, 
            density: 20,
            friction: 0.2,
            restitution: 0.8,
            belongsTo:1 << 2,
            collidesWith:1 << 0
        });
        attachOimoObjectToShape(proj_id,proj_oimo,[0, -100, 0]);
    }
    shape_groups["projectiles"]["end"] = shapes.length;
}

function launchProjectile(){
    var proj = shapes[shape_groups["projectiles"]["next_index"]].oimo;
    proj.resetPosition(-10,15,0);
    proj.resetRotation(45,0,0);
    proj.linearVelocity.x = launcher_power;
    proj.linearVelocity.y = launcher_elevation;
    proj.linearVelocity.z = launcher_azimuth;
    shape_groups["projectiles"]["next_index"] += 1;
    if(shape_groups["projectiles"]["next_index"] >= shape_groups["projectiles"]["end"]){
        shape_groups["projectiles"]["next_index"] = shape_groups["projectiles"]["start"];
    }
}
function reset_projectiles(){
    var sgb = shape_groups["projectiles"];
    if(sgb["start"] !== -1 && sgb["end"] !== -1 ){
        for(var i=sgb["start"];i<sgb["end"];i++){//Reset all old bricks
            if(shapes[i].id.indexOf('proj') !== -1){
                var o = shapes[i]["oimo"];
                var o_pos = shapes[i]["spawn_pos"];
                o.resetRotation(0,0,0);
                o.resetPosition(o_pos[0],o_pos[1],o_pos[2]);
            }
        }
    }
}

//Setup wall for first time
setup_wall([15,1,0]);
function setup_wall(origin,_width = 15,_height = 10){
    removeWall(); //Safe to call on first `setup_wall`, as it checks to see if the wall even exists via `shape_groups`
    shape_groups["bricks"]["start"] = shapes.length;
    var brick_size = 3;
    var brick_radius = brick_size/2;
    var wall_length = _width;
    var wall_height = _height;
    //Build up a wall, "centered" on the given `origin` (bottom middle)
    for(var r=0;r<wall_height;r++){
        var offset = (r+1) % 2 === 0;
        for(var c=0;c<wall_length;c++){
            if(!offset && c == 0){
                // skip the first block in every non-offset row
            } else {
                var brick_id = 'brick_'+r+'_'+c;
                
                var b_x = brick_radius,
                b_y = brick_radius,
                b_z = brick_size;
                
                if(offset && (c==0 || c == wall_length-1)){
                    b_z = brick_radius;
                }
            
                var brick_pos = [
                    origin[0]-b_x,
                    origin[1]+(r*b_y)+(b_y/2),
                    origin[2]-(wall_length*b_x)+(c*brick_size)+(offset?b_x:0)+(offset&&c==0?b_z/2:0)-(offset&&c==(wall_length-1)?b_z/2:0)
                ];
    
                registerShape(brick_id,null);
                var brick_oimo = world.add({
                    type: 'box',
                    size: [b_x,b_y,b_z],
                    pos: brick_pos,
                    move: true, 
                    density: 10,
                    friction: 0.2,
                    restitution: 0.05,
                    belongsTo:1 << 0
                });
                attachOimoObjectToShape(brick_id,brick_oimo,brick_pos);
            }
        }
    }
    shape_groups["bricks"]["end"] = shapes.length;
}
function removeWall(){
    if(shape_groups["bricks"]["start"] !== -1 || shape_groups["bricks"]["end"] !== -1){
        //wall already init'd, clear
        for(var i=shape_groups["bricks"]["start"];i<shape_groups["bricks"]["end"];i++){
            world.removeRigidBody(shapes[i].oimo);
            shapes[i].oimo = null;
        }
        var diff = shape_groups["bricks"]["end"] - shape_groups['bricks']['start'];
        shapes.splice(shape_groups['bricks']['start'],diff);
        if(shape_groups['projectiles']['start'] - shape_groups['bricks']['start'] > 0){
            for (var key in shape_groups["projectiles"]) {
                shape_groups["projectiles"][key] -= diff;
            }
        }
        if(shape_groups['wreckingBall']['start'] - shape_groups['bricks']['start'] > 0){
            for (var key in shape_groups["wreckingBall"]) {
                shape_groups["wreckingBall"][key] -= diff;
            }
        }
        shape_groups["bricks"]["start"] = -1;
        shape_groups["bricks"]["end"] = -1;
    }
}
function reset_wall(){
    var sgb = shape_groups["bricks"];
    if(sgb["start"] !== -1 && sgb["end"] !== -1 ){
        for(var i=sgb["start"];i<sgb["end"];i++){//Reset all old bricks
            if(shapes[i].id.indexOf('brick') !== -1){
                var o = shapes[i]["oimo"];
                var o_pos = shapes[i]["spawn_pos"];
                o.resetRotation(0,0,0);
                o.resetPosition(o_pos[0],o_pos[1],o_pos[2]);
            }
        }
    }
}
