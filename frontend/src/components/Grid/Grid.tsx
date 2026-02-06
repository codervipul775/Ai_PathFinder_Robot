import { useEffect, useCallback, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGridStore } from '../../store/gridStore';
import { NodeType, TerrainType, SPEED_VALUES } from '../../types';
import { runAlgorithm } from '../../algorithms';

const Grid = () => {
    const {
        grid,
        rows,
        cols,
        currentTool,
        selectedAlgorithm,
        speed,
        heuristic,
        isRunning,
        startNode,
        endNode,
        initializeGrid,
        setNodeType,
        setIsRunning,
        setIsFinished,
        setStats,
        updateNode,
        clearPath,
    } = useGridStore();

    const [isMouseDown, setIsMouseDown] = useState(false);
    const [robotPosition, setRobotPosition] = useState<{ row: number; col: number } | null>(null);
    const gridRef = useRef<HTMLDivElement>(null);

    // Initialize grid with responsive dimensions
    useEffect(() => {
        const handleResize = () => {
            if (isRunning) return; // Don't re-init while running

            const isMobile = window.innerWidth <= 768;
            const newRows = isMobile ? 20 : 25;
            const newCols = isMobile ? 20 : 50;

            // Re-init if dimensions changed OR if grid is empty
            if (newRows !== rows || newCols !== cols || grid.length === 0) {
                initializeGrid(newRows, newCols);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [initializeGrid, rows, cols, isRunning, grid.length]);

    // Handle cell click/drag
    const handleCellInteraction = useCallback(
        (row: number, col: number) => {
            if (isRunning) return;

            const currentNode = grid[row]?.[col];
            if (!currentNode) return;

            // Don't modify start or end with wall tool
            if (currentNode.type === NodeType.START || currentNode.type === NodeType.END) {
                if (currentTool === 'wall' || currentTool === 'weight' || currentTool === 'eraser') {
                    return;
                }
            }

            switch (currentTool) {
                case 'wall':
                    setNodeType(row, col, NodeType.WALL);
                    break;
                case 'start':
                    setNodeType(row, col, NodeType.START);
                    break;
                case 'end':
                    setNodeType(row, col, NodeType.END);
                    break;
                case 'weight':
                    setNodeType(row, col, NodeType.WEIGHT, TerrainType.WATER);
                    break;
                case 'eraser':
                    setNodeType(row, col, NodeType.EMPTY, TerrainType.NORMAL);
                    break;
            }
        },
        [currentTool, isRunning, grid, setNodeType]
    );

    // Visualize algorithm
    const visualize = useCallback(async () => {
        if (!startNode || !endNode) return;

        clearPath();
        setIsRunning(true);
        setIsFinished(false);
        setRobotPosition(null);

        const startTime = performance.now();
        const result = runAlgorithm(selectedAlgorithm, grid, heuristic);
        const endTime = performance.now();

        const { visitedNodesInOrder, shortestPath, success } = result;
        const delay = SPEED_VALUES[speed];

        // Animate visited nodes
        for (let i = 0; i < visitedNodesInOrder.length; i++) {
            const node = visitedNodesInOrder[i];
            if (node.type !== NodeType.START && node.type !== NodeType.END) {
                if (delay > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delay));
                }
                updateNode(node.row, node.col, { type: NodeType.VISITED });
            }
        }

        // Animate path
        if (success) {
            for (let i = 0; i < shortestPath.length; i++) {
                const node = shortestPath[i];
                if (node.type !== NodeType.START && node.type !== NodeType.END) {
                    if (delay > 0) {
                        await new Promise((resolve) => setTimeout(resolve, delay * 2));
                    }
                    updateNode(node.row, node.col, { type: NodeType.PATH });
                }
            }

            // Animate robot along path
            for (const node of shortestPath) {
                if (delay > 0) {
                    await new Promise((resolve) => setTimeout(resolve, delay * 3));
                }
                setRobotPosition({ row: node.row, col: node.col });
            }

            // Show success toast
            if (window.showToast) {
                window.showToast(`✅ Path found! Length: ${shortestPath.length} nodes`, 'success');
            }
        } else {
            // Show error toast when no path found
            if (window.showToast) {
                window.showToast('❌ No path found! The destination is blocked by walls.', 'error');
            }
        }

        // Calculate path cost
        let pathCost = 0;
        for (const node of shortestPath) {
            pathCost += node.terrain || 1;
        }

        setStats({
            algorithm: selectedAlgorithm.toUpperCase(),
            nodesVisited: visitedNodesInOrder.length,
            pathLength: shortestPath.length,
            executionTime: Math.round(endTime - startTime),
            pathCost,
        });

        setIsRunning(false);
        setIsFinished(true);
    }, [
        startNode,
        endNode,
        grid,
        selectedAlgorithm,
        speed,
        heuristic,
        clearPath,
        setIsRunning,
        setIsFinished,
        setStats,
        updateNode,
    ]);

    // Expose visualize function
    useEffect(() => {
        // @ts-ignore
        window.visualize = visualize;
    }, [visualize]);

    const getCellClass = (node: typeof grid[0][0]) => {
        let className = 'cell';

        switch (node.type) {
            case NodeType.WALL:
                className += ' wall';
                break;
            case NodeType.START:
                className += ' start';
                break;
            case NodeType.END:
                className += ' end';
                break;
            case NodeType.VISITED:
                className += ' visited';
                break;
            case NodeType.PATH:
                className += ' path';
                break;
            case NodeType.CURRENT:
                className += ' current';
                break;
            case NodeType.WEIGHT:
                if (node.terrain === TerrainType.GRASS) className += ' weight-1';
                else if (node.terrain === TerrainType.WATER) className += ' weight-2';
                else if (node.terrain === TerrainType.MOUNTAIN) className += ' weight-3';
                break;
        }

        return className;
    };

    if (grid.length === 0) return null;

    return (
        <div className="grid-container">
            <div className="grid-viewport">
                <div className="grid-wrapper">
                    <div
                        ref={gridRef}
                        className="grid"
                        style={{
                            gridTemplateColumns: `repeat(${cols}, 24px)`,
                            gridTemplateRows: `repeat(${rows}, 24px)`,
                        }}
                        onMouseLeave={() => setIsMouseDown(false)}
                    >
                        {grid.map((row, rowIdx) =>
                            row.map((node, colIdx) => (
                                <motion.div
                                    key={`${rowIdx}-${colIdx}`}
                                    className={getCellClass(node)}
                                    onMouseDown={() => {
                                        setIsMouseDown(true);
                                        handleCellInteraction(rowIdx, colIdx);
                                    }}
                                    onMouseUp={() => setIsMouseDown(false)}
                                    onMouseEnter={() => {
                                        if (isMouseDown && currentTool !== 'start' && currentTool !== 'end') {
                                            handleCellInteraction(rowIdx, colIdx);
                                        }
                                    }}
                                    initial={false}
                                    whileHover={{ scale: 1.1 }}
                                />
                            ))
                        )}

                        {/* 3D-look Robot Icon */}
                        <AnimatePresence>
                            {robotPosition && (
                                <motion.div
                                    className="robot"
                                    initial={{ scale: 0, rotate: -45 }}
                                    animate={{
                                        scale: 1,
                                        rotate: 0,
                                        left: robotPosition.col * 24 + 3,
                                        top: robotPosition.row * 24 + 3,
                                    }}
                                    transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                                    style={{
                                        position: 'absolute',
                                        width: 18,
                                        height: 18,
                                    }}
                                >
                                    <div className="robot-3d-body">
                                        <div className="robot-head"></div>
                                        <div className="robot-eye"></div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* Legend - Outside viewport to allow wrapping to screen width */}
            <div className="legend">
                <div className="legend-item">
                    <div className="legend-color start"></div>
                    <span>Start</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color end"></div>
                    <span>End</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color wall"></div>
                    <span>Wall</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color visited"></div>
                    <span>Visited</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color path"></div>
                    <span>Path</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color grass"></div>
                    <span>Grass (2)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color water"></div>
                    <span>Water (5)</span>
                </div>
                <div className="legend-item">
                    <div className="legend-color mountain"></div>
                    <span>Mountain (10)</span>
                </div>
            </div>
        </div>
    );
};

export default Grid;
