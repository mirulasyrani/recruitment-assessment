import React from 'react';
import './DashboardStats.css'; // Optional: Add styles if needed

const DashboardStats = ({ stats = [] }) => {
  // Example fallback stats
  const defaultStats = [
    { label: 'Total Candidates', value: 125 },
    { label: 'Active Jobs', value: 8 },
    { label: 'Interviews Today', value: 3 },
  ];

  const data = stats.length > 0 ? stats : defaultStats;

  return (
    <div style={styles.container}>
      {data.map((stat, index) => (
        <div key={index} style={styles.card}>
          <div style={styles.value}>{stat.value}</div>
          <div style={styles.label}>{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    gap: '1.5rem',
    justifyContent: 'space-between',
    margin: '2rem 0',
    flexWrap: 'wrap',
  },
  card: {
    flex: '1 1 30%',
    padding: '1.5rem',
    backgroundColor: '#f1f5f9',
    borderRadius: '0.75rem',
    textAlign: 'center',
    boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
  },
  value: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#0f172a',
  },
  label: {
    marginTop: '0.5rem',
    fontSize: '1rem',
    color: '#475569',
  },
};

export default DashboardStats;
