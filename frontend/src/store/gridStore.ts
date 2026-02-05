import { create } from 'zustand';
import { Node, NodeType, TerrainType, AlgorithmType, SpeedType, ToolType, Stats, HeuristicType } from '../types';

interface GridState {
    // Grid data
    grid: Node[][];
    rows: number;
    cols: number;

    // Start and end positions
    startNode: { row: number; col: number } | null;
    endNode: { row: number; col: number } | null;

    // Current tool selected
    currentTool: ToolType;

    // Algorithm settings
    selectedAlgorithm: AlgorithmType;
    speed: SpeedType;
    heuristic: HeuristicType;

    // Visualization state
    isRunning: boolean;
    isFinished: boolean;
    isPaused: boolean;

    // Stats
    stats: Stats | null;

    // Actions
    initializeGrid: (rows: number, cols: number) => void;
    resetGrid: () => void;
    clearPath: () => void;
    clearWalls: () => void;
    setNodeType: (row: number, col: number, type: NodeType, terrain?: TerrainType) => void;
    setCurrentTool: (tool: ToolType) => void;
    setSelectedAlgorithm: (algorithm: AlgorithmType) => void;
    setSpeed: (speed: SpeedType) => void;
    setHeuristic: (heuristic: HeuristicType) => void;
    setIsRunning: (isRunning: boolean) => void;
    setIsFinished: (isFinished: boolean) => void;
    setIsPaused: (isPaused: boolean) => void;
    setStats: (stats: Stats | null) => void;
    updateNode: (row: number, col: number, updates: Partial<Node>) => void;
    setStartNode: (row: number, col: number) => void;
    setEndNode: (row: number, col: number) => void;
    getNode: (row: number, col: number) => Node | null;
}

const createNode = (row: number, col: number): Node => ({
    row,
    col,
    type: NodeType.EMPTY,
    terrain: TerrainType.NORMAL,
    distance: Infinity,
    heuristic: 0,
    fScore: Infinity,
    gScore: Infinity,
    parent: null,
    isVisited: false,
    isPath: false,
});

const createInitialGrid = (rows: number, cols: number): Node[][] => {
    const grid: Node[][] = [];
    for (let row = 0; row < rows; row++) {
        const currentRow: Node[] = [];
        for (let col = 0; col < cols; col++) {
            currentRow.push(createNode(row, col));
        }
        grid.push(currentRow);
    }
    return grid;
};

export const useGridStore = create<GridState>((set, get) => ({
    // Initial state
    grid: [],
    rows: 25,
    cols: 50,
    startNode: null,
    endNode: null,
    currentTool: 'wall',
    selectedAlgorithm: 'astar',
    speed: 'medium',
    heuristic: 'manhattan',
    isRunning: false,
    isFinished: false,
    isPaused: false,
    stats: null,

    // Initialize grid
    initializeGrid: (rows, cols) => {
        const grid = createInitialGrid(rows, cols);
        // Set default start and end positions
        const startRow = Math.floor(rows / 2);
        const startCol = Math.floor(cols / 4);
        const endRow = Math.floor(rows / 2);
        const endCol = Math.floor((3 * cols) / 4);

        grid[startRow][startCol].type = NodeType.START;
        grid[endRow][endCol].type = NodeType.END;

        set({
            grid,
            rows,
            cols,
            startNode: { row: startRow, col: startCol },
            endNode: { row: endRow, col: endCol },
            isFinished: false,
            stats: null,
        });
    },

    // Reset entire grid
    resetGrid: () => {
        const { rows, cols } = get();
        get().initializeGrid(rows, cols);
    },

    // Clear only visited and path nodes
    clearPath: () => {
        set((state) => ({
            grid: state.grid.map((row) =>
                row.map((node) => ({
                    ...node,
                    type: node.type === NodeType.VISITED || node.type === NodeType.PATH || node.type === NodeType.CURRENT
                        ? NodeType.EMPTY
                        : node.type,
                    distance: Infinity,
                    heuristic: 0,
                    fScore: Infinity,
                    gScore: Infinity,
                    parent: null,
                    isVisited: false,
                    isPath: false,
                }))
            ),
            isFinished: false,
            stats: null,
        }));
    },

    // Clear only walls
    clearWalls: () => {
        set((state) => ({
            grid: state.grid.map((row) =>
                row.map((node) => ({
                    ...node,
                    type: node.type === NodeType.WALL || node.type === NodeType.WEIGHT ? NodeType.EMPTY : node.type,
                    terrain: TerrainType.NORMAL,
                }))
            ),
        }));
    },

    // Set node type
    setNodeType: (row, col, type, terrain = TerrainType.NORMAL) => {
        const { grid, startNode, endNode } = get();
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) return;

        const currentNode = grid[row][col];

        // Safety: Don't overwrite START/END with anything other than START/END
        if ((currentNode.type === NodeType.START || currentNode.type === NodeType.END) &&
            (type !== NodeType.START && type !== NodeType.END)) {
            return;
        }

        set((state) => {
            const newGrid = state.grid.map((r, rowIdx) =>
                r.map((node, colIdx) => {
                    if (rowIdx === row && colIdx === col) {
                        return { ...node, type, terrain };
                    }
                    return node;
                })
            );

            let newStartNode = startNode;
            let newEndNode = endNode;

            if (type === NodeType.START) {
                // If we're setting a new start, clear the old one (UNLESS it's the same cell)
                if (startNode && (startNode.row !== row || startNode.col !== col)) {
                    newGrid[startNode.row][startNode.col].type = NodeType.EMPTY;
                }
                // If setting start on top of end, clear endNode state
                if (endNode && endNode.row === row && endNode.col === col) {
                    newEndNode = null;
                }
                newStartNode = { row, col };
            } else if (type === NodeType.END) {
                // If we're setting a new end, clear the old one (UNLESS it's the same cell)
                if (endNode && (endNode.row !== row || endNode.col !== col)) {
                    newGrid[endNode.row][endNode.col].type = NodeType.EMPTY;
                }
                // If setting end on top of start, clear startNode state
                if (startNode && startNode.row === row && startNode.col === col) {
                    newStartNode = null;
                }
                newEndNode = { row, col };
            }

            return { grid: newGrid, startNode: newStartNode, endNode: newEndNode };
        });
    },

    // Set current tool
    setCurrentTool: (tool) => set({ currentTool: tool }),

    // Set selected algorithm
    setSelectedAlgorithm: (algorithm) => set({ selectedAlgorithm: algorithm }),

    // Set speed
    setSpeed: (speed) => set({ speed }),

    // Set heuristic
    setHeuristic: (heuristic) => set({ heuristic }),

    // Set running state
    setIsRunning: (isRunning) => set({ isRunning }),

    // Set finished state
    setIsFinished: (isFinished) => set({ isFinished }),

    // Set paused state
    setIsPaused: (isPaused) => set({ isPaused }),

    // Set stats
    setStats: (stats) => set({ stats }),

    // Update single node
    updateNode: (row, col, updates) => {
        set((state) => ({
            grid: state.grid.map((r, rowIdx) =>
                r.map((node, colIdx) => {
                    if (rowIdx === row && colIdx === col) {
                        return { ...node, ...updates };
                    }
                    return node;
                })
            ),
        }));
    },

    // Set start node
    setStartNode: (row, col) => {
        get().setNodeType(row, col, NodeType.START);
    },

    // Set end node
    setEndNode: (row, col) => {
        get().setNodeType(row, col, NodeType.END);
    },

    // Get node at position
    getNode: (row, col) => {
        const { grid } = get();
        if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
            return null;
        }
        return grid[row][col];
    },
}));
