export const fragmentShader = `
#define PI 3.14159265359

uniform vec2 uClickPos;      // Where drag started (normalized 0-1)
uniform vec2 uDragPos;       // Current drag position (normalized 0-1)
uniform float uRadius;       // Curl cylinder radius
uniform sampler2D uNoteTexture;
uniform vec3 uBaseColor;
uniform vec3 uBackColor;     // Back of paper color

varying vec2 vUv;

// Enhanced shadow calculation for realistic depth
float computeShadow(float dist, float radius, float theta) {
  // Deeper shadow at the fold crease
  float foldShadow = smoothstep(0.0, radius, dist) * 0.2;

  // Ambient occlusion from curl depth (paper curves inward)
  float curlDepth = sin(theta) * radius;
  float aoShadow = curlDepth * 0.25;

  // Self-shadow from the overhanging curl behind
  float overhang = max(0.0, -dist / radius);
  float selfShadow = overhang * 0.35;

  return clamp(1.0 - foldShadow - aoShadow - selfShadow, 0.55, 1.0);
}

void main() {
  vec2 uv = vUv;

  // Direction from drag to click (curl direction)
  vec2 mouseDir = uClickPos - uDragPos;
  float mouseDist = length(mouseDir);

  // Handle no drag - show flat texture
  if (mouseDist < 0.001) {
    vec4 tex = texture2D(uNoteTexture, uv);
    gl_FragColor = vec4(mix(uBaseColor, tex.rgb, tex.a), 1.0);
    return;
  }

  mouseDir = normalize(mouseDir);

  // Project UV onto curl direction relative to drag position
  float dist = dot(uv - uDragPos, mouseDir);
  vec2 linePoint = uv - mouseDir * dist;

  vec3 color;
  float shadow = 1.0;  // Default: no darkening

  if (dist > uRadius) {
    // REGION 1: Ahead of curl - flat page
    vec4 tex = texture2D(uNoteTexture, uv);
    color = mix(uBaseColor, tex.rgb, tex.a);

    // Subtle shadow gradient approaching the fold
    float edgeDist = dist - uRadius;
    float edgeShadow = smoothstep(0.15, 0.0, edgeDist) * 0.08;
    shadow = 1.0 - edgeShadow;

  } else if (dist >= 0.0) {
    // REGION 2: On the curl
    float theta = asin(clamp(dist / uRadius, -1.0, 1.0));
    vec2 p2 = linePoint + mouseDir * (PI - theta) * uRadius;  // Back face UV
    vec2 p1 = linePoint + mouseDir * theta * uRadius;          // Front face UV

    // Check if back of page is visible (p2 is within bounds)
    bool useBack = (p2.x >= 0.0 && p2.x <= 1.0 && p2.y >= 0.0 && p2.y <= 1.0);

    if (useBack) {
      // Back of page - show blank paper color with shadow
      color = uBackColor;
      shadow = computeShadow(dist, uRadius, theta) * 0.92;
    } else {
      // Front of page - sample texture at remapped UV
      if (p1.x >= 0.0 && p1.x <= 1.0 && p1.y >= 0.0 && p1.y <= 1.0) {
        vec4 tex = texture2D(uNoteTexture, p1);
        color = mix(uBaseColor, tex.rgb, tex.a);
      } else {
        vec4 tex = texture2D(uNoteTexture, uv);
        color = mix(uBaseColor, tex.rgb, tex.a);
      }

      // Apply curl shadow with highlight at apex
      shadow = computeShadow(dist, uRadius, theta);

      // Subtle highlight at curl apex (light catching the edge)
      float highlight = smoothstep(0.0, 0.15, theta) * smoothstep(0.4, 0.0, theta);
      color = mix(color, vec3(1.0), highlight * 0.08);
    }

  } else {
    // REGION 3: Behind curl - back of curled paper visible
    color = uBackColor;

    // Darker shadow behind the curl
    float behindDist = abs(dist);
    shadow = 0.55 + 0.35 * smoothstep(0.0, uRadius * 2.0, behindDist);
  }

  gl_FragColor = vec4(color * shadow, 1.0);
}
`;
