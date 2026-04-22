export function equalSplit(totalCents: number, participantCount: number): number[] {
  if (participantCount <= 0) return [];
  const base = Math.floor(totalCents / participantCount);
  const remainder = totalCents % participantCount;
  const shares: number[] = [];
  for (let i = 0; i < participantCount; i++) {
    shares.push(i < remainder ? base + 1 : base);
  }
  return shares;
}
