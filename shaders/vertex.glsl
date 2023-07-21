uniform mat4 projectionMatrix;
uniform mat4 viewMatrix; // properties of camera
uniform mat4 modelMatrix;  // (position,rotation & scale) of the mesh 

attribute vec3 position;
attribute float aRandom;

varying float vRandom;

void main() {
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    // modelPosition.z += sin(modelPosition.x * 10.0) * 0.1;
    modelPosition.z += aRandom * 0.1;

    vec4 viewPosition = viewMatrix * modelPosition;
    vec4 projectedPosition = projectionMatrix * viewPosition;

    gl_Position = projectedPosition;

    vRandom = aRandom;
}
