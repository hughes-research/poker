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

/**
 * Converts 3D isometric coordinates back to 2D grid coordinates.
 * @param x - X coordinate in 3D space
 * @param z - Z coordinate in 3D space
 * @param spacing - Spacing between cards (must match spacing used in gridToIsometric)
 * @returns Grid coordinates { col, row }
 */
export function isometricToGrid(
  x: number,
  z: number,
  spacing: number = 1
): { col: number; row: number } {
  const col = (x / spacing + z / (spacing * 0.5)) / 2;
  const row = (z / (spacing * 0.5) - x / spacing) / 2;
  
  return { col: Math.round(col), row: Math.round(row) };
}

