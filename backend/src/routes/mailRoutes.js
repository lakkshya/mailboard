const express = require("express");
const router = express.Router();
const {
  validateRecipients,
  sendEmail,
  getInbox,
  getSent,
  markAsRead,
} = require("../controllers/mail/mailController");
const {
  saveDraft,
  getDrafts,
  editDraft,
  sendDraft,
  deleteDraft,
} = require("../controllers/mail/draft/draftController");
const protect = require("../middlewares/authMiddleware"); //middleware to check JWT

router.post("/validate-recipients", protect, validateRecipients);
router.post("/send", protect, sendEmail);
router.get("/inbox", protect, getInbox);
router.get("/sent", protect, getSent);
router.put("/read/:emailId", protect, markAsRead);
router.post("/draft", protect, saveDraft);
router.get("/drafts", protect, getDrafts);
router.put("/draft/:id", protect, editDraft);
router.post("/draft/:id/send", protect, sendDraft);
router.patch("/draft/:id/delete", protect, deleteDraft);

module.exports = router;
