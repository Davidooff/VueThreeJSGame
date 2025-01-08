export interface AchivmentsEl {
  title: string;
  exp: number;
  isUnlocked: boolean;
}

export const emptyAchivments: AchivmentsEl[] = [
  {
    title: "Smthing",
    exp: 100,
    isUnlocked: false,
  },
  {
    title: "Smthing 2",
    exp: 200,
    isUnlocked: false,
  },
];
