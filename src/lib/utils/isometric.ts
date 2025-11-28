/**
 * Converts 2D grid coordinates to 3D isometric coordinates.
 * @param col - Column index (x-axis in grid)
 * @param row - Row index (z-axis in grid)
 * @param spacing - Spacing between cards
 * @returns 3D coordinates { x, y, z }
 */
export function gridToIsometric(
  col: number,
  row: number,
  spacing: number = 1
): { x: number; y: number; z: number } {
  const x = (col - row) * spacing;
  const z = (col + row) * spacing * 0.5;
  const y = 0; // Can be used for elevation/stacking
  
  return { x, y, z };
}



