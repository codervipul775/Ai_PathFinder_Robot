import { motion, AnimatePresence } from 'framer-motion';
import { Activity } from 'lucide-react';
import { useGridStore } from '../../store/gridStore';

const StatsPanel = () => {
    const { stats, isFinished } = useGridStore();

    if (!isFinished || !stats) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                style={{ marginTop: 'auto' }}
            >
                <div className="panel" style={{ border: '1px solid var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.05)' }}>
                    <h3 className="panel-title">
                        <Activity size={16} />
                        Path Analytics
                    </h3>
                    <div className="stats-grid">
                        <div className="stat-item">
                            <div className="stat-label">Nodes</div>
                            <div className="stat-value" style={{ color: 'var(--accent-blue)' }}>{stats.nodesVisited}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Length</div>
                            <div className="stat-value" style={{ color: 'var(--accent-amber)' }}>{stats.pathLength}</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Time</div>
                            <div className="stat-value">{stats.executionTime}ms</div>
                        </div>
                        <div className="stat-item">
                            <div className="stat-label">Cost</div>
                            <div className="stat-value">{stats.pathCost}</div>
                        </div>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default StatsPanel;
