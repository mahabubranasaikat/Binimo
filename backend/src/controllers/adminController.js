const Product = require('../models/Product');
const Report = require('../models/Report');

exports.approveProduct = (req, res) => {
    Product.updateStatus(req.params.id, 'approved', (err, result) => {
        if (err) return res.status(500).json({ message: 'Error approving product' });
        res.json({ message: 'Product approved' });
    });
};

exports.rejectProduct = (req, res) => {
    Product.updateStatus(req.params.id, 'rejected', (err, result) => {
        if (err) return res.status(500).json({ message: 'Error rejecting product' });
        res.json({ message: 'Product rejected' });
    });
};

exports.getReports = (req, res) => {
    Report.findAll((err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching reports' });
        res.json(results);
    });
};

exports.handleReport = (req, res) => {
    Report.updateStatus(req.params.id, 'handled', (err, result) => {
        if (err) return res.status(500).json({ message: 'Error handling report' });
        res.json({ message: 'Report handled' });
    });
};