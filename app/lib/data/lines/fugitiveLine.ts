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
          line: '난 피자가 되고 싶지않아..',
          options: [
            { answer: '아니야 슬프겠지만 이 운명을 받아들이렴', score: 2 },
            { answer: '너의 마음 이해해.. 나라도 파프리카로 태어나서 피자되기 싫어 ', score: 5 },
            { answer: '미안하지만 이 세계에 태어난 이상 넌 피자재료가 되어야만 해', score: -2 }
          ]
        }
      }
    }
  },
  2: {
    "해체": {
      "평범": {
        "친근한": { 
          line: '난 예쁘지 않은 파프리카야.. 굳이 나를 써야해?',
          options: [
            { answer: '안예쁘니까 써야지', score: -2 },
            { answer: '너가 있음으로 더 풍부한 피자가 될 거야. 너의 도움이 필요해', score: 5 },
            { answer: '예쁘고 말고는 중요하지 않아 그저 너의 존재가 필요할 뿐', score: 2 },
          ]
        }
      }
    }
  },
  3: {
    "해체": {
      "평범": {
        "친근한": { 
          line: '내가 이 피자가게에 도움이 될까? 용기를 내서 나가보려하는데 쉽지 않아..',
          options: [
            { answer: '응 너가 와준다면 더 맛있는 피자가 될거야. 너는 다른 파프리카보다 특별한 맛을 지니고 있어', score: 5 },
            { answer: '사실 너 없어도 잘 돌아가', score: -2 },
            { answer: '너대신 다른애가 한다고 하긴 했는데, 미안하다면 나오는게 좋을 것 같네', score: 2 },
          ]
        }
      }
    }
  },
}