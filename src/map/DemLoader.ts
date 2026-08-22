export interface BoundingBox {
  minLat: number;
  minLng: number;
  maxLat: number;
  maxLng: number;
}

export interface TerrainData {
  width: number;
  height: number;
  elevations: Float32Array; // in meters
  minElev: number;
  maxElev: number;
  bounds: BoundingBox;
  textureCanvas: HTMLCanvasElement;
}

// Convert Lat/Lng to Tile Coordinates
export function latLngToTile(lat: number, lng: number, zoom: number): { x: number; y: number } {
  const latRad = (lat * Math.PI) / 180;
  const n = Math.pow(2, zoom);
  const x = Math.floor(((lng + 180) / 360) * n);
  const y = Math.floor(((1 - Math.asinh(Math.tan(latRad)) / Math.PI) / 2) * n);
  return { x: Math.max(0, Math.min(n - 1, x)), y: Math.max(0, Math.min(n - 1, y)) };
}

// Convert Tile Coordinates to Lat/Lng (North-West corner)
export function tileToLatLng(x: number, y: number, zoom: number): { lat: number; lng: number } {
  const n = Math.pow(2, zoom);
  const lng = (x / n) * 360 - 180;
  const latRad = Math.atan(Math.sinh(Math.PI * (1 - (2 * y) / n)));
  const lat = (latRad * 180) / Math.PI;
  return { lat, lng };
}

// Determine best zoom level for bounding box
export function getAppropriateZoom(bounds: BoundingBox, _targetResolution: number = 256): number {
  const latDiff = Math.abs(bounds.maxLat - bounds.minLat);
  const lngDiff = Math.abs(bounds.maxLng - bounds.minLng);
  const maxDiff = Math.max(latDiff, lngDiff);

  // Approximate zoom level
  let zoom = Math.floor(Math.log2(360 / maxDiff)) + 1;
  return Math.max(2, Math.min(13, zoom));
}

export class DemLoader {
  // Decode Mapzen Terrarium PNG RGB values to elevation (meters)
  // formula: (R * 256 + G + B / 256) - 32768
  public static decodeTerrariumRGB(r: number, g: number, b: number): number {
    return (r * 256.0 + g + b / 256.0) - 32768.0;
  }

  // Load elevation and satellite imagery for the given bounding box
  public static async loadTerrain(
    bounds: BoundingBox,
    resolution: number = 128,
    textureType: 'satellite' | 'osm' | 'elevation' | 'clay' = 'satellite',
    onProgress?: (percent: number, message: string) => void
  ): Promise<TerrainData> {
    onProgress?.(10, 'ズームレベルとタイル座標を計算中...');

    const zoom = getAppropriateZoom(bounds, resolution);
    const minTile = latLngToTile(bounds.maxLat, bounds.minLng, zoom);
    const maxTile = latLngToTile(bounds.minLat, bounds.maxLng, zoom);

    const startX = Math.min(minTile.x, maxTile.x);
    const endX = Math.max(minTile.x, maxTile.x);
    const startY = Math.min(minTile.y, maxTile.y);
    const endY = Math.max(minTile.y, maxTile.y);

    const tileCountX = endX - startX + 1;
    const tileCountY = endY - startY + 1;
    const totalTiles = tileCountX * tileCountY;

    onProgress?.(20, '標高タイル (' + totalTiles + ' 枚) を取得中...');

    // Create canvases to stitch tiles
    const stitchedDemCanvas = document.createElement('canvas');
    stitchedDemCanvas.width = tileCountX * 256;
    stitchedDemCanvas.height = tileCountY * 256;
    const demCtx = stitchedDemCanvas.getContext('2d', { willReadFrequently: true })!;

    const stitchedTextureCanvas = document.createElement('canvas');
    stitchedTextureCanvas.width = tileCountX * 256;
    stitchedTextureCanvas.height = tileCountY * 256;
    const texCtx = stitchedTextureCanvas.getContext('2d')!;

    // Bounding box of stitched tiles
    const stitchedNW = tileToLatLng(startX, startY, zoom);
    const stitchedSE = tileToLatLng(endX + 1, endY + 1, zoom);

    let loadedTiles = 0;
    const promises: Promise<void>[] = [];

    for (let ty = startY; ty <= endY; ty++) {
      for (let tx = startX; tx <= endX; tx++) {
        const destX = (tx - startX) * 256;
        const destY = (ty - startY) * 256;

        const demUrl = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/' + zoom + '/' + tx + '/' + ty + '.png';
        let texUrl = '';
        if (textureType === 'satellite') {
          texUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/' + zoom + '/' + ty + '/' + tx;
        } else if (textureType === 'osm') {
          texUrl = 'https://tile.openstreetmap.org/' + zoom + '/' + tx + '/' + ty + '.png';
        }

        const p = (async () => {
          try {
            const demImg = await this.loadImage(demUrl);
            demCtx.drawImage(demImg, destX, destY, 256, 256);
          } catch (e) {
            console.warn('Failed to load DEM tile at ' + zoom + '/' + tx + '/' + ty, e);
          }

          if (texUrl) {
            try {
              const texImg = await this.loadImage(texUrl);
              texCtx.drawImage(texImg, destX, destY, 256, 256);
            } catch (e) {
              console.warn('Failed to load texture tile at ' + zoom + '/' + tx + '/' + ty, e);
            }
          }

          loadedTiles++;
          onProgress?.(20 + Math.floor((loadedTiles / totalTiles) * 50), 'タイル読み込み中 (' + loadedTiles + '/' + totalTiles + ')...');
        })();
        promises.push(p);
      }
    }

    await Promise.all(promises);

    onProgress?.(75, '標高グリッドを解析 & サンプリング中...');

    // Resample DEM to target resolution
    const demImageData = demCtx.getImageData(0, 0, stitchedDemCanvas.width, stitchedDemCanvas.height);
    const demPixels = demImageData.data;

    // Resample Texture to target size
    const finalTextureCanvas = document.createElement('canvas');
    finalTextureCanvas.width = 1024;
    finalTextureCanvas.height = 1024;
    const finalTexCtx = finalTextureCanvas.getContext('2d')!;

    // Coordinate mapping from target bounds to stitched image
    const uMin = (bounds.minLng - stitchedNW.lng) / (stitchedSE.lng - stitchedNW.lng);
    const uMax = (bounds.maxLng - stitchedNW.lng) / (stitchedSE.lng - stitchedNW.lng);
    const vMin = (bounds.maxLat - stitchedNW.lat) / (stitchedSE.lat - stitchedNW.lat);
    const vMax = (bounds.minLat - stitchedNW.lat) / (stitchedSE.lat - stitchedNW.lat);

    const cropX = Math.max(0, Math.floor(uMin * stitchedDemCanvas.width));
    const cropY = Math.max(0, Math.floor(vMin * stitchedDemCanvas.height));
    const cropW = Math.max(1, Math.floor((uMax - uMin) * stitchedDemCanvas.width));
    const cropH = Math.max(1, Math.floor((vMax - vMin) * stitchedDemCanvas.height));

    if (textureType === 'satellite' || textureType === 'osm') {
      finalTexCtx.drawImage(
        stitchedTextureCanvas,
        cropX, cropY, cropW, cropH,
        0, 0, finalTextureCanvas.width, finalTextureCanvas.height
      );
    }

    const elevations = new Float32Array(resolution * resolution);
    let minElev = Infinity;
    let maxElev = -Infinity;

    for (let j = 0; j < resolution; j++) {
      const v = vMin + (j / (resolution - 1)) * (vMax - vMin);
      const py = Math.max(0, Math.min(stitchedDemCanvas.height - 1, Math.floor(v * stitchedDemCanvas.height)));

      for (let i = 0; i < resolution; i++) {
        const u = uMin + (i / (resolution - 1)) * (uMax - uMin);
        const px = Math.max(0, Math.min(stitchedDemCanvas.width - 1, Math.floor(u * stitchedDemCanvas.width)));

        const idx = (py * stitchedDemCanvas.width + px) * 4;
        const r = demPixels[idx];
        const g = demPixels[idx + 1];
        const b = demPixels[idx + 2];

        let elev = this.decodeTerrariumRGB(r, g, b);
        if (isNaN(elev) || elev < -500 || elev > 9000) {
          elev = 0;
        }

        elevations[j * resolution + i] = elev;
        if (elev < minElev) minElev = elev;
        if (elev > maxElev) maxElev = elev;
      }
    }

    if (textureType === 'elevation') {
      this.generateElevationTexture(finalTexCtx, elevations, resolution, minElev, maxElev);
    } else if (textureType === 'clay') {
      finalTexCtx.fillStyle = '#e2e8f0';
      finalTexCtx.fillRect(0, 0, finalTextureCanvas.width, finalTextureCanvas.height);
    }

    onProgress?.(100, '標高データの読み込みが完了しました');

    return {
      width: resolution,
      height: resolution,
      elevations,
      minElev,
      maxElev,
      bounds,
      textureCanvas: finalTextureCanvas,
    };
  }

  private static generateElevationTexture(
    ctx: CanvasRenderingContext2D,
    elevations: Float32Array,
    res: number,
    min: number,
    max: number
  ) {
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const imgData = ctx.createImageData(w, h);
    const data = imgData.data;

    const range = Math.max(1, max - min);

    for (let y = 0; y < h; y++) {
      const gy = Math.floor((y / h) * (res - 1));
      for (let x = 0; x < w; x++) {
        const gx = Math.floor((x / w) * (res - 1));
        const elev = elevations[gy * res + gx];
        const t = Math.max(0, Math.min(1, (elev - min) / range));

        const rgb = this.getHypsometricColor(t);
        const idx = (y * w + x) * 4;
        data[idx] = rgb[0];
        data[idx + 1] = rgb[1];
        data[idx + 2] = rgb[2];
        data[idx + 3] = 255;
      }
    }

    ctx.putImageData(imgData, 0, 0);
  }

  private static getHypsometricColor(t: number): [number, number, number] {
    if (t < 0.2) {
      const k = t / 0.2;
      return [Math.floor(34 + k * 80), Math.floor(139 + k * 60), Math.floor(34 + k * 40)];
    } else if (t < 0.5) {
      const k = (t - 0.2) / 0.3;
      return [Math.floor(114 + k * 110), Math.floor(199 + k * 20), Math.floor(74 - k * 30)];
    } else if (t < 0.8) {
      const k = (t - 0.5) / 0.3;
      return [Math.floor(224 - k * 80), Math.floor(219 - k * 120), Math.floor(44 - k * 10)];
    } else {
      const k = (t - 0.8) / 0.2;
      return [Math.floor(144 + k * 111), Math.floor(99 + k * 156), Math.floor(34 + k * 221)];
    }
  }

  private static loadImage(url: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = (err) => reject(err);
      img.src = url;
    });
  }
}
