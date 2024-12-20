// controllers/boardController.js
const Board = require('../models/Board.js');

exports.createBoard = async (req, res) => {
  try {
    const { title, description } = req.body;
    const board = new Board({
      title,
      description,
      owner: req.user.id,
      members: [req.user.id],
    });
    await board.save();
    res.status(201).json(board);
  } catch (error) {
    res.status(500).json({ error: "Failed to create board" });
  }
};

exports.getBoards = async (req, res) => {
  try {
    const boards = await Board.find()
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate({
        path: "lists",
        populate: {
          path: "cards",
          model: "Card",
        },
      })
      .sort({ updatedAt: -1 });

    res.json(boards);
  } catch (error) {
    console.error("Fetch boards error:", error);
    res.status(500).json({ error: "Failed to fetch boards" });
  }
};

exports.getBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId)
      .populate("owner", "name email")
      .populate("members", "name email")
      .populate({
        path: "lists",
        populate: {
          path: "cards",
        },
      });

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    // add permission rbac check
    
    // if (
    //   !board.members.some((member) => member._id.toString() === req.user.id) &&
    //   board.owner._id.toString() !== req.user.id
    // ) {
    //   return res.status(403).json({ error: "Access denied" });
    // }

    res.json(board);
  } catch (error) {
    console.error("Fetch board error:", error);
    res.status(500).json({ error: "Failed to fetch board" });
  }
};

exports.updateBoard = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { title, description, background } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only board owner can update board details" });
    }

    board.title = title || board.title;
    board.description = description || board.description;
    board.background = background || board.background;
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: "Failed to update board" });
  }
};

exports.deleteBoard = async (req, res) => {
  try {
    const board = await Board.findById(req.params.boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only board owner can delete board" });
    }

    await board.deleteOne();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: "Failed to delete board" });
  }
};

exports.addMember = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { userId } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only board owner can add members" });
    }

    if (board.members.includes(userId)) {
      return res.status(400).json({ error: "User is already a member" });
    }

    board.members.push(userId);
    await board.save();

    const updatedBoard = await Board.findById(id).populate(
      "members",
      "name email"
    );

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: "Failed to add member" });
  }
};

exports.removeMember = async (req, res) => {
  try {
    const { boardId, userId } = req.params;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (board.owner.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ error: "Only board owner can remove members" });
    }

    if (userId === board.owner.toString()) {
      return res.status(400).json({ error: "Cannot remove board owner" });
    }

    board.members = board.members.filter(
      (member) => member.toString() !== userId
    );
    await board.save();

    const updatedBoard = await Board.findById(id).populate(
      "members",
      "name email"
    );

    res.json(updatedBoard);
  } catch (error) {
    res.status(500).json({ error: "Failed to remove member" });
  }
};

exports.updateBackground = async (req, res) => {
  try {
    const { boardId } = req.params;
    const { background } = req.body;

    const board = await Board.findById(boardId);
    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (
      !board.members.includes(req.user.id) &&
      board.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    board.background = background;
    await board.save();

    res.json(board);
  } catch (error) {
    res.status(500).json({ error: "Failed to update background" });
  }
};

exports.getBoardActivity = async (req, res) => {
  try {
    const { boardId } = req.params;
    const board = await Board.findById(boardId)
      .populate({
        path: "activity",
        populate: {
          path: "user",
          select: "name email",
        },
      })
      .select("activity");

    if (!board) {
      return res.status(404).json({ error: "Board not found" });
    }

    if (
      !board.members.includes(req.user.id) &&
      board.owner.toString() !== req.user.id
    ) {
      return res.status(403).json({ error: "Access denied" });
    }

    res.json(board.activity);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch board activity" });
  }
};
