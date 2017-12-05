//utilities.js

;

// Define various handy tuples.
var x_axis = [1, 0, 0];
var y_axis = [0, 1, 0];
var z_axis = [0, 0, 1];
var red = [1, 0, 0, 1];
var grn = [0, 1, 0, 1];
var blu = [0, 0, 1, 1];
var wht = [1, 1, 1, 1];
var blk = [0, 0, 0, 1];

function LERP(a, b, t)
{
	return a + (b - a) * t;
}

/**
* Convert degrees to radians
* @param {number} angle_in_degrees 
* @return {number} equivalent radians
*/
function Radians(angle_in_degrees) 
{
	return angle_in_degrees * (Math.PI / 180);
}

function Degrees(angle_in_radians) 
{
	return angle_in_radians / Math.PI * 180;
}

/**
* Normalize all the triples in an array of triples.
* @param {number array}	an array of floats with length divisible by three
* @param {string} id string for the fragment shader 
* @return {none}
*/
function NormalizeVertexArray(a)
{
	for (var i = 0; i < a.length / 3; i++)
	{
		var j = i * 3;
		var v = [a[j + 0], a[j + 1], a[j + 2]];
		vec3.normalize(v, v);
		a[j + 0] = v[0];
		a[j + 1] = v[1];
		a[j + 2] = v[2];
	}
}

/**
* Demultiplex a vecN, pushing each component onto the specified array.
* @param {number array}	an array of floats representing vertex locations.
* @param {vecN} the vertex whose component values will be pushed.
* @return {none}
*/
function PushVertex(a, v)
{
	switch (v.length)
	{
		case 2:
			a.push(v[0], v[1]);
			break;

		case 3:
			a.push(v[0], v[1], v[2]);
			break;

		case 4:
			a.push(v[0], v[1], v[2], v[3]);
			break;
	}
}

/**
* Helper to add components of three vertices to some array, making
* a triangle (comprised of 9 floats).
* @param {number array}	an array of floats representing vertex locations.
* @param {vec3} vertex 0 whose component values will be pushed.
* @param {vec3} vertex 1 whose component values will be pushed.
* @param {vec3} vertex 2 whose component values will be pushed.
* @return {none}
*/
function MakeTriangle(v, v0, v1, v2)
{
	this.PushVertex(v, v0);
	this.PushVertex(v, v1);
	this.PushVertex(v, v2);
}

/**
* Helper to add a triangle's verticies and attributes to applicable arrays.
* NOTE - NOTE - NOTE - The triangle will have FACETED normals. That is, this
* function exists in isolation - it cannot know about how vertices may be shared.
* As such it assigns the same normal to all three vertices.
* @param {number array}	an array of floats representing vertex locations.
* @param {number array}	an array of floats representing vertex colors.
* @param {number array} an array of floats giving line segments for displayable normals.
* @param {number array} an array of floats giving the normals per vertex.
* @param {vec3} vertex 1 of the triangle.
* @param {vec3} vertex 2 of the triangle.
* @param {vec3} vertex 3 of the triangle.
* @param {vec3} color for vertex 1 of the triangle.
* @param {vec3} color for vertex 2 of the triangle.
* @param {vec3} color for vertex 3 of the triangle.
* @return {none}
*/
function MakeTriangleAndNormals(v, c, dnv, nv, v0, v1, v2, c0, c1, c2)
{
	// The vertices
	this.PushVertex(v, v0);
	this.PushVertex(v, v1);
	this.PushVertex(v, v2);

	// The colors
	if (c != null)
	{
		this.PushVertex(c, c0);
		this.PushVertex(c, c1);
		this.PushVertex(c, c2);
	}
	
	var vt = vec3.create();
	var vn = vec3.create();
	var l1 = vec3.create();
	var l2 = vec3.create();

	// Use the cross product of two legs to define the surface normal. Make
	// direction vectors using v0 as the central vertex. Then normalize the
	// result.
	vec3.sub(l1, v0, v1);
	vec3.sub(l2, v0, v2);
	vec3.cross(vn, l2, l1);
	vec3.normalize(vn, vn);

	// Push three copies of the normal onto nv. These are the actual normals
	// to be used for lighting calculations.
	this.PushVertex(nv, vn);
	this.PushVertex(nv, vn);
	this.PushVertex(nv, vn);

	// Now calculate the display normals. There will be three of these 
	// starting at v0..v2 and ending a short distance away in the direction
	// of the normal. vn will be the scaled normal.
	vec3.scale(vn, vn, 0.15);

	vec3.add(vt, v0, vn);
	this.PushVertex(dnv, v0);
	this.PushVertex(dnv, vt);

	vec3.add(vt, v1, vn);
	this.PushVertex(dnv, v1);
	this.PushVertex(dnv, vt);

	vec3.add(vt, v2, vn);
	this.PushVertex(dnv, v2);
	this.PushVertex(dnv, vt);
}


