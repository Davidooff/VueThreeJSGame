<script setup lang="ts">
import Game from '@/game-logic/classes'
import type { Field, FieldData } from '@/game-logic/classes/field'
import type { CellWetnesState } from '@/game-logic/classes/field/EmptyCell'
import * as THREE from 'three'

const props = defineProps<{ game: Game }>()

const cellWetnesMaterials = [
  new THREE.MeshBasicMaterial({ color: 0xffd500 }),
  new THREE.MeshBasicMaterial({ color: 0x0022ff }),
  new THREE.MeshBasicMaterial({ color: 0x1eff00 }),
]

function createBlock(
  position: [number, number],
  cellWetnesState: CellWetnesState,
): THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap> {
  const geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8)
  const material = cellWetnesMaterials[cellWetnesState]

  const mesh = new THREE.Mesh(geometry, material)
  mesh.position.set(position[0], 0, position[1])
  return mesh
}

class GameView {
  width: number
  height: number
  scene = new THREE.Scene()
  renderer = new THREE.WebGLRenderer({ antialias: true })
  camera = new THREE.PerspectiveCamera(70, 0.01, 10)
  field: FieldData
  fieldView: THREE.Mesh<THREE.BoxGeometry, THREE.MeshBasicMaterial, THREE.Object3DEventMap>[][]
  constructor(field: FieldData) {
    this.field = field
    //Generating mesh for each cell
    this.fieldView = field.map((row) =>
      row.map((cell) => createBlock(cell.cellPostion, cell.fieldWetnesState)),
    )

    this.width = window.innerWidth
    this.height = window.innerHeight

    //Adding mesh to the scene
    this.fieldView.forEach((row) =>
      row.forEach((cell) => {
        this.scene.add(cell)
      }),
    )

    this.renderer.setSize(this.width, this.height)
    // renderer.setAnimationLoop(animate)
    document.body.appendChild(this.renderer.domElement)
  }
}
</script>

<template>
  <button @click="props.game.water()">Watter</button>
  {{ props.game.field }}
</template>

<style scoped>
/* Add your styles here */
</style>
