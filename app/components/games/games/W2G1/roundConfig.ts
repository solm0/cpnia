export interface roundConfigProp {
  normCount: number,
  abnormCount: number,
  normKind: number,
  abnormKind: number,
  time: number,
}

export const roundConfig: Record<number, roundConfigProp> = {
  1: {
    normCount: 8,
    abnormCount: 2,
    normKind: 1,
    abnormKind: 1,
    time: 60,
  },
  2: {
    normCount: 10,
    abnormCount: 4,
    normKind: 2,
    abnormKind: 1,
    time:40,
  },
  3: {
    normCount: 20,
    abnormCount: 6,
    normKind: 4,
    abnormKind: 2,
    time: 20,
  }
}