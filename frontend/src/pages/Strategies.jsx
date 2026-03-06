import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Save, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

const StrategiesPage = () => {
    const [strategies, setStrategies] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [expandedId, setExpandedId] = useState(null);
    const [editContent, setEditContent] = useState({});
    const [saveStatus, setSaveStatus] = useState({});

    useEffect(() => {
        fetchStrategies();
    }, []);

    const fetchStrategies = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/strategies');
            setStrategies(res.data.strategies);
            // Initialize local edit state map
            const edits = {};
            res.data.strategies.forEach(s => {
                edits[s.id] = s.strategy_details || '';
            });
            setEditContent(edits);
        } catch (error) {
            console.error("Error fetching strategies:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (id) => {
        try {
            setSaveStatus(prev => ({ ...prev, [id]: 'saving' }));
            await axios.put(`http://localhost:8000/api/strategies/${id}`, {
                strategy_details: editContent[id]
            });
            setSaveStatus(prev => ({ ...prev, [id]: 'saved' }));
            setTimeout(() => setSaveStatus(prev => ({ ...prev, [id]: null })), 3000);
        } catch (error) {
            console.error("Error saving strategy:", error);
            setSaveStatus(prev => ({ ...prev, [id]: 'error' }));
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="animate-spin" size={48} color="var(--primary)" />
                <p>Loading Active Strategies...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div>
                <h2>Active Strategies</h2>
                <p>Implement, design, and track approved AI proposals for your company.</p>
            </div>

            {strategies.length === 0 ? (
                <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }} className="glass-panel">
                    <Target size={48} style={{ margin: '0 auto 1rem', opacity: 0.5 }} />
                    <h3>No Approved Strategies</h3>
                    <p>Go to the Proposals page to start approving AI recommendations.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <AnimatePresence>
                        {strategies.map((strategy) => {
                            const isExpanded = expandedId === strategy.id;
                            return (
                                <motion.div
                                    key={strategy.id}
                                    layout
                                    className="glass-card"
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    style={{
                                        borderLeft: '4px solid var(--primary)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        gap: '1rem'
                                    }}
                                >
                                    {/* Header Section */}
                                    <div
                                        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }}
                                        onClick={() => setExpandedId(isExpanded ? null : strategy.id)}
                                    >
                                        <div>
                                            <h3 style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <Target size={20} color="var(--primary)" />
                                                {strategy.title}
                                            </h3>
                                            <p style={{ margin: 0, color: 'var(--text-muted)' }}>{strategy.description}</p>
                                        </div>
                                        <div style={{ background: 'rgba(79, 70, 229, 0.15)', padding: '4px 12px', borderRadius: '12px', color: 'var(--primary)', fontSize: '0.85rem' }}>
                                            {strategy.impact || 'Strategic Initiative'}
                                        </div>
                                    </div>

                                    {/* Expanded Edit Area */}
                                    <AnimatePresence>
                                        {isExpanded && (
                                            <motion.div
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: 'auto', opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                style={{ overflow: 'hidden' }}
                                            >
                                                <div style={{ marginTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1rem' }}>
                                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>Implementation Details & Technical Design:</label>
                                                    <textarea
                                                        value={editContent[strategy.id]}
                                                        onChange={(e) => setEditContent({ ...editContent, [strategy.id]: e.target.value })}
                                                        placeholder="Write out the technical approach, milestones, or design architecture to execute this strategy..."
                                                        style={{
                                                            width: '100%',
                                                            minHeight: '150px',
                                                            background: 'rgba(0,0,0,0.2)',
                                                            border: '1px solid rgba(255,255,255,0.1)',
                                                            borderRadius: '8px',
                                                            padding: '1rem',
                                                            color: 'white',
                                                            fontFamily: 'inherit',
                                                            resize: 'vertical',
                                                            outline: 'none'
                                                        }}
                                                    />

                                                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem', gap: '1rem', alignItems: 'center' }}>
                                                        {saveStatus[strategy.id] === 'saved' && (
                                                            <span style={{ color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                                <CheckCircle size={16} /> Strategy Saved
                                                            </span>
                                                        )}
                                                        <button
                                                            className="btn btn-primary"
                                                            onClick={() => handleSave(strategy.id)}
                                                            disabled={saveStatus[strategy.id] === 'saving'}
                                                        >
                                                            {saveStatus[strategy.id] === 'saving' ? 'Saving...' : <><Save size={16} /> Save Plan</>}
                                                        </button>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default StrategiesPage;
