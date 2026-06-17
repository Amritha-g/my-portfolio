import React, { useRef, useMemo, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import * as THREE from 'three';

// --------------------------------------------------------
// 1. HERO: Morphing Bioluminescent Organic Blob (Jellyfish style)
// --------------------------------------------------------
function MorphingBlobMesh() {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.35;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.25) * 0.2;
      
      // Pulsing organic scale animation
      const s = 1.0 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.08;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[1.6, 3]} />
      <meshStandardMaterial 
        color="#00ffd0" 
        emissive="#00b894" 
        emissiveIntensity={0.8}
        wireframe 
        transparent
        opacity={0.75}
      />
    </mesh>
  );
}

export function JellyfishBlob() {
  return (
    <div className="canvas-embed">
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#00ffd0" />
        <MorphingBlobMesh />
      </Canvas>
    </div>
  );
}

// --------------------------------------------------------
// 2. ABOUT: Rotating Interests Orbit Ring
// --------------------------------------------------------
function InterestsOrbitMesh() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.15) * 0.08;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Central Core */}
      <mesh>
        <sphereGeometry args={[0.7, 16, 16]} />
        <meshStandardMaterial 
          color="#7affb2" 
          emissive="#00ffd0" 
          emissiveIntensity={0.5} 
          wireframe
        />
      </mesh>

      {/* Orbiting points representing interests */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2.0;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;

        return (
          <group key={i} position={[x, 0, z]}>
            <mesh>
              <dodecahedronGeometry args={[0.22]} />
              <meshBasicMaterial 
                color={i % 2 === 0 ? "#00ffd0" : "#7affb2"} 
                wireframe 
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

export function InterestsOrbit() {
  return (
    <div className="canvas-embed">
      <Canvas camera={{ position: [0, 0, 4.8], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <directionalLight position={[5, 5, 5]} intensity={0.5} />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#7affb2" />
        <InterestsOrbitMesh />
      </Canvas>
    </div>
  );
}

// --------------------------------------------------------
// 3. PROJECT SHOWCASE: Dedicated visualizers
// --------------------------------------------------------

// A. VeloCache: Consistent Hashing Ring
function VeloCacheRingMesh() {
  const ringRef = useRef();
  const packetsRef = useRef([]);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
    packetsRef.current.forEach((pkt, idx) => {
      if (pkt) {
        const speed = 0.6 + idx * 0.2;
        const angle = (state.clock.getElapsedTime() * speed + (idx * Math.PI / 2)) % (Math.PI * 2);
        pkt.position.x = Math.cos(angle) * 1.8;
        pkt.position.z = Math.sin(angle) * 1.8;
        pkt.scale.setScalar(0.4 + Math.sin(state.clock.getElapsedTime() * 4 + idx) * 0.1);
      }
    });
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Node ring wireframe */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.02, 6, 24]} />
          <meshBasicMaterial color="#00ffd0" transparent opacity={0.25} />
        </mesh>
        
        {/* Shard Nodes */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 1.8;
          const z = Math.sin(angle) * 1.8;
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.18, 8, 8]} />
              <meshStandardMaterial 
                color="#00ffd0" 
                emissive="#00ffd0" 
                emissiveIntensity={0.8} 
              />
            </mesh>
          );
        })}
      </group>

      {/* Moving routing request packets */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} ref={el => packetsRef.current[i] = el}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshBasicMaterial color="#7affb2" />
        </mesh>
      ))}
    </group>
  );
}

// B. FlowSentry: Network Intrusion Detection Scanner
function FlowSentryRadarMesh() {
  const radarRef = useRef();
  const packetsRef = useRef();

  useFrame((state) => {
    if (radarRef.current) {
      radarRef.current.rotation.y = state.clock.getElapsedTime() * 0.45;
    }
    if (packetsRef.current) {
      const pos = packetsRef.current.geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += 0.022; // drift upwards
        if (pos[i * 3 + 1] > 1.8) {
          pos[i * 3 + 1] = -1.8; // reset to bottom
        }
      }
      packetsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  const [packetPositions, packetColors] = useMemo(() => {
    const count = 25;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      const isAnomaly = Math.random() > 0.85;
      colors[i * 3] = isAnomaly ? 1.0 : 0.0;     // Red anomaly
      colors[i * 3 + 1] = isAnomaly ? 0.15 : 1.0; // Green regular
      colors[i * 3 + 2] = isAnomaly ? 0.2 : 0.8;
    }
    return [positions, colors];
  }, []);

  return (
    <group position={[0, 0, 0]}>
      {/* Sweeping Cone */}
      <mesh ref={radarRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 2.0, 24, 1, 0, Math.PI / 3]} />
        <meshBasicMaterial color="#00ffd0" transparent opacity={0.3} side={THREE.DoubleSide} />
      </mesh>

      {/* Radar Perimeter */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.02, 6, 24]} />
        <meshBasicMaterial color="#00ffd0" transparent opacity={0.3} />
      </mesh>

      {/* Pulsing traffic points */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[packetPositions, 3]} />
          <bufferAttribute attach="attributes-color" args={[packetColors, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.16} vertexColors transparent opacity={0.9} />
      </points>
    </group>
  );
}

// C. ForensIQ: Multi-Agent node graph
function ForensIQNetworkMesh() {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.1;
    }
  });

  const agents = useMemo(() => {
    return [0, 1, 2].map((i) => {
      const angle = (i / 3) * Math.PI * 2;
      const radius = 1.6;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const points = new Float32Array([0, 0, 0, -x, 0, -z]);
      return { x, z, points };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Central Investigator Core */}
      <mesh>
        <icosahedronGeometry args={[0.55, 1]} />
        <meshStandardMaterial color="#7affb2" emissive="#7affb2" emissiveIntensity={0.6} wireframe />
      </mesh>

      {/* 3 API Scraping Agents */}
      {agents.map((agent, i) => (
        <group key={i} position={[agent.x, 0, agent.z]}>
          <mesh>
            <sphereGeometry args={[0.2, 10, 10]} />
            <meshStandardMaterial color="#00ffd0" emissive="#00ffd0" emissiveIntensity={0.7} />
          </mesh>
          <line>
            <bufferGeometry>
              <bufferAttribute attach="attributes-position" args={[agent.points, 3]} />
            </bufferGeometry>
            <lineBasicMaterial color="#00ffd0" transparent opacity={0.3} />
          </line>
        </group>
      ))}
    </group>
  );
}

// D. ThavanAI: Runway Cylinder Columns Graph
function ThavanAIBarChartMesh({ scaleValue }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.6, 0]}>
      {/* Ground Grid */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <ringGeometry args={[0, 2.1, 8, 1]} />
        <meshBasicMaterial color="#00ffd0" wireframe transparent opacity={0.12} />
      </mesh>

      {/* Columns */}
      {[-1.2, -0.4, 0.4, 1.2].map((xOffset, idx) => {
        // Last bar responds directly to scale slider input
        const dynamicFactor = idx === 3 ? scaleValue : 1.0;
        const height = (0.7 + idx * 0.45) * dynamicFactor;
        const yPos = height / 2;

        return (
          <mesh key={idx} position={[xOffset, yPos, 0]}>
            <boxGeometry args={[0.32, height, 0.32]} />
            <meshStandardMaterial 
              color={idx === 3 ? "#7affb2" : "#00ffd0"} 
              emissive={idx === 3 ? "#7affb2" : "#00ffd0"}
              emissiveIntensity={0.5}
              wireframe 
            />
          </mesh>
        );
      })}
    </group>
  );
}

export function ProjectVisualizer({ type }) {
  const [slider, setSlider] = useState(1.0);

  return (
    <div className="canvas-embed" style={{ position: 'relative' }}>
      <Canvas camera={{ position: [0, 0, 4.5], fov: 50 }} gl={{ antialias: true }}>
        <ambientLight intensity={0.25} />
        <directionalLight position={[3, 3, 3]} intensity={0.5} />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#00ffd0" />
        
        {type === 'velocache' && <VeloCacheRingMesh />}
        {type === 'flowsentry' && <FlowSentryRadarMesh />}
        {type === 'forensiq' && <ForensIQNetworkMesh />}
        {type === 'thavanai' && <ThavanAIBarChartMesh scaleValue={slider} />}
      </Canvas>

      {/* Draggable Simulator Slider for ThavanAI project */}
      {type === 'thavanai' && (
        <div style={{ position: 'absolute', bottom: '1rem', left: '50%', transform: 'translateX(-50%)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', width: '70%', zIndex: 5, pointerEvents: 'auto' }}>
          <span style={{ fontSize: '0.62rem', letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--teal)', fontFamily: 'monospace' }}>
            Simulate Runway Cashflow: {Math.round(slider * 30)} days
          </span>
          <input 
            type="range" 
            min="0.3" 
            max="1.8" 
            step="0.05"
            value={slider} 
            onChange={(e) => setSlider(parseFloat(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--teal)', cursor: 'pointer', background: 'rgba(0,255,208,0.2)', height: '4px', borderRadius: '2px' }}
          />
        </div>
      )}
    </div>
  );
}

// --------------------------------------------------------
// 4. SKILLS: Rotating tech tag cloud points
// --------------------------------------------------------
function TechSphereMesh() {
  const pointsRef = useRef();

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.15;
      pointsRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.1) * 0.05;
    }
  });

  // Generate sphere surface tags points coordinates
  const pointsArray = useMemo(() => {
    const count = 40;
    const array = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2.0 * Math.PI;
      const phi = Math.acos(2.0 * v - 1.0);
      const r = 1.8;
      
      array[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      array[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      array[i * 3 + 2] = r * Math.cos(phi);
    }
    return array;
  }, []);

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pointsArray, 3]} />
      </bufferGeometry>
      <pointsMaterial 
        size={0.15} 
        color="#00ffd0" 
        transparent 
        opacity={0.8} 
      />
    </points>
  );
}

export function TechStackSphere() {
  return (
    <div className="canvas-embed">
      <Canvas camera={{ position: [0, 0, 4.2], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#00ffd0" />
        <TechSphereMesh />
      </Canvas>
    </div>
  );
}

// --------------------------------------------------------
// 5. CONTACT: Scanning 3D Sonar Widget
// --------------------------------------------------------
function SonarDish3DMesh() {
  const scanRef = useRef();

  useFrame((state) => {
    if (scanRef.current) {
      scanRef.current.rotation.y = state.clock.getElapsedTime() * 0.75;
      const s = 1.0 + Math.sin(state.clock.getElapsedTime() * 3.5) * 0.05;
      scanRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, 0]}>
      {/* Sonar Base Grid Cone */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 0.01, 0.6, 16, 1, true]} />
        <meshStandardMaterial color="#00ffd0" wireframe transparent opacity={0.3} />
      </mesh>

      {/* Pulsing Sonar Sweep */}
      <mesh ref={scanRef} position={[0, 0, 0.15]}>
        <ringGeometry args={[0, 1.4, 24, 1, 0, Math.PI / 4]} />
        <meshBasicMaterial color="#7affb2" transparent opacity={0.45} side={THREE.DoubleSide} />
      </mesh>
    </group>
  );
}

export function SonarDish3D() {
  return (
    <div className="canvas-embed">
      <Canvas camera={{ position: [0, 0, 4.0], fov: 50 }}>
        <ambientLight intensity={0.2} />
        <pointLight position={[0, 0, 4]} intensity={0.8} color="#7affb2" />
        <SonarDish3DMesh />
      </Canvas>
    </div>
  );
}
