import React, { useEffect, useMemo, useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, onSnapshot, query, orderBy, serverTimestamp } from 'firebase/firestore';
import { Bell, ShieldAlert, Send } from 'lucide-react';
import { useAris } from '../context/ArisContext';

const NotificationsTab = () => {
  const { currentUser, profile } = useAris();
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMsg, setAdminMsg] = useState({ title: '', body: '', recipientEmail: '' });
  const [notifications, setNotifications] = useState([]);
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!currentUser) return;

    const q = query(collection(db, 'aris_notifications'), orderBy('timestamp', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const notifs = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        const audienceKeys = data.audienceKeys || ['all'];
        const matchesCurrentUser = audienceKeys.includes('all') || (currentUser.email && audienceKeys.includes(currentUser.email));
        if (matchesCurrentUser) {
          notifs.push({ id: doc.id, ...data });
        }
      });
      setNotifications(notifs);
      setErrorMsg('');
    }, (error) => {
      console.error("Error fetching notifications", error);
      setErrorMsg('Could not fetch alerts. You might not have permission.');
    });

    return () => unsubscribe();
  }, [currentUser]);

  const sendAdminNotification = async (e) => {
    e.preventDefault();
    if (!adminMsg.title.trim() || !adminMsg.body.trim()) return;
    
    setIsSending(true);
    try {
      const recipientEmail = adminMsg.recipientEmail.trim().toLowerCase();
      await addDoc(collection(db, 'aris_notifications'), {
        title: adminMsg.title.trim(),
        body: adminMsg.body.trim(),
        timestamp: serverTimestamp(),
        type: 'admin',
        senderEmail: currentUser?.email || profile.email || 'admin',
        audienceKeys: recipientEmail ? [recipientEmail] : ['all'],
        recipientEmail: recipientEmail || 'all',
      });
      setAdminMsg({ title: '', body: '', recipientEmail: '' });
      alert('Notification sent.');
    } catch (error) {
      console.error("Error sending notification", error);
      alert('Failed to send. Check permissions.');
    } finally {
      setIsSending(false);
    }
  };

  const recipientPreview = useMemo(() => {
    return adminMsg.recipientEmail.trim() ? adminMsg.recipientEmail.trim() : 'all students';
  }, [adminMsg.recipientEmail]);

  return (
    <div className="animate-fade-in" style={{ padding: '1.5rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Bell size={24} /> Alerts
        </h1>
        <button 
          onClick={() => setIsAdmin(!isAdmin)}
          className={`btn ${isAdmin ? 'btn-primary' : 'btn-secondary'}`}
          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
        >
          {isAdmin ? 'Exit Admin' : 'Admin Area'}
        </button>
      </div>

      {isAdmin && (
        <form onSubmit={sendAdminNotification} className="card animate-slide-in" style={{ marginBottom: '2rem', border: '1px solid var(--accent-tertiary)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-tertiary)' }}>
            <ShieldAlert size={20} />
            <h3 style={{ fontSize: '1.1rem' }}>Admin Notice Broadcaster</h3>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="email" 
              className="input-field" 
              placeholder="Recipient email or leave blank for all students"
              value={adminMsg.recipientEmail}
              onChange={e => setAdminMsg({...adminMsg, recipientEmail: e.target.value})}
            />
            <input 
              type="text" 
              className="input-field" 
              placeholder="Notification Title"
              value={adminMsg.title}
              onChange={e => setAdminMsg({...adminMsg, title: e.target.value})}
              required
            />
            <textarea 
              className="input-field" 
              placeholder="Message body..."
              style={{ minHeight: '80px', resize: 'vertical' }}
              value={adminMsg.body}
              onChange={e => setAdminMsg({...adminMsg, body: e.target.value})}
              required
            />
            <button type="submit" className="btn btn-primary" disabled={isSending} style={{ background: 'var(--accent-tertiary)' }}>
              <Send size={18} /> {isSending ? 'Sending...' : `Send to ${recipientPreview}`}
            </button>
          </div>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <h3 style={{ marginBottom: '0.5rem', color: 'var(--text-muted)', fontSize: '0.9rem', textTransform: 'uppercase' }}>Recent Alerts</h3>
        
        {errorMsg && (
            <div style={{ padding: '1rem', color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px', fontSize: '0.9rem' }}>
                {errorMsg}
            </div>
        )}

        {notifications.length === 0 && !errorMsg && (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No new notifications.
          </div>
        )}

        {notifications.map(notif => (
          <div key={notif.id} className="card" style={{ padding: '1rem', borderLeft: notif.type === 'admin' ? '4px solid var(--accent-tertiary)' : '4px solid var(--accent-primary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ fontSize: '1.05rem', marginBottom: '0.25rem' }}>{notif.title}</h4>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                {notif.timestamp?.toDate ? notif.timestamp.toDate().toLocaleDateString() : 'Just now'}
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{notif.body}</p>
          </div>
        ))}
      </div>

    </div>
  );
};

export default NotificationsTab;
