uniform mat4 projectionMatrix;
uniform mat4 viewMatrix; // properties of camera
uniform mat4 modelMatrix;  // (position,rotation & scale) of the mesh 
uniform vec2 uFrequency;
uniform float uTime;

attribute vec3 position;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    modelPosition.z += sin(modelPosition.x * uFrequency.x + uTime) * 0.1;
    modelPosition.z += sin(modelPosition.y * uFrequency.y + uTime) * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

}
