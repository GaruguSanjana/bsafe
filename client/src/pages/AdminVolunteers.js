import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { colors, shadow, fontStack } from '../theme';

function AdminVolunteers() {
  const [volunteers, setVolunteers] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchPending = async () => {
    try {
      const res = await API.get('/users/pending-volunteers');
      setVolunteers(res.data.volunteers);
    } catch (err) {
      setMessage('Failed to load volunteers. You may not have admin access.');
    }
  };

  useEffect(() => { fetchPending(); }, []);

  const handleVerify = async (id) => {
    try {
      await API.put('/users/verify/' + id);
      setMessage('Volunteer verified');
      fetchPending();
    } catch (err) {
      setMessage('Failed to verify volunteer');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Pending volunteer verification</h1>
        <button style={styles.backBtn} onClick={() => navigate('/admin')}>Back to dashboard</button>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.infoBanner}>{message}</div>}

        <h3 style={styles.sectionTitle}>Awaiting approval ({volunteers.length})</h3>
        {volunteers.length === 0 && <div style={styles.emptyState}><p style={styles.emptyText}>No pending volunteers.</p></div>}

        {volunteers.map((v) => (
          <div key={v._id} style={styles.card}>
            <div>
              <p style={styles.name}>{v.name}</p>
              <p style={styles.detail}>{v.email} &middot; {v.phone}</p>
            </div>
            <button style={styles.verifyBtn} onClick={() => handleVerify(v._id)}>Verify</button>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: colors.bg, fontFamily: fontStack },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap', gap: '12px' },
  headerTitle: { fontSize: '18px', fontWeight: 700, color: colors.ink, margin: 0 },
  backBtn: { padding: '8px 16px', backgroundColor: colors.grayBg, color: colors.ink, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  body: { padding: '28px 24px', maxWidth: '560px', margin: '0 auto' },
  infoBanner: { backgroundColor: colors.successBg, color: colors.success, padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: colors.ink, marginBottom: '14px' },
  emptyState: { backgroundColor: colors.white, borderRadius: '14px', padding: '32px 24px', textAlign: 'center', boxShadow: shadow },
  emptyText: { color: colors.inkLight, fontSize: '14px', margin: 0 },
  card: { background: colors.white, padding: '16px 20px', borderRadius: '14px', boxShadow: shadow, marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  name: { fontWeight: 700, margin: 0, fontSize: '15px', color: colors.ink },
  detail: { margin: '4px 0 0', color: colors.inkLight, fontSize: '13px' },
  verifyBtn: { padding: '9px 18px', backgroundColor: colors.success, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: fontStack }
};

export default AdminVolunteers;