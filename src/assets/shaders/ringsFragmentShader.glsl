uniform float time;
uniform float opacity;
varying vec2 vUv;
void main() {
    vec2 xy = vUv * 2.0 - 1.0;
    float r = length(xy);
    float f = fract(r * 3.0 - time);
    float a = pow(1.1 * f, 3.0) * max(0.0, 1.0 - r);
    vec3 color1 = vec3(10.0, 28.0, 46.0) / 255.0;
    vec3 color2 = vec3(0.0, 1.0, 1.0);
    vec3 finalColor = mix(color1, color2, a);
    gl_FragColor = vec4(finalColor, opacity);
}
