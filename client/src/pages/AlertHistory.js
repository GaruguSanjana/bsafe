import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { colors, shadow, fontStack } from '../theme';

const statusStyle = {
  active: { bg: colors.dangerBg, text: colors.danger },
  assigned: { bg: colors.warningBg, text: colors.warning },
  resolved: { bg: colors.successBg, text: colors.success },
  cancelled: { bg: colors.grayBg, text: colors.gray }
};

function AlertHistory() {
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchHistory = async () => {
    try {
      const res = await API.get('/alerts/my-alerts');
      setAlerts(res.data.alerts);
    } catch (err) {
      setMessage('Failed to load alert history');
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Alert history</h1>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.infoBanner}>{message}</div>}

        <h3 style={styles.sectionTitle}>Your past alerts ({alerts.length})</h3>
        {alerts.length === 0 && <div style={styles.emptyState}><p style={styles.emptyText}>No alerts sent yet.</p></div>}

        {alerts.map((alert) => {
          const s = statusStyle[alert.status] || statusStyle.cancelled;
          const mapUrl = 'https://www.google.com/maps?q=' + alert.location.latitude + ',' + alert.location.longitude;
          return (
            <div key={alert._id} style={styles.card}>
              <div style={styles.cardTop}>
                <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.text }}>{alert.status}</span>
                <span style={styles.time}>{new Date(alert.createdAt).toLocaleString()}</span>
              </div>
              <p style={styles.detail}><strong style={styles.strong}>Address</strong> {alert.location.address}</p>
              <p style={styles.detail}><strong style={styles.strong}>Description</strong> {alert.description}</p>
              <a href={mapUrl} target="_blank" rel="noreferrer" style={styles.mapLink}>View on map</a>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: colors.bg, fontFamily: fontStack },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` },
  headerTitle: { fontSize: '18px', fontWeight: 700, color: colors.ink, margin: 0 },
  backBtn: { padding: '8px 16px', backgroundColor: colors.grayBg, color: colors.ink, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  body: { padding: '28px 24px', maxWidth: '560px', margin: '0 auto' },
  infoBanner: { backgroundColor: colors.dangerBg, color: colors.danger, padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: colors.ink, marginBottom: '14px' },
  emptyState: { backgroundColor: colors.white, borderRadius: '14px', padding: '32px 24px', textAlign: 'center', boxShadow: shadow },
  emptyText: { color: colors.inkLight, fontSize: '14px', margin: 0 },
  card: { background: colors.white, padding: '18px 20px', borderRadius: '14px', boxShadow: shadow, marginBottom: '12px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  badge: { padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' },
  time: { color: colors.inkLight, fontSize: '12px', fontWeight: 500 },
  strong: { color: colors.ink, fontWeight: 600 },
  detail: { margin: '4px 0', color: colors.inkLight, fontSize: '14px' },
  mapLink: { display: 'inline-block', marginTop: '10px', padding: '7px 16px', backgroundColor: colors.grayBg, color: colors.ink, borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 }
};

export default AlertHistory;