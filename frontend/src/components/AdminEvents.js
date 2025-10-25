import React, { useEffect, useState } from 'react';

const input = { padding:'10px 12px', borderRadius:8, border:'1px solid #e5e7eb', width:'100%' };
const btn = { background:'#507687', color:'#FCFAEE', border:'none', padding:'10px 14px', borderRadius:8, cursor:'pointer' };

export default function AdminEvents({ user }) {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ id:null, title:'', description:'', posterUrl:'', venue:'', startAt:'' });
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState('');

  const load = async () => {
    const res = await fetch('http://localhost:5000/api/events');
    const data = await res.json().catch(()=>[]);
    setItems(Array.isArray(data) ? data : []);
  };
  useEffect(()=>{ load(); }, []);

  const reset = () => { setForm({ id:null, title:'', description:'', posterUrl:'', venue:'', startAt:'' }); setPreview(''); };

  const save = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const body = { title: form.title, description: form.description, posterUrl: form.posterUrl, venue: form.venue, startAt: form.startAt };
      if (form.id) {
        await fetch(`http://localhost:5000/api/events/${form.id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      } else {
        await fetch('http://localhost:5000/api/events', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
      }
      await load();
      reset();
    } finally {
      setLoading(false);
    }
  };

  const edit = (ev) => {
    setForm({ id: ev._id, title: ev.title || '', description: ev.description || '', posterUrl: ev.posterUrl || '', venue: ev.venue || '', startAt: ev.startAt ? ev.startAt.substring(0,16) : '' });
    setPreview(ev.posterUrl || '');
  };

  const pickPoster = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setForm(f=>({ ...f, posterUrl: reader.result })); setPreview(String(reader.result)); };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{display:'grid', gap:16}}>
      <form onSubmit={save} style={{background:'#fff', padding:16, borderRadius:12, boxShadow:'0 6px 14px rgba(0,0,0,0.06)', display:'grid', gap:12}}>
        <h3 style={{margin:0, color:'#384B70'}}>{form.id ? 'Edit Event' : 'Create Event'}</h3>
        <input placeholder="Title" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} style={input} />
        <input placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} style={input} />
        <input placeholder="Poster URL (optional)" value={form.posterUrl} onChange={(e)=>setForm({...form, posterUrl:e.target.value})} style={input} />
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <input type="file" accept="image/*" onChange={pickPoster} />
          {preview && <img src={preview} alt="preview" style={{height:48, borderRadius:6}} />}
        </div>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(200px, 1fr))', gap:12}}>
          <input placeholder="Venue" value={form.venue} onChange={(e)=>setForm({...form, venue:e.target.value})} style={input} />
          <input type="datetime-local" value={form.startAt} onChange={(e)=>setForm({...form, startAt:e.target.value})} style={input} />
        </div>
        <div style={{display:'flex', gap:8, alignItems:'center'}}>
          <button type="submit" disabled={loading} style={btn}>{form.id ? 'Update' : 'Create'}</button>
          {form.id && <button type="button" onClick={reset} style={{...btn, background:'#9CA3AF'}}>Cancel</button>}
          <button type="button" onClick={load} style={{...btn, background:'#384B70'}}>Refresh</button>
        </div>
      </form>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16}}>
        {items.map(ev => (
          <div key={ev._id} style={{background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 6px 14px rgba(0,0,0,0.06)'}}>
            {ev.posterUrl && <img src={ev.posterUrl} alt={ev.title} style={{width:'100%', height:140, objectFit:'cover'}} />}
            <div style={{padding:12, display:'grid', gap:6}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                <strong style={{color:'#384B70'}}>{ev.title}</strong>
                <button onClick={()=>edit(ev)} style={{...btn, padding:'6px 10px'}}>Edit</button>
              </div>
              <div style={{color:'#6B7280', fontSize:14}}>{ev.description}</div>
              <div style={{color:'#507687', fontSize:13}}>📍 {ev.venue} • 🕒 {new Date(ev.startAt).toLocaleString()}</div>
              <div style={{marginTop:6, background:'#F3F4F6', borderRadius:8, padding:8}}>
                <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
                  <div style={{fontWeight:700, color:'#384B70'}}>Interested Roll Numbers</div>
                  <div style={{background:'#507687', color:'#FCFAEE', borderRadius:999, padding:'2px 8px', fontSize:12, fontWeight:700}}>{(ev.interestedRolls?.length||0)}</div>
                </div>
                <div style={{fontSize:13, color:'#374151', marginTop:6}}>
                  {ev.interestedRolls && ev.interestedRolls.length > 0 ? (
                    <ul style={{margin:0, paddingLeft:18}}>
                      {ev.interestedRolls.map((r,idx)=>(<li key={idx}>{r}</li>))}
                    </ul>
                  ) : 'No responses yet'}
                </div>
              </div>
            </div>
          </div>
        ))}
        {items.length === 0 && <div style={{color:'#6B7280'}}>No events yet.</div>}
      </div>
    </div>
  );
}
