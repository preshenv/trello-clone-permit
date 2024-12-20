const { checkPermission } = require("../middleware/permissions.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");
const express = require('express');
const { 
    createCard,
    getCardsByList,
    getCard,
    updateCard,
    deleteCard,
    moveCard,
    updateLabels,
    updateDueDate
} = require('../controllers/cardController.js');

const router = express.Router({ mergeParams: true });

router.post('/', authMiddleware, checkPermission("read", "card"), createCard);
router.get('/',  authMiddleware, checkPermission("read", "card"),getCardsByList);
router.get('/:id',  authMiddleware, checkPermission("read", "card"),getCard);
router.put('/:id',  authMiddleware, checkPermission("update", "card"),updateCard);
router.delete('/:id',  authMiddleware, checkPermission("read", "card"),deleteCard);
router.put('/:id/move', authMiddleware, checkPermission("move", "card"), moveCard);
router.put('/:id/labels',  authMiddleware, checkPermission("update", "card"),updateLabels);
router.put('/:id/due-date', authMiddleware, checkPermission("update", "card"), updateDueDate);

module.exports = router; 