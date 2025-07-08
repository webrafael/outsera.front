export interface IntervalWin {
  min: IntervalWinProducer[];
  max: IntervalWinProducer[];
}

export interface IntervalWinProducer {
  producer: string;
  interval: number;
  previousWin: number;
  followingWin: number;
}

export interface IntervalWinParams {
  projection: 'max-min-win-interval-for-producers';
}
