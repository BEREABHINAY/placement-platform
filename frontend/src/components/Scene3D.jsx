import { useEffect, useRef } from "react";
import * as THREE from "three";

// Signature hero visual: a slowly rotating field of points ("candidates") on
// concentric orbital rings, with faint trajectory lines converging toward a
// bright central node ("placement"). Reads as a mission-control star map,
// not decoration — every orbiting point is literally a candidate in flight
// toward an outcome, which is the whole thesis of the product.
export default function Scene3D({ className = "" }) {
  const mountRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 1.4, 9);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    // --- Central "placement" node ---
    const coreGeo = new THREE.IcosahedronGeometry(0.45, 1);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xffb447,
      wireframe: true,
      transparent: true,
      opacity: 0.9,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    const coreGlow = new THREE.PointLight(0xffb447, 8, 12);
    scene.add(coreGlow);

    // --- Orbital rings of candidate points ---
    const rings = [];
    const ringCount = 4;
    for (let r = 0; r < ringCount; r++) {
      const radius = 2 + r * 1.15;
      const pointCount = 18 + r * 10;
      const positions = new Float32Array(pointCount * 3);
      for (let i = 0; i < pointCount; i++) {
        const angle = (i / pointCount) * Math.PI * 2;
        const tilt = (r % 2 === 0 ? 1 : -1) * 0.35;
        positions[i * 3] = Math.cos(angle) * radius;
        positions[i * 3 + 1] = Math.sin(angle) * radius * tilt;
        positions[i * 3 + 2] = Math.sin(angle) * radius;
      }
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      const mat = new THREE.PointsMaterial({
        color: r % 2 === 0 ? 0x4fd8e8 : 0xe8ecf4,
        size: 0.06,
        transparent: true,
        opacity: 0.85,
      });
      const points = new THREE.Points(geo, mat);
      points.userData = { speed: 0.05 + r * 0.02, tiltAxis: r % 2 === 0 };
      scene.add(points);
      rings.push(points);
    }

    // --- Faint trajectory ring outlines ---
    rings.forEach((points, r) => {
      const radius = 2 + r * 1.15;
      const curve = new THREE.EllipseCurve(0, 0, radius, radius * 0.35 * (r % 2 === 0 ? 1 : -1));
      const pts = curve.getPoints(80).map((p) => new THREE.Vector3(p.x, p.y, 0));
      const geo = new THREE.BufferGeometry().setFromPoints(pts);
      const mat = new THREE.LineBasicMaterial({ color: 0x4fd8e8, transparent: true, opacity: 0.07 });
      const line = new THREE.LineLoop(geo, mat);
      line.rotation.x = Math.PI / 2.4;
      scene.add(line);
    });

    let frameId;
    const clock = new THREE.Clock();

    const animate = () => {
      const t = clock.getElapsedTime();
      core.rotation.y = t * 0.3;
      core.rotation.x = t * 0.15;
      coreGlow.intensity = 7 + Math.sin(t * 1.5) * 1.2;

      rings.forEach((points, r) => {
        points.rotation.y = t * points.userData.speed * (r % 2 === 0 ? 1 : -1);
      });

      scene.rotation.y = Math.sin(t * 0.05) * 0.15;
      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    // Respect reduced-motion users by freezing on first frame
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) cancelAnimationFrame(frameId);

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener("resize", handleResize);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className={className} aria-hidden="true" />;
}
