import {
    RotateCcw,
    Trash2,
    Grid3X3,
    Square,
    Circle,
    Target,
    Weight,
    Eraser,
    Sparkles,
    Zap,
    Box,
    Wind,
    X,
} from 'lucide-react';
import { useGridStore } from '../../store/gridStore';
import {
    AlgorithmType,
    SpeedType,
    ToolType,
    HeuristicType,
} from '../../types';
import {
    recursiveDivisionMaze,
    randomMaze,
    stairPattern,
    generateWeightedTerrain
} from '../../utils/mazeGenerator';
import { NodeType, TerrainType } from '../../types';
import StatsPanel from '../StatsPanel/StatsPanel';

interface ControlPanelProps {
    isOpen?: boolean;
    onClose?: () => void;
}

const ControlPanel = ({ isOpen, onClose }: ControlPanelProps) => {
    const {
        selectedAlgorithm,
        currentTool,
        speed,
        heuristic,
        isRunning,
        startNode,
        endNode,
        rows,
        cols,
        setSelectedAlgorithm,
        setCurrentTool,
        setSpeed,
        setHeuristic,
        resetGrid,
        clearPath,
        clearWalls,
        setNodeType,
    } = useGridStore();

    const algorithms: { type: AlgorithmType; label: string }[] = [
        { type: 'astar', label: 'A*' },
        { type: 'dijkstra', label: 'Dijkstra' },
        { type: 'bfs', label: 'BFS' },
        { type: 'dfs', label: 'DFS' },
        { type: 'greedy', label: 'Greedy' },
    ];

    const tools: { type: ToolType; label: string; icon: React.ReactNode }[] = [
        { type: 'wall', label: 'Wall', icon: <Square size={18} /> },
        { type: 'start', label: 'Start', icon: <Circle size={18} /> },
        { type: 'end', label: 'End', icon: <Target size={18} /> },
        { type: 'weight', label: 'Weight', icon: <Weight size={18} /> },
        { type: 'eraser', label: 'Erase', icon: <Eraser size={18} /> },
    ];

    const speeds: { type: SpeedType; label: string }[] = [
        { type: 'slow', label: 'Slow' },
        { type: 'medium', label: 'Med' },
        { type: 'fast', label: 'Fast' },
        { type: 'instant', label: 'Zap' },
    ];

    const handleVisualize = () => {
        // @ts-ignore
        if (window.visualize) {
            // @ts-ignore
            window.visualize();
        }
    };

    const handleGenerateMaze = (type: 'recursive' | 'random' | 'stair') => {
        if (!startNode || !endNode) return;

        clearPath();
        clearWalls();

        let walls: { row: number; col: number }[] = [];

        switch (type) {
            case 'recursive':
                walls = recursiveDivisionMaze(rows, cols, startNode, endNode);
                break;
            case 'random':
                walls = randomMaze(rows, cols, 0.25, startNode, endNode);
                break;
            case 'stair':
                walls = stairPattern(rows, cols, startNode, endNode);
                break;
        }

        walls.forEach((wall, index) => {
            setTimeout(() => {
                setNodeType(wall.row, wall.col, NodeType.WALL);
            }, index * 2);
        });
    };

    const handleGenerateWeights = () => {
        if (!startNode || !endNode) return;
        const weights = generateWeightedTerrain(rows, cols, startNode, endNode);
        weights.forEach((w, index) => {
            setTimeout(() => {
                const terrain = w.weight === 2 ? TerrainType.GRASS
                    : w.weight === 5 ? TerrainType.WATER
                        : TerrainType.MOUNTAIN;
                setNodeType(w.row, w.col, NodeType.WEIGHT, terrain);
            }, index * 1);
        });
    };

    return (
        <aside className={`sidebar ${isOpen ? 'active' : ''}`}>
            {onClose && (
                <button
                    className="mobile-close-btn"
                    onClick={onClose}
                    aria-label="Close menu"
                >
                    <X size={24} />
                </button>
            )}
            {/* Main Actions Panel */}
            <div className="panel" style={{ border: '1px solid var(--accent-purple)', background: 'rgba(139, 92, 246, 0.05)' }}>
                <button
                    className="btn-primary"
                    onClick={() => {
                        handleVisualize();
                        if (onClose) onClose();
                    }}
                    disabled={isRunning || !startNode || !endNode}
                >
                    <Zap size={20} fill="currentColor" />
                    {isRunning ? 'Visualizing...' : 'Initialize Path'}
                </button>
                <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                    <button className="tool-btn" onClick={clearPath} disabled={isRunning} style={{ height: '44px' }}>
                        <RotateCcw size={16} />
                        Path
                    </button>
                    <button className="tool-btn" onClick={clearWalls} disabled={isRunning} style={{ height: '44px' }}>
                        <Box size={16} />
                        Walls
                    </button>
                    <button className="tool-btn" onClick={resetGrid} disabled={isRunning} style={{ height: '44px', color: 'var(--accent-rose)' }}>
                        <Trash2 size={16} />
                        Reset
                    </button>
                </div>
            </div>

            {/* Algorithm Module */}
            <div className="panel">
                <h3 className="panel-title">
                    <Zap size={16} />
                    Algorithm
                </h3>
                <div className="algorithm-grid">
                    {algorithms.map((algo) => (
                        <button
                            key={algo.type}
                            className={`algorithm-btn ${selectedAlgorithm === algo.type ? 'active' : ''}`}
                            onClick={() => setSelectedAlgorithm(algo.type)}
                            disabled={isRunning}
                        >
                            <span style={{ fontSize: '0.9rem' }}>{algo.label}</span>
                        </button>
                    ))}
                </div>

                {(selectedAlgorithm === 'astar' || selectedAlgorithm === 'greedy') && (
                    <div style={{ marginTop: '16px' }}>
                        <div className="panel-title" style={{ fontSize: '0.65rem', marginBottom: '8px' }}>Heuristic Focus</div>
                        <select
                            className="heuristic-select"
                            value={heuristic}
                            onChange={(e) => setHeuristic(e.target.value as HeuristicType)}
                            disabled={isRunning}
                        >
                            <option value="manhattan">Manhattan Distance</option>
                            <option value="euclidean">Euclidean Distance</option>
                            <option value="chebyshev">Chebyshev Distance</option>
                        </select>
                    </div>
                )}
            </div>

            {/* HUD / Drawing Module */}
            <div className="panel">
                <h3 className="panel-title">
                    <Grid3X3 size={16} />
                    Input Tools
                </h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                    {tools.map((tool) => (
                        <button
                            key={tool.type}
                            className={`tool-btn ${currentTool === tool.type ? 'active' : ''}`}
                            onClick={() => setCurrentTool(tool.type)}
                            disabled={isRunning}
                            style={{ padding: '8px 4px' }}
                        >
                            {tool.icon}
                            <span style={{ fontSize: '0.65rem', marginTop: '4px' }}>{tool.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Performance Module */}
            <div className="panel">
                <h3 className="panel-title">
                    <Wind size={16} />
                    Frequency
                </h3>
                <div className="speed-control">
                    <div className="tools-grid">
                        {speeds.map((s) => (
                            <button
                                key={s.type}
                                className={`tool-btn ${speed === s.type ? 'active' : ''}`}
                                onClick={() => setSpeed(s.type)}
                                disabled={isRunning}
                                style={{ height: '36px' }}
                            >
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Environment Generation */}
            <div className="panel">
                <h3 className="panel-title">
                    <Sparkles size={16} />
                    Generate Terrain
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    <button className="tool-btn" onClick={() => handleGenerateMaze('recursive')} disabled={isRunning} style={{ height: '40px' }}>Maze</button>
                    <button className="tool-btn" onClick={() => handleGenerateMaze('random')} disabled={isRunning} style={{ height: '40px' }}>Random</button>
                    <button className="tool-btn" onClick={() => handleGenerateMaze('stair')} disabled={isRunning} style={{ height: '40px' }}>Stairs</button>
                    <button className="tool-btn" onClick={handleGenerateWeights} disabled={isRunning} style={{ height: '40px' }}>Weights</button>
                </div>
            </div>

            <StatsPanel />
        </aside>
    );
};

export default ControlPanel;
