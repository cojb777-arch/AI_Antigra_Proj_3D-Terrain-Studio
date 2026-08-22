import * as THREE from 'three';
import { TerrainData } from '../map/DemLoader';

export interface TerrainMeshOptions {
  exaggeration: number;    // Height multiplier (e.g. 1.0 - 5.0)
  baseThickness: number;   // Base height in world units
  size: number;            // World size (X/Z width)
  smoothNormals?: boolean;
}

export class TerrainMeshBuilder {
  // Build a 3D-printable solid (water-tight manifold) mesh geometry
  public static createSolidGeometry(
    data: TerrainData,
    options: TerrainMeshOptions
  ): THREE.BufferGeometry {
    const { width: resX, height: resY, elevations, minElev, maxElev } = data;
    const { exaggeration, baseThickness, size } = options;

    const elevRange = Math.max(1, maxElev - minElev);
    const baseHeightScale = (size * 0.2) / elevRange;
    const heightScale = baseHeightScale * exaggeration;

    const vertices: number[] = [];
    const uvs: number[] = [];
    const indices: number[] = [];

    const halfSize = size / 2;
    const stepX = size / (resX - 1);
    const stepY = size / (resY - 1);

    const bottomY = -baseThickness;

    // 1. TOP SURFACE VERTICES
    for (let j = 0; j < resY; j++) {
      const z = -halfSize + j * stepY;
      const v = j / (resY - 1);

      for (let i = 0; i < resX; i++) {
        const x = -halfSize + i * stepX;
        const u = i / (resX - 1);

        const rawElev = elevations[j * resX + i];
        const normalizedElev = Math.max(0, rawElev - minElev);
        const y = normalizedElev * heightScale;

        vertices.push(x, y, z);
        uvs.push(u, 1.0 - v);
      }
    }

    // Top surface indices
    for (let j = 0; j < resY - 1; j++) {
      for (let i = 0; i < resX - 1; i++) {
        const a = j * resX + i;
        const b = j * resX + (i + 1);
        const c = (j + 1) * resX + i;
        const d = (j + 1) * resX + (i + 1);

        indices.push(a, c, b);
        indices.push(b, c, d);
      }
    }

    // Helper to add a quad (2 triangles)
    const addQuad = (
      v0: [number, number, number],
      v1: [number, number, number],
      v2: [number, number, number],
      v3: [number, number, number]
    ) => {
      const startIndex = vertices.length / 3;
      vertices.push(...v0, ...v1, ...v2, ...v3);
      uvs.push(0, 0, 1, 0, 1, 1, 0, 1);
      indices.push(startIndex, startIndex + 1, startIndex + 2);
      indices.push(startIndex, startIndex + 2, startIndex + 3);
    };

    // North Wall
    for (let i = 0; i < resX - 1; i++) {
      const x0 = -halfSize + i * stepX;
      const x1 = -halfSize + (i + 1) * stepX;
      const z = -halfSize;
      const y0 = Math.max(0, elevations[0 * resX + i] - minElev) * heightScale;
      const y1 = Math.max(0, elevations[0 * resX + (i + 1)] - minElev) * heightScale;

      addQuad([x1, y1, z], [x0, y0, z], [x0, bottomY, z], [x1, bottomY, z]);
    }

    // South Wall
    for (let i = 0; i < resX - 1; i++) {
      const x0 = -halfSize + i * stepX;
      const x1 = -halfSize + (i + 1) * stepX;
      const z = halfSize;
      const y0 = Math.max(0, elevations[(resY - 1) * resX + i] - minElev) * heightScale;
      const y1 = Math.max(0, elevations[(resY - 1) * resX + (i + 1)] - minElev) * heightScale;

      addQuad([x0, y0, z], [x1, y1, z], [x1, bottomY, z], [x0, bottomY, z]);
    }

    // West Wall
    for (let j = 0; j < resY - 1; j++) {
      const z0 = -halfSize + j * stepY;
      const z1 = -halfSize + (j + 1) * stepY;
      const x = -halfSize;
      const y0 = Math.max(0, elevations[j * resX + 0] - minElev) * heightScale;
      const y1 = Math.max(0, elevations[(j + 1) * resX + 0] - minElev) * heightScale;

      addQuad([x, y0, z0], [x, y1, z1], [x, bottomY, z1], [x, bottomY, z0]);
    }

    // East Wall
    for (let j = 0; j < resY - 1; j++) {
      const z0 = -halfSize + j * stepY;
      const z1 = -halfSize + (j + 1) * stepY;
      const x = halfSize;
      const y0 = Math.max(0, elevations[j * resX + (resX - 1)] - minElev) * heightScale;
      const y1 = Math.max(0, elevations[(j + 1) * resX + (resX - 1)] - minElev) * heightScale;

      addQuad([x, y1, z1], [x, y0, z0], [x, bottomY, z0], [x, bottomY, z1]);
    }

    // Bottom Base
    addQuad(
      [-halfSize, bottomY, halfSize],
      [halfSize, bottomY, halfSize],
      [halfSize, bottomY, -halfSize],
      [-halfSize, bottomY, -halfSize]
    );

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
    geometry.setIndex(indices);

    geometry.computeVertexNormals();

    return geometry;
  }
}
