'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

interface Planet3DProps {
  id: string;
  size: number;
  theme: 'cs2' | 'fc' | 'dota2' | 'val' | 'prime' | 'apex' | 'minecraft' | 'gta';
  hasRings?: boolean;
}

export default function Planet3D({ size, theme, hasRings = false }: Planet3DProps) {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Setup Scene, Camera, High-Precision WebGL Renderer
    const width = size;
    const height = size;
    const scene = new THREE.Scene();

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    camera.position.z = 4.2;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.25;
    container.appendChild(renderer.domElement);

    // 2. High-Resolution 1024x512 Procedural Surface & Bump Maps
    const surfCanvas = document.createElement('canvas');
    surfCanvas.width = 1024;
    surfCanvas.height = 512;
    const sCtx = surfCanvas.getContext('2d')!;

    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 1024;
    bumpCanvas.height = 512;
    const bCtx = bumpCanvas.getContext('2d')!;

    // Initial Base
    bCtx.fillStyle = '#808080';
    bCtx.fillRect(0, 0, 1024, 512);

    if (theme === 'cs2') {
      // Photorealistic Mars / Desert Canyon planet
      const grad = sCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#3b1807');
      grad.addColorStop(0.2, '#853d0d');
      grad.addColorStop(0.35, '#c25e1a');
      grad.addColorStop(0.5, '#ea580c');
      grad.addColorStop(0.65, '#b45309');
      grad.addColorStop(0.85, '#78350f');
      grad.addColorStop(1, '#291004');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 512);

      // Procedural Dune Ridges & Canyon Craters
      for (let i = 0; i < 90; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const r = Math.random() * 38 + 5;

        // Shadowed craters
        sCtx.fillStyle = 'rgba(41, 16, 4, 0.6)';
        sCtx.beginPath();
        sCtx.arc(x + 2, y + 2, r, 0, Math.PI * 2);
        sCtx.fill();

        // Highlight crater rim
        sCtx.fillStyle = 'rgba(254, 215, 170, 0.5)';
        sCtx.beginPath();
        sCtx.arc(x, y, r * 0.85, 0, Math.PI * 2);
        sCtx.fill();

        // Bump map indentation
        bCtx.fillStyle = '#222222';
        bCtx.beginPath();
        bCtx.arc(x, y, r, 0, Math.PI * 2);
        bCtx.fill();
        bCtx.fillStyle = '#ffffff';
        bCtx.beginPath();
        bCtx.arc(x - 2, y - 2, r * 0.8, 0, Math.PI * 2);
        bCtx.fill();
      }
    } else if (theme === 'fc') {
      // Earth-like Ocean + Continents + Stadium Field Geometry
      sCtx.fillStyle = '#06283d';
      sCtx.fillRect(0, 0, 1024, 512);

      // Deep Ocean vs Shallow Coastlines
      for (let i = 0; i < 25; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const rx = Math.random() * 95 + 40;
        const ry = Math.random() * 65 + 25;

        // Shallow Turquoise waters
        sCtx.fillStyle = 'rgba(20, 184, 166, 0.45)';
        sCtx.beginPath();
        sCtx.ellipse(x, y, rx + 15, ry + 15, 0, 0, Math.PI * 2);
        sCtx.fill();

        // Lush Emerald Landmass
        sCtx.fillStyle = '#059669';
        sCtx.beginPath();
        sCtx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        sCtx.fill();

        // Mountainous peaks
        sCtx.fillStyle = '#047857';
        sCtx.beginPath();
        sCtx.ellipse(x, y, rx * 0.6, ry * 0.6, 0, 0, Math.PI * 2);
        sCtx.fill();

        // Bump elevation for land
        bCtx.fillStyle = '#cccccc';
        bCtx.beginPath();
        bCtx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        bCtx.fill();
      }
    } else if (theme === 'dota2') {
      // Dark Volcanic Obsidian with Glowing Molten Magma Veins
      sCtx.fillStyle = '#1c0707';
      sCtx.fillRect(0, 0, 1024, 512);

      // Obsidian Basalt plates
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const rx = Math.random() * 70 + 20;
        const ry = Math.random() * 45 + 15;
        sCtx.fillStyle = '#3f0c0c';
        sCtx.beginPath();
        sCtx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        sCtx.fill();

        bCtx.fillStyle = '#ffffff';
        bCtx.beginPath();
        bCtx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
        bCtx.fill();
      }

      // Molten Glowing Lava Rivers
      sCtx.lineWidth = 4;
      sCtx.strokeStyle = '#f97316';
      sCtx.shadowColor = '#ef4444';
      sCtx.shadowBlur = 12;
      for (let j = 0; j < 18; j++) {
        sCtx.beginPath();
        let curX = Math.random() * 1024;
        let curY = Math.random() * 512;
        sCtx.moveTo(curX, curY);
        for (let step = 0; step < 6; step++) {
          curX += (Math.random() - 0.5) * 110;
          curY += (Math.random() - 0.5) * 80;
          sCtx.lineTo(curX, curY);
        }
        sCtx.stroke();
      }
      sCtx.shadowBlur = 0;
    } else if (theme === 'val') {
      // Radiant Cyber Gas Giant with Glowing Aurora Streaks
      const grad = sCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#2e0220');
      grad.addColorStop(0.2, '#701a75');
      grad.addColorStop(0.4, '#c026d3');
      grad.addColorStop(0.6, '#ec4899');
      grad.addColorStop(0.8, '#a21caf');
      grad.addColorStop(1, '#3b0730');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 512);

      // Luminous storm cyclones
      for (let i = 0; i < 30; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        sCtx.fillStyle = 'rgba(244, 114, 182, 0.4)';
        sCtx.beginPath();
        sCtx.arc(x, y, Math.random() * 30 + 10, 0, Math.PI * 2);
        sCtx.fill();
      }
    } else if (theme === 'apex') {
      // Storm Point / Thunder Electric World
      const grad = sCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#0c4a6e');
      grad.addColorStop(0.3, '#0284c7');
      grad.addColorStop(0.5, '#38bdf8');
      grad.addColorStop(0.7, '#0ea5e9');
      grad.addColorStop(1, '#082f49');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 512);

      // Electric storm vortexes
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        sCtx.fillStyle = 'rgba(255, 255, 255, 0.4)';
        sCtx.beginPath();
        sCtx.arc(x, y, Math.random() * 25 + 5, 0, Math.PI * 2);
        sCtx.fill();
      }
    } else if (theme === 'minecraft') {
      // Voxel Emerald / Terra World
      sCtx.fillStyle = '#14532d';
      sCtx.fillRect(0, 0, 1024, 512);

      for (let x = 0; x < 1024; x += 32) {
        for (let y = 0; y < 512; y += 32) {
          const isWater = Math.random() > 0.6;
          sCtx.fillStyle = isWater ? '#0369a1' : (Math.random() > 0.5 ? '#15803d' : '#166534');
          sCtx.fillRect(x, y, 32, 32);
        }
      }
    } else if (theme === 'gta') {
      // Neon Metropolis Sunset
      const grad = sCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#4c0519');
      grad.addColorStop(0.3, '#9f1239');
      grad.addColorStop(0.5, '#f43f5e');
      grad.addColorStop(0.7, '#fb923c');
      grad.addColorStop(1, '#1c1917');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 512);

      // City light clusters
      for (let i = 0; i < 70; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        sCtx.fillStyle = 'rgba(254, 240, 138, 0.6)';
        sCtx.fillRect(x, y, 4, 4);
      }
    } else {
      // Nexus Prime - Massive Jupiter-style Ringed Gas Giant
      const grad = sCtx.createLinearGradient(0, 0, 0, 512);
      grad.addColorStop(0, '#0f172a');
      grad.addColorStop(0.15, '#3b0764');
      grad.addColorStop(0.3, '#7c3aed');
      grad.addColorStop(0.45, '#38bdf8');
      grad.addColorStop(0.6, '#9333ea');
      grad.addColorStop(0.75, '#0284c7');
      grad.addColorStop(0.9, '#1e1b4b');
      grad.addColorStop(1, '#020617');
      sCtx.fillStyle = grad;
      sCtx.fillRect(0, 0, 1024, 512);

      // Atmospheric Bands and Great Purple Storm Spot
      for (let y = 0; y < 512; y += 16) {
        sCtx.fillStyle = y % 32 === 0 ? 'rgba(255, 255, 255, 0.12)' : 'rgba(0, 0, 0, 0.2)';
        sCtx.fillRect(0, y, 1024, 8);
      }
      // Great Red/Purple Spot
      sCtx.fillStyle = '#a855f7';
      sCtx.beginPath();
      sCtx.ellipse(350, 240, 65, 38, 0, 0, Math.PI * 2);
      sCtx.fill();
    }

    const surfTexture = new THREE.CanvasTexture(surfCanvas);
    surfTexture.wrapS = THREE.RepeatWrapping;
    surfTexture.wrapT = THREE.ClampToEdgeWrapping;

    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);
    bumpTexture.wrapS = THREE.RepeatWrapping;

    // 3. Planet Mesh with Realistic Standard PBR Material
    const planetGeometry = new THREE.SphereGeometry(1, 64, 64);
    const planetMaterial = new THREE.MeshStandardMaterial({
      map: surfTexture,
      bumpMap: bumpTexture,
      bumpScale: 0.04,
      roughness: theme === 'fc' ? 0.45 : theme === 'dota2' ? 0.75 : 0.6,
      metalness: theme === 'val' ? 0.25 : 0.08,
    });
    const planetMesh = new THREE.Mesh(planetGeometry, planetMaterial);
    scene.add(planetMesh);

    // 4. Photorealistic Cloud Layer for Earth-like / Living worlds (FC & Prime)
    let cloudsMesh: THREE.Mesh | null = null;
    if (theme === 'fc' || theme === 'prime') {
      const cloudCanvas = document.createElement('canvas');
      cloudCanvas.width = 512;
      cloudCanvas.height = 256;
      const cCtx = cloudCanvas.getContext('2d')!;
      cCtx.fillStyle = '#000000';
      cCtx.fillRect(0, 0, 512, 256);

      // Fluffy white procedural clouds
      for (let c = 0; c < 45; c++) {
        const cx = Math.random() * 512;
        const cy = Math.random() * 256;
        cCtx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        cCtx.beginPath();
        cCtx.arc(cx, cy, Math.random() * 32 + 10, 0, Math.PI * 2);
        cCtx.fill();
      }

      const cloudTex = new THREE.CanvasTexture(cloudCanvas);
      const cloudGeo = new THREE.SphereGeometry(1.025, 48, 48);
      const cloudMat = new THREE.MeshStandardMaterial({
        alphaMap: cloudTex,
        transparent: true,
        opacity: 0.55,
        color: 0xffffff,
        roughness: 1,
      });
      cloudsMesh = new THREE.Mesh(cloudGeo, cloudMat);
      scene.add(cloudsMesh);
    }

    // 5. Soft Atmospheric Rim Lighting (No box clipping)
    const atmosphereColor =
      theme === 'cs2'
        ? 0xf59e0b
        : theme === 'fc'
        ? 0x10b981
        : theme === 'dota2'
        ? 0xef4444
        : theme === 'val'
        ? 0xec4899
        : 0xa855f7;

    const atmosphereGeo = new THREE.SphereGeometry(1.035, 32, 32);
    const atmosphereMat = new THREE.MeshBasicMaterial({
      color: atmosphereColor,
      transparent: true,
      opacity: 0.15,
      side: THREE.BackSide,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeo, atmosphereMat);
    scene.add(atmosphereMesh);

    // 6. Photorealistic Dense Planetary Rings
    let ringMesh: THREE.Mesh | null = null;
    if (hasRings) {
      const ringCanvas = document.createElement('canvas');
      ringCanvas.width = 256;
      ringCanvas.height = 1;
      const rCtx = ringCanvas.getContext('2d')!;
      const rGrad = rCtx.createLinearGradient(0, 0, 256, 0);
      rGrad.addColorStop(0, 'rgba(0,0,0,0)');
      rGrad.addColorStop(0.2, theme === 'prime' ? 'rgba(34,211,238,0.7)' : 'rgba(52,211,153,0.7)');
      rGrad.addColorStop(0.4, 'rgba(0,0,0,0.2)'); // Cassini division
      rGrad.addColorStop(0.6, theme === 'prime' ? 'rgba(168,85,247,0.8)' : 'rgba(16,185,129,0.8)');
      rGrad.addColorStop(0.85, theme === 'prime' ? 'rgba(129,140,248,0.5)' : 'rgba(110,231,183,0.5)');
      rGrad.addColorStop(1, 'rgba(0,0,0,0)');
      rCtx.fillStyle = rGrad;
      rCtx.fillRect(0, 0, 256, 1);

      const ringTex = new THREE.CanvasTexture(ringCanvas);
      const ringGeo = new THREE.RingGeometry(1.2, 1.6, 64);
      const ringMat = new THREE.MeshStandardMaterial({
        map: ringTex,
        side: THREE.DoubleSide,
        transparent: true,
        roughness: 0.6,
        depthWrite: false,
      });
      ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2.3;
      ringMesh.rotation.y = Math.PI / 7;
      scene.add(ringMesh);
    }

    // 7. Space Sunlight & Soft Celestial Bounce Fill
    const sunLight = new THREE.DirectionalLight(0xffffff, 2.2);
    sunLight.position.set(4, 2.5, 3.5);
    scene.add(sunLight);

    const rimLight = new THREE.DirectionalLight(
      theme === 'fc' ? 0x2dd4bf : theme === 'cs2' ? 0xfbbf24 : 0x818cf8,
      0.65
    );
    rimLight.position.set(-4, -2, -3);
    scene.add(rimLight);

    const spaceAmbient = new THREE.AmbientLight(0x0f172a, 0.4);
    scene.add(spaceAmbient);

    // 8. Animation Loop
    let animId: number;
    const animate = () => {
      animId = requestAnimationFrame(animate);

      // Planet rotation
      planetMesh.rotation.y += 0.005;

      // Cloud drift slightly faster than planet surface
      if (cloudsMesh) {
        cloudsMesh.rotation.y += 0.007;
      }

      if (ringMesh) {
        ringMesh.rotation.z += 0.002;
      }

      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
      planetGeometry.dispose();
      planetMaterial.dispose();
      surfTexture.dispose();
      bumpTexture.dispose();
      atmosphereMat.dispose();
    };
  }, [size, theme, hasRings]);

  return (
    <div
      ref={mountRef}
      style={{ width: `${size}px`, height: `${size}px` }}
      className="pointer-events-none transition-transform duration-300 group-hover:scale-110"
    />
  );
}
