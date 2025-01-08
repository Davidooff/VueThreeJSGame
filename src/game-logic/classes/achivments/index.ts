import { type AchivmentsEl, emptyAchivments } from '../../game-data/data/achivments'

interface ConstructorProps {
  data: AchivmentsEl[]
  exp: number
}

class Achivments {
  achivmentsData = emptyAchivments.sort((a, b) => b.exp - a.exp)
  exp = 0

  constructor(props?: ConstructorProps) {
    if (props) {
      this.achivmentsData = props.data.sort((a, b) => b.exp - a.exp)
      this.exp = props.exp
    }
  }

  checkForNewAchivments(): AchivmentsEl[] | null {
    let newAchivments: AchivmentsEl[] = []
    for (let i = 0; i < this.achivmentsData.length; i++) {
      if (!this.achivmentsData[i].isUnlocked) {
        if (this.achivmentsData[i].exp > this.exp) {
          break
        }
        this.achivmentsData[i].isUnlocked = true
        newAchivments.push(this.achivmentsData[i])
      }
    }

    return newAchivments.length ? newAchivments : null
  }

  addExp(exp: number) {
    this.exp += exp
  }
}

export default Achivments
