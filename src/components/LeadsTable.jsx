'use client';

export default function LeadsTable({ leads, loading }) {
    if (loading) {
        return (
            <div className="table-container">
                <div className="loading-state">
                    <span className="spinner-large"></span>
                    <p>Loading leads...</p>
                </div>
            </div>
        );
    }

    if (!leads || leads.length === 0) {
        return (
            <div className="table-container">
                <div className="empty-state">
                    <span className="empty-icon">📊</span>
                    <h3>No leads yet</h3>
                    <p>Start by adding some names above to see them appear here.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="table-container">
            <div className="table-wrapper">
                <table className="leads-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Country</th>
                            <th>Confidence Score</th>
                            <th>Status</th>
                            <th>Created</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead, index) => (
                            <tr key={lead._id || index} className="table-row">
                                <td className="name-cell">{lead.name}</td>
                                <td className="country-cell">
                                    <span className="country-code">{lead.country}</span>
                                </td>
                                <td className="probability-cell">
                                    <div className="probability-bar-container">
                                        <div
                                            className="probability-bar"
                                            style={{
                                                width: `${(lead.probability * 100).toFixed(0)}%`,
                                                backgroundColor: lead.probability > 0.6 ? '#10b981' : '#f59e0b',
                                            }}
                                        ></div>
                                        <span className="probability-text">
                                            {(lead.probability * 100).toFixed(1)}%
                                        </span>
                                    </div>
                                </td>
                                <td className="status-cell">
                                    <span className={`status-badge ${lead.status === 'Verified' ? 'verified' : 'to-check'}`}>
                                        {lead.status}
                                    </span>
                                </td>
                                <td className="date-cell">
                                    {new Date(lead.createdAt).toLocaleString()}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
