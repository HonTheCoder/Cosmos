import { Suspense, useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { journeyPlanets, type PlanetInfo } from '../data/planets';
import type { MutableRefObject } from 'react';

const glowVertex = `
  varying vec3 vNormalWorld;
  varying vec3 vPositionWorld;
  void main() {
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vPositionWorld = worldPos.xyz;
    vNormalWorld = normalize(mat3(modelMatrix) * normal);
    gl_Position = projectionMatrix * viewMatrix * worldPos;
  }
`;
const glowFragment = `
  uniform vec3 glowColor;
  varying vec3 vNormalWorld;
  varying vec3 vPositionWorld;
  void main() {
    vec3 eye = normalize(cameraPosition - vPositionWorld);
    float rim = pow(1.0 - abs(dot(normalize(vNormalWorld), eye)), 4.5);
    gl_FragColor = vec4(glowColor, rim * 0.62);
  }
`;
const ringVertex = `
  varying vec2 vPosition;
  void main() {
    vPosition = position.xy;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;
const ringFragment = `
  varying vec2 vPosition;
  uniform float innerRadius;
  uniform float outerRadius;
  uniform vec3 ringColor;
  void main() {
    float r = length(vPosition);
    float t = (r - innerRadius) / (outerRadius - innerRadius);
    float bands = 0.64 + 0.14*sin(t*125.0) + 0.12*sin(t*297.0) + 0.06*sin(t*631.0);
    float cassini = 1.0 - 0.91 * (smoothstep(.53,.545,t) - smoothstep(.585,.60,t));
    float edge = smoothstep(0.0,.065,t) * (1.0 - smoothstep(.91,1.0,t));
    float translucent = edge * bands * cassini * (0.65 - t * .18);
    gl_FragColor = vec4(ringColor * (0.89 + 0.17 * sin(t*35.0)), translucent);
  }
`;

function Planet({ planet, motion, active, inspectMode }: { planet: PlanetInfo; motion: boolean; active: boolean; inspectMode: boolean }) {
  const materialTexture = useTexture(planet.texture);
  const clouds = useTexture('/assets/planets/earth-clouds.png');
  const hasRelief = ['mercury', 'venus', 'mars'].includes(planet.id);
  const relief = useTexture(hasRelief ? `/assets/planets/${planet.id}-normal.webp` : planet.texture);
  const surface = useRef<THREE.Mesh>(null);
  const group = useRef<THREE.Group>(null);
  const cloudMesh = useRef<THREE.Mesh>(null);
  const dragging = useRef(false);
  const prevX = useRef(0);
  const tiltRadians = THREE.MathUtils.degToRad(planet.tilt);
  useEffect(() => {
    materialTexture.colorSpace = THREE.SRGBColorSpace;
    materialTexture.anisotropy = 8;
    materialTexture.needsUpdate = true;
    if (hasRelief) { relief.colorSpace = THREE.NoColorSpace; relief.needsUpdate = true; }
  }, [materialTexture, relief, hasRelief]);
  const glowUniforms = useMemo(() => ({ glowColor: { value: new THREE.Color(planet.color) } }), [planet.color]);
  const ringUniforms = useMemo(() => ({
    innerRadius: { value: planet.radius * 1.23 }, outerRadius: { value: planet.radius * 2.25 },
    ringColor: { value: new THREE.Color('#ecd6ad') },
  }), [planet.radius]);

  useFrame((_state, delta) => {
    if (surface.current && motion && !dragging.current) {
      surface.current.rotation.y += delta * planet.rotationSpeed * (active ? 1.35 : .7);
    }
    if (group.current && motion) group.current.rotation.y += delta * .002;
    if (cloudMesh.current && motion) cloudMesh.current.rotation.y += delta * .086;
  });

  return (
    <group ref={group} position={planet.position} rotation={[0, 0, tiltRadians]}>
      <mesh
        ref={surface}
        onPointerDown={(event) => {
          if (!active) return;
          event.stopPropagation(); dragging.current = true; prevX.current = event.clientX;
          (event.target as HTMLElement).setPointerCapture?.(event.pointerId);
          document.body.classList.add('is-dragging');
        }}
        onPointerMove={(event) => {
          if (!dragging.current || !surface.current) return;
          surface.current.rotation.y += (event.clientX - prevX.current) * (inspectMode ? .013 : .008);
          prevX.current = event.clientX;
        }}
        onPointerUp={(event) => {
          dragging.current = false;
          (event.target as HTMLElement).releasePointerCapture?.(event.pointerId);
          document.body.classList.remove('is-dragging');
        }}
        onPointerCancel={() => {
          dragging.current = false; document.body.classList.remove('is-dragging');
        }}
      >
        <sphereGeometry args={[planet.radius, 128, 96]} />
        <meshStandardMaterial map={materialTexture} normalMap={hasRelief ? relief : null} normalScale={new THREE.Vector2(.65, .65)} roughness={planet.id === 'earth' ? .78 : .94} metalness={0} />
      </mesh>
      {planet.id === 'earth' && <mesh ref={cloudMesh} scale={1.018}>
        <sphereGeometry args={[planet.radius, 128, 96]} />
        <meshStandardMaterial map={clouds} transparent opacity={.76} depthWrite={false} roughness={1} />
      </mesh>}
      <mesh scale={1.075}>
        <sphereGeometry args={[planet.radius, 64, 40]} />
        <shaderMaterial
          vertexShader={glowVertex} fragmentShader={glowFragment}
          uniforms={glowUniforms} transparent depthWrite={false}
          side={THREE.BackSide} blending={THREE.AdditiveBlending}
        />
      </mesh>
      {planet.id === 'saturn' && (
        <mesh rotation={[-Math.PI / 2, 0, .08]}>
          <ringGeometry args={[planet.radius * 1.23, planet.radius * 2.25, 256]} />
          <shaderMaterial
            vertexShader={ringVertex} fragmentShader={ringFragment} uniforms={ringUniforms}
            transparent depthWrite={false} side={THREE.DoubleSide}
          />
        </mesh>
      )}
      {planet.id === 'uranus' && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[planet.radius * 1.45, planet.radius * 1.85, 128]} />
          <meshBasicMaterial color="#b8d9d9" transparent opacity={.17} side={THREE.DoubleSide} depthWrite={false} />
        </mesh>
      )}
    </group>
  );
}

function Starfield({ motion, progressRef }: { motion: boolean; progressRef: MutableRefObject<number> }) {
  const points = useRef<THREE.Points>(null);
  const geometry = useMemo(() => {
    const coords = new Float32Array(4200 * 3);
    let seed = 2459;
    const rand = () => { seed = (seed * 16807) % 2147483647; return (seed - 1) / 2147483646; };
    for (let i = 0; i < 4200; i++) {
      const side = rand() > .5 ? 1 : -1;
      coords[i * 3] = (rand() * 115 + 8) * side;
      coords[i * 3 + 1] = (rand() - .5) * 155;
      coords[i * 3 + 2] = 55 - rand() * 355;
    }
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(coords, 3));
    return g;
  }, []);
  useEffect(() => () => geometry.dispose(), [geometry]);
  useFrame((_state, delta) => {
    if (points.current && motion) points.current.rotation.z += delta * .00015;
    if (points.current) {
      const material = points.current.material as THREE.PointsMaterial;
      const p = progressRef.current % 1;
      const traveling = Math.max(0, Math.sin(p * Math.PI));
      material.opacity = .6 + traveling * .2;
    }
  });
  return (
    <points ref={points} geometry={geometry} frustumCulled={false}>
      <pointsMaterial color="#c7d9ff" size={.16} transparent opacity={.65} sizeAttenuation depthWrite={false} />
    </points>
  );
}

function FlightCamera({ progressRef, motion, inspectMode, zoom }: { progressRef: MutableRefObject<number>; motion: boolean; inspectMode: boolean; zoom: number }) {
  const { camera, size } = useThree();
  const viewTarget = useRef(new THREE.Vector3());
  const desiredPosition = useRef(new THREE.Vector3());
  const desiredLookAt = useRef(new THREE.Vector3());
  const pointer = useRef({ x: 0, y: 0 });
  const mobileFrames = useMemo(() => journeyPlanets.map(planet => {
    const [x,y,z] = planet.position;
    const distance = planet.id === 'saturn' ? planet.radius * 9.2 + 3 : Math.max(15,planet.radius * 4.6 + 3);
    return {pos:new THREE.Vector3(x, y+.12, z+distance), look:new THREE.Vector3(x,y-1.25,z)};
  }),[]);
  const frames = useMemo(() => journeyPlanets.map(planet => {
    const [x, y, z] = planet.position;
    return {
      pos: new THREE.Vector3(x + .5, y + .7, z + Math.max(planet.radius * 3.25 + 3.2, 11.6)),
      look: new THREE.Vector3(x - 2.9, y + .15, z),
    };
  }), []);
  useEffect(() => {
    camera.position.copy(frames[0].pos);
    viewTarget.current.copy(frames[0].look);
    camera.lookAt(viewTarget.current);
    const onMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - .5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - .5) * 2;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [camera, frames]);
  useFrame((_state, delta) => {
    const progress = THREE.MathUtils.clamp(progressRef.current, 0, journeyPlanets.length - 1);
    const index = Math.min(journeyPlanets.length - 2, Math.floor(progress));
    const local = progress - index;
    const linear = THREE.MathUtils.clamp((local - .34) / .62, 0, 1);
    const mix = linear * linear * (3 - 2 * linear);
    const isMobile = size.width < 760;
    const stops = isMobile ? mobileFrames : frames;
    desiredPosition.current.copy(stops[index].pos).lerp(stops[index + 1].pos, mix);
    desiredLookAt.current.copy(stops[index].look).lerp(stops[index + 1].look, mix);
    // Sweeping, carefully staged approach rather than a straight linear interpolation.
    const arc = Math.sin(Math.PI * mix);
    const side = index % 2 === 0 ? 1 : -1;
    desiredPosition.current.x += arc * side * 7.2;
    desiredPosition.current.y += arc * (2.7 + 1.2 * Math.sin(index * 1.7));
    desiredPosition.current.z -= arc * 8.8;
    desiredLookAt.current.x += arc * side * 1.7;
    desiredLookAt.current.y += arc * .7;
    // A subtle observational orbit when near a planet.
    const arrival = Math.max(0, 1 - linear * 4);
    desiredPosition.current.x += Math.sin(local * Math.PI * 1.5) * arrival * 1.1;
    if (isMobile && inspectMode) {
      const planet = journeyPlanets[Math.min(journeyPlanets.length - 1,Math.floor(progress+.17))];
      desiredPosition.current.set(planet.position[0],planet.position[1]+.12,planet.position[2] +
        (planet.id === 'saturn' ? planet.radius*9.2+3 : Math.max(15,planet.radius*4.6+3)) / zoom);
      desiredLookAt.current.set(planet.position[0],planet.position[1]-1.25,planet.position[2]);
    }
    const parallax = motion ? 1 : 0;
    desiredPosition.current.x += pointer.current.x * .33 * parallax * (inspectMode ? .2 : 1);
    desiredPosition.current.y -= pointer.current.y * .26 * parallax * (inspectMode ? .2 : 1);
    desiredLookAt.current.x += pointer.current.x * .17 * parallax;
    desiredLookAt.current.y -= pointer.current.y * .15 * parallax;
    const factor = motion ? 1 - Math.exp(-Math.min(delta, .06) * 3.8) : 1;
    camera.position.lerp(desiredPosition.current, factor);
    viewTarget.current.lerp(desiredLookAt.current, factor);
    camera.lookAt(viewTarget.current);
    if (camera instanceof THREE.PerspectiveCamera) {
      const travel = Math.sin(mix * Math.PI);
      const fov = (isMobile ? 55 : 43) + travel * (isMobile ? 9 : 13);
      if (Math.abs(camera.fov - fov) > .02) { camera.fov = THREE.MathUtils.lerp(camera.fov, fov, factor); camera.updateProjectionMatrix(); }
    }
  });
  return null;
}


function PinchControls({ enabled, onZoom }: { enabled: boolean; onZoom: (updater: (value:number)=>number)=>void }) {
  const { gl } = useThree();
  useEffect(() => {
    if (!enabled) return;
    const canvas = gl.domElement;
    const points = new Map<number, {x:number,y:number}>();
    let lastDistance: number | null = null;
    const down = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return;
      points.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if (points.size === 2) { const [a,b]=[...points.values()];lastDistance=Math.hypot(a.x-b.x,a.y-b.y); }
    };
    const move=(e:PointerEvent)=>{
      if(!points.has(e.pointerId))return;
      points.set(e.pointerId,{x:e.clientX,y:e.clientY});
      if(points.size<2)return;
      const [a,b]=[...points.values()];const distance=Math.hypot(a.x-b.x,a.y-b.y);
      if(lastDistance && distance>0 && Math.abs(distance-lastDistance)>1.5)onZoom(z=>Math.max(.72,Math.min(1.55,z*distance/lastDistance!)));
      lastDistance=distance;
    };
    const up=(e:PointerEvent)=>{points.delete(e.pointerId);lastDistance=null;};
    canvas.addEventListener('pointerdown',down);canvas.addEventListener('pointermove',move);
    canvas.addEventListener('pointerup',up);canvas.addEventListener('pointercancel',up);
    return ()=>{canvas.removeEventListener('pointerdown',down);canvas.removeEventListener('pointermove',move);canvas.removeEventListener('pointerup',up);canvas.removeEventListener('pointercancel',up);};
  },[enabled,gl,onZoom]);
  return null;
}

export default function SpaceScene({ progressRef, activeIndex, motion, inspectMode, zoom, onZoom }: {
  progressRef: MutableRefObject<number>; activeIndex: number; motion: boolean; inspectMode: boolean; zoom: number;
  onZoom: (updater:(value:number)=>number)=>void;
}) {
  return (
    <Canvas
      className="three-canvas"
      dpr={[1, 2.25]}
      gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}
      camera={{ fov: 43, near: .1, far: 420, position: [0, .7, 14] }}
      onCreated={({ gl }) => { gl.setClearColor('#000000', 0); gl.toneMapping = THREE.ACESFilmicToneMapping; gl.toneMappingExposure = 1.2; }}
      fallback={<div className="webgl-fallback">Your browser does not support WebGL. Try Chrome, Firefox, or Edge.</div>}
    >
      <ambientLight intensity={.13} />
      <directionalLight position={[12, 7, 18]} intensity={3.15} color="#fff4e8" />
      <directionalLight position={[-25, -9, -85]} intensity={.30} color="#8cbfff" />
      <Starfield motion={motion} progressRef={progressRef} />
      <Suspense fallback={null}>
        {journeyPlanets.map((planet, index) => (
          <Planet key={planet.id} planet={planet} motion={motion} active={activeIndex === index} inspectMode={inspectMode} />
        ))}
      </Suspense>
      <FlightCamera progressRef={progressRef} motion={motion} inspectMode={inspectMode} zoom={zoom} />
      <PinchControls enabled={inspectMode} onZoom={onZoom} />
    </Canvas>
  );
}
