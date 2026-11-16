'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Planet3DProps {
  id: string;
  size: number;
  theme: 'cs2' | 'fc' | 'dota2' | 'val' | 'prime';
  hasRings?: boolean;
  isHovered?: boolean;
}

export default function Planet3D({ size, theme, hasRings = false, isHovered = false }: Planet3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Set up Scene, Camera, Renderer
    const width = size;
    const height = size;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 3.6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Procedural Planet Texture Generator based on theme
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const ctx = canvas.getContext('2d')!;

    if (theme === 'cs2') {
      // Mars / Desert / Tactical Dust texture
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#78350f');
      grad.addColorStop(0.25, '#d97706');
      grad.addColorStop(0.5, '#f59e0b');
      grad.addColorStop(0.75, '#b45309');
      grad.addColorStop(1, '#451a03');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Craters & dust storms
      for (let i = 0; i < 45; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = Math.random() * 28 + 4;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(69, 26, 3, 0.45)' : 'rgba(251, 191, 36, 0.4)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'fc') {
      // Lush Earth / Stadium Greens and Vibrant Oceans
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#042f2e');
      grad.addColorStop(0.3, '#0d9488');
      grad.addColorStop(0.5, '#10b981');
      grad.addColorStop(0.7, '#065f46');
      grad.addColorStop(1, '#022c22');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Continent patterns
      for (let i = 0; i < 35; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const rx = Math.random() * 45 + 15;
        const ry = Math.random() * 25 + 10;
        ctx.fillStyle = 'rgba(52, 211, 153, 0.45)';
        ctx.beginPath();
        ctx.ellipse(x, y, rx, ry, Math.random() * Math.PI, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'dota2') {
      // Lava & Volcanic Ancient Core
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#450a0a');
      grad.addColorStop(0.3, '#dc2626');
      grad.addColorStop(0.5, '#ef4444');
      grad.addColorStop(0.8, '#991b1b');
      grad.addColorStop(1, '#2a0808');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Magma cracks
      for (let i = 0; i < 50; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const r = Math.random() * 22 + 5;
        ctx.fillStyle = Math.random() > 0.4 ? 'rgba(254, 240, 138, 0.6)' : 'rgba(127, 29, 29, 0.6)';
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme === 'val') {
      // Radiant Cyber & Neon Pink/Purple gas giant
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#500724');
      grad.addColorStop(0.25, '#c026d3');
      grad.addColorStop(0.5, '#ec4899');
      grad.addColorStop(0.75, '#831843');
      grad.addColorStop(1, '#701a75');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Radiant energy streaks
      for (let i = 0; i < 18; i++) {
        const y = Math.random() * 256;
        ctx.fillStyle = 'rgba(244, 114, 182, 0.35)';
        ctx.fillRect(0, y, 512, Math.random() * 12 + 3);
      }
    } else {
      // Nexus Prime - Interstellar Gas Giant with Violet / Cyan / Blue bands
      const grad = ctx.createLinearGradient(0, 0, 0, 256);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.25, '#6366f1');
      grad.addColorStop(0.5, '#a855f7');
      grad.addColorStop(0.75, '#06b6d4');
      grad.addColorStop(1, '#0f172a');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 512, 256);

      // Cloud swirls
      for (let i = 0; i < 24; i++) {
        const y = Math.random() * 256;
        ctx.fillStyle = Math.random() > 0.5 ? 'rgba(167, 139, 250, 0.35)' : 'rgba(34, 211, 238, 0.35)';
        ctx.fillRect(0, y, 512, Math.random() * 14 + 4);
      }
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;

    // Create 3D Sphere Geometry
    const geometry = new THREE.SphereGeometry(1, 48, 48);
    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.7,
      metalness: 0.1,
    });
    const planetMesh = new THREE.Mesh(geometry, material);
    scene.add(planetMesh);

    // Planet Atmospheric Glow Mesh
    const glowGeometry = new THREE.SphereGeometry(1.04, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color:
        theme === 'cs2'
          ? 0xf59e0b
          : theme === 'fc'
          ? 0x10b981
          : theme === 'dota2'
          ? 0xef4444
          : theme === 'val'
          ? 0xec4899
          : 0xa855f7,
      transparent: true,
      opacity: 0.18,
      side: THREE.BackSide,
    });
    const glowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
    scene.add(glowMesh);

    // Saturn-like Rings (for Prime or FC)
    let ringMesh: THREE.Mesh | null = null;
    if (hasRings) {
      const ringGeo = new THREE.RingGeometry(1.25, 1.75, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        color: theme === 'prime' ? 0x06b6d4 : 0x10b981,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.65,
        roughness: 0.5,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      ringMesh.rotation.y = Math.PI / 9;
      scene.add(ringMesh);
    }

    // Dynamic Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.4);
    dirLight.position.set(3, 2, 3);
    scene.add(dirLight);

    const backlight = new THREE.DirectionalLight(0xa855f7, 0.5);
    backlight.position.set(-3, -1, -2);
    scene.add(backlight);

    // Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate planet on Y axis
      planetMesh.rotation.y += 0.007;

      if (ringMesh) {
        ringMesh.rotation.z += 0.003;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      geometry.dispose();
      material.dispose();
      texture.dispose();
    };
  }, [size, theme, hasRings]);

  return (
    <div
      ref={mountRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      className={`pointer-events-none transition-transform duration-300 ${
        isHovered ? 'scale-110' : 'scale-100'
      }`}
    />
  );
}
