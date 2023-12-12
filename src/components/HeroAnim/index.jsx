import { Suspense } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Stars, Decal } from "@react-three/drei";
import * as THREE from "three";
// Styles
import styles from "./styles.module.scss";
// Assets
import wolf from "../../assets/images/mutation_Wolf.png";
import cosmos from "../../assets/images/moon.webp";

//MOON SPHERE
const MoonObject = () => {
  const [cosmosMap, wolfMap] = useLoader(TextureLoader, [cosmos, wolf]);
  const isMobile = window.innerWidth <= 768;
  const isExtraSmall = window.innerWidth <= 375;
  const isMedium = window.innerWidth <= 1024;

  // Condition media queries scale and position animation
  let groupScale, groupPosition;
  // 375
  if (isExtraSmall) {
    groupScale = [0.9, 0.9, 0.9];
    groupPosition = [0, 1.4, 0];
    console.log("groupe scale extra small", [0.9, 0.9, 0.9]);
    // 768
  } else if (isMobile) {
    groupScale = [1.2, 1.2, 1.2];
    groupPosition = [0, 0, 0.8];
    console.log("groupe scale mobile", [0, 0, 0.8]);
    // 1024
  } else if (isMedium) {
    groupScale = [1.5, 1.5, 1.5];
    groupPosition = [0, -2, 0];
    console.log("groupe scale medium", [1.5, 1.5, 1.5]);
  } else {
    groupScale = [1.7, 1.7, 1.7];
    groupPosition = [0, 0, 0];
    console.log("groupe scale standard", [1.7, 1.7, 1.7]);
  }

  return (
    <group position={groupPosition} scale={groupScale}>
      <directionalLight intensity={0.3} position={[0, 2, 1]} />
      <pointLight position={[50, 50, 50]} angle={0.15} penumbra={1} />
      <ambientLight intensity={9} />
      <mesh>
        <Decal
          scale={[2, 2, 2]}
          position={[0, 0, 0.8]}
          map={wolfMap}
          polygonOffset
          rotation={[0, 0, 0]}
          depthWrite={false}
          side={THREE.DoubleSide}
        ></Decal>
        <meshStandardMaterial
          opacity={0}
          depthWrite={false}
          transparent={true}
          side={THREE.DoubleSide}
        />
        <sphereGeometry args={[2, 2]} />
      </mesh>
      <mesh scale={[1.8, 1.8, 1.8]}>
        <meshStandardMaterial
          map={cosmosMap}
          opacity={0.3}
          metalness={0.4}
          roughness={0.7}
          depthWrite={false}
          transparent={true}
          side={THREE.DoubleSide}
        />
        <sphereGeometry args={[1, 32, 32]} />
      </mesh>
    </group>
  );
};

const Controls = () => {
  return (
    <OrbitControls
      enablePan={true}
      enableRotate={true}
      zoomSpeed={0.6}
      panSpeed={0.5}
      rotateSpeed={0.4}
    />
  );
};

const StarsBackground = () => {
  return (
    <Stars
      radius={300}
      depth={60}
      count={20000}
      factor={7}
      saturation={0}
      fade={true}
    />
  );
};
const HeroAnim = () => {
  return (
    <div className={styles.wrapper}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [1, 1, 10], fov: 56 }}
      >
        <Controls />
        <StarsBackground />
        <Suspense fallback={null}>
          <MoonObject />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default HeroAnim;
