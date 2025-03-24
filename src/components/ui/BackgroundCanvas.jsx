import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";

// Componente de partículas con efecto de chispas y movimiento interactivo
const SparkParticles = () => {
    const ref = useRef();
    const [positions] = useState(() => {
        const arr = new Float32Array(3000);
        for (let i = 0; i < arr.length; i++) arr[i] = (Math.random() - 0.5) * 10;
        return arr;
    });

    useFrame(({ mouse }) => {
        if (ref.current) {
            ref.current.rotation.x = mouse.y * 0.2;
            ref.current.rotation.y = mouse.x * 0.2;
        }
    });

    return (
        <Points ref={ref} positions={positions} stride={3}>
            <PointMaterial
                transparent
                color="#ffcc00"
                size={0.05}
                sizeAttenuation
                depthWrite={false}
            />
        </Points>
    );
};

// Componente principal de fondo interactivo
const BackgroundCanvas = () => {
    const pointsRef = useRef();
    const [particles] = useState(() => {
        const arr = new Float32Array(3000);
        for (let i = 0; i < arr.length; i += 3) {
            arr[i] = (Math.random() - 0.5) * 10;
            arr[i + 1] = (Math.random() - 0.5) * 10;
            arr[i + 2] = (Math.random() - 0.5) * 10;
        }
        return arr;
    });

    useFrame(({ mouse }) => {
        if (pointsRef.current) {
            let x = (mouse.x * 2 - 1) * 2;
            let y = (-mouse.y * 2 + 1) * 2;
            pointsRef.current.rotation.x = y * 0.1;
            pointsRef.current.rotation.y = x * 0.1;
        }
    });

    return (
        <Canvas
            camera={{ position: [0, 0, 5], fov: 75 }}
            className="absolute inset-0 z-0"
        >
            <ambientLight intensity={0.2} />
            <pointLight position={[5, 5, 5]} intensity={1} color="#ffcc00" />

            {/* Chispas interactivas */}
            <SparkParticles />

            {/* Partículas de fondo */}
            <points ref={pointsRef}>
                <bufferGeometry attach="geometry">
                    <bufferAttribute
                        attach="attributes-position"
                        array={particles}
                        count={particles.length / 3}
                        itemSize={3}
                    />
                </bufferGeometry>
                <PointMaterial size={0.05} color="white" />
            </points>
        </Canvas>
    );
};

export default BackgroundCanvas;
