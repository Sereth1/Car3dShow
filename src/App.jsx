import { Suspense, useState } from "react";
import { Canvas } from "@react-three/fiber";
import Car from "./models/Car";
import "./index.css";
import Loader from "./Loader";
function App() {
  const [currentStage, setCurrentStage] = useState(1);
  const [isRotating, setIsRotating] = useState(0);
  const adjustCarForScreenSize = () => {
    let screenScale = null;
    let screenPostion = [0, -20, -250];
    let carRotation = [0.1, 4.7, 0];
    if (window.length < 768) {
      screenScale = [0.9, 0.9, 0.9];
    } else {
      screenScale = [2, 2, 2];
    }
    return [screenScale, screenPostion, carRotation];
  };
  const [carScale, carPosition, carRotation] = adjustCarForScreenSize();
  return (
    <div className="w-full h-screen relative">
      <Canvas
        className={`w-full h-screen bg-transparent ${
          isRotating ? "cursor-grabbing" : "cursor-grab"
        }`}
        camera={{ near: 0.1, far: 5000 }}
      >
        <Suspense fallback={<Loader />}>
          <directionalLight position={[1, 1, 1]} intensity={2} />
          <ambientLight intensity={0.5} />

          <hemisphereLight
            skycolor="#b1e1ff"
            groundColor="#000000"
            intensity={1}
          />
          <Car
            setCurrentStage={setCurrentStage}
            scale={carScale}
            position={carPosition}
            rotation={carRotation}
            isRotating={isRotating}
            setIsRotating={setIsRotating}
          />
        </Suspense>
      </Canvas>
    </div>
  );
}

export default App;
