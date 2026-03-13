import React, { useRef, useState, useEffect, forwardRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import * as THREE from 'three';
import nipplejs from 'nipplejs'; // <-- ДОБАВЛЕНО

// ================ КОМПОНЕНТ КАМЕРЫ ================
const WorldOfTanksCamera = ({ targetRef, turretRef, onZoomChange }) => {
  const { camera } = useThree();
  
  const CAMERA_CONFIG = {
    MIN_DISTANCE: 3,
    MAX_DISTANCE: 20,
    START_DISTANCE: 12,
    SNIPER_DISTANCE: 4,
    MIN_PITCH: -10 * (Math.PI / 180),
    MAX_PITCH: 80 * (Math.PI / 180),
    ROTATION_SPEED: 0.005,
    FOLLOW_SPEED: 8,
    ZOOM_STEPS: [3, 5, 8, 12, 15, 20],
  };
  
  const [distance, setDistance] = useState(CAMERA_CONFIG.START_DISTANCE);
  const [horizontalAngle, setHorizontalAngle] = useState(0);
  const [verticalAngle, setVerticalAngle] = useState(0.3);
  const [isSniping, setIsSniping] = useState(false);
  const [isFreeLook, setIsFreeLook] = useState(false);
  
  const mousePressed = useRef({ left: false, right: false });
  
  // Передаём угол камеры башне
  useEffect(() => {
    if (turretRef?.current) {
      turretRef.current.cameraAngle = horizontalAngle;
    }
  }, [horizontalAngle, turretRef]);
  
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0) mousePressed.current.left = true;
      if (e.button === 2) {
        mousePressed.current.right = true;
        setIsFreeLook(true);
      }
    };
    
    const handleMouseUp = (e) => {
      if (e.button === 0) mousePressed.current.left = false;
      if (e.button === 2) {
        mousePressed.current.right = false;
        setIsFreeLook(false);
      }
    };
    
    const handleMouseMove = (e) => {
      if (!mousePressed.current.right && !mousePressed.current.left) return;
      
      const deltaX = -e.movementX * CAMERA_CONFIG.ROTATION_SPEED;
      const deltaY = e.movementY * CAMERA_CONFIG.ROTATION_SPEED;
      
      setHorizontalAngle(prev => prev + deltaX);
      setVerticalAngle(prev => {
        const newAngle = prev + deltaY;
        return Math.max(CAMERA_CONFIG.MIN_PITCH, Math.min(CAMERA_CONFIG.MAX_PITCH, newAngle));
      });
    };
    
    const handleWheel = (e) => {
      e.preventDefault();
      
      const currentIndex = CAMERA_CONFIG.ZOOM_STEPS.findIndex(step => Math.abs(step - distance) < 0.1);
      let newIndex;
      
      if (e.deltaY < 0) {
        newIndex = currentIndex > 0 ? currentIndex - 1 : 0;
      } else {
        newIndex = currentIndex < CAMERA_CONFIG.ZOOM_STEPS.length - 1 
          ? currentIndex + 1 
          : CAMERA_CONFIG.ZOOM_STEPS.length - 1;
      }
      
      const newDistance = CAMERA_CONFIG.ZOOM_STEPS[newIndex];
      setDistance(newDistance);
      
      const sniping = newDistance <= CAMERA_CONFIG.SNIPER_DISTANCE;
      setIsSniping(sniping);
      if (onZoomChange) onZoomChange({ distance: newDistance, isSniping: sniping });
    };
    
    const handleContextMenu = (e) => e.preventDefault();
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('wheel', handleWheel, { passive: false });
    window.addEventListener('contextmenu', handleContextMenu);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [distance, onZoomChange, horizontalAngle]);
  
  useFrame((state, delta) => {
    if (!targetRef.current) return;
    
    const targetPos = targetRef.current.position.clone();
    targetPos.y += 1.5;
    
    const idealOffset = new THREE.Vector3(
      Math.sin(horizontalAngle) * Math.cos(verticalAngle) * distance,
      Math.sin(verticalAngle) * distance,
      Math.cos(horizontalAngle) * Math.cos(verticalAngle) * distance
    );
    
    const idealPosition = targetPos.clone().add(idealOffset);
    
    camera.position.lerp(idealPosition, delta * CAMERA_CONFIG.FOLLOW_SPEED);
    camera.lookAt(targetPos);
  });
  
  return null;
};

// ================ КОМПОНЕНТ БАШНИ ================
const Turret = forwardRef(({ hullRef }, ref) => {
  const turretRef = useRef();
  const gunRef = useRef();
  const [targetAngle, setTargetAngle] = useState(0);
  
  // Объединяем внутренний ref с внешним
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(turretRef.current);
      } else {
        ref.current = turretRef.current;
      }
    }
  }, [ref]);
  
  // Получаем угол от камеры
  useEffect(() => {
    const interval = setInterval(() => {
      if (turretRef.current && turretRef.current.cameraAngle !== undefined) {
        setTargetAngle(turretRef.current.cameraAngle);
      }
    }, 16);
    return () => clearInterval(interval);
  }, []);
  
  // Поворот башни
  useFrame(() => {
    if (!turretRef.current) return;
    
    const currentAngle = turretRef.current.rotation.y;
    let angleDiff = targetAngle - currentAngle;
    
    while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
    while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
    
    turretRef.current.rotation.y += angleDiff * 0.1;
  });
  
  return (
    <group ref={turretRef} position={[0, 0.8, 0]}>
      {/* Башня */}
      <mesh castShadow receiveShadow>
        <cylinderGeometry args={[1.2, 1.2, 0.6, 32]} />
        <meshStandardMaterial color="#2c5a2c" />
      </mesh>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1, 1, 0.4, 32]} />
        <meshStandardMaterial color="#3a6e3a" />
      </mesh>
      <mesh position={[0.3, 0.7, 0.3]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.3, 8]} />
        <meshStandardMaterial color="#4a7a4a" />
      </mesh>
      <mesh position={[0, 0.2, 0.9]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.3, 8]} />
        <meshStandardMaterial color="#1a2f4a" />
      </mesh>
      <group ref={gunRef} position={[0, 0.2, 1.2]}>
        <mesh castShadow receiveShadow>
          <cylinderGeometry args={[0.15, 0.15, 2.5, 8]} />
          <meshStandardMaterial color="#1a2f4a" />
        </mesh>
        <mesh position={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.25, 0.25, 0.3, 8]} />
          <meshStandardMaterial color="#2c4f7a" />
        </mesh>
        <mesh position={[0, 0, 1.3]}>
          <cylinderGeometry args={[0.2, 0.2, 0.2, 8]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
      </group>
      <mesh position={[-0.5, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.3]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      <mesh position={[0.5, 0.4, -0.2]} castShadow>
        <boxGeometry args={[0.2, 0.2, 0.3]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
    </group>
  );
});

// ================ КОМПОНЕНТ ДЖОЙСТИКА ДЛЯ ТЕЛЕФОНА ================ // <-- ДОБАВЛЕНО
const Joystick = ({ onMove, onShoot }) => {
  const joystickRef = useRef(null);
  const zoneRef = useRef(null);
  
  useEffect(() => {
    if (!zoneRef.current) return;
    
    const manager = nipplejs.create({
      zone: zoneRef.current,
      mode: 'static',
      position: { left: '50%', top: '50%' },
      color: 'blue',
      size: 120,
      restOpacity: 0.5,
    });
    
    manager.on('move', (evt, nipple) => {
      const angle = nipple.angle?.radian || 0;
      const force = Math.min(nipple.force || 0, 1);
      
      if (onMove) {
        onMove({
          forward: Math.cos(angle) * force,
          right: Math.sin(angle) * force,
          angle,
          force
        });
      }
    });
    
    manager.on('end', () => {
      if (onMove) {
        onMove({ forward: 0, right: 0, force: 0 });
      }
    });
    
    return () => {
      manager.destroy();
    };
  }, [onMove]);
  
  // Определяем, телефон ли это
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  if (!isMobile) return null;
  
  return (
    <>
      {/* Зона джойстика */}
      <div
        ref={zoneRef}
        style={{
          position: 'fixed',
          bottom: '30px',
          left: '30px',
          width: '150px',
          height: '150px',
          zIndex: 2000,
          touchAction: 'none',
        }}
      />
      
      {/* Кнопка стрельбы */}
      <button
        onTouchStart={(e) => {
          e.preventDefault();
          onShoot?.();
        }}
        style={{
          position: 'fixed',
          bottom: '30px',
          right: '30px',
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: '#f44336',
          color: 'white',
          border: '3px solid white',
          fontSize: '16px',
          fontWeight: 'bold',
          zIndex: 2000,
          touchAction: 'none',
          boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
        }}
      >
        🔫
      </button>
    </>
  );
};

// ================ ТАНК ИГРОКА ================
const PlayerTank = forwardRef(({ position, tankStats, onShoot, onPositionChange, isAlive, turretRef, joystickInput }, ref) => { // <-- ДОБАВЛЕН joystickInput
  const hullRef = useRef();
  const [aimRadius, setAimRadius] = useState(0.2);
  const [lastShotTime, setLastShotTime] = useState(0);
  const [canShoot, setCanShoot] = useState(true);
  
  // Передаём ref корпуса наружу
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(hullRef.current);
      } else {
        ref.current = hullRef.current;
      }
    }
  }, [ref]);
  
  // Храним актуальный угол башни
  const currentTurretAngle = useRef(0);
  useFrame(() => {
    if (turretRef?.current) {
      currentTurretAngle.current = turretRef.current.rotation.y;
    }
  });
  
  // Движение корпуса
  useFrame((state, delta) => {
    if (!isAlive || !hullRef.current) return;
    
    const moveSpeed = tankStats.speed * delta * 3;
    const rotateSpeed = 1.5 * delta;
    
    let moving = false;
    
    // КЛАВИАТУРА (для ПК)
    if (window.keysPressed?.w) {
      hullRef.current.position.x -= Math.sin(hullRef.current.rotation.y) * moveSpeed;
      hullRef.current.position.z -= Math.cos(hullRef.current.rotation.y) * moveSpeed;
      moving = true;
    }
    if (window.keysPressed?.s) {
      hullRef.current.position.x += Math.sin(hullRef.current.rotation.y) * moveSpeed;
      hullRef.current.position.z += Math.cos(hullRef.current.rotation.y) * moveSpeed;
      moving = true;
    }
    if (window.keysPressed?.a) {
      hullRef.current.rotation.y += rotateSpeed;
      moving = true;
    }
    if (window.keysPressed?.d) {
      hullRef.current.rotation.y -= rotateSpeed;
      moving = true;
    }
    
    // ДЖОЙСТИК (для телефона) // <-- ДОБАВЛЕНО
    if (joystickInput?.force > 0.1) {
      const moveX = Math.sin(joystickInput.angle) * joystickInput.force * moveSpeed * 2;
      const moveZ = Math.cos(joystickInput.angle) * joystickInput.force * moveSpeed * 2;
      
      // Движение относительно направления танка
      hullRef.current.position.x += moveX * Math.cos(hullRef.current.rotation.y) + moveZ * Math.sin(hullRef.current.rotation.y);
      hullRef.current.position.z += moveZ * Math.cos(hullRef.current.rotation.y) - moveX * Math.sin(hullRef.current.rotation.y);
      
      moving = true;
    }
    
    onPositionChange({
      x: hullRef.current.position.x,
      y: hullRef.current.position.y,
      z: hullRef.current.position.z
    });
    
    const targetRadius = moving ? 0.8 : 0.2;
    setAimRadius(prev => prev + (targetRadius - prev) * 0.05);
    
    if (!canShoot) {
      const timePassed = (Date.now() - lastShotTime) / 1000;
      if (timePassed >= 2) {
        setCanShoot(true);
      }
    }
  });
  
  const shoot = () => {
    if (!canShoot || !hullRef.current || !isAlive) return;
    
    setCanShoot(false);
    setLastShotTime(Date.now());
    
    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * aimRadius;
    const offsetX = Math.sin(angle) * distance;
    const offsetZ = Math.cos(angle) * distance;
    
    const shootAngle = currentTurretAngle.current;
    
    const shootPos = {
      x: hullRef.current.position.x + Math.sin(shootAngle) * 2,
      y: hullRef.current.position.y + 1.2,
      z: hullRef.current.position.z + Math.cos(shootAngle) * 2
    };
    
    onShoot({
      position: shootPos,
      direction: shootAngle,
      offset: { x: offsetX, z: offsetZ },
      damage: tankStats.damage
    });
  };
  
  // Добавляем метод shoot на ref для вызова извне // <-- ДОБАВЛЕНО
  useEffect(() => {
    if (hullRef.current) {
      hullRef.current.shoot = shoot;
    }
  }, [canShoot, isAlive]);
  
  useEffect(() => {
    const handleMouseDown = (e) => {
      if (e.button === 0 && isAlive) {
        e.preventDefault();
        shoot();
      }
    };
    
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && isAlive) {
        e.preventDefault();
        shoot();
      }
    };
    
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canShoot, isAlive]);
  
  if (!isAlive) return null;
  
  return (
    <group ref={hullRef} position={position}>
      {/* Корпус */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2.2, 1, 3.5]} />
        <meshStandardMaterial color="#3a6ea5" />
      </mesh>
      <mesh position={[0, 0.5, 1.6]} rotation={[0.2, 0, 0]} castShadow>
        <boxGeometry args={[2.2, 0.8, 0.5]} />
        <meshStandardMaterial color="#2c5a8c" />
      </mesh>
      <mesh position={[-1.3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.6, 3.8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      <mesh position={[1.3, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 0.6, 3.8]} />
        <meshStandardMaterial color="#333333" />
      </mesh>
      
      {[-1.2, 0, 1.2].map((z, i) => (
        <React.Fragment key={i}>
          <mesh position={[-1.1, -0.2, z]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
          <mesh position={[1.1, -0.2, z]} castShadow>
            <cylinderGeometry args={[0.5, 0.5, 0.3, 12]} />
            <meshStandardMaterial color="#444444" />
          </mesh>
        </React.Fragment>
      ))}
      
      <mesh position={[0.6, 0.3, 1.2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 8]} />
        <meshStandardMaterial color="#5a5a5a" />
      </mesh>
      
      {/* Башня */}
      <Turret ref={turretRef} hullRef={hullRef} />
      
      {/* Круг разброса */}
      <Html position={[0, 2.5, 0]}>
        <div style={{
          position: 'relative',
          width: aimRadius * 150,
          height: aimRadius * 150,
        }}>
          <div style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '2px solid rgba(255,0,0,0.5)',
            backgroundColor: 'rgba(255,0,0,0.05)',
          }} />
          <div style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: 'white',
            transform: 'translate(-50%, -50%)',
            boxShadow: '0 0 10px white',
          }} />
        </div>
      </Html>
      
      {/* Полоска здоровья */}
      <Html position={[0, 3.2, 0]}>
        <div style={{
          width: '120px',
          height: '8px',
          backgroundColor: '#333',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(tankStats.hp / tankStats.baseHp) * 100}%`,
            height: '100%',
            backgroundColor: '#4caf50'
          }} />
        </div>
      </Html>
    </group>
  );
});

// ================ ТАНК БОТА ================
const BotTank = forwardRef(({ position, onShoot, health, onPositionChange, isAlive }, ref) => {
  const hullRef = useRef();
  const [lastShotTime, setLastShotTime] = useState(0);
  const [canShoot, setCanShoot] = useState(true);
  
  useEffect(() => {
    if (ref) {
      if (typeof ref === 'function') {
        ref(hullRef.current);
      } else {
        ref.current = hullRef.current;
      }
    }
  }, [ref]);
  
  useFrame((state, delta) => {
    if (!isAlive || !hullRef.current) return;
    
    onPositionChange({
      x: hullRef.current.position.x,
      y: hullRef.current.position.y,
      z: hullRef.current.position.z
    });
    
    if (!canShoot) {
      const timePassed = (Date.now() - lastShotTime) / 1000;
      if (timePassed >= 2) {
        setCanShoot(true);
      }
    }
  });
  
  const tryShoot = (playerPos) => {
    if (!canShoot || !hullRef.current || !playerPos || !isAlive) return false;
    
    const botPos = hullRef.current.position;
    const distance = Math.sqrt(
      (playerPos.x - botPos.x) ** 2 + (playerPos.z - botPos.z) ** 2
    );
    
    if (distance < 15 && Date.now() - lastShotTime > 2000) {
      const angleToPlayer = Math.atan2(
        playerPos.x - botPos.x,
        playerPos.z - botPos.z
      );
      
      hullRef.current.rotation.y = angleToPlayer;
      
      setCanShoot(false);
      setLastShotTime(Date.now());
      
      const shootPos = {
        x: botPos.x + Math.sin(angleToPlayer) * 2,
        y: botPos.y + 1.2,
        z: botPos.z + Math.cos(angleToPlayer) * 2
      };
      
      onShoot({
        position: shootPos,
        direction: angleToPlayer,
        offset: { x: 0, z: 0 },
        damage: 30
      });
      
      return true;
    }
    
    return false;
  };
  
  useEffect(() => {
    if (hullRef.current) {
      hullRef.current.tryShoot = tryShoot;
    }
  }, [canShoot, lastShotTime, isAlive]);
  
  if (!isAlive) return null;
  
  return (
    <group ref={hullRef} position={position}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[2, 1, 3]} />
        <meshStandardMaterial color="#8b3a3a" />
      </mesh>
      <mesh position={[0, 0.8, 0]} castShadow>
        <cylinderGeometry args={[1, 1, 0.8, 32]} />
        <meshStandardMaterial color="#6b2c2c" />
      </mesh>
      <mesh position={[0, 1.2, 1.2]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 2, 8]} />
        <meshStandardMaterial color="#4a1a1a" />
      </mesh>
      
      <Html position={[0, 2.8, 0]}>
        <div style={{
          width: '100px',
          height: '8px',
          backgroundColor: '#333',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${(health / 500) * 100}%`,
            height: '100%',
            backgroundColor: '#f44336'
          }} />
        </div>
      </Html>
    </group>
  );
});

// ================ 2D ЭФФЕКТ ПОПАДАНИЯ ================
const HitEffect2D = ({ effect, onComplete }) => {
  const [style, setStyle] = useState({
    opacity: 1,
    transform: 'translate(-50%, -50%)'
  });
  
  useEffect(() => {
    const startTime = Date.now();
    const duration = 500;
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      setStyle({
        opacity: 1 - progress,
        transform: `translate(-50%, calc(-50% - ${progress * 30}px))`
      });
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        onComplete();
      }
    };
    
    const frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [onComplete]);
  
  return (
    <div style={{
      position: 'absolute',
      left: effect.x,
      top: effect.y,
      color: effect.isEnemy ? '#ffaa00' : '#ff4444',
      fontSize: '28px',
      fontWeight: 'bold',
      textShadow: '2px 2px 2px black',
      ...style,
      whiteSpace: 'nowrap',
      pointerEvents: 'none',
      zIndex: 1500
    }}>
      -{effect.damage}
    </div>
  );
};

// ================ СНАРЯД ================
const Shell = ({ data, onHit, playerPos, botPos, onExplosion }) => {
  const [position, setPosition] = useState(() => ({
    x: data.position.x,
    y: data.position.y,
    z: data.position.z
  }));
  const [active, setActive] = useState(true);
  
  useEffect(() => {
    if (!active) return;
    
    let animationId;
    let lastTime = performance.now();
    
    const moveShell = (currentTime) => {
      if (!active) return;
      
      const delta = (currentTime - lastTime) / 1000;
      lastTime = currentTime;
      
      setPosition(prev => {
        const newX = prev.x + Math.sin(data.direction) * delta * 30;
        const newZ = prev.z + Math.cos(data.direction) * delta * 30;
        
        const target = data.isPlayer ? botPos : playerPos;
        if (target) {
          const distance = Math.sqrt(
            (newX - target.x) ** 2 + (newZ - target.z) ** 2
          );
          
          if (distance < 3) {
            setActive(false);
            onExplosion({
              type: 'hit',
              x: '50%',
              y: '50%',
              damage: data.damage,
              isEnemy: !data.isPlayer
            });
            onHit(data.damage, data.isPlayer);
            return prev;
          }
        }
        
        if (Math.abs(newX) > 50 || Math.abs(newZ) > 50) {
          setActive(false);
          return prev;
        }
        
        return { x: newX, y: prev.y, z: newZ };
      });
      
      if (active) {
        animationId = requestAnimationFrame(moveShell);
      }
    };
    
    animationId = requestAnimationFrame(moveShell);
    
    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [active, data, playerPos, botPos, onHit, onExplosion]);
  
  if (!active) return null;
  
  return (
    <mesh position={[position.x, position.y, position.z]}>
      <sphereGeometry args={[0.4, 16]} />
      <meshStandardMaterial color="#ffff00" emissive="#ffaa00" />
    </mesh>
  );
};

// ================ КАРТА ================
const Map = () => {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="#3d5a3d" />
      </mesh>
      
      <mesh position={[5, 0.5, 5]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#8b8b8b" />
      </mesh>
      <mesh position={[-5, 0.5, -5]} castShadow receiveShadow>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#8b8b8b" />
      </mesh>
      
      <mesh position={[48, 2.5, 0]} receiveShadow>
        <boxGeometry args={[4, 5, 100]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
      <mesh position={[-48, 2.5, 0]} receiveShadow>
        <boxGeometry args={[4, 5, 100]} />
        <meshStandardMaterial color="#4a4a4a" />
      </mesh>
    </>
  );
};

// ================ ГЛАВНЫЙ КОМПОНЕНТ ================
const TankBattle = ({ playerTank, onBattleEnd, onExit }) => {
  const [playerHealth, setPlayerHealth] = useState(playerTank.hp);
  const [enemyHealth, setEnemyHealth] = useState(500);
  const [shells, setShells] = useState([]);
  const [battleResult, setBattleResult] = useState(null);
  const [playerPos, setPlayerPos] = useState(null);
  const [botPos, setBotPos] = useState(null);
  const [playerAlive, setPlayerAlive] = useState(true);
  const [botAlive, setBotAlive] = useState(true);
  const [effects, setEffects] = useState([]);
  const [exitTimer, setExitTimer] = useState(3);
  const [cameraInfo, setCameraInfo] = useState({ distance: 12, isSniping: false });
  const [joystickInput, setJoystickInput] = useState({ forward: 0, right: 0, force: 0 }); // <-- ДОБАВЛЕНО
  
  const playerRef = useRef();
  const turretRef = useRef();
  const botRef = useRef();
  
  const handlePlayerShoot = (shotData) => {
    setShells(prev => [...prev, {
      ...shotData,
      id: Date.now() + Math.random(),
      isPlayer: true
    }]);
  };
  
  const handleBotShoot = (shotData) => {
    setShells(prev => [...prev, {
      ...shotData,
      id: Date.now() + Math.random(),
      isPlayer: false
    }]);
  };
  
  const handleExplosion = (effect) => {
    setEffects(prev => [...prev, { ...effect, id: Date.now() + Math.random() }]);
  };
  
  const handleEffectComplete = (id) => {
    setEffects(prev => prev.filter(e => e.id !== id));
  };
  
  const handleHit = (damage, isPlayerShot) => {
    if (isPlayerShot) {
      setEnemyHealth(prev => {
        const newHealth = prev - damage;
        if (newHealth <= 0) {
          setBotAlive(false);
          setBattleResult('win');
        }
        return newHealth;
      });
    } else {
      setPlayerHealth(prev => {
        const newHealth = prev - damage;
        if (newHealth <= 0) {
          setPlayerAlive(false);
          setBattleResult('lose');
        }
        return newHealth;
      });
    }
  };
  
  // Логика бота
  useEffect(() => {
    let botInterval;
    
    if (playerPos && botRef.current && botAlive && playerAlive) {
      botInterval = setInterval(() => {
        if (botRef.current && botRef.current.tryShoot) {
          botRef.current.tryShoot(playerPos);
        }
      }, 100);
    }
    
    return () => {
      if (botInterval) clearInterval(botInterval);
    };
  }, [playerPos, botAlive, playerAlive]);
  
  // Управление
  useEffect(() => {
    window.keysPressed = {};
    
    const handleKeyDown = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'ц') window.keysPressed.w = true;
      if (key === 's' || key === 'ы') window.keysPressed.s = true;
      if (key === 'a' || key === 'ф') window.keysPressed.a = true;
      if (key === 'd' || key === 'в') window.keysPressed.d = true;
      e.preventDefault();
    };
    
    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (key === 'w' || key === 'ц') window.keysPressed.w = false;
      if (key === 's' || key === 'ы') window.keysPressed.s = false;
      if (key === 'a' || key === 'ф') window.keysPressed.a = false;
      if (key === 'd' || key === 'в') window.keysPressed.d = false;
    };
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);
  
  // Автоматический выход
  useEffect(() => {
    if (battleResult) {
      const timer = setInterval(() => {
        setExitTimer(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            onBattleEnd(battleResult);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      return () => clearInterval(timer);
    }
  }, [battleResult, onBattleEnd]);
  
  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: '#000' }}>
      <Canvas shadows>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 20, 10]} intensity={1} castShadow />
        
        <Map />
        
        <PlayerTank
          ref={playerRef}
          turretRef={turretRef}
          joystickInput={joystickInput} // <-- ДОБАВЛЕНО
          position={[0, 0, 10]}
          tankStats={{...playerTank, hp: playerHealth}}
          onShoot={handlePlayerShoot}
          onPositionChange={setPlayerPos}
          isAlive={playerAlive}
        />
        
        <BotTank
          ref={botRef}
          position={[0, 0, -10]}
          onShoot={handleBotShoot}
          health={enemyHealth}
          onPositionChange={setBotPos}
          isAlive={botAlive}
        />
        
        {shells.map(shell => (
          <Shell
            key={shell.id}
            data={shell}
            onHit={handleHit}
            playerPos={playerPos}
            botPos={botPos}
            onExplosion={handleExplosion}
          />
        ))}
        
        <WorldOfTanksCamera 
          targetRef={playerRef}
          turretRef={turretRef}
          onZoomChange={setCameraInfo}
        />
      </Canvas>
      
      {/* ДЖОЙСТИК ДЛЯ ТЕЛЕФОНА */} {/* <-- ДОБАВЛЕНО */}
      <Joystick 
        onMove={setJoystickInput}
        onShoot={() => {
          if (playerRef.current && playerRef.current.shoot) {
            playerRef.current.shoot();
          }
        }}
      />
      
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1500
      }}>
        {effects.map(effect => (
          <HitEffect2D 
            key={effect.id}
            effect={effect}
            onComplete={() => handleEffectComplete(effect.id)}
          />
        ))}
      </div>
      
      <div style={{
        position: 'absolute',
        top: 20,
        left: 20,
        color: 'white',
        backgroundColor: 'rgba(0,0,0,0.7)',
        padding: '15px',
        borderRadius: '5px',
        fontFamily: 'Arial',
        zIndex: 1000,
        pointerEvents: 'none'
      }}>
        <div style={{ marginBottom: '10px' }}>
          <div>❤️ Ваше здоровье: {Math.max(0, playerHealth)}</div>
          <div style={{ width: '200px', height: '10px', backgroundColor: '#333' }}>
            <div style={{ 
              width: `${(playerHealth/playerTank.hp)*100}%`, 
              height: '100%', 
              backgroundColor: '#4caf50' 
            }} />
          </div>
        </div>
        
        <div>
          <div>❤️ Здоровье врага: {Math.max(0, enemyHealth)}</div>
          <div style={{ width: '200px', height: '10px', backgroundColor: '#333' }}>
            <div style={{ 
              width: `${(enemyHealth/500)*100}%`, 
              height: '100%', 
              backgroundColor: '#f44336' 
            }} />
          </div>
        </div>
        
        <div style={{ marginTop: '10px', fontSize: '12px', color: '#aaa' }}>
          W/A/S/D - движение корпуса (ПК)<br/>
          Джойстик - движение (телефон)<br/>
          Зажми ЛКМ или ПКМ + мышь - вращение камеры<br/>
          ПКМ - свободный обзор<br/>
          ЛКМ/Пробел/Красная кнопка - выстрел<br/>
          Колесико - зум {cameraInfo.isSniping ? '(Снайпер)' : ''}
        </div>
      </div>
      
      {battleResult && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: 'rgba(0,0,0,0.95)',
          color: 'white',
          padding: '30px',
          borderRadius: '10px',
          textAlign: 'center',
          zIndex: 3000,
          pointerEvents: 'auto',
          minWidth: '300px',
          boxShadow: '0 0 20px rgba(0,0,0,0.5)'
        }}>
          <h2 style={{ fontSize: '32px', marginBottom: '20px' }}>
            {battleResult === 'win' ? '🏆 ПОБЕДА!' : '💔 ПОРАЖЕНИЕ'}
          </h2>
          <div style={{ fontSize: '18px', marginBottom: '20px', color: '#aaa' }}>
            Возврат в ангар через {exitTimer} сек...
          </div>
        </div>
      )}
    </div>
  );
};

export default TankBattle;