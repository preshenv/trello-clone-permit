const { checkPermission } = require("../middleware/permissions.js");
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

router.get(
  "/:boardId",
  authMiddleware,
  checkPermission("read", "Board"),
  getBoard
);

router.put(
  "/:boardId",
  authMiddleware,
  checkPermission("update", "Board"),
  updateBoard
);

router.delete(
  "/:boardId",
  authMiddleware,
  checkPermission("delete", "Board"),
  deleteBoard
);

router.post(
  "/:boardId/members",
  authMiddleware,
  checkPermission("add_member", "Board"),
  addMember
);

router.get("/", authMiddleware, checkPermission("read", "Board"), getBoards);

module.exports = router;
