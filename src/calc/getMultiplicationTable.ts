const numbers = new Array(10).fill(1).map((_, i) => i + _);

const getMults = (val: number): Record<number, number> => {
  const result: Record<number, number> = {};
  numbers.forEach((item: number) => {
    result[item] = val * item;
  });
  return result;
};

const getDivisions = (val: number): Record<number, number> => {
  const result: Record<number, number> = {};
  numbers.forEach((item: number) => {
    result[val * item] = item;
  });
  return result;
};

export const getMultiplicationTable = () => {
  const table: Record<number, Record<number, number>> = {};

  numbers.forEach((item: number) => {
    table[item] = getMults(item);
  });

  return table;
};

export const getDivisionTable = () => {
  const table: Record<number, Record<number, number>> = {};

  numbers.forEach((item: number) => {
    table[item] = getDivisions(item);
  });

  return table;
};

export const getTable = () => {
  return {
    "*": getMultiplicationTable(),
    "/": getDivisionTable(),
  };
};
