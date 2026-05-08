import { Cuboid, Expand, Minus, Plus, Rotate3D, RotateCcw } from "lucide-react";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type ModelViewerProps = {
  code: string;
  finishColor?: string;
  modelUrl: string;
  title: string;
};

const CAMERA_OFFSET = new THREE.Vector3(2.8, 1.52, 5.85);
const DEFAULT_TARGET = new THREE.Vector3(0, 0.48, 0);
const CABINET_FINISH_MATERIAL_PATTERN = /^(material|door|shutter|front|drawer)/i;

export function ModelViewer({ code, finishColor, modelUrl, title }: ModelViewerProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const homeCameraRef = useRef(DEFAULT_TARGET.clone().add(CAMERA_OFFSET));
  const homeTargetRef = useRef(DEFAULT_TARGET.clone());
  const finishColorRef = useRef(finishColor);
  const finishMaterialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [autoRotate, setAutoRotate] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    let frame = 0;
    let disposed = false;
    let model: THREE.Object3D | null = null;
    finishMaterialsRef.current = [];

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#faf7f2");

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.copy(homeCameraRef.current);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ alpha: false, antialias: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.cursor = "grab";
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controlsRef.current = controls;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.42;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = true;
    controls.maxDistance = 8;
    controls.minDistance = 2;
    controls.target.copy(homeTargetRef.current);

    const setGrabbing = () => {
      renderer.domElement.style.cursor = "grabbing";
    };
    const setGrab = () => {
      renderer.domElement.style.cursor = "grab";
    };

    renderer.domElement.addEventListener("pointerdown", setGrabbing);
    window.addEventListener("pointerup", setGrab);

    const ambient = new THREE.HemisphereLight("#ffffff", "#111111", 2.4);
    scene.add(ambient);

    const keyLight = new THREE.DirectionalLight("#ffffff", 3.6);
    keyLight.position.set(3, 5, 4);
    keyLight.castShadow = true;
    keyLight.shadow.mapSize.set(1024, 1024);
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight("#fcf2dc", 1.2);
    fillLight.position.set(-4, 2, -3);
    scene.add(fillLight);

    const displayGroup = new THREE.Group();
    displayGroup.position.y = -0.38;
    scene.add(displayGroup);

    const shadowTexture = createShadowTexture();
    const stage = new THREE.Mesh(
      new THREE.PlaneGeometry(3.4, 2.15),
      new THREE.MeshBasicMaterial({
        alphaMap: shadowTexture,
        color: "#111111",
        depthWrite: false,
        transparent: true,
        opacity: 0.14,
      }),
    );
    stage.rotation.x = -Math.PI / 2;
    stage.position.y = -0.012;
    displayGroup.add(stage);

    const loader = new GLTFLoader();
    loader.load(
      modelUrl,
      (gltf) => {
        if (disposed) {
          return;
        }

        model = gltf.scene;
        model.traverse((child) => {
          if (child instanceof THREE.Mesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            const materials = Array.isArray(child.material) ? child.material : [child.material];

            materials.forEach((material, index) => {
              material.side = THREE.FrontSide;

              if (CABINET_FINISH_MATERIAL_PATTERN.test(material.name.trim())) {
                const finishMaterial = toFinishMaterial(material);
                if (finishColorRef.current) {
                  finishMaterial.color.set(finishColorRef.current);
                }
                finishMaterialsRef.current.push(finishMaterial);

                if (Array.isArray(child.material)) {
                  child.material[index] = finishMaterial;
                } else {
                  child.material = finishMaterial;
                }
              }
            });
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        const maxAxis = Math.max(size.x, size.y, size.z) || 1;
        const scale = 2 / maxAxis;

        model.position.sub(center);
        model.scale.setScalar(scale);

        const fittedBox = new THREE.Box3().setFromObject(model);
        model.position.y -= fittedBox.min.y;

        displayGroup.add(model);
        displayGroup.updateWorldMatrix(true, true);
        model.updateWorldMatrix(true, true);

        const worldBox = new THREE.Box3().setFromObject(model);
        const worldSize = worldBox.getSize(new THREE.Vector3());
        const worldCenter = worldBox.getCenter(new THREE.Vector3());
        const nextTarget = new THREE.Vector3(
          worldCenter.x,
          worldBox.min.y + worldSize.y * 0.52,
          worldCenter.z,
        );
        const nextCamera = nextTarget.clone().add(CAMERA_OFFSET);

        homeTargetRef.current.copy(nextTarget);
        homeCameraRef.current.copy(nextCamera);
        camera.position.copy(nextCamera);
        controls.target.copy(nextTarget);
        controls.update();
        setStatus("ready");
      },
      undefined,
      () => {
        if (!disposed) {
          setStatus("error");
        }
      },
    );

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;

      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    const observer = new ResizeObserver(resize);
    observer.observe(mount);
    resize();

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      controls.dispose();
      controlsRef.current = null;
      cameraRef.current = null;
      gsap.killTweensOf(camera.position);
      gsap.killTweensOf(controls.target);
      shadowTexture.dispose();
      renderer.domElement.removeEventListener("pointerdown", setGrabbing);
      window.removeEventListener("pointerup", setGrab);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, [modelUrl]);

  useEffect(() => {
    finishColorRef.current = finishColor;

    if (!finishColor) {
      return;
    }

    const nextColor = new THREE.Color(finishColor);

    finishMaterialsRef.current.forEach((material) => {
      gsap.killTweensOf(material.color);
      gsap.to(material.color, {
        b: nextColor.b,
        duration: 0.4,
        ease: "power2.out",
        g: nextColor.g,
        r: nextColor.r,
      });
      material.needsUpdate = true;
    });
  }, [finishColor]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(document.fullscreenElement === rootRef.current);
    };

    document.addEventListener("fullscreenchange", onFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", onFullscreenChange);
  }, []);

  const animateCameraTo = (position: THREE.Vector3, target = homeTargetRef.current.clone()) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!camera || !controls) {
      return;
    }

    gsap.killTweensOf(camera.position);
    gsap.killTweensOf(controls.target);
    gsap.to(camera.position, {
      x: position.x,
      y: position.y,
      z: position.z,
      duration: 0.72,
      ease: "power3.out",
      onUpdate: () => controls.update(),
    });
    gsap.to(controls.target, {
      x: target.x,
      y: target.y,
      z: target.z,
      duration: 0.72,
      ease: "power3.out",
      onUpdate: () => controls.update(),
    });
  };

  const resetView = () => {
    animateCameraTo(homeCameraRef.current.clone(), homeTargetRef.current.clone());
  };

  const zoomBy = (factor: number) => {
    const camera = cameraRef.current;
    const controls = controlsRef.current;

    if (!camera || !controls) {
      return;
    }

    const direction = camera.position.clone().sub(controls.target).normalize();
    const currentDistance = camera.position.distanceTo(controls.target);
    const nextDistance = THREE.MathUtils.clamp(currentDistance * factor, 2, 8);
    animateCameraTo(controls.target.clone().add(direction.multiplyScalar(nextDistance)), controls.target.clone());
  };

  const toggleAutoRotate = () => {
    setAutoRotate((current) => {
      const next = !current;

      if (controlsRef.current) {
        controlsRef.current.autoRotate = next;
      }

      return next;
    });
  };

  const toggleFullscreen = async () => {
    const root = rootRef.current;

    if (!root) {
      return;
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await root.requestFullscreen();
  };

  return (
    <div
      ref={rootRef}
      className="relative min-h-[26rem] overflow-hidden rounded-lg border bg-accent lg:min-h-[34rem] [&:fullscreen]:min-h-screen [&:fullscreen]:rounded-none [&:fullscreen]:border-0"
    >
      <div ref={mountRef} className="absolute inset-0" aria-label={`${title} 3D model`} />

      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4 sm:p-5">
        <div className="rounded-sm border bg-white/86 px-3 py-2 backdrop-blur-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Interactive module
          </p>
          <p className="mt-1 font-heading text-2xl font-light">{code}</p>
        </div>
        <div className="grid size-11 place-items-center rounded-full border bg-white/86 backdrop-blur-sm">
          <Cuboid className="size-5" aria-hidden="true" />
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col gap-3 p-4 sm:p-5 md:flex-row md:items-end md:justify-between">
        <p className="rounded-sm border bg-white/86 px-3 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground backdrop-blur-sm">
          {status === "loading" ? "Loading GLB" : status === "error" ? "Model unavailable" : "Drag to inspect"}
        </p>
        <div className="pointer-events-auto flex flex-wrap items-center gap-2">
          <ViewerButton
            active={autoRotate}
            icon={Rotate3D}
            label={autoRotate ? "Pause rotate" : "Auto rotate"}
            onClick={toggleAutoRotate}
          />
          <ViewerButton icon={RotateCcw} label="Reset view" onClick={resetView} />
          <ViewerButton icon={Minus} label="Zoom out" onClick={() => zoomBy(1.18)} />
          <ViewerButton icon={Plus} label="Zoom in" onClick={() => zoomBy(0.84)} />
          <ViewerButton
            active={isFullscreen}
            icon={Expand}
            label={isFullscreen ? "Exit view" : "Full view"}
            onClick={() => void toggleFullscreen()}
          />
        </div>
      </div>
    </div>
  );
}

function createShadowTexture() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 160;

  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const gradient = context.createRadialGradient(128, 80, 8, 128, 80, 104);
  gradient.addColorStop(0, "rgba(17,17,17,0.75)");
  gradient.addColorStop(0.45, "rgba(17,17,17,0.22)");
  gradient.addColorStop(1, "rgba(17,17,17,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function toFinishMaterial(material: THREE.Material) {
  if (material instanceof THREE.MeshStandardMaterial) {
    const clonedMaterial = material.clone();
    clonedMaterial.map = null;
    clonedMaterial.roughness = Math.max(clonedMaterial.roughness, 0.68);
    clonedMaterial.metalness = 0;
    return clonedMaterial;
  }

  return new THREE.MeshStandardMaterial({
    color: "#f1eee6",
    name: material.name,
    roughness: 0.78,
    metalness: 0,
  });
}

function ViewerButton({
  active = false,
  icon: Icon,
  label,
  onClick,
}: {
  active?: boolean;
  icon: typeof Rotate3D;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      aria-pressed={active}
      className={`group grid size-10 place-items-center rounded-sm border text-foreground backdrop-blur-sm transition-colors duration-smooth hover:bg-primary hover:text-primary-foreground ${
        active ? "bg-primary text-primary-foreground" : "bg-white/86"
      }`}
      onClick={onClick}
      title={label}
      type="button"
    >
      <Icon className="size-4" aria-hidden="true" />
    </button>
  );
}
