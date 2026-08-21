"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface DottedSurfaceProps {
  size?: number;
  opacity?: number;
  sizeAttenuation?: boolean;
  vertexColors?: boolean;
  className?: string;
}

/** Classic Efferd / three.js particle-wave motion. */
const AMOUNT_X = 80;
const AMOUNT_Z = 80;
const SEPARATION = 0.55;

const VERTEX_SHADER = `
attribute vec3 color;
varying vec3 vColor;

uniform float uSize;
uniform float uSizeAttenuation;

void main() {
  vColor = color;
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float pointSize = uSizeAttenuation > 0.5
    ? uSize * (280.0 / max(-mvPosition.z, 1.0))
    : uSize;

  gl_PointSize = clamp(pointSize, 1.0, 64.0);
}
`;

const FRAGMENT_SHADER = `
varying vec3 vColor;

uniform float uOpacity;
uniform float uVertexColors;
uniform vec3 uSolidColor;

void main() {
  vec2 p = gl_PointCoord - vec2(0.5);
  float dist = dot(p, p);
  if (dist > 0.25) discard;

  float alpha = smoothstep(0.25, 0.1, dist) * uOpacity;
  vec3 rgb = uVertexColors > 0.5 ? vColor : uSolidColor;
  gl_FragColor = vec4(rgb, alpha);
}
`;

function themeColors() {
  if (typeof window === "undefined") {
    return {
      primary: new THREE.Color("#3d3a35"),
      secondary: new THREE.Color("#6b6358"),
      accent: new THREE.Color("#8a7a5c"),
      solid: new THREE.Color("#4a4640"),
    };
  }
  const style = getComputedStyle(document.documentElement);
  const color = (token: string, fallback: string) =>
    new THREE.Color(style.getPropertyValue(token).trim() || fallback);
  return {
    primary: color("--ink", "#14120f"),
    secondary: color("--muted", "#5c574f"),
    accent: color("--gold-soft", "#8f6f12"),
    solid: color("--muted", "#5c574f"),
  };
}

export default function DottedSurface({
  size = 9,
  opacity = 0.56,
  sizeAttenuation = true,
  vertexColors = true,
  className = "",
}: DottedSurfaceProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const propsRef = useRef({ size, opacity, sizeAttenuation, vertexColors });
  propsRef.current = { size, opacity, sizeAttenuation, vertexColors };

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, 1, 1, 1000);
    camera.position.set(0, 80, 180);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    container.appendChild(renderer.domElement);

    const numParticles = AMOUNT_X * AMOUNT_Z;
    const positions = new Float32Array(numParticles * 3);
    const colors = new Float32Array(numParticles * 3);
    const { primary, secondary, accent, solid } = themeColors();

    let i = 0;
    let i3 = 0;
    for (let ix = 0; ix < AMOUNT_X; ix++) {
      for (let iz = 0; iz < AMOUNT_Z; iz++) {
        const x = SEPARATION * (ix - AMOUNT_X / 2);
        const z = SEPARATION * (iz - AMOUNT_Z / 2);
        positions[i3] = x;
        positions[i3 + 1] = 0;
        positions[i3 + 2] = z;

        const mix = (ix + iz) / (AMOUNT_X + AMOUNT_Z);
        const c = new THREE.Color().lerpColors(primary, secondary, mix);
        c.lerp(accent, 0.15);
        colors[i3] = c.r;
        colors[i3 + 1] = c.g;
        colors[i3 + 2] = c.b;

        i++;
        i3 = i * 3;
      }
    }

    // Scale world units so SEPARATION pattern matches classic demo proportions.
    const scale = 100;
    for (let j = 0; j < positions.length; j++) {
      positions[j] *= scale;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

    const live = propsRef.current;
    const material = new THREE.ShaderMaterial({
      uniforms: {
        uSize: { value: live.size },
        uOpacity: { value: live.opacity },
        uSizeAttenuation: { value: live.sizeAttenuation ? 1 : 0 },
        uVertexColors: { value: live.vertexColors ? 1 : 0 },
        uSolidColor: { value: solid },
      },
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthWrite: false,
      blending: THREE.NormalBlending,
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const resize = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(container);
    resize();

    let count = 0;
    let raf = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      const current = propsRef.current;
      material.uniforms.uSize.value = current.size;
      material.uniforms.uOpacity.value = current.opacity;
      material.uniforms.uSizeAttenuation.value = current.sizeAttenuation ? 1 : 0;
      material.uniforms.uVertexColors.value = current.vertexColors ? 1 : 0;

      if (!reducedMotion) {
        const attr = geometry.attributes.position as THREE.BufferAttribute;
        let i = 0;
        let i3 = 0;
        for (let ix = 0; ix < AMOUNT_X; ix++) {
          for (let iz = 0; iz < AMOUNT_Z; iz++) {
            // Same wave formula as the classic three.js particles / Efferd dotted surface.
            attr.array[i3 + 1] =
              Math.sin((ix + count) * 0.3) * 50 +
              Math.sin((iz + count) * 0.5) * 50;
            i++;
            i3 = i * 3;
          }
        }
        attr.needsUpdate = true;
        count += 0.05;
      }

      renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden
      style={{ position: "absolute", inset: 0, overflow: "hidden" }}
    />
  );
}
