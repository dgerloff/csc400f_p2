var GlobalShaderObject = {
	colorful_vertex_shader :
	`#version 300 es\n 
	uniform mat4 modelview_matrix;
	uniform mat4 projection_matrix;
	in vec3 vertex_coordinates;
	in vec3 vertex_color;
	out vec3 color_out;
	void main(void)
	{
		gl_Position = projection_matrix * modelview_matrix * vec4(vertex_coordinates, 1.0);
		color_out = vertex_color;
	}`,
	
	colorful_fragment_shader : 
	`#version 300 es\n
	precision mediump float;
	in vec3 color_out;
	out vec4 color;
	void main(void)
	{
		color = vec4(color_out, 1.0);
	}`,

	solid_vertex_shader :
	`#version 300 es\n 
	uniform mat4 modelview_matrix;
	uniform mat4 projection_matrix;
	in vec3 vertex_coordinates;
	void main(void)
	{
		gl_Position = projection_matrix * modelview_matrix * vec4(vertex_coordinates, 1.0);
	}`,

	solid_fragment_shader :
	`#version 300 es\n
	precision mediump float;
	uniform vec3 u_color;
	out vec4 color;
	void main(void)
	{
		color = vec4(1,1,1, 1.0);
	}`,

	phong_vertex_shader:
	`precision mediump float;

		attribute vec3 vertex_coordinates;
		attribute vec3 a_normals;
		attribute vec2 a_tcoords;

		uniform mat4 modelview_matrix;
		uniform mat3 normal_matrix;
		uniform mat4 projection_matrix;
		uniform float u_parameter;

		varying vec3 v_eyeCoords;
		varying vec3 v_normal;
		varying vec2 v_tcoords;

		void main()
		{
			v_normal = normalize(normal_matrix * a_normals);
			v_eyeCoords = vec3(modelview_matrix * vec4(vertex_coordinates,1.0) );
			v_tcoords = a_tcoords;
			gl_Position = projection_matrix * vec4(v_eyeCoords,1.0);
		}`,

	phong_fragment_shader:
	`precision mediump float;

	varying vec3 v_eyeCoords;
	varying vec3 v_normal;
	varying vec2 v_tcoords;

	struct Material
	{
			vec3 k_ambient;
			vec3 k_diffuse;
			vec3 k_specular;
			float k_shininess;
	};

	uniform Material u_material;
	uniform float u_parameter;
	uniform vec4 u_light_position;
	uniform vec4 u_color;

	vec4 ads()
	{
			vec3 diffuse2 = u_material.k_diffuse;
			vec3 n = normalize(v_normal);

			if (gl_FrontFacing)
			{
					return vec4(u_material.k_ambient, 1.0);
			}

			vec3 s = normalize(vec3(u_light_position) - v_eyeCoords);
			vec3 v = normalize(-v_eyeCoords);
			vec3 r = reflect(-s, n);
			vec3 diffuse = max(dot(s, n), 0.0) * diffuse2;
			vec3 specular = pow(max(dot(r, v), 0.0), u_material.k_shininess) * u_material.k_specular;

			return vec4(u_material.k_ambient + diffuse + specular, 1.0);
	}

	void main()
	{	
		
		vec4 c = ads();

		gl_FragColor = c;
	}`
}