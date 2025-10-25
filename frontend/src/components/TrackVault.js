import React, { useEffect, useState } from 'react';

const input = { padding:'10px 12px', borderRadius:8, border:'1px solid #e5e7eb' };
const btn = { background:'#507687', color:'#FCFAEE', padding:'10px 14px', borderRadius:8, border:'none', cursor:'pointer' };

export default function TrackVault() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ type: 'found', title:'', description:'', whereText:'', timeReported:'', category:'other', customCategory:'', imageData:'' });
  const [preview, setPreview] = useState('');

  const load = () => fetch('http://localhost:5000/api/lost-found').then(r=>r.json()).then(setItems).catch(()=>setItems([]));
  useEffect(() => { load(); }, []);

  const pickImg = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => { setForm(prev=>({...prev, imageData: reader.result})); setPreview(reader.result); };
    reader.readAsDataURL(file);
  };

  const submit = async (e) => {
    e.preventDefault();
    const categoryText = (form.category === 'other' && form.customCategory.trim()) ? form.customCategory.trim() : form.category;
    const body = {
      ...form,
      category: categoryText,
      title: form.title || (categoryText ? `${form.type === 'found' ? 'Found' : 'Lost'} ${categoryText}` : ''),
      timeReported: form.timeReported || new Date().toISOString()
    };
    await fetch('http://localhost:5000/api/lost-found', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body) });
    setForm({ type: 'found', title:'', description:'', whereText:'', timeReported:'', category:'other', customCategory:'', imageData:'' });
    setPreview('');
    load();
  };

  return (
    <div style={{display:'grid', gap:16}}>
      <form onSubmit={submit} style={{background:'#fff', padding:16, borderRadius:12, boxShadow:'0 6px 14px rgba(0,0,0,0.06)', display:'grid', gap:12}}>
        <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(180px, 1fr))', gap:12}}>
          <select value={form.type} onChange={(e)=>setForm({...form, type:e.target.value})} style={input}>
            <option value="found">Found</option>
            <option value="lost">Lost</option>
          </select>
          <select value={form.category} onChange={(e)=>setForm({...form, category:e.target.value, customCategory:''})} style={input}>
            <option value="earbuds">Earbuds</option>
            <option value="charger">Charger</option>
            <option value="bag">Bag</option>
            <option value="laptop">Laptop</option>
            <option value="id_card">ID Card</option>
            <option value="other">Other</option>
          </select>
          {form.category === 'other' && (
            <input placeholder="Type the item (e.g., Water bottle)" value={form.customCategory} onChange={(e)=>setForm({...form, customCategory:e.target.value})} style={input} />
          )}
          <input placeholder="Where (e.g., Main Auditorium)" value={form.whereText} onChange={(e)=>setForm({...form, whereText:e.target.value})} style={{...input, flex:1}} />
          <input type="datetime-local" value={form.timeReported} onChange={(e)=>setForm({...form, timeReported:e.target.value})} style={input} />
        </div>
        <input placeholder="Title (e.g., Lost black earbuds)" value={form.title} onChange={(e)=>setForm({...form, title:e.target.value})} style={input} />
        <textarea placeholder="Description" value={form.description} onChange={(e)=>setForm({...form, description:e.target.value})} style={{...input, minHeight:90}} />
        <div style={{display:'flex', alignItems:'center', gap:12}}>
          <input type="file" accept="image/*" onChange={pickImg} />
          {preview && (
            <div style={{width:60, aspectRatio:'1 / 1', background:'#f3f4f6', borderRadius:8, display:'grid', placeItems:'center', overflow:'hidden'}}>
              <img src={preview} alt="preview" style={{width:'100%', height:'100%', objectFit:'contain'}} />
            </div>
          )}
        </div>
        <div>
          <button type="submit" style={btn}>Post</button>
        </div>
      </form>

      <div style={{display:'grid', gridTemplateColumns:'repeat(auto-fit, minmax(260px, 1fr))', gap:16}}>
        {items.map(it => (
          <div key={it._id || it.id} style={{background:'#fff', borderRadius:12, overflow:'hidden', boxShadow:'0 6px 14px rgba(0,0,0,0.06)'}}>
            {it.imageData && (
              <div style={{width:220, height:220, background:'#f3f4f6', borderRadius:12, display:'grid', placeItems:'center', overflow:'hidden', margin:'12px auto 0'}}>
                <img src={it.imageData} alt={it.title} style={{width:'100%', height:'100%', objectFit:'contain'}} />
              </div>
            )}
            <div style={{padding:12}}>
              <div style={{display:'flex', gap:8, alignItems:'center'}}>
                <span style={{padding:'2px 8px', borderRadius:999, background: it.type==='found' ? '#10B981' : '#F59E0B', color:'#fff', fontSize:12, fontWeight:700}}>{it.type.toUpperCase()}</span>
                {it.category && (
                  <span style={{padding:'2px 8px', borderRadius:999, background:'#384B70', color:'#FCFAEE', fontSize:12, fontWeight:700}}>{String(it.category).toUpperCase()}</span>
                )}
                <strong style={{color:'#384B70'}}>{it.title}</strong>
              </div>
              <div style={{color:'#6B7280', fontSize:14, margin:'6px 0'}}>{it.description}</div>
              <div style={{color:'#507687', fontSize:13}}>📍 {it.whereText} • 🕒 {new Date(it.timeReported).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{color:'#6B7280'}}>No posts yet.</div>
      )}
    </div>
  );
}
