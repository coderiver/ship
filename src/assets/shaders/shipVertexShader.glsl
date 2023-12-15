attribute float count;
varying float vCount;
void main() {
    vCount = count;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1);
}
