const Product = require('../models/Product');

exports.getProducts = (req, res) => {
    const status = req.query.status;
    if (status && req.user && req.user.role === 'admin') {
        Product.findByStatus(status, (err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching products' });
            res.json(results);
        });
    } else {
        Product.findAll((err, results) => {
            if (err) return res.status(500).json({ message: 'Error fetching products' });
            res.json(results);
        });
    }
};

exports.createProduct = (req, res) => {
    // Handle multiple images
    let imageUrls = [];
    if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    }

    const productData = {
        user_id: req.user.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        location: req.body.location,
        image_url: imageUrls.length > 0 ? JSON.stringify(imageUrls) : null,
        condition: req.body.condition
    };

    Product.create(productData, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error creating product' });
        res.status(201).json({ message: 'Product created, pending approval' });
    });
};

exports.getProduct = (req, res) => {
    Product.findById(req.params.id, (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'Product not found' });
        res.json(results[0]);
    });
};

exports.getUserProducts = (req, res) => {
    Product.findByUser(req.user.id, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        res.json(results);
    });
};