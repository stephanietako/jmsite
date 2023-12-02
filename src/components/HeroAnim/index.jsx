import { Suspense, useRef } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { TextureLoader } from "three";
import { OrbitControls, Stars } from "@react-three/drei";
import * as THREE from "three";
// Styles
import styles from "./styles.module.scss";
// Assets
import wolf from "../../assets/images/wolf_transp.png";
import cosmos from "../../assets/images/cosmos.jpg";

const Scene = () => {
  const cosmosMesh = useRef();
  const wolfMesh = useRef();
  const [cosmosMap, wolfMap] = useLoader(TextureLoader, [cosmos, wolf]);
  return (
    <>
      <Stars
        radius={300}
        depth={60}
        count={20000}
        factor={7}
        saturation={0}
        fade={true}
      />
      <directionalLight intensity={0.5} position={[0, 2, 1]} />
      <ambientLight intensity={1} />
      <spotLight />
      <mesh
        ref={cosmosMesh}
        position={[0, 0, 0.3]}
        scale={[4, 4, 4]}
        // tableau [x, y, z]  représente les angles de rotation autour des axes x, y et z respectivement.
        // Chaque angle est spécifié en radians
        // rotation={[0, Math.PI / 4, 0]}
      >
        <sphereGeometry args={[1, 32, 32]} />
        {/* <meshPhongMaterial map={colorMap} opacity={0.4} /> */}
        <meshStandardMaterial
          map={cosmosMap}
          opacity={0.4}
          depthWrite={true}
          transparent={true}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh ref={wolfMesh}>
        <group position={[0, 0, 0.3]} scale={[4, 4, 4]}>
          <mesh ref={wolfMesh}>
            <ambientLight intensity={5} />
            <sphereGeometry args={[1.005, 32, 32]} />
            <meshStandardMaterial
              map={wolfMap}
              opacity={0.7}
              transparent={true}
            />
          </mesh>
        </group>
      </mesh>

      <OrbitControls
        enablePan={true}
        enableRotate={true}
        zoomSpeed={0.6}
        panSpeed={0.5}
        rotateSpeed={0.4}
      />
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
//   const texture = useLoader(TextureLoader, "./textures/cosmos.jpg");
// L'accès direct est une fonctionnalité fournie par React Three Fiber qui vous permet d'accéder directement aux objets natifs Three.js. Cela peut être incroyablement utile lorsque vous devez effectuer des opérations qui ne sont pas directement prises en charge par React Three Fiber.

// Les capacités de planification de React, en revanche, vous permettent de contrôler quand et comment les mises à jour sont appliquées à vos composants. Cela peut être particulièrement utile dans une application 3D, où vous pouvez avoir des animations ou d'autres mises à jour qui doivent être synchronisées avec la boucle de rendu.

// Voyons comment utiliser l'accès direct pour animer notre torus :
// import React, { useRef } from 'react';
//     import { Canvas, useFrame } from '@react-three/fiber';

//     function Torus() {
//       const meshRef = useRef();

//       useFrame(() => {
//         if (meshRef.current) {
//           meshRef.current.rotation.x += 0.01;
//           meshRef.current.rotation.y += 0.01;
//         }
//       });

//       return (
//         <mesh ref={meshRef}>
//           <torusBufferGeometry args={[1, 0.4, 16, 100]} />
//           <meshStandardMaterial color={'blue'} />
//         </mesh>
//       );
//     }

//     function App() {
//       return (
//         <div className="App">
//           <Canvas>
//             <Torus />
//           </Canvas>
//         </div>
//       );
//     }

//     export default App;
