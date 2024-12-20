const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const {
  createList,
  getLists,
  updateList,
  deleteList,
  moveList,
} = require("../controllers/listController.js");

const router = express.Router({ mergeParams: true });

router.post("/", authMiddleware, createList);
router.get("/", authMiddleware, getLists);
router.put("/:id", authMiddleware, updateList);
router.delete("/:id", authMiddleware, deleteList);
router.put("/:id/move", authMiddleware, moveList);

module.exports = router;
