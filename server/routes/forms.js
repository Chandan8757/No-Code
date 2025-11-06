const express = require("express");
const { Parser } = require("json2csv");
const Form = require("../models/Form");

const router = express.Router();


router.post("/", async (req, res) => {
  try {
    const form = new Form({
      ...req.body,
      status: req.body.status || "draft",
      createdAt: new Date(),
    });
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    console.error("❌ Error creating form:", err);
    res.status(500).json({ message: "Error creating form" });
  }
});


// ✅ GET ALL FORMS (Admin & Public)
router.get("/", async (req, res) => {
  try {
    const { type } = req.query;
    let filter = {};

    if (type === "public") {
      // For now, show both published and draft (you can change later)
      filter.status = { $in: ["published", "draft"] };
    }

    const forms = await Form.find(filter).sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching forms" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    console.error("❌ Error fetching form:", err);
    res.status(500).json({ message: "Error fetching form" });
  }
});
router.put("/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    console.error("❌ Error updating form:", err);
    res.status(500).json({ message: "Error updating form" });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Form.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Form not found" });
    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting form:", err);
    res.status(500).json({ message: "Error deleting form" });
  }
});


router.post("/:id/duplicate", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    const duplicate = new Form({
      title: `${form.title} (Copy)`,
      fields: form.fields,
      status: "draft",
      createdAt: new Date(),
    });

    await duplicate.save();
    res.status(201).json(duplicate);
  } catch (err) {
    console.error("❌ Error duplicating form:", err);
    res.status(500).json({ message: "Error duplicating form" });
  }
});


router.put("/:id/status", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    form.status = req.body.status || "draft";
    await form.save();
    res.json(form);
  } catch (err) {
    console.error("❌ Error updating status:", err);
    res.status(500).json({ message: "Error updating form status" });
  }
});


router.post("/:id/responses", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    form.responses.push({
      submittedAt: new Date(),
      data: req.body,
    });

    await form.save();
    res.json({ message: "Response submitted successfully!" });
  } catch (err) {
    console.error("❌ Error submitting response:", err);
    res.status(500).json({ message: "Error submitting response" });
  }
});


router.get("/:id/export", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    if (!form.responses || form.responses.length === 0)
      return res.status(400).json({ message: "No responses to export" }
