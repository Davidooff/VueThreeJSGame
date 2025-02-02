import { PlantGrowthStage, plantsModels, type PlantName } from '@/game-logic/game-data/data/plants';
import type { Group, Object3DEventMap } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';


export interface LoadModelPros {
  model_name: PlantName;
  growthStage: PlantGrowthStage;
}

const loader = new GLTFLoader();

// const dracoLoader = new DRACOLoader();
// dracoLoader.setDecoderPath( '/examples/jsm/libs/draco/' );
// loader.setDRACOLoader( dracoLoader );


const loadModel = async (modelData: LoadModelPros): Promise<Group<Object3DEventMap>> => {
  const currentModel = plantsModels[modelData.model_name][modelData.growthStage]
  const modelScene = new Promise<Group<Object3DEventMap>>((resolve, reject) => {
    loader.load(currentModel.model_path, function ( gltf ) {
      gltf.scene.scale.set(currentModel.scale, currentModel.scale, currentModel.scale);
      resolve(gltf.scene);
    },
    // called while loading is progressing
    function ( xhr ) {
      console.log('loaded', xhr.loaded, "/", xhr.total );
    },
    // called when loading has errors
    function ( error ) {
      reject( error );
    })
  });
  return modelScene;
}

export default loadModel;