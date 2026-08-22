import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { BoundingBox, DemLoader, TerrainData } from './map/DemLoader';
import { MapSelector, PRESET_LOCATIONS } from './map/MapSelector';
import { TerrainMeshBuilder } from './terrain/TerrainMesh';
import { Exporter } from './terrain/Exporter';
import { VRManager } from './vr/VRManager';

class App {
  // Three.js Core
  private renderer!: THREE.WebGLRenderer;
  private scene!: THREE.Scene;
  private camera!: THREE.PerspectiveCamera;
  private controls!: OrbitControls;

  // VR
  private vrManager!: VRManager;

  // Scene Objects
  private terrainGroup!: THREE.Group;
  private terrainMesh: THREE.Mesh | null = null;
  private baseGridHelper: THREE.GridHelper | null = null;

  // Map & Data
  private mapSelector!: MapSelector;
  private currentTerrainData: TerrainData | null = null;

  // Settings State
  private exaggeration = 2.5;
  private baseThickness = 4.0;
  private resolution = 160;
  private textureType: 'satellite' | 'elevation' | 'clay' | 'osm' = 'satellite';

  // Initial Location: Mt. Fuji
  private currentBounds: BoundingBox = {
    minLat: 35.26,
    minLng: 138.62,
    maxLat: 35.45,
    maxLng: 138.85
  };

  constructor() {
    this.initThree();
    this.initMapAndUI();
    this.bindEvents();
    this.loadTerrain();
  }

  private initThree(): void {
    const container = document.getElementById('three-canvas-container')!;

    // 1. Scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0f172a);
    this.scene.fog = new THREE.FogExp2(0x0f172a, 0.015);

    // 2. Camera
    this.camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    this.setViewAngle('iso');

    // 3. Renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
    this.renderer.setSize(container.clientWidth, container.clientHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(this.renderer.domElement);

    // 4. Controls (Mouse & Touch Orbit)
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.maxPolarAngle = Math.PI / 2 + 0.05;
    this.controls.minDistance = 5;
    this.controls.maxDistance = 150;

    // 5. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    this.scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfffaed, 1.8);
    dirLight.position.set(30, 50, 40);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.bias = -0.0005;
    this.scene.add(dirLight);

    const fillLight = new THREE.DirectionalLight(0x93c5fd, 0.6);
    fillLight.position.set(-30, 20, -30);
    this.scene.add(fillLight);

    // 6. Terrain Group
    this.terrainGroup = new THREE.Group();
    this.scene.add(this.terrainGroup);

    // 7. Base Grid Floor
    this.baseGridHelper = new THREE.GridHelper(60, 30, 0x38bdf8, 0x1e293b);
    this.baseGridHelper.position.y = -4;
    this.scene.add(this.baseGridHelper);

    // 8. VR Manager
    this.vrManager = new VRManager(this.renderer, this.scene, this.camera, this.terrainGroup);
    const vrBtn = VRManager.createVRButton(this.renderer, () => {
      this.vrManager.resetTerrainInVR();
    });
    document.getElementById('vr-btn-container')?.appendChild(vrBtn);

    // 9. Resize Listener
    window.addEventListener('resize', () => this.onWindowResize());

    // 10. Animation Loop
    this.renderer.setAnimationLoop(() => {
      this.controls.update();
      this.vrManager.update();
      this.renderer.render(this.scene, this.camera);
    });
  }

  private initMapAndUI(): void {
    this.mapSelector = new MapSelector('leaflet-map', this.currentBounds, (newBounds) => {
      this.currentBounds = newBounds;
    });

    const chipsContainer = document.getElementById('preset-chips')!;
    PRESET_LOCATIONS.forEach((preset) => {
      const chip = document.createElement('button');
      chip.className = 'chip';
      chip.textContent = preset.name;
      chip.title = preset.description;
      chip.onclick = () => {
        this.currentBounds = preset.bounds;
        this.mapSelector.setBounds(preset.bounds);
        this.loadTerrain();
      };
      chipsContainer.appendChild(chip);
    });
  }

  private bindEvents(): void {
    const searchInput = document.getElementById('search-input') as HTMLInputElement;
    const btnSearch = document.getElementById('btn-search')!;
    const doSearch = async () => {
      const q = searchInput.value.trim();
      if (!q) return;
      this.showLoading(true, '地名を検索中...');
      const result = await MapSelector.searchLocation(q);
      this.showLoading(false);
      if (result) {
        this.currentBounds = result.bounds;
        this.mapSelector.setBounds(result.bounds);
        this.loadTerrain();
      } else {
        alert('「' + q + '」が見つかりませんでした。別のキーワードをお試しください。');
      }
    };
    btnSearch.onclick = doSearch;
    searchInput.onkeydown = (e) => {
      if (e.key === 'Enter') doSearch();
    };

    document.getElementById('btn-generate')!.onclick = () => {
      this.loadTerrain();
    };

    const sliderExagg = document.getElementById('slider-exaggeration') as HTMLInputElement;
    const exaggVal = document.getElementById('exaggeration-val')!;
    sliderExagg.oninput = () => {
      this.exaggeration = parseFloat(sliderExagg.value);
      exaggVal.textContent = this.exaggeration.toFixed(1) + 'x';
      this.rebuildMeshGeometry();
    };

    const sliderBase = document.getElementById('slider-base') as HTMLInputElement;
    const baseVal = document.getElementById('base-val')!;
    sliderBase.oninput = () => {
      this.baseThickness = parseFloat(sliderBase.value);
      baseVal.textContent = this.baseThickness + ' mm';
      this.rebuildMeshGeometry();
    };

    const selectRes = document.getElementById('select-resolution') as HTMLSelectElement;
    selectRes.onchange = () => {
      this.resolution = parseInt(selectRes.value, 10);
      this.loadTerrain();
    };

    const texButtons = document.querySelectorAll('.btn-tex');
    texButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        texButtons.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.textureType = (btn as HTMLElement).dataset.type as any;
        this.loadTerrain();
      });
    });

    const btnIso = document.getElementById('btn-view-iso')!;
    const btnTop = document.getElementById('btn-view-top')!;
    const btnSide = document.getElementById('btn-view-side')!;

    const setActiveViewBtn = (activeBtn: HTMLElement) => {
      [btnIso, btnTop, btnSide].forEach(b => b.classList.remove('active'));
      activeBtn.classList.add('active');
    };

    btnIso.onclick = () => {
      this.setViewAngle('iso');
      setActiveViewBtn(btnIso);
    };
    btnTop.onclick = () => {
      this.setViewAngle('top');
      setActiveViewBtn(btnTop);
    };
    btnSide.onclick = () => {
      this.setViewAngle('side');
      setActiveViewBtn(btnSide);
    };

    document.getElementById('btn-capture-png')!.onclick = () => {
      this.renderer.render(this.scene, this.camera);
      Exporter.captureCanvasImage(this.renderer, '3D-Terrain-' + Date.now() + '.png');
    };

    document.getElementById('btn-export-stl')!.onclick = () => {
      if (!this.terrainMesh) return;
      Exporter.exportBinarySTL(this.terrainMesh.geometry, 'terrain-3dprint-' + Date.now() + '.stl');
    };

    document.getElementById('btn-export-obj')!.onclick = () => {
      if (!this.terrainMesh) return;
      Exporter.exportOBJ(this.terrainMesh.geometry, 'terrain-model-' + Date.now() + '.obj');
    };

    const modal = document.getElementById('guide-modal')!;
    document.getElementById('btn-guide-modal')!.onclick = () => modal.classList.remove('hidden');
    document.getElementById('btn-close-modal')!.onclick = () => modal.classList.add('hidden');
    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.add('hidden');
    };
  }

  public setViewAngle(type: 'iso' | 'top' | 'side'): void {
    if (type === 'iso') {
      this.camera.position.set(22, 20, 26);
    } else if (type === 'top') {
      this.camera.position.set(0, 38, 0.01);
    } else if (type === 'side') {
      this.camera.position.set(0, 4, 34);
    }
    this.controls?.target.set(0, 0, 0);
    this.controls?.update();
  }

  private async loadTerrain(): Promise<void> {
    this.showLoading(true, '標高タイルとテクスチャを取得中...');

    try {
      this.currentTerrainData = await DemLoader.loadTerrain(
        this.currentBounds,
        this.resolution,
        this.textureType,
        (percent, message) => {
          this.updateProgress(percent, message);
        }
      );

      this.rebuildMeshGeometry();
      this.updateStats();
    } catch (e) {
      console.error('Failed to load terrain', e);
      alert('地形データの取得に失敗しました。接続環境をご確認ください。');
    } finally {
      this.showLoading(false);
    }
  }

  private rebuildMeshGeometry(): void {
    if (!this.currentTerrainData) return;

    if (this.terrainMesh) {
      this.terrainGroup.remove(this.terrainMesh);
      this.terrainMesh.geometry.dispose();
      if (Array.isArray(this.terrainMesh.material)) {
        this.terrainMesh.material.forEach((m) => m.dispose());
      } else {
        this.terrainMesh.material.dispose();
      }
    }

    const geometry = TerrainMeshBuilder.createSolidGeometry(this.currentTerrainData, {
      exaggeration: this.exaggeration,
      baseThickness: this.baseThickness * 0.2,
      size: 24,
    });

    const texture = new THREE.CanvasTexture(this.currentTerrainData.textureCanvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    const material = new THREE.MeshStandardMaterial({
      map: texture,
      roughness: 0.75,
      metalness: 0.05,
      side: THREE.DoubleSide,
    });

    this.terrainMesh = new THREE.Mesh(geometry, material);
    this.terrainMesh.castShadow = true;
    this.terrainMesh.receiveShadow = true;
    this.terrainGroup.add(this.terrainMesh);

    const box = new THREE.Box3().setFromObject(this.terrainMesh);
    const center = box.getCenter(new THREE.Vector3());
    this.terrainMesh.position.y = -center.y;

    if (this.baseGridHelper) {
      this.baseGridHelper.position.y = box.min.y - center.y - 0.2;
    }
  }

  private updateStats(): void {
    if (!this.currentTerrainData || !this.terrainMesh) return;
    const statsEl = document.getElementById('terrain-stats');
    if (!statsEl) return;

    const elevDiff = Math.round(this.currentTerrainData.maxElev - this.currentTerrainData.minElev);
    const maxElev = Math.round(this.currentTerrainData.maxElev);
    const triCount = (this.terrainMesh.geometry.getIndex()?.count || 0) / 3;

    statsEl.innerHTML =
      '<span>標高差: <b>' + elevDiff.toLocaleString() + ' m</b></span>' +
      '<span>最高標高: <b>' + maxElev.toLocaleString() + ' m</b></span>' +
      '<span>三角形数: <b>' + triCount.toLocaleString() + '</b></span>';
  }

  private showLoading(show: boolean, text: string = ''): void {
    const el = document.getElementById('loading-overlay')!;
    const textEl = document.getElementById('loading-text')!;
    if (show) {
      el.classList.remove('hidden');
      textEl.textContent = text;
      this.updateProgress(10, text);
    } else {
      el.classList.add('hidden');
    }
  }

  private updateProgress(percent: number, message: string): void {
    const fill = document.getElementById('progress-bar-fill');
    const text = document.getElementById('loading-text');
    if (fill) fill.style.width = percent + '%';
    if (text) text.textContent = message;
  }

  private onWindowResize(): void {
    const container = document.getElementById('three-canvas-container')!;
    if (!container) return;
    this.camera.aspect = container.clientWidth / container.clientHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(container.clientWidth, container.clientHeight);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new App();
});
