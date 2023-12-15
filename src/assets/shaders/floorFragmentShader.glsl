precision highp float;
uniform float opacity;
uniform float uPixelRatio;
uniform vec2 resolution;
varying vec2 vUv;
varying vec3 vPosition;
varying float vElevation;

void main() {
  // Pick a coordinate to visualize in a grid
  vec3 vertex = vPosition;
  vec2 coord = vertex.xz * 2.;

  // colors
  vec3 color1 = vec3(7.0, 98.0, 111.0) / 255.0;
  vec3 color2 = vec3(0.8, 0.2, 0.2);

  // Compute anti-aliased world-space grid lines
  vec2 grid = abs(fract(coord - 0.5) - 0.5) / fwidth(coord) / 2.5;
  float line = min(grid.x, grid.y);

  // Just visualize the grid lines directly
  float color = 1.0 - min(line, 1.0);
  float alpha = min(1.0, max(0.0, color));

  // Apply gamma correction
  color = pow(color, 1.0 / 2.2);
  vec3 mcolor = mix(color1, color2, vElevation);
  gl_FragColor = vec4(mcolor, alpha * opacity);
}
