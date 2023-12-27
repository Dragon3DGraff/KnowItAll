import {
  MultiplicationTable,
  Sign,
  TableItem,
} from "../types/multiplication.types";

export const numbers = new Array(9).fill(2).map((_, i) => i + _);

const getMults = (val: number): TableItem[] => {
  const result: TableItem[] = [];
  numbers.forEach((item: number) => {
    result.push({
      number1: item,
      number2: val,
      actionSign: Sign.multiplication,
      answer: item * val,
      id: `${item}${Sign.multiplication}${val}`,
    });
  });
  return result;
};

const getDivisions = (val: number): TableItem[] => {
  const result: TableItem[] = [];
  numbers.forEach((item: number) => {
    result.push({
      number1: item * val,
      number2: val,
      actionSign: Sign.division,
      answer: item,
      id: `${item * val}${Sign.division}${val}`,
    });
  });
  return result;
};

export const getMultiplicationTable = () => {
  const table: Record<number, TableItem[]> = {};

  numbers.forEach((item: number) => {
    table[item] = getMults(item);
  });

  return table;
};

export const getDivisionTable = () => {
  const table: Record<number, TableItem[]> = {};

  numbers.forEach((item: number) => {
    table[item] = getDivisions(item);
  });

  return table;
};

export const getTable = (): MultiplicationTable => {
  return {
    [Sign.multiplication]: getMultiplicationTable(),
    [Sign.division]: getDivisionTable(),
  };
};
