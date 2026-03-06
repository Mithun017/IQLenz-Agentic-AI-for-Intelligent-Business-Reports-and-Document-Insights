import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Download, Loader } from 'lucide-react';
import axios from 'axios';

const ReportsPage = () => {
    const [reportsList, setReportsList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/reports');
                setReportsList(response.data.reports);
            } catch (error) {
                console.error("Error fetching reports", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchReports();
    }, []);

    const handleDownload = async (id, title) => {
        try {
            const response = await axios.get(`http://localhost:8000/api/reports/${id}/download`, {
                responseType: 'blob'
            });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${title.replace(/\s+/g, '_')}.md`);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
        } catch (error) {
            console.error("Download Error", error);
            alert("Failed to download report. Make sure the backend is running.");
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', flexDirection: 'column', gap: '1rem' }}>
                <Loader className="animate-spin" size={48} color="var(--primary)" />
                <p>Loading Reports...</p>
            </div>
        );
    }

    return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>AI Database Reports</h2>
            </div>

            {reportsList.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }} className="glass-panel">
                    <p>No reports generated yet. Upload a document to create an automated structural report.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {reportsList.map((report, index) => (
                        <motion.div
                            key={report.id}
                            className="glass-card"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0, duration: 0.2 }}
                            style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                        >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ padding: '12px', background: 'rgba(79, 70, 229, 0.1)', borderRadius: '8px', color: 'var(--primary)' }}>
                                    <FileText size={24} />
                                </div>
                                <div>
                                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>{report.title}</h3>
                                    <p style={{ margin: 0, fontSize: '0.85rem' }}>{report.date} • {report.type}</p>
                                </div>
                            </div>

                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <button className="btn btn-primary" style={{ padding: '8px 16px' }} onClick={() => handleDownload(report.id, report.title)}>
                                    <Download size={16} /> Download
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </motion.div>
    );
};

export default ReportsPage;
