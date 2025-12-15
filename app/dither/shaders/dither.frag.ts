export const fragmentShader = `
uniform sampler2D tBlueNoise;
uniform mat4 cameraWorldMatrix;
uniform mat4 cameraProjectionMatrixInverse;
uniform float patternScale;
uniform float threshold;
uniform float pixelSize;
uniform vec2 resolution;

// Convert sRGB to linear RGB
vec3 sRGBToLinear(vec3 srgb) {
  return pow(srgb, vec3(2.2));
}

// Sphere projection mapping - like Obra Dinn
vec2 directionToSphericalUV(vec3 dir) {
  vec3 n = normalize(dir);

  // Spherical coordinates: phi (azimuth), theta (elevation)
  float phi = atan(n.z, n.x);
  float theta = asin(clamp(n.y, -1.0, 1.0));

  // Map to [0, 1] UV space
  vec2 uv = vec2(
    phi / 6.28318530718 + 0.5,  // 2*PI
    theta / 3.14159265359 + 0.5  // PI
  );

  return uv;
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
  // Apply pixelation effect (low-res chunky look)
  vec2 pixelatedUV = uv;
  if (pixelSize > 1.0) {
    vec2 pixelCount = resolution / pixelSize;
    pixelatedUV = floor(uv * pixelCount) / pixelCount;
  }

  // Reconstruct view direction from pixelated UV
  vec4 clip = vec4(pixelatedUV * 2.0 - 1.0, 0.0, 1.0);
  vec4 view = cameraProjectionMatrixInverse * clip;
  view.xyz /= view.w;

  // Transform to world space
  vec3 worldDir = normalize((cameraWorldMatrix * vec4(view.xyz, 0.0)).xyz);

  // Project onto sphere and get UV coordinates (Obra Dinn technique)
  vec2 sphereUV = directionToSphericalUV(worldDir);
  vec2 tiledUV = fract(sphereUV * patternScale);

  // Sample blue noise
  float noise = texture2D(tBlueNoise, tiledUV).r;

  // Calculate luminance
  float luma = dot(inputColor.rgb, vec3(0.299, 0.587, 0.114));

  // Apply threshold adjustment
  float adjustedLuma = clamp(luma + threshold - 0.5, 0.0, 1.0);

  // Strict binary dithering - pure 1-bit output (no gradients)
  float dithered = step(noise, adjustedLuma);

  // Custom colors: #333319 (dark gray-green) and #ffffff (white)
  // Convert from sRGB hex values to linear RGB for proper rendering
  vec3 darkColorSRGB = vec3(51.0/255.0, 51.0/255.0, 25.0/255.0);  // #333319 in sRGB
  vec3 darkColor = sRGBToLinear(darkColorSRGB);
  vec3 lightColor = vec3(1.0, 1.0, 1.0);  // #ffffff (white)

  // Binary output - either dark or light, no in-between
  vec3 finalColor = mix(darkColor, lightColor, dithered);

  outputColor = vec4(finalColor, 1.0);
}
`;
