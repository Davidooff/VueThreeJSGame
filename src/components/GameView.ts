import type { Field, FieldData } from '@/game-logic/classes/field'
import type { CellWetnesState, EmptyCell } from '@/game-logic/classes/field/EmptyCell'
import { isPlantedCell, PlantedCell } from '@/game-logic/classes/field/PlantedCell';
import type { LoadModelPros } from '@/utils/modelsLoader';
import loadModel from '@/utils/modelsLoader';
import * as THREE from 'three'
import type { Group, Object3DEventMap } from 'three'

const cellWetnesMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x9e7b1b }),
  new THREE.MeshBasicMaterial({ color: 0x0022ff }),
  new THREE.MeshBasicMaterial({ color: 0x1eff00 }),
]

export default class GameView {
  width: number
  height: number
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  light = new THREE.AmbientLight(0x404040);
  dl = new THREE.DirectionalLight(0x2a2a2a, 2.5);
  player = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.8, 0.2),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  )
  field: FieldData
  fieldView: Array<THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>>[];
  plantView: Array<Group<Object3DEventMap> | null>[];;
  constructor(field: FieldData) {
    this.field = JSON.parse(JSON.stringify(field))
    //Generating mesh for each cell and plant, then pushing it to the fieldView and plantView
    this.fieldView = new Array(field.length)
    this.plantView = new Array(field.length)


    field.forEach((row, row_index) => {
      this.fieldView[row_index] = new Array(field.length)
      this.plantView[row_index] = new Array(field.length)
      row.forEach((cell, cell_index) => {
        this.fieldView[row_index][cell_index] = this.createBlock(cell.cellPostion, cell.fieldWetnesState)
        // console.log("Block: ",this.fieldView[row_index][cell_index]);

        this.scene.add(this.fieldView[row_index][cell_index])
        if(isPlantedCell(cell)){
          this.createPlant({model_name: cell.plant.title, growthStage: cell.currentGrowthStage}, cell.cellPostion).then((model) => {
            this.plantView[row_index][cell_index] = model
            this.scene.add(model)
          })
        } else {
          this.plantView[row_index][cell_index] = null
        }
      })
      // console.log("generated field", this.fieldView)
  })

    // console.log("generated field", this.fieldView)

    this.width = window.innerWidth
    this.height = window.innerHeight

    //Adding player to the scene
    this.scene.add(this.player)

    // Setting up camer
    this.camera.position.set(12, 5, 10)
    this.camera.lookAt(5, 0, 5)

    // Setting up light
    this.light.position.set(0, 1, 0)
    this.scene.add(this.light)

    this.dl.position.set(0, 5, 0)
    this.scene.add(this.dl)
    
    // Setting up player
    this.player.position.set(this.player.position.x, 0.8, this.player.position.z)
    this.player.castShadow = true

    this.renderer.setSize(this.width, this.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // renderer.setAnimationLoop(animate)
    document.body.appendChild(this.renderer.domElement)
    this.renderer.render(this.scene, this.camera)
  }

  async updateMap(newField: FieldData, position: [number, number]){
    const updates = this.getUpdates(newField)
    
    updates.cell.forEach((cell) => {
      this.scene.remove(this.fieldView[cell[0]][cell[1]])
      let _ = this.createBlock(newField[cell[0]][cell[1]].cellPostion, newField[cell[0]][cell[1]].fieldWetnesState)
      this.scene.add(_)
      this.fieldView[cell[0]][cell[1]] = _
    })

    updates.plant.forEach(async (plantPossition) => {
      if(this.plantView[plantPossition[0]][plantPossition[1]]){
        this.scene.remove(this.plantView[plantPossition[0]][plantPossition[1]] as Group<Object3DEventMap>)
        this.plantView[plantPossition[0]][plantPossition[1]] = null
      }

      if (isPlantedCell(newField[plantPossition[0]][plantPossition[1]])){
        this.plantView[plantPossition[0]][plantPossition[1]] = await this.createPlant({model_name: (newField[plantPossition[0]][plantPossition[1]] as PlantedCell).plant.title, growthStage: (newField[plantPossition[0]][plantPossition[1]] as PlantedCell).currentGrowthStage}, newField[plantPossition[0]][plantPossition[1]].cellPostion)
        this.scene.add(this.plantView[plantPossition[0]][plantPossition[1]] as Group<Object3DEventMap>)
      }
    })
    this.player.position.set(position[0], 0.8, position[1])
    this.renderer.render(this.scene, this.camera)
  }

  private getUpdates(newField: FieldData): {cell: [number, number][], plant: [number, number][]} {
    let updated: {cell: [number, number][], plant: [number, number][]} = {cell: [], plant: []}
    // console.log("field view", this.fieldView);
    
    newField.forEach((row, row_index) => {
      row.forEach((cell, cell_index) => {
        if(row_index == 0 && cell_index == 0){
          console.log("cell: ", cell);
          console.log("Field: ", this.field[row_index][cell_index]);
          
        }
        if(cell.fieldWetnesState !== this.field[row_index][cell_index].fieldWetnesState){
   
          updated.cell.push([row_index, cell_index])
          // console.log("WETNES", cell.fieldWetnesState, this.field[row_index][cell_index].fieldWetnesState)
        }

        if(this.checkIsPlantUpdated(this.field[row_index][cell_index], cell)){
            updated.plant.push([row_index, cell_index])
        }
      })
    })

    return updated
  }

  private checkIsPlantUpdated(oldCell: PlantedCell | EmptyCell, newCell: PlantedCell | EmptyCell): boolean{
    if(isPlantedCell(newCell) !== isPlantedCell(oldCell) ||
      (
        isPlantedCell(newCell) && 
        isPlantedCell(oldCell) && 
        (
          newCell.currentGrowthStage !== oldCell.currentGrowthStage || newCell.plant.title !== oldCell.plant.title
        )
      )
      ){
        console.log("Update of plant spoted")
        return true
    }
    
    return false
  }

  render() {
    this.renderer.render(this.scene, this.camera)
  }

  createBlock(
    position: [number, number],
    cellWetnesState: CellWetnesState,
  ): THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> {
    const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
    const material = cellWetnesMaterials[cellWetnesState]

    const mesh = new THREE.Mesh(geometry, material)
    mesh.position.set(position[0], 0, position[1])
    mesh.castShadow = true
    mesh.receiveShadow = true
    return mesh
  }

  async createPlant(model_data: LoadModelPros, position: [number, number]){
    const model = await loadModel(model_data);
    model.position.set(position[0], 0, position[1])
    return model
  }
}