import { motion } from 'framer-motion';
import { X, Play, Square, Target, Route, Zap } from 'lucide-react';

interface TutorialProps {
    onClose: () => void;
}

const Tutorial = ({ onClose }: TutorialProps) => {
    const steps = [
        {
            icon: <Square size={20} />,
            title: 'Draw Walls',
            description: 'Click and drag on the grid to create obstacles. The robot cannot pass through walls.',
        },
        {
            icon: <Target size={20} />,
            title: 'Set Points',
            description: 'Use the Start and End tools to place the robot\'s starting position and destination.',
        },
        {
            icon: <Zap size={20} />,
            title: 'Choose Algorithm',
            description: 'Select a pathfinding algorithm. A* is recommended for optimal results!',
        },
        {
            icon: <Play size={20} />,
            title: 'Visualize',
            description: 'Click "Visualize Algorithm" to watch the robot find its path in real-time!',
        },
        {
            icon: <Route size={20} />,
            title: 'Analyze',
            description: 'Compare different algorithms by their performance metrics and visualizations.',
        },
    ];

    return (
        <motion.div
            className="tutorial-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="tutorial-card"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
            >
                <button
                    onClick={onClose}
                    style={{
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        cursor: 'pointer',
                    }}
                >
                    <X size={20} />
                </button>

                <h2 className="tutorial-title">🤖 AI Pathfinding Robot</h2>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '8px' }}>
                    Watch algorithms find the shortest path in real-time!
                </p>

                <div className="tutorial-steps">
                    {steps.map((step, index) => (
                        <div key={index} className="tutorial-step">
                            <div className="tutorial-step-number">{index + 1}</div>
                            <div>
                                <strong style={{ color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    {step.icon} {step.title}
                                </strong>
                                <p className="tutorial-step-text">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

                <button className="btn btn-primary" onClick={onClose} style={{ width: '100%' }}>
                    <Play size={18} />
                    Get Started
                </button>
            </motion.div>
        </motion.div>
    );
};

export default Tutorial;
