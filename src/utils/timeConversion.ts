export function unixTimeToDate(unixTime: number): Date {
  return new Date(unixTime * 1000);
}

export function unixTimeToDateString(unixTime: number): string {
  return unixTimeToDate(unixTime).toLocaleDateString();
}
