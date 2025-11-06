import React, { useState } from 'react';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function makeDefaultField(){
  return { id: 'f_' + Math.random().toString(36).slice(2,9), label: 'Untitled', type: 'text', required: false, placeholder: '' }
}

export default function FormBuilder({ form, onCreated }){
  const [title, setTitle] = useState(form?.title || '');
  const [desc, setDesc] = useState(form?.description || '');
  const [fields, setFields] = useState(form?.fields || []);

  function addField(){ setFields(prev => [...prev, makeDefaultField()]); }
  function updateField(idx, patch){ setFields(prev => prev.map((f,i)=> i===idx ? {...f,...patch} : f)); }
  function removeField(idx){ setFields(prev => prev.filter((_,i)=> i!==idx)); }

  async function save(){
    try{
      const payload = { title, description: desc, fields };
      if(form && form._id){
        await axios.put(`${API}/forms/${form._id}`, payload);
        alert('Updated');
      } else {
        await axios.post(`${API}/forms`, {...payload, slug: title.toLowerCase().replace(/\s+/g,'-') || 'form-'+Date.now() });
        alert('Created');
      }
      onCreated && onCreated();
    }catch(e){ alert('save failed'); console.error(e); }
  }

  return (
    <div style={{border:'1px solid #ddd', padding:12, borderRadius:6}}>
      <h3>{form? 'Edit Form' : 'Create a new form'}</h3>
      <div style={{marginBottom:8}}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Form title" />
      </div>
      <div style={{marginBottom:8}}>
        <input value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Description" />
      </div>
      <div>
        <h4>Fields</h4>
        {fields.map((f,idx)=> (
          <div key={f.id} style={{border:'1px solid #eee', padding:8, marginBottom:6}}>
            <input value={f.label} onChange={e=>updateField(idx,{label:e.target.value})} placeholder="Label" />
            <select value={f.type} onChange={e=>updateField(idx,{type:e.target.value})}>
              <option value="text">Text</option>
              <option value="textarea">Text Area</option>
              <option value="select">Select</option>
              <option value="checkbox">Checkbox</option>
              <option value="radio">Radio</option>
              <option value="email">Email</option>
            </select>
            <label style={{marginLeft:8}}><input type="checkbox" checked={f.required||false} onChange={e=>updateField(idx,{required:e.target.checked})} /> required</label>
            <button onClick={()=>removeField(idx)} style={{marginLeft:8}}>Remove</button>
          </div>
        ))}
        <button onClick={addField}>+ Add field</button>
      </div>
      <div style={{marginTop:10}}>
        <button onClick={save}>Save Form</button>
      </div>
    </div>
  )
}
