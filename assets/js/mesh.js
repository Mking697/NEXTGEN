/* ============================================================
   ESSOR AUTOMATIONS — Mesh gradient background
   ------------------------------------------------------------
   Ported to vanilla JS from the 21st.dev "mesh gradient" component
   (21st.dev id 23959, by zerotherm27-create), retrieved through the
   21st MCP API. The original ships as a zero-dependency React
   component; its React surface was two useRef and two useEffect, and
   everything that matters is raw WebGL plus a GLSL fragment shader,
   so it transfers almost unchanged. The shader source below is the
   author's, verbatim. What changed here:

     - the React wrapper became a plain init(canvas) function
     - the palette is the Essor red/white one, not the original teal
     - it refuses to start on reduced-motion, on a 2-core device, or
       without WebGL, and falls back to a plain CSS wash
     - intensity and drift are dialled down; this sits behind text

   Credit: https://21st.dev/zerotherm27-create/mesh-gradient
   ============================================================ */
(function (w, d) {
  "use strict";

  var VERT = "attribute vec2 a_position;\nvoid main() {\n  gl_Position = vec4(a_position, 0.0, 1.0);\n}";
  var FRAG = "#ifdef GL_FRAGMENT_PRECISION_HIGH\nprecision highp float;\n#else\nprecision mediump float;\n#endif\n\nuniform vec3 u_colors[8];\n// Seven packed vectors + eight colour vectors = 15 fragment uniform vectors,\n// one below WebGL1's guaranteed minimum. Macros preserve the public u_* API.\nuniform vec4 u_scene;      // resolution.xy, time, colour count\nuniform vec4 u_shape;      // scale, intensity, paramA, warp\nuniform vec4 u_surface;    // detail, contrast, brightness, saturation\nuniform vec4 u_finish;     // hue, vignette, blur, grain\nuniform vec4 u_transform;  // seed, rotation, drift, OKLab toggle\nuniform vec4 u_space;      // offset.xy, pointer.xy\nuniform vec4 u_cursor;\n\n#define u_resolution u_scene.xy\n#define u_time u_scene.z\n#define u_colorCount u_scene.w\n#define u_scale u_shape.x\n#define u_intensity u_shape.y\n#define u_paramA u_shape.z\n#define u_warp u_shape.w\n#define u_detail u_surface.x\n#define u_contrast u_surface.y\n#define u_brightness u_surface.z\n#define u_saturation u_surface.w\n#define u_hue u_finish.x\n#define u_vignette u_finish.y\n#define u_blur u_finish.z\n#define u_grain u_finish.w\n#ifdef GL_FRAGMENT_PRECISION_HIGH\n#define u_seed u_transform.x\n#else\n// Keep hash inputs inside mediump's guaranteed \u00c2\u00b12^14 range.\n#define u_seed mod(u_transform.x, 31.0)\n#endif\n#define u_rotate u_transform.y\n#define u_drift u_transform.z\n#define u_oklab u_transform.w\n#define u_offset u_space.xy\n#define u_mouse u_space.zw\n#define u_cursorPresence u_cursor.x\n#define u_cursorEffect u_cursor.y\n#define u_cursorStrength u_cursor.z\n#define u_cursorRadius u_cursor.w\n\nfloat hash21(vec2 p) {\n#ifndef GL_FRAGMENT_PRECISION_HIGH\n  p = mod(p, 31.0);\n#endif\n  p = fract(p * vec2(234.34, 435.345));\n  p += dot(p, p + 34.23);\n  return fract(p.x * p.y);\n}\n\n// Even, un-structured white noise for film grain (Dave Hoskins hash12). The\n// multiply hash above is fine for value noise but shows a faint axis-aligned\n// mesh at integer fragment coords, which reads as a net over flat areas.\nfloat grainHash(vec2 p) {\n  vec3 p3 = fract(vec3(p.xyx) * 0.1031);\n  p3 += dot(p3, p3.yzx + 33.33);\n  return fract((p3.x + p3.y) * p3.z);\n}\n\nvec2 hash22(vec2 p) {\n#ifndef GL_FRAGMENT_PRECISION_HIGH\n  p = mod(p, 31.0);\n#endif\n  float n = sin(dot(p, vec2(41.0, 289.0)));\n  return fract(vec2(15731.743, 7892.321) * n);\n}\n\nfloat noise(vec2 p) {\n  vec2 i = floor(p);\n  vec2 f = fract(p);\n  vec2 u = f * f * (3.0 - 2.0 * f);\n  return mix(\n    mix(hash21(i), hash21(i + vec2(1.0, 0.0)), u.x),\n    mix(hash21(i + vec2(0.0, 1.0)), hash21(i + vec2(1.0, 1.0)), u.x),\n    u.y);\n}\n\nfloat fbm(vec2 p) {\n  float v = 0.0;\n  float a = 0.5;\n  for (int i = 0; i < 5; i++) {\n    v += a * noise(p);\n    p = p * 2.03 + vec2(17.0, 9.2);\n    a *= 0.5;\n  }\n  return v;\n}\n\n// --- OKLab colour mixing (perceptual), gated by u_oklab -----------------------\nvec3 srgbToLinear(vec3 c) {\n  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)),\n    step(0.04045, c));\n}\nvec3 linearToSrgb(vec3 c) {\n  // max() guards the sRGB branch: out-of-gamut OKLab interpolations can send a\n  // channel negative, and pow(negative, \u00e2\u20ac\u00a6) is NaN which mix()/step() would\n  // then propagate. The linear branch clips such channels to 0 downstream.\n  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055,\n    step(0.0031308, c));\n}\nvec3 linToOklab(vec3 c) {\n  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;\n  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;\n  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;\n  l = pow(max(l, 0.0), 1.0 / 3.0);\n  m = pow(max(m, 0.0), 1.0 / 3.0);\n  s = pow(max(s, 0.0), 1.0 / 3.0);\n  return vec3(\n    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,\n    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,\n    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);\n}\nvec3 oklabToLin(vec3 c) {\n  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;\n  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;\n  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;\n  l = l * l * l; m = m * m * m; s = s * s * s;\n  return vec3(\n    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,\n    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,\n    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);\n}\nvec3 mixColour(vec3 a, vec3 b, float t) {\n  if (u_oklab > 0.5) {\n    vec3 la = linToOklab(srgbToLinear(a));\n    vec3 lb = linToOklab(srgbToLinear(b));\n    return clamp(linearToSrgb(oklabToLin(mix(la, lb, t))), 0.0, 1.0);\n  }\n  return mix(a, b, t);\n}\n\n// Mix through the recipe colours; x is clamped to 0..1. WebGL1 forbids\n// dynamic uniform indexing in fragment shaders, hence the constant loop.\nvec3 palette(float x) {\n  float n = max(u_colorCount - 1.0, 1.0);\n  float f = clamp(x, 0.0, 1.0) * n;\n  vec3 col = u_colors[0];\n  for (int i = 0; i < 7; i++) {\n    if (float(i) < n)\n      col = mixColour(col, u_colors[i + 1],\n        smoothstep(0.0, 1.0, clamp(f - float(i), 0.0, 1.0)));\n  }\n  return col;\n}\n\nvec3 hueRotate(vec3 col, float a) {\n  const mat3 toYIQ = mat3(0.299, 0.596, 0.211,\n                          0.587, -0.274, -0.523,\n                          0.114, -0.322, 0.312);\n  const mat3 toRGB = mat3(1.0, 1.0, 1.0,\n                          0.956, -0.272, -1.106,\n                          0.621, -0.647, 1.703);\n  vec3 yiq = toYIQ * col;\n  float ca = cos(a), sa = sin(a);\n  yiq = vec3(yiq.x, yiq.y * ca - yiq.z * sa, yiq.y * sa + yiq.z * ca);\n  return toRGB * yiq;\n}\n\nvec3 shade(vec2 uv, vec2 p, float t) {\n  vec3 acc = u_colors[0] * 0.15;\n  float total = 0.15;\n  for (int i = 0; i < 8; i++) {\n    if (float(i) >= u_colorCount) break;\n    float fi = float(i);\n    vec2 c = vec2(\n      sin(t * (0.21 + fi * 0.071) + fi * 2.4 + u_seed),\n      cos(t * (0.17 + fi * 0.093) + fi * 1.7)) * (0.45 + u_intensity * 0.35);\n    float w = exp(-dot(p - c, p - c) * 6.0);\n    acc += u_colors[i] * w;\n    total += w;\n  }\n  return acc / total;\n}\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / u_resolution.xy;\n  vec2 screenUv = uv;\n  vec2 p = (gl_FragCoord.xy - 0.5 * u_resolution.xy)\n    / min(u_resolution.x, u_resolution.y);\n  float cursorMask = 0.0;\n\n  // Cursor modes 1\u00e2\u20ac\u201c3 are local distortions. Push shifts the same screen-space\n  // coordinates before field transforms, so Zoom/Rotate don't change its feel.\n  if (u_cursorPresence > 0.001) {\n    // u_mouse is normalized to -1..1 in canvas space. Convert it to the same\n    // aspect-corrected screen space as p so effects stay under the cursor.\n    vec2 cursor = (0.5 * u_mouse * u_resolution.xy)\n      / min(u_resolution.x, u_resolution.y);\n    vec2 cursorDelta = p - cursor;\n    if (u_cursorEffect < 0.5) {\n      p += cursor * u_cursorPresence * u_cursorStrength * 0.55;\n    } else {\n      float cursorDistance = length(cursorDelta);\n      vec2 cursorDirection = cursorDelta / max(cursorDistance, 0.0001);\n      cursorMask = u_cursorPresence\n        * (1.0 - smoothstep(0.0, u_cursorRadius, cursorDistance));\n      if (u_cursorEffect < 1.5) {\n        p -= cursorDirection * cursorMask * u_cursorStrength * 0.24;\n      } else if (u_cursorEffect < 2.5) {\n        float cursorAngle = cursorMask * u_cursorStrength * 2.2;\n        float cc = cos(cursorAngle), cs = sin(cursorAngle);\n        p = cursor + mat2(cc, -cs, cs, cc) * cursorDelta;\n      } else if (u_cursorEffect < 3.5) {\n        float ripple = sin(\n          cursorDistance / max(u_cursorRadius, 0.001) * 18.0 - u_time * 5.0);\n        p -= cursorDirection * ripple * cursorMask * u_cursorStrength * 0.07;\n      }\n    }\n  }\n\n  // Keep presets that read uv (rather than p) in the same warped space.\n  uv = p * min(u_resolution.x, u_resolution.y) / u_resolution.xy + 0.5;\n  p *= u_scale;\n  // Field transform: rotate, pan, pointer push, slow drift.\n  if (abs(u_rotate) > 0.0001) {\n    float cr = cos(u_rotate), sr = sin(u_rotate);\n    p = mat2(cr, -sr, sr, cr) * p;\n  }\n  p += u_offset;\n  if (u_drift > 0.0001)\n    p += u_drift * vec2(sin(u_time * 0.31), cos(u_time * 0.23));\n  // Organic domain warp.\n  if (u_warp > 0.0) {\n    p += u_warp * (vec2(\n      fbm(p * u_detail + u_seed),\n      fbm(p * u_detail + vec2(5.2, 1.3))) - 0.5);\n  }\n  // Shade, with an optional soft 5-tap blur.\n  vec3 col;\n  if (u_blur > 0.0) {\n    float e = u_blur;\n    float pe = e * u_scale;\n    vec2 uvE = vec2(e) * min(u_resolution.x, u_resolution.y) / u_resolution.xy;\n    col  = shade(uv, p, u_time) * 0.36;\n    col += shade(uv + vec2(uvE.x, 0.0), p + vec2(pe, 0.0), u_time) * 0.16;\n    col += shade(uv - vec2(uvE.x, 0.0), p - vec2(pe, 0.0), u_time) * 0.16;\n    col += shade(uv + vec2(0.0, uvE.y), p + vec2(0.0, pe), u_time) * 0.16;\n    col += shade(uv - vec2(0.0, uvE.y), p - vec2(0.0, pe), u_time) * 0.16;\n  } else {\n    col = shade(uv, p, u_time);\n  }\n  // Post: contrast, saturation, hue, brightness, vignette, grain.\n  if (abs(u_contrast - 1.0) > 0.0001)\n    col = (col - 0.5) * u_contrast + 0.5;\n  if (abs(u_saturation - 1.0) > 0.0001) {\n    float luma = dot(col, vec3(0.299, 0.587, 0.114));\n    col = mix(vec3(luma), col, u_saturation);\n  }\n  if (abs(u_hue) > 0.0001)\n    col = hueRotate(col, u_hue);\n  if (abs(u_brightness) > 0.0001)\n    col += u_brightness;\n  if (u_vignette > 0.0001) {\n    float vd = length(screenUv - 0.5) * 1.41421356;\n    col *= 1.0 - u_vignette * smoothstep(0.35, 1.0, vd);\n  }\n  if (u_cursorPresence > 0.001 && u_cursorEffect > 3.5)\n    col += (vec3(0.18) + col * 0.12) * cursorMask * u_cursorStrength;\n  if (u_grain > 0.0001)\n    col += (grainHash(\n      gl_FragCoord.xy + vec2(u_seed * 17.0, u_seed * 31.0)) - 0.5) * u_grain;\n  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);\n}\n";

  var UNIFORMS = {
    colors: [[1.0, 1.0, 1.0], [1.0, 0.964706, 0.964706], [1.0, 0.862745, 0.862745], [1.0, 0.72549, 0.72549], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0], [1.0, 1.0, 1.0]],
    colorCount: 4,
    scale: 1.95, intensity: 0.34, paramA: 0.39, warp: 0.03,
    detail: 1.50, contrast: 0.92, brightness: 0.10, saturation: 0.88,
    hue: 0.0, vignette: 0.10, blur: 0.002, grain: 0.012,
    seed: 5439.0, rotate: 0.1745, offsetX: -0.16, offsetY: 0.11,
    drift: 0.10, cursorEnabled: 0, cursorEffect: 2.0,
    cursorStrength: 0.0, cursorRadius: 0.46, oklab: 1.0, timeScale: 0.34
  };

  function shouldSkip() {
    if (w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches) return "reduced-motion";
    // This audience is on low-end Android over mobile data; a full-screen
    // fragment shader is not worth the battery there.
    if ((navigator.hardwareConcurrency || 4) <= 2) return "low-core device";
    if (navigator.connection && navigator.connection.saveData) return "save-data";
    return null;
  }

  function init(canvas) {
    var skip = shouldSkip();
    if (skip) { canvas.dataset.shader = "skipped:" + skip; return null; }

    var gl = canvas.getContext("webgl", { antialias: false, alpha: true });
    if (!gl) { canvas.dataset.shader = "skipped:no-webgl"; return null; }

    function compile(type, s) {
      var sh = gl.createShader(type);
      gl.shaderSource(sh, s); gl.compileShader(sh);
      if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
        console.warn("[Essor] shader compile failed:", gl.getShaderInfoLog(sh));
        return null;
      }
      return sh;
    }
    var vs = compile(gl.VERTEX_SHADER, VERT), fs = compile(gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) { canvas.dataset.shader = "skipped:compile"; return null; }

    var prog = gl.createProgram();
    gl.attachShader(prog, vs); gl.attachShader(prog, fs); gl.linkProgram(prog);
    gl.deleteShader(vs); gl.deleteShader(fs);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { canvas.dataset.shader = "skipped:link"; return null; }
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 3,-1, -1,3]), gl.STATIC_DRAW);
    var loc = gl.getAttribLocation(prog, "a_position");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    var U = {}, names = ["colors","scene","shape","surface","finish","transform","space","cursor"];
    names.forEach(function (n) { U[n] = gl.getUniformLocation(prog, "u_" + n); });

    var flat = [];
    UNIFORMS.colors.forEach(function (c) { flat.push(c[0], c[1], c[2]); });
    gl.uniform3fv(U.colors, new Float32Array(flat));
    gl.uniform4f(U.shape,     UNIFORMS.scale, UNIFORMS.intensity, UNIFORMS.paramA, UNIFORMS.warp);
    gl.uniform4f(U.surface,   UNIFORMS.detail, UNIFORMS.contrast, UNIFORMS.brightness, UNIFORMS.saturation);
    gl.uniform4f(U.finish,    UNIFORMS.hue, UNIFORMS.vignette, UNIFORMS.blur, UNIFORMS.grain);
    gl.uniform4f(U.transform, UNIFORMS.seed, UNIFORMS.rotate, UNIFORMS.drift, UNIFORMS.oklab);
    gl.uniform4f(U.cursor,    0, UNIFORMS.cursorEffect, UNIFORMS.cursorStrength, UNIFORMS.cursorRadius);

    var raf = 0, disposed = false, inView = true;
    var visible = d.visibilityState === "visible";
    var start = performance.now();

    function resize() {
      var r = canvas.getBoundingClientRect();
      var dpr = Math.min(w.devicePixelRatio || 1, 2);
      var rw = Math.max(1, Math.round(r.width * dpr)), rh = Math.max(1, Math.round(r.height * dpr));
      // hard pixel budget — a 4K hero would otherwise melt a phone
      var k = Math.min(1, Math.sqrt(1200000 / Math.max(1, rw * rh)));
      var cw = Math.max(1, Math.round(rw * k)), ch = Math.max(1, Math.round(rh * k));
      if (canvas.width !== cw || canvas.height !== ch) {
        canvas.width = cw; canvas.height = ch; gl.viewport(0, 0, cw, ch);
      }
    }

    function render(now) {
      raf = 0;
      if (disposed) return;
      resize();
      var t = ((now || performance.now()) - start) / 1000 * UNIFORMS.timeScale;
      gl.uniform4f(U.scene, canvas.width, canvas.height, t, UNIFORMS.colorCount);
      gl.uniform4f(U.space, UNIFORMS.offsetX, UNIFORMS.offsetY, 0, 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (visible && inView) raf = requestAnimationFrame(render);
    }
    function kick() { if (!disposed && visible && inView && !raf) raf = requestAnimationFrame(render); }

    d.addEventListener("visibilitychange", function () {
      visible = d.visibilityState === "visible"; kick();
    });
    if ("IntersectionObserver" in w) {
      new IntersectionObserver(function (es) {
        inView = es[0].isIntersecting; kick();
      }, { threshold: 0 }).observe(canvas);
    }
    w.addEventListener("resize", kick, { passive: true });

    canvas.dataset.shader = "running";
    kick();
    return { stop: function () { disposed = true; if (raf) cancelAnimationFrame(raf); } };
  }

  function boot() {
    Array.prototype.forEach.call(d.querySelectorAll("canvas[data-mesh]"), init);
  }
  if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", boot);
  else boot();

  w.NGA_mesh = { init: init };
})(window, document);
