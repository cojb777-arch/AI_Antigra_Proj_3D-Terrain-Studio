import L from 'leaflet';
import { BoundingBox } from './DemLoader';

export interface PresetLocation {
  name: string;
  category: string;
  bounds: BoundingBox;
  description: string;
}

export const PRESET_LOCATIONS: PresetLocation[] = [
  {
    name: '🗻 富士山 (Mt. Fuji)',
    category: '日本',
    bounds: { minLat: 35.26, minLng: 138.62, maxLat: 35.45, maxLng: 138.85 },
    description: '日本最高峰。美しい円錐火山の起伏と宝永火口。'
  },
  {
    name: '🌋 阿蘇山・カルデラ (Mt. Aso)',
    category: '日本',
    bounds: { minLat: 32.80, minLng: 131.00, maxLat: 32.96, maxLng: 131.18 },
    description: '世界有数の巨大カルデラと中央火口丘。'
  },
  {
    name: '🏔️ 北アルプス・槍穂高 (Japan Alps)',
    category: '日本',
    bounds: { minLat: 36.24, minLng: 137.60, maxLat: 36.38, maxLng: 137.75 },
    description: '槍ヶ岳・穂高岳の険しい岩稜と深いV字谷。'
  },
  {
    name: '🏝️ 屋久島 (Yakushima)',
    category: '日本',
    bounds: { minLat: 30.24, minLng: 130.40, maxLat: 30.46, maxLng: 130.68 },
    description: '洋上のアルプス。標高差2000m近い急峻な山岳島。'
  },
  {
    name: '🏜️ グランドキャニオン (Grand Canyon)',
    category: '世界',
    bounds: { minLat: 36.00, minLng: -112.20, maxLat: 36.18, maxLng: -111.95 },
    description: 'アメリカ・コロラド川が削り出した壮大な大峡谷。'
  },
  {
    name: '⛰️ マッターホルン (Matterhorn)',
    category: '世界',
    bounds: { minLat: 45.92, minLng: 7.60, maxLat: 46.03, maxLng: 7.75 },
    description: 'スイス・アルプスのピラミッド型鋭峰。'
  },
  {
    name: '🏔️ エベレスト (Mt. Everest)',
    category: '世界',
    bounds: { minLat: 27.93, minLng: 86.85, maxLat: 28.05, maxLng: 87.02 },
    description: '世界最高峰ヒマラヤ山脈の峰々と氷河。'
  },
  {
    name: '🌋 ハワイ島・マウナケア (Hawaii)',
    category: '世界',
    bounds: { minLat: 19.65, minLng: -155.65, maxLat: 19.95, maxLng: -155.35 },
    description: '海底からの比高世界一の巨大な火山。'
  }
];

export class MapSelector {
  private map!: L.Map;
  private rectangleLayer!: L.Rectangle;
  private currentBounds: BoundingBox;
  private onBoundsChanged: (bounds: BoundingBox) => void;

  constructor(containerId: string, initialBounds: BoundingBox, onBoundsChanged: (bounds: BoundingBox) => void) {
    this.currentBounds = initialBounds;
    this.onBoundsChanged = onBoundsChanged;

    this.initMap(containerId);
  }

  private initMap(containerId: string): void {
    const centerLat = (this.currentBounds.minLat + this.currentBounds.maxLat) / 2;
    const centerLng = (this.currentBounds.minLng + this.currentBounds.maxLng) / 2;

    this.map = L.map(containerId, {
      center: [centerLat, centerLng],
      zoom: 11,
      zoomControl: true,
    });

    const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap'
    });

    const esriSatLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      maxZoom: 18,
      attribution: '© ESRI World Imagery'
    });

    esriSatLayer.addTo(this.map);

    L.control.layers({
      '衛星写真 (ESRI)': esriSatLayer,
      '標準地図 (OSM)': osmLayer
    }).addTo(this.map);

    this.updateRectangle(this.currentBounds);

    let isDrawing = false;
    let startLatLng: L.LatLng | null = null;

    this.map.on('mousedown', (e) => {
      if (e.originalEvent.shiftKey) {
        this.map.dragging.disable();
        isDrawing = true;
        startLatLng = e.latlng;
      }
    });

    this.map.on('mousemove', (e) => {
      if (isDrawing && startLatLng) {
        const bounds: BoundingBox = {
          minLat: Math.min(startLatLng.lat, e.latlng.lat),
          maxLat: Math.max(startLatLng.lat, e.latlng.lat),
          minLng: Math.min(startLatLng.lng, e.latlng.lng),
          maxLng: Math.max(startLatLng.lng, e.latlng.lng),
        };
        this.updateRectangle(bounds);
      }
    });

    this.map.on('mouseup', (e) => {
      if (isDrawing && startLatLng) {
        isDrawing = false;
        this.map.dragging.enable();
        const bounds: BoundingBox = {
          minLat: Math.min(startLatLng.lat, e.latlng.lat),
          maxLat: Math.max(startLatLng.lat, e.latlng.lat),
          minLng: Math.min(startLatLng.lng, e.latlng.lng),
          maxLng: Math.max(startLatLng.lng, e.latlng.lng),
        };
        if (Math.abs(bounds.maxLat - bounds.minLat) > 0.01 && Math.abs(bounds.maxLng - bounds.minLng) > 0.01) {
          this.setBounds(bounds);
        }
      }
    });
  }

  public setBounds(bounds: BoundingBox, panMap: boolean = true): void {
    this.currentBounds = bounds;
    this.updateRectangle(bounds);

    if (panMap) {
      const leafletBounds = L.latLngBounds(
        [bounds.minLat, bounds.minLng],
        [bounds.maxLat, bounds.maxLng]
      );
      this.map.fitBounds(leafletBounds, { padding: [30, 30] });
    }

    this.onBoundsChanged(this.currentBounds);
  }

  public getBounds(): BoundingBox {
    return this.currentBounds;
  }

  private updateRectangle(bounds: BoundingBox): void {
    const latLngBounds = L.latLngBounds(
      [bounds.minLat, bounds.minLng],
      [bounds.maxLat, bounds.maxLng]
    );

    if (this.rectangleLayer) {
      this.map.removeLayer(this.rectangleLayer);
    }

    this.rectangleLayer = L.rectangle(latLngBounds, {
      color: '#38bdf8',
      weight: 2,
      fillColor: '#0284c7',
      fillOpacity: 0.25,
    }).addTo(this.map);
  }

  public static async searchLocation(query: string): Promise<{ name: string; bounds: BoundingBox } | null> {
    const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' + encodeURIComponent(query) + '&limit=1';
    try {
      const response = await fetch(url, {
        headers: { 'Accept-Language': 'ja,en' }
      });
      const results = await response.json();
      if (results && results.length > 0) {
        const item = results[0];
        const bbox = item.boundingbox;
        return {
          name: item.display_name,
          bounds: {
            minLat: parseFloat(bbox[0]),
            maxLat: parseFloat(bbox[1]),
            minLng: parseFloat(bbox[2]),
            maxLng: parseFloat(bbox[3]),
          }
        };
      }
    } catch (e) {
      console.error('Nominatim geocode failed', e);
    }
    return null;
  }
}
