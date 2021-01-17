const express = require('express');
const router = express.Router();
const {
    User,
    toResponse,
    isValidEmail
} = require('../models/user.js');
const Book = require('../models/book.js').Book;
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const verifyToken = require('../auth/verifyToken');
const jwt = require('jsonwebtoken');
const authConfig = require('../auth/authConfig');

const INVALID_USER_ID_RESPONSE = {
    "error": "Invalid user id"
};
const USER_NOT_FOUND_RESPONSE = {
    "error": "User not found"
};

router.get('/', async (req, res) => {
    const allUsers = await User.find().exec();
    res.json(toResponse(allUsers));
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(INVALID_USER_ID_RESPONSE);
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send(USER_NOT_FOUND_RESPONSE);
    }

    res.json(toResponse(user));

});

router.post('/', async (req, res) => {

    const result = await User.find({
        username: req.body.username
    }).exec();
    if (result.length > 0) {
        return res.status(409).send({
            "error": "Already exists a user with that username"
        });
    }

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);

    const user = new User({
        username: req.body.username,
        password: hashedPassword,
        email: req.body.email
    });

    try {

        const savedUser = await user.save();
        res.json(toResponse(savedUser));

    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
});

router.patch('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(INVALID_USER_ID_RESPONSE);
    }

    if (!isValidEmail(req.body.email)) {
        return res.status(400).send({
            "error": "Invalid email"
        });
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send(USER_NOT_FOUND_RESPONSE);
    }

    user.email = req.body.email
    const updatedUser = await user.save();
    res.json(toResponse(updatedUser));

});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(INVALID_USER_ID_RESPONSE);
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send(USER_NOT_FOUND_RESPONSE);
    }

    const result = await Book.find({
        "comments": {
            $elemMatch: {
                "user": id
            }
        }
    }).exec();
    if (result.length > 0) {
        return res.status(409).send({
            "error": "Can't delete user because has associated comments"
        });
    }

    await User.findByIdAndDelete(id);

    res.json(toResponse(user));
});

router.get('/:id/comments', async (req, res) => {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).send(INVALID_USER_ID_RESPONSE);
    }

    const user = await User.findById(id);
    if (!user) {
        return res.status(404).send(USER_NOT_FOUND_RESPONSE);
    }

    const userComments = await Book.aggregate([{
            $unwind: "$comments"
        },
        {
            $match: {
                "comments.user": user._id
            }
        },
        {
            $project: {
                "_id": 0,
                "id": "$comments._id",
                "bookId": "$_id",
                "comment": "$comments.comment",
                "score": "$comments.score"
            }
        },
    ]);

    res.json(userComments);

});

router.post('/login', async (req, res) => {

    const user = await User.findOne({
        username: req.body.username
    });

    if (!user) {
        return res.status(404).send('No user found.');
    }

    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
        return res.status(401).send({
            auth: false,
            token: null
        });
    }

    var token = jwt.sign({
        id: user._id
    }, authConfig.secret, {
        expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({
        auth: true,
        token: token
    });

});

router.get('/me', verifyToken, async (req, res, next) => {

    try {
        const token = req.header('Authorization').replace('Bearer ', '')
        const decoded = jwt.verify(token, authConfig.secret)
        const user = await User.findOne({
            _id: decoded._id
        })
        if (!user) {
            throw new Error()
        }
        req.token = token
        req.user = user
        next()
    } catch (e) {
        res.status(401).send({error: 'Please authenticate.'})
    }

});

module.exports = router;