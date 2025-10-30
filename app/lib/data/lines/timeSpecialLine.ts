interface lineWOptionsProp {
  [formality: string]: {
    [verbosity: string]: {
      [warmth: string]: {
        line: string;
        options?: {
          answer: string;
          action: string;
        }[]
      }[];
    }
  }
}

interface timeSpecialLineProp {
  [name: string]: lineWOptionsProp;
}

export const timeSpecialLines: timeSpecialLineProp = {
  "카드게임장에서 발견한 주민": {
    "해체": {
      "평범": {
        "친근한": [
          { 
            line: "여기 처음 왔니? 포커 실력 좀 보자", 
            options: [
              { answer: '그래', action: 'goToGame' },
              { answer: '싫어', action: 'closeModal' }
            ]
          },
        ],
      },
    }
  },
  "파친코 앞에서 발견한 주민": {
    "해체": {
      "평범": {
        "친근한": [
          { 
            line: "너도 슬롯머신으로 돈을 따봐", 
            options: [
              { answer: '그래', action: 'goToGame' },
              { answer: '싫어', action: 'closeModal' }
            ]
          },
        ],
      },
    }
  },
}