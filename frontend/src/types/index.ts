// Node types for the grid
export enum NodeType {
  EMPTY = 'empty',
  WALL = 'wall',
  START = 'start',
  END = 'end',
  WEIGHT = 'weight',
  VISITED = 'visited',
  PATH = 'path',
  CURRENT = 'current',
}

// Terrain types with different weights
export enum TerrainType {
  NORMAL = 1,
  GRASS = 2,
  WATER = 5,
  MOUNTAIN = 10,
}

// Single node in the grid
export interface Node {
  row: number;
  col: number;
  type: NodeType;
  terrain: TerrainType;
  distance: number;
  heuristic: number;
  fScore: number;
  gScore: number;
  parent: Node | null;
  isVisited: boolean;
  isPath: boolean;
}

// Available algorithms
export type AlgorithmType = 'bfs' | 'dfs' | 'dijkstra' | 'astar' | 'greedy';

// Algorithm result for visualization
export interface AlgorithmResult {
  visitedNodesInOrder: Node[];
  shortestPath: Node[];
  success: boolean;
}

// Algorithm info for display
export interface AlgorithmInfo {
  name: string;
  fullName: string;
  description: string;
  timeComplexity: string;
  spaceComplexity: string;
  weighted: boolean;
  optimal: boolean;
}

// Stats after running algorithm
export interface Stats {
  algorithm: string;
  nodesVisited: number;
  pathLength: number;
  executionTime: number;
  pathCost: number;
}

// Speed settings for visualization
export type SpeedType = 'slow' | 'medium' | 'fast' | 'instant';

export const SPEED_VALUES: Record<SpeedType, number> = {
  slow: 100,
  medium: 30,
  fast: 10,
  instant: 0,
};

// Heuristic types for A* and Greedy
export type HeuristicType = 'manhattan' | 'euclidean' | 'chebyshev';

// Tool types for user interaction
export type ToolType = 'wall' | 'start' | 'end' | 'weight' | 'eraser';

// Grid dimensions
export interface GridDimensions {
  rows: number;
  cols: number;
}

// Algorithm card data
export const ALGORITHM_INFO: Record<AlgorithmType, AlgorithmInfo> = {
  bfs: {
    name: 'BFS',
    fullName: 'Breadth-First Search',
    description: 'Explores all neighbors at current depth before moving deeper. Guarantees shortest path in unweighted graphs.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    weighted: false,
    optimal: true,
  },
  dfs: {
    name: 'DFS',
    fullName: 'Depth-First Search',
    description: 'Explores as far as possible along each branch before backtracking. Does not guarantee shortest path.',
    timeComplexity: 'O(V + E)',
    spaceComplexity: 'O(V)',
    weighted: false,
    optimal: false,
  },
  dijkstra: {
    name: 'Dijkstra',
    fullName: "Dijkstra's Algorithm",
    description: 'Finds shortest path in weighted graphs. Explores nodes in order of their distance from start.',
    timeComplexity: 'O((V + E) log V)',
    spaceComplexity: 'O(V)',
    weighted: true,
    optimal: true,
  },
  astar: {
    name: 'A*',
    fullName: 'A* Search Algorithm',
    description: 'Uses heuristics to guide search towards the goal. Faster than Dijkstra while remaining optimal.',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    weighted: true,
    optimal: true,
  },
  greedy: {
    name: 'Greedy',
    fullName: 'Greedy Best-First Search',
    description: 'Always expands the node closest to the goal. Very fast but does not guarantee shortest path.',
    timeComplexity: 'O(E)',
    spaceComplexity: 'O(V)',
    weighted: false,
    optimal: false,
  },
};
