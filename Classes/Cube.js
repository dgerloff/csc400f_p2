class Cube extends Shape {
    constructor() {
        super(false);
        this.type = "Cube";

        this.Initialize();
    }

    PushTextureCoordinates() {
        PushVertex(this.texture_coords, [0, 0]);
        PushVertex(this.texture_coords, [1, 0]);
        PushVertex(this.texture_coords, [1, 1]);
        PushVertex(this.texture_coords, [0, 0]);
        PushVertex(this.texture_coords, [1, 1]);
        PushVertex(this.texture_coords, [0, 1]);
    }

    Initialize() {
        this.CreateBuffers();

        // Each face of the cube is made of four vertices. The
        // length of a side is 1 ranging from -0.5 to 0.5. 
        var v00 = vec3.fromValues(-0.5, 0.5, 0);
        var v01 = vec3.fromValues(0.5, 0.5, 0);
        var v10 = vec3.fromValues(-0.5, -0.5, 0);
        var v11 = vec3.fromValues(0.5, -0.5, 0);

        var m1 = mat4.create();
        var m2 = mat4.create();
        var w00 = vec3.create();
        var w01 = vec3.create();
        var w10 = vec3.create();
        var w11 = vec3.create();
        var za = vec3.create();

        // Rotate m1 by 90 degrees, saving m1 as we go.
        // Then, translate down the z axis by 0.5 (half
        // the length of a side.
        // Then, instantiate the upper and lower traingles.
        for (var i = 0; i < 4; i++) {
            mat4.rotate(m1, m1, Radians(90), y_axis);
            mat4.translate(m2, m1, vec3.fromValues(0, 0, 0.5));

            vec3.transformMat4(w00, v00, m2);
            vec3.transformMat4(w01, v01, m2);
            vec3.transformMat4(w10, v10, m2);
            vec3.transformMat4(w11, v11, m2);
            vec3.transformMat4(za, z_axis, m2);

            MakeTriangleAndNormals(this.triangle_vrts, null, this.normal_display_vrts, this.normal_vrts, w00, w01, w11);
            MakeTriangleAndNormals(this.triangle_vrts, null, this.normal_display_vrts, this.normal_vrts, w00, w11, w10);

            this.PushTextureCoordinates();
        }

        // Similarly, make a top and bottom.
        m1 = mat4.create();
        mat4.rotate(m1, m1, Radians(90), x_axis);
        for (var i = 0; i < 2; i++) {
            mat4.rotate(m1, m1, Radians(180), x_axis);
            mat4.translate(m2, m1, vec3.fromValues(0, 0, 0.5));

            vec3.transformMat4(w00, v00, m2);
            vec3.transformMat4(w01, v01, m2);
            vec3.transformMat4(w10, v10, m2);
            vec3.transformMat4(w11, v11, m2);
            vec3.transformMat4(za, z_axis, m2);

            MakeTriangleAndNormals(this.triangle_vrts, null, this.normal_display_vrts, this.normal_vrts, w00, w01, w11);
            MakeTriangleAndNormals(this.triangle_vrts, null, this.normal_display_vrts, this.normal_vrts, w00, w11, w10);

            this.PushTextureCoordinates();
        }

        var flop = true;
        // Every nine floats are taken to be one triangle. This loop adds
        // line segments outlining each leg of each triangle.
        for (var triangle_index = 0; triangle_index < this.triangle_vrts.length / 9; triangle_index++) {
            var base_index = triangle_index * 9;
            var v0 = vec3.fromValues(this.triangle_vrts[base_index + 0], this.triangle_vrts[base_index + 1], this.triangle_vrts[base_index + 2]);
            var v1 = vec3.fromValues(this.triangle_vrts[base_index + 3], this.triangle_vrts[base_index + 4], this.triangle_vrts[base_index + 5]);
            var v2 = vec3.fromValues(this.triangle_vrts[base_index + 6], this.triangle_vrts[base_index + 7], this.triangle_vrts[base_index + 8]);

            if(flop ==true)
            {
                PushVertex(this.line_segment_vrts, v0);
                PushVertex(this.line_segment_vrts, v1);
                PushVertex(this.line_segment_vrts, v1);
                PushVertex(this.line_segment_vrts, v2);
                PushVertex(this.line_segment_vrts, v2);
                //PushVertex(this.line_segment_vrts, v0);
            }
            else
            {
                //PushVertex(this.line_segment_vrts, v0);
                PushVertex(this.line_segment_vrts, v1);
                PushVertex(this.line_segment_vrts, v1);
                PushVertex(this.line_segment_vrts, v2);
                PushVertex(this.line_segment_vrts, v2);
                PushVertex(this.line_segment_vrts, v0);
            }
            flop=!flop;
        }


        this.BindBuffers();
    }
}