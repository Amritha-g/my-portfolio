import React, { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Stations({ curve, activeStation }) {
  // Compute positions along the spline path for our 9 sections
  const stationPositions = useMemo(() => {
    const positions = [];
    for (let i = 0; i <= 8; i++) {
      const t = i / 8;
      const point = curve.getPointAt(t);
      const tangent = curve.getTangentAt(t);
      positions.push({ point, tangent, index: i });
    }
    return positions;
  }, [curve]);

  return (
    <group>
      {stationPositions.map((st) => {
        // Build rotation coordinate system to align items perpendicular to spline curve
        const up = new THREE.Vector3(0, 1, 0);
        const quaternion = new THREE.Quaternion().setFromUnitVectors(up, st.tangent);
        
        return (
          <group 
            key={st.index} 
            position={[st.point.x, st.point.y, st.point.z]}
            quaternion={quaternion}
          >
            {st.index === 0 && <HeroStation active={activeStation === 0} />}
            {st.index === 1 && <AboutStation active={activeStation === 1} />}
            {st.index === 2 && <VeloCacheStation active={activeStation === 2} />}
            {st.index === 3 && <FlowSentryStation active={activeStation === 3} />}
            {st.index === 4 && <ForensIQStation active={activeStation === 4} />}
            {st.index === 5 && <ThavanAIStation active={activeStation === 5} />}
            {st.index === 6 && <TechStackStation active={activeStation === 6} />}
            {st.index === 7 && <TimelineStation active={activeStation === 7} />}
            {st.index === 8 && <ContactStation active={activeStation === 8} />}
          </group>
        );
      })}
    </group>
  );
}

// 1. HERO STATION (t = 0.00) - Central morphing crystal
function HeroStation({ active }) {
  const meshRef = useRef();
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
      meshRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.2) * 0.3;
      
      // Morphing scale pulsing
      const s = 1.0 + Math.sin(state.clock.getElapsedTime() * 1.5) * 0.05;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={meshRef} position={[0, 0, -5]}>
      <octahedronGeometry args={[1.5, 2]} />
      <meshStandardMaterial 
        color="#00ffd0" 
        emissive="#00b894" 
        emissiveIntensity={0.8}
        wireframe 
        transparent 
        opacity={active ? 0.8 : 0.3}
      />
    </mesh>
  );
}

// 2. ABOUT STATION (t = 0.125) - Rotating Profile Ring & Interests
function AboutStation({ active }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -6]}>
      {/* Central Profile Orb */}
      <mesh>
        <sphereGeometry args={[0.8, 16, 16]} />
        <meshStandardMaterial 
          color="#7affb2" 
          emissive="#00ffd0" 
          emissiveIntensity={0.5} 
          wireframe
          transparent 
          opacity={active ? 0.85 : 0.3} 
        />
      </mesh>
      
      {/* Surrounding orbital interest points */}
      {[0, 1, 2, 3, 4, 5].map((i) => {
        const angle = (i / 6) * Math.PI * 2;
        const radius = 2.2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={i} position={[x, 0, z]}>
            <mesh>
              <dodecahedronGeometry args={[0.22]} />
              <meshBasicMaterial 
                color={i % 2 === 0 ? "#00ffd0" : "#7affb2"} 
                wireframe 
                transparent 
                opacity={active ? 0.9 : 0.2}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// 3. VELOCACHE STATION (t = 0.25) - Consistent Hash Ring
function VeloCacheStation({ active }) {
  const ringRef = useRef();
  const packetsRef = useRef([]);

  useFrame((state) => {
    if (ringRef.current) {
      ringRef.current.rotation.y = state.clock.getElapsedTime() * 0.25;
    }
    
    // Animate glowing data packets traveling along the ring to nodes
    packetsRef.current.forEach((pkt, idx) => {
      if (pkt) {
        const speed = 0.8 + idx * 0.25;
        const angle = (state.clock.getElapsedTime() * speed + (idx * Math.PI / 2)) % (Math.PI * 2);
        pkt.position.x = Math.cos(angle) * 1.8;
        pkt.position.z = Math.sin(angle) * 1.8;
        
        // Pulse visibility
        pkt.scale.setScalar(0.4 + Math.sin(state.clock.getElapsedTime() * 4 + idx) * 0.15);
      }
    });
  });

  return (
    <group position={[0, 0, -6]}>
      {/* Node Ring */}
      <group ref={ringRef}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.8, 0.03, 8, 36]} />
          <meshBasicMaterial color="#00ffd0" transparent opacity={0.3} />
        </mesh>
        
        {/* Consistent Hash Nodes */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x = Math.cos(angle) * 1.8;
          const z = Math.sin(angle) * 1.8;
          
          return (
            <mesh key={i} position={[x, 0, z]}>
              <sphereGeometry args={[0.2, 8, 8]} />
              <meshStandardMaterial 
                color="#00ffd0" 
                emissive="#00ffd0" 
                emissiveIntensity={active ? 1.0 : 0.2} 
                transparent 
                opacity={active ? 0.9 : 0.3} 
              />
            </mesh>
          );
        })}
      </group>

      {/* Travelling data packets (glowing particles routing requests) */}
      {[0, 1, 2, 3].map((i) => (
        <mesh 
          key={i} 
          ref={el => packetsRef.current[i] = el}
        >
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial 
            color="#7affb2" 
            transparent 
            opacity={active ? 1.0 : 0.2} 
          />
        </mesh>
      ))}
    </group>
  );
}

// 4. FLOWSENTRY STATION (t = 0.375) - SOC radar scan grid
function FlowSentryStation({ active }) {
  const radarRef = useRef();
  const packetsRef = useRef();

  useFrame((state) => {
    if (radarRef.current) {
      radarRef.current.rotation.y = state.clock.getElapsedTime() * 0.5;
    }

    if (packetsRef.current) {
      // Flow packets scrolling upwards
      const pos = packetsRef.current.geometry.attributes.position.array;
      const count = pos.length / 3;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += 0.02; // move up
        if (pos[i * 3 + 1] > 1.8) {
          pos[i * 3 + 1] = -1.8; // reset to bottom
        }
      }
      packetsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  // Flow packets coordinate grid
  const [packetPositions, packetColors] = useMemo(() => {
    const count = 30;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    
    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 3;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 3.6;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 1.5;

      // Anomalous threats are red (10% of flows)
      const isAnomaly = Math.random() > 0.88;
      colors[i * 3] = isAnomaly ? 1.0 : 0.0;     // Red
      colors[i * 3 + 1] = isAnomaly ? 0.1 : 1.0; // Green / Teal
      colors[i * 3 + 2] = isAnomaly ? 0.2 : 0.8; // Blue
    }
    return [positions, colors];
  }, []);

  return (
    <group position={[0, 0, -6]}>
      {/* Radar scanning disk */}
      <mesh ref={radarRef} rotation={[Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 2.0, 32, 1, 0, Math.PI / 3]} />
        <meshBasicMaterial 
          color="#00ffd0" 
          transparent 
          opacity={active ? 0.25 : 0.05} 
          side={THREE.DoubleSide} 
        />
      </mesh>

      {/* Perimeter Ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[2.0, 0.02, 8, 36]} />
        <meshBasicMaterial color="#00ffd0" transparent opacity={active ? 0.35 : 0.1} />
      </mesh>

      {/* Interactive packet flows */}
      <points ref={packetsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[packetPositions, 3]}
          />
          <bufferAttribute
            attach="attributes-color"
            args={[packetColors, 3]}
          />
        </bufferGeometry>
        <pointsMaterial 
          size={0.16} 
          vertexColors 
          transparent 
          opacity={active ? 0.9 : 0.2} 
        />
      </points>
    </group>
  );
}

// 5. FORENSIQ STATION (t = 0.50) - Multi-Agent connection structure
function ForensIQStation({ active }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.3;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.4) * 0.15;
    }
  });

  const agents = useMemo(() => {
    return [0, 1, 2].map((i) => {
      const angle = (i / 3) * Math.PI * 2;
      const radius = 1.7;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const points = new Float32Array([0, 0, 0, -x, 0, -z]);
      return { x, z, points };
    });
  }, []);

  return (
    <group ref={groupRef} position={[0, 0, -6]}>
      {/* Central Investigator core */}
      <mesh>
        <icosahedronGeometry args={[0.6, 1]} />
        <meshStandardMaterial 
          color="#7affb2" 
          emissive="#7affb2" 
          emissiveIntensity={active ? 0.8 : 0.1}
          wireframe
          transparent 
          opacity={active ? 0.9 : 0.25} 
        />
      </mesh>

      {/* 3 Agents: SEC agent, BSE agent, NSE agent */}
      {agents.map((agent, i) => {
        return (
          <group key={i} position={[agent.x, 0, agent.z]}>
            {/* Agent Sphere */}
            <mesh>
              <sphereGeometry args={[0.22, 12, 12]} />
              <meshStandardMaterial 
                color="#00ffd0" 
                emissive="#00ffd0" 
                emissiveIntensity={active ? 0.9 : 0.2}
                transparent 
                opacity={active ? 0.95 : 0.3} 
              />
            </mesh>

            {/* Connection Link back to Core */}
            <line>
              <bufferGeometry>
                <bufferAttribute 
                  attach="attributes-position" 
                  args={[agent.points, 3]} 
                />
              </bufferGeometry>
              <lineBasicMaterial 
                color="#00ffd0" 
                transparent 
                opacity={active ? 0.4 : 0.1} 
              />
            </line>
          </group>
        );
      })}
    </group>
  );
}

// 6. THAVANAI STATION (t = 0.625) - SME financial cash runway cylinder graph
function ThavanAIStation({ active }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -6]}>
      {/* Ground Grid Platform */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.6, 0]}>
        <ringGeometry args={[0, 2.2, 8, 1]} />
        <meshBasicMaterial color="#00ffd0" wireframe transparent opacity={0.1} />
      </mesh>

      {/* 3D runway charts bars */}
      {[-1.2, -0.4, 0.4, 1.2].map((xOffset, idx) => {
        const height = 0.8 + idx * 0.45;
        const yPos = -0.6 + height / 2;

        return (
          <mesh key={idx} position={[xOffset, yPos, 0]}>
            <boxGeometry args={[0.3, height, 0.3]} />
            <meshStandardMaterial 
              color={idx === 3 ? "#7affb2" : "#00ffd0"} 
              emissive={idx === 3 ? "#7affb2" : "#00ffd0"}
              emissiveIntensity={active ? 0.6 : 0.1}
              wireframe 
              transparent 
              opacity={active ? 0.95 : 0.25} 
            />
          </mesh>
        );
      })}
    </group>
  );
}

// 7. TECH STACK STATION (t = 0.75) - Floating code framework grid
function TechStackStation({ active }) {
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.getElapsedTime() * 0.5) * 0.25;
      groupRef.current.rotation.x = Math.cos(state.clock.getElapsedTime() * 0.3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, -6.5]}>
      {/* Floating Holographic Interface */}
      <mesh>
        <planeGeometry args={[3.2, 2.0]} />
        <meshBasicMaterial 
          color="#010a14" 
          transparent 
          opacity={active ? 0.6 : 0.15} 
          side={THREE.DoubleSide}
        />
      </mesh>
      
      {/* Tech screen outline border */}
      <lineSegments>
        <edgesGeometry args={[new THREE.PlaneGeometry(3.2, 2.0)]} />
        <lineBasicMaterial color="#00ffd0" transparent opacity={active ? 0.8 : 0.2} />
      </lineSegments>

      {/* Floating glowing bits indicating technology metrics */}
      {[-1.2, 0, 1.2].map((x, i) => (
        <mesh key={i} position={[x, 0.4, 0.15]}>
          <boxGeometry args={[0.4, 0.1, 0.1]} />
          <meshBasicMaterial 
            color="#7affb2" 
            transparent 
            opacity={active ? 0.9 : 0.2} 
          />
        </mesh>
      ))}
    </group>
  );
}

// 8. TIMELINE STATION (t = 0.875) - Checkpoint milestones
function TimelineStation({ active }) {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.getElapsedTime() * 0.3;
      meshRef.current.rotation.y = state.clock.getElapsedTime() * 0.4;
    }
  });

  return (
    <group position={[0, 0, -6.5]}>
      {/* Horizontal timeline core bar */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.04, 0.04, 3.6, 8]} />
        <meshBasicMaterial color="#00ffd0" transparent opacity={0.25} />
      </mesh>

      {/* Timeline nodes */}
      {[-1.3, 0, 1.3].map((x, idx) => (
        <group key={idx} position={[x, 0, 0]}>
          <mesh ref={idx === 1 ? meshRef : null}>
            <octahedronGeometry args={[0.25]} />
            <meshStandardMaterial 
              color={idx === 1 ? "#7affb2" : "#00ffd0"} 
              emissive={idx === 1 ? "#7affb2" : "#00ffd0"}
              emissiveIntensity={active ? 0.8 : 0.1}
              transparent 
              opacity={active ? 0.95 : 0.3} 
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

// 9. CONTACT STATION (t = 1.00) - Scanning sonar active radar dish
function ContactStation({ active }) {
  const scanRef = useRef();

  useFrame((state) => {
    if (scanRef.current) {
      scanRef.current.rotation.y = state.clock.getElapsedTime() * 0.8;
      // Pulse scale
      const s = 1.0 + Math.sin(state.clock.getElapsedTime() * 3) * 0.08;
      scanRef.current.scale.set(s, s, s);
    }
  });

  return (
    <group position={[0, 0, -6]}>
      {/* Radar base cone */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[1.5, 0.01, 0.8, 16, 1, true]} />
        <meshStandardMaterial 
          color="#00ffd0" 
          wireframe 
          transparent 
          opacity={active ? 0.4 : 0.1} 
        />
      </mesh>

      {/* Radar active glowing radar sweep sweep */}
      <mesh ref={scanRef} position={[0, 0, 0.2]}>
        <ringGeometry args={[0, 1.4, 24, 1, 0, Math.PI / 4]} />
        <meshBasicMaterial 
          color="#7affb2" 
          transparent 
          opacity={active ? 0.5 : 0.15} 
          side={THREE.DoubleSide} 
        />
      </mesh>
    </group>
  );
}
