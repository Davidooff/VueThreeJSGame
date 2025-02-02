import { createEmptyField, Field } from '@/game-logic/classes/field'
import type { Plant } from './plants'
import Skills from '@/game-logic/classes/skills'
import Achivments from '@/game-logic/classes/achivments'
import { myTree, type MySkillData, type SkillTree } from './skills'
import { CellWetnesState, EmptyCell } from '@/game-logic/classes/field/EmptyCell'
import { emptyAchivments, type AchivmentsEl } from './achivments'
import type { PlantedCell } from '@/game-logic/classes/field/PlantedCell'

export interface SaveData {
  money: number
  unlockedPlants: Plant[]
  fieldData: Array<EmptyCell | PlantedCell>[]
  playerPosition: [number, number]
  skillTree: SkillTree<MySkillData>
  achivmentsData: AchivmentsEl[]
  exp: number
}

const defaultStartPlants: Plant[] = [
  {
    title: 'Wheat',
    growthDuration: 20,
    needWetStateToGrow: CellWetnesState.Dry,
    plantCost: 1,
    sellPrice: 5,
  },
]

export const clearSave: SaveData = {
  money: 100,
  unlockedPlants: defaultStartPlants,
  fieldData: createEmptyField([10, 10]),
  playerPosition: [0, 0],
  skillTree: myTree,
  achivmentsData: emptyAchivments,
  exp: 0,
}
