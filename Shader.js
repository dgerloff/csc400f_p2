class Shader{
	constructor(vertex_shader_name,fragment_shader_name){
		this.changeShader(vertex_shader_name,fragment_shader_name);
	}

	changeShader(new_vertex_shader_name,new_fragment_shader_name){
		this.program = this.createShader(new_vertex_shader_name,new_fragment_shader_name);
		this.initializeShader();
	}
	
	createShader(vertex_shader_name,fragment_shader_name){
		var success = false;
		if (GlobalShaderObject[vertex_shader_name] == undefined)
			throw "Vertex shader name not found";
		if (GlobalShaderObject[fragment_shader_name] == undefined)
			throw "Vertex shader name not found";
		//Get references to `vertex_shader_name,fragment_shader_name`
		var vertShader = gl.createShader(gl.VERTEX_SHADER);
		gl.shaderSource(vertShader, GlobalShaderObject[vertex_shader_name]);
		gl.compileShader(vertShader);

		success = gl.getShaderParameter(vertShader, gl.COMPILE_STATUS);
		if (!success)
			throw "Could not compile vertex shader:" + gl.getShaderInfoLog(vertShader);

		var fragShader = gl.createShader(gl.FRAGMENT_SHADER);
		gl.shaderSource(fragShader, GlobalShaderObject[fragment_shader_name]);
		gl.compileShader(fragShader);

		success = gl.getShaderParameter(fragShader, gl.COMPILE_STATUS);
		if (!success)
			throw "Could not compile fragment shader:" + gl.getShaderInfoLog(fragShader);

		var shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertShader);
		gl.attachShader(shaderProgram, fragShader);
		gl.linkProgram(shaderProgram);

		success = gl.getProgramParameter(shaderProgram, gl.LINK_STATUS);
		if (!success)
			throw ("Shader program filed to link:" + gl.getProgramInfoLog (shaderProgram));

		return shaderProgram;
	}

	initializeShader(){
		//Will link the shaders together,
		//and will then attach all handles to the shader programs
		gl.useProgram(this.program);
        this.program.modelview_matrix_handle = gl.getUniformLocation(this.program, "modelview_matrix");
        this.program.projection_matrix_handle = gl.getUniformLocation(this.program, "projection_matrix");
        this.program.color_attribute_handle = gl.getAttribLocation(this.program, "vertex_color");
		this.program.vertex_attribute_handle = gl.getAttribLocation(this.program, "vertex_coordinates");
		this.program.solid_color_uniform_handle = gl.getUniformLocation(this.program, "u_color");
		this.program.normals_handle = gl.getAttribLocation(this.program, "a_normals");
		this.program.normal_matrix_handle = gl.getUniformLocation(this.program, "normal_matrix");
		this.program.a_tcoords_handle = gl.getAttribLocation(this.program, "a_tcoords");
        this.program.u_light_position_handle = gl.getUniformLocation(this.program, "u_light_position");
		this.program.u_ambient_handle = gl.getUniformLocation(this.program, "u_material.k_ambient");
		this.program.u_diffuse_handle = gl.getUniformLocation(this.program, "u_material.k_diffuse");
		this.program.u_specular_handle = gl.getUniformLocation(this.program, "u_material.k_specular");
		this.program.u_shininess_handle = gl.getUniformLocation(this.program, "u_material.k_shininess");
		//Log so we can make sure this works
		console.log(this.program);
        gl.useProgram(null);

	}

	SetStandardAttributes(vertices_buffer, normals_buffer, colors_buffer, tcoords_buffer) {
		if (vertices_buffer != null && this.program.vertex_attribute_handle >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, vertices_buffer);
            gl.vertexAttribPointer(this.program.vertex_attribute_handle, 3, gl.FLOAT, false, 0, 0);
            gl.enableVertexAttribArray(this.program.vertex_attribute_handle);
		}

		if (normals_buffer != null && this.program.normals_handle >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, normals_buffer);
			gl.vertexAttribPointer(this.program.normals_handle, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.program.normals_handle);
		}

		if (colors_buffer != null && this.program.color_attribute_handle >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, colors_buffer);
            gl.vertexAttribPointer(this.program.color_attribute_handle, 3, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.program.color_attribute_handle);
		}

		if (tcoords_buffer != null && this.a_tcoords >= 0)
		{
			gl.bindBuffer(gl.ARRAY_BUFFER, tcoords_buffer);
			gl.vertexAttribPointer(this.a_tcoords, 2, gl.FLOAT, false, 0, 0);
			gl.enableVertexAttribArray(this.a_tcoords);
		}
    }
    
    DisableStandardAttributes()	{
		if (this.program.vertex_attribute_handle >= 0){
			gl.disableVertexAttribArray(this.vertex_attribute_handle);
		}
		if (this.program.normals_handle >= 0){
			gl.disableVertexAttribArray(this.program.normals_handle);
		}
		if (this.program.color_attribute_handle >= 0){
			gl.disableVertexAttribArray(this.color_attribute_handle);
		}
		if (this.a_tcoords >= 0){
			gl.disableVertexAttribArray(this.a_tcoords);
		}
	}

	GetProgram() {
        return this.program;
    }

	UseProgram(){
		gl.useProgram(this.program);
    }
    
	EndProgram(){
		gl.useProgram(null);
	}
}

