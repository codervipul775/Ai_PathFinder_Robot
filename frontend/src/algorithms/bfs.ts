import { Node, AlgorithmResult, NodeType } from '../types';
import { getNeighbors, reconstructPath, cloneGrid, findStartAndEnd } from './utils';

/**
 * Breadth-First Search (BFS) Algorithm
 * 
 * Explores all neighbors at current depth before moving to nodes at next depth.
 * Guarantees shortest path in unweighted graphs.
 * 
 * Time Complexity: O(V + E) where V = vertices, E = edges
 * Space Complexity: O(V)
 */
export const bfs = (grid: Node[][]): AlgorithmResult => {
    const clonedGrid = cloneGrid(grid);
    const { start, end } = findStartAndEnd(clonedGrid);

    if (!start || !end) {
        return { visitedNodesInOrder: [], shortestPath: [], success: false };
    }

    const visitedNodesInOrder: Node[] = [];
    const queue: Node[] = [clonedGrid[start.row][start.col]];
    const startNode = clonedGrid[start.row][start.col];
    startNode.distance = 0;
    startNode.isVisited = true;

    while (queue.length > 0) {
        const currentNode = queue.shift()!;
        visitedNodesInOrder.push(currentNode);

        // Found the end
        if (currentNode.type === NodeType.END) {
            return {
                visitedNodesInOrder,
                shortestPath: reconstructPath(currentNode),
                success: true,
            };
        }

        // Explore neighbors
        const neighbors = getNeighbors(currentNode, clonedGrid);
        for (const neighbor of neighbors) {
            if (!neighbor.isVisited) {
                neighbor.isVisited = true;
                neighbor.distance = currentNode.distance + 1;
                neighbor.parent = currentNode;
                queue.push(neighbor);
            }
        }
    }

    // No path found
    return { visitedNodesInOrder, shortestPath: [], success: false };
};
