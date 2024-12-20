// controllers/cardController.js
const Card = require('../models/Card.js');
const List = require('../models/List.js');
const mongoose = require('mongoose');

// Create a new card
exports.createCard = async (req, res) => {
    try {
        const { title, description } = req.body;
        const { listId } = req.params;
        console.log(listId)
        // Validate listId
        if (!mongoose.Types.ObjectId.isValid(listId)) {
            return res.status(400).json({ error: 'Invalid list ID' });
        }

        // Check if list exists
        const list = await List.findById(listId);
        if (!list) {
            return res.status(404).json({ error: 'List not found' });
        }

        // Get the current highest position
        const position = await Card.countDocuments({ listId });

        // Create the card
        const card = new Card({
            title,
            description,
            listId,
            position
        });

        // Save the card
        const savedCard = await card.save();

        // Update the list with the new card
        await List.findByIdAndUpdate(
            listId,
            { $push: { cards: savedCard._id } }
        );

        // Return the populated card
        const populatedCard = await Card.findById(savedCard._id)
            .populate('listId', 'title');

        res.status(201).json(populatedCard);

    } catch (error) {
        console.error('Create card error:', error); // Log the actual error
        res.status(500).json({ 
            error: 'Failed to create card',
            details: error.message 
        });
    }
};

// Get all cards for a list
exports.getCardsByList = async (req, res) => {
    try {
        const { listId } = req.params;
        const cards = await Card.find({ listId }).sort('position');
        res.json(cards);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cards' });
    }
};

// Get a single card by ID
exports.getCard = async (req, res) => {
    try {
        const card = await Card.findById(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch card' });
    }
};

// Update a card
exports.updateCard = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        
        const card = await Card.findByIdAndUpdate(
            id,
            { ...updates, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update card' });
    }
};

// Delete a card
exports.deleteCard = async (req, res) => {
    try {
        const card = await Card.findByIdAndDelete(req.params.id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        
        // Reorder remaining cards
        await Card.updateMany(
            { 
                listId: card.listId, 
                position: { $gt: card.position } 
            },
            { $inc: { position: -1 } }
        );
        
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete card' });
    }
};

// Move card between lists or reorder within the same list
exports.moveCard = async (req, res) => {
    try {
        const { id } = req.params;
        const { listId, position } = req.body;
        
        const card = await Card.findById(id);
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }

        const oldListId = card.listId;
        const oldPosition = card.position;

        // Update positions in old list
        if (oldListId === listId) {
            // Same list reordering
            if (position > oldPosition) {
                await Card.updateMany(
                    {
                        listId,
                        position: { $gt: oldPosition, $lte: position }
                    },
                    { $inc: { position: -1 } }
                );
            } else {
                await Card.updateMany(
                    {
                        listId,
                        position: { $gte: position, $lt: oldPosition }
                    },
                    { $inc: { position: 1 } }
                );
            }
        } else {
            // Moving to different list
            // Update old list positions
            await Card.updateMany(
                {
                    listId: oldListId,
                    position: { $gt: oldPosition }
                },
                { $inc: { position: -1 } }
            );

            // Update new list positions
            await Card.updateMany(
                {
                    listId,
                    position: { $gte: position }
                },
                { $inc: { position: 1 } }
            );
        }

        // Update the card itself
        card.listId = listId;
        card.position = position;
        await card.save();

        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to move card' });
    }
};

// Update card labels
exports.updateLabels = async (req, res) => {
    try {
        const { id } = req.params;
        const { labels } = req.body;
        
        const card = await Card.findByIdAndUpdate(
            id,
            { labels, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update card labels' });
    }
};

// Update card due date
exports.updateDueDate = async (req, res) => {
    try {
        const { id } = req.params;
        const { dueDate } = req.body;
        
        const card = await Card.findByIdAndUpdate(
            id,
            { dueDate, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!card) {
            return res.status(404).json({ error: 'Card not found' });
        }
        
        res.json(card);
    } catch (error) {
        res.status(500).json({ error: 'Failed to update due date' });
    }
};

// Add other card operations...