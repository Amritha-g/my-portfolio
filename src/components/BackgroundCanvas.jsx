import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export function BackgroundCanvas() {
  const oceanRef = useRef(null);
  const threeRef = useRef(null);
  const rippleRef = useRef(null);

  // 1. WebGL Ocean Background Shader
  useEffect(() => {
    const canvas = oceanRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) return;

    const resizeOcean = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    resizeOcean();
    window.addEventListener('resize', resizeOcean);

    const vsrc = `
      attribute vec2 a_pos;
      void main() {
        gl_Position = vec4(a_pos, 0, 1);
      }
    `;

    const fsrc = `
      precision mediump float;
      uniform float u_time;
      uniform vec2 u_res;
      uniform vec2 u_mouse;
      uniform float u_scroll;

      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
      }

      float noise(vec2 p) {
        vec2 i = floor(p), f = fract(p);
        f = f * f * (3. - 2. * f);
        return mix(mix(hash(i), hash(i + vec2(1, 0)), f.x),
                   mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), f.x), f.y);
      }

      float fbm(vec2 p) {
        float v = 0., a = .5;
        for(int i = 0; i < 6; i++) {
          v += a * noise(p);
          p *= 2.1;
          a *= .5;
        }
        return v;
      }

      void main() {
        vec2 uv = gl_FragCoord.xy / u_res;
        vec2 q = uv;
        q.y = 1. - q.y;

        float depth = u_scroll * .0004;
        float t = u_time * .25 + depth * 2.2;
        vec2 p = q * 3. + vec2(t * .12, t * .07);

        float n1 = fbm(p);
        float n2 = fbm(p + vec2(n1, .8) + vec2(t * .08, t * .04));
        float n3 = fbm(p + vec2(n2, .7) - vec2(t * .05, t * .03));

        float deepFactor = q.y * 0.65 + depth * 0.35;
        vec3 surfaceColor = vec3(0.01, 0.20, 0.26);
        vec3 deepColor = vec3(0.00, 0.03, 0.08);
        vec3 abyssColor = vec3(0.00, 0.01, 0.02);

        vec3 waterColor = mix(mix(surfaceColor, deepColor, deepFactor), abyssColor, clamp(deepFactor * 1.3, 0., 1.));
        float bio = pow(n3, 3.2) * 1.9;
        vec3 glow1 = vec3(0., 1., .78) * bio * .13;
        vec3 glow2 = vec3(0., .68, 1.) * fbm(p * 1.4 + vec2(t * .1, 0.)) * 0.08;

        float causticY = clamp(1. - q.y * 1.8, 0., 1.);
        float caustic = fbm(q * 7.5 + vec2(t * .35, 0.)) * causticY * 0.055;
        vec3 causticColor = vec3(0., 0.82, 0.62) * caustic;

        vec2 mPos = u_mouse / u_res;
        mPos.y = 1. - mPos.y;
        float dist = length(uv - mPos);

        float ripple = sin(dist * 38. - u_time * 4.8) / (dist * 28. + 1.) * 0.02;
        float rippleMask = exp(-dist * 3.8) * 0.85;
        vec3 rippleColor = vec3(0., 1., .8) * ripple * rippleMask;

        vec3 col = waterColor + glow1 + glow2 + causticColor + rippleColor;
        float vig = 1. - length((uv - .5) * 1.05);
        col *= vig;

        gl_FragColor = vec4(col, 1.);
      }
    `;

    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const prog = gl.createProgram();
    gl.attachShader(prog, shader(gl.VERTEX_SHADER, vsrc));
    gl.attachShader(prog, shader(gl.FRAGMENT_SHADER, fsrc));
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);

    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    const uTime = gl.getUniformLocation(prog, 'u_time');
    const uRes = gl.getUniformLocation(prog, 'u_res');
    const uMouse = gl.getUniformLocation(prog, 'u_mouse');
    const uScroll = gl.getUniformLocation(prog, 'u_scroll');

    let mouseX = 0, mouseY = 0, scrollY = 0;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    const handleScroll = () => {
      scrollY = window.scrollY;
    };

    document.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);

    const startTime = performance.now();
    let animFrame;

    const draw = () => {
      const t = (performance.now() - startTime) / 1000;
      gl.uniform1f(uTime, t);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.uniform2f(uMouse, mouseX, mouseY);
      gl.uniform1f(uScroll, scrollY);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', resizeOcean);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // 2. Three.js Background Objects (Floating 3D particles, Toruses, Icosahedrons)
  useEffect(() => {
    const canvas = threeRef.current;
    if (!canvas) return;

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    const GREEN = new THREE.Color(0x00ffd0);
    const GREEN_D = new THREE.Color(0x00b894);
    const WHITE = new THREE.Color(0x7affb2);

    // Particles Cloud
    const particleCount = 800;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 110;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 70;

      const t = Math.random();
      const c = t < 0.6 ? GREEN : t < 0.85 ? GREEN_D : WHITE;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;

      sizes[i] = Math.random() * 1.5 + 0.3;
    }

    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    pGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const pMat = new THREE.PointsMaterial({
      size: 0.28,
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // Torus (Rotating Ring)
    const torusGeo = new THREE.TorusGeometry(12, 0.06, 12, 70);
    const torusMat = new THREE.MeshBasicMaterial({ color: 0x00b894, wireframe: true, transparent: true, opacity: 0.22 });
    const torus = new THREE.Mesh(torusGeo, torusMat);
    torus.rotation.x = Math.PI / 3;
    scene.add(torus);

    // Second smaller Torus
    const torus2Geo = new THREE.TorusGeometry(8, 0.04, 8, 50);
    const torus2Mat = new THREE.MeshBasicMaterial({ color: 0x00ffd0, wireframe: true, transparent: true, opacity: 0.12 });
    const torus2 = new THREE.Mesh(torus2Geo, torus2Mat);
    torus2.rotation.x = Math.PI / 5;
    torus2.rotation.y = Math.PI / 4;
    scene.add(torus2);

    // Dodecahedrons and Icosahedrons
    const icoGeo = new THREE.IcosahedronGeometry(4.5, 1);
    const icoMat = new THREE.MeshBasicMaterial({ color: 0x00ffd0, wireframe: true, transparent: true, opacity: 0.1 });
    const ico = new THREE.Mesh(icoGeo, icoMat);
    ico.position.set(16, 7, -10);
    scene.add(ico);

    const octGeo = new THREE.OctahedronGeometry(3, 0);
    const octMat = new THREE.MeshBasicMaterial({ color: 0x7affb2, wireframe: true, transparent: true, opacity: 0.15 });
    const oct = new THREE.Mesh(octGeo, octMat);
    oct.position.set(-14, 11, -8);
    scene.add(oct);

    // Floating Cubes
    const cubes = [];
    for (let i = 0; i < 8; i++) {
      const size = Math.random() * 1.0 + 0.3;
      const cGeo = new THREE.BoxGeometry(size, size, size);
      const cMat = new THREE.MeshBasicMaterial({ color: 0x00ffd0, wireframe: true, transparent: true, opacity: 0.12 });
      const cube = new THREE.Mesh(cGeo, cMat);
      cube.position.set((Math.random() - 0.5) * 50, (Math.random() - 0.5) * 50, (Math.random() - 0.5) * 25);
      cube.userData = { rx: (Math.random() - 0.5) * 0.008, ry: (Math.random() - 0.5) * 0.008 };
      scene.add(cube);
      cubes.push(cube);
    }

    // Mouse relative camera motion
    let mouseX = 0, mouseY = 0;
    const handleMouseMove = (e) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    document.addEventListener('mousemove', handleMouseMove);

    const resizeThree = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', resizeThree);

    let animFrame;
    const animate = () => {
      particles.rotation.y += 0.0002;
      particles.rotation.x += 0.0001;

      torus.rotation.z += 0.002;
      torus.rotation.y += 0.0008;
      torus2.rotation.z -= 0.003;
      torus2.rotation.x += 0.0015;

      ico.rotation.x += 0.004;
      ico.rotation.y += 0.003;
      oct.rotation.y += 0.005;
      oct.rotation.x += 0.002;

      cubes.forEach(c => {
        c.rotation.x += c.userData.rx;
        c.rotation.y += c.userData.ry;
      });

      // Smooth camera interpolation
      camera.position.x += (mouseX * 2.5 - camera.position.x) * 0.035;
      camera.position.y += (-mouseY * 1.8 - camera.position.y) * 0.035;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
      animFrame = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeThree);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  // 3. 2D Interactive Ripple Engine
  useEffect(() => {
    const canvas = rippleRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const resizeRipple = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeRipple();
    window.addEventListener('resize', resizeRipple);

    const ripples = [];
    const trail = [];

    const handleClick = (e) => {
      // Spawn expanding shockwave ripples
      for (let i = 0; i < 3; i++) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 2,
          maxR: 120 + i * 40,
          life: 1,
          speed: 2.2 + i * 0.8
        });
      }
      // Spawn explosion sparks
      for (let i = 0; i < 18; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.2 + Math.random() * 4.0;
        trail.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.8,
          life: 1.0,
          decay: 0.012 + Math.random() * 0.015,
          size: 6 + Math.random() * 8,
          color: Math.random() > 0.45 ? '0, 255, 208' : '122, 255, 178'
        });
      }
    };

    let lastMx = window.innerWidth / 2;
    let lastMy = window.innerHeight / 2;
    let lastTime = performance.now();

    const handleMouseMove = (e) => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 1);
      const d = Math.hypot(e.clientX - lastMx, e.clientY - lastMy);
      
      // Calculate mouse velocity vector
      const vx = ((e.clientX - lastMx) / dt) * 3.5;
      const vy = ((e.clientY - lastMy) / dt) * 3.5;

      // Spawn expanding ripple wave if mouse moves fast
      if (d > 30) {
        ripples.push({
          x: e.clientX,
          y: e.clientY,
          r: 3,
          maxR: 50 + Math.random() * 30,
          life: 1,
          speed: 1.6
        });
      }

      // Spawn trailing glowing sparks inheriting velocity
      if (d > 3) {
        const count = Math.min(Math.floor(d / 6) + 1, 3);
        for (let i = 0; i < count; i++) {
          const px = -vx * 0.4 + (Math.random() - 0.5) * 0.8;
          const py = -vy * 0.4 + (Math.random() - 0.5) * 0.8;

          trail.push({
            x: e.clientX,
            y: e.clientY,
            vx: px,
            vy: py,
            life: 1.0,
            decay: 0.018 + Math.random() * 0.02,
            size: 5 + Math.random() * 7,
            color: Math.random() > 0.4 ? '0, 255, 208' : '122, 255, 178'
          });
        }
      }

      lastMx = e.clientX;
      lastMy = e.clientY;
      lastTime = now;
    };

    document.addEventListener('click', handleClick);
    document.addEventListener('mousemove', handleMouseMove);

    let animFrame;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Render ripples
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += r.speed;
        r.life = 1 - r.r / r.maxR;
        if (r.life <= 0) {
          ripples.splice(i, 1);
          continue;
        }
        ctx.beginPath();
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(0, 255, 208, ${r.life * 0.16})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
      }

      // Render sparks
      for (let i = trail.length - 1; i >= 0; i--) {
        const p = trail[i];
        p.x += p.vx;
        p.y += p.vy;
        
        // Fluid drag friction
        p.vx *= 0.94;
        p.vy *= 0.94;
        
        // Slow float up
        p.vy -= 0.035;

        p.life -= p.decay;
        if (p.life <= 0) {
          trail.splice(i, 1);
          continue;
        }

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
        grad.addColorStop(0, `rgba(${p.color}, ${p.life})`);
        grad.addColorStop(0.3, `rgba(${p.color}, ${p.life * 0.45})`);
        grad.addColorStop(1, `rgba(${p.color}, 0)`);
        
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      animFrame = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', resizeRipple);
      cancelAnimationFrame(animFrame);
    };
  }, []);

  return (
    <>
      <div className="fixed-background" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, overflow: 'hidden', pointerEvents: 'none' }}>
        <canvas ref={oceanRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }} />
        <canvas ref={threeRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', mixBlendMode: 'screen' }} />
      </div>
      <div className="foreground-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 9995, overflow: 'hidden', pointerEvents: 'none' }}>
        <canvas ref={rippleRef} style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', mixBlendMode: 'screen' }} />
      </div>
    </>
  );
}
