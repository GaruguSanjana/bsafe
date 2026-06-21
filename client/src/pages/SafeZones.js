import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { colors, shadow, fontStack } from '../theme';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png'
});

const typeLabels = {
  police_station: 'Police station',
  hospital: 'Hospital',
  helpline_center: 'Helpline center',
  women_shelter: "Women's shelter",
  fire_station: 'Fire station'
};

function SafeZones() {
  const [zones, setZones] = useState([]);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const center = [12.9716, 77.5946];

  const fetchZones = async () => {
    try {
      const res = await API.get('/safezones');
      setZones(res.data.zones);
    } catch (err) {
      setMessage('Failed to load safe zones');
    }
  };

  useEffect(() => { fetchZones(); }, []);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.headerTitle}>Nearby support &amp; safe zones</h1>
        <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>Back</button>
      </div>

      <div style={styles.body}>
        {message && <div style={styles.infoBanner}>{message}</div>}

        <div style={styles.mapCard}>
          <MapContainer center={center} zoom={13} style={{ height: '340px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
            {zones.map((zone) => (
              <Marker key={zone._id} position={[zone.location.latitude, zone.location.longitude]}>
                <Popup>
                  <strong>{zone.name}</strong><br />
                  {typeLabels[zone.type] || zone.type}<br />
                  {zone.address}<br />
                  {zone.phone ? 'Phone: ' + zone.phone : ''}
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <h3 style={styles.sectionTitle}>All locations ({zones.length})</h3>
        {zones.map((zone) => (
          <div key={zone._id} style={styles.card}>
            <p style={styles.zoneName}>{zone.name}</p>
            <p style={styles.zoneType}>{typeLabels[zone.type] || zone.type}</p>
            <p style={styles.zoneDetail}>{zone.address}</p>
            {zone.phone ? <p style={styles.zoneDetail}>Phone: {zone.phone}</p> : null}
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
  body: { padding: '28px 24px', maxWidth: '640px', margin: '0 auto' },
  infoBanner: { backgroundColor: colors.dangerBg, color: colors.danger, padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontWeight: 600, fontSize: '14px' },
  mapCard: { borderRadius: '14px', overflow: 'hidden', boxShadow: shadow, marginBottom: '24px' },
  sectionTitle: { fontSize: '16px', fontWeight: 700, color: colors.ink, marginBottom: '12px' },
  card: { background: colors.white, padding: '16px 18px', borderRadius: '12px', boxShadow: shadow, marginBottom: '10px' },
  zoneName: { fontWeight: 700, margin: 0, fontSize: '15px', color: colors.ink },
  zoneType: { margin: '4px 0', color: colors.primary, fontSize: '12px', fontWeight: 700, textTransform: 'capitalize' },
  zoneDetail: { margin: '2px 0', color: colors.inkLight, fontSize: '13px' }
};

export default SafeZones;