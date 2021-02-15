var vertexShader = `
varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

var fragmentShader = `
varying vec2 vUv;

uniform float snr;
uniform float lpmm;
uniform float step;
uniform sampler2D background;

// All very much TODO
float diam = 18.0;
float low_noise_mult = 0.2;
float hi_noise_mult = 0.03;
float falloff_mult = 3.0;

float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }
float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
float rand(vec3 co){ return rand(co.xy+rand(co.z)); }

void main() {

  float noise_scale = 10.0 / snr; // TODO

  float resolution = diam * lpmm;
  vec2 lpUv = vec2(floor(vUv.x * resolution) / resolution, floor(vUv.y * resolution) / resolution);

  float scene = length(texture2D(background, lpUv).xyz) / length(vec3(1.0, 1.0, 1.0));

  float circle;
  if (length(vUv.xy - vec2(0.5, 0.5)) > 0.5) {
    circle = 0.0;
  } else {
    circle = 1.0;
  }

  float noise = 0.0;

  for(int i = 1; i < 1000; ++i) {
    float curr_step = (step - float(i)) * 0.0001;
    float proto_noise = 1.0 - 2.0 * rand(vec3(lpUv, curr_step));
    proto_noise *= abs(proto_noise);
    float low_noise = proto_noise * noise_scale * low_noise_mult;
    float high_noise;

    if (proto_noise > (1.0 - noise_scale * hi_noise_mult) && proto_noise < 1.0) {
        high_noise = 1.0;
    } else {
        high_noise = 0.0;
    }

    float falloff = falloff_mult / (falloff_mult + float(i));
    float act_noise = (low_noise + high_noise) * falloff;
    
    noise += act_noise;
  }

  float outcol = (noise * 0.5 + scene * 0.3) * circle;
  outcol = clamp(outcol, 0.0, 1.0);

  gl_FragColor = vec4(outcol * 0.7, outcol, outcol * 0.8, 0.0);
}
`;

var canvas = document.getElementById('canvas');
var scene = new THREE.Scene();
var renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: false });
var camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientWidth, 1, 1000);
var clock = new THREE.Clock();

var initTime = {
  time: 0
}

var quad = new THREE.Mesh(
  new THREE.PlaneGeometry(2, 2),
  new THREE.ShaderMaterial({
    uniforms: {
      snr: { type: 'f', value: 20 },
      lpmm: { type: 'f', value: 30 },
      step: { type: 'f', value: 0 },
      background: {
        type: "t",
        value: new THREE.TextureLoader().load("/assets/images/forrest.jpg")
      }
    },
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    depthWrite: false,
    depthTest: false
  })
);
scene.add(quad);

camera.position.z = 200;

render();

var step = 0;
var start = 0;
function render() {

  if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
  }

  var dt = clock.getDelta();

  quad.material.uniforms.step.value += 1;

  renderer.render(scene, camera);

  requestAnimationFrame(render);
}

var snrInput = document.getElementById('snr_input').oninput = function () {
  console.log("Updated SNR: " + this.value);
  quad.material.uniforms.snr.value = this.value;
}

var lpmmInput = document.getElementById('lp_mm_input').oninput = function () {
  console.log("Updated lp/mm: " + this.value);
  quad.material.uniforms.lpmm.value = this.value;
}