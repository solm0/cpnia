interface fugitiveLineProp {
  [gameKey: string]: {
    [formality: string]: {
      [verbosity: string]: {
        [warmth: string]: {
          line: string;
          options: {
            answer: string;
            score: number;
          }[]
        };
      }
    }
  };
}

export const fugitiveLines: fugitiveLineProp = {
  1: {
    "해체": {
      "평범": {
        "친근한": { 
          line: '난피자가되기싫어',
          options: [
            { answer: '보통답변', score: 2 },
            { answer: '좋은답변', score: 3 },
            { answer: '나쁜답변', score: 1 }
          ]
        }
      }
    }
  },
  2: {
    "해체": {
      "평범": {
        "친근한": { 
          line: '난피자가되기싫어 2',
          options: [
            { answer: '나쁜답변', score: 1 },
            { answer: '좋은답변', score: 3 },
            { answer: '보통답변', score: 2 },
          ]
        }
      }
    }
  },
  3: {
    "해체": {
      "평범": {
        "친근한": { 
          line: '난피자가되기싫어 3',
          options: [
            { answer: '좋은답변', score: 3 },
            { answer: '나쁜답변', score: 1 },
            { answer: '보통답변', score: 2 },
          ]
        }
      }
    }
  },
}