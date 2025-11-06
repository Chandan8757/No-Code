const express = require("express");
const { Parser } = require("json2csv");
const Form = require("../models/Form");

const router = express.Router();

/* -------------------- CREATE NEW FORM -------------------- */
router.post("/", async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating form" });
  }
});

/* -------------------- GET ALL FORMS -------------------- */
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find().sort({ createdAt: -1 });
    res.json(forms);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching forms" });
  }
});

/* -------------------- GET SINGLE FORM -------------------- */
router.get("/:id", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching form" });
  }
});

/* -------------------- UPDATE FORM -------------------- */
router.put("/:id", async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!form) return res.status(404).json({ message: "Form not found" });
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating form" });
  }
});

/* -------------------- DELETE FORM -------------------- */
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Form.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Form not found" });
    res.json({ message: "Form deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting form" });
  }
});

/* -------------------- DUPLICATE FORM -------------------- */
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
    console.error(err);
    res.status(500).json({ message: "Error duplicating form" });
  }
});

/* -------------------- TOGGLE PUBLISH STATUS -------------------- */
router.put("/:id/status", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    form.status = req.body.status || "draft";
    await form.save();
    res.json(form);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating form status" });
  }
});

/* -------------------- SUBMIT FORM RESPONSE -------------------- */
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
    console.error(err);
    res.status(500).json({ message: "Error submitting response" });
  }
});

/* -------------------- EXPORT RESPONSES AS CSV -------------------- */
router.get("/:id/export", async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) return res.status(404).json({ message: "Form not found" });

    if (!form.responses || form.responses.length === 0)
      return res.status(400).json({ message: "No responses to export" });

    const fields = Object.keys(form.responses[0].data);
    const csvData = form.responses.map((r) => ({
      submittedAt: r.submittedAt,
      ...r.data,
    }));

    const parser = new Parser({ fields: ["submittedAt", ...fields] });
    const csv = parser.parse(csvData);

    res.header("Content-Type", "text/csv");
    res.attachment(`${form.title.replace(/\s+/g, "_")}_responses.csv`);
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error exporting responses" });
  }
});

module.exports = router;
