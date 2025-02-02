import type { MySkillData, SkillTree } from "@/game-logic/game-data/data/skills";

export default function isSkillTree(
  node: SkillTree<MySkillData> | MySkillData
): node is SkillTree<MySkillData> {
  return (node as SkillTree<MySkillData>).skill !== undefined;
}
