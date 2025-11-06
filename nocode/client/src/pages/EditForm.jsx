// src/pages/EditForm.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import CreateForm from "./CreateForm";

const API = import.meta.env.VITE_API_URL || "http://localhost:4000/api";

export default function EditForm({ formId }) {
  const [form, setForm] = useState(null);

  useEffect(() => {
    axios
      .get(`${API}/forms/${formId}`)
      .then((res) => setForm(res.data))
      .catch((e) => console.error(e));
  }, [formId]);

  if (!form) return <p>Loading form...</p>;

  return <CreateForm existingForm={form} />;
}
