import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, Legend } from 'recharts';
import { Loader } from 'lucide-react';
import axios from 'axios';

const DashboardPage = () => {
    const [data, setData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch context data dynamically from FastAPI backend
                const response = await axios.get('http://localhost:8000/api/dashboard');
                setData(response.data);
            } catch (error) {
                console.error("Dashboard Fetch Error:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchDashboardData();
    }, []);

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="animate-spin" size={48} color="var(--primary)" />
                <p>Loading Dynamic Insights...</p>
            </div>
        );
    }

    if (!data) {
        return <p style={{ color: "var(--accent)" }}>Failed to connect to backend AI services. Is the server running?</p>;
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Interactive Dashboard</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <motion.div className="glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Revenue</p>
                    <h2 style={{ color: 'var(--primary)', margin: '0.5rem 0' }}>${data.metrics.total_revenue.toLocaleString()}</h2>
                </motion.div>
                <motion.div className="glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Total Expenses</p>
                    <h2 style={{ color: 'var(--accent)', margin: '0.5rem 0' }}>${data.metrics.total_expenses.toLocaleString()}</h2>
                </motion.div>
                <motion.div className="glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Net Profit Margin</p>
                    <h2 style={{ color: '#10B981', margin: '0.5rem 0' }}>{data.metrics.net_profit_margin}</h2>
                </motion.div>
                <motion.div className="glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>Docs Analyzed</p>
                    <h2 style={{ color: 'var(--text-main)', margin: '0.5rem 0' }}>{data.metrics.documents_analyzed}</h2>
                </motion.div>
                <motion.div className="glass-card" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <p style={{ margin: 0, color: 'var(--text-muted)' }}>AI Confidence</p>
                    <h2 style={{ color: '#8B5CF6', margin: '0.5rem 0' }}>{data.metrics.avg_ai_confidence}</h2>
                </motion.div>
            </div>

            <div className="grid-2" style={{ marginBottom: '2rem' }}>
                <motion.div className="glass-panel" initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <h3>Revenue vs Expenses</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <AreaChart data={data.monthly_performance}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.8} />
                                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="revenue" stroke="var(--primary)" fillOpacity={1} fill="url(#colorRevenue)" />
                                <Area type="monotone" dataKey="expense" stroke="var(--accent)" fillOpacity={1} fill="url(#colorExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div className="glass-panel" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <h3>Top Vendor Spending</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={data.vendor_spending} layout="vertical" margin={{ left: 30 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" horizontal={false} />
                                <XAxis type="number" stroke="rgba(255,255,255,0.5)" />
                                <YAxis dataKey="name" type="category" stroke="rgba(255,255,255,0.5)" width={80} />
                                <Tooltip cursor={{ fill: 'rgba(255,255,255,0.05)' }} contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Bar dataKey="cost" fill="var(--primary)" radius={[0, 4, 4, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

            <div className="grid-2">
                <motion.div className="glass-panel" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <h3>Document Classification</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <PieChart>
                                <Pie
                                    data={data.document_types}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={100}
                                    paddingAngle={5}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {data.document_types.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={['var(--primary)', '#10B981', 'var(--accent)', '#8B5CF6'][index % 4]} />
                                    ))}
                                </Pie>
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                <motion.div className="glass-panel" initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0, duration: 0.2 }}>
                    <h3>AI Processing Volume Trend</h3>
                    <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <LineChart data={data.processing_trend}>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                <XAxis dataKey="name" stroke="rgba(255,255,255,0.5)" />
                                <YAxis stroke="rgba(255,255,255,0.5)" />
                                <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
                                <Line type="monotone" dataKey="docs" name="Documents Processed" stroke="var(--primary)" strokeWidth={3} dot={{ r: 4, fill: 'var(--primary)' }} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>
            </div>

        </motion.div>
    );
};

export default DashboardPage;
