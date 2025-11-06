// server/models/Form.js
const mongoose = require("mongoose");

const FieldSchema = new mongoose.Schema({
  id: String,
  type: String,
  label: String,
  required: Boolean,
  placeholder: String,
  options: [String],
  width: String,
  alignment: String,
  order: Number, // ✅ For drag-drop order
});

const LayoutSchema = new mongoose.Schema({
  alignment: { type: String, default: "left" },
  columns: { type: Number, default: 1 },
  spacing: { type: Number, default: 12 },
});

const ThemeSchema = new mongoose.Schema({
  primaryColor: { type: String, default: "#2563eb" },
  backgroundColor: { type: String, default: "#ffffff" },
  textColor: { type: String, default: "#000000" },
  fontFamily: { type: String, default: "Poppins, sans-serif" },
  buttonStyle: { type: String, default: "rounded" },
});

const formSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    fields: { type: [FieldSchema], default: [] },
    layout: { type: LayoutSchema, default: () => ({}) },
    theme: { type: ThemeSchema, default: () => ({}) },
    status: {
      type: String,
      enum: ["draft", "published"],
      default: "draft",
    },
    responses: [
      {
        submittedAt: { type: Date, default: Date.now },
        data: Object,
      },
    ],
  },
  { timestamps: true }
);

// ✅ Export in CommonJS style
module.exports = mongoose.model("Form", formSchema);
