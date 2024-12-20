const { authMiddleware } = require("../middleware/authMiddleware.js");
const {
  getBoard,
  updateBoard,
  deleteBoard,
  addMember,
  getBoards,
} = require("../controllers/boardController.js");

const express = require("express");
const router = express.Router();

router.get("/:boardId", authMiddleware, getBoard);

router.put(
  "/:boardId",
  authMiddleware,
  updateBoard
);

router.delete("/:boardId", authMiddleware, deleteBoard);

router.post(
  "/:boardId/members",
  authMiddleware,
  addMember
);

router.get("/", authMiddleware, getBoards);

module.exports = router;
