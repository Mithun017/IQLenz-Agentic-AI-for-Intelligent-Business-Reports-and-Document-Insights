import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, BarChart2, FileText, Lightbulb } from 'lucide-react';

const Home = () => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}
        >
            <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0, duration: 0.2 }}
                    style={{ fontSize: '3rem', marginBottom: '1rem', background: 'linear-gradient(to right, #4F46E5, #ec4899)', WebkitBackgroundClip: 'text', color: 'transparent' }}
                >
                    Welcome to IQLenz
                </motion.h1>
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0, duration: 0.2 }}
                    style={{ fontSize: '1.2rem', marginBottom: '2rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}
                >
                    Your AI-powered business intelligence assistant. Convert company documents into automated reports, interactive dashboards, and actionable strategic proposals.
                </motion.p>
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <Link to="/upload" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: '1.1rem' }}>
                        Get Started <ArrowRight size={20} />
                    </Link>
                </motion.div>
            </div>

            <div className="grid-3" style={{ marginTop: '2rem' }}>
                <motion.div className="glass-card" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div style={{ color: 'var(--primary)', marginBottom: '1rem' }}><FileText size={32} /></div>
                    <h3>Automated Reports</h3>
                    <p>Instantly generate professional business reports from your uploaded bills, invoices, and financial records.</p>
                </motion.div>

                <motion.div className="glass-card" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div style={{ color: 'var(--secondary)', marginBottom: '1rem' }}><BarChart2 size={32} /></div>
                    <h3>Dynamic Dashboards</h3>
                    <p>Visualize your expenses, revenue trends, and vendor costs with interactive, easy-to-understand charts.</p>
                </motion.div>

                <motion.div className="glass-card" whileHover={{ y: -5 }} transition={{ type: 'spring', stiffness: 300 }}>
                    <div style={{ color: 'var(--accent)', marginBottom: '1rem' }}><Lightbulb size={32} /></div>
                    <h3>Strategic AI Insights</h3>
                    <p>Get AI-generated proposals for cost reduction and business optimization based on deep financial analysis.</p>
                </motion.div>
            </div>
        </motion.div>
    );
};

export default Home;
