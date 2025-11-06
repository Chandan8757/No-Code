import React, { useEffect, useState } from "react";
import axios from "axios";
import FormBuilder from "./components/FormBuilder";
import FormRenderer from "./components/FormRenderer";
import "./style.css";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function App() {
  const [view, setView] = useState("admin");
  const [forms, setForms] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchForms();
  }, []);

  async function fetchForms() {
    try {
      setLoading(true);
      const res = await axios.get(`${API}/forms`);
      setForms(res.data);
    } catch (e) {
      console.error(e);
      showMessage("Error loading forms", "error");
    } finally {
      setLoading(false);
    }
  }

  function showMessage(text, type = "success") {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), 3000);
  }

  async function deleteForm(id) {
    if (!window.confirm("Delete this form?")) return;
    try {
      await axios.delete(`${API}/forms/${id}`);
      showMessage("Form deleted");
      fetchForms();
    } catch (e) {
      showMessage("Delete failed", "error");
    }
  }

  async function duplicateForm(f) {
    try {
      await axios.post(`${API}/forms/${f._id}/duplicate`);
      showMessage("Form duplicated");
      fetchForms();
    } catch (e) {
      showMessage("Duplicate failed", "error");
    }
  }

  async function exportCSV(id) {
    window.open(`${API}/forms/${id}/responses/export`, "_blank");
  }

  async function saveDraft(formData) {
    try {
      await axios.post(`${API}/forms/preview`, formData);
      showMessage("Draft saved!");
      fetchForms();
    } catch (e) {
      showMessage("Failed to save draft", "error");
    }
  }

  async function publishForm(id) {
    try {
      await axios.put(`${API}/forms/${id}/publish`);
      showMessage("Form published successfully!");
      fetchForms();
    } catch (e) {
      showMessage("Failed to publish form", "error");
    }
  }

  const filteredForms = forms.filter((f) =>
    f.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-container">
      <h1 className="title">NoCode Forms — Advanced Dashboard</h1>

      {/* ------------------ Notification ------------------ */}
      {message && (
        <div
          className={`message ${
            message.type === "error" ? "error" : "success"
          }`}
        >
          {message.text}
        </div>
      )}

      {/* ------------------ Navigation ------------------ */}
      <div className="nav-buttons">
        <button
          className={`tab-button ${view === "admin" ? "active" : ""}`}
          onClick={() => {
            setSelected(null);
            setView("admin");
          }}
        >
          Admin
        </button>
        <button
          className={`tab-button ${view === "public" ? "active" : ""}`}
          onClick={() => {
            setSelected(null);
            setView("public");
          }}
        >
          Public
        </button>
      </div>

      {/* ---------------- ADMIN VIEW ---------------- */}
      {view === "admin" && (
        <div>
          <FormBuilder
            onCreated={fetchForms}
            forms={forms}
            onSaveDraft={saveDraft}
          />

          <h3 style={{ marginTop: 20 }}>Your Forms</h3>

          <input
            className="search-input"
            placeholder="Search forms..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          {loading && <p>Loading forms...</p>}
          {!loading && filteredForms.length === 0 && <p>No forms found.</p>}

          <table className="forms-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Status</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredForms.map((f) => (
                <tr key={f._id}>
                  <td>{f.title}</td>
                  <td>
                    {f.status === "published" ? (
                      <span className="status published">🟢 Published</span>
                    ) : (
                      <span className="status draft">🟠 Draft</span>
                    )}
                  </td>
                  <td>{new Date(f.createdAt).toLocaleDateString()}</td>
                  <td>
                    <button onClick={() => setSelected(f)}>Edit</button>
                    <button onClick={() => duplicateForm(f)}>Duplicate</button>
                    <button
                      onClick={() => deleteForm(f._id)}
                      className="danger"
                    >
                      Delete
                    </button>
                    {f.status === "draft" && (
                      <button
                        onClick={() => publishForm(f._id)}
                        className="publish"
                      >
                        Publish
                      </button>
                    )}
                    <button onClick={() => exportCSV(f._id)} className="export">
                      Export CSV
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {selected && (
            <div className="edit-section">
              <h3>Editing: {selected.title}</h3>
              <FormBuilder
                form={selected}
                onCreated={fetchForms}
                onSaveDraft={saveDraft}
              />
            </div>
          )}
        </div>
      )}

      {/* ---------------- PUBLIC VIEW ---------------- */}
      {view === "public" && (
        <div className="public-view">
          <h2>Available Forms</h2>
          {loading && <p>Loading forms...</p>}
          {!loading && forms.length === 0 && (
            <p>No forms yet (create one in Admin tab)</p>
          )}
          <ul className="form-list">
            {forms
              .filter((f) => f.status === "published" || !f.status)
              .map((f) => (
                <li key={f._id} className="form-item">
                  <div>
                    <strong>{f.title}</strong>
                    {f.description && (
                      <p className="form-desc">{f.description}</p>
                    )}
                  </div>
                  <button onClick={() => setSelected(f)}>Open</button>
                </li>
              ))}
          </ul>

          {selected && (
            <div className="form-render-section">
              <h3>Form: {selected.title}</h3>
              <FormRenderer
                form={selected}
                onSubmit={async (values) => {
                  try {
                    await axios.post(
                      `${API}/forms/${selected._id}/responses`,
                      values
                    );
                    showMessage("Response submitted!");
                  } catch (e) {
                    showMessage("Submit failed", "error");
                  }
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
