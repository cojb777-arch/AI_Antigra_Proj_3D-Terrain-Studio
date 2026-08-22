import * as THREE from 'three';

export class VRManager {
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private _camera: THREE.PerspectiveCamera;
  private terrainGroup: THREE.Group;

  private controller1!: any;
  private controller2!: any;
  private controllerGrip1!: any;
  private controllerGrip2!: any;

  private isGrabbing1 = false;
  private isGrabbing2 = false;
  private prevPos1 = new THREE.Vector3();
  private prevPos2 = new THREE.Vector3();
  private initialPinchDist = 0;
  private initialScale = 1;

  constructor(renderer: THREE.WebGLRenderer, scene: THREE.Scene, camera: THREE.PerspectiveCamera, terrainGroup: THREE.Group) {
    this.renderer = renderer;
    this.scene = scene;
    this._camera = camera;
    this.terrainGroup = terrainGroup;

    this.initXR();
  }

  private initXR(): void {
    this.renderer.xr.enabled = true;

    // Setup controllers
    this.controller1 = this.renderer.xr.getController(0);
    this.controller1.addEventListener('selectstart', () => this.onSelectStart(1));
    this.controller1.addEventListener('selectend', () => this.onSelectEnd(1));
    this.controller1.addEventListener('squeezestart', () => this.onSqueezeStart(1));
    this.controller1.addEventListener('squeezeend', () => this.onSqueezeEnd(1));
    this.scene.add(this.controller1);

    this.controller2 = this.renderer.xr.getController(1);
    this.controller2.addEventListener('selectstart', () => this.onSelectStart(2));
    this.controller2.addEventListener('selectend', () => this.onSelectEnd(2));
    this.controller2.addEventListener('squeezestart', () => this.onSqueezeStart(2));
    this.controller2.addEventListener('squeezeend', () => this.onSqueezeEnd(2));
    this.scene.add(this.controller2);

    // Controller Ray Lines
    const rayGeometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, -2)
    ]);
    const rayMaterial = new THREE.LineBasicMaterial({ color: 0x38bdf8 });
    this.controller1.add(new THREE.Line(rayGeometry, rayMaterial));
    this.controller2.add(new THREE.Line(rayGeometry, rayMaterial.clone()));

    // Controller Grip Models
    const gripGeo = new THREE.BoxGeometry(0.04, 0.04, 0.1);
    const gripMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
    this.controllerGrip1 = this.renderer.xr.getControllerGrip(0);
    this.controllerGrip1.add(new THREE.Mesh(gripGeo, gripMat));
    this.scene.add(this.controllerGrip1);

    this.controllerGrip2 = this.renderer.xr.getControllerGrip(1);
    this.controllerGrip2.add(new THREE.Mesh(gripGeo, gripMat));
    this.scene.add(this.controllerGrip2);
  }

  private onSelectStart(controllerId: number): void {
    if (controllerId === 1) {
      this.isGrabbing1 = true;
      this.controller1.getWorldPosition(this.prevPos1);
    } else {
      this.isGrabbing2 = true;
      this.controller2.getWorldPosition(this.prevPos2);
    }

    if (this.isGrabbing1 && this.isGrabbing2) {
      const pos1 = new THREE.Vector3();
      const pos2 = new THREE.Vector3();
      this.controller1.getWorldPosition(pos1);
      this.controller2.getWorldPosition(pos2);
      this.initialPinchDist = pos1.distanceTo(pos2);
      this.initialScale = this.terrainGroup.scale.x;
    }
  }

  private onSelectEnd(controllerId: number): void {
    if (controllerId === 1) this.isGrabbing1 = false;
    if (controllerId === 2) this.isGrabbing2 = false;
  }

  private onSqueezeStart(_controllerId: number): void {
    this.resetTerrainInVR();
  }

  private onSqueezeEnd(_controllerId: number): void {}

  public update(): void {
    if (!this.renderer.xr.isPresenting) return;

    const currPos1 = new THREE.Vector3();
    const currPos2 = new THREE.Vector3();
    this.controller1.getWorldPosition(currPos1);
    this.controller2.getWorldPosition(currPos2);

    if (this.isGrabbing1 && this.isGrabbing2 && this.initialPinchDist > 0.01) {
      const currentDist = currPos1.distanceTo(currPos2);
      const scaleFactor = currentDist / this.initialPinchDist;
      const newScale = THREE.MathUtils.clamp(this.initialScale * scaleFactor, 0.05, 5.0);
      this.terrainGroup.scale.set(newScale, newScale, newScale);
    } else if (this.isGrabbing1) {
      const delta = currPos1.clone().sub(this.prevPos1);
      this.terrainGroup.position.add(delta);
    } else if (this.isGrabbing2) {
      const delta = currPos2.clone().sub(this.prevPos2);
      this.terrainGroup.position.add(delta);
    }

    this.prevPos1.copy(currPos1);
    this.prevPos2.copy(currPos2);
  }

  public resetTerrainInVR(): void {
    this.terrainGroup.position.set(0, 1.2, -1.0);
    this.terrainGroup.scale.set(0.15, 0.15, 0.15);
    this.terrainGroup.rotation.set(0, 0, 0);
  }

  public static createVRButton(renderer: THREE.WebGLRenderer, onSessionStarted?: () => void): HTMLElement {
    const button = document.createElement('button');
    button.id = 'vr-button';
    button.className = 'btn-vr';
    button.innerHTML = '<span>🥽</span> VRで見る (Meta Quest 2)';

    if ('xr' in navigator) {
      (navigator as any).xr.isSessionSupported('immersive-vr').then((supported: boolean) => {
        if (supported) {
          button.onclick = () => {
            const currentSession: any = (renderer.xr as any).getSession();
            if (currentSession === null) {
              const sessionInit = { optionalFeatures: ['local-floor', 'bounded-floor', 'hand-tracking'] };
              (navigator as any).xr.requestSession('immersive-vr', sessionInit).then((session: any) => {
                renderer.xr.setSession(session);
                button.innerHTML = '<span>🥽</span> VRを終了';
                onSessionStarted?.();

                session.addEventListener('end', () => {
                  button.innerHTML = '<span>🥽</span> VRで見る (Meta Quest 2)';
                });
              });
            } else {
              currentSession.end();
            }
          };
        } else {
          button.innerHTML = '<span>🥽</span> VRガイド (Quest 2で直接アクセス)';
          button.onclick = () => {
            alert('Meta Quest 2の内蔵ブラウザ（Meta Quest Browser）からこのページを開くと、直接VR空間で立体視を体験できます！');
          };
        }
      }).catch(() => {
        button.innerHTML = '<span>🥽</span> VRガイドを表示';
        button.onclick = () => {
          alert('Meta Quest 2の内蔵ブラウザからこのURLを開いて「VRで見る」を押してください。');
        };
      });
    } else {
      button.innerHTML = '<span>🥽</span> VRガイドを表示';
      button.onclick = () => {
        alert('Meta Quest 2の内蔵ブラウザからこのURLを開いて「VRで見る」を押してください。');
      };
    }

    return button;
  }
}
