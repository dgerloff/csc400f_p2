class Material
{
	constructor()
	{
		this.k_ambient = vec3.create();
		this.k_diffuse = vec3.create();
		this.k_specular = vec3.create();
		this.k_shininess = 80.0;
		this.color = vec4.create();
	}

	clone() 
	{
            var copy = new Material();
            for (var attr in this) {
                    if (this.hasOwnProperty(attr)) copy[attr] = this[attr];
            }
            return copy;
	}

	define(diffuse, specular, ambient, color, shininess){
		this.k_ambient = ambient;
		this.k_diffuse = diffuse;
		this.k_specular = specular;

		if (color == undefined) {
			this.color = [1, 0.5, 0.7, 1];
		} else {
			this.color = color;
		}
		
		if (shininess == undefined) {
			this.k_shininess = 200;
		} else {
			this.k_shininess = shininess;
		}
		
	}
};