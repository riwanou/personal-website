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

class ShaderObject {
	material: ShaderMaterial;
	geometry: PlaneGeometry;
	mesh: Mesh;
	uniforms: any;
	vertex: string;
	fragment: string;

	// in init function
	constructor({
		name = "basic-name",
		geometry = null,
		blending = NormalBlending,
		blendEquation = null,
		blendSrc = null,
		blendDst = null,
		uniforms = {},
		vertex = null,
		fragment = null,
		vertexVar = "",
		vertexFunc = "",
		fragmentVar = "",
		fragmentFunc = "",
		material = null
	}) {
		// Vertex
		if (vertex) this.vertex = vertex;
		else
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
				vec3 pos = position;
				` +
				vertexFunc +
				`
                vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
                vec4 viewPosition = viewMatrix * modelPosition;
                vec4 projectedPosition = projectionMatrix * viewPosition;

                vUv = uv;
                gl_Position = projectedPosition;
            }
        `;

		// Fragment
		if (fragment) this.fragment = fragment;
		else
			this.fragment =
				`
		#define PI 3.1415926535897932384626433832795

        precision highp float;
        varying vec2 vUv;
        uniform float uTime;

		vec2 rotate(vec2 uv, float rotation, vec2 mid) 
		{
			return vec2(
				cos(rotation) * (uv.x - mid.x) + sin(rotation) * (uv.y - mid.y) + mid.x,
				cos(rotation) * (uv.y - mid.y) - sin(rotation) * (uv.x - mid.x) + mid.y
			);
		}
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
					blending: blending,
					blendEquation: blendEquation,
					blendSrc: blendSrc,
					blendDst: blendDst
				})
			);
		}
		if (geometry) this.geometry = add(name, "geometry", geometry);
		else this.geometry = add(name, "geometry", new PlaneBufferGeometry(1, 1, 10, 10));
		// this.geometry = add(name, "geometry", new CircleGeometry(0.5, 50));
		this.mesh = add(name, "mesh", new Mesh(this.geometry, this.material));
	}
}

export { ShaderObject };
