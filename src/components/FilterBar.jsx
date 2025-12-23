'use client';

export default function FilterBar({ activeFilter, onFilterChange }) {
    const filters = [
        { value: 'all', label: 'All Leads' },
        { value: 'Verified', label: 'Verified' },
        { value: 'To Check', label: 'To Check' },
    ];

    return (
        <div className="filter-bar">
            <span className="filter-label">Filter by status:</span>
            <div className="filter-buttons">
                {filters.map((filter) => (
                    <button
                        key={filter.value}
                        className={`filter-button ${activeFilter === filter.value ? 'active' : ''}`}
                        onClick={() => onFilterChange(filter.value)}
                    >
                        {filter.label}
                    </button>
                ))}
            </div>
        </div>
    );
}
