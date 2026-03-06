import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, TrendingDown, RefreshCcw, Loader, CheckCircle } from 'lucide-react';
import axios from 'axios';

const ProposalsPage = () => {
    const [proposals, setProposals] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchProposals();
    }, []);

    const fetchProposals = async () => {
        try {
            const res = await axios.get('http://localhost:8000/api/proposals');
            // Mock random icons and colors for dynamic DB content since DB doesn't store JSX
            const dynamicProposals = res.data.proposals.map((p, i) => ({
                ...p,
                icon: i % 2 === 0 ? <RefreshCcw size={24} /> : <TrendingDown size={24} />,
                color: i % 2 === 0 ? 'var(--primary)' : 'var(--accent)'
            }));
            setProposals(dynamicProposals);
        } catch (error) {
            console.error("Error fetching proposals:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAction = async (id, action) => {
        try {
            await axios.post(`http://localhost:8000/api/proposals/${id}/${action}`);
            // Remove proposal from screen with animation
            setProposals(prev => prev.filter(p => p.id !== id));
        } catch (error) {
            console.error(`Error with ${action}:`, error);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="animate-spin" size={48} color="var(--primary)" />
                <p>Searching for AI Recommendations...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div>
                <h2>Strategic Proposals</h2>
                <p>AI-generated recommendations based on your financial documents and recent analysis.</p>
            </div>

            {proposals.length === 0 ? (
                <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
                    <CheckCircle size={48} style={{ margin: '0 auto 1rem', color: 'var(--primary)' }} />
                    <h3>All Caught Up</h3>
                    <p>You have approved or dismissed all pending strategic proposals.</p>
                </div>
            ) : (
                <div className="grid-2">
                    <AnimatePresence>
                        {proposals.map((proposal, index) => (
                            <motion.div
                                key={proposal.id}
                                layout
                                className="glass-panel"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: 0, duration: 0.2 }}
                                style={{ borderTop: `4px solid ${proposal.color}` }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                    <div style={{ color: proposal.color }}>
                                        {proposal.icon}
                                    </div>
                                    <h3 style={{ margin: 0 }}>{proposal.title}</h3>
                                </div>

                                <p style={{ color: '#fff' }}><strong>Observation:</strong> {proposal.description}</p>
                                <div style={{ padding: '12px', background: 'rgba(255, 255, 255, 0.05)', borderRadius: '8px', marginTop: '1rem' }}>
                                    <p style={{ margin: 0, color: 'var(--primary)' }}><strong>Impact:</strong> {proposal.impact}</p>
                                </div>

                                <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                                    <button className="btn btn-primary" style={{ flex: 1 }} onClick={() => handleAction(proposal.id, 'approve')}>Approve Plan</button>
                                    <button className="btn btn-glass" onClick={() => handleAction(proposal.id, 'dismiss')}>Dismiss</button>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </motion.div>
    );
};

export default ProposalsPage;
