#include <common>

varying float vCount;
uniform vec3 color;
uniform float time;
uniform float opacity;

void main() {
    if (vCount > time) {
        discard;
    }
    gl_FragColor = vec4(color, 1. * opacity);
}
