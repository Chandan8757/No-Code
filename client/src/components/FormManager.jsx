import React, { useEffect, useState } from "react";
import axios from "axios";
import FormBuilder from "./FormBuilder";
import FormRenderer from "./FormRenderer";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function FormManager() {
  const [forms, setForms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  
  async function fetchForms() {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/forms`);
      setForms(res.data);
    } catch (err) {
      console.error(err);
      alert("Error fetching forms");
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchForms();
  }, []);

  
  async function handleCreate(formData) {
    try {
      await axios.post(`${API}/forms`, formData);
      fetchForms();
      alert("Form created successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to create form");
    }
  }

  
  async function handleUpdate(formId, formData) {
    try {
      await axios.put(`${API}/forms/${formId}`, formData);
      fetchForms();
      alert("Form updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to update form");
    }
  }

  
  async function handleDelete(formId) {
    if (!window.confirm("Are you sure you want to delete this form?")) return;
    try {
      await axios.delete(`${API}/forms/${formId}`);
      fetchForms();
      alert("Form deleted successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to delete form");
    }
  }

  
  async function handleDuplicate(formId) {
    try {
      await axios.post(`${API}/forms/${formId}/duplicate`);
      fetchForms();
      alert("Form duplicated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to duplicate form");
    }
  }

  
  function handlePreview(form) {
    setPreview(form);
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h2>Admin — Form Management</h2>

      
      <div style={{ marginBottom: 24, marginTop: 16 }}>
        <FormBuilder onCreated={handleCreate} />
      </div>

      <hr />
      <h3 style={{ marginTop: 20 }}>Your Forms</h3>
      {loading && <p>Loading forms...</p>}
      {!loading && forms.length === 0 && <p>No forms created yet.</p>}

      <ul style={{ listStyle: "none", padding: 0 }}>
        {forms.map((f) => (
          <li
            key={f._id}
            style={{
              border: "1px solid #ccc",
              borderRadius: 8,
              padding: 16,
              marginBottom: 12,
              background: "#fafafa",
            }}
          >
            <strong>{f.title}</strong>
            <p style={{ fontSize: 14, color: "#555" }}>
              Created: {new Date(f.createdAt).toLocaleString()}
            </p>
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setSelected(f)}>✏️ Edit</button>
              <button
                onClick={() => handleDuplicate(f._id)}
                style={{ marginLeft: 8 }}
              >
                📋 Duplicate
              </button>
              <button
                onClick={() => handlePreview(f)}
                style={{ marginLeft: 8 }}
              >
                👁️ Preview
              </button>
              <button
                onClick={() => handleDelete(f._id)}
                style={{ marginLeft: 8, color: "red" }}
              >
                🗑️ Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      
      {selected && (
        <div
          style={{
            marginTop: 24,
            padding: 16,
            border: "1px solid #ddd",
            borderRadius: 8,
            background: "#fefefe",
          }}
        >
          <h3>Editing: {selected.title}</h3>
          <FormBuilder
            form={selected}
            onCreated={(data) => handleUpdate(selected._id, data)}
          />
          <button
            onClick={() => setSelected(null)}
            style={{ marginTop: 8, background: "#ddd" }}
          >
            Close Editor
          </button>
        </div>
      )}

      
      {preview && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              borderRadius: 8,
              width: "80%",
              maxHeight: "90%",
              overflowY: "auto",
            }}
          >
            <h3>Preview: {preview.title}</h3>
            <FormRenderer form={preview} onSubmit={() => alert("Demo only")} />
            <button
              onClick={() => setPreview(null)}
              style={{ marginTop: 16, background: "#ddd" }}
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
