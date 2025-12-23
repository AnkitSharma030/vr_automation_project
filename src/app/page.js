'use client';

import { useState, useEffect } from 'react';
import LeadForm from '@/components/LeadForm';
import FilterBar from '@/components/FilterBar';
import LeadsTable from '@/components/LeadsTable';

export default function Home() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(false);

  // Fetch leads from API
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/leads');
      const data = await response.json();

      if (data.success) {
        setLeads(data.leads);
        applyFilter(data.leads, activeFilter);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  // Apply filter to leads
  const applyFilter = (leadsData, filter) => {
    if (filter === 'all') {
      setFilteredLeads(leadsData);
    } else {
      setFilteredLeads(leadsData.filter(lead => lead.status === filter));
    }
  };

  // Handle filter change
  const handleFilterChange = (newFilter) => {
    setActiveFilter(newFilter);
    applyFilter(leads, newFilter);
  };

  // Handle successful form submission
  const handleFormSuccess = () => {
    fetchLeads();
  };

  useEffect(() => {
    fetchLeads();

    // Background sync polling (every 5 minutes)
    const syncInterval = setInterval(async () => {
      try {
        console.log('🔄 Running background sync...');
        const response = await fetch('/api/sync', { method: 'POST' });
        const data = await response.json();

        if (data.success && data.synced > 0) {
          console.log(`✅ Synced ${data.synced} leads`);
          // Refresh leads list if new leads were synced
          fetchLeads();
        }
      } catch (error) {
        console.error('Background sync failed:', error);
      }
    }, 2 * 60 * 1000); // 2 minutes

    return () => clearInterval(syncInterval);
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1 className="dashboard-title">
            <span className="title-icon">🎯</span>
            Smart Lead Automation
          </h1>
          <p className="dashboard-subtitle">
            Process and enrich lead data with AI-powered nationality detection
          </p>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-grid">
          {/* Left Column - Form */}
          <div className="form-column">
            <LeadForm onSuccess={handleFormSuccess} />
          </div>

          {/* Right Column - Results */}
          <div className="results-column">
            <div className="results-header">
              <h2 className="results-title">
                Lead Results
                <span className="results-count">({filteredLeads.length})</span>
              </h2>
              <FilterBar
                activeFilter={activeFilter}
                onFilterChange={handleFilterChange}
              />
            </div>
            <LeadsTable leads={filteredLeads} loading={loading} />
          </div>
        </div>
      </main>

      <footer className="dashboard-footer">
        <p>VR Automations - Smart Lead System</p>
      </footer>
    </div>
  );
}
