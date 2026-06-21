import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { colors, shadow, fontStack } from '../theme';

function EmergencyContacts() {
  const [contacts, setContacts] = useState([]);
  const [form, setForm] = useState({ name: '', phone: '', relation: '' });
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const res = await API.get('/users/profile');
      setContacts(res.data.user.emergencyContacts || []);
    } catch (err) {
      setMessage('Failed to load contacts');
    }
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await API.post('/users/contacts', form);
      setForm({ name: '', phone: '', relation: '' });
      setMessage('Contact added');
      fetchProfile();
    } catch (err) {
      setMessage('Failed to add contact');
    }
  };

  const handleDelete = async (contactId) => {
    try {
      await API.delete('/users/contacts/' + contactId);
      setMessage('Contact removed');
      fetchProfile();
    } catch (err) {
      setMessage('Failed to remove contact');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Emergency contacts</h1>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.infoBanner}>{message}</div>}

        <div style={styles.formCard}>
          <h3 style={styles.formTitle}>Add a contact</h3>
          <form onSubmit={handleAdd}>
            <input style={styles.input} type="text" name="name" placeholder="Contact name" value={form.name} onChange={handleChange} required />
            <input style={styles.input} type="text" name="phone" placeholder="Phone number" value={form.phone} onChange={handleChange} required />
            <input style={styles.input} type="text" name="relation" placeholder="Relation (e.g. Mother, Friend)" value={form.relation} onChange={handleChange} required />
            <button style={styles.addBtn} type="submit">Add contact</button>
          </form>
        </div>

        <h3 style={styles.sectionTitle}>Your contacts ({contacts.length})</h3>
        {contacts.length === 0 && <div style={styles.emptyState}><p style={styles.emptyText}>No emergency contacts added yet.</p></div>}

        {contacts.map((contact) => (
          <div key={contact._id} style={styles.card}>
            <div>
              <p style={styles.contactName}>{contact.name}</p>
              <p style={styles.contactDetail}>{contact.phone} &middot; {contact.relation}</p>
            </div>
            <button style={styles.deleteBtn} onClick={() => handleDelete(contact._id)}>Remove</button>
          </div>
        ))}
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
  formCard: { background: colors.white, padding: '22px', borderRadius: '14px', boxShadow: shadow, marginBottom: '28px' },
  formTitle: { fontSize: '16px', fontWeight: 700, color: colors.ink, margin: '0 0 16px' },
  input: { width: '100%', padding: '11px 14px', marginBottom: '14px', borderRadius: '9px', border: `1.5px solid ${colors.border}`, fontSize: '14px', boxSizing: 'border-box', fontFamily: fontStack, outline: 'none' },
  addBtn: { width: '100%', padding: '12px', backgroundColor: colors.primary, color: 'white', border: 'none', borderRadius: '9px', fontSize: '14px', cursor: 'pointer', fontWeight: 700, fontFamily: fontStack },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: colors.ink, marginBottom: '12px' },
  emptyState: { backgroundColor: colors.white, borderRadius: '14px', padding: '32px 24px', textAlign: 'center', boxShadow: shadow },
  emptyText: { color: colors.inkLight, fontSize: '14px', margin: 0 },
  card: { background: colors.white, padding: '16px 18px', borderRadius: '12px', boxShadow: shadow, marginBottom: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  contactName: { fontWeight: 700, margin: 0, fontSize: '15px', color: colors.ink },
  contactDetail: { margin: '4px 0 0', color: colors.inkLight, fontSize: '13px' },
  deleteBtn: { padding: '8px 14px', backgroundColor: colors.dangerBg, color: colors.danger, border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 700, fontSize: '13px', fontFamily: fontStack }
};

export default EmergencyContacts;