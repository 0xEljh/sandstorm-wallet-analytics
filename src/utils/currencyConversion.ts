export function lampToSol(lamports: number): number {
  return lamports / 1000000000;
}

export function solToLamp(sol: number): number {
  return sol * 1000000000;
}
