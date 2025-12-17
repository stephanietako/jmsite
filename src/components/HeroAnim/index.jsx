import { Suspense, useRef, useEffect, useState, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import {
  OrbitControls,
  Stars,
  Environment,
  useTexture,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import styles from "./styles.module.scss";
import wolf from "@/assets/images/mutation_Wolf_copie.webp";
import cosmos from "@/assets/images/moon.webp";

/* 📱 Hook responsive optimisé */
function useWindowSize() {
  const [size, setSize] = useState([window.innerWidth, window.innerHeight]);

  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

/* 🔄 Loader personnalisé */
const Loader = () => (
  <Html center>
    <div
      style={{
        color: "white",
        fontSize: "1.2rem",
        fontWeight: "300",
        letterSpacing: "0.2em",
      }}
    >
      Chargement...
    </div>
  </Html>
);

/* 🌕 Lune rotative optimisée */
const MoonObject = () => {
  const cosmosMap = useTexture(cosmos);
  const [width] = useWindowSize();
  const groupRef = useRef();

  // Animation de rotation
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.004;
    }
  });

  // Responsive scale and LOD for geometry
  const isMobile = width <= 600;
  const isSmall = width <= 360;
  const scale = isSmall ? 0.8 : isMobile ? 1 : 1.15;
  const geoSegments = isSmall ? 24 : isMobile ? 40 : 64;

  return (
    <group
      ref={groupRef}
      scale={[scale, scale, scale]}
      position={[-0.8, -0.2, 0]}
    >
      <ambientLight intensity={0.8} />
      <directionalLight intensity={1.2} position={[2, 4, 6]} />

      <mesh>
        <sphereGeometry args={[1, geoSegments, geoSegments]} />
        <meshStandardMaterial
          map={cosmosMap}
          metalness={0.5}
          roughness={0.6}
          transparent
          opacity={1.1}
          side={THREE.DoubleSide}
        />
      </mesh>
    </group>
  );
};

/* 🐺 Loup avec shader */
const WolfBillboard = ({ positionX = 1.1, positionY = 0.7 }) => {
  const wolfMap = useTexture(wolf);
  const ref = useRef();
  const { camera } = useThree();
  const [opacity, setOpacity] = useState(0.7);

  useEffect(() => {
    wolfMap.colorSpace = THREE.SRGBColorSpace;
    wolfMap.anisotropy = 16;
  }, [wolfMap]);

  const startZ = 2.0 + 0.5;
  const targetZ = 2.2 + 0.5;
  const easePosition = 0.005;
  const easeOpacity = 0.02;

  useEffect(() => {
    if (ref.current) {
      ref.current.position.z = startZ;
      ref.current.position.x = positionX;
      ref.current.position.y = positionY;
    }
  }, [positionX, positionY]);

  useFrame(() => {
    if (ref.current) {
      ref.current.lookAt(camera.position);

      if (ref.current.position.z > targetZ) {
        ref.current.position.z +=
          (targetZ - ref.current.position.z) * easePosition;
      }

      ref.current.position.x = positionX;
      ref.current.position.y = positionY;

      if (opacity < 1) {
        setOpacity((prev) => Math.min(prev + easeOpacity, 1));
      }
    }
  });

  const material = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: wolfMap },
        opacity: { value: opacity },
        fogColor: { value: new THREE.Color(0x0a1628) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
  uniform sampler2D map;
  uniform float opacity;
  uniform vec3 fogColor;
  varying vec2 vUv;

  void main() {
    vec4 texColor = texture2D(map, vUv);

    float fadeStart = 0.45;
    float fadeEnd = 0.0;
    float verticalFade = smoothstep(fadeEnd, fadeStart, vUv.y);

    float centerX = 0.54;
    float fadeWidth = 0.2;
    float horizontalMask = 1.0 - smoothstep(fadeWidth, fadeWidth + 0.1, abs(vUv.x - centerX));

    float fadeFactor = 1.0;
    if (vUv.y < fadeStart) {
      fadeFactor = mix(1.0, verticalFade, horizontalMask);
    }

    float topBoost = smoothstep(0.5, 0.9, vUv.y);
    float boostedAlpha = mix(fadeFactor, 1.0, topBoost * 0.35);

    float fogStrength = 1.5;
    float fogMix = (1.0 - fadeFactor) * fogStrength;
    fogMix = clamp(fogMix, 0.0, 1.0);
    vec3 finalColor = mix(texColor.rgb, fogColor, fogMix);

    float finalAlpha = texColor.a * boostedAlpha * opacity;

    gl_FragColor = vec4(finalColor, finalAlpha);
  }
`,
      transparent: true,
      side: THREE.DoubleSide,
      depthTest: true,
    });
  }, [wolfMap, opacity]);

  useEffect(() => {
    if (material.uniforms) {
      material.uniforms.opacity.value = opacity;
    }
  }, [material, opacity]);

  const geometry = useMemo(() => new THREE.PlaneGeometry(1, 1.3), []);

  return (
    <>
      <directionalLight
        position={[2, 4, 4]}
        intensity={0.7}
        color="#fffbe6"
        castShadow
      />
      <pointLight
        position={[5.5, 0.3, 7.5]}
        intensity={0.6}
        color="#b0d8ff"
        distance={4}
      />

      <mesh
        ref={ref}
        scale={[2.8, 2, 3.5]}
        geometry={geometry}
        material={material}
        renderOrder={10}
        frustumCulled
      />
    </>
  );
};

/* 🎮 Contrôles orbitaux */
const Controls = () => {
  const [width] = useWindowSize();
  const autoRotateSpeed = useMemo(() => (width <= 768 ? 0.6 : 0.9), [width]);

  return (
    <OrbitControls
      enablePan={false}
      enableZoom={false}
      autoRotate
      autoRotateSpeed={autoRotateSpeed}
      minPolarAngle={Math.PI / 3}
      maxPolarAngle={Math.PI / 1.5}
      enableDamping
      dampingFactor={0.05}
    />
  );
};

/* 🌌 Fond étoilé */
const StarsBackground = () => {
  const starsRef = useRef();
  const [width] = useWindowSize();

  useEffect(() => {
    if (starsRef.current) {
      starsRef.current.material.depthWrite = false;
      starsRef.current.renderOrder = 1;
    }
  }, []);

  const starCount = useMemo(() => {
    if (width <= 360) return 4000;
    if (width <= 600) return 5000;
    if (width <= 768) return 6000;
    return 8000;
  }, [width]);

  return (
    <>
      <Stars
        ref={starsRef}
        radius={300}
        depth={100}
        count={starCount}
        factor={7}
        saturation={0}
        fade
        speed={0.2}
      />
      <Environment preset="night" />
      <fog attach="fog" args={["#000000", 10, 50]} />
    </>
  );
};

/* 🎥 Zoom cinématique */
const CinematicZoom = () => {
  const { camera } = useThree();
  const [width] = useWindowSize();

  const config = useMemo(() => {
    if (width <= 360) return { targetZ: 6.8, startZ: 9.2, ease: 0.03 };
    if (width <= 600) return { targetZ: 6.5, startZ: 9, ease: 0.03 };
    if (width <= 768) return { targetZ: 6, startZ: 8.5, ease: 0.03 };
    return { targetZ: 5.5, startZ: 8, ease: 0.03 };
  }, [width]);

  useEffect(() => {
    camera.position.z = config.startZ;
  }, [camera, config.startZ]);

  useFrame(() => {
    if (camera.position.z > config.targetZ) {
      camera.position.z += (config.targetZ - camera.position.z) * config.ease;
      if (Math.abs(camera.position.z - config.targetZ) < 0.01) {
        camera.position.z = config.targetZ;
      }
    }
  });

  return null;
};

/* 🚀 HeroAnim principal */
const HeroAnim = ({ wolfX = 1.1, wolfY = -0.2 }) => {
  const [width] = useWindowSize();
  const fov = useMemo(() => {
    if (width <= 360) return 57;
    if (width <= 600) return 55;
    if (width <= 768) return 50;
    return 45;
  }, [width]);

  const isMobile = width <= 600;
  const canvasDPR = isMobile ? [1, 1.5] : [1, 2]; // Optimisation DPR pour mobiles et desktop (device pixel ratio (rapport pixel appareil)

  return (
    <div className={styles.wrapper}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 0, 8], fov, near: 0.1, far: 1000 }}
        dpr={canvasDPR}
        shadows
        gl={{
          antialias: true,
          alpha: false,
          powerPreference: "high-performance",
        }}
        style={{ background: "#000000" }}
      >
        <CinematicZoom />
        <Suspense fallback={<Loader />}>
          <StarsBackground />
          <Controls />
          <MoonObject />
          <WolfBillboard positionX={wolfX} positionY={wolfY} />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroAnim;
