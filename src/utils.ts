export function reduce(dots: number, maxCount: number): number[] {
  if (dots <= maxCount) {
    const res = [];
    for (let i = 1; i <= dots; i++) res.push(i);
    return res;
  }
  const blockSize = dots / (maxCount - 2);
  const reduced = [1];
  reduced.push(average(1, blockSize));
  for (let i = blockSize, len = dots - blockSize; i < len;) {
    reduced.push(average(i, (i += blockSize)));
  }
  reduced.push(average(dots - blockSize, dots));
  reduced.push(dots);
  return reduced;
}

export function average(start, end): number {
  return Math.round((start + end) / 2);
}
