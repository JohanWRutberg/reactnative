export function formatISO(timestamp: number): string {
  const ISO = new Date(timestamp * 1000).toISOString();
  return `${ISO.split("T")[0]} ${ISO.split("T")[1].split(".")[0]}`;
}
