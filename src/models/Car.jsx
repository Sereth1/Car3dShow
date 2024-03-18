import { useGLTF } from "@react-three/drei";
import React, { useRef, useEffect } from "react";
import carScene from "../3d/car.glb";
import { a } from "@react-spring/three";
import { useFrame, useThree } from "@react-three/fiber";
function Car({ setCurrentStage, isRotating, setIsRotating, ...props }) {
  const { nodes, materials } = useGLTF(carScene);
  const { gl, viewport } = useThree();
  const lastx = useRef(0);
  const rotationSpeed = useRef(0);
  const dampingFactor = 0.95;
  const carRef = useRef();
  const hadlePointerDown = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(true);
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;

    lastx.current = clientX;
  };
  const hadlePointerUp = (e) => {
    e.stopPropagation();
    e.preventDefault();
    setIsRotating(false);
  };
  const hadlePointerMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isRotating) {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const delta = (clientX - lastx.current) / viewport.width;
      carRef.current.rotation.y += delta * 0.01 * Math.PI;
      lastx.current = clientX;
      rotationSpeed.current = delta * 0.01 * Math.PI;
    }
  };
  const handleKeyDown = (e) => {
    if (e.key === "ArrowLeft") {
      if (!isRotating) setIsRotating(true);
      carRef.current.rotation.y += 0.01 * Math.PI;
    } else if (e.key === "ArrowRight") {
      if (!isRotating) setIsRotating(true);
      carRef.current.rotation.y -= 0.01 * Math;
    }
  };
  const handleKeyUp = (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
      setIsRotating(false);
    }
  };
  useFrame(() => {
    if (!isRotating) {
      rotationSpeed.current *= dampingFactor;

      // Stop rotation when speed is very small
      if (Math.abs(rotationSpeed.current) < 0.001) {
        rotationSpeed.current = 0;
      }

      carRef.current.rotation.y += rotationSpeed.current;
    } else {
      const rotation = carRef.current.rotation.y;

      const normalizedRotation =
        ((rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);

      // Set the current stage based on the island's orientation
      switch (true) {
        case normalizedRotation >= 5.45 && normalizedRotation <= 5.85:
          setCurrentStage(4);
          break;
        case normalizedRotation >= 0.85 && normalizedRotation <= 1.3:
          setCurrentStage(3);
          break;
        case normalizedRotation >= 2.4 && normalizedRotation <= 2.6:
          setCurrentStage(2);
          break;
        case normalizedRotation >= 4.25 && normalizedRotation <= 4.75:
          setCurrentStage(1);
          break;
        default:
          setCurrentStage(null);
      }
    }
  });
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("pointerdown", hadlePointerDown);
    canvas.addEventListener("pointerup", hadlePointerUp);
    canvas.addEventListener("pointermove", hadlePointerMove);
    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("keyup", handleKeyUp);

    return () => {
      canvas.removeEventListener("pointerdown", hadlePointerDown);
      canvas.removeEventListener("pointerup", hadlePointerUp);
      canvas.removeEventListener("pointermove", hadlePointerMove);
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("keyup", handleKeyUp);
    };
  }, [gl, hadlePointerDown, hadlePointerUp, hadlePointerMove]);
  return (
    <a.group {...props} ref={carRef}>
      <mesh
        geometry={nodes["Object001_Material_#37_0"].geometry}
        material={materials.Material_37}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes["Object002_Material_#33_0"].geometry}
        material={materials.Material_33}
        rotation={[-Math.PI / 2, 0, 0]}
      />
      <mesh
        geometry={nodes["Plane001_Material_#58_0"].geometry}
        material={materials.Material_58}
        position={[0.817, 1.861, -1.258]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[0.697, 1.12, 1]}
      />
    </a.group>
  );
}

export default Car;
