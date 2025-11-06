// src/pages/CreateForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import FieldEditor from "../components/FormBuilder/FieldEditor";
import LayoutCustomizer from "../components/FormBuilder/LayoutCustomizer";
import ThemeCustomizer from "../components/FormBuilder/ThemeCustomizer";
import PreviewForm from "../components/FormBuilder/PreviewForm";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function CreateForm({ existingForm }) {
  const [form, setForm] = useState(
    existingForm || {
      title: "",
      description: "",
      fields: [],
      layout: { alignment: "left", columns: 1, spacing: 12 },
      theme: {
        primaryColor: "#2563eb",
        backgroundColor: "#ffffff",
        textColor: "#000000",
        fontFamily: "Inter, sans-serif",
        buttonStyle: "rounded",
      },
    }
  );

  const [autoSave, setAutoSave] = useState(false);

  // 🟢 Auto-save whenever form changes (after debounce)
  useEffect(() => {
    if (!autoSave) return;
    const timeout = setTimeout(() => {
      saveForm(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [form]);

  const saveForm = async (silent = false) => {
    try {
      if (form._id) {
        await axios.put(`${API}/forms/${form._id}`, form);
        if (!silent) alert("✅ Form updated!");
      } else {
        const res = await axios.post(`${API}/forms`, form);
        setForm(res.data);
        if (!silent) alert("✅ Form created!");
      }
    } catch (err) {
      console.error(err);
      if (!silent) alert("❌ Save failed");
    }
  };

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="p-4 border rounded-lg bg-white shadow">
          <h3 className="text-lg font-semibold">🧾 Form Details</h3>
          <input
            placeholder="Form Title"
            className="border p-2 w-full rounded mt-2"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            placeholder="Form Description"
            className="border p-2 w-full rounded mt-2"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          ></textarea>
        </div>

        <FieldEditor
          fields={form.fields}
          setFields={(fields) => {
            setForm((prev) => ({ ...prev, fields }));
            setAutoSave(true);
          }}
          onAdd={(f) => {
            setForm((prev) => ({ ...prev, fields: [...prev.fields, f] }));
            setAutoSave(true);
          }}
        />

        <LayoutCustomizer
          layout={form.layout}
          setLayout={(layout) => {
            setForm((prev) => ({ ...prev, layout }));
            setAutoSave(true);
          }}
        />

        <ThemeCustomizer
          theme={form.theme}
          setTheme={(theme) => {
            setForm((prev) => ({ ...prev, theme }));
            setAutoSave(true);
          }}
        />

        <button
          onClick={() => saveForm()}
          className="bg-green-600 text-white px-4 py-2 rounded w-full"
        >
          💾 Save Form
        </button>
      </div>

      <div className="md:col-span-2">
        <h3 className="text-lg font-semibold mb-3">👁️ Live Preview</h3>
        <PreviewForm form={form} />
      </div>
    </div>
  );
}
