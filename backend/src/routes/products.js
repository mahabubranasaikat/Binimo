const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.get('/', (req, res, next) => {
    if (req.query.status) {
        require('../middleware/auth').authenticateToken(req, res, next);
    } else {
        next();
    }
}, productController.getProducts);
router.get('/:id', productController.getProduct);
router.get('/user/me', authenticateToken, productController.getUserProducts);
router.post('/', authenticateToken, upload.array('images', 10), productController.createProduct);

module.exports = router;