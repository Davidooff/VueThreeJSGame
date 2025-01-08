import type { SkillTree, UnlockData } from '../../game-data/data/skills'

class Skills<T extends UnlockData> {
  skillTree: SkillTree<T>

  constructor(unlocksTree: SkillTree<T>) {
    this.skillTree = unlocksTree
  }

  public setUnlockedByPath(path: number[], isUnlocked: boolean): void {
    if (path[0] !== 0) {
      throw new Error('Path need to start from [0]')
    }
    path.shift()
    if (!path.length) {
      this.skillTree.skill.isUnlocked = isUnlocked
    }
    this._setUnlockedByPath(this.skillTree, path, isUnlocked)
  }

  // Private recursive helper method
  private _setUnlockedByPath(tree: SkillTree<T> | T, path: number[], isUnlocked: boolean): void {
    if (path.length === 0) {
      // No further navigation needed: update the current node
      tree.skill.isUnlocked = isUnlocked
      return
    }

    const [currentIndex, ...remainingPath] = path
    const nextNode = tree.nextSkills[currentIndex]

    if (nextNode === undefined) throw new Error('path error')

    // Check if nextNode is a leaf skill or another SkillTree
    if (!this.isSkillTree(nextNode)) {
      // nextNode is a leaf skill
      if (remainingPath.length > 0) {
        throw new Error(
          'Path is too long: reached a leaf skill but still have more indices to navigate.',
        )
      }
      // Update leaf skill
      nextNode.isUnlocked = isUnlocked
    } else {
      // nextNode is another SkillTree; recurse down
      this._setUnlockedByPath(nextNode, remainingPath, isUnlocked)
    }
  }

  private _getUnlocked(skill: SkillTree<T> | T): Array<T | null> | null {
    if (this.isSkillTree(skill)) {
      return skill.skill.isUnlocked
        ? [skill.skill, ...skill.nextSkills.flatMap((el) => this._getUnlocked(el))]
        : skill.nextSkills.flatMap((el) => this._getUnlocked(el))
    } else {
      return skill.isUnlocked ? [skill] : null
    }
  }

  public getUnlocked(): T[] | null {
    return this._getUnlocked(this.skillTree)?.filter((el) => el !== null) || null
  }

  private _getPossibleToUnlock(skillTree: SkillTree<T> | T): T[] | T | null {
    if (this.isSkillTree(skillTree)) {
      if (skillTree.skill.isUnlocked) {
        let result: T[] = skillTree.nextSkills
          .flatMap((el: SkillTree<T> | T) => this._getPossibleToUnlock(el))
          .filter((el: T | null) => el !== null)
        return result.length !== 0 ? result : null
      } else {
        return skillTree.skill
      }
    } else {
      if (skillTree.isUnlocked) {
        return null
      } else {
        return skillTree
      }
    }
  }

  public getPossibleToUnlock(): T[] {
    const possibelToUnlock = this._getPossibleToUnlock(this.skillTree)
    if (Array.isArray(possibelToUnlock)) {
      return possibelToUnlock
    } else {
      return possibelToUnlock ? [possibelToUnlock] : []
    }
  }

  private isSkillTree(node: SkillTree<T> | T): node is SkillTree<T> {
    return (node as SkillTree<T>).skill !== undefined
  }

  private _unlockByKey(
    treeEl: SkillTree<T>,
    findKey: string,
    findData: string | number,
    setUnlock: boolean,
    skipLocked: boolean,
  ): void {
    const queue: Array<SkillTree<T> | T> = [treeEl]

    while (queue.length > 0) {
      const currentNode = queue.shift()! // Dequeue the first element

      if (this.isSkillTree(currentNode)) {
        // If node has 'skill'
        const skillData = currentNode.skill

        if (findKey in skillData && skillData[findKey] === findData) {
          // Found the matching node
          currentNode.skill.isUnlocked = setUnlock // Assuming 'isUnlocked' is a property of SkillTree
          return // Exit after finding the first match
        }

        // Enqueue child nodes for further traversal
        if (!skipLocked || (skipLocked && skillData.isUnlocked)) {
          currentNode.nextSkills.forEach((child: SkillTree<T> | T) => {
            if (this.isSkillTree(child)) {
              queue.push(child)
            }
          })
        }
      } else {
        // If node does not have 'skill', assume it's of type T
        const dataNode = currentNode as any // Replace 'any' with actual type if known

        if (dataNode[findKey] === findData) {
          dataNode.isUnlocked = setUnlock // Assuming 'isUnlocked' exists on T
          return // Exit after finding the first match
        }
      }
    }
    throw new Error('Not found')
  }

  public setUnlockedByKey(find: Object, setUnlock: boolean = true, skipLocked: boolean = false) {
    const findKey = Object.keys(find)
    const findValues = Object.values(find)

    if (findKey.length !== 1) {
      throw new Error('You can pas only one key')
    }

    this._unlockByKey(this.skillTree, findKey[0], findValues[0], setUnlock, skipLocked)
  }
}

export default Skills
