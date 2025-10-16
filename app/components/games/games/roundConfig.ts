export interface W2G1roundConfigProp {
  normCount: number,
  abnormCount: number,
  normKind: number,
  abnormKind: number,
  time: number,
}

export const W2G1roundConfig: Record<number, W2G1roundConfigProp> = {
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
    abnormKind: 2,
    time: 50,
  },
  3: {
    normCount: 16,
    abnormCount: 6,
    normKind: 4,
    abnormKind: 3,
    time: 40,
  }
}