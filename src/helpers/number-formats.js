export function getPointsLabel(points) {
  const lastChar = points.toString().slice(-1);

  if (lastChar === '1' && points !== 11) {
    return `${points} taškas`;
  } else if (points > 0 && points < 10) {
    return `${points} taškai`;
  } else {
    return `${points} taškų`;
  }
}
