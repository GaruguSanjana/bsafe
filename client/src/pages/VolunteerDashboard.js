import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { colors, shadow, fontStack } from '../theme';
import AlertMap from '../components/AlertMap';

function AlertCard(props) {
  const alert = props.alert;
  const onAccept = props.onAccept;
  const onResolve = props.onResolve;
  const mapUrl = 'https://www.google.com/maps?q=' + alert.location.latitude + ',' + alert.location.longitude;

  return (
    <div style={styles.card}>
      <div style={styles.cardTop}>
        <span style={alert.status === 'active' ? styles.badgeActive : styles.badgeAssigned}>
          {alert.status === 'active' ? 'Needs response' : 'In progress'}
        </span>
        <span style={styles.time}>{new Date(alert.createdAt).toLocaleString()}</span>
      </div>
      <p style={styles.userName}>{alert.user ? alert.user.name : 'Unknown user'}</p>
      <p style={styles.userPhone}>{alert.user ? alert.user.phone : ''}</p>
      <p style={styles.detail}>{alert.location.address}</p>

      <AlertMap latitude={alert.location.latitude} longitude={alert.location.longitude} label={alert.user ? alert.user.name : 'User'} />

      <div style={styles.actions}>
        <a href={mapUrl} target="_blank" rel="noreferrer" style={styles.mapLink}>Open in Maps</a>
        {alert.status === 'active' && (
          <button style={styles.acceptBtn} onClick={() => onAccept(alert._id)}>Accept alert</button>
        )}
        {alert.status === 'assigned' && (
          <button style={styles.resolveBtn} onClick={() => onResolve(alert._id)}>Mark resolved</button>
        )}
      </div>
    </div>
  );
}

function VolunteerDashboard() {
  const [alerts, setAlerts] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const fetchAlerts = async () => {
    try {
      const res = await API.get('/alerts/active');
      setAlerts(res.data.alerts);
    } catch (err) {
      setMessage('Failed to load alerts');
    }
  };

  useEffect(() => {
    fetchAlerts();
    const interval = setInterval(fetchAlerts, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleAccept = async (id) => {
    try {
      await API.put('/alerts/' + id + '/accept');
      setMessage('Alert accepted. Head to the location now.');
      fetchAlerts();
    } catch (err) {
      setMessage('Failed to accept alert');
    }
  };

  const handleResolve = async (id) => {
    try {
      await API.put('/alerts/' + id + '/resolve');
      setMessage('Marked as resolved.');
      fetchAlerts();
    } catch (err) {
      setMessage('Failed to resolve alert');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const activeCount = alerts.filter((a) => a.status === 'active').length;

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logoCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
            </svg>
          </div>
          <span style={styles.brandName}>BSafe Volunteer</span>
        </div>
        <div style={styles.navRow}>
          <span style={styles.welcomeText}>{user?.name}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.infoBanner}>{message}</div>}

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{activeCount}</p>
            <p style={styles.statLabel}>Awaiting response</p>
          </div>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{alerts.length}</p>
            <p style={styles.statLabel}>Total open</p>
          </div>
        </div>

        <h2 style={styles.sectionTitle}>Active alerts</h2>

        {alerts.length === 0 && (
          <div style={styles.emptyState}>
            <p style={styles.emptyText}>No active alerts right now. You'll be notified the moment someone needs help.</p>
          </div>
        )}

        {alerts.map((alert) => (
          <AlertCard key={alert._id} alert={alert} onAccept={handleAccept} onResolve={handleResolve} />
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: colors.bg, fontFamily: fontStack },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px 28px',
    backgroundColor: colors.white,
    borderBottom: `1px solid ${colors.border}`,
    flexWrap: 'wrap',
    gap: '12px'
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoCircle: { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: '17px', fontWeight: 700, color: colors.ink },
  navRow: { display: 'flex', alignItems: 'center', gap: '12px' },
  welcomeText: { fontSize: '14px', color: colors.inkLight, fontWeight: 500 },
  logoutBtn: { padding: '8px 16px', backgroundColor: colors.grayBg, color: colors.ink, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  body: { padding: '28px 24px', maxWidth: '640px', margin: '0 auto' },
  infoBanner: { backgroundColor: colors.successBg, color: colors.success, padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '28px' },
  statCard: { flex: 1, backgroundColor: colors.white, padding: '18px', borderRadius: '12px', boxShadow: shadow, textAlign: 'center' },
  statNumber: { fontSize: '28px', fontWeight: 700, color: colors.ink, margin: 0 },
  statLabel: { fontSize: '13px', color: colors.inkLight, margin: '4px 0 0', fontWeight: 500 },
  sectionTitle: { fontSize: '18px', fontWeight: 700, color: colors.ink, marginBottom: '14px' },
  emptyState: { backgroundColor: colors.white, borderRadius: '14px', padding: '40px 24px', textAlign: 'center', boxShadow: shadow },
  emptyText: { color: colors.inkLight, fontSize: '14px', margin: 0, lineHeight: 1.6 },
  card: { background: colors.white, padding: '20px', borderRadius: '14px', boxShadow: shadow, marginBottom: '16px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' },
  badgeActive: { padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, backgroundColor: colors.dangerBg, color: colors.danger },
  badgeAssigned: { padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, backgroundColor: colors.warningBg, color: colors.warning },
  time: { color: colors.inkLight, fontSize: '12px', fontWeight: 500 },
  userName: { fontWeight: 700, fontSize: '16px', color: colors.ink, margin: '0 0 2px' },
  userPhone: { color: colors.inkLight, fontSize: '14px', margin: '0 0 8px', fontWeight: 500 },
  detail: { color: colors.inkLight, fontSize: '14px', margin: '0 0 4px' },
  actions: { display: 'flex', gap: '10px', marginTop: '12px' },
  mapLink: { padding: '9px 16px', backgroundColor: colors.grayBg, color: colors.ink, borderRadius: '8px', textDecoration: 'none', fontSize: '13px', fontWeight: 600 },
  acceptBtn: { padding: '9px 16px', backgroundColor: colors.success, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: fontStack },
  resolveBtn: { padding: '9px 16px', backgroundColor: colors.ink, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: fontStack }
};

export default VolunteerDashboard;