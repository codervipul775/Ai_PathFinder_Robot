export { bfs } from './bfs';
export { dfs } from './dfs';
export { dijkstra } from './dijkstra';
export { astar } from './astar';
export { greedy } from './greedy';
export * from './utils';

import { Node, AlgorithmType, AlgorithmResult, HeuristicType } from '../types';
import { bfs } from './bfs';
import { dfs } from './dfs';
import { dijkstra } from './dijkstra';
import { astar } from './astar';
import { greedy } from './greedy';

// Run algorithm by name
export const runAlgorithm = (
    algorithmType: AlgorithmType,
    grid: Node[][],
    heuristic: HeuristicType = 'manhattan'
): AlgorithmResult => {
    switch (algorithmType) {
        case 'bfs':
            return bfs(grid);
        case 'dfs':
            return dfs(grid);
        case 'dijkstra':
            return dijkstra(grid);
        case 'astar':
            return astar(grid, heuristic);
        case 'greedy':
            return greedy(grid, heuristic);
        default:
            return bfs(grid);
    }
};
