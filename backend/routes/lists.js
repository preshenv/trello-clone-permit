const express = require('express');
const { checkPermission } = require('../middleware/permissions.js');
const { authMiddleware } = require("../middleware/authMiddleware.js");

const { 
    createList,
    getLists,
    updateList,
    deleteList,
    moveList
} = require('../controllers/listController.js');

const router = express.Router({ mergeParams: true });

router.post('/', authMiddleware, checkPermission('create', 'list'), createList);
router.get('/', authMiddleware, checkPermission('read', 'list'), getLists);
router.put('/:id', authMiddleware, checkPermission('update', 'list'), updateList);
router.delete('/:id', authMiddleware, checkPermission('delete', 'list'), deleteList);
router.put('/:id/move', authMiddleware, checkPermission('update', 'list'), moveList);

module.exports = router; 