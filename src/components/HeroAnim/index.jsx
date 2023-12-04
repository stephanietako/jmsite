import { Suspense, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
// Styles
import styles from "./styles.module.scss";
// Assets
import wolf from "../../assets/images/mutation_Wolf.png";
import cosmos from "../../assets/images/essai.jpeg";

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

const CosmosObject = ({ cosmosMap }) => {
  const cosmosMesh = useRef();

  return (
    <mesh ref={cosmosMesh} position={[0, 0, 0.3]} scale={[3, 3, 3]}>
      <sphereGeometry args={[1, 32, 32]} />
      <meshStandardMaterial
        map={cosmosMap}
        metalness={0.4}
        roughness={0.7}
        opacity={0.4}
        depthWrite={true}
        transparent={true}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
};

const WolfObject = ({ wolfMap }) => {
  const wolfMesh = useRef();

  return (
    <group position={[0, 0, 0.3]} scale={[3, 3, 3]}>
      <mesh ref={wolfMesh}>
        <sphereGeometry args={[1.005, 32, 32]} />
        <meshStandardMaterial map={wolfMap} opacity={0.7} transparent={true} />
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

const Scene = () => {
  const [cosmosMap, wolfMap] = useLoader(TextureLoader, [cosmos, wolf]);

  return (
    <>
      <ambientLight intensity={9} />
      <StarsBackground />
      {/* Lights */}
      <ambientLight intensity={4} />
      <directionalLight intensity={0.5} position={[0, 2, 1]} />
      {/* Objects */}
      <CosmosObject cosmosMap={cosmosMap} />
      <WolfObject wolfMap={wolfMap} scale={[1, 1, 1]} />

      {/* Controls */}
      <Controls />
    </>
  );
};

const App = () => {
  return (
    <div className={styles.wrapper}>
      <Canvas
        className={styles.canvas}
        camera={{ position: [8, 0.5, 7], fov: 56 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
};

export default App;
