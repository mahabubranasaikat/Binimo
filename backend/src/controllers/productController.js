const Product = require('../models/Product');

exports.getProducts = (req, res) => {
    Product.findAll((err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching products' });
        res.json(results);
    });
};

exports.createProduct = (req, res) => {
    const productData = {
        user_id: req.user.id,
        title: req.body.title,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        location: req.body.location,
        image_url: req.file ? req.file.path : null
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