import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FileUp, CheckCircle, Loader } from 'lucide-react';
import axios from 'axios';

const UploadPage = () => {
    const [isUploading, setIsUploading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async (e) => {
        e.preventDefault();
        if (!file) {
            alert("Please select a file first.");
            return;
        }

        setIsUploading(true);

        const formData = new FormData();
        formData.append('file', file);

        try {
            await axios.post('http://localhost:8000/api/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            setIsSuccess(true);
        } catch (error) {
            console.error("Upload Error:", error);
            alert("Upload failed. Is the backend server running?");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="glass-panel"
            style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center', padding: '4rem 2rem' }}
        >
            <h2>Document Upload</h2>
            <p style={{ marginBottom: '2rem' }}>Upload your financial documents to generate insights.</p>

            {isSuccess ? (
                <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} style={{ color: 'var(--secondary)' }}>
                    <CheckCircle size={64} style={{ margin: '0 auto 1rem auto' }} />
                    <h3>Upload Processing!</h3>
                    <p>Our AI agents are now analyzing your documents. Check Dashboard or Reports shortly.</p>
                    <button className="btn btn-primary" style={{ marginTop: '2rem' }} onClick={() => setIsSuccess(false)}>Upload More</button>
                </motion.div>
            ) : (
                <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                    <div
                        className="glass-card"
                        style={{
                            width: '100%',
                            padding: '4rem 2rem',
                            borderStyle: 'dashed',
                            borderWidth: '2px',
                            cursor: 'pointer',
                            borderColor: 'var(--primary)'
                        }}
                    >
                        <FileUp size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem auto' }} />
                        <h3>{file ? file.name : "Drag & Drop Files Here"}</h3>
                        <p>Support for PDF, Excel, Invoices, and Images</p>
                        <input type="file" onChange={handleFileChange} style={{ display: 'none' }} id="file-upload" />
                        <label htmlFor="file-upload" className="btn btn-glass" style={{ marginTop: '1rem' }}>Browse Files</label>
                    </div>

                    <button type="submit" className="btn btn-primary" disabled={isUploading || !file} style={{ padding: '12px 48px' }}>
                        {isUploading ? <><Loader className="animate-spin" size={20} /> Processing via AI...</> : 'Analyze Document'}
                    </button>
                </form>
            )}
        </motion.div>
    );
};

export default UploadPage;
