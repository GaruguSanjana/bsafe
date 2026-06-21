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

function AdminDashboard() {
  const [tab, setTab] = useState('alerts');
  const [alerts, setAlerts] = useState([]);
  const [stats, setStats] = useState({ total: 0, active: 0, assigned: 0, resolved: 0 });
  const [users, setUsers] = useState([]);
  const [zones, setZones] = useState([]);
  const [zoneForm, setZoneForm] = useState({ name: '', type: 'police_station', latitude: '', longitude: '', address: '', phone: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchAlerts = async () => {
    try {
      const res = await API.get('/alerts/admin/all');
      setAlerts(res.data.alerts);
      setStats(res.data.stats);
    } catch (err) {
      setMessage('Failed to load alerts. You may not have admin access.');
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await API.get('/users/all');
      setUsers(res.data.users);
    } catch (err) {
      setMessage('Failed to load users.');
    }
  };

  const fetchZones = async () => {
    try {
      const res = await API.get('/safezones');
      setZones(res.data.zones);
    } catch (err) {
      setMessage('Failed to load safe zones.');
    }
  };

  useEffect(() => {
    fetchAlerts();
    fetchUsers();
    fetchZones();
  }, []);

  const handleDeleteUser = async (id) => {
    try {
      await API.delete('/users/' + id);
      setMessage('User removed');
      fetchUsers();
    } catch (err) {
      setMessage('Failed to remove user');
    }
  };

  const handleZoneChange = (e) => {
    setZoneForm({ ...zoneForm, [e.target.name]: e.target.value });
  };

  const handleAddZone = async (e) => {
    e.preventDefault();
    try {
      await API.post('/safezones', zoneForm);
      setMessage('Safe zone added');
      setZoneForm({ name: '', type: 'police_station', latitude: '', longitude: '', address: '', phone: '' });
      fetchZones();
    } catch (err) {
      setMessage('Failed to add safe zone');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <div style={styles.brandRow}>
          <div style={styles.logoCircle}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
            </svg>
          </div>
          <span style={styles.brandName}>BSafe Admin</span>
        </div>
        <div style={styles.navRow}>
          <button style={styles.navBtn} onClick={() => navigate('/admin/volunteers')}>Verify volunteers</button>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.infoBanner}>{message}</div>}

        <div style={styles.statsRow}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{stats.total}</p>
            <p style={styles.statLabel}>Total alerts</p>
          </div>
          <div style={{ ...styles.statCard, backgroundColor: colors.dangerBg }}>
            <p style={{ ...styles.statNumber, color: colors.danger }}>{stats.active}</p>
            <p style={{ ...styles.statLabel, color: colors.danger }}>Active</p>
          </div>
          <div style={{ ...styles.statCard, backgroundColor: colors.warningBg }}>
            <p style={{ ...styles.statNumber, color: colors.warning }}>{stats.assigned}</p>
            <p style={{ ...styles.statLabel, color: colors.warning }}>Assigned</p>
          </div>
          <div style={{ ...styles.statCard, backgroundColor: colors.successBg }}>
            <p style={{ ...styles.statNumber, color: colors.success }}>{stats.resolved}</p>
            <p style={{ ...styles.statLabel, color: colors.success }}>Resolved</p>
          </div>
        </div>

        <div style={styles.tabRow}>
          <button style={tab === 'alerts' ? styles.tabBtnActive : styles.tabBtn} onClick={() => setTab('alerts')}>All alerts</button>
          <button style={tab === 'users' ? styles.tabBtnActive : styles.tabBtn} onClick={() => setTab('users')}>All users</button>
          <button style={tab === 'zones' ? styles.tabBtnActive : styles.tabBtn} onClick={() => setTab('zones')}>Safe zones</button>
        </div>

        {tab === 'alerts' ? (
          <div>
            {alerts.length === 0 && <div style={styles.emptyState}><p style={styles.emptyText}>No alerts yet.</p></div>}
            {alerts.map((alert) => {
              const s = statusStyle[alert.status] || statusStyle.cancelled;
              return (
                <div key={alert._id} style={styles.card}>
                  <div style={styles.cardTop}>
                    <span style={{ ...styles.badge, backgroundColor: s.bg, color: s.text }}>{alert.status}</span>
                    <span style={styles.time}>{new Date(alert.createdAt).toLocaleString()}</span>
                  </div>
                  <p style={styles.detail}><strong style={styles.strong}>User</strong> {alert.user ? alert.user.name : 'N/A'} &middot; {alert.user ? alert.user.phone : ''}</p>
                  <p style={styles.detail}><strong style={styles.strong}>Responder</strong> {alert.responder ? alert.responder.name : 'Not assigned'}</p>
                  <p style={styles.detail}><strong style={styles.strong}>Address</strong> {alert.location.address}</p>
                </div>
              );
            })}
          </div>
        ) : null}

        {tab === 'users' ? (
          <div>
            {users.map((u) => (
              <div key={u._id} style={styles.card}>
                <div style={styles.cardTop}>
                  <span style={styles.roleBadge}>{u.role}</span>
                  {u.role === 'volunteer' ? (
                    <span style={{ ...styles.badge, backgroundColor: u.isVerified ? colors.successBg : colors.dangerBg, color: u.isVerified ? colors.success : colors.danger }}>
                      {u.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  ) : null}
                </div>
                <p style={styles.userName}>{u.name}</p>
                <p style={styles.detail}>{u.email} &middot; {u.phone}</p>
                <button style={styles.deleteBtn} onClick={() => handleDeleteUser(u._id)}>Remove user</button>
              </div>
            ))}
          </div>
        ) : null}

        {tab === 'zones' ? (
          <div>
            <div style={styles.formCard}>
              <h3 style={styles.formTitle}>Add a safe zone</h3>
              <form onSubmit={handleAddZone}>
                <input style={styles.input} type="text" name="name" placeholder="Name (e.g. City Police Station)" value={zoneForm.name} onChange={handleZoneChange} required />
                <select style={styles.input} name="type" value={zoneForm.type} onChange={handleZoneChange}>
                  <option value="police_station">Police station</option>
                  <option value="hospital">Hospital</option>
                  <option value="helpline_center">Helpline center</option>
                  <option value="women_shelter">Women's shelter</option>
                  <option value="fire_station">Fire station</option>
                </select>
                <div style={styles.inputRow}>
                  <input style={{ ...styles.input, marginBottom: 0 }} type="text" name="latitude" placeholder="Latitude" value={zoneForm.latitude} onChange={handleZoneChange} required />
                  <input style={{ ...styles.input, marginBottom: 0 }} type="text" name="longitude" placeholder="Longitude" value={zoneForm.longitude} onChange={handleZoneChange} required />
                </div>
                <div style={{ height: '14px' }} />
                <input style={styles.input} type="text" name="address" placeholder="Address" value={zoneForm.address} onChange={handleZoneChange} />
                <input style={styles.input} type="text" name="phone" placeholder="Phone number" value={zoneForm.phone} onChange={handleZoneChange} />
                <button style={styles.addZoneBtn} type="submit">Add safe zone</button>
              </form>
            </div>

            <h3 style={styles.sectionTitle}>Existing zones ({zones.length})</h3>
            {zones.map((zone) => (
              <div key={zone._id} style={styles.card}>
                <p style={styles.userName}>{zone.name}</p>
                <p style={styles.detail}>{zone.type.replace('_', ' ')} &middot; {zone.address}</p>
              </div>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: colors.bg, fontFamily: fontStack },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}`, flexWrap: 'wrap', gap: '12px' },
  brandRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  logoCircle: { width: '30px', height: '30px', borderRadius: '8px', backgroundColor: colors.primary, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: '17px', fontWeight: 700, color: colors.ink },
  navRow: { display: 'flex', alignItems: 'center', gap: '10px' },
  navBtn: { padding: '8px 16px', backgroundColor: colors.primaryLight, color: colors.primaryDark, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  logoutBtn: { padding: '8px 16px', backgroundColor: colors.grayBg, color: colors.ink, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  body: { padding: '28px 24px', maxWidth: '760px', margin: '0 auto' },
  infoBanner: { backgroundColor: colors.successBg, color: colors.success, padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' },
  statsRow: { display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' },
  statCard: { flex: '1 1 130px', backgroundColor: colors.white, padding: '16px', borderRadius: '12px', textAlign: 'center', boxShadow: shadow },
  statNumber: { fontSize: '26px', fontWeight: 700, margin: 0, color: colors.ink },
  statLabel: { fontSize: '12px', color: colors.inkLight, margin: '4px 0 0', fontWeight: 600 },
  tabRow: { display: 'flex', gap: '8px', marginBottom: '20px', flexWrap: 'wrap' },
  tabBtn: { padding: '9px 18px', backgroundColor: colors.white, color: colors.inkLight, border: `1px solid ${colors.border}`, borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  tabBtnActive: { padding: '9px 18px', backgroundColor: colors.ink, color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  emptyState: { backgroundColor: colors.white, borderRadius: '14px', padding: '32px 24px', textAlign: 'center', boxShadow: shadow },
  emptyText: { color: colors.inkLight, fontSize: '14px', margin: 0 },
  card: { background: colors.white, padding: '18px 20px', borderRadius: '14px', boxShadow: shadow, marginBottom: '12px' },
  cardTop: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' },
  badge: { padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' },
  roleBadge: { padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: 700, textTransform: 'capitalize', backgroundColor: colors.grayBg, color: colors.inkLight },
  time: { color: colors.inkLight, fontSize: '12px', fontWeight: 500 },
  strong: { color: colors.ink, fontWeight: 600 },
  detail: { margin: '4px 0', color: colors.inkLight, fontSize: '14px' },
  userName: { fontWeight: 700, margin: '0 0 4px', fontSize: '15px', color: colors.ink },
  deleteBtn: { marginTop: '10px', padding: '7px 14px', backgroundColor: colors.dangerBg, color: colors.danger, border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 700, fontFamily: fontStack },
  formCard: { background: colors.white, padding: '22px', borderRadius: '14px', boxShadow: shadow, marginBottom: '24px' },
  formTitle: { fontSize: '16px', fontWeight: 700, color: colors.ink, margin: '0 0 16px' },
  inputRow: { display: 'flex', gap: '12px' },
  input: { width: '100%', padding: '11px 14px', marginBottom: '14px', borderRadius: '9px', border: `1.5px solid ${colors.border}`, fontSize: '14px', boxSizing: 'border-box', fontFamily: fontStack, outline: 'none' },
  addZoneBtn: { width: '100%', padding: '12px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '9px', fontSize: '14px', cursor: 'pointer', fontWeight: 700, fontFamily: fontStack, marginTop: '4px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: colors.ink, marginBottom: '12px' }
};

export default AdminDashboard;