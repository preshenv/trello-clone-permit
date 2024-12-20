// controllers/listController.js
const List = require('../models/List.js');
const Board = require('../models/Board.js');
const mongoose = require('mongoose');

exports.getLists = async (req, res) => {
    try {
        const { boardId } = req.params;
        const lists = await List.find({ board: boardId })
            .sort('position')
            .populate('cards');
        res.json(lists);
    } catch (error) {
        console.error('Get lists error:', error);
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
};

exports.createList = async (req, res) => {
    try {
        const { title } = req.body;
        const { boardId } = req.params;

        // Validate boardId
        if (!mongoose.Types.ObjectId.isValid(boardId)) {
            return res.status(400).json({ error: 'Invalid board ID' });
        }

        // Check if board exists
        const board = await Board.findById(boardId);
        if (!board) {
            return res.status(404).json({ error: 'Board not found' });
        }

        // Get the current highest position
        const position = await List.countDocuments({ board: boardId });

        // Create the list
        const list = new List({
            title,
            board: boardId,
            position,
            cards: []
        });

        // Save the list
        const savedList = await list.save();

        // Update the board with the new list
        await Board.findByIdAndUpdate(
            boardId,
            { $push: { lists: savedList._id } }
        );

        res.status(201).json(savedList);
    } catch (error) {
        console.error('Create list error:', error);
        res.status(500).json({ error: 'Failed to create list' });
    }
};

exports.getListsByBoard = async (req, res) => {
    try {
        const { boardId } = req.params;
        const lists = await List.find({ board: boardId })
            .sort('position')
            .populate('cards');
        res.json(lists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch lists' });
    }
};

exports.getList = async (req, res) => {
    try {
        const list = await List.findById(req.params.id).populate('cards');
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }
        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch list' });
    }
};

exports.updateList = async (req, res) => {
    try {
        const { id } = req.params;
        const { title } = req.body;
        
        const list = await List.findByIdAndUpdate(
            id,
            { title },
            { new: true }
        );
        
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }
        
        res.json(list);
    } catch (error) {
        console.error('Update list error:', error);
        res.status(500).json({ error: 'Failed to update list' });
    }
};

exports.deleteList = async (req, res) => {
    try {
        const list = await List.findByIdAndDelete(req.params.id);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Update positions of remaining lists
        await List.updateMany(
            { 
                board: list.board, 
                position: { $gt: list.position } 
            },
            { $inc: { position: -1 } }
        );

        // Remove list reference from board
        await Board.findByIdAndUpdate(
            list.board,
            { $pull: { lists: list._id } }
        );

        res.status(204).send();
    } catch (error) {
        console.error('Delete list error:', error);
        res.status(500).json({ error: 'Failed to delete list' });
    }
};

exports.moveList = async (req, res) => {
    try {
        const { id } = req.params;
        const { position: newPosition } = req.body;

        const list = await List.findById(id);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        const oldPosition = list.position;

        if (newPosition > oldPosition) {
            await List.updateMany(
                {
                    board: list.board,
                    position: { $gt: oldPosition, $lte: newPosition }
                },
                { $inc: { position: -1 } }
            );
        } else {
            await List.updateMany(
                {
                    board: list.board,
                    position: { $gte: newPosition, $lt: oldPosition }
                },
                { $inc: { position: 1 } }
            );
        }

        list.position = newPosition;
        await list.save();

        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to move list' });
    }
};

exports.toggleArchive = async (req, res) => {
    try {
        const { id } = req.params;
        const list = await List.findById(id);
        
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        list.archived = !list.archived;
        await list.save();

        res.json(list);
    } catch (error) {
        res.status(500).json({ error: 'Failed to toggle archive status' });
    }
};

exports.getArchivedLists = async (req, res) => {
    try {
        const { boardId } = req.params;
        const lists = await List.find({
            board: boardId,
            archived: true
        }).populate('cards');
        
        res.json(lists);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch archived lists' });
    }
};

// Add other list operations...