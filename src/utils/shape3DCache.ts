import * as THREE from 'three';
import { ConicType } from '../types';

export interface Shape3DAsset {
  geometry: THREE.BufferGeometry;
  color: number;
  emissive: number;
}

// Pre-built cache to ensure zero lag on page transitions
const geometryCache: Record<string, THREE.BufferGeometry> = {};

export function getShapeColor(conicType: ConicType): { color: number; emissive: number; hexColor: string } {
  switch (conicType) {
    case 'circle':
      return { color: 0x38bdf8, emissive: 0x0284c7, hexColor: '#38bdf8' }; // blue
    case 'parabola':
      return { color: 0xfb923c, emissive: 0xc2410c, hexColor: '#fb923c' }; // orange
    case 'ellipse':
      return { color: 0x34d399, emissive: 0x059669, hexColor: '#34d399' }; // green
    case 'hyperbola':
      return { color: 0xc084fc, emissive: 0x9333ea, hexColor: '#c084fc' }; // purple
  }
}

export function buildShapeGeometry(conicType: ConicType, isMobile: boolean): THREE.BufferGeometry {
  const cacheKey = `${conicType}_${isMobile ? 'm' : 'd'}`;
  if (geometryCache[cacheKey]) {
    return geometryCache[cacheKey];
  }

  let geom: THREE.BufferGeometry;

  if (conicType === 'circle') {
    // Circle: CylinderGeometry(radius 5, segments 64)
    const segments = isMobile ? 32 : 64;
    geom = new THREE.CylinderGeometry(5, 5, 0.8, segments, 1, false);
  } else if (conicType === 'parabola') {
    // Parabola: LatheGeometry from parabola curve
    const steps = isMobile ? 18 : 32;
    const points: THREE.Vector2[] = [];
    const p = 2.1; // focal distance parameter
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = t * 4.8;
      const y = (x * x) / (4 * p) - 2.5; // y = x² / 4p
      points.push(new THREE.Vector2(x, y));
    }
    const latheSegments = isMobile ? 24 : 48;
    geom = new THREE.LatheGeometry(points, latheSegments);
  } else if (conicType === 'ellipse') {
    // Ellipse: BufferGeometry from ellipse points / surface
    const uSegments = isMobile ? 24 : 48;
    const vSegments = isMobile ? 16 : 32;
    const a = 5.2; // semi-major axis
    const b = 3.4; // semi-minor axis
    const c = 2.6; // height parameter

    const positions: number[] = [];
    const normals: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let v = 0; v <= vSegments; v++) {
      const phi = (v / vSegments) * Math.PI; // 0 to PI
      const sinPhi = Math.sin(phi);
      const cosPhi = Math.cos(phi);

      for (let u = 0; u <= uSegments; u++) {
        const theta = (u / uSegments) * Math.PI * 2; // 0 to 2PI
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        const x = a * sinPhi * cosTheta;
        const y = c * cosPhi;
        const z = b * sinPhi * sinTheta;

        positions.push(x, y, z);

        // Calculate surface normal for ellipsoid (x/a², y/c², z/b²)
        const nx = x / (a * a);
        const ny = y / (c * c);
        const nz = z / (b * b);
        const len = Math.sqrt(nx * nx + ny * ny + nz * nz) || 1;
        normals.push(nx / len, ny / len, nz / len);

        uvs.push(u / uSegments, v / vSegments);
      }
    }

    for (let v = 0; v < vSegments; v++) {
      for (let u = 0; u < uSegments; u++) {
        const first = v * (uSegments + 1) + u;
        const second = first + uSegments + 1;

        indices.push(first, second, first + 1);
        indices.push(second, second + 1, first + 1);
      }
    }

    geom = new THREE.BufferGeometry();
    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  } else {
    // Hyperbola: BufferGeometry from hyperbola surface (Hyperboloid of one sheet)
    const uSteps = isMobile ? 18 : 32;
    const vSteps = isMobile ? 24 : 48;
    const a = 2.4; // waist radius x
    const b = 2.4; // waist radius z
    const h = 2.4; // height scaling
    const uMin = -1.5;
    const uMax = 1.5;

    const positions: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    for (let i = 0; i <= uSteps; i++) {
      const u = uMin + (i / uSteps) * (uMax - uMin);
      const radFactor = Math.sqrt(1 + u * u);
      const y = h * u;

      for (let j = 0; j <= vSteps; j++) {
        const v = (j / vSteps) * Math.PI * 2;
        const x = a * radFactor * Math.cos(v);
        const z = b * radFactor * Math.sin(v);

        positions.push(x, y, z);
        uvs.push(j / vSteps, i / uSteps);
      }
    }

    for (let i = 0; i < uSteps; i++) {
      for (let j = 0; j < vSteps; j++) {
        const first = i * (vSteps + 1) + j;
        const second = first + vSteps + 1;

        indices.push(first, first + 1, second);
        indices.push(second, first + 1, second + 1);
      }
    }

    geom = new THREE.BufferGeometry();
    geom.setIndex(indices);
    geom.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    geom.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geom.computeVertexNormals();
  }

  // Optimize: compute bounding sphere & enable frustum culling
  geom.computeBoundingSphere();
  geometryCache[cacheKey] = geom;
  return geom;
}

// Pre-load all 4 3D shape geometries on homepage navigation so zero lag occurs
export function preloadAllShapeScenes(): void {
  const types: ConicType[] = ['circle', 'parabola', 'ellipse', 'hyperbola'];
  types.forEach((type) => {
    buildShapeGeometry(type, false);
    buildShapeGeometry(type, true);
  });
}
