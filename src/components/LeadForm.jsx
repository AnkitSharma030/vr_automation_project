'use client';

import { useState } from 'react';

export default function LeadForm({ onSuccess }) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        // Parse comma-separated names
        const names = input
            .split(',')
            .map(name => name.trim())
            .filter(name => name.length > 0);

        if (names.length === 0) {
            setError('Please enter at least one name');
            return;
        }

        setLoading(true);

        try {
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ names }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to process names');
            }

            setSuccess(`Successfully processed ${data.count} leads!`);
            setInput('');

            // Notify parent component to refresh data
            if (onSuccess) {
                onSuccess();
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="lead-form-container">
            <h2 className="form-title">Add New Leads</h2>
            <form onSubmit={handleSubmit} className="lead-form">
                <div className="form-group">
                    <label htmlFor="names-input" className="form-label">
                        Enter names (comma-separated)
                    </label>
                    <textarea
                        id="names-input"
                        className="form-textarea"
                        rows="3"
                        placeholder="e.g., Peter, Aditi, Ravi, Satoshi"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        disabled={loading}
                    />
                </div>

                {error && (
                    <div className="alert alert-error">
                        <span className="alert-icon">⚠️</span>
                        {error}
                    </div>
                )}

                {success && (
                    <div className="alert alert-success">
                        <span className="alert-icon">✅</span>
                        {success}
                    </div>
                )}

                <button
                    type="submit"
                    className="submit-button"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <span className="spinner"></span>
                            Processing...
                        </>
                    ) : (
                        'Process Names'
                    )}
                </button>
            </form>
        </div>
    );
}
