// @ts-check
const { Router } = require("express");

const router = Router({
  caseSensitive: true,
  strict: true
});

router.get("/", async (req, res) => {
  res.status(200).send({ success: true });
});

module.exports = router;
