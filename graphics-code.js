var canvas = document.getElementById('glcanvas');
var gl = canvas.getContext('webgl2');

var colorfulShader = new Shader("colorful_vertex_shader", "colorful_fragment_shader");
var solidShader = new Shader("solid_vertex_shader", "solid_fragment_shader");
var phongShader = new Shader("phong_vertex_shader", "phong_fragment_shader");

registerShape('ground',[0.3,0.3,0.3]);
registerShape('launcher_source',[1,1,1]);

//Projection matrix
var prj = mat4.create();

// Hook the twirly handler up to the canvas.
InitializeMouseOverElement('glcanvas');

function Draw(now) {
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.2,0.2,0.2, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    now = now / 1000.0;

    mat4.perspective(prj, Radians(90.0), canvas.width / canvas.height, 0.5, 100.0);

    var mdv = mat4.create();
    mat4.lookAt(mdv, [camera["current"]["x"],camera["current"]["y"],camera["current"]["z"]],
        [
            0.0,
            camera["current"]["y"]-(camera["start"]["y"]+(camera["current"]["y"]*0.15)),
            0.0
        ],
        [0.0, 5.0, 0.0]
    );
    mat4.multiply(mdv, mdv, camera["rotation"]); 

    //necessary for phong_shader:
    var light_position = [0,5,0,1];
    var normal_matrix = mat3.create();
    mat3.normalFromMat4(normal_matrix, mdv);

    //view wireframe only:
    if (viewmode.wireframe || viewmode.outlines){
        gl.useProgram(solidShader.program);

        gl.uniformMatrix4fv(solidShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(solidShader.program.modelview_matrix_handle, false, mdv);
        gl.uniform3fv(solidShader.program.color_uniform_handle, [0.5, 1, 1]);
        drawAllShapes(mdv, solidShader.program, colorfulShader, solidShader, false, false, true, true);
    } 
    if(!viewmode.wireframe) {
        //use phongShader to draw our colors
        gl.useProgram(phongShader.program);
        gl.uniformMatrix4fv(phongShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(phongShader.program.modelview_matrix_handle, false, mdv);
        if (light_position != null && phongShader.program.u_light_position_handle != null) {
            gl.uniform4fv(phongShader.program.u_light_position_handle, light_position);
        }
                
        if (normal_matrix != null && phongShader.program.normal_matrix_handle != null) {
            gl.uniformMatrix3fv(phongShader.program.normal_matrix_handle, false, normal_matrix);
        } 

        drawAllShapes(mdv, phongShader.program, phongShader, solidShader, true, false, false, false, light_position, normal_matrix);
        gl.useProgram(null);
    }
    if (viewmode.normals) {
        gl.useProgram(solidShader.program);
        gl.uniformMatrix4fv(solidShader.program.projection_matrix_handle, false, prj);
        gl.uniformMatrix4fv(solidShader.program.modelview_matrix_handle, false, mdv);
        gl.uniform3fv(solidShader.program.color_uniform_handle, [0.5, 1, 1]);
        drawAllShapes(mdv, solidShader.program, colorfulShader, solidShader, false, true, false, false);
    }

    requestAnimationFrame(Draw);
}

var drawinCube = new Cube();
function drawAllShapes(mdv, shader_program, shader_1, shader_2, arg1, arg2, arg3, arg4) {
    for (i in shapes) {
        gl.useProgram(shader_program);
        let shape = shapes[i];
        //Re-locate all shapes according to their oimo object, if it exists
        if (shape.oimo != undefined && shape.draw) {
            if(shape.oimo.pos.y >= -5){
                // center - used for translation
                let c = [shape.oimo.pos.x, shape.oimo.pos.y, shape.oimo.pos.z];
                let m = mat4.create();
                // orientation - used for rotation
                let o = [shape.oimo.orientation.x, shape.oimo.orientation.y, shape.oimo.orientation.z, shape.oimo.orientation.w];

                mat4.fromRotationTranslation(m, o, c);
                mat4.multiply(m, mdv, m);
                mat4.scale(m, m, [shape.oimo.shapes.width, shape.oimo.shapes.height, shape.oimo.shapes.depth]);
                gl.uniformMatrix4fv(shader_program.modelview_matrix_handle, false, m);

                //Setup the Material for phong_shader
                var material = new Material();
                material.define(shape.material[0], shape.material[1],shape.material[2]);

                gl.useProgram(phongShader.program);
                if (material != null) {
                    if (material.color != null && phongShader.program.solid_color_uniform_handle != null) {
                        gl.uniform4fv(phongShader.program.solid_color_uniform_handle, material.color);
                    }
                    if (material.k_ambient != null && phongShader.program.u_ambient_handle != null){
                        gl.uniform3fv(phongShader.program.u_ambient_handle, material.k_ambient);
                    }
                        
                    if (material.k_diffuse != null && phongShader.program.u_diffuse_handle != null) {
                        gl.uniform3fv(phongShader.program.u_diffuse_handle, material.k_diffuse);
                    }
                        
                    if (material.k_specular != null && phongShader.program.u_specular_handle != null) {
                        gl.uniform3fv(phongShader.program.u_specular_handle, material.k_specular);
                    }
                        
                    if (material.k_shininess != null && phongShader.program.u_shininess_handle != null) {
                        gl.uniform1f(phongShader.program.u_shininess_handle, material.k_shininess);
                    }

                } else {//if no material but u_color still needs to be set for wireframe/normals drawing:
                    gl.uniform4fv(phongShader.program.solid_color_uniform_handle, [1, 1, 1, 1]);
                }

                drawinCube.Draw(shader_1, shader_2, arg1, arg2, arg3, arg4);
            }
        }
    }
}

requestAnimationFrame(Draw);