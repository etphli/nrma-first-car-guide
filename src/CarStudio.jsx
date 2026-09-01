import React, { useEffect, useRef, useState } from 'react';

const HOTSPOTS = {
  cost: ['Cost', 'See the purchase price and the monthly reality together.'],
  safety: ['Safety', 'Check the inspection, tyres, brakes and ANCAP rating.'],
  history: ['History', 'Confirm ownership, finance, write-off and stolen status.'],
};

export default function CarStudio() {
  const mountRef = useRef(null);
  const [active, setActive] = useState('cost');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let frame = 0;
    let cleanup = () => {};
    let cancelled = false;

    import('three').then((THREE) => {
      if (cancelled || !mountRef.current) return;
      const mount = mountRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(28, 1, 0.1, 100);
      camera.position.set(6.8, 3.5, 7.8);
      camera.lookAt(0, 0.7, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      mount.appendChild(renderer.domElement);

      const car = new THREE.Group();
      scene.add(car);
      const dark = new THREE.MeshStandardMaterial({ color: 0x111315, roughness: 0.28, metalness: 0.72 });
      const glass = new THREE.MeshPhysicalMaterial({ color: 0x263039, roughness: 0.08, metalness: 0.1, transmission: 0.18, transparent: true, opacity: 0.88 });
      const rubber = new THREE.MeshStandardMaterial({ color: 0x090a0b, roughness: 0.92 });
      const alloy = new THREE.MeshStandardMaterial({ color: 0xb8bdc0, roughness: 0.35, metalness: 0.85 });
      const light = new THREE.MeshStandardMaterial({ color: 0xd8ff79, emissive: 0xbfff24, emissiveIntensity: 0.7 });

      const profile = new THREE.Shape();
      profile.moveTo(-2.28, 0.62);
      profile.lineTo(-2.22, 1.25);
      profile.quadraticCurveTo(-2.08, 1.48, -1.55, 1.55);
      profile.lineTo(-0.92, 2.05);
      profile.quadraticCurveTo(-0.76, 2.18, -0.48, 2.2);
      profile.lineTo(0.72, 2.16);
      profile.quadraticCurveTo(1.02, 2.1, 1.23, 1.78);
      profile.lineTo(1.55, 1.48);
      profile.lineTo(2.13, 1.38);
      profile.quadraticCurveTo(2.32, 1.3, 2.34, 1.06);
      profile.lineTo(2.28, 0.62);
      profile.closePath();
      const shellGeometry = new THREE.ExtrudeGeometry(profile, { depth: 1.78, bevelEnabled: true, bevelSegments: 5, steps: 1, bevelSize: 0.12, bevelThickness: 0.1 });
      shellGeometry.translate(0, 0, -0.89);
      car.add(new THREE.Mesh(shellGeometry, dark));

      const windowShape = new THREE.Shape();
      windowShape.moveTo(-0.8, 1.94);
      windowShape.lineTo(-0.4, 1.57);
      windowShape.lineTo(0.95, 1.57);
      windowShape.lineTo(0.62, 1.99);
      windowShape.closePath();
      const windows = new THREE.Mesh(new THREE.ExtrudeGeometry(windowShape, { depth: 0.035, bevelEnabled: false }), glass);
      windows.position.z = 0.9;
      car.add(windows);
      const windscreenShape = new THREE.Shape();
      windscreenShape.moveTo(0.7, 1.99);
      windscreenShape.lineTo(1.1, 1.55);
      windscreenShape.lineTo(1.47, 1.5);
      windscreenShape.lineTo(1.14, 1.9);
      windscreenShape.closePath();
      const windscreen = new THREE.Mesh(new THREE.ExtrudeGeometry(windscreenShape, { depth: 0.035, bevelEnabled: false }), glass);
      windscreen.position.z = 0.9;
      car.add(windscreen);

      [-1.45, 1.45].forEach((x) => [-1, 1].forEach((side) => {
        const wheel = new THREE.Group();
        const tyre = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.48, 0.3, 32), rubber);
        tyre.rotation.x = Math.PI / 2;
        const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.315, 12), alloy);
        hub.rotation.x = Math.PI / 2;
        wheel.add(tyre, hub);
        wheel.position.set(x, 0.52, side * 0.96);
        car.add(wheel);
      }));
      [-1, 1].forEach((side) => {
        const lamp = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.24, 0.42), light);
        lamp.position.set(2.29, 1.12, side * 0.58);
        car.add(lamp);
      });

      const floor = new THREE.Mesh(new THREE.CircleGeometry(4.25, 80), new THREE.MeshStandardMaterial({ color: 0xd8d9d7, roughness: 0.74, metalness: 0.12 }));
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);
      car.traverse((object) => { if (object.isMesh) object.castShadow = true; });
      scene.add(new THREE.HemisphereLight(0xffffff, 0x8c9397, 2.8));
      const key = new THREE.DirectionalLight(0xffffff, 5.5);
      key.position.set(3, 7, 5);
      key.castShadow = true;
      scene.add(key);
      const rim = new THREE.DirectionalLight(0xc8ff3d, 2.2);
      rim.position.set(-5, 3, -4);
      scene.add(rim);

      let dragging = false;
      let previousX = 0;
      let velocity = 0.0022;
      const down = (event) => { dragging = true; previousX = event.clientX; renderer.domElement.setPointerCapture?.(event.pointerId); };
      const move = (event) => { if (!dragging) return; const delta = event.clientX - previousX; previousX = event.clientX; velocity = delta * 0.008; car.rotation.y += velocity; };
      const up = () => { dragging = false; };
      renderer.domElement.addEventListener('pointerdown', down);
      renderer.domElement.addEventListener('pointermove', move);
      renderer.domElement.addEventListener('pointerup', up);
      renderer.domElement.addEventListener('pointercancel', up);

      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      resize();
      const animate = () => {
        if (!dragging) { car.rotation.y += velocity; velocity *= 0.985; if (Math.abs(velocity) < 0.0012) velocity = 0.0012; }
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      animate();
      setReady(true);
      cleanup = () => {
        observer.disconnect();
        cancelAnimationFrame(frame);
        renderer.domElement.removeEventListener('pointerdown', down);
        renderer.domElement.removeEventListener('pointermove', move);
        renderer.domElement.removeEventListener('pointerup', up);
        renderer.domElement.removeEventListener('pointercancel', up);
        renderer.dispose();
        mount.replaceChildren();
      };
    });
    return () => { cancelled = true; cleanup(); };
  }, []);

  return <div className="lb-car-studio">
    <div ref={mountRef} className="lb-car-canvas" aria-hidden="true" />
    {!ready && <div className="lb-car-loading">Building the car…</div>}
    <div className="lb-hotspots" aria-label="Explore the car checks">
      {Object.entries(HOTSPOTS).map(([key, value]) => <button key={key} type="button" className={active === key ? 'is-active' : ''} onClick={() => setActive(key)}><span>+</span>{value[0]}</button>)}
    </div>
    <div className="lb-hotspot-note" role="status"><strong>{HOTSPOTS[active][0]}</strong><span>{HOTSPOTS[active][1]}</span></div>
    <p className="lb-drag-hint">Drag the car to rotate</p>
  </div>;
}
