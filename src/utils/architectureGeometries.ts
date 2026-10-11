import { useMemo } from 'react';
import * as THREE from 'three';

// Global cache for master 3D building model groups and shared geometries
const modelMasterCache = new Map<string, THREE.Group>();
const geometryCache = new Map<string, THREE.BufferGeometry>();
const materialCache = new Map<string, THREE.Material>();

/**
 * Helper to obtain or cache a reusable BufferGeometry
 */
function getOrCreateGeometry<T extends THREE.BufferGeometry>(key: string, factory: () => T): T {
  if (!geometryCache.has(key)) {
    const geom = factory();
    geom.computeBoundingSphere();
    geometryCache.set(key, geom);
  }
  return geometryCache.get(key) as T;
}

/**
 * Helper to obtain or cache shared standard materials
 */
function getOrCreateMaterial(key: string, factory: () => THREE.Material): THREE.Material {
  if (!materialCache.has(key)) {
    materialCache.set(key, factory());
  }
  return materialCache.get(key)!;
}

/**
 * Procedurally constructs master architectural 3D models for all conic masterworks
 */
function buildMasterModel(modelType: string, wireframe: boolean): THREE.Group {
  const group = new THREE.Group();

  const stoneMat = getOrCreateMaterial(
    `stone_${wireframe ? 'w' : 's'}`,
    () => new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.6, wireframe })
  );

  const accentMat = getOrCreateMaterial(
    `accent_${wireframe ? 'w' : 's'}`,
    () => new THREE.MeshStandardMaterial({ color: 0x38bdf8, roughness: 0.3, metalness: 0.2, wireframe })
  );

  const glassMat = getOrCreateMaterial(
    `glass_${wireframe ? 'w' : 's'}`,
    () =>
      new THREE.MeshPhysicalMaterial({
        color: 0x0284c7,
        transparent: true,
        opacity: 0.6,
        roughness: 0.1,
        transmission: 0.7,
        wireframe,
      })
  );

  const goldMat = getOrCreateMaterial(
    `gold_${wireframe ? 'w' : 's'}`,
    () => new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2, wireframe })
  );

  switch (modelType) {
    case 'pantheon': {
      // 1. Classical Portico
      const porticoBase = new THREE.Mesh(
        getOrCreateGeometry('pantheon_portico_base', () => new THREE.BoxGeometry(2.4, 0.2, 1.2)),
        stoneMat
      );
      porticoBase.position.set(0, -0.85, 1.6);
      group.add(porticoBase);

      const colCount = 8;
      for (let i = 0; i < colCount; i++) {
        const x = -1.0 + (i / (colCount - 1)) * 2.0;
        const colGeom = getOrCreateGeometry('pantheon_col', () => new THREE.CylinderGeometry(0.06, 0.07, 1.1, 16));
        const col = new THREE.Mesh(colGeom, stoneMat);
        col.position.set(x, -0.3, 1.6);
        group.add(col);
      }

      // Triangular Pediment
      const pedimentGeom = getOrCreateGeometry('pantheon_pediment', () => new THREE.ConeGeometry(1.4, 0.6, 3));
      const pediment = new THREE.Mesh(pedimentGeom, stoneMat);
      pediment.rotation.z = Math.PI;
      pediment.rotation.y = Math.PI / 6;
      pediment.scale.set(1.1, 1, 0.3);
      pediment.position.set(0, 0.45, 1.6);
      group.add(pediment);

      // 2. Main Rotunda Drum
      const rotundaGeom = getOrCreateGeometry('pantheon_rotunda', () => new THREE.CylinderGeometry(1.6, 1.6, 1.6, 48));
      const rotunda = new THREE.Mesh(rotundaGeom, stoneMat);
      rotunda.position.set(0, -0.15, 0);
      group.add(rotunda);

      // 3. Perfect Hemispherical Dome with Oculus
      const domeGeom = getOrCreateGeometry('pantheon_dome', () =>
        new THREE.SphereGeometry(1.6, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.46)
      );
      const dome = new THREE.Mesh(domeGeom, accentMat);
      dome.position.set(0, 0.65, 0);
      group.add(dome);

      // Oculus rim
      const oculusRimGeom = getOrCreateGeometry('pantheon_oculus_rim', () => new THREE.TorusGeometry(0.28, 0.04, 16, 32));
      const oculusRim = new THREE.Mesh(oculusRimGeom, goldMat);
      oculusRim.rotation.x = Math.PI / 2;
      oculusRim.position.set(0, 1.48, 0);
      group.add(oculusRim);

      // Solar Oculus Sunbeam Ray
      const beamPts = [new THREE.Vector3(0, 1.48, 0), new THREE.Vector3(0.5, -0.9, 0.3)];
      const beamGeom = new THREE.BufferGeometry().setFromPoints(beamPts);
      const beamMat = new THREE.LineBasicMaterial({ color: 0xfde047, linewidth: 3 });
      group.add(new THREE.Line(beamGeom, beamMat));
      break;
    }

    case 'applepark': {
      // Concentric Annular Rings
      const ringOuterR = 1.9;
      const ringInnerR = 1.35;
      const ringHeight = 0.5;

      const outerGlassGeom = getOrCreateGeometry('applepark_outer_glass', () =>
        new THREE.CylinderGeometry(ringOuterR, ringOuterR, ringHeight, 64, 1, true)
      );
      const outerGlass = new THREE.Mesh(outerGlassGeom, glassMat);
      group.add(outerGlass);

      const innerGlassGeom = getOrCreateGeometry('applepark_inner_glass', () =>
        new THREE.CylinderGeometry(ringInnerR, ringInnerR, ringHeight, 64, 1, true)
      );
      const innerGlass = new THREE.Mesh(innerGlassGeom, glassMat);
      group.add(innerGlass);

      // Curved Eaves/Canopies
      for (let f = 0; f < 4; f++) {
        const y = -0.25 + f * 0.16;
        const eaveGeom = getOrCreateGeometry(`applepark_eave_${f}`, () =>
          new THREE.RingGeometry(ringInnerR - 0.05, ringOuterR + 0.08, 64)
        );
        const eaveMesh = new THREE.Mesh(
          eaveGeom,
          getOrCreateMaterial('applepark_white', () => new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 }))
        );
        eaveMesh.rotation.x = -Math.PI / 2;
        eaveMesh.position.y = y;
        group.add(eaveMesh);
      }

      // Central Inner Park with solar roof
      const parkGeom = getOrCreateGeometry('applepark_park', () => new THREE.CylinderGeometry(ringInnerR - 0.08, ringInnerR - 0.08, 0.05, 48));
      const parkMat = getOrCreateMaterial('applepark_green', () => new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 }));
      const park = new THREE.Mesh(parkGeom, parkMat);
      park.position.y = -0.28;
      group.add(park);
      break;
    }

    case 'templeheaven': {
      // 3 Concentric Circular Marble Terraces
      const terrace1 = new THREE.Mesh(
        getOrCreateGeometry('temple_t1', () => new THREE.CylinderGeometry(2.1, 2.2, 0.15, 48)),
        stoneMat
      );
      terrace1.position.y = -0.9;
      group.add(terrace1);

      const terrace2 = new THREE.Mesh(
        getOrCreateGeometry('temple_t2', () => new THREE.CylinderGeometry(1.7, 1.8, 0.15, 48)),
        stoneMat
      );
      terrace2.position.y = -0.75;
      group.add(terrace2);

      const terrace3 = new THREE.Mesh(
        getOrCreateGeometry('temple_t3', () => new THREE.CylinderGeometry(1.3, 1.4, 0.15, 48)),
        stoneMat
      );
      terrace3.position.y = -0.6;
      group.add(terrace3);

      // Triple-eaved circular conical roofs glazed in imperial blue
      const blueTileMat = getOrCreateMaterial('temple_blue', () => new THREE.MeshStandardMaterial({ color: 0x1d4ed8, roughness: 0.3 }));

      const r1 = new THREE.Mesh(getOrCreateGeometry('temple_r1', () => new THREE.ConeGeometry(1.35, 0.45, 32)), blueTileMat);
      r1.position.y = -0.2;
      group.add(r1);

      const r2 = new THREE.Mesh(getOrCreateGeometry('temple_r2', () => new THREE.ConeGeometry(1.05, 0.42, 32)), blueTileMat);
      r2.position.y = 0.25;
      group.add(r2);

      const r3 = new THREE.Mesh(getOrCreateGeometry('temple_r3', () => new THREE.ConeGeometry(0.75, 0.4, 32)), blueTileMat);
      r3.position.y = 0.7;
      group.add(r3);

      const finial = new THREE.Mesh(getOrCreateGeometry('temple_finial', () => new THREE.SphereGeometry(0.12, 16, 16)), goldMat);
      finial.position.y = 1.05;
      group.add(finial);
      break;
    }

    case 'sydneyoperahouse': {
      // Stepped podium base
      const podium = new THREE.Mesh(
        getOrCreateGeometry('sydney_podium', () => new THREE.BoxGeometry(3.6, 0.35, 2.2)),
        getOrCreateMaterial('sydney_granite', () => new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }))
      );
      podium.position.y = -0.95;
      group.add(podium);

      const steps = new THREE.Mesh(
        getOrCreateGeometry('sydney_steps', () => new THREE.BoxGeometry(3.6, 0.15, 0.6)),
        getOrCreateMaterial('sydney_granite', () => new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.8 }))
      );
      steps.position.set(0, -1.1, 1.25);
      group.add(steps);

      const shellMat = getOrCreateMaterial(
        `sydney_shell_${wireframe ? 'w' : 's'}`,
        () => new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25, metalness: 0.1, side: THREE.DoubleSide, wireframe })
      );

      const glassWallMat = getOrCreateMaterial(
        `sydney_glass_${wireframe ? 'w' : 's'}`,
        () => new THREE.MeshPhysicalMaterial({ color: 0x78350f, transparent: true, opacity: 0.65, roughness: 0.15, wireframe })
      );

      const createShell = (scale: number, posX: number, posY: number, posZ: number, rotY: number, rotZ: number) => {
        const sailGeom = getOrCreateGeometry(`sydney_sail_${scale}`, () =>
          new THREE.SphereGeometry(1.0 * scale, 20, 14, 0, Math.PI * 0.55, 0, Math.PI * 0.6)
        );
        const sail = new THREE.Mesh(sailGeom, shellMat);
        sail.position.set(posX, posY, posZ);
        sail.rotation.set(-0.35, rotY, rotZ);
        group.add(sail);

        const sailPair = new THREE.Mesh(sailGeom, shellMat);
        sailPair.position.set(posX, posY, posZ);
        sailPair.scale.set(-1, 1, 1);
        sailPair.rotation.set(-0.35, -rotY, -rotZ);
        group.add(sailPair);

        const infillGeom = getOrCreateGeometry(`sydney_infill_${scale}`, () => new THREE.CircleGeometry(0.75 * scale, 16, 0, Math.PI));
        const infill = new THREE.Mesh(infillGeom, glassWallMat);
        infill.position.set(posX, posY - 0.1 * scale, posZ + 0.35 * scale);
        infill.rotation.x = -0.3;
        group.add(infill);
      };

      // Concert Hall ridge
      createShell(1.15, -0.6, -0.2, 0.45, 0.1, -0.15);
      createShell(0.95, -0.6, -0.35, -0.15, 0.1, -0.15);
      createShell(0.75, -0.6, -0.5, -0.65, 0.1, -0.15);
      createShell(0.5, -0.6, -0.65, -1.05, 0.1, -0.15);

      // Opera Theatre ridge
      createShell(0.95, 0.6, -0.35, 0.35, -0.1, 0.15);
      createShell(0.8, 0.6, -0.48, -0.18, -0.1, 0.15);
      createShell(0.65, 0.6, -0.6, -0.62, -0.1, 0.15);
      createShell(0.45, 0.6, -0.72, -0.98, -0.1, 0.15);

      // Water plane
      const waterGeom = getOrCreateGeometry('sydney_water', () => {
        const p = new THREE.PlaneGeometry(5.5, 4.0);
        p.rotateX(-Math.PI / 2);
        return p;
      });
      const water = new THREE.Mesh(
        waterGeom,
        getOrCreateMaterial('sydney_water_mat', () => new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.1, metalness: 0.4 }))
      );
      water.position.y = -1.18;
      group.add(water);
      break;
    }

    case 'guggenheim': {
      const segments = 60;
      const curvePoints: THREE.Vector3[] = [];
      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 8;
        const radius = 0.7 + t * 0.9;
        const y = -0.8 + t * 1.8;
        curvePoints.push(new THREE.Vector3(radius * Math.cos(angle), y, radius * Math.sin(angle)));
      }
      const tubeGeom = getOrCreateGeometry('guggenheim_spiral', () =>
        new THREE.TubeGeometry(new THREE.CatmullRomCurve3(curvePoints), 80, 0.1, 8, false)
      );
      const spiral = new THREE.Mesh(
        tubeGeom,
        getOrCreateMaterial('guggenheim_mat', () => new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.4 }))
      );
      group.add(spiral);

      const skylightGeom = getOrCreateGeometry('guggenheim_skylight', () => new THREE.CylinderGeometry(1.65, 1.65, 0.05, 32));
      const skylight = new THREE.Mesh(skylightGeom, glassMat);
      skylight.position.y = 1.05;
      group.add(skylight);
      break;
    }

    case 'stpauls': {
      const semiA = 1.5;
      const semiB = 1.2;
      const domeGeom = getOrCreateGeometry('stpauls_dome', () => {
        const g = new THREE.SphereGeometry(1, 32, 16, 0, Math.PI * 2, 0, Math.PI / 2);
        g.scale(semiA, 1.2, semiB);
        return g;
      });
      group.add(new THREE.Mesh(domeGeom, stoneMat));

      const drumGeom = getOrCreateGeometry('stpauls_drum', () => {
        const g = new THREE.CylinderGeometry(1, 1, 0.8, 32);
        g.scale(semiA, 1, semiB);
        return g;
      });
      const drum = new THREE.Mesh(drumGeom, stoneMat);
      drum.position.y = -0.4;
      group.add(drum);

      // Whispering Gallery Foci Markers
      const c = Math.sqrt(semiA * semiA - semiB * semiB);
      const f1 = new THREE.Mesh(
        getOrCreateGeometry('stpauls_f1', () => new THREE.SphereGeometry(0.06, 12, 12)),
        getOrCreateMaterial('foci_purple', () => new THREE.MeshBasicMaterial({ color: 0xa855f7 }))
      );
      f1.position.set(c, 0.05, 0);
      group.add(f1);

      const f2 = new THREE.Mesh(
        getOrCreateGeometry('stpauls_f2', () => new THREE.SphereGeometry(0.06, 12, 12)),
        getOrCreateMaterial('foci_purple', () => new THREE.MeshBasicMaterial({ color: 0xa855f7 }))
      );
      f2.position.set(-c, 0.05, 0);
      group.add(f2);
      break;
    }

    case 'colosseum': {
      const a = 1.8;
      const b = 1.4;
      for (let tier = 0; tier < 4; tier++) {
        const scale = 1 - tier * 0.12;
        const outerGeom = getOrCreateGeometry(`colosseum_tier_${tier}`, () => {
          const g = new THREE.CylinderGeometry(1, 1, 0.35, 40, 1, true);
          g.scale(a * scale, 1, b * scale);
          return g;
        });
        const tierMesh = new THREE.Mesh(outerGeom, stoneMat);
        tierMesh.position.y = -0.8 + tier * 0.35;
        group.add(tierMesh);
      }

      const arenaGeom = getOrCreateGeometry('colosseum_arena', () => {
        const g = new THREE.CylinderGeometry(1, 1, 0.05, 32);
        g.scale(a * 0.5, 1, b * 0.5);
        return g;
      });
      const arena = new THREE.Mesh(
        arenaGeom,
        getOrCreateMaterial('colosseum_sand', () => new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }))
      );
      arena.position.y = -0.9;
      group.add(arena);
      break;
    }

    case 'statuaryhall': {
      const a = 1.7;
      const b = 1.15;
      const c = Math.sqrt(a * a - b * b);

      const floorGeom = getOrCreateGeometry('statuary_floor', () => {
        const shape = new THREE.Shape();
        shape.moveTo(-a, 0);
        for (let i = 0; i <= 32; i++) {
          const theta = (i / 32) * Math.PI;
          shape.lineTo(a * Math.cos(theta), b * Math.sin(theta));
        }
        shape.lineTo(-a, 0);
        const g = new THREE.ShapeGeometry(shape);
        g.rotateX(-Math.PI / 2);
        return g;
      });
      const floor = new THREE.Mesh(
        floorGeom,
        getOrCreateMaterial('statuary_floor_mat', () => new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 }))
      );
      floor.position.y = -0.9;
      group.add(floor);

      const colCount = 18;
      const colMat = getOrCreateMaterial('statuary_col_mat', () => new THREE.MeshStandardMaterial({ color: 0xcbd5e1, roughness: 0.4 }));
      for (let i = 1; i < colCount; i++) {
        const theta = (i / colCount) * Math.PI;
        const colGeom = getOrCreateGeometry('statuary_col', () => new THREE.CylinderGeometry(0.04, 0.05, 1.4, 12));
        const col = new THREE.Mesh(colGeom, colMat);
        col.position.set(a * Math.cos(theta), -0.2, b * Math.sin(theta));
        group.add(col);
      }

      const backWall = new THREE.Mesh(
        getOrCreateGeometry('statuary_backwall', () => new THREE.BoxGeometry(2 * a + 0.1, 1.5, 0.1)),
        stoneMat
      );
      backWall.position.set(0, -0.15, 0);
      group.add(backWall);

      const vaultGeom = getOrCreateGeometry('statuary_vault', () => {
        const g = new THREE.SphereGeometry(1.0, 32, 16, 0, Math.PI, 0, Math.PI / 2);
        g.scale(a, 0.9, b);
        return g;
      });
      const vault = new THREE.Mesh(
        vaultGeom,
        getOrCreateMaterial(
          `statuary_vault_mat_${wireframe ? 'w' : 's'}`,
          () => new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.5, side: THREE.DoubleSide, wireframe })
        )
      );
      vault.position.y = 0.55;
      group.add(vault);

      // Acoustic Whispering Foci
      const fGeom = getOrCreateGeometry('statuary_focus', () => new THREE.SphereGeometry(0.08, 16, 16));
      const focus1 = new THREE.Mesh(
        fGeom,
        getOrCreateMaterial('statuary_f1_mat', () => new THREE.MeshStandardMaterial({ color: 0xa855f7, emissive: 0xa855f7, emissiveIntensity: 0.8 }))
      );
      focus1.position.set(c, -0.85, 0.2);
      group.add(focus1);

      const focus2 = new THREE.Mesh(
        fGeom,
        getOrCreateMaterial('statuary_f2_mat', () => new THREE.MeshStandardMaterial({ color: 0xec4899, emissive: 0xec4899, emissiveIntensity: 0.8 }))
      );
      focus2.position.set(-c, -0.85, 0.2);
      group.add(focus2);

      // Acoustic reflection rays
      const rayMat = getOrCreateMaterial('statuary_ray_mat', () => new THREE.LineDashedMaterial({ color: 0xa855f7, dashSize: 0.1, gapSize: 0.05 }));
      const rayAngles = [0.35, 0.75, 1.2, 1.57, 1.95, 2.4, 2.8];
      rayAngles.forEach((theta, idx) => {
        const wallX = a * Math.cos(theta);
        const wallZ = b * Math.sin(theta);
        const rayGeom = getOrCreateGeometry(`statuary_ray_${idx}`, () => {
          const pts = [
            new THREE.Vector3(c, -0.85, 0.2),
            new THREE.Vector3(wallX, -0.85, wallZ),
            new THREE.Vector3(-c, -0.85, 0.2),
          ];
          return new THREE.BufferGeometry().setFromPoints(pts);
        });
        group.add(new THREE.Line(rayGeom, rayMat));
      });
      break;
    }

    case 'cybertecture': {
      const eggGeom = getOrCreateGeometry('cybertecture_egg', () => {
        const g = new THREE.SphereGeometry(1.0, 28, 20);
        g.scale(1.1, 1.8, 1.1);
        return g;
      });
      group.add(new THREE.Mesh(eggGeom, glassMat));

      const cageMat = getOrCreateMaterial('cybertecture_cage', () => new THREE.MeshStandardMaterial({ color: 0x38bdf8, wireframe: true }));
      const cage = new THREE.Mesh(eggGeom, cageMat);
      cage.scale.set(1.02, 1.02, 1.02);
      group.add(cage);
      break;
    }

    case 'nationalegg': {
      const eggGeom = getOrCreateGeometry('nationalegg_geom', () => {
        const g = new THREE.SphereGeometry(1.0, 36, 18, 0, Math.PI * 2, 0, Math.PI / 2);
        g.scale(2.0, 0.9, 1.4);
        return g;
      });
      const titaniumMat = getOrCreateMaterial('nationalegg_mat', () => new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.7, roughness: 0.2 }));
      const egg = new THREE.Mesh(eggGeom, titaniumMat);
      egg.position.y = -0.4;
      group.add(egg);

      const curtainGeom = getOrCreateGeometry('nationalegg_curtain', () => {
        const g = new THREE.SphereGeometry(1.0, 24, 16, -0.4, 0.8, 0, Math.PI / 2);
        g.scale(2.01, 0.91, 1.41);
        return g;
      });
      const curtain = new THREE.Mesh(curtainGeom, glassMat);
      curtain.position.y = -0.4;
      group.add(curtain);

      const waterGeom = getOrCreateGeometry('nationalegg_water', () => {
        const p = new THREE.PlaneGeometry(5.0, 4.0);
        p.rotateX(-Math.PI / 2);
        return p;
      });
      const water = new THREE.Mesh(
        waterGeom,
        getOrCreateMaterial('nationalegg_water_mat', () => new THREE.MeshStandardMaterial({ color: 0x0369a1, roughness: 0.1, metalness: 0.5 }))
      );
      water.position.y = -0.41;
      group.add(water);
      break;
    }

    case 'gatewayarch': {
      const span = 3.0;
      const height = 2.4;
      const numSegments = 50;
      const pts: THREE.Vector3[] = [];
      for (let i = 0; i <= numSegments; i++) {
        const t = i / numSegments;
        const x = -span / 2 + t * span;
        const y = height * (1 - (4 * (x * x)) / (span * span));
        pts.push(new THREE.Vector3(x, y - 1.1, 0));
      }
      const archCurve = new THREE.CatmullRomCurve3(pts);
      const archGeom = getOrCreateGeometry('gateway_arch_geom', () => new THREE.TubeGeometry(archCurve, 50, 0.09, 3, false));
      const steelMat = getOrCreateMaterial('gateway_steel', () => new THREE.MeshStandardMaterial({ color: 0xf1f5f9, metalness: 0.9, roughness: 0.1 }));
      group.add(new THREE.Mesh(archGeom, steelMat));
      break;
    }

    case 'oceanografic': {
      const numPetals = 8;
      const petalShape = new THREE.Shape();
      petalShape.moveTo(0, 0);
      for (let i = 0; i <= 20; i++) {
        const x = -0.6 + (i / 20) * 1.2;
        const y = 1.4 - 1.8 * x * x;
        petalShape.lineTo(x, y);
      }
      petalShape.closePath();
      const petalGeom = getOrCreateGeometry('oceanografic_petal', () => new THREE.ShapeGeometry(petalShape));
      const shellMat = getOrCreateMaterial(
        `oceanografic_shell_${wireframe ? 'w' : 's'}`,
        () => new THREE.MeshStandardMaterial({ color: 0xf8fafc, side: THREE.DoubleSide, roughness: 0.3, wireframe })
      );

      for (let i = 0; i < numPetals; i++) {
        const angle = (i / numPetals) * Math.PI * 2;
        const petal = new THREE.Mesh(petalGeom, shellMat);
        petal.position.set(Math.cos(angle) * 0.4, -0.7, Math.sin(angle) * 0.4);
        petal.rotation.y = -angle + Math.PI / 2;
        petal.rotation.x = 0.25;
        group.add(petal);
      }
      break;
    }

    case 'saddledome': {
      const baseGeom = getOrCreateGeometry('saddledome_base', () => new THREE.CylinderGeometry(1.6, 1.7, 0.9, 36));
      const baseMesh = new THREE.Mesh(
        baseGeom,
        getOrCreateMaterial('saddledome_base_mat', () => new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.6 }))
      );
      baseMesh.position.y = -0.65;
      group.add(baseMesh);

      const ribbonGeom = getOrCreateGeometry('saddledome_ribbon', () => new THREE.CylinderGeometry(1.62, 1.62, 0.2, 36));
      const ribbon = new THREE.Mesh(ribbonGeom, glassMat);
      ribbon.position.y = -0.15;
      group.add(ribbon);

      // Undulating ring beam
      const radius = 1.65;
      const ringGeom = getOrCreateGeometry('saddledome_ring', () => {
        const ringPts: THREE.Vector3[] = [];
        const ringSegments = 48;
        for (let i = 0; i <= ringSegments; i++) {
          const theta = (i / ringSegments) * Math.PI * 2;
          const x = radius * Math.cos(theta);
          const z = radius * Math.sin(theta);
          const y = -0.05 + 0.45 * Math.cos(2 * theta);
          ringPts.push(new THREE.Vector3(x, y, z));
        }
        const ringCurve = new THREE.CatmullRomCurve3(ringPts, true);
        return new THREE.TubeGeometry(ringCurve, 48, 0.07, 8, true);
      });
      const ringMesh = new THREE.Mesh(
        ringGeom,
        getOrCreateMaterial('saddledome_ring_mat', () => new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.6, roughness: 0.3 }))
      );
      group.add(ringMesh);

      // Parametric Hypar Saddle Surface
      const hyparGeom = getOrCreateGeometry('saddledome_hypar', () => {
        const grid = 28;
        const g = new THREE.PlaneGeometry(3.2, 3.2, grid, grid);
        g.rotateX(-Math.PI / 2);
        const pos = g.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const x = pos.getX(i);
          const z = pos.getZ(i);
          const dist = Math.sqrt(x * x + z * z);
          if (dist <= radius) {
            const y = -0.25 + 0.25 * (x * x - z * z);
            pos.setY(i, y);
          } else {
            pos.setY(i, -10);
          }
        }
        g.computeVertexNormals();
        return g;
      });
      const roofMat = getOrCreateMaterial(
        `saddledome_roof_${wireframe ? 'w' : 's'}`,
        () => new THREE.MeshStandardMaterial({ color: 0x10b981, roughness: 0.4, side: THREE.DoubleSide, wireframe })
      );
      group.add(new THREE.Mesh(hyparGeom, roofMat));

      // Cable network lines
      const cableMat = getOrCreateMaterial('saddledome_cables', () => new THREE.LineBasicMaterial({ color: 0x059669 }));
      for (let c = -1.2; c <= 1.2; c += 0.4) {
        const cPts1: THREE.Vector3[] = [];
        const cPts2: THREE.Vector3[] = [];
        for (let t = -1.4; t <= 1.4; t += 0.1) {
          if (c * c + t * t <= radius * radius) {
            cPts1.push(new THREE.Vector3(t, -0.23 + 0.25 * (t * t - c * c), c));
            cPts2.push(new THREE.Vector3(c, -0.23 + 0.25 * (c * c - t * t), t));
          }
        }
        if (cPts1.length > 1) group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cPts1), cableMat));
        if (cPts2.length > 1) group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(cPts2), cableMat));
      }
      break;
    }

    case 'warmmineralsprings': {
      const woodMat = getOrCreateMaterial(
        `warm_wood_${wireframe ? 'w' : 's'}`,
        () => new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6, metalness: 0.1, side: THREE.DoubleSide, wireframe })
      );
      const steelColumnMat = getOrCreateMaterial('warm_steel', () => new THREE.MeshStandardMaterial({ color: 0x1e293b, metalness: 0.8, roughness: 0.2 }));

      const ground = new THREE.Mesh(
        getOrCreateGeometry('warm_ground', () => new THREE.BoxGeometry(3.6, 0.1, 3.6)),
        getOrCreateMaterial('warm_ground_mat', () => new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 }))
      );
      ground.position.y = -1.15;
      group.add(ground);

      const offsets = [
        { x: -0.85, z: -0.85 },
        { x: 0.85, z: -0.85 },
        { x: -0.85, z: 0.85 },
        { x: 0.85, z: 0.85 },
      ];

      offsets.forEach(({ x, z }) => {
        const stem = new THREE.Mesh(
          getOrCreateGeometry('warm_stem', () => new THREE.CylinderGeometry(0.04, 0.04, 1.6, 16)),
          steelColumnMat
        );
        stem.position.set(x, -0.35, z);
        group.add(stem);

        const hyparGeom = getOrCreateGeometry('warm_hypar_unit', () => {
          const g = new THREE.PlaneGeometry(1.5, 1.5, 14, 14);
          const pos = g.attributes.position;
          for (let i = 0; i < pos.count; i++) {
            const u = pos.getX(i);
            const v = pos.getY(i);
            pos.setZ(i, (u * u - v * v) * 0.45);
          }
          g.computeVertexNormals();
          return g;
        });

        const canopy = new THREE.Mesh(hyparGeom, woodMat);
        canopy.rotation.x = -Math.PI / 2;
        canopy.position.set(x, 0.45, z);
        group.add(canopy);

        const glassBox = new THREE.Mesh(
          getOrCreateGeometry('warm_glass_box', () => new THREE.BoxGeometry(1.2, 1.0, 1.2)),
          glassMat
        );
        glassBox.position.set(x, -0.6, z);
        group.add(glassBox);
      });
      break;
    }

    case 'palacio': {
      const archCount = 12;
      for (let i = 0; i < archCount; i++) {
        const rot = (i / archCount) * Math.PI;
        const ribGeom = getOrCreateGeometry(`palacio_rib_${i}`, () => {
          const pts: THREE.Vector3[] = [];
          for (let j = 0; j <= 24; j++) {
            const x = -1.8 + (j / 24) * 3.6;
            const y = 1.2 - (1.2 / (1.8 * 1.8)) * x * x;
            pts.push(new THREE.Vector3(x, y - 0.8, 0));
          }
          return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 28, 0.03, 6, false);
        });
        const rib = new THREE.Mesh(
          ribGeom,
          getOrCreateMaterial('palacio_rib_mat', () => new THREE.MeshStandardMaterial({ color: 0x10b981, metalness: 0.6 }))
        );
        rib.rotation.y = rot;
        group.add(rib);
      }
      break;
    }

    case 'marycathedral': {
      const sail = new THREE.Mesh(
        getOrCreateGeometry('mary_sail', () => new THREE.BoxGeometry(1.6, 2.2, 1.6)),
        getOrCreateMaterial('mary_mat', () => new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 }))
      );
      sail.position.y = 0.2;
      group.add(sail);

      const cross1 = new THREE.Mesh(
        getOrCreateGeometry('mary_cross1', () => new THREE.BoxGeometry(1.62, 0.1, 0.2)),
        glassMat
      );
      cross1.position.y = 1.32;
      group.add(cross1);

      const cross2 = new THREE.Mesh(
        getOrCreateGeometry('mary_cross2', () => new THREE.BoxGeometry(0.2, 0.1, 1.62)),
        glassMat
      );
      cross2.position.y = 1.32;
      group.add(cross2);
      break;
    }

    case 'shukhov': {
      const height = 2.8;
      const baseR = 1.2;
      const waistR = 0.6;
      const topR = 0.9;
      const linesCount = 24;

      const mat1 = getOrCreateMaterial('shukhov_line1', () => new THREE.LineBasicMaterial({ color: 0x38bdf8, linewidth: 2 }));
      const mat2 = getOrCreateMaterial('shukhov_line2', () => new THREE.LineBasicMaterial({ color: 0xf59e0b, linewidth: 2 }));

      for (let i = 0; i < linesCount; i++) {
        const theta1 = (i / linesCount) * Math.PI * 2;
        const theta2 = theta1 + Math.PI * 0.7;
        const theta3 = theta1 - Math.PI * 0.7;

        const p1 = new THREE.Vector3(baseR * Math.cos(theta1), -height / 2, baseR * Math.sin(theta1));
        const p2 = new THREE.Vector3(topR * Math.cos(theta2), height / 2, topR * Math.sin(theta2));
        const p3 = new THREE.Vector3(topR * Math.cos(theta3), height / 2, topR * Math.sin(theta3));

        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, p2]), mat1));
        group.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([p1, p3]), mat2));
      }

      for (let y = -height / 2; y <= height / 2; y += height / 4) {
        const r = Math.sqrt(waistR * waistR + 0.4 * y * y);
        const ringGeom = getOrCreateGeometry(`shukhov_ring_${y.toFixed(1)}`, () => {
          const g = new THREE.RingGeometry(r - 0.02, r + 0.02, 32);
          g.rotateX(-Math.PI / 2);
          return g;
        });
        const ring = new THREE.Mesh(
          ringGeom,
          getOrCreateMaterial('shukhov_ring_mat', () => new THREE.MeshBasicMaterial({ color: 0x94a3b8 }))
        );
        ring.position.y = y;
        group.add(ring);
      }
      break;
    }

    case 'canton': {
      const height = 3.2;
      const numColumns = 20;
      const baseA = 1.1;
      const baseB = 0.8;
      const topA = 0.8;
      const topB = 0.6;
      const twist = Math.PI / 4;

      const colMat = getOrCreateMaterial('canton_col', () => new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8, roughness: 0.2 }));
      for (let i = 0; i < numColumns; i++) {
        const angle = (i / numColumns) * Math.PI * 2;
        const pBottom = new THREE.Vector3(baseA * Math.cos(angle), -height / 2, baseB * Math.sin(angle));
        const pTop = new THREE.Vector3(topA * Math.cos(angle + twist), height / 2, topB * Math.sin(angle + twist));

        const colGeom = getOrCreateGeometry(`canton_col_${i}`, () => new THREE.CylinderGeometry(0.025, 0.025, pBottom.distanceTo(pTop), 6));
        const colMesh = new THREE.Mesh(colGeom, colMat);
        const midpoint = new THREE.Vector3().addVectors(pBottom, pTop).multiplyScalar(0.5);
        colMesh.position.copy(midpoint);
        colMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(pTop, pBottom).normalize());
        group.add(colMesh);
      }

      const core = new THREE.Mesh(
        getOrCreateGeometry('canton_core', () => new THREE.CylinderGeometry(0.25, 0.35, height, 16)),
        getOrCreateMaterial('canton_core_mat', () => new THREE.MeshStandardMaterial({ color: 0x334155 }))
      );
      group.add(core);

      const mast = new THREE.Mesh(
        getOrCreateGeometry('canton_mast', () => new THREE.CylinderGeometry(0.02, 0.05, 0.8, 8)),
        getOrCreateMaterial('canton_mast_mat', () => new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9 }))
      );
      mast.position.y = height / 2 + 0.4;
      group.add(mast);
      break;
    }

    case 'brasilia': {
      const columnCount = 16;
      for (let i = 0; i < columnCount; i++) {
        const theta = (i / columnCount) * Math.PI * 2;
        const colGeom = getOrCreateGeometry(`brasilia_col_${i}`, () => {
          const pts: THREE.Vector3[] = [];
          for (let j = 0; j <= 16; j++) {
            const t = j / 16;
            const y = -1.0 + t * 2.2;
            const r = Math.sqrt(0.35 * 0.35 + 0.4 * (y - 0.2) * (y - 0.2)) + 0.25;
            pts.push(new THREE.Vector3(r * Math.cos(theta), y, r * Math.sin(theta)));
          }
          return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 20, 0.04, 6, false);
        });
        const colMesh = new THREE.Mesh(
          colGeom,
          getOrCreateMaterial('brasilia_white', () => new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 }))
        );
        group.add(colMesh);
      }

      const stainedGlass = new THREE.Mesh(
        getOrCreateGeometry('brasilia_glass', () => new THREE.ConeGeometry(1.2, 1.8, 16, 1, true)),
        getOrCreateMaterial('brasilia_glass_mat', () =>
          new THREE.MeshPhysicalMaterial({ color: 0x0284c7, transparent: true, opacity: 0.45, roughness: 0.1 })
        )
      );
      stainedGlass.position.y = -0.1;
      group.add(stainedGlass);
      break;
    }

    case 'coolingtower': {
      const height = 3.0;
      const waistR = 0.75;
      const waistY = 0.35;

      const towerGeom = getOrCreateGeometry('coolingtower_shell', () => {
        const points: THREE.Vector2[] = [];
        const steps = 32;
        for (let i = 0; i <= steps; i++) {
          const y = -height / 2 + (i / steps) * height;
          const normY = (y - waistY) / 1.4;
          const r = waistR * Math.sqrt(1 + normY * normY);
          points.push(new THREE.Vector2(r, y));
        }
        return new THREE.LatheGeometry(points, 36);
      });

      const concreteMat = getOrCreateMaterial(
        `coolingtower_mat_${wireframe ? 'w' : 's'}`,
        () => new THREE.MeshStandardMaterial({ color: 0x94a3b8, roughness: 0.7, side: THREE.DoubleSide, wireframe })
      );
      const tower = new THREE.Mesh(towerGeom, concreteMat);
      tower.position.y = 0.15;
      group.add(tower);

      // Base air-intake V-struts
      const strutCount = 20;
      const baseR = 1.35;
      const strutMat = getOrCreateMaterial('coolingtower_strut_mat', () => new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.5 }));
      for (let i = 0; i < strutCount; i++) {
        const theta = (i / strutCount) * Math.PI * 2;
        const bX = baseR * Math.cos(theta);
        const bZ = baseR * Math.sin(theta);
        const strutGeom = getOrCreateGeometry('coolingtower_strut', () => new THREE.CylinderGeometry(0.03, 0.03, 0.35, 8));
        const strut = new THREE.Mesh(strutGeom, strutMat);
        strut.position.set(bX, -height / 2 + 0.15, bZ);
        strut.rotation.z = i % 2 === 0 ? 0.25 : -0.25;
        group.add(strut);
      }

      // Billowing soft condensation steam cloud
      const cloudMat = getOrCreateMaterial('coolingtower_cloud', () =>
        new THREE.MeshStandardMaterial({ color: 0xffffff, transparent: true, opacity: 0.35, roughness: 1.0 })
      );
      const cloudOffsets = [
        { x: 0, y: height / 2 + 0.45, z: 0, r: 0.45 },
        { x: 0.18, y: height / 2 + 0.75, z: -0.12, r: 0.55 },
        { x: -0.15, y: height / 2 + 1.05, z: 0.1, r: 0.65 },
      ];
      cloudOffsets.forEach(({ x, y, z, r }, idx) => {
        const puffGeom = getOrCreateGeometry(`coolingtower_cloud_${idx}`, () => new THREE.SphereGeometry(r, 14, 14));
        const puff = new THREE.Mesh(puffGeom, cloudMat);
        puff.position.set(x, y, z);
        group.add(puff);
      });
      break;
    }

    case 'kobe': {
      const height = 2.8;
      const baseR = 0.8;
      const topR = 0.75;
      const pipeCount = 24;
      const redMat = getOrCreateMaterial('kobe_red', () => new THREE.MeshStandardMaterial({ color: 0xdc2626, metalness: 0.6, roughness: 0.3 }));

      for (let i = 0; i < pipeCount; i++) {
        const t1 = (i / pipeCount) * Math.PI * 2;
        const t2 = t1 + Math.PI * 0.65;
        const t3 = t1 - Math.PI * 0.65;
        const p1 = new THREE.Vector3(baseR * Math.cos(t1), -height / 2, baseR * Math.sin(t1));
        const p2 = new THREE.Vector3(topR * Math.cos(t2), height / 2, topR * Math.sin(t2));
        const p3 = new THREE.Vector3(topR * Math.cos(t3), height / 2, topR * Math.sin(t3));

        const pipeGeom1 = getOrCreateGeometry(`kobe_pipe1_${i}`, () => new THREE.CylinderGeometry(0.02, 0.02, p1.distanceTo(p2), 6));
        const pipe1 = new THREE.Mesh(pipeGeom1, redMat);
        pipe1.position.copy(new THREE.Vector3().addVectors(p1, p2).multiplyScalar(0.5));
        pipe1.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p2, p1).normalize());
        group.add(pipe1);

        const pipeGeom2 = getOrCreateGeometry(`kobe_pipe2_${i}`, () => new THREE.CylinderGeometry(0.02, 0.02, p1.distanceTo(p3), 6));
        const pipe2 = new THREE.Mesh(pipeGeom2, redMat);
        pipe2.position.copy(new THREE.Vector3().addVectors(p1, p3).multiplyScalar(0.5));
        pipe2.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), new THREE.Vector3().subVectors(p3, p1).normalize());
        group.add(pipe2);
      }

      const deck = new THREE.Mesh(
        getOrCreateGeometry('kobe_deck', () => new THREE.CylinderGeometry(0.9, 0.85, 0.35, 24)),
        getOrCreateMaterial('kobe_deck_mat', () => new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.5 }))
      );
      deck.position.y = height / 2 + 0.15;
      group.add(deck);
      break;
    }

    default: {
      const box = new THREE.Mesh(
        getOrCreateGeometry('default_box', () => new THREE.BoxGeometry(1.5, 1.5, 1.5)),
        stoneMat
      );
      group.add(box);
    }
  }

  return group;
}

/**
 * Returns a cloned instance of the cached master architectural model.
 * The clone shares all underlying BufferGeometry and Materials, guaranteeing
 * zero extra geometry allocations and minimal memory overhead on low-end mobile devices.
 */
export function getCachedArchitectureModel(modelType: string, wireframe: boolean = false): THREE.Group {
  const cacheKey = `${modelType}_${wireframe ? 'w' : 's'}`;
  if (!modelMasterCache.has(cacheKey)) {
    const master = buildMasterModel(modelType, wireframe);
    modelMasterCache.set(cacheKey, master);
  }
  return modelMasterCache.get(cacheKey)!.clone(true);
}

/**
 * React hook that caches the 3D building model using `useMemo`.
 * Ensures building models are instantiated once and smoothly reused across the app,
 * preventing GC spikes and frame drops when opening/switching modals.
 */
export function useArchitectureModel(modelType: string, wireframe: boolean = false): THREE.Group {
  return useMemo(() => {
    return getCachedArchitectureModel(modelType, wireframe);
  }, [modelType, wireframe]);
}

/**
 * Pre-instantiates all 16 architectural masterwork models so that modal interaction is instantaneous.
 */
export function preloadArchitectureModels(): void {
  const models = [
    'pantheon',
    'applepark',
    'templeheaven',
    'sydneyoperahouse',
    'stpauls',
    'colosseum',
    'statuaryhall',
    'cybertecture',
    'gatewayarch',
    'oceanografic',
    'saddledome',
    'warmmineralsprings',
    'shukhov',
    'canton',
    'brasilia',
    'coolingtower',
  ];

  models.forEach((m) => {
    getCachedArchitectureModel(m, false);
  });
}

/**
 * Clears the cache and disposes of all geometries and materials.
 */
export function clearArchitectureModelCache(): void {
  modelMasterCache.clear();
  geometryCache.forEach((geom) => geom.dispose());
  geometryCache.clear();
  materialCache.forEach((mat) => mat.dispose());
  materialCache.clear();
}
