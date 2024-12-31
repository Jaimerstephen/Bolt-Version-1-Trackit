import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Keypoints3D } from '../../types/spatial';
import { SKELETON_CONNECTIONS, KEYPOINT_COLORS } from '../pose/skeleton/constants';

export interface Scene {
  updatePoseModel: (keypoints: Keypoints3D) => void;
  resize: (width: number, height: number) => void;
  dispose: () => void;
}

export function createScene(container: HTMLElement): Scene {
  // Scene setup
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x1a1a1a);

  // Camera setup
  const camera = new THREE.PerspectiveCamera(
    75,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(0, 1.5, 3);

  // Renderer setup
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 1, 0);
  controls.update();

  // Grid and axes helpers
  const gridHelper = new THREE.GridHelper(2, 20);
  scene.add(gridHelper);

  const axesHelper = new THREE.AxesHelper(1);
  scene.add(axesHelper);

  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);

  // Skeleton management
  const joints: { [key: string]: THREE.Mesh } = {};
  const bones: THREE.Line[] = [];
  let isDisposed = false;

  function animate() {
    if (isDisposed) return;
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }

  animate();

  return {
    updatePoseModel: (keypoints: Keypoints3D) => {
      // Update joints
      Object.entries(keypoints).forEach(([name, point]) => {
        if (!joints[name]) {
          const geometry = new THREE.SphereGeometry(0.03);
          const material = new THREE.MeshPhongMaterial({
            color: KEYPOINT_COLORS[name.replace('left', '').replace('right', '') as keyof typeof KEYPOINT_COLORS]
          });
          joints[name] = new THREE.Mesh(geometry, material);
          scene.add(joints[name]);
        }
        joints[name].position.set(point.x, point.y, point.z);
      });

      // Update bones
      bones.forEach(bone => scene.remove(bone));
      bones.length = 0;

      SKELETON_CONNECTIONS.forEach(([from, to]) => {
        if (joints[from] && joints[to]) {
          const points = [joints[from].position, joints[to].position];
          const geometry = new THREE.BufferGeometry().setFromPoints(points);
          const material = new THREE.LineBasicMaterial({
            color: KEYPOINT_COLORS[from.replace('left', '').replace('right', '') as keyof typeof KEYPOINT_COLORS]
          });
          const bone = new THREE.Line(geometry, material);
          bones.push(bone);
          scene.add(bone);
        }
      });
    },
    resize: (width: number, height: number) => {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    },
    dispose: () => {
      isDisposed = true;
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    }
  };
}