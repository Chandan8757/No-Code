export default function ThemeCustomizer({ theme, setTheme }) {
  return (
    <div className="p-4 border rounded-lg bg-white shadow space-y-3">
      <h3 className="font-semibold text-lg">🎨 Theme Customization</h3>

      <label>Primary Color:</label>
      <input
        type="color"
        value={theme.primaryColor}
        onChange={(e) => setTheme({ ...theme, primaryColor: e.target.value })}
      />

      <label>Background Color:</label>
      <input
        type="color"
        value={theme.backgroundColor}
        onChange={(e) =>
          setTheme({ ...theme, backgroundColor: e.target.value })
        }
      />

      <label>Text Color:</label>
      <input
        type="color"
        value={theme.textColor}
        onChange={(e) => setTheme({ ...theme, textColor: e.target.value })}
      />

      <label>Font Family:</label>
      <select
        className="border p-2 w-full rounded"
        value={theme.fontFamily}
        onChange={(e) => setTheme({ ...theme, fontFamily: e.target.value })}
      >
        <option value="Inter, sans-serif">Inter</option>
        <option value="Poppins">Poppins</option>
        <option value="Roboto">Roboto</option>
        <option value="Open Sans">Open Sans</option>
      </select>
    </div>
  );
}
