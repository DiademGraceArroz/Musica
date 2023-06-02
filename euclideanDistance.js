export function euclideanDistance(point1, point2) {
  let sumSquaredDistances = 0;
  for (let i = 0; i < point1.length; i++) {
    sumSquaredDistances += Math.pow(point1[i] - point2[i], 2);
  }
  return Math.sqrt(sumSquaredDistances);
}
