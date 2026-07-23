export function tokenCost(intervention: string, insurance: string): number {
  if (intervention === "reparation" || intervention === "vitre") return 1;
  return insurance === "avec" ? 3 : 2;
}
