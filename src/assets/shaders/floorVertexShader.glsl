varying vec2 vUv;
varying vec3 vPosition;
varying float vElevation;

uniform vec3 uM1;
uniform vec3 uM2;
uniform vec3 uM3;
uniform float uElevation;

float countHeight(float x, float y, float h, float s) {
    vec2 mountainPeak = vec2(x, y);
    float mountainHeight = h;
    float mountainSmoothness = 100.;
    float mountainRadius = 0.64;

    float elDistance = distance(mountainPeak, (vUv.xy-vec2(0.5))*vec2(1.,s) + vec2(0.5));
    if(elDistance < mountainRadius) {
        return mountainHeight * smoothstep(mountainRadius, 0.0, elDistance);
    } else {
        return 0.0;
    }
}

void main() {
    vUv = uv;
    vElevation = 0.0;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    float el1 = countHeight(uM1.x, uM1.y, uM1.z,1.);
    float el2 = countHeight(uM2.x, uM2.y, uM2.z,1.);
    float el3 = 2.*countHeight(1.2,0.5,1.8,0.3);
    el3 = 1.4*smoothstep(0.3,0.0,abs(vUv.x - 0.9)) * (1. - 0.5*(vUv.y-0.5)*(vUv.y-0.5));
    vElevation = max(el1, max(el2, el3));
    vElevation = vElevation * uElevation;

    modelPosition.y += vElevation;

    vec4 viewMatrix = viewMatrix * modelPosition;
    vec4 projectionMatrix = projectionMatrix * viewMatrix;

    vPosition = modelPosition.xyz;
    gl_Position = projectionMatrix;
}
