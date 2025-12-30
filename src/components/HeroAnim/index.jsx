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
// Styles
import styles from "./styles.module.scss";
import wolf from "@/assets/images/mutation_Wolf_copie.webp";
import cosmos from "@/assets/images/moon.webp";

/*
  Hook responsive: renvoie la taille actuelle de la fenêtre.
  Utilisé pour adapter le FOV, le DPR et certains paramètres responsive.
*/

function useWindowSize() {
  // SSR-safe: initialise côté serveur puis met à jour côté client
  const [size, setSize] = useState([0, 0]);

  useEffect(() => {
    const handleResize = () => setSize([window.innerWidth, window.innerHeight]);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return size;
}

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

/* MoonObject: sphère texturée (lune) avec rotation et éclairage. */
const MoonObject = () => {
  const cosmosMap = useTexture(cosmos);
  const groupRef = useRef();
  useFrame(() => {
    if (groupRef.current) groupRef.current.rotation.y += 0.002;
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <ambientLight intensity={0.8} />
      <directionalLight intensity={1.4} position={[2, 4, 6]} />
      <mesh renderOrder={1}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          map={cosmosMap}
          metalness={0.5}
          roughness={0.6}
          emissive="#444"
          emissiveIntensity={0.15}
        />
      </mesh>
    </group>
  );
};

// Constantes de détection du « tap » — valeurs par défaut pour distinguer un « tap »
// (appui court sans mouvement) d'un glissement. Ajuster si nécessaire selon
// le comportement tactile des appareils cibles.
const TAP_TIME_MS = 250; // durée max (ms) pour considérer un tap
const TAP_MOVE_PX = 8; // déplacement max (px) pour considérer un tap

/*
  WolfBillboard: billboard orbitant la lune.
  - inertie (`spinVelocity`)
  - interaction pointer / clavier
  - expose `apiRef` (addSpin, reset, setPaused)
*/
const WolfBillboard = ({
  positionY = -0.2,
  apiRef = null,
  onPauseChange = null,
}) => {
  const wolfMap = useTexture(wolf);
  const groupRef = useRef();
  const meshRef = useRef();
  const { camera, gl } = useThree();

  const animState = useRef({
    theta: Math.PI / 2,
    opacity: 0,
    scale: 0.7,
    dragging: false,
    lastX: 0,
    spinVelocity: 0,
    paused: false,
    // Suivi du pointeur / détection de tap
    pointerId: null,
    startX: 0,
    startY: 0,
    pointerDownTime: 0,
  });

  useEffect(() => {
    wolfMap.colorSpace = THREE.SRGBColorSpace;
    wolfMap.anisotropy = 16;
  }, [wolfMap]);

  const material = useMemo(
    () =>
      new THREE.ShaderMaterial({
        uniforms: {
          map: { value: wolfMap },
          opacity: { value: 0 },
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
        float verticalFade = smoothstep(0.05, 0.42, vUv.y);
        float horizontalMask = 1.0 - smoothstep(0.2, 0.3, abs(vUv.x - 0.54));
        float fadeFactor = (vUv.y < 0.42) ? mix(1.0, verticalFade, horizontalMask) : 1.0;
        float boostedAlpha = clamp(mix(fadeFactor, 1.0, smoothstep(0.5, 0.9, vUv.y) * 0.35), 0.8, 1.0);
        vec3 finalColor = mix(texColor.rgb * (1.0 + opacity * 0.3), fogColor, clamp((1.0 - fadeFactor) * 1.5, 0.0, 1.0));
        gl_FragColor = vec4(finalColor, texColor.a * boostedAlpha * opacity);
      }
    `,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false,
      }),
    [wolfMap]
  );

  // Boucle frame : met à jour la position orbitale, l'apparence et l'inertie
  useFrame(({ clock }) => {
    if (!groupRef.current || !meshRef.current) return;
    const t = clock.getElapsedTime();
    const state = animState.current;

    if (state.paused) return; // en pause

    state.theta = (state.theta + 0.0032) % (Math.PI * 2);
    state.opacity = THREE.MathUtils.lerp(state.opacity, 1, 0.045);
    state.scale = THREE.MathUtils.lerp(state.scale, 1, 0.025);

    const dR = 2.7 + Math.sin(t * 0.45) * 0.15;
    groupRef.current.position.x = dR * Math.cos(state.theta);
    groupRef.current.position.z =
      dR * Math.sin(state.theta) + Math.sin(t * 0.45) * 0.03;
    groupRef.current.position.y = positionY;

    groupRef.current.lookAt(camera.position);

    if (state.spinVelocity !== 0) {
      // Applique la rotation à l'angle orbital (`theta`) avec amortissement
      state.theta = (state.theta + state.spinVelocity) % (Math.PI * 2);
      state.spinVelocity *= 0.92;
      if (Math.abs(state.spinVelocity) < 0.001) state.spinVelocity = 0;
    }

    meshRef.current.scale.set(
      2.8 * state.scale,
      2 * state.scale,
      3.5 * state.scale
    );
    material.uniforms.opacity.value = state.opacity;
  });

  // Expose `apiRef` : addSpin, setSpin, reset, setPaused
  useEffect(() => {
    if (!apiRef) return;
    apiRef.current = {
      addSpin: (delta) => (animState.current.spinVelocity += delta),
      setSpin: (v) => (animState.current.spinVelocity = v),
      reset: () => {
        animState.current.theta = Math.PI / 2;
        animState.current.spinVelocity = 0;
      },
      // setPaused met à jour l'état interne et notifie le parent via onPauseChange
      setPaused: (p) => {
        animState.current.paused = Boolean(p);
        if (typeof onPauseChange === "function") onPauseChange(Boolean(p));
      },
    };
    return () => {
      if (apiRef.current) apiRef.current = null;
    };
  }, [apiRef, onPauseChange]);

  // Handlers pointer : drag -> spin, tap -> bascule pause (utilise pointer capture)
  return (
    <group ref={groupRef}>
      <mesh
        ref={meshRef}
        material={material}
        renderOrder={2}
        onPointerDown={(e) => {
          e.stopPropagation();
          animState.current.dragging = true;
          animState.current.lastX = e.clientX;
          animState.current.startX = e.clientX;
          animState.current.startY = e.clientY;
          animState.current.pointerDownTime = performance.now();
          animState.current.pointerId = e.pointerId || null;
          // Essayer setPointerCapture sur le canvas pour fiabiliser le drag tactile
          try {
            if (
              gl &&
              gl.domElement &&
              typeof gl.domElement.setPointerCapture === "function"
            ) {
              gl.domElement.setPointerCapture(e.pointerId);
            }
          } catch (err) {
            // ignorer les erreurs liées à l'API Pointer
          }
        }}
        onPointerMove={(e) => {
          if (!animState.current.dragging) return;
          const dx = e.clientX - animState.current.lastX;
          animState.current.spinVelocity = dx * 0.01;
          animState.current.lastX = e.clientX;
        }}
        onPointerUp={(e) => {
          animState.current.dragging = false;
          // Relâcher la capture du pointeur (si active)
          try {
            if (
              gl &&
              gl.domElement &&
              typeof gl.domElement.releasePointerCapture === "function"
            ) {
              gl.domElement.releasePointerCapture(e.pointerId);
            }
          } catch (err) {}

          // Détection de tap (court + faible déplacement) -> bascule pause
          const now = performance.now();
          const dt = now - (animState.current.pointerDownTime || 0);
          const dx = e.clientX - (animState.current.startX || 0);
          const dy = e.clientY - (animState.current.startY || 0);
          const dist = Math.hypot(dx, dy);
          if (dt < TAP_TIME_MS && dist < TAP_MOVE_PX) {
            const next = !animState.current.paused;
            // Préférer `apiRef` si disponible ; sinon mettre à jour l'état local
            if (
              apiRef &&
              apiRef.current &&
              typeof apiRef.current.setPaused === "function"
            ) {
              apiRef.current.setPaused(next);
            } else {
              animState.current.paused = next;
              if (typeof onPauseChange === "function") onPauseChange(next);
            }
          }
        }}
        onPointerCancel={(e) => {
          animState.current.dragging = false;
          try {
            if (
              gl &&
              gl.domElement &&
              typeof gl.domElement.releasePointerCapture === "function"
            ) {
              gl.domElement.releasePointerCapture(
                e.pointerId || animState.current.pointerId
              );
            }
          } catch (err) {
            // ignorer
          }
        }}
        onPointerLeave={(e) => {
          animState.current.dragging = false;
          try {
            if (
              gl &&
              gl.domElement &&
              typeof gl.domElement.releasePointerCapture === "function"
            ) {
              gl.domElement.releasePointerCapture(
                e.pointerId || animState.current.pointerId
              );
            }
          } catch (err) {
            // ignorer
          }
        }}
      >
        <planeGeometry args={[1, 1.3]} />
      </mesh>
    </group>
  );
};
/*
  CinematicZoom: animation d'entrée de la caméra.
  - Interpôle la position Z de la caméra depuis une valeur de départ
    vers une cible pour obtenir un zoom d'introduction.
  - Légers mouvements de caméra ajoutés pour dynamiser la scène.
*/
const CinematicZoom = () => {
  const { camera, controls } = useThree();
  const [width] = useWindowSize();
  const targetZ = width <= 600 ? 6.5 : 5.5;
  const isDone = useRef(false);

  useFrame(() => {
    if (isDone.current) return;

    if (Math.abs(camera.position.z - targetZ) > 0.01) {
      camera.position.z = THREE.MathUtils.lerp(
        camera.position.z,
        targetZ,
        0.05
      );
      if (controls) controls.update();
    } else {
      isDone.current = true; // On arrête de forcer la position une fois arrivé
    }
  });
  return null;
};

/*
  HeroAnim: composant principal qui instancie le Canvas et les éléments 3D.
  - Le wrapper est focusable (tabIndex) pour permettre les contrôles clavier
    (Pause, flèches, reset).
  - `controlsRef` permet d'activer/désactiver `autoRotate` sur OrbitControls.
  - `wolfApiRef` est transmis au `WolfBillboard` pour piloter le loup depuis le parent.
*/
const HeroAnim = ({ wolfY = -0.2 }) => {
  const [width] = useWindowSize();
  const controlsRef = useRef();
  const wolfApiRef = useRef(null);
  const wrapperRef = useRef(null);
  const [paused, setPaused] = useState(false);
  const [liveMsg, setLiveMsg] = useState("");

  const handleKeyDown = (e) => {
    // Espace -> pause / resume
    if (e.code === "Space") {
      e.preventDefault();
      const next = !paused;
      setPaused(next);
      if (controlsRef.current) controlsRef.current.autoRotate = !next;
      if (
        wolfApiRef.current &&
        typeof wolfApiRef.current.setPaused === "function"
      ) {
        wolfApiRef.current.setPaused(next);
      }
    }
    // Flèches gauche / droite -> imprimer une rotation
    if (e.code === "ArrowLeft") {
      if (wolfApiRef.current) wolfApiRef.current.addSpin(-0.06);
    }
    if (e.code === "ArrowRight") {
      if (wolfApiRef.current) wolfApiRef.current.addSpin(0.06);
    }
    // R -> reset du loup
    if (e.code === "KeyR") {
      if (wolfApiRef.current) wolfApiRef.current.reset();
    }
  };

  // Pas d'écouteur global : on focalise le wrapper au clic pour que
  // les raccourcis clavier fonctionnent après interaction.

  // Wrapper focusable: capte les événements clavier quand il est focus
  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      tabIndex={0}
      aria-label="Animation hero, contrôlable au clavier"
      aria-describedby="hero-controls-desc"
      onKeyDown={handleKeyDown}
      onClick={() => wrapperRef.current && wrapperRef.current.focus()}
    >
      <Canvas
        className={styles.canvas}
        camera={{ position: [0, 1, 10], fov: width <= 600 ? 55 : 45 }}
        // On attache les événements directement au domElement du canvas
        onCreated={(state) => {
          state.gl.domElement.style.touchAction = "none";
          // Forcer le fond noir
          try {
            state.gl.setClearColor(new THREE.Color("#000000"), 1);
          } catch (err) {
            // Certains contextes peuvent ne pas exposer setClearColor, ignorer
          }
        }}
      >
        <Suspense fallback={<Loader />}>
          <CinematicZoom />

          <OrbitControls
            ref={controlsRef}
            makeDefault
            enablePan={false}
            enableZoom={false}
            enableRotate={true}
            autoRotate
            autoRotateSpeed={0.5}
            minPolarAngle={Math.PI / 3}
            maxPolarAngle={Math.PI / 1.5}
          />

          <Stars
            radius={300}
            depth={100}
            count={6000}
            factor={7}
            fade
            speed={0.2}
          />
          <MoonObject />
          <WolfBillboard
            positionY={wolfY}
            apiRef={wolfApiRef}
            onPauseChange={(isPaused) =>
              setLiveMsg(isPaused ? "Animation en pause" : "Animation relancée")
            }
          />
          <Environment preset="night" />
          <fog attach="fog" args={["#0a1628", 8, 40]} />
        </Suspense>
      </Canvas>
      {/* Description accessible des contrôles (visually hidden) */}
      <div
        id="hero-controls-desc"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          margin: -1,
          border: 0,
          padding: 0,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
        }}
      >
        Interactions : cliquer ou glisser pour tourner; Espace pour
        pause/reprise; flèches gauche/droite pour donner de la vitesse; R pour
        remettre à zéro; tapoter pour pause sur mobile.
      </div>
      {/* Aria-live announcer (visually hidden) for screen readers — placed outside the Canvas */}
      <div
        aria-live="polite"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          margin: -1,
          border: 0,
          padding: 0,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          clipPath: "inset(50%)",
          whiteSpace: "nowrap",
        }}
      >
        {liveMsg}
      </div>
    </div>
  );
};

export default HeroAnim;
