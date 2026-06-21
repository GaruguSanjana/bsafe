import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import { colors, shadowLg, fontStack } from '../theme';

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'user' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await API.post('/auth/register', form);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.brandRow}>
          <div style={styles.logoCircle}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
              <path d="M12 2 L20 6 V12 C20 17 16.5 20.5 12 22 C7.5 20.5 4 17 4 12 V6 Z" />
            </svg>
          </div>
          <span style={styles.brandName}>BSafe</span>
        </div>

        <h1 style={styles.heading}>Create your account</h1>
        <p style={styles.subheading}>Join the BSafe community for faster emergency support</p>

        {error && <div style={styles.errorBox}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <label style={styles.label}>Full name</label>
          <input style={styles.input} type="text" name="name" placeholder="Your full name" value={form.name} onChange={handleChange} required />

          <label style={styles.label}>Email address</label>
          <input style={styles.input} type="email" name="email" placeholder="you@example.com" value={form.email} onChange={handleChange} required />

          <label style={styles.label}>Password</label>
          <input style={styles.input} type="password" name="password" placeholder="Create a password" value={form.password} onChange={handleChange} required />

          <label style={styles.label}>Phone number</label>
          <input style={styles.input} type="text" name="phone" placeholder="Your phone number" value={form.phone} onChange={handleChange} required />

          <label style={styles.label}>I am registering as</label>
          <select style={styles.input} name="role" value={form.role} onChange={handleChange}>
            <option value="user">A user seeking safety support</option>
            <option value="volunteer">A volunteer responder</option>
          </select>

          <button style={{ ...styles.button, opacity: loading ? 0.7 : 1 }} type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/" style={styles.link}>Sign in</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
    fontFamily: fontStack,
    padding: '20px'
  },
  card: {
    background: colors.white,
    padding: '40px 36px',
    borderRadius: '16px',
    boxShadow: shadowLg,
    width: '400px',
    maxWidth: '100%'
  },
  brandRow: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '32px' },
  logoCircle: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    backgroundColor: colors.primary,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  brandName: { fontSize: '20px', fontWeight: 700, color: colors.ink, letterSpacing: '-0.3px' },
  heading: { fontSize: '24px', fontWeight: 700, color: colors.ink, margin: '0 0 6px' },
  subheading: { fontSize: '14px', color: colors.inkLight, margin: '0 0 28px' },
  errorBox: {
    backgroundColor: colors.dangerBg,
    color: colors.danger,
    padding: '12px 14px',
    borderRadius: '10px',
    fontSize: '13px',
    marginBottom: '18px',
    fontWeight: 500
  },
  label: { display: 'block', fontSize: '13px', fontWeight: 600, color: colors.ink, marginBottom: '6px' },
  input: {
    width: '100%',
    padding: '12px 14px',
    marginBottom: '18px',
    borderRadius: '10px',
    border: `1.5px solid ${colors.border}`,
    fontSize: '15px',
    boxSizing: 'border-box',
    fontFamily: fontStack,
    outline: 'none',
    backgroundColor: colors.white
  },
  button: {
    width: '100%',
    padding: '13px',
    backgroundColor: colors.primary,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    fontFamily: fontStack,
    marginTop: '4px'
  },
  footerText: { textAlign: 'center', marginTop: '24px', fontSize: '14px', color: colors.inkLight },
  link: { color: colors.primary, fontWeight: 600, textDecoration: 'none' }
};

export default Register;