export function reduce(dots: number, maxCount: number): number[] {
  if (dots <= maxCount) {
    const res = [];
    for (let i = 1; i <= dots; i++) res.push(i);
    return res;
  }
  const blockSize = dots / maxCount;
  const reduced = [];
  for (let i = 0; i < dots;) {
    reduced.push(average(i, (i += blockSize)));
  }
  return reduced;
}

export function average(start, end): number {
  return Math.round((start + end) / 2);
}
