import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { colors, shadow, fontStack } from '../theme';

function SafetyProfile() {
  const [form, setForm] = useState({ bloodGroup: '', address: '', medicalNotes: '', age: '', photoUrl: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      const profile = res.data.user.safetyProfile || {};
      setForm({
        bloodGroup: profile.bloodGroup || '',
        address: profile.address || '',
        medicalNotes: profile.medicalNotes || '',
        age: profile.age || '',
        photoUrl: profile.photoUrl || ''
      });
    } catch (err) {
      setMessage('Failed to load profile');
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      await API.put('/users/profile', form);
      setMessage('Safety profile saved');
    } catch (err) {
      setMessage('Failed to save profile');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Safety profile</h1>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.infoBanner}>{message}</div>}

        <div style={styles.formCard}>
          <form onSubmit={handleSave}>
            <label style={styles.label}>Blood group</label>
            <input style={styles.input} type="text" name="bloodGroup" placeholder="e.g. O+" value={form.bloodGroup} onChange={handleChange} />

            <label style={styles.label}>Age</label>
            <input style={styles.input} type="number" name="age" placeholder="e.g. 24" value={form.age} onChange={handleChange} />

            <label style={styles.label}>Home address</label>
            <input style={styles.input} type="text" name="address" placeholder="Your home address" value={form.address} onChange={handleChange} />

            <label style={styles.label}>Medical notes</label>
            <textarea style={styles.textarea} name="medicalNotes" placeholder="Allergies, conditions, medications etc." value={form.medicalNotes} onChange={handleChange} rows={4} />

            <label style={styles.label}>Photo URL (optional)</label>
            <input style={styles.input} type="text" name="photoUrl" placeholder="Link to your photo" value={form.photoUrl} onChange={handleChange} />

            <button style={styles.saveBtn} type="submit">Save profile</button>
          </form>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', backgroundColor: colors.bg, fontFamily: fontStack },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 28px', backgroundColor: colors.white, borderBottom: `1px solid ${colors.border}` },
  headerTitle: { fontSize: '18px', fontWeight: 700, color: colors.ink, margin: 0 },
  backBtn: { padding: '8px 16px', backgroundColor: colors.grayBg, color: colors.ink, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px', fontFamily: fontStack },
  body: { padding: '28px 24px', maxWidth: '520px', margin: '0 auto' },
  infoBanner: { backgroundColor: colors.successBg, color: colors.success, padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' },
  formCard: { background: colors.white, padding: '24px', borderRadius: '14px', boxShadow: shadow },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: colors.ink },
  input: { width: '100%', padding: '11px 14px', marginBottom: '16px', borderRadius: '9px', border: `1.5px solid ${colors.border}`, fontSize: '14px', boxSizing: 'border-box', fontFamily: fontStack, outline: 'none' },
  textarea: { width: '100%', padding: '11px 14px', marginBottom: '16px', borderRadius: '9px', border: `1.5px solid ${colors.border}`, fontSize: '14px', boxSizing: 'border-box', fontFamily: fontStack, outline: 'none', resize: 'vertical' },
  saveBtn: { width: '100%', padding: '13px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '9px', fontSize: '15px', cursor: 'pointer', fontWeight: 700, fontFamily: fontStack, marginTop: '4px' }
};

export default SafetyProfile;