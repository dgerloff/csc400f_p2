class WreckingBall {
    constructor() {
        this.ready = false;
        this.primed = false;
        this.chain_length = 15;
    }

    Initialize(){
        //Make all the bits, connect them
        shape_groups['wreckingBall']['start'] = shapes.length;
        for(var i=0;i<this.chain_length;i++){
            var chain_pos = [0,launcher_elevation+10+(this.chain_length*1.65)-i-(i*0.5),0];
            registerShape('chain_'+i,null);
            var chain_oimo = world.add({
                type: 'box',
                size: [1,1,1],
                pos: chain_pos,
                move: i == 0 ? false : true, 
                density: 1000,
                friction: 0,
                restitution: 0.5,
                belongsTo:1 << 3,
                collidesWith:1 << 0
            });
            attachOimoObjectToShape('chain_'+i,chain_oimo,chain_pos);
        }

        registerShape('chain_ball',[1,0,0]);
        var ball_pos = [0,launcher_elevation+10,0];
        var ball_oimo = world.add({
            type: 'box',
            size: [5,5,5],
            pos: ball_pos,
            move: false, 
            density: 20,
            friction: 0.2,
            restitution: 0.01,
            belongsTo:1 << 3,
            collidesWith:1 << 0
        });
        attachOimoObjectToShape('chain_ball',ball_oimo,ball_pos);
        ball_oimo.resetRotation(0,45,45);
        shape_groups['wreckingBall']['ball'] = shapes.length-1;

        for(var i=0;i<this.chain_length;i++){
            var joint_pos = [0,launcher_elevation+10+(this.chain_length*1.65)-i-(i*0.5),0];
            registerShape('chain_joint_'+i,null,false);
            //Chain joints
            var chain_oimo = world.add({
                type:'jointBall',
                body1:shapes[shape_groups['wreckingBall']['start']+i].oimo,
                body2:shapes[shape_groups['wreckingBall']['start']+i+1].oimo,
                pos1:[0,-1,0],
                pos2:[0,1,0],
                collision:false
            });
            attachOimoObjectToShape('chain_joint_'+i,chain_oimo,null);
        }

        shape_groups['wreckingBall']['end'] = shapes.length;

        this.ready = true;
        this.primed = false;
        this.Reset();
        world.step();
    }

    Swing(){
        if(this.primed){
            //Make the ball "movable"
            shapes[shape_groups["wreckingBall"]['ball']].oimo.setupMass(1);
            this.primed = false;
        } else{
            this.Reset();
        }
    }

    Reset(){
        var sgb = shape_groups["wreckingBall"];

        var m = mat4.create();
        mat4.rotate(m,m,Radians(launcher_azimuth),[0,1,0]);
        mat4.rotate(m,m,Radians(launcher_power*2),[0,0,-1]);
        var ball_pos = shapes[sgb['ball']]['spawn_pos'];
        vec3.transformMat4(ball_pos,[0,-(this.chain_length*1.65),0],m);
        vec3.add(ball_pos,ball_pos,shapes[sgb['start']]['spawn_pos']);

        if(sgb["start"] !== -1 && sgb["end"] !== -1 ){
            for(var i=sgb["start"];i<sgb["end"];i++){
                if(shapes[i].id.indexOf('chain_joint_') !== -1){
                    var o = shapes[i]["oimo"];
                    o.updateAnchorPoints();//Reattches the anchor points, oimo built-in
                } else {
                    var o = shapes[i]["oimo"];
                    var o_pos = shapes[i]["spawn_pos"];
                    o.resetRotation(0,0,0);
                    //vec3.transformMat4(o_pos,[0,-((this.chain_length*1.65)+((i-sgb['start'])*1.65)),0],m);
                    //vec3.add(o_pos,o_pos,shapes[sgb['start']]['spawn_pos']);
                    o.resetPosition(o_pos[0],o_pos[1]+launcher_elevation,o_pos[2]);
                    if(i == sgb['start']){
                        o.setupMass(1);
                        world.step();
                        o.setupMass(0);
                    }
                }
            }
            world.step();
            shapes[shape_groups["wreckingBall"]['ball']].oimo.setupMass(0);
        }
        this.primed = true;
    }

}