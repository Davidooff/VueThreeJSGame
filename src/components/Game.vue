<script setup lang="ts">
import Game from '@/game-logic/classes'
import type { Field, FieldData } from '@/game-logic/classes/field'
import type { CellWetnesState } from '@/game-logic/classes/field/EmptyCell'
import * as THREE from 'three'

const props = defineProps<{ game: Game }>()

const cellWetnesMaterials = [
  new THREE.MeshBasicMaterial({ color: 0x9e7b1b }),
  new THREE.MeshBasicMaterial({ color: 0x0022ff }),
  new THREE.MeshBasicMaterial({ color: 0x1eff00 }),
]

// function

class GameView {
  width: number
  height: number
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000)
  light = new THREE.DirectionalLight(0xffffff, 1)
  field: FieldData
  fieldView: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[][]
  player = new THREE.Mesh(
    new THREE.BoxGeometry(0.2, 0.8, 0.2),
    new THREE.MeshBasicMaterial({ color: 0xffffff }),
  )
  constructor(field: FieldData) {
    this.field = field
    //Generating mesh for each cell
    this.fieldView = field.map((row) =>
      row.map((cell) => this.createBlock(cell.cellPostion, cell.fieldWetnesState)),
    )

    this.width = window.innerWidth
    this.height = window.innerHeight

    //Adding mesh to the scene
    this.fieldView.forEach((row) =>
      row.forEach((cell) => {
        this.scene.add(cell)
      }),
    )
    //Adding player to the scene
    this.scene.add(this.player)

    this.camera.position.set(12, 5, 10)
    this.camera.lookAt(5, 0, 5)

    this.light.position.set(0, 1, 0)
    this.light.target.position.set(0, 0, 0)
    this.light.castShadow = true
    this.scene.add(this.light.target)

    this.player.position.set(this.player.position.x, 0.8, this.player.position.z)
    this.player.castShadow = true

    this.renderer.setSize(this.width, this.height)
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap
    // renderer.setAnimationLoop(animate)
    document.body.appendChild(this.renderer.domElement)
    this.renderer.render(this.scene, this.camera)
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
}

const gameView = new GameView(props.game.field.field)
</script>

<template>
  <button @click="props.game.water()">Watter</button>
  {{ props.game.field }}
</template>

<style scoped>
/* Add your styles here */
</style>
