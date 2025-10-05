export interface lineWOptionsProp {
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

interface pizzaCutterLineProp {
  [gameKey: string]: lineWOptionsProp;
}

interface pizzaCutterEndingLineProp {
  [index: number]: lineWOptionsProp;
}

export const pizzaCutterLines: pizzaCutterLineProp = {
  "game1": {
    "해체": {
      "평범": {
        "친근한": [
          { line: '다른 피자집에서 우리집 피자 망치려고 이상한 주민 보낸거같아' },
          { line: '우리집은 페퍼로니가 들어가는 바삭하고 맛있는 피잔데~' },
          { line: '요즘 시큼한 맛이 난다는 항의가 들어와. 옆에 피자헛이라는 가게가 있는데 거기인거 같아, 우리를 아주 따라하던데..' },
          { 
            line: '도와줄래?',
            options: [
              { answer: '응', action: 'goToGame' },
              { answer: '아니', action: 'closeModal' }
            ]
          }
        ]
      }
    }
  },
  "game2": {
    "해체": {
      "평범": {
        "친근한": [
          { line: '너 일 잘한다' },
          { line: '다리가 짧아서 피자 만드는데 너무 오래 걸린다' },
          { 
            line: '피자만드는데 도움을 줄 수 있니?',
            options: [
              { answer: '응', action: 'goToGame' },
              { answer: '아니', action: 'closeModal' }
            ]
          }
        ]
      }
    }
  },
  "game3": {
    "해체": {
      "평범": {
        "친근한": [
          { line: '재료들을 세어보니까 수가 안맞는 거 같아' },
          { line: '누가 아직 안나온 거 같은데..' },
          { line: '한번 재료마을로 가서 찾아줄 수 있어?' },
          {
            line: '저 문을 통해 마을로 들어가서 찾아봐.. 할 거지?',
            options: [
              { answer: '응', action: 'closeModal' }, // 세번째 게임은 플레이어가 직접 포탈을 찾아야 함.
              { answer: '아니', action: 'closeModal' }
            ]
          }
        ]
      }
    }
  },
}

export const escapeEndingPizzaCutterLines: pizzaCutterEndingLineProp = {
  0: {
    "해체": {
      "평범": {
        "친근한": [
          { line: '넌 이국가의 시민이 될 자격이 있다' },
          { line: '이 국가의 시민들이 누리는 모든 권리를 누릴 수 있다는 증표로 시민권을 주겠다.' },
          { 
            line: '가장 영광스러운 것은, 너도 이제 피자의 재료가 되어 공동체에 기여할 수 있다는 것이다. 시민권에 너의 희생 날짜가 프린트되어 있을 거야.',
            options: [
              { answer: '감사합니다.', action: 'goToCitizenShip'},
              { answer: '싫어, 난 음식이 아니야! 구워지고 싶지 않아!', action: 'escape'}
            ]
          }
        ]
      }
    }
  },
  1: {
    "해체": {
      "평범": {
        "친근한": [
          { line: '뭐? 넌 이미 우리 시민이야. 이미 피자 재료라고.'},
          { line: '비상!! 피자 재료가 도주를 시도한다. 잡아라!!!'},
        ]
      }
    }
  }
}