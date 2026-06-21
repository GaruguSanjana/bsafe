import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { colors, shadow, shadowLg, fontStack } from '../theme';

function Dashboard() {
  const [alertStatus, setAlertStatus] = useState('');
  const [sending, setSending] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSOS = () => {
    setSending(true);
    setAlertStatus('');
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          await API.post('/alerts/sos', {
            latitude,
            longitude,
            address: 'Live location',
            description: 'SOS emergency'
          });
          setAlertStatus('success');
        } catch (err) {
          setAlertStatus('error');
        } finally {
          setSending(false);
        }
      },
      () => {
        setAlertStatus('error');
        setSending(false);
      }
    );
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  const navItems = [
    { label: 'Contacts', path: '/contacts' },
    { label: 'Profile', path: '/profile' },
    { label: 'Safe zones', path: '/safezones' },
    { label: 'History', path: '/history' }
  ];

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logoCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
            </svg>
          </div>
          <span style={styles.brandName}>BSafe</span>
        </div>
        <div style={styles.navRow}>
          {navItems.map((item) => (
            <button key={item.path} style={styles.navBtn} onClick={() => navigate(item.path)}>
              {item.label}
            </button>
          ))}
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        <p style={styles.greeting}>Hello, {user?.name?.split(' ')[0]}</p>
        <h1 style={styles.title}>Stay safe</h1>
        <p style={styles.subtitle}>Press the button below if you need immediate help.</p>

        {alertStatus === 'success' && (
          <div style={styles.successBanner}>
            <span style={styles.successDot} />
            Alert sent. Nearby volunteers have been notified.
          </div>
        )}
        {alertStatus === 'error' && (
          <div style={styles.errorBanner}>
            Couldn't send the alert. Please check location permissions and try again.
          </div>
        )}

        <button
          style={{ ...styles.sosButton, opacity: sending ? 0.7 : 1 }}
          onClick={handleSOS}
          disabled={sending}
        >
          <span style={styles.sosLabel}>{sending ? 'Sending...' : 'SOS'}</span>
        </button>

        <p style={styles.hint}>Your live location will be shared with the nearest available volunteer</p>
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
  navRow: { display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' },
  navBtn: {
    padding: '8px 14px',
    backgroundColor: 'transparent',
    color: colors.ink,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 500,
    fontSize: '14px',
    fontFamily: fontStack
  },
  logoutBtn: {
    padding: '8px 16px',
    backgroundColor: colors.grayBg,
    color: colors.ink,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    fontWeight: 600,
    fontSize: '14px',
    fontFamily: fontStack,
    marginLeft: '6px'
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '60px 24px',
    minHeight: 'calc(100vh - 70px)'
  },
  greeting: { color: colors.inkLight, fontSize: '15px', fontWeight: 500, margin: '0 0 4px' },
  title: { fontSize: '32px', fontWeight: 700, color: colors.ink, margin: '0 0 8px' },
  subtitle: { color: colors.inkLight, fontSize: '15px', margin: '0 0 32px', maxWidth: '360px' },
  successBanner: {
    backgroundColor: colors.successBg,
    color: colors.success,
    padding: '12px 20px',
    borderRadius: '10px',
    marginBottom: '28px',
    fontWeight: 600,
    fontSize: '14px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px'
  },
  successDot: { width: '8px', height: '8px', borderRadius: '50%', backgroundColor: colors.success, display: 'inline-block' },
  errorBanner: {
    backgroundColor: colors.dangerBg,
    color: colors.danger,
    padding: '12px 20px',
    borderRadius: '10px',
    marginBottom: '28px',
    fontWeight: 600,
    fontSize: '14px',
    maxWidth: '380px'
  },
  sosButton: {
    width: '220px',
    height: '220px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
    border: `8px solid ${colors.primaryLight}`,
    cursor: 'pointer',
    boxShadow: '0 0 0 0 rgba(214,40,57,0.4), 0 8px 30px rgba(214,40,57,0.35)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.1s'
  },
  sosLabel: { color: 'white', fontSize: '34px', fontWeight: 700, letterSpacing: '1px' },
  hint: { marginTop: '28px', color: colors.inkLight, fontSize: '14px', maxWidth: '320px' }
};

export default Dashboard;