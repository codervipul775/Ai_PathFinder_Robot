import { Node, AlgorithmResult, NodeType } from '../types';
import { getNeighbors, reconstructPath, cloneGrid, findStartAndEnd } from './utils';

/**
 * Depth-First Search (DFS) Algorithm
 * 
 * Explores as far as possible along each branch before backtracking.
 * Does NOT guarantee shortest path.
 * 
 * Time Complexity: O(V + E)
 * Space Complexity: O(V)
 */
export const dfs = (grid: Node[][]): AlgorithmResult => {
    const clonedGrid = cloneGrid(grid);
    const { start, end } = findStartAndEnd(clonedGrid);

    if (!start || !end) {
        return { visitedNodesInOrder: [], shortestPath: [], success: false };
    }

    const visitedNodesInOrder: Node[] = [];
    const stack: Node[] = [clonedGrid[start.row][start.col]];
    const startNode = clonedGrid[start.row][start.col];
    startNode.isVisited = true;

    while (stack.length > 0) {
        const currentNode = stack.pop()!;
        visitedNodesInOrder.push(currentNode);

        // Found the end
        if (currentNode.type === NodeType.END) {
            return {
                visitedNodesInOrder,
                shortestPath: reconstructPath(currentNode),
                success: true,
            };
        }

        // Explore neighbors (in reverse order for consistent left-to-right exploration)
        const neighbors = getNeighbors(currentNode, clonedGrid).reverse();
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.isVisited = true;
                neighbor.parent = currentNode;
                stack.push(neighbor);
            }
        }
    }

    // No path found
    return { visitedNodesInOrder, shortestPath: [], success: false };
};
