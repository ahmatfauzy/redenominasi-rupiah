/**
 * Rounding utilities for redenomination calculations
 */

export function floorValue(value: number, decimalPlaces: number): number {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.floor(value * multiplier) / multiplier;
}

export function ceilValue(value: number, decimalPlaces: number): number {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.ceil(value * multiplier) / multiplier;
}

export function roundValue(value: number, decimalPlaces: number): number {
  const multiplier = Math.pow(10, decimalPlaces);
  return Math.round(value * multiplier) / multiplier;
}

export function applyRounding(
  value: number,
  mode: "floor" | "ceil" | "round",
  decimalPlaces: number
): number {
  switch (mode) {
    case "floor":
      return floorValue(value, decimalPlaces);
    case "ceil":
      return ceilValue(value, decimalPlaces);
    case "round":
    default:
      return roundValue(value, decimalPlaces);
  }
}
