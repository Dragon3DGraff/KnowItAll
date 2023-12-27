export enum Sign {
  division = ":",
  multiplication = "x",
}

export type Result = TableItem & {
  userAnswer: number | undefined;
  result: boolean;
};

export type TableItem = {
  number1: number;
  number2: number;
  actionSign: Sign;
  answer: number;
  id: string;
};

export type MultiplicationTable = {
  [Sign.multiplication]: Record<number, TableItem[]>;
  [Sign.division]: Record<number, TableItem[]>;
};
