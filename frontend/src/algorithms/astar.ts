import { Node, AlgorithmResult, NodeType, HeuristicType } from '../types';
import { getNeighbors, reconstructPath, cloneGrid, findStartAndEnd, getHeuristic } from './utils';

/**
 * A* Search Algorithm
 * 
 * Uses heuristics to guide search towards the goal.
 * Combines actual cost (g) and heuristic estimate (h) into f = g + h.
 * Faster than Dijkstra while remaining optimal (with admissible heuristic).
 * 
 * Time Complexity: O(E) in best case, O(V²) in worst case
 * Space Complexity: O(V)
 */

// Priority queue with f-score ordering
class AStarPriorityQueue {
    private items: Node[] = [];

    enqueue(node: Node): void {
        this.items.push(node);
        this.items.sort((a, b) => {
            // Primary: sort by fScore
            if (a.fScore !== b.fScore) return a.fScore - b.fScore;
            // Tie-breaker: prefer lower heuristic (closer to goal)
            return a.heuristic - b.heuristic;
        });
    }

    dequeue(): Node | undefined {
        return this.items.shift();
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }

    contains(node: Node): boolean {
        return this.items.some(n => n.row === node.row && n.col === node.col);
    }
}

export const astar = (
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
    const openSet = new AStarPriorityQueue();
    const closedSet = new Set<string>();

    const startNode = clonedGrid[start.row][start.col];
    startNode.gScore = 0;
    startNode.heuristic = heuristic(startNode, endNode);
    startNode.fScore = startNode.heuristic;
    openSet.enqueue(startNode);

    while (!openSet.isEmpty()) {
        const currentNode = openSet.dequeue()!;
        const nodeKey = `${currentNode.row}-${currentNode.col}`;

        // Skip if already in closed set
        if (closedSet.has(nodeKey)) continue;

        closedSet.add(nodeKey);
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
            const neighborKey = `${neighbor.row}-${neighbor.col}`;

            if (closedSet.has(neighborKey)) continue;

            // Calculate g-score with terrain weight
            const weight = neighbor.terrain;
            const tentativeGScore = currentNode.gScore + weight;

            if (tentativeGScore < neighbor.gScore) {
                neighbor.parent = currentNode;
                neighbor.gScore = tentativeGScore;
                neighbor.heuristic = heuristic(neighbor, endNode);
                neighbor.fScore = neighbor.gScore + neighbor.heuristic;

                if (!openSet.contains(neighbor)) {
                    openSet.enqueue(neighbor);
                }
            }
        }
    }

    // No path found
    return { visitedNodesInOrder, shortestPath: [], success: false };
};
