export enum Sign {
  division = ":",
  multiplication = "x",
}

export type Solution = TableItem & {
  userAnswer: number | undefined;
  result: boolean;
};

export type TableItem = {
  number1: number;
  number2: number;
  actionSign: Sign;
  answer: number;
};

export type MultiplicationTable = {
  [Sign.multiplication]: Record<number, TableItem[]>;
  [Sign.division]: Record<number, TableItem[]>;
};
