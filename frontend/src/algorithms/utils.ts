import { Node, NodeType } from '../types';

// Get all valid neighbors of a node
export const getNeighbors = (
    node: Node,
    grid: Node[][],
    allowDiagonal: boolean = false
): Node[] => {
    const neighbors: Node[] = [];
    const { row, col } = node;
    const rows = grid.length;
    const cols = grid[0].length;

    // 4-directional neighbors (up, down, left, right)
    const directions = [
        [-1, 0], // up
        [1, 0],  // down
        [0, -1], // left
        [0, 1],  // right
    ];

    // Add diagonal neighbors if allowed
    if (allowDiagonal) {
        directions.push(
            [-1, -1], // up-left
            [-1, 1],  // up-right
            [1, -1],  // down-left
            [1, 1]    // down-right
        );
    }

    for (const [dRow, dCol] of directions) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols) {
            const neighbor = grid[newRow][newCol];
            if (neighbor.type !== NodeType.WALL) {
                neighbors.push(neighbor);
            }
        }
    }

    return neighbors;
};

// Reconstruct path from end to start
export const reconstructPath = (endNode: Node): Node[] => {
    const path: Node[] = [];
    let current: Node | null = endNode;

    while (current !== null) {
        path.unshift(current);
        current = current.parent;
    }

    return path;
};

// Manhattan distance heuristic
export const manhattanDistance = (nodeA: Node, nodeB: Node): number => {
    return Math.abs(nodeA.row - nodeB.row) + Math.abs(nodeA.col - nodeB.col);
};

// Euclidean distance heuristic
export const euclideanDistance = (nodeA: Node, nodeB: Node): number => {
    return Math.sqrt(
        Math.pow(nodeA.row - nodeB.row, 2) + Math.pow(nodeA.col - nodeB.col, 2)
    );
};

// Chebyshev distance heuristic (for diagonal movement)
export const chebyshevDistance = (nodeA: Node, nodeB: Node): number => {
    return Math.max(
        Math.abs(nodeA.row - nodeB.row),
        Math.abs(nodeA.col - nodeB.col)
    );
};

// Get heuristic function by name
export const getHeuristic = (
    name: 'manhattan' | 'euclidean' | 'chebyshev'
): ((a: Node, b: Node) => number) => {
    switch (name) {
        case 'manhattan':
            return manhattanDistance;
        case 'euclidean':
            return euclideanDistance;
        case 'chebyshev':
            return chebyshevDistance;
        default:
            return manhattanDistance;
    }
};

// Deep clone grid for algorithm use
export const cloneGrid = (grid: Node[][]): Node[][] => {
    return grid.map((row) =>
        row.map((node) => ({
            ...node,
            parent: null,
            isVisited: false,
            isPath: false,
            distance: Infinity,
            gScore: Infinity,
            fScore: Infinity,
            heuristic: 0,
        }))
    );
};

// Find start and end nodes in grid
export const findStartAndEnd = (
    grid: Node[][]
): { start: Node | null; end: Node | null } => {
    let start: Node | null = null;
    let end: Node | null = null;

    for (const row of grid) {
        for (const node of row) {
            if (node.type === NodeType.START) {
                start = node;
            } else if (node.type === NodeType.END) {
                end = node;
            }
        }
    }

    return { start, end };
};
