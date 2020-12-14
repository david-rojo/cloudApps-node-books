const express = require('express');
const url = require('url');
const mongoose = require('mongoose');

const mongoUrl = "mongodb://localhost:27017/books";

const Schema = mongoose.Schema;

let Book;
let User;
let Comment;

async function dbConnect() {
    
    await mongoose.connect(mongoUrl, {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useFindAndModify: false
    });

    console.log("Connected to Mongo");

    var bookSchema = new mongoose.Schema({
        title: String,
        summary: String,
        author: String,
        publisher: String,
        publicationYear: Number
    });

    Book = mongoose.model('Book', bookSchema);

    var userSchema = new mongoose.Schema({
        nick: { 
            type : String, 
            unique : true
        },
        email: String
    });

    User = mongoose.model('User', userSchema);

    var commentSchema = new mongoose.Schema({
        text: String,
        score: Number,
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        book: {
            type: Schema.Types.ObjectId,
            ref: 'Book',
            required: true
        }
    });

    Comment = mongoose.model('Comment', commentSchema);
}

async function init() {

    await dbConnect();

    await new Book({
        title: "Don Quixote", 
        summary: "Summary of Don Quixote",
		author: "Miguel de Cervantes",
		publisher: "CloudApps Classics",
        publicationYear: 1512
    }).save();

    await new Book({
        title: "The Little Prince", 
        summary: "Summary of The Little Prince",
		author: "Antoine de Saint-Exupéry",
		publisher: "CloudApps Classics",
        publicationYear: 1943
    }).save();

    await new User({
        nick: "david",
        email: "david@urjc.es"
    }).save();

    console.log("Data loading to Mongo completed");
}

const router = express.Router();

function validBook(book) {
    return typeof book.title == 'string'
        && typeof book.summary == 'string'
        && typeof book.author == 'string'
        && typeof book.publisher == 'string'
        && typeof book.publicationYear == 'number';
}

function validUser(user) {
    return typeof user.nick == 'string'
        && typeof user.email == 'string';
}

function validComment(comment) {
    return typeof comment.text == 'string'
        && typeof comment.score == 'number'
        && comment.score >=0 
        && comment.score <=5;
}

function toResponse(document) {

    if (document instanceof Array) {
        return document.map(elem => toResponse(elem));
    } else {
        let response = document.toObject({ versionKey: false });
        response.id = response._id.toString();
        delete response._id;
        delete response.__v;
        return response;
    }
}

function fullUrl(req) {
    const fullUrl = url.format({
        protocol: req.protocol,
        host: req.get('host'),
        pathname: req.originalUrl
    });

    return fullUrl + (fullUrl.endsWith('/') ? '' : '/');
}

router.post('/nodebooks/api/v2/books', async (req, res) => {

    if (!validBook(req.body)) {
        console.log("Invalid book request");
        res.sendStatus(400);
    } else {

        const book = new Book({
            title: req.body.title,
            summary: req.body.summary,
            author: req.body.author,
            publisher: req.body.publisher,
            publicationYear: req.body.publicationYear
        });

        await book.save();

        res.location(fullUrl(req) + book.id);
        res.json(toResponse(book));
    }
});

router.get('/nodebooks/api/v2/books', async (req, res) => {
    const allBooks = await Book.find().select([
            "-summary",
            "-author",
            "-publisher",
            "-publicationYear"])
        .exec();
    res.json(toResponse(allBooks));
});

router.get('/nodebooks/api/v2/books/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("Invalid id");
        return res.sendStatus(400);
    }

    const book = await Book.findById(id);
    if (!book) {
        console.log("book not found");
        res.sendStatus(404);
    } else {
        res.json(toResponse(book));
    }
});

router.delete('/books/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const book = await Book.findById(id);
    if (!book) {
        res.sendStatus(404);
    } else {
        await Book.findByIdAndDelete(id);
        res.json(toResponse(book));
    }
});

router.put('/books/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        return res.sendStatus(400);
    }

    const book = await Book.findById(id);
    if (!book) {
        res.sendStatus(404);
    } else {
        if (!validBook(req.body)) {
            res.sendStatus(400);
        } else {

            book.title = req.body.title;
            book.summary = req.body.summary;
            book.author = req.body.author;
            book.publisher = req.body.publisher;
            book.publicationYear = req.body.publicationYear;

            await book.save();

            res.json(toResponse(book));
        }
    }
});

router.post('/nodebooks/api/v2/books/:id/comments', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("Invalid id");
        return res.sendStatus(400);
    }

    if (!validComment(req.body)) {
        console.log("Invalid comment request");
        res.sendStatus(400);
    } else {

        const book = await Book.findById(req.params.id).exec();
        if (!book) {
            console.log("book not found");
            return res.sendStatus(404);
        }
        const user = await User.findOne({nick: req.body.nick}).exec();
        if (!user) {
            console.log("user not found");
            return res.sendStatus(404);
        }
        const comment = await new Comment({
            user,
            text: req.body.text,
            score: req.body.score,
            book,
        }).save();

        return res.json(toResponse(comment, user));
    }
    
});

router.post('/nodebooks/api/v2/users', async (req, res) => {

    if (!validUser(req.body)) {
        console.log("invalid user request");
        res.sendStatus(400);
    } else {

        const user = new User({
            nick: req.body.nick,
            email: req.body.email
        });

        await user.save();

        res.location(fullUrl(req) + user.id);
        res.json(toResponse(user));
    }
});

router.get('/nodebooks/api/v2/users/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("invalid id");
        return res.sendStatus(400);
    }

    const user = await User.findById(id);
    if (!user) {
        console.log("user not found");
        res.sendStatus(404);
    } else {
        res.json(toResponse(user));
    }
});

router.patch('/nodebooks/api/v2/users/:id', async (req, res) => {
    const id = req.params.id;
    
    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("invalid id");
        return res.sendStatus(400);
    }

    const user = await User.findOneAndUpdate(
        {id: req.params.id},
        {email: req.body.email},
        {new: true}
    ).exec();
    if (!user) {
        console.log("user not found");
        return res.sendStatus(404);
    }
    return res.json(toResponse(user));
});

router.delete('/nodebooks/api/v2/users/:id', async (req, res) => {
    const id = req.params.id;

    if(!mongoose.Types.ObjectId.isValid(id)){
        console.log("invalid id");
        return res.sendStatus(400);
    }

    const user = await User.findById(id);
    if (!user) {
        console.log("user not found");
        res.sendStatus(404);
    } else {
        await User.findByIdAndDelete(id);
        res.json(toResponse(user));
    }
});

module.exports = { router, init }