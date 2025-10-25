import React, { useState } from 'react';
import RoleSelect from './components/RoleSelect';
import AuthForm from './components/AuthForm';
import Sidebar from './components/Sidebar';
import Events from './components/Events';
import AdminEvents from './components/AdminEvents';
import TrackVault from './components/TrackVault';
import Feedbacks from './components/Feedbacks';
import VoiceBox from './components/VoiceBox';
import HodComplaints from './components/HodComplaints';

function App() {
  const [screen, setScreen] = useState('role'); // 'role' | 'login' | 'app'
  const [selectedRole, setSelectedRole] = useState(null); // 'student' | 'hod' | 'admin'
  const [user, setUser] = useState(null); // { email, role }
  const [tab, setTab] = useState('events');

  const pickRole = (role) => {
    setSelectedRole(role);
    setScreen('login');
  };

  const onLogin = (userData) => {
    setUser(userData);
    // default tab per role
    if (userData.role === 'admin') setTab('events');
    else if (userData.role === 'hod') setTab('feedbacks');
    else setTab('events');
    setScreen('app');
  };

  const signOut = () => {
    setUser(null);
    setSelectedRole(null);
    setScreen('role');
  };

  if (screen === 'role') {
    return <RoleSelect onPick={pickRole} />;
  }

  if (screen === 'login') {
    return (
      <div>
        <button onClick={() => setScreen('role')} style={{margin:16, background:'transparent', border:'none', color:'#384B70', cursor:'pointer'}}>{'\u2190'} Back</button>
        <AuthForm role={selectedRole || 'student'} onLogin={onLogin} />
      </div>
    );
  }

  // Main app layout with left sidebar
  return (
    <div style={{display: 'flex', minHeight: '100vh', background: '#FCFAEE'}}>
      <Sidebar user={user} tab={tab} setTab={setTab} />
      <div style={{flex: 1, display: 'flex', flexDirection: 'column'}}>
        <header style={{background: '#384B70', color: '#FCFAEE', padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
          <div style={{display:'flex', alignItems:'center', gap:12}}>
            <img src="/pic1.png" alt="KL" loading="eager" decoding="async" onError={(e)=>{ e.currentTarget.style.visibility = 'hidden'; }} style={{width:48, height:48, objectFit:'contain'}} />
            <strong style={{fontSize: 28, lineHeight: 1.1}}>KLH Smart Campus</strong>
          </div>
          <button onClick={signOut} style={{background: '#B8001F', color: '#FCFAEE', border: 'none', padding: '6px 10px', borderRadius: 6, cursor: 'pointer'}}>Sign out</button>
        </header>
        <main style={{padding: 16}}>
          {tab === 'events' && (user?.role === 'admin' ? <AdminEvents user={user} /> : <Events user={user} />)}
          {tab === 'trackvault' && <TrackVault />}
          {tab === 'feedbacks' && <Feedbacks />}
          {tab === 'voice' && <VoiceBox />}
          {tab === 'complaints' && user?.role === 'hod' && <HodComplaints />}
        </main>
      </div>
    </div>
  );
}

export default App;
