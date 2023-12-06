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
  return (
    <group position={[0, 0, 0.9]} scale={[2, 2, 2]}>
      <mesh>
        <Decal
          scale={[2, 2, 2]}
          position={[0, 0, 0.9]}
          map={wolfMap}
          polygonOffset
          polygonOffsetFactor={-10}
          rotation={0}
          depthWrite={false}
        ></Decal>
        <meshStandardMaterial
          opacity={0}
          depthWrite={false}
          transparent={true}
          side={THREE.DoubleSide}
          color="blue"
        />
        <sphereGeometry args={[2, 2]} />
      </mesh>

      <mesh scale={[1, 1, 1]}>
        <meshStandardMaterial
          map={cosmosMap}
          opacity={0.3}
          metalness={0.4}
          roughness={0.7}
          depthWrite={false}
          transparent={true}
          side={THREE.DoubleSide}
          color="yellow"
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
        <directionalLight intensity={0.5} position={[0, 2, 1]} />
        <pointLight position={[50, 50, 50]} angle={0.15} penumbra={1} />
        <ambientLight intensity={7} />
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
