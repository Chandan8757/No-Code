const express = require("express");
const router = express.Router();
const Response = require("../models/Response");


router.post("/:formId", async (req, res) => {
  try {
    const formId = req.params.formId;
    const answers = req.body;

    const r = new Response({
      form: formId,
      answers,
      meta: { submittedAt: new Date() },
    });

    await r.save();
    res.json({ ok: true, id: r._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/:formId", async (req, res) => {
  try {
    const responses = await Response.find({ form: req.params.formId })
      .sort({ "meta.submittedAt": -1 })
      .lean();
    res.json(responses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
