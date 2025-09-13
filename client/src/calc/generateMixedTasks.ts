import { Sign, TableItem } from "../types/multiplication.types"

const getRandomIntInclusive = (min: number, max: number): number => {
  const low = Math.ceil(min)
  const high = Math.floor(max)
  return Math.floor(Math.random() * (high - low + 1)) + low
}

const generateAddition = (twoOrThreeDigits: 2 | 3): TableItem => {
  const min = twoOrThreeDigits === 2 ? 10 : 100
  const max = twoOrThreeDigits === 2 ? 99 : 999
  const number1 = getRandomIntInclusive(min, max)
  const number2 = getRandomIntInclusive(min, max)
  const answer = number1 + number2
  return {
    number1,
    number2,
    actionSign: Sign.addition,
    answer,
    id: `${number1}${Sign.addition}${number2}`,
  }
}

const generateSubtraction = (twoOrThreeDigits: 2 | 3): TableItem => {
  const min = twoOrThreeDigits === 2 ? 10 : 100
  const max = twoOrThreeDigits === 2 ? 99 : 999
  let number1 = getRandomIntInclusive(min, max)
  let number2 = getRandomIntInclusive(min, max)
  if (number2 > number1) {
    const tmp = number1
    number1 = number2
    number2 = tmp
  }
  const answer = number1 - number2
  return {
    number1,
    number2,
    actionSign: Sign.subtraction,
    answer,
    id: `${number1}${Sign.subtraction}${number2}`,
  }
}

const generateMultiplication = (twoOrThreeDigits: 2 | 3): TableItem => {
  const minA = twoOrThreeDigits === 2 ? 10 : 100
  const maxA = twoOrThreeDigits === 2 ? 99 : 999
  const number1 = getRandomIntInclusive(minA, maxA)
  const number2 = getRandomIntInclusive(2, 9)
  const answer = number1 * number2
  return {
    number1,
    number2,
    actionSign: Sign.multiplication,
    answer,
    id: `${number1}${Sign.multiplication}${number2}`,
  }
}

const generateDivision = (twoOrThreeDigits: 2 | 3): TableItem => {
  const minA = twoOrThreeDigits === 2 ? 10 : 100
  const maxA = twoOrThreeDigits === 2 ? 99 : 999
  const divisor = getRandomIntInclusive(2, 9)
  const quotient = getRandomIntInclusive(
    Math.ceil(minA / divisor),
    Math.floor(maxA / divisor)
  )
  const number1 = divisor * quotient // dividend
  const number2 = divisor // divisor
  const answer = quotient
  return {
    number1,
    number2,
    actionSign: Sign.division,
    answer,
    id: `${number1}${Sign.division}${number2}`,
  }
}

export const generateMixedTasks = (): TableItem[] => {
  const tasks: TableItem[] = []
  const generators: Array<(d: 2 | 3) => TableItem> = [
    generateAddition,
    generateSubtraction,
    generateMultiplication,
    generateDivision,
  ]

  const usedIds = new Set<string>()

  while (tasks.length < 10) {
    const gen = generators[getRandomIntInclusive(0, generators.length - 1)]
    const digits = (getRandomIntInclusive(0, 1) === 0 ? 2 : 3) as 2 | 3
    const item = gen(digits)
    if (!usedIds.has(item.id)) {
      usedIds.add(item.id)
      tasks.push(item)
    }
  }

  return tasks
}
