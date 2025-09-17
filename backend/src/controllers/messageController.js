const Message = require('../models/Message');

exports.sendMessage = (req, res) => {
    const messageData = {
        sender_id: req.user.id,
        receiver_id: req.body.receiver_id,
        message: req.body.message
    };

    Message.create(messageData, (err, result) => {
        if (err) return res.status(500).json({ message: 'Error sending message' });
        res.status(201).json({ message: 'Message sent' });
    });
};

exports.getMessages = (req, res) => {
    Message.findBetweenUsers(req.user.id, req.params.userId, (err, results) => {
        if (err) return res.status(500).json({ message: 'Error fetching messages' });
        res.json(results);
    });
};