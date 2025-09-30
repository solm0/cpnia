export interface coinStairProp {
  top: [number,number,number];
  bottom: [number, number, number];
  count: number;
}
export const coinStairs: coinStairProp[] = [
  {
    top: [50,-100,50],
    bottom: [-100,-130,50],
    count: 10,
  },
  {
    top: [-20,0,0],
    bottom: [50,-107,40],
    count: 10,
  },
]