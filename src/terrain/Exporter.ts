import * as THREE from 'three';

export class Exporter {
  // Export binary STL file (Standard for 3D Printing / Slicers)
  public static exportBinarySTL(geometry: THREE.BufferGeometry, filename: string = 'terrain-model.stl'): void {
    const posAttr = geometry.getAttribute('position');
    const indexAttr = geometry.getIndex();

    if (!posAttr) {
      console.error('Geometry has no position attribute');
      return;
    }

    let triangleCount = 0;
    if (indexAttr) {
      triangleCount = indexAttr.count / 3;
    } else {
      triangleCount = posAttr.count / 3;
    }

    // 80-byte header + 4-byte triangle count + 50 bytes per triangle
    const bufferSize = 84 + triangleCount * 50;
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const dataView = new DataView(arrayBuffer);

    // 1. Write Header (80 bytes)
    const headerStr = '3D Terrain Studio - Binary STL - 3D Print Ready Model';
    for (let i = 0; i < 80; i++) {
      dataView.setUint8(i, i < headerStr.length ? headerStr.charCodeAt(i) : 32);
    }

    // 2. Write Triangle Count (4 bytes Uint32, little-endian)
    dataView.setUint32(80, triangleCount, true);

    let offset = 84;

    const vA = new THREE.Vector3();
    const vB = new THREE.Vector3();
    const vC = new THREE.Vector3();
    const cb = new THREE.Vector3();
    const ab = new THREE.Vector3();
    const normal = new THREE.Vector3();

    const getVertex = (idx: number, target: THREE.Vector3) => {
      const x = posAttr.getX(idx);
      const y = posAttr.getY(idx);
      const z = posAttr.getZ(idx);
      target.set(x, -z, y);
    };

    for (let i = 0; i < triangleCount; i++) {
      let idx0 = i * 3;
      let idx1 = i * 3 + 1;
      let idx2 = i * 3 + 2;

      if (indexAttr) {
        idx0 = indexAttr.getX(idx0);
        idx1 = indexAttr.getX(idx1);
        idx2 = indexAttr.getX(idx2);
      }

      getVertex(idx0, vA);
      getVertex(idx1, vB);
      getVertex(idx2, vC);

      // Compute face normal
      cb.subVectors(vC, vB);
      ab.subVectors(vA, vB);
      cb.cross(ab);
      cb.normalize();
      normal.copy(cb);

      // Write Normal Vector
      dataView.setFloat32(offset, normal.x, true);
      dataView.setFloat32(offset + 4, normal.y, true);
      dataView.setFloat32(offset + 8, normal.z, true);
      offset += 12;

      // Write Vertices
      dataView.setFloat32(offset, vA.x, true);
      dataView.setFloat32(offset + 4, vA.y, true);
      dataView.setFloat32(offset + 8, vA.z, true);
      offset += 12;

      dataView.setFloat32(offset, vB.x, true);
      dataView.setFloat32(offset + 4, vB.y, true);
      dataView.setFloat32(offset + 8, vB.z, true);
      offset += 12;

      dataView.setFloat32(offset, vC.x, true);
      dataView.setFloat32(offset + 4, vC.y, true);
      dataView.setFloat32(offset + 8, vC.z, true);
      offset += 12;

      dataView.setUint16(offset, 0, true);
      offset += 2;
    }

    const blob = new Blob([arrayBuffer], { type: 'application/octet-stream' });
    this.downloadBlob(blob, filename);
  }

  // Export OBJ format with UVs
  public static exportOBJ(geometry: THREE.BufferGeometry, filename: string = 'terrain-model.obj'): void {
    const posAttr = geometry.getAttribute('position');
    const uvAttr = geometry.getAttribute('uv');
    const indexAttr = geometry.getIndex();

    if (!posAttr) return;

    let output = '# 3D Terrain Studio Export\n';

    for (let i = 0; i < posAttr.count; i++) {
      output += 'v ' + posAttr.getX(i).toFixed(4) + ' ' + posAttr.getY(i).toFixed(4) + ' ' + posAttr.getZ(i).toFixed(4) + '\n';
    }

    if (uvAttr) {
      for (let i = 0; i < uvAttr.count; i++) {
        output += 'vt ' + uvAttr.getX(i).toFixed(4) + ' ' + uvAttr.getY(i).toFixed(4) + '\n';
      }
    }

    const triangleCount = indexAttr ? indexAttr.count / 3 : posAttr.count / 3;
    for (let i = 0; i < triangleCount; i++) {
      let i0 = i * 3 + 1;
      let i1 = i * 3 + 2;
      let i2 = i * 3 + 3;

      if (indexAttr) {
        i0 = indexAttr.getX(i * 3) + 1;
        i1 = indexAttr.getX(i * 3 + 1) + 1;
        i2 = indexAttr.getX(i * 3 + 2) + 1;
      }

      if (uvAttr) {
        output += 'f ' + i0 + '/' + i0 + ' ' + i1 + '/' + i1 + ' ' + i2 + '/' + i2 + '\n';
      } else {
        output += 'f ' + i0 + ' ' + i1 + ' ' + i2 + '\n';
      }
    }

    const blob = new Blob([output], { type: 'text/plain' });
    this.downloadBlob(blob, filename);
  }

  // Capture current 3D viewport as high-res PNG image
  public static captureCanvasImage(renderer: THREE.WebGLRenderer, filename: string = 'terrain-view.png'): void {
    const dataURL = renderer.domElement.toDataURL('image/png');
    const a = document.createElement('a');
    a.href = dataURL;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  private static downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
}
