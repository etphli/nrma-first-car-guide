import React, { useEffect, useRef, useState } from 'react';

const HOTSPOTS = {
  cost: ['Cost', 'See the purchase price and the monthly reality together.', '/costs', 'Open cost lab'],
  safety: ['Safety', 'Check the inspection, tyres, brakes and ANCAP rating.', '/protect', 'Open buyer checklist'],
  history: ['History', 'Confirm ownership, finance, write-off and stolen status.', '/mistakes', 'See the warning signs'],
};

export default function CarStudio() {
  const mountRef = useRef(null);
  const [active, setActive] = useState('cost');
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [paused, setPaused] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const pausedRef = useRef(paused);

  useEffect(() => {
    let frame = 0;
    let cleanup = () => {};
    let cancelled = false;
    let modelReady = false;
    const loadTimeout = window.setTimeout(() => { if (!cancelled && !modelReady) setFailed(true); }, 15000);

    Promise.all([import('three'), import('three/addons/loaders/GLTFLoader.js'), import('three/addons/libs/meshopt_decoder.module.js')]).then(([THREE, { GLTFLoader }, { MeshoptDecoder }]) => {
      if (cancelled || !mountRef.current) return;
      const mount = mountRef.current;
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(31, 1, 0.1, 100);
      camera.position.set(5.8, 2.65, 6.4);
      camera.lookAt(0, 0.78, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.15;
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFShadowMap;
      mount.appendChild(renderer.domElement);

      const turntable = new THREE.Group();
      scene.add(turntable);
      const floor = new THREE.Mesh(new THREE.CircleGeometry(4.2, 96), new THREE.MeshStandardMaterial({ color: 0xd9dcda, roughness: 0.38, metalness: 0.16 }));
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);
      const ring = new THREE.Mesh(new THREE.RingGeometry(4.05, 4.09, 96), new THREE.MeshBasicMaterial({ color: 0x7d8380, transparent: true, opacity: 0.5, side: THREE.DoubleSide }));
      ring.rotation.x = -Math.PI / 2;
      ring.position.y = 0.008;
      scene.add(ring);
      scene.add(new THREE.HemisphereLight(0xffffff, 0x687078, 3.6));
      const key = new THREE.DirectionalLight(0xffffff, 6.8);
      key.position.set(4, 8, 6);
      key.castShadow = true;
      key.shadow.mapSize.set(2048, 2048);
      scene.add(key);
      const fill = new THREE.DirectionalLight(0xbed7ff, 3.2);
      fill.position.set(-5, 4, 4);
      scene.add(fill);
      const rim = new THREE.DirectionalLight(0xc8ff3d, 4.6);
      rim.position.set(-3, 3, -5);
      scene.add(rim);

      const loader = new GLTFLoader();
      loader.setMeshoptDecoder(MeshoptDecoder);
      loader.load('/assets/lowbeam-sedan.glb', (gltf) => {
        if (cancelled) return;
        const model = gltf.scene;
        const bodyPaint = new THREE.MeshPhysicalMaterial({ color: 0x173f46, metalness: 0.74, roughness: 0.18, clearcoat: 1, clearcoatRoughness: 0.1 });
        const wheelMetal = new THREE.MeshStandardMaterial({ color: 0x262b2f, metalness: 0.92, roughness: 0.22 });
        const brakeLime = new THREE.MeshStandardMaterial({ color: 0xd7ff4b, metalness: 0.28, roughness: 0.32 });
        model.traverse((object) => {
          if (object.isCamera || object.isLight) object.visible = false;
          if (!object.isMesh) return;
          object.castShadow = true;
          object.receiveShadow = true;
          const originalMaterials = Array.isArray(object.material) ? object.material : [object.material];
          const materials = originalMaterials.map((material) => {
            if (/white|livery|body|logo|zx/i.test(material?.name || '')) return bodyPaint;
            if (/rim/i.test(material?.name || '')) return wheelMetal;
            if (/caliper/i.test(material?.name || '')) return brakeLime;
            return material;
          });
          object.material = Array.isArray(object.material) ? materials : materials[0];
          materials.forEach((material) => {
            if (!material) return;
            material.envMapIntensity = 1.25;
          });
        });
        const initialBox = new THREE.Box3().setFromObject(model);
        const initialSize = initialBox.getSize(new THREE.Vector3());
        model.scale.multiplyScalar(5.35 / Math.max(initialSize.x, initialSize.z));
        const box = new THREE.Box3().setFromObject(model);
        const centre = box.getCenter(new THREE.Vector3());
        model.position.set(-centre.x, -box.min.y, -centre.z);
        model.rotation.y = -0.62;
        turntable.add(model);
        modelReady = true;
        window.clearTimeout(loadTimeout);
        setFailed(false);
        setReady(true);
        setProgress(100);
      }, (event) => {
        if (!cancelled && event.total) setProgress(Math.round((event.loaded / event.total) * 100));
      }, () => { if (!cancelled) { window.clearTimeout(loadTimeout); setFailed(true); } });

      let dragging = false;
      let previousX = 0;
      let velocity = 0.0014;
      const down = (event) => { dragging = true; previousX = event.clientX; renderer.domElement.setPointerCapture?.(event.pointerId); };
      const move = (event) => { if (!dragging) return; const delta = event.clientX - previousX; previousX = event.clientX; velocity = delta * 0.007; turntable.rotation.y += velocity; };
      const up = () => { dragging = false; };
      renderer.domElement.addEventListener('pointerdown', down);
      renderer.domElement.addEventListener('pointermove', move);
      renderer.domElement.addEventListener('pointerup', up);
      renderer.domElement.addEventListener('pointercancel', up);
      const resize = () => {
        const { width, height } = mount.getBoundingClientRect();
        renderer.setSize(width, height, false);
        camera.aspect = width / Math.max(height, 1);
        const framing = Math.max(1, 1.35 / Math.max(camera.aspect, 0.1));
        camera.position.set(5.8 * framing, 0.78 + 1.87 * framing, 6.4 * framing);
        camera.lookAt(0, 0.78, 0);
        camera.updateProjectionMatrix();
      };
      const observer = new ResizeObserver(resize);
      observer.observe(mount);
      resize();
      const animate = () => {
        if (!dragging && modelReady && !pausedRef.current) { turntable.rotation.y += velocity; velocity *= 0.988; if (Math.abs(velocity) < 0.0007) velocity = 0.0007; }
        renderer.render(scene, camera);
        frame = requestAnimationFrame(animate);
      };
      animate();
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
    }).catch(() => { if (!cancelled) { window.clearTimeout(loadTimeout); setFailed(true); } });
    return () => { cancelled = true; window.clearTimeout(loadTimeout); cleanup(); };
  }, []);

  return <div className="lb-car-studio">
    <div ref={mountRef} className="lb-car-canvas" aria-hidden="true" />
    {!ready && <div className="lb-car-fallback"><img src="/assets/lowbeam-car.png" alt="Black hatchback illustration" /><span role="status">{failed ? 'Showing a still image. Explore the checks below.' : `Loading interactive car${progress > 0 ? ` · ${progress}%` : ''}`}</span></div>}
    <span className="lb-car-caption">Illustration · not your selected vehicle</span>
    <div className="lb-hotspots" aria-label="Explore the car checks">{Object.entries(HOTSPOTS).map(([key, value]) => <button key={key} type="button" aria-pressed={active === key} className={active === key ? 'is-active' : ''} onClick={() => setActive(key)}><span>+</span>{value[0]}</button>)}</div>
    <div className="lb-hotspot-note" role="status"><strong>{HOTSPOTS[active][0]}</strong><span>{HOTSPOTS[active][1]}</span><a href={HOTSPOTS[active][2]}>{HOTSPOTS[active][3]} <b>→</b></a></div>
    {ready && <div className="lb-car-controls"><span>Drag to rotate</span><button type="button" aria-pressed={paused} onClick={() => { pausedRef.current = !paused; setPaused(!paused); }}>{paused ? 'Resume rotation' : 'Pause rotation'}</button></div>}
  </div>;
}
