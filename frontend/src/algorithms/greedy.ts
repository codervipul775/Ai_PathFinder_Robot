import { Node, AlgorithmResult, NodeType, HeuristicType } from '../types';
import { getNeighbors, reconstructPath, cloneGrid, findStartAndEnd, getHeuristic } from './utils';

/**
 * Greedy Best-First Search Algorithm
 * 
 * Always expands the node that appears to be closest to the goal.
 * Uses only the heuristic (h) value, ignoring path cost (g).
 * Very fast but does NOT guarantee shortest path.
 * 
 * Time Complexity: O(E) in best case
 * Space Complexity: O(V)
 */

class GreedyPriorityQueue {
    private items: Node[] = [];

    enqueue(node: Node): void {
        this.items.push(node);
        this.items.sort((a, b) => a.heuristic - b.heuristic);
    }

    dequeue(): Node | undefined {
        return this.items.shift();
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

export const greedy = (
    grid: Node[][],
    heuristicType: HeuristicType = 'manhattan'
): AlgorithmResult => {
    const clonedGrid = cloneGrid(grid);
    const { start, end } = findStartAndEnd(clonedGrid);

    if (!start || !end) {
        return { visitedNodesInOrder: [], shortestPath: [], success: false };
    }

    const endNode = clonedGrid[end.row][end.col];
    const heuristic = getHeuristic(heuristicType);
    const visitedNodesInOrder: Node[] = [];
    const openSet = new GreedyPriorityQueue();

    const startNode = clonedGrid[start.row][start.col];
    startNode.heuristic = heuristic(startNode, endNode);
    openSet.enqueue(startNode);

    while (!openSet.isEmpty()) {
        const currentNode = openSet.dequeue()!;

        // Skip if already visited
        if (currentNode.isVisited) continue;

        currentNode.isVisited = true;
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
                neighbor.parent = currentNode;
                neighbor.heuristic = heuristic(neighbor, endNode);
                openSet.enqueue(neighbor);
            }
        }
    }

    // No path found
    return { visitedNodesInOrder, shortestPath: [], success: false };
};
