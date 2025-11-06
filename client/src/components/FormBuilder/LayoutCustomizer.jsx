export default function LayoutCustomizer({ layout, setLayout }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow space-y-2">
      <h3 className="font-semibold text-lg">🧭 Layout Settings</h3>

      <label>Alignment:</label>
      <select
        className="border p-2 w-full rounded"
        value={layout.alignment}
        onChange={(e) => setLayout({ ...layout, alignment: e.target.value })}
      >
        <option value="left">Left</option>
        <option value="center">Center</option>
        <option value="right">Right</option>
      </select>

      <label>Columns:</label>
      <select
        className="border p-2 w-full rounded"
        value={layout.columns}
        onChange={(e) =>
          setLayout({ ...layout, columns: parseInt(e.target.value) })
        }
      >
        <option value="1">1 Column</option>
        <option value="2">2 Columns</option>
      </select>

      <label>Spacing (px):</label>
      <input
        type="number"
        className="border p-2 w-full rounded"
        value={layout.spacing}
        onChange={(e) =>
          setLayout({ ...layout, spacing: parseInt(e.target.value) })
        }
      />
    </div>
  );
}
