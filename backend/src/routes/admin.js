const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticateToken, isAdmin } = require('../middleware/auth');

router.put('/products/:id/approve', authenticateToken, isAdmin, adminController.approveProduct);
router.put('/products/:id/reject', authenticateToken, isAdmin, adminController.rejectProduct);
router.get('/reports', authenticateToken, isAdmin, adminController.getReports);
router.put('/reports/:id/handle', authenticateToken, isAdmin, adminController.handleReport);

module.exports = router;