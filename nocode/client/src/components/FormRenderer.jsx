import React, { useState } from 'react';

export default function FormRenderer({ form, onSubmit }){
  const [values, setValues] = useState({});

  function handleChange(id, v){ setValues(prev => ({...prev, [id]: v})); }

  return (
    <form onSubmit={e=>{ e.preventDefault(); onSubmit(values); }} style={{maxWidth:600}}>
      <h2>{form.title}</h2>
      <p>{form.description}</p>
      {form.fields.map(f => (
        <div key={f.id} style={{marginBottom:12}}>
          <label style={{display:'block', fontWeight:600}}>{f.label}{f.required? ' *' : ''}</label>
          {f.type==='text' && (
            <input value={values[f.id]||''} onChange={e=>handleChange(f.id, e.target.value)} placeholder={f.placeholder||''} />
          )}
          {f.type==='textarea' && (
            <textarea value={values[f.id]||''} onChange={e=>handleChange(f.id, e.target.value)} placeholder={f.placeholder||''} />
          )}
          {f.type==='select' && (
            <select value={values[f.id]||''} onChange={e=>handleChange(f.id, e.target.value)}>
              <option value="">Choose...</option>
              {(f.options||[]).map(o=> <option key={o} value={o}>{o}</option>)}
            </select>
          )}
          {f.type==='checkbox' && (
            <input type="checkbox" checked={!!values[f.id]} onChange={e=>handleChange(f.id, e.target.checked)} />
          )}
          {f.type==='email' && (
            <input type="email" value={values[f.id]||''} onChange={e=>handleChange(f.id, e.target.value)} />
          )}
        </div>
      ))}
      <button type="submit">Submit</button>
    </form>
  )
}
