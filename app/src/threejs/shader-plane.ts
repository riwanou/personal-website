import {
	DoubleSide,
	Mesh,
	NormalBlending,
	PlaneBufferGeometry,
	RawShaderMaterial,
	type PlaneGeometry,
	type ShaderMaterial
} from "three";
import { add } from "$threejs/ressources";

class ShaderPlane {
	material: ShaderMaterial;
	geometry: PlaneGeometry;
	mesh: Mesh;
	uniforms: any;
	vertex: string;
	fragment: string;

	// in init function
	constructor({
		name = "basic-name",
		nbVertices = 10,
		blending = NormalBlending,
		uniforms = {},
		vertexVar = "",
		vertexFunc = "",
		fragmentVar = "",
		fragmentFunc = "",
		material = null
	}) {
		// Vertex
		this.vertex =
			`
            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat4 modelMatrix;
            
            attribute vec2 uv;
            attribute vec3 position;

            uniform float uTime;
            varying vec2 vUv;

            ` +
			vertexVar +
			`

            void main()
            {
                vec4 modelPosition = modelMatrix * vec4(position, 1.0);
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;

                vUv = uv;
                gl_Position = projectedPosition;
            ` +
			vertexFunc +
			`
            }
        `;

		// Fragment
		this.fragment =
			`
        precision mediump float;
        varying vec2 vUv;
        uniform float uTime;
        ` +
			fragmentVar +
			`
        void main() {
            vec2 uv = vUv;
            vec4 color = vec4(1.0);
        ` +
			fragmentFunc +
			`
            gl_FragColor = color;
        }
        `;

		// Init
		if (material) this.material = material;
		else {
			this.uniforms = uniforms;
			this.material = add(
				name,
				"material",
				new RawShaderMaterial({
					vertexShader: this.vertex,
					fragmentShader: this.fragment,
					uniforms: {
						...this.uniforms
					},
					side: DoubleSide,
					transparent: true,
					blending: blending
				})
			);
		}
		this.geometry = add(name, "geometry", new PlaneBufferGeometry(1, 1, nbVertices, nbVertices));
		this.mesh = add(name, "mesh", new Mesh(this.geometry, this.material));
	}
}

export { ShaderPlane };
