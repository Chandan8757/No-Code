import React from "react";

export default function PreviewForm({ form }) {
  const { fields = [], theme = {}, layout = {} } = form;

  const gridTemplate =
    layout.columns === 2 ? "repeat(2, 1fr)" : "repeat(1, 1fr)";

  const styles = {
    backgroundColor: theme.backgroundColor,
    color: theme.textColor,
    fontFamily: theme.fontFamily,
    padding: "24px",
    borderRadius: "12px",
  };

  return (
    <div style={styles}>
      <h2
        style={{
          textAlign: layout.alignment,
          color: theme.primaryColor,
          fontWeight: "600",
        }}
      >
        {form.title || "Untitled Form"}
      </h2>
      <p style={{ textAlign: layout.alignment, marginBottom: 16 }}>
        {form.description || ""}
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: gridTemplate,
          gap: layout.spacing || 12,
        }}
      >
        {fields.map((f) => (
          <div key={f.id}>
            <label
              style={{
                display: "block",
                marginBottom: 4,
                textAlign: f.alignment || "left",
              }}
            >
              {f.label}
              {f.required && <span style={{ color: "red" }}> *</span>}
            </label>

            {f.type === "text" && (
              <input
                type="text"
                placeholder={f.placeholder}
                style={{
                  width: f.width || "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              />
            )}

            {f.type === "textarea" && (
              <textarea
                placeholder={f.placeholder}
                style={{
                  width: f.width || "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              ></textarea>
            )}

            {f.type === "dropdown" && (
              <select
                style={{
                  width: f.width || "100%",
                  padding: "8px",
                  borderRadius: "6px",
                  border: "1px solid #ccc",
                }}
              >
                {f.options?.map((opt, idx) => (
                  <option key={idx}>{opt}</option>
                ))}
              </select>
            )}

            {f.type === "checkbox" &&
              f.options?.map((opt, idx) => (
                <div key={idx}>
                  <input type="checkbox" id={`${f.id}_${idx}`} />
                  <label htmlFor={`${f.id}_${idx}`}> {opt}</label>
                </div>
              ))}

            {f.type === "radio" &&
              f.options?.map((opt, idx) => (
                <div key={idx}>
                  <input type="radio" name={f.id} id={`${f.id}_${idx}`} />
                  <label htmlFor={`${f.id}_${idx}`}> {opt}</label>
                </div>
              ))}
          </div>
        ))}
      </div>

      <button
        style={{
          marginTop: 24,
          backgroundColor: theme.primaryColor,
          color: "#fff",
          border: "none",
          borderRadius:
            theme.buttonStyle === "pill"
              ? "9999px"
              : theme.buttonStyle === "square"
              ? "0px"
              : "8px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Submit
      </button>
    </div>
  );
}
