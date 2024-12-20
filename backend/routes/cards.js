const { authMiddleware } = require("../middleware/authMiddleware.js");
const express = require("express");
const {
  createCard,
  getCardsByList,
  getCard,
  updateCard,
  deleteCard,
  moveCard,
  updateLabels,
  updateDueDate,
} = require("../controllers/cardController.js");

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, createCard);
router.get("/", authMiddleware, getCardsByList);
router.get("/:id", authMiddleware, getCard);
router.put("/:id", authMiddleware, updateCard);
router.delete("/:id", authMiddleware, deleteCard);
router.put("/:id/move", authMiddleware, moveCard);
router.put("/:id/labels", authMiddleware, updateLabels);
router.put("/:id/due-date", authMiddleware, updateDueDate);

module.exports = router;
