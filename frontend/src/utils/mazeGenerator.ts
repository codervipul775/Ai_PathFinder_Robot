/**
 * Maze Generation Algorithms
 * 
 * Generates challenging but solvable mazes for the pathfinding robot.
 */

// Helper to check if position is start or end
const isStartOrEnd = (
    row: number,
    col: number,
    startPos: { row: number; col: number },
    endPos: { row: number; col: number }
): boolean => {
    return (row === startPos.row && col === startPos.col) ||
        (row === endPos.row && col === endPos.col);
};

// Helper to check if position is near start or end (keep a buffer)
const isNearStartOrEnd = (
    row: number,
    col: number,
    startPos: { row: number; col: number },
    endPos: { row: number; col: number },
    buffer: number = 2
): boolean => {
    const nearStart = Math.abs(row - startPos.row) <= buffer && Math.abs(col - startPos.col) <= buffer;
    const nearEnd = Math.abs(row - endPos.row) <= buffer && Math.abs(col - endPos.col) <= buffer;
    return nearStart || nearEnd;
};

// Simple Maze with guaranteed path - creates vertical walls with gaps
export const recursiveDivisionMaze = (
    rows: number,
    cols: number,
    startPos: { row: number; col: number },
    endPos: { row: number; col: number }
): { row: number; col: number }[] => {
    const walls: { row: number; col: number }[] = [];

    // Create vertical walls with gaps at different heights
    const numWalls = Math.floor(cols / 6);

    for (let i = 1; i <= numWalls; i++) {
        const wallCol = Math.floor((i * cols) / (numWalls + 1));

        // Alternate gap position to create a snake-like path
        const gapStart = i % 2 === 0 ? 2 : Math.floor(rows / 2);

        for (let row = 1; row < rows - 1; row++) {
            // Skip if in the gap area
            if (row >= gapStart && row <= gapStart + 4) continue;

            // Skip if near start or end
            if (isNearStartOrEnd(row, wallCol, startPos, endPos, 2)) continue;

            walls.push({ row, col: wallCol });
        }
    }

    // Add some horizontal connectors for complexity
    for (let i = 0; i < 3; i++) {
        const wallRow = Math.floor((i + 1) * rows / 4);
        const startCol = Math.floor(Math.random() * (cols / 3)) + 2;
        const length = Math.floor(cols / 4);

        for (let col = startCol; col < startCol + length && col < cols - 2; col++) {
            if (!isNearStartOrEnd(wallRow, col, startPos, endPos, 2)) {
                walls.push({ row: wallRow, col });
            }
        }
    }

    return walls;
};

// Random Maze Generation with lower density
export const randomMaze = (
    rows: number,
    cols: number,
    density: number = 0.25,
    startPos: { row: number; col: number },
    endPos: { row: number; col: number }
): { row: number; col: number }[] => {
    const walls: { row: number; col: number }[] = [];

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            // Skip near start and end
            if (isNearStartOrEnd(row, col, startPos, endPos, 3)) continue;

            if (Math.random() < density) {
                walls.push({ row, col });
            }
        }
    }

    return walls;
};

// Stair Pattern (for demonstrating A* vs others)
export const stairPattern = (
    rows: number,
    cols: number,
    startPos: { row: number; col: number },
    endPos: { row: number; col: number }
): { row: number; col: number }[] => {
    const walls: { row: number; col: number }[] = [];

    // Create diagonal barriers
    for (let i = 0; i < 4; i++) {
        const startRow = 3 + i * 5;
        const startCol = 5 + i * 8;

        for (let j = 0; j < rows - 6; j++) {
            const row = startRow + j;
            const col = startCol;

            if (row >= 0 && row < rows && col >= 0 && col < cols) {
                if (!isNearStartOrEnd(row, col, startPos, endPos, 2)) {
                    walls.push({ row, col });
                }
            }
        }
    }

    return walls;
};

// Weighted terrain generator
export const generateWeightedTerrain = (
    rows: number,
    cols: number,
    startPos: { row: number; col: number },
    endPos: { row: number; col: number }
): { row: number; col: number; weight: number }[] => {
    const weights: { row: number; col: number; weight: number }[] = [];

    // Create clusters of weighted terrain
    const numClusters = Math.floor((rows * cols) / 150);

    for (let i = 0; i < numClusters; i++) {
        const centerRow = Math.floor(Math.random() * rows);
        const centerCol = Math.floor(Math.random() * cols);
        const radius = Math.floor(Math.random() * 4) + 2;
        const weight = [2, 5, 10][Math.floor(Math.random() * 3)];

        for (let row = centerRow - radius; row <= centerRow + radius; row++) {
            for (let col = centerCol - radius; col <= centerCol + radius; col++) {
                if (row >= 0 && row < rows && col >= 0 && col < cols) {
                    const distance = Math.sqrt(Math.pow(row - centerRow, 2) + Math.pow(col - centerCol, 2));
                    if (distance <= radius && !isStartOrEnd(row, col, startPos, endPos)) {
                        weights.push({ row, col, weight });
                    }
                }
            }
        }
    }

    return weights;
};
