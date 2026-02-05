import { Node, AlgorithmResult, NodeType } from '../types';
import { getNeighbors, reconstructPath, cloneGrid, findStartAndEnd } from './utils';

/**
 * Dijkstra's Algorithm
 * 
 * Finds shortest path in weighted graphs by exploring nodes in order of distance.
 * Considers terrain weights for path cost calculation.
 * 
 * Time Complexity: O((V + E) log V) with priority queue
 * Space Complexity: O(V)
 */

// Simple priority queue implementation
class PriorityQueue {
    private items: { node: Node; priority: number }[] = [];

    enqueue(node: Node, priority: number): void {
        this.items.push({ node, priority });
        this.items.sort((a, b) => a.priority - b.priority);
    }

    dequeue(): Node | undefined {
        return this.items.shift()?.node;
    }

    isEmpty(): boolean {
        return this.items.length === 0;
    }
}

export const dijkstra = (grid: Node[][]): AlgorithmResult => {
    const clonedGrid = cloneGrid(grid);
    const { start, end } = findStartAndEnd(clonedGrid);

    if (!start || !end) {
        return { visitedNodesInOrder: [], shortestPath: [], success: false };
    }

    const visitedNodesInOrder: Node[] = [];
    const pq = new PriorityQueue();

    const startNode = clonedGrid[start.row][start.col];
    startNode.distance = 0;
    pq.enqueue(startNode, 0);

    while (!pq.isEmpty()) {
        const currentNode = pq.dequeue()!;

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
                // Calculate new distance with terrain weight
                const weight = neighbor.terrain;
                const newDistance = currentNode.distance + weight;

                if (newDistance < neighbor.distance) {
                    neighbor.distance = newDistance;
                    neighbor.parent = currentNode;
                    pq.enqueue(neighbor, newDistance);
                }
            }
        }
    }

    // No path found
    return { visitedNodesInOrder, shortestPath: [], success: false };
};
