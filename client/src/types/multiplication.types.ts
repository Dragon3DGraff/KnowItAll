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

export enum Mode {
  EXAM = "exam",
  TRAIN = "train",
}

export type MultiplationsStatistics = {
  correctCount: number;
  createdAt: string;
  date: string;
  id: number;
  incorrectCount: number;
  mode: Mode;
  numbers: number;
  results: Result[];
  solvedCount: number;
  timer: number;
  updatedAt: string;
  userId: string;
};
