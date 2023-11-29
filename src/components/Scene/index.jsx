import { useState, useEffect, useRef } from "react";
import { Canvas } from "@react-three/fiber";
import {
  OrbitControls,
  Sphere,
  useHelper,
  useTexture,
} from "@react-three/drei";
import { PointLight, PointLightHelper } from "three";
// Styles
import styles from "./styles.module.scss";
//  import { MeshStandardMaterial } from "three";

const Scene = () => {
  const [imagePositionWithDelay, setImagePositionWithDelay] = useState({
    x: 0,
    y: 0,
  });

  const animRef = useRef(null);

  useEffect(() => {
    let animationFrameId;
    const handleMouseMove = (e) => {
      // Demander une nouvelle trame d'animation
      cancelAnimationFrame(animationFrameId);

      setImagePositionWithDelay({
        x: (e.clientX - window.innerWidth / 2) / 1.5,
        y: (e.clientY - window.innerHeight / 2) / 1.5,
      });
    };

    if (animRef.current) {
      document.addEventListener("mousemove", handleMouseMove);
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const animStyles = {
    left: `${imagePositionWithDelay.x}px`,
    top: `${imagePositionWithDelay.y}px`,
  };
  ////////////////TEXTURE/////////////////////
  // Charger l'image en tant que texture
  const Terrain = () => {
    const texture = useTexture("./textures/wolf_transparent.png");

    return (
      <mesh position={[0, 0, 0.3]}>
        <Sphere args={[1, 100, 200]} scale={[0.5, 1, 0.5]}>
          <meshStandardMaterial map={texture} />
        </Sphere>
      </mesh>
    );
  };
  /////////////////THREECONTENT///////////////////
  const ThreeContent = () => {
    // eslint-disable-next-line no-self-compare
    const lightRef = (useRef < PointLight) | (null > null);
    useHelper(lightRef, PointLightHelper, 1, "red");

    return (
      <>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
        <OrbitControls />

        <Terrain />
      </>
    );
  };

  return (
    <div className={styles.animation}>
      <div
        className={styles.__container_anime}
        ref={animRef}
        style={animStyles}
      >
        <Canvas camera={{ fov: 19, position: [7, 7, 7] }}>
          <ThreeContent />
        </Canvas>
      </div>
    </div>
  );
};

export default Scene;
